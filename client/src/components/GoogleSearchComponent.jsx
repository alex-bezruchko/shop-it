import React, { useState, useContext, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { UserContext } from "./UserContext";
import { useDispatch } from 'react-redux';

const GoogleSearchComponent = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const {user} = useContext(UserContext);
  const dispatch = useDispatch();

  const [markers, setMarkers] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
  const [loading, setLoading] = useState(false)
  const [place, setPlace] = useState({
    name: '',
    place_id: '',
    address: '',
    rating: '',
    types: [],
    open_now: '',
    link: '',
    favorite: ''
  });
  const [places, setPlaces] = useState(null);
  const [favPlaces, setFavPlaces] = useState([]);
  

  useEffect(() => {
    axios.get(`/users/user/${user._id}/places`)
        .then(({ data }) => {
            setFavPlaces(data);
            setLoading(true)
        })
        .catch(error => {
            console.log(error);
        });
  }, []);


  const handleSearch = async () => {
    try {
      // Check if all required parameters are provided
      if (!locationName || !zipCode || !googleApiKey) {
        console.error('Missing required parameters', locationName, zipCode, googleApiKey);
        return;
      }
  
      // Fetch places using the provided parameters
      const response = await axios.get(`/places`, {
        params: {
          query: locationName,
          zipCode: zipCode
        }
      });
  
      const data = response.data;
  
      if (data.error) {
        console.error('Error searching:', data.error);
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
      setCenter(locations.length > 0 ? locations[0] : { lat: 0, lng: 0 });
  
      // Update markers on the map
      setMarkers(markerLocations);
      setPlaces(data.places);

    } catch (error) {
      console.error('Error searching:', error);
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
    const matchingLocation = places.find(item => {
        return item.geometry.location.lat === place.lat &&
                item.geometry.location.lng === place.lng;
        });
    const {name, formatted_address, icon, types, rating, place_id, opening_hours, photos } = matchingLocation;
    let newPlace = {
        name,
        address: formatted_address.replace(/,?\s*United\s*States$/, ''),
        rating,
        icon,
        types,
        favorite: isPlaceFavorite(place_id),
        place_id,
        open_now: opening_hours?.open_now || false,
    }
    newPlace.link = photos[0].html_attributions[0];
    setPlace(newPlace)
  }

  async function addPlace(place) {

    let ifFav = isPlaceFavorite(place);
    try {
      const response = await axios.post(`/users/user/${user._id}/places`, { place });
      if (response) {
        dispatch({ type: 'SET_ALERT', payload: {message: response.data.message, alertType: 'primaryGreen'} });
        setPlace(prevValues => ({
          ...prevValues,
          favorite: !prevValues.favorite
        }));
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
        <h1 className='nunito text-3xl text-center mb-3'>Search places</h1>
    
      <div className="mb-4 w-full">
        <input
          type="text"
          placeholder="Location Name"
          className="w-64 p-2 border border-gray-300 rounded mr-2"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Zip Code"
          className="w-32 p-2 border border-gray-300 rounded mr-2"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        <button
          className="primaryBlue mt-2 w-1/3 mx-auto"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>


      <div className="">
        <h1 className='nunito text-3xl text-center'>Location</h1>
        {place && place.place_id &&(
            <div className="w-full flex my-5 flex-col items-center justify-between bg-white rounded-lg shadow-md py-5 px-5 mb-4">
                <div className='flex w-full flex-col'>
                  <div className='flex justify-between'>
                    <h3 className="text-lg lora font-semibold pb-4">{place.name}</h3>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg> */}
                    <div className='flex flex-col items-end'>
                      <span className={`ml-3 text-center border border-2 rounded min-w-[43px] max-h-[43px] p-2 ${
                          place.rating < 3 ? 'border-primaryRed' : 
                          place.rating >= 3 && place.rating <= 4 ? 'border-primaryOrange' : 
                          'border-primaryGreen'
                      }`}>{place.rating}</span>
                    </div>
                  </div>
                  
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className='flex-col'>
                    <p className="text-md nunito">{place.address}</p>
                    <div className="text-md">
                        {place.open_now ? (
                            <div className='flex items-center'>
                                <span className="text-primaryGreen text-lg font-bold nunito pt-1 pr-1">Open</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 primaryGreen">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                {/* <div dangerouslySetInnerHTML={{ __html: place.link }} /> */}
                            </div>
                        ) : (
                            <div className='flex items-center'>
                                <span className="text-primaryRed text-lg font-bold nunito pt-1 pr-1">Closed</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 primaryRed">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                {/* <div dangerouslySetInnerHTML={{ __html: place.link }} /> */}

                            </div>
                        )}
                    </div>
                  </div>

                  <svg onClick={() => addPlace(place)} xmlns="http://www.w3.org/2000/svg" fill={isPlaceFavorite(place) ? '#0fa3b1' : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="min-w-[40px] h-[40px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                      
                </div>
            </div>
        )}
        
      </div>
      <div className="w-full mx-auto h-80">
        {loading && (
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={center}
              zoom={10}
            >
              {markers.map((marker, index) => (
                <Marker key={index} position={marker} onClick={() => handleMarkerClick(marker)}/>
              ))}
            </GoogleMap>
        )}
        
      </div>
    </div>
  );
};

export default GoogleSearchComponent;
