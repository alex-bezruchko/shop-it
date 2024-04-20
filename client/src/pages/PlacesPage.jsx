import { useEffect, useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Pusher from 'pusher-js';
import GoogleSearchComponent from "../components/GoogleSearchComponent";
import FavoritesList from "../components/PlacesList";


// import { connect } from 'react-redux';
// import { setAlert } from '../../src/actions/alertActions';

export default function PlacesPage() {
    const dispatch = useDispatch();
    const { ready, user, setUser } = useContext(UserContext);
    const [fav, setFav] = useState([]);
  
    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = 'find';
    }
    if (!ready) {
        return 'Loading...';
    }
    if (ready && !user) {
        return <Navigate to={'/login'}/>
    }
    // useEffect(() => {
    //     // Initialize Pusher with your Pusher app key
    //     const pusher = new Pusher(`${import.meta.env.VITE_PUSHER_APP_KEY}`, {
    //         cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    //         // encrypted: true // Uncomment if you want to enable encrypted communication
    //     });
    
    //     // Subscribe to private channel for user's pending requests
    //     const channel = pusher.subscribe(`user-${user._id}`);

    //     channel.bind('friend-request', data => {
    //         console.log("Friend request received:", data);
    //         dispatch({ type: 'SET_ALERT', payload: { message: 'You have a friend request', alertType: 'primaryGreen' } });
    //     });
    
    //     // Bind to event for friend request received
    //     channel.bind('sender-request-accepted', data => {
    //         dispatch({ type: 'SET_ALERT', payload: { message: 'You request has been accepted', alertType: 'primaryGreen' } });
    //     });
    //     channel.bind('receiver-request-accepted', data => {
    //         dispatch({ type: 'SET_ALERT', payload: { message: 'Friend added successfully', alertType: 'primaryGreen' } });
    //     });
    //     channel.bind('sender-request-denied', data => {
    //         dispatch({ type: 'SET_ALERT', payload: { message: 'You friend request has been denied', alertType: 'primaryOrange' } });
    //     });
    //     channel.bind('receiver-request-denied', data => {
    //         dispatch({ type: 'SET_ALERT', payload: { message: 'Friend request denied successfully', alertType: 'primaryOrange' } });
    //     });
    
    
    
    
    //     // Clean up subscription when component unmounts
    //     return () => {
    //         channel.unbind(); // Unbind from all events
    //         pusher.unsubscribe(`user-${user._id}`);
    //     };
    // }, [user._id]); // Dependency array to ensure effect runs only once
    function updatePlaces(places) {
        setFav(places)
    }

    
    
    function linkClasses(type=null) {
        let classes = 'w-full nunito text-md items-center flex justify-around sm:justify-evenly py-2 px-2';
        if (type === subpage) {
            classes += ' bg-secondaryBlue rounded';
        }
        return classes
    }
    
    return (
        <div>
             <div className="flex justify-center">
             <nav className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-evenly sm:justify-between mt-8 mb-8">
                    <Link 
                        className={linkClasses('find')}
                        to={'/places/find'}>
                            Find
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </Link>
                    <Link 
                        className={linkClasses('favorites')}
                        to={'/places/favorites'}>
                            Favorites
                            <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(247, 160, 114)" viewBox="0 0 24 24" strokeWidth="1.5" stroke='none' className="min-w-[40px] h-[40px] text-primaryBlue">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                    </Link>
                </nav>
             </div>
             <div className="flex flex-col w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-center sm:justify-center mt-0 mb-1 mx-auto">
                 <div className="w-full">
                     {subpage === 'find' && (
                        <div className="flex flex-col text-center">
                            <GoogleSearchComponent />
                        </div>
                     )}

                    {subpage === 'favorites' && (
                         <div className="flex flex-col text-center">
                            <FavoritesList places={fav}/>
                         </div>
                     )}
                 </div>
             </div>
         </div>
    )

}