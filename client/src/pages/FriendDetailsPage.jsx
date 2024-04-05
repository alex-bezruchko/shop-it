import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from "./../components/UserContext";
import axios from 'axios';
import { useDispatch } from 'react-redux';


export default function FriendDetailPage() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('lists');
  const [favPlaces, setFavPlaces] = useState([]);
  const [friendNotFound, setFriendNotFound] = useState(false);

  const [place, setPlace] = useState({
    name: '',
    place_id: '',
    address: '',
    rating: '',
    types: [],
    link: '',
    favorite: ''
  });
  const dispatch = useDispatch();
  let { friendId } = useParams();
  const [friend, setFriend] = useState({ user: { favoritePlaces: [] }, lists: [] });

  useEffect(() => {
    if (!friendId || friendId == 'null') {
      setFriendNotFound(true);
      return;
    }
      axios.get(`/users/${user._id}/info/${friendId}`).then(({ data }) => {
          if (data) {
            let fetchedFriend = {
              user: data.user,
              lists: data.lists
            }
            setFriend(fetchedFriend);
          }
      }).catch(error => {
          console.log(error);
      });
      axios.get(`/users/user/${user._id}/places`)
        .then(({ data }) => {
            setFavPlaces(data);
        })
        .catch(error => {
            console.log(error);
        });
  }, [friendId, user._id]);

  function isPlaceFavorite(placeClicked) {
    let fav = false;
    let ifFavorite = favPlaces.filter(pl => pl.place_id === placeClicked.place_id);
    if (ifFavorite.length > 0) {
      fav = true;
    } 
    return fav;
  };

  async function togglePlace(place) {

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
          // If favorite, filter 
          let places = favPlaces.filter(pl => pl.place_id !== place.place_id);
          setFavPlaces(places);
          let placeIndex = friend.user.favoritePlaces.find(place => place.place_id === place.place_id);
          let updateFriendVavs = friend.user.favoritePlaces;
          updateFriendVavs[placeIndex].fa
        } else {
          const placeCopy = { ...place };

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

  async function copyList(listId) {
    try {
      const response = await axios.post(`/users/${listId}/copy`, { userId: user._id });
      if (response) {
        dispatch({ type: 'SET_ALERT', payload: {message: response.data.message, alertType: 'primaryGreen'} });
      }
    } catch (error) {
        console.error("Error adding place:", error);
        throw error;
    }
  }

  if (friendNotFound) {
    return <h3 className='text-center nunito text-xl my-6'>No friend has been selected.</h3>;
  }

  return (
   
    <div>
      <div className="tabs flex justify-around">
        <button onClick={() => setActiveTab('lists')} className={activeTab === 'lists' ? 'text-center nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists bg-secondaryBlue' : 'text-center nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists'}>Lists</button>
        <button onClick={() => setActiveTab('places')} className={activeTab === 'places' ? 'text-center nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists bg-secondaryBlue' : 'text-center nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists'}>Places</button>
      </div>
      {activeTab === 'lists' ? (
        friend.lists.length !== 0 ? (
          <div>
            {friend.lists.map(list => (
              <div key={list._id} className="flex w-full justify-between mt-5 ">
                <div className={'flex w-full items-center justify-between bg-white rounded-lg shadow-lg py-2 h-24 px-3 border border-1 border-primaryBlue'}>
                    {/* <div className="flex w-full items-center w-full justify-between "> */}
                        <div className="mr-4 flex flex-col justify-between h-full">
                            <h2 className="text-left text-xl lora font-medium">{list.name}</h2>
                            <ul className="flex text-left ">
                                {list.products.slice(0, 3).map((product, idx) => (
                                    <React.Fragment key={idx}>
                                        <li className="nunito text-sm sm:text-xl pr-1">{product.product.name}{idx < 2 && (list.products.length > idx + 1 ? ', ' : '')}</li>
                                    </React.Fragment>
                                ))}
                                {list.products.length > 3 && <li className="nunito text-sm sm:text-xl">...</li>}
                            </ul>
                        </div>
                        <button onClick={() => copyList(list._id)} className="text-primaryRed ml-4 self-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-primaryGreen">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    {/* </div>                  */}
                </div>    
              </div>
            ))}
          </div>
        ) : (
          <h3 className='text-center nunito text-xl my-6'>Your friend has no lists yet.</h3>
        )
      ) : (
        <div>
          <div className="place-list">
            {friend.user.favoritePlaces.length !== 0 ? (
              friend.user.favoritePlaces.map(place => (
                <div key={place.place_id} className="w-full flex my-5 flex-col items-center justify-between bg-white rounded-lg shadow-lg p-3 mb-4 border border-1 border-primaryBlue">
                  <div className='flex w-full flex-col'>
                  <div className='flex justify-between'>
                      <h3 className="text-lg lora font-semibold pb-4">{place.name}</h3>
                    
                      <div className='flex flex-col items-end'>
                      <span className={`ml-3 text-center border border-1 rounded min-w-[43px] max-h-[43px] p-2 ${
                          place.rating < 3 ? 'border-primaryRed' : 
                          place.rating >= 3 && place.rating <= 4 ? 'border-primaryOrange' : 
                          'border-primaryGreen'
                      }`}>{place.rating}</span>
                      </div>
                  </div>
                  
                  </div>
                  <div className="flex w-full justify-between items-end">
                  <div className='flex-col'>
                      <p className="text-md nunito text-left">{place.address}</p>
                  </div>

                  <svg onClick={() => togglePlace(place)} xmlns="http://www.w3.org/2000/svg"  fill={isPlaceFavorite(place) ? '#0fa3b1' : 'none'}  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="min-w-[40px] h-[40px] text-primaryBlue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                      
                  </div>
              </div>
              ))
            ) : (
              <h3 className='text-center nunito text-xl my-8'>Your friend has no places yet.</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
