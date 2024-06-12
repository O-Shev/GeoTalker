import   React, {useEffect, useState} from "react";
import MapContainer from "./components/MapContainer";
import {useMap} from "./context/MapboxContext";
import {useWiretaps} from "./context/WiretapsContext";
import Wiretap from "./components/Wiretap";
import AddGeoChatForm from "./components/form/AddGeoChat/AddGeoChatForm";
import Authorize from "./components/form/UserAccount/Authorize";
import {Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import PopupWiretap from "./components/PopupWiretap";
import {Box} from "@mui/material";


function App() {
    const [initialized, setInitialized] = useState(false);
    const map = useMap();
    const w = useWiretaps();

    useEffect(() => {
        if(map.isInitialized && w.isInitialized){
            map.showLocalities()
            setInitialized(true);
        }
    }, [map.isInitialized, w.isInitialized]);



  return (
    <Box>
        <MapContainer />
        <PopupWiretap />
        {initialized ?
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="wiretap/:id" element={<Wiretap />} />
                    <Route path="addGeoChat"  element={<AddGeoChatForm />} />
                    <Route path="authorize/:variant" element={<Authorize />} />
                    <Route path="*" element={<div>AAAAAAAAAAAAAAAAA 404</div>} />
                </Route>
            </Routes>
            : null
        }
    </Box>
  );
}

export default App;




// useEffect(() => {
//     let l = null;
//     if(feature === 1){
//         l = getLocality(wiretap.localityId);
//
//         map.moveLeft(500);
//         setTimeout(()=>{
//             map.fitBounds(l.boundingBox);
//         },500)
//
//         map.preventHideBoundaries.current=l.osm;
//         map.showBoundaries(l.osm);
//
//     }
//
//     return ()=>{
//         if(l){
//             map.preventHideBoundaries.current=null;
//             map.moveLeft(0);
//             map.hideBoundaries(l.osm)
//         }
//     }
// }, [feature, wiretap]);
// <BrowserRouter>
//     <Routes>
//         <Route path="/" element={<Layout />}>
//             <Route index element={<Home />} />
//             <Route path="blogs" element={<Blogs />} />
//             <Route path="contact" element={<Contact />} />
//             <Route path="*" element={<NoPage />} />
//         </Route>
//     </Routes>
// </BrowserRouter>
// const Feature = () => {
//     switch (feature) {
//         case 1: return <Wiretap wiretap={wiretap} goBack={goBack}/>;
//         case 2: return <AddGeoChatForm close={() => setFeature(0)}/>;
//         case 3: return <Authorize close={() => setFeature(0)}/>;
//         default: return null;
//     }
// }
// <>
//     <MapContainer setWiretapCallback={setWiretapCallback}/>
//     <DrawerWrapper setFeature={setFeature}/>
//     <Feature />
// </>
// T rgb(14,22,33, 0.3)
// const start = performance.now();
// const end = performance.now();
// const timeTaken = end - start;
// console.log(`Time taken: ${timeTaken} milliseconds`);


// const {getBoundaries} = useBoundariesContext();

// const osm_id = "R60199";
// const clickHandler = async () => {
//     const map = mapbox.map;
//
//     if(map.getSource(osm_id)){
//         map.removeLayer(osm_id);
//         map.removeSource(osm_id);
//         return;
//     }
//
//
//     const geojsonData = await getBoundaries(osm_id);
//
//
//     await map.addSource(osm_id, {
//         type: 'geojson',
//         data: geojsonData
//     });
//     await map.addLayer({
//         id: osm_id,
//         type: 'fill',
//         source: osm_id,
//         layout: {},
//         paint: {
//             'fill-color': '#088',
//             'fill-opacity': 0.2
//         }
//     });
// }
