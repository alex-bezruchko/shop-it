import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Pusher from 'pusher-js';

function PendingRequests() {
    const dispatch = useDispatch();
    const { user } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    
    useEffect(() => {
        // Initialize Pusher with your Pusher app key
        const pusher = new Pusher(`${import.meta.env.VITE_PUSHER_APP_KEY}`, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            // encrypted: true // Uncomment if you want to enable encrypted communication
        });
    
        // Subscribe to private channel for user's pending requests
        const channel = pusher.subscribe(`user-${user._id}`);
    
        // Bind to event for friend request received
        channel.bind('friend-request', data => {
            console.log("Friend request received:", data);
            setFriendRequests(prevRequests => [...prevRequests, data.friendRequest]);
            dispatch({ type: 'SET_ALERT', payload: { message: 'You have a friend request', alertType: 'primaryGreen' } });
        });
    
        // Bind to event for friend request accepted
        channel.bind('sender-request-accepted', data => {
            setOutgoingRequests(prevRequests => prevRequests.filter(request => request.receiver._id !== data.sender));
            dispatch({ type: 'SET_ALERT', payload: { message: 'You request has been accepted', alertType: 'primaryGreen' } });
        });
        channel.bind('receiver-request-accepted', data => {
            setFriendRequests(prevRequests => prevRequests.filter(request => request.sender._id !== data.receiver));
            dispatch({ type: 'SET_ALERT', payload: { message: 'Friend added successfully', alertType: 'primaryGreen' } });
        });
        channel.bind('sender-request-denied', data => {
            setOutgoingRequests(prevRequests => prevRequests.filter(request => request.receiver._id !== data.sender));
            dispatch({ type: 'SET_ALERT', payload: { message: 'You friend request has been denied', alertType: 'primaryOrange' } });
        });
        channel.bind('receiver-request-denied', data => {
            setFriendRequests(prevRequests => prevRequests.filter(request => request.sender._id !== data.receiver));
            dispatch({ type: 'SET_ALERT', payload: { message: 'Friend request denied successfully', alertType: 'primaryOrange' } });
        });
    
        // Fetch initial pending requests
        fetchPendingRequests();
    
        // Clean up subscription when component unmounts
        return () => {
            channel.unbind(); // Unbind from all events
            pusher.unsubscribe(`user-${user._id}`);
        };
    }, [user._id]); // Dependency array to ensure effect runs only once
    
    async function fetchPendingRequests() {
        try {
            const response = await axios.get(`/users/${user._id}/pending-requests`);
            const { friendRequests, outgoingRequests } = response.data;
            setFriendRequests(friendRequests);
            setOutgoingRequests(outgoingRequests);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleAcceptRequest(futureFriendId) {
        console.log(user._id)
        console.log(futureFriendId)
        try {
            const response = await axios.post(`/users/accept-request/${user._id}/${futureFriendId}`);
            // setFriendRequests(prevRequests => prevRequests.filter(request => request.sender._id !== data.sender._id));

            // No need to manually update state, it will be updated via Pusher event
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeclineRequest(futureFriendId) {
        try {
            const response = await axios.post(`/users/decline-request/${user._id}/${futureFriendId}`);
            // No need to manually update state, it will be updated via Pusher event
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div >
            <h2 className='text-center lora text-3xl'>Pending Requests</h2>

            <div className="flex flex-col justify-between mt-5">
                {friendRequests?.length !== 0 && (
                    <div className="w-full">
                        <div className="text-xl flex text-center justify-center items-center nunito font-medium my-4 mx-auto">
                            <h3 className='text-center text-2xl flex nunito mr-2'>Incoming</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-primaryGreen w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </div>
                        {friendRequests.map(request => (
                        <div key={request.sender._id} className="flex items-center justify-between bg-white rounded-lg shadow-lg px-3 py-4 mb-4 border border-1 border-primaryBlue">
                            <div className="h-full flex flex-col text-left justify-between">
                                <h3 className="text-left text-lg font-medium lora self-start pb-3">{request.sender.name}</h3>
                                <p className="text-left text-sm nunito">{request.sender.email}</p>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => handleAcceptRequest(request.sender._id)} className="mr-2">
                                    <svg className="primaryBlue text-primaryBlue w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path stroke="0fa3b1" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button onClick={() => handleDeclineRequest(request.sender._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-primaryRed">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
                {outgoingRequests?.length !== 0 && (

                    <div className="w-full">
                        <div className="text-xl flex text-center justify-center items-center nunito font-medium my-4 mx-auto">
                            <h3 className='text-center text-2xl flex nunito mr-2'>Outgoing</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-primaryGreen w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                            </svg>
                        </div>
                        {outgoingRequests.map(request => (
                            <div key={request.receiver._id} className="flex items-center justify-between bg-white rounded-lg shadow-lg px-3 py-4 mb-4 border border-1 border-primaryBlue">
                                <div className="flex flex-col items-center">
                                    <h3 className="text-left text-lg font-medium lora self-start pb-3">{request.receiver.name}</h3>
                                    <p className="text-left text-sm nunito">{request.receiver.email}</p>
                                </div>
                                <div className="flex items-center pr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-primaryGreen w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {friendRequests.length === 0 && outgoingRequests.length === 0 &&(
                    <h2 className="flex text-center text-lg nunito justify-center mt-2 items-center">
                        No pending requests.
                    </h2>
                    
                )}
            </div>
        </div>
    );
}

export default PendingRequests;
