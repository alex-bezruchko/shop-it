import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const GoogleSearchComponent = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
  const [place, setPlace] = useState(null);
  const [places, setPlaces] = useState(null);


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
  
      console.log('Data received from server:', data);
  
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
      setPlaces(data.places)
    } catch (error) {
      console.error('Error searching:', error);
    }
  };
  function handleMarkerClick(place) {
    console.log(place)
    console.log(places)
    const matchingLocation = places.find(item => {
        return item.geometry.location.lat === place.lat &&
                item.geometry.location.lng === place.lng;
        });
    const {name, formatted_address, icon, types, opening_hours } = matchingLocation;
    let newPlace = {
        name,
        address: formatted_address.replace(/,?\s*United\s*States$/, ''),
        icon,
        types,
        open_now: opening_hours.open_now
    }
    console.log('newplace', newPlace)
    setPlace(newPlace)

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
        {place && (
            <div className="w-full flex my-5 flex items-center justify-between bg-white rounded-lg shadow-md py-5 px-5 mb-4">
            
                <div className="flex flex-col justify-between">
                    <h3 className="text-lg lora font-semibold pb-4">{place.name}</h3>
                    <p className="text-md nunito">{place.address}</p>
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
                <img src={place.icon} alt="Place icon" className="w-16 h-16"/>
            </div>
        )}
        
      </div>
      <div className="w-full mx-auto h-80">
        <LoadScript googleMapsApiKey={googleApiKey}>
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={center}
            zoom={10}
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker} onClick={() => handleMarkerClick(marker)}/>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default GoogleSearchComponent;
