import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useBoundaries} from "./BoundariesContext";
import {useWiretaps} from "./WiretapsContext";

const mapboxContext = createContext(null);

export const MapboxProvider = ({ children, options}) => {
  const {getBoundaries} = useBoundaries();
  const {getLocalitiesInUseAsFeatureCollection, getLocality} = useWiretaps();


  const map = useRef(null);
  const mapboxgl = useRef(null);

  //----------------------initialize-------------------
  const [isInitialized, setIsInitialized] = useState(false);
  const onScriptLoad = useMemo(() => {
    return async () => {
      mapboxgl.current = window.mapboxgl;
      mapboxgl.current.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
      map.current = new mapboxgl.current.Map({
        container: 'MapContainer', // container ID
        ...options
      });

      map.current.on('load', async () => {
        setIsInitialized(true);
      })

    };
  }, [options]);
  useEffect(() => {

    let s;
    if (!window.mapboxgl) {
      const s = document.createElement('script');
      s.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
      s.addEventListener('load', onScriptLoad);
      document.body.appendChild(s);

    } else {
      onScriptLoad();
    }

    // Cleanup function to remove the event listener when unmounting
    return () => {
      if (s) {
        s.removeEventListener('load', onScriptLoad);
      }
    };
  }, []);
  //---------------------------------------------------




  //-----------------boundaries------------------------
  const preventHideBoundaries = useRef(null);
  const boundariesOnMap = useRef(new Set());
  const boundariesPending = useRef(new Set());
  const addBoundariesSource = async (osm) =>{
    if(map.current.getSource(osm)) return;
    const source = await getBoundaries(osm);
    if(!source) throw new Error(`can't find boundaries with id: ${osm}`);
    if(map.current.getSource(osm)) return;
    map.current.addSource(osm, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: source
      }
    });
  }
  const addBoundariesLayer = async (osm) => {
    if(map.current.getLayer(osm)) return;
    boundariesOnMap.current.add(osm);
    await map.current.addLayer({
      id: osm,
      type: 'fill',
      source: osm,
      layout: {},
      paint: {
        'fill-color': '#0080ff', // blue color fill
        'fill-opacity': 0.5
      }
    });
  }
  const showBoundaries = async (idOrOsm)=> {
    let osm;
    if(typeof idOrOsm === 'number') {
      osm = getLocality(idOrOsm).osm;
    } else if(typeof idOrOsm === 'string'){
      osm = idOrOsm;
    } else if (Array.isArray(idOrOsm)){
      osm = getLocality(idOrOsm[0]).osm;
    } else throw new Error("showBoundaries: wrong idOrOsm type");

    if(!osm) return;
    if(boundariesOnMap.current.has(osm))   return;
    if(boundariesPending.current.has(osm)) return;
    boundariesPending.current.add(osm);
    try{
      await addBoundariesSource(osm);
      await addBoundariesLayer(osm);
    }
    catch (e) {console.log(e)}
    finally {boundariesPending.current.delete(osm);}
  }
  const hideBoundaries = async (idOrOsm) => {
    let osm;
    if(typeof idOrOsm === 'number') {
      osm = getLocality(idOrOsm).osm;
    } else if(typeof idOrOsm === 'string'){
      osm = idOrOsm;
    } else if (Array.isArray(idOrOsm)){
      osm = getLocality(idOrOsm[0]).osm;
    } else throw new Error("showBoundaries: wrong idOrOsm type");
    if(!osm) return;
    if(preventHideBoundaries.current && preventHideBoundaries.current === osm) return;
    boundariesOnMap.current.delete(osm);
    if(map.current.getLayer(osm)) map.current.removeLayer(osm);
    if(map.current.getSource(osm)) map.current.removeSource(osm);
  }
  //---------------------------------------------------

  //-----------------boundaries-States------------------------

  //----------------------------------------------------------




  //------------------mouseOnLocality------------------
  const currentLocalities = useRef(null);
  const popup = useRef(null);
  const popupWiretapCallback = useRef(null);
  const popupRemoveTimer = useRef(null);
  const popupInitialize = () => {
    const popupLocality = document.getElementById('PopupWiretap');
    popup.current = new mapboxgl.current.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: 'none'
    });
    popup.current.setDOMContent(popupLocality);
    popupLocality.style.display = 'block';

    popup.current.on('open', () => {
      const popupElem = popup.current.getElement();
      popupElem.getElementsByClassName("mapboxgl-popup-content")[0].style.padding="0px";
      popupElem.getElementsByClassName("mapboxgl-popup-content")[0].style.background='rgba(255, 255, 255, 0)';
      // popupElem.getElementsByClassName("mapboxgl-popup-tip")[0].style.opacity='1';
      // popupElem.getElementsByClassName("mapboxgl-popup-tip")[0].style.borderBottomColor='rgba(100, 50, 100)';

      popupWiretapCallback.current && popupWiretapCallback.current(currentLocalities.current);

      popupElem.addEventListener('mouseenter', ()=>{popupRemoveTimer.current && clearTimeout(popupRemoveTimer.current);});
      popupElem.addEventListener('mouseleave', () => popup.current.remove());
    });

    popup.current.on('close', () => {
      popupWiretapCallback.current && popupWiretapCallback.current(null);
    });

  }
  const mouseenterLocality = (e)=> {
    map.current.getCanvas().style.cursor = 'pointer';
    const feature = e.features[0];
    if(feature.properties.cluster){
      if(feature.properties.point_count > 3) return;
      currentLocalities.current = feature.properties.localities.split(",").filter(Boolean).map(Number);
    } else currentLocalities.current = [feature.properties.id];
    popup.current.setLngLat(feature.geometry.coordinates.slice()).addTo(map.current);
  }
  const mouseleaveLocality = () => {
    map.current.getCanvas().style.cursor = '';
    popupRemoveTimer.current && clearTimeout(popupRemoveTimer.current);
    popupRemoveTimer.current = setTimeout(()=>{
      popup.current.remove();
      popupRemoveTimer.current = null;
    }, 200)
  }
  //---------------------------------------------------




  const showLocalities = async () => {
    if (map.current.getSource('localitiesInUse')) return;
    map.current.addSource('localitiesInUse', {
      type: 'geojson',
      data: getLocalitiesInUseAsFeatureCollection(),
      cluster: true,
      clusterRadius: 60,
      clusterProperties: {
        localities: ["concat", ["concat", ["get", "id"], ","]]
      }
    });
    map.current.addLayer({
      id: 'localities',
      type: 'circle',
      source: 'localitiesInUse',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });
    map.current.addLayer({
      id: 'clustered-localities',
      type: 'circle',
      source: 'localitiesInUse',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#51bbd6',
        'circle-radius': 20
      }
    });
    map.current.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'localitiesInUse',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    popupInitialize();
    map.current.on('mouseenter', 'localities', mouseenterLocality);
    map.current.on('mouseleave', 'localities', mouseleaveLocality);
    map.current.on('mouseenter', 'clustered-localities', mouseenterLocality);
    map.current.on('mouseleave', 'clustered-localities', mouseleaveLocality);
  }
  const hideLocalities = async () => {

  }



  const fitBounds = async (bbox)=>{
    map.current.fitBounds(bbox)
  }
  const moveLeft = (padding) => {
    map.current.easeTo({
      padding: {"right": padding},
      duration: 500
    });
  }

  const easeTo = (options) => {
     map.current.easeTo(options);
  }



  return <mapboxContext.Provider value={{
    map,
    isInitialized,
    showBoundaries,
    hideBoundaries,
    fitBounds,
    showLocalities,
    moveLeft,
    hideLocalities,
    preventHideBoundaries,
    easeTo,
    popupLocalityCallback: popupWiretapCallback,

  }}>{children}</mapboxContext.Provider>;
};

export const useMap = () => useContext(mapboxContext);



// const startTime = performance.now();
// const endTime = performance.now();
// console.log('all time:', endTime - startTime, 'milliseconds');

// const addWiretapAsMarker = (wiretap) => {
//   // const marker = new mapboxgl.Marker()
//   //     .setLngLat(wiretap.)
//   //     .setPopup(new mapboxgl.Popup().setHTML('<h6>' + wiretap.chatTitle + '</h6><p>' + 'adress' + '</p>'))
//   //     .addTo(map.current);
//   //
//   // markers.set(wiretap.id, marker);
// }








// ADD CLUSTERS AS MARKERS
// const markers = {}
// let markersOnScreen = {};
// function updateMarkers() {
//   if (!map.current.isSourceLoaded('localitiesInUse')) return;
//   const newMarkers = {};
//   const features = map.current.querySourceFeatures('localitiesInUse');
//
//   for (const feature of features) {
//     const coords = feature.geometry.coordinates;
//     const props = feature.properties;
//     const id = props.cluster ? props.cluster_id : props.id;
//     let marker = markers[id];
//     if (!marker) {
//       const el = document.createElement('div');
//       const root = ReactDOM.createRoot(el);
//       root.render(<MyMarker isCluster={!!props.cluster} localityId={id} cluster_count={props.point_count}/>);
//       marker = markers[id] = new mapboxgl.Marker({element: el}).setLngLat(coords);
//     }
//     newMarkers[id] = marker;
//
//     if (!markersOnScreen[id]) marker.addTo(map.current);
//   }
//
//   for (const id in markersOnScreen) {
//     if (!newMarkers[id]) {
//       markersOnScreen[id].remove();
//     }
//   }
//
//   markersOnScreen = newMarkers;
// }
// const showLocalities = async () => {
//   if (map.current.getSource('localitiesInUse')) return;
//   map.current.addSource('localitiesInUse', {
//     type: 'geojson',
//     data: getLocalitiesInUseAsFeatureCollectionDev(),
//     cluster: true,
//     clusterRadius: 80
//   });
//   // doesn't work without any layer for source
//   map.current.addLayer({
//     'id': 'localitiesInUse-layer',
//     'type': 'circle',
//     'source': 'localitiesInUse',
//     'paint': {'circle-radius': 0}
//   });
//
//   map.current.on('render', updateMarkers);
// }
// const hideLocalities = async () => {
//   if (!map.current.getSource('localitiesInUse')) return;
//   for (const markerId in markers) markers[markerId].remove();
//   map.current.removeLayer('localitiesInUse-layer');
//   map.current.removeSource('localitiesInUse');
//   map.current.off('render', updateMarkers);
// }

// m.loadImage('/telegram-logo.png', (error, image)=>{
//   if (error) throw error;
//   // add image to the active style and make it SDF-enabled
//   m.addImage('telegram-logo', image, { sdf: true });
//
// });