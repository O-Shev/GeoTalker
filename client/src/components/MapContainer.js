import React from "react";

const MapContainer = () => {
  const style = {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1}

  return <div id={'MapContainer'} style={style} />;
};

export default MapContainer;