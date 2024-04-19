import React, { createContext, useEffect, useContext, useReducer } from "react";
import axios from 'axios';
import { UserContext } from './UserContext'; // Import UserContext
import Pusher from 'pusher-js';
import requestReducer, { initialState} from './../reducers/requestReducer';
import { useDispatch } from 'react-redux'; // Import useDispatch from Redux

export const RequestContext = createContext(); // Define the context

export const RequestContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);
  const { user } = useContext(UserContext) || {}; // Get user from UserContext
  const alertDispatch = useDispatch();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(`/users/${user._id}/pending-requests`);
        dispatch({ type: 'FETCH_PENDING_REQUESTS_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_PENDING_REQUESTS_FAILURE', payload: { friendRequests: [], outgoingRequests: []} });
      }
    };
    if (user._id) {
      fetchPendingRequests();
      initializePusher(user._id); // Initialize Pusher here
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);


  function initializePusher(userId) {
    const pusher = new Pusher(`${import.meta.env.VITE_PUSHER_APP_KEY}`, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });
    const channel = pusher.subscribe(`user-${userId}`);

    channel.bind('pusher:subscription_succeeded', () => {
      // console.log('Pusher subscription succeeded');
    });

    channel.bind('pusher:disconnected', () => {
      console.log('Pusher disconnected');
    });

    channel.bind('pusher:connection_established', () => {
      channel.unsubscribe();
      const newChannel = pusher.subscribe(`user-${userId}`);
      localStorage.setItem('channel', newChannel.name);
    });

    channel.bind('sender-request-accepted', data => {
      dispatch({ type: 'SET_NEW_OUTGOING_REQUESTS', payload: data.sender });
      alertDispatch({ type: 'SET_ALERT', payload: { message: 'Your request has been accepted', alertType: 'primaryGreen' } });
    });
    channel.bind('friend-request-submitted', data => {
      dispatch({ type: 'SET_ADD_NEW_OUTGOING_REQUEST', payload: data.outgoingRequest });
      alertDispatch({ type: 'SET_ALERT', payload: { message: 'Your request has been sent', alertType: 'primaryGreen' } });
    });

    channel.bind('receiver-request-accepted', data => {
      dispatch({ type: 'SET_NEW_FRIEND_REQUEST', payload: data.receiver });
      alertDispatch({ type: 'SET_ALERT', payload: { message: 'Friend added successfully', alertType: 'primaryGreen' } });
    });

    channel.bind('sender-request-denied', data => {
      dispatch({ type: 'SET_SENDER_REQUEST_DENIAL', payload: data.sender });
      alertDispatch({ type: 'SET_ALERT', payload: { message: 'Your friend request has been denied', alertType: 'primaryOrange' } });
    });

    channel.bind('receiver-request-denied', data => {
      dispatch({ type: 'SET_RECEIVER_REQUEST_DENIAL', payload: data.receiver });
      alertDispatch({ type: 'SET_ALERT', payload: { message: 'Friend request denied successfully', alertType: 'primaryOrange' } });
    });

    channel.bind('friend-request', data => {
      dispatch({ type: 'SET_FRIEND_REQUEST', payload: data.friendRequest });
      alertDispatch({ type: 'SET_ALERT', payload: { message: 'You received a friend request.', alertType: 'primaryGreen' } });
    });

    localStorage.setItem('pusherConnectionMade', 'true');
    localStorage.setItem('channel', channel.name);
  }


  return (
    <RequestContext.Provider value={state}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => useContext(RequestContext); // Correct export
