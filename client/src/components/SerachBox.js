import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import usePlaceDetails from '../hooks/usePlaceDetails';
import usePlaceAutocomplete from '../hooks/usePlacePredictions';

const SearchBox = ({stylePosition}) => {
  const { query, setQuery, predictions, setPredictions, loadingAutocomplete } = usePlaceAutocomplete();
  const handlePredictionClick = (prediction) =>{
    setPredictions([]);
    console.log(prediction);
  }

  return (
  <>
    <div className="m-3" style={stylePosition}>
      <input
        type="text"
        className="form-control"
        placeholder="Search places..."
        value={query}
        onChange={(event) => {setQuery(event.target.value)}}
      />
      {predictions.length > 0 && (
        <ul className="list-group">
          {predictions.map((prediction, index) => (
            <li key={index} className="list-group-item list-group-item-action" onClick={()=>{handlePredictionClick(prediction)} }>
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  </>
  )
  
}

export default SearchBox;