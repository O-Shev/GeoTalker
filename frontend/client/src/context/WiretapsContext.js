import {createContext, useContext, useEffect, useState} from 'react';
import {fetchWiretapDetails, getInitialLocalities, getInitialWiretaps} from "../api/apiCore";

const WiretapsContext = createContext(null);
export const WiretapsProvider = ({children}) => {
    const [wiretaps] = useState(() => new Map());
    const [localities] = useState(new Map());
    const [localitiesInUse] = useState(new Map())

    const [isInitialized, setIsInitialized] = useState(false);

    const [isInitializedWiretaps, setIsInitializedWiretaps] = useState(false);
    const [isInitializedLocalities, setIsInitializedLocalities] = useState(false);

    const initializeWiretaps = async () => {
        const response = await getInitialWiretaps();
        response.data &&
        Array.isArray(response.data) &&
        response.data.forEach((w) => {
            wiretaps.set(w.id, w);
        })
        setIsInitializedWiretaps(true);
    }
    const initializeLocalities = async () => {
        const response = await getInitialLocalities();
        response.data &&
        Array.isArray(response.data) &&
        response.data.forEach((l) => {
            localities.set(l.id, l);
        })
        setIsInitializedLocalities(true);
    }

    useEffect(() => {
        wiretaps.forEach((value, key)=>{
            if(!localitiesInUse.has(value.localityId)) localitiesInUse.set(value.localityId, new Set());
            localitiesInUse.get(value.localityId).add(key);
        })

        if(isInitializedWiretaps && isInitializedLocalities) setIsInitialized(true);
    }, [isInitializedWiretaps, isInitializedLocalities]);
    useEffect(() => {
        initializeWiretaps();
        initializeLocalities();
    }, []);


    const getLocalitiesInUseAsFeatureCollection = () =>{
        const features = [];
        localitiesInUse.forEach((value, key, map) => {
            features.push({
                type: "Feature",
                properties: {
                    id: key,
                    wiretaps: Array.from(value)
                },
                geometry: {
                    type: "Point",
                    coordinates: getLocality(key).coordinates
                }
            })
        })

        return {
            type: "FeatureCollection",
            features: features
        };
    }

    const getLocality = (id) => {
        return localities.get(id);
    }
    const getWiretapsForLocality = (id) => {
        return Array.from(localitiesInUse.get(id)).map((value, index) => wiretaps.get(value));
    }

    const getWiretapDetails = async (w_id) => {
        const result = await fetchWiretapDetails(w_id);
        return result.data;
    }

    const getWiretap = (w_id) => {
        return wiretaps.get(w_id);
    }


    return (
        <WiretapsContext.Provider value={{
            isInitialized,
            getLocalitiesInUseAsFeatureCollection,
            getLocality,
            getWiretapsForLocality,
            getWiretap,
            getWiretapDetails
        }} >
            {children}
        </WiretapsContext.Provider>
    );
};

export const useWiretaps = () => useContext(WiretapsContext);

// const wiretapTopic = '/client/topic/wiretap';
// const wiretapCallbacks = new Map();
// const [isInitWiretaps, setIsInitWiretaps] = useState(false);
// const [wiretapSubscription, setWiretapSubscription] = useState(null);
//
// const updateWiretapHandler = (w) => {
//     // TODO
//     console.log(w);
//     wiretaps.set(w.id, w);
//     wiretapCallbacks.forEach(callback => callback(w))
// }
//
// const subscribeToWiretapTopic = async () => {
//     const subscription = stomp.client.subscribe(wiretapTopic, updateWiretapHandler);
//     setWiretapSubscription(subscription);
// }
//
// const initializeWiretaps = async () => {
//     if(wiretapSubscription) wiretapSubscription.unsubscribe();
//     const response = await axios.get('client/getInitialWiretaps');
//     response.data &&
//     Array.isArray(response.data) &&
//     response.data.forEach((w) => {
//         wiretaps.set(w.id, w);
//     })
//     setIsInitWiretaps(true);
// }
//
//
// useEffect(() => {
//     if(isInitWiretaps && stomp.isInitialized){
//         subscribeToWiretapTopic()
//             .then(()=>{
//                 setIsInitialized(true)
//             })
//             .catch((error) => {
//                 throw error;
//             });
//     }
// }, [isInitWiretaps, stomp.isInitialized]);
//
// useEffect(() => {
//     initializeWiretaps();
//     return () => {
//         if(wiretapSubscription) wiretapSubscription.unsubscribe();
//     };
// }, []);
//


