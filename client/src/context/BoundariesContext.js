import {createContext, useContext, useRef} from 'react';
import * as topojson from 'topojson-client';
import pako from "pako";
import {fetchBoundaries} from "../api/apiCore";


const BoundariesContext = createContext(null);
export const BoundariesProvider = ({children}) => {
    const boundaries = useRef(new Map());

    const setBoundaries = async (id, topojsonObject) => {
        const compressed = await pako.deflate(JSON.stringify(topojsonObject));
        boundaries.current.set(id, compressed);
    }
    const getBoundaries = async (id) => {
        try {
            let feature;
            if (boundaries.current.has(id)) {
                const unCompressed = pako.inflate(boundaries.current.get(id), {to: "string"});
                feature = topojson.feature(JSON.parse(unCompressed), id)
            } else {
                const response = await fetchBoundaries(id);
                setBoundaries(id, response.data);
                feature = topojson.feature(response.data, id);
            }
            return feature.geometry;
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <BoundariesContext.Provider value={{getBoundaries}} >
            {children}
        </BoundariesContext.Provider>
    );
};

export const useBoundaries = () => useContext(BoundariesContext);
