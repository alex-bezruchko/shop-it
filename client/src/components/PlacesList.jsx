import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "./UserContext";
import { useDispatch } from 'react-redux';

import axios from 'axios';

function FavoritesList() {
    const {user} = useContext(UserContext);
    const [places, setPlaces] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`/users/user/${user._id}/places`)
            .then(({ data }) => {
                setPlaces(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    async function removePlace(place) {
        try {
            const response = await axios.post(`/users/user/${user._id}/places`, { place });
            if (response) {
                dispatch({ type: 'SET_ALERT', payload: {message: response.data.message, alertType: 'primaryGreen'} });
        
                let newPlaces = places.filter(pl => pl.place_id !== place.place_id);
                setPlaces(newPlaces)
            }
          } catch (error) {
              console.error("Error adding place:", error);
              throw error;
          }
    }
    
    return (
        <div className="friend-list">
            <h2 className='text-center nunito text-3xl'>Favorite Places</h2>
            
            <div className="user-list">
                {places.map(place =>
                <div key={place.place_id} className="w-full flex my-5 flex-col items-center justify-between bg-white rounded-lg shadow-md py-5 px-5 mb-4">
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
                    <div className="flex w-full justify-between items-end">
                    <div className='flex-col'>
                        <p className="text-md nunito">{place.address}</p>
                    </div>

                    <svg onClick={() => removePlace(place)} xmlns="http://www.w3.org/2000/svg" fill="#0fa3b1" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="min-w-[40px] h-[40px] text-primaryBlue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                        
                    </div>

                    

                </div>
            )}
            </div>
        </div>
    );
}

export default FavoritesList;

