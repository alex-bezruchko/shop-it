import React, { useState, useContext, useEffect } from 'react';

import { GoogleMap, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { UserContext } from "./UserContext";
import { useDispatch, useSelector } from 'react-redux';
import { Validation } from "../components/Validation";
import ValidationErrorDisplay from "./../components/ValidationErrors";

const GoogleSearchComponent = () => {
  const dispatch = useDispatch();
  const {user} = useContext(UserContext);
  const [favPlaces, setFavPlaces] = useState([]);
  const place = useSelector(state => state.place); // Assuming 'place' is the key for place state in your Redux store
  const [markers, setMarkers] = useState([]);
  const places = useSelector(state => state.places);
  const center = useSelector(state => state.coord);
  const query = useSelector(state => state.query);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`/users/user/${user._id}/places`)
        .then(({ data }) => {
            setFavPlaces(data);
        })
        .catch(error => {
            console.log(error);
        });
      if (!searchPerformed) {
        handleSearch();
        setSearchPerformed(true); // Set searchPerformed to true after the initial search
        setErrors([])
      }
      setLoading(false)

  }, [places, markers]);
  
  const updatePlaces = (newPlaces) => {
    dispatch({
      type: "SET_PLACES",
      payload: { places: newPlaces },
    });
  };
  const setQuery = (newQuery) => {
    console.log('newQuery', newQuery)
    dispatch({
      type: "SET_QUERY",
      payload: newQuery,
    });
  };
  const handleSearch = async () => {
    setErrors([]);
    setLoading(true)
    let {name, zip} = query;
    let body = { name, zip };

    const validationErrors = Validation(body);
    if (validationErrors.length > 0 && searchPerformed === true) {
        setErrors(validationErrors);
        setLoading(false);
    } else {
      try {
        // Check if all required parameters are provided
        if (!name || !zip || !googleApiKey) {
          setErrors([{message: 'Missing fields'}]);
          return;
        }
    
        // Fetch places using the provided parameters
        const response = await axios.get(`/places`, {
          params: {
            query: name,
            zipCode: zip
          }
        });
    
        const data = response.data;
    
        if (data.error) {
          setErrors([{message: data.error}]);
          return;
        }
    
        // Extract locations for markers
        const locations = data.places
          .filter(result => result.geometry && result.geometry.location) // Filter out results without a location
          .map(result => ({
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          }));
    
      
        // Extract marker locations
        const markerLocations = data.markers
          .filter(marker => marker.position) // Filter out markers without a position
          .map(marker => marker.position);
    
        // Update map center to the first location
        dispatch({type: "SET_COORD", payload: locations.length > 0 ? locations[0] : { lat: 0, lng: 0 }});
        // Update markers on the map
        setMarkers(markerLocations)
        const newArray = data.places.map(matchingLocation => {
          const { name, formatted_address, icon, types, rating, place_id, opening_hours, photos, geometry } = matchingLocation;
          const newPlace = {
            name,
            address: formatted_address.replace(/,?\s*United\s*States$/, ''),
            rating,
            icon,
            types,
            favorite: isPlaceFavorite(place_id),
            place_id,
            open_now: opening_hours?.open_now || false,
          };
          if (photos) {
            newPlace.link = photos[0]?.html_attributions[0] || '';
          } else {
            newPlace.link = '';
          }
          newPlace.lat = geometry.location.lat;
          newPlace.lng = geometry.location.lng;
          return newPlace;
        });
        updatePlaces(newArray);

        setErrors([]);
        setLoading(false);
  
      } catch (error) {
        setErrors([{key: 0, message: 'No results'}]);
        setLoading(false);
      }
    }
    setSearchPerformed(true)
    
  };
  const getUserPostalCode = async () => {
    setZipLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
  
      const response = await axios.post('http://localhost:4000/get-postal-code', { latitude, longitude });
      const { postalCode } = response.data;
  
      if (postalCode) {
        setZipLoading(false);
        setQuery({ ...query, zip: postalCode });
      } else {
        setZipLoading(false);
        console.error('Postal code not found');
      }
    } catch (error) {
      setZipLoading(false);
      console.error('Error getting user location:', error);
    }
  };

  function isPlaceFavorite(placeClicked) {
    let fav = false;
    let ifFavorite = favPlaces.filter(pl => pl.place_id === placeClicked.place_id);
    if (ifFavorite.length > 0) {
      fav = true;
    } 
    return fav;
  };

  function handleMarkerClick(place) {
    const matchingLocation = places.places.find(item => {
        return item.lat === place.lat &&
                item.lng === place.lng;
        });
    const {name, address, icon, types, rating, place_id, open_now, lat, lng, photos } = matchingLocation;
    let newPlace = {
        name,
        address: address.replace(/,?\s*United\s*States$/, ''),
        rating,
        icon,
        types,
        favorite: isPlaceFavorite(place_id),
        place_id,
        open_now: open_now || false,
        lat,
        lng
    }
    if (photos) {
      newPlace.link = photos[0]?.html_attributions[0] || '';
    } else {
      newPlace.link = '';
    }
   
    dispatch({type: "SET_PLACE", payload: newPlace}); 
  }

  async function addPlace(place) {
    console.log(place)
    let ifFav = isPlaceFavorite(place);
    console.log('ifFav', ifFav)
    try {
      const response = await axios.post(`/users/user/${user._id}/places`, { place });
      if (response) {
        dispatch({ type: 'SET_ALERT', payload: {message: response.data.message, alertType: 'primaryGreen'} });
        // setPlace(prevValues => ({
        //   ...prevValues,
        //   favorite: !prevValues.favorite
        // }));
        const updatedPlace = { ...place, favorite: !ifFav }; // Assuming you want to toggle the favorite status

        if (ifFav) {
          let places = favPlaces.filter(pl => pl.place_id !== place.place_id);
          setFavPlaces(places)
        } else {
          const placeCopy = { ...place };
          delete placeCopy.favorite;

          // Create a new array by concatenating the existing favPlaces array with the new place object
          const updatedPlaces = [...favPlaces, placeCopy];

          // Update the state with the new array
          setFavPlaces(updatedPlaces);
        }
      }
    } catch (error) {
        console.error("Error adding place:", error);
        throw error;
    }
  }
  return (
    <div>
        <h1 className='lora text-3xl text-center mb-3'>Search places</h1>
        {errors.length > 0 && (
            <ValidationErrorDisplay errors={errors} />
        )}  
          <div className="mb-4 w-full">
            <input
              type="text"
              placeholder="Location Name"
              className="w-64 p-2 border border-gray-300 nunito rounded mr-2 mb-2"
              value={query.name}
              onChange={(e) => setQuery({...query, name: e.target.value})}
              // onChange={(e) => setQuery(prevQuery => ({...prevQuery, name: e.target.value}))}

            />
            <div className="w-full flex items-center">
              <input
                type="text"
                placeholder="Zip Code"
                className="w-full p-2 py-4 border border-gray-300 nunito rounded mr-2 mb-0 h-full"
                value={query.zip}
                onChange={(e) => setQuery({...query, zip: e.target.value})}
                // onChange={(e) => setQuery(prevQuery => ({...prevQuery, name: e.target.value}))}
              />
             
                    <button
                    className="bg-primaryBlue text-white rounded py-1 nunito w-full mx-auto"
                    onClick={() => {
                      getUserPostalCode();
                    }}
                    >
                      {zipLoading ? (
                          <img src="/loading.gif" className='w-4 mx-auto py-1'/>
                      ) : (
                        <span>
                          Use My Location
                        </span>
                      )}
                    </button>
              
                
              </div>
            <button
              className="primaryBlue nunito mt-4 w-full mx-auto"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

        <div className="mt-6">
          <h1 className='lora text-3xl text-center mt-6'>Location</h1>
          {place && place.place_id &&(
              <div className="w-full flex my-5 flex-col items-center justify-between bg-white rounded-lg shadow-lg py-3 px-3 border border-[1.5px] border-primaryBlue mb-4">
                  <div className='flex w-full flex-col'>
                    <div className='flex justify-between'>
                      <h3 className="text-lg lora font-semibold pb-4">{place.name}</h3>
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg> */}
                      <div className='flex flex-col items-end'>
                        <span className={`ml-3 text-center border border-[1.5px] rounded min-w-[43px] max-h-[43px] p-2 ${
                            place.rating < 3 ? 'border-primaryRed' : 
                            place.rating >= 3 && place.rating <= 4 ? 'border-primaryOrange' : 
                            'border-primaryGreen'
                        }`}>{place.rating}</span>
                      </div>
                    </div>
                    
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <div className='flex-col'>
                      <p className="text-md nunito text-left">{place.address}</p>
                      <div className="text-md">
                          {place.open_now ? (
                              <div className='flex items-center'>
                                  <span className="text-primaryGreen text-lg font-bold nunito pt-1 pr-1">Open</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 primaryGreen">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                              </div>
                          ) : (
                              <div className='flex items-center'>
                                  <span className="text-primaryRed text-lg font-bold nunito pt-1 pr-1">Closed</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 primaryRed">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>

                              </div>
                          )}
                      </div>
                    </div>

                    <svg onClick={() => addPlace(place)} xmlns="http://www.w3.org/2000/svg" fill={isPlaceFavorite(place) ? 'rgb(247, 160, 114)' : 'white'} viewBox="0 0 24 24" strokeWidth="1.5" stroke={isPlaceFavorite(place) ? 'none' : 'rgb(247, 160, 114)'} className="min-w-[40px] h-[40px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                        
                  </div>
              </div>
          )}
          
        </div>
        <div className="w-full mx-auto h-80">
          {loading && (
              <img src="/loading.gif" className='w-8 mx-auto my-6'/>
          )} 
          <GoogleMap
            mapContainerClassName="w-full h-full mt-5"
            center={center}
            zoom={10}
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker} onClick={() => handleMarkerClick(marker)}/>
            ))}
          </GoogleMap>
        </div>
    </div>
  );
};

export default GoogleSearchComponent;
