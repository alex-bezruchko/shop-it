import { useEffect, useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import FriendList from "../components/FriendsList";
import PendingRequests from "../components/PendingRequests";
import CurrentFriendsList from "../components/CurrentFriendsList";
import FriendDetailPage from "./FriendDetailsPage";
import Pusher from 'pusher-js';

// import { connect } from 'react-redux';
// import { setAlert } from '../../src/actions/alertActions';

export default function FriendsPage() {
    const [friendId, setFriendId] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { ready, user, setUser } = useContext(UserContext);
    let {subpage} = useParams();
    useEffect(() => {
        // Initialize Pusher with your Pusher app key
        const pusher = new Pusher(`${import.meta.env.VITE_PUSHER_APP_KEY}`, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            // encrypted: true // Uncomment if you want to enable encrypted communication
        });
    
        // Subscribe to private channel for user's pending requests
        const channel = pusher.subscribe(`user-${user._id}`);

        channel.bind('friend-request', data => {
            console.log("Friend request received:", data);
            dispatch({ type: 'SET_ALERT', payload: { message: 'You have a friend request', alertType: 'primaryGreen' } });
        });
    
        // Bind to event for friend request received
        channel.bind('sender-request-accepted', data => {
            dispatch({ type: 'SET_ALERT', payload: { message: 'You request has been accepted', alertType: 'primaryGreen' } });
        });
        channel.bind('receiver-request-accepted', data => {
            dispatch({ type: 'SET_ALERT', payload: { message: 'Friend added successfully', alertType: 'primaryGreen' } });
        });
        channel.bind('sender-request-denied', data => {
            dispatch({ type: 'SET_ALERT', payload: { message: 'You friend request has been denied', alertType: 'primaryOrange' } });
        });
        channel.bind('receiver-request-denied', data => {
            dispatch({ type: 'SET_ALERT', payload: { message: 'Friend request denied successfully', alertType: 'primaryOrange' } });
        });
    
    
    
    
        // Clean up subscription when component unmounts
        return () => {
            channel.unbind(); // Unbind from all events
            pusher.unsubscribe(`user-${user._id}`);
        };
    }, []); // Dependency array to ensure effect runs only once
    
    if (subpage === undefined) {
        subpage = 'find';
    }
    if (!ready) {
        return 'Loading...';
    }
    if (ready && !user) {
        return <Navigate to={'/login'}/>
    }
  
    
    function linkClasses(type=null) {
        let classes = 'w-full nunito text-lg items-center flex justify-around sm:justify-evenly py-2 px-2';
        if (type === subpage) {
            classes += ' bg-secondaryBlue rounded';
        }
        return classes
    }
    
    const handleFriendClick = (id) => {
        setFriendId(id);
        navigate(`/friends/friend/${id}`);

    };
    // async function updateCurrentLink(id) {
    //     setCurrentListLink(id);
    // }
    // if (redirect) {
    //     return <Navigate to={redirect}/>
    // }
        // if (redirect) {
    //     return <Navigate to={redirect}/>
    // }
    return (
        <div>
            {/* <nav className="w-medium flex justify-around mt-16 mb-12">
             */}
             <div className="flex justify-center">
             
                <nav className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-evenly sm:justify-between mt-10 mb-12">
                    <Link 
                        className={linkClasses('find')}
                        to={'/friends/find'}>
                            Find
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </Link>
                    <Link 
                        className={linkClasses('current')}
                        to={'/friends/current'}>
                            Current
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                    </Link>
                    <Link 
                        className={linkClasses('friend')}
                        to={`/friends/friend/${friendId}`}>
                            Friend
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                    </Link>
                    <Link 
                        className={linkClasses('pending')}
                        to={'/friends/pending'}>
                            Requests
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>

                    </Link>
                </nav>
             </div>
             <div className="flex flex-col w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-center sm:justify-center mt-0 mb-1 mx-auto">
                 <div className="w-full">
                     {subpage === 'find' && (
                        <div className="flex flex-col text-center">
                            <FriendList />
                        </div>
                     )}

                    {subpage === 'current' && (
                        <div className="flex flex-col text-center">
                            <CurrentFriendsList handleFriendClick={handleFriendClick} />
                        </div>
                     )}

                    
                     {/* Render FriendDetailPage if subpage is friendId */}
                     {subpage === 'friend' && (
                        <div className="flex flex-col text-center">
                            <FriendDetailPage />
                        </div>
                    )}

                    {subpage === 'pending' && (
                         <div className="flex flex-col text-center">
                            <PendingRequests/>
                         </div>
                     )}
                 </div>
             </div>
         </div>
    )

}