import { useState } from 'react';

const usePlaceDetails = () =>{
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loadingPlaceDetails, setLoadingPlaceDetails] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaceDetails = (osmId) => {
    const apiUrl=`/getPlaceDetails/${osmId}`
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPlaceDetails(data);
        setLoadingPlaceDetails(false);
      })
      .catch((error) => {
        console.error(`Fetch PlaceDetails error: ${error}`);
        setLoadingPlaceDetails(false);
      });
  }
  return { placeDetails, loadingPlaceDetails, error, fetchPlaceDetails };
}

export default usePlaceDetails;