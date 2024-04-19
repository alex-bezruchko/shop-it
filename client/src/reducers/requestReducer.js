export const initialState = {
  requests: {
    friendRequests: [],
    outgoingRequests: [],
  },
};

const requestReducer = (state = initialState, action) => {
  switch (action.type) {
      case "SET_ADD_NEW_OUTGOING_REQUEST":
      const newRequest = action.payload;
      const isDuplicate = state.requests.outgoingRequests.filter(request => request.receiver._id === newRequest.receiver._id).length > 0;
      if (isDuplicate) {
          // If the request is a duplicate, return the current state without modifying it
          return state;
      } else {
          // If the request is not a duplicate, add it to the outgoingRequests array
          const newState = {
              ...state,
              requests: {
                  ...state.requests,
                  outgoingRequests: [...state.requests.outgoingRequests, newRequest],
              },
          };
          return newState;
      }
    
    case "SET_ADD_NEW_FRIEND_REQUEST":
      return {
        ...state,
        requests: {
          ...state.requests,
          friendRequests: state.requests.friendRequests.filter(
            request => request.sender._id !== action.payload
          ),
        },
      };
    
    case "SET_FRIEND_REQUEST_RECEIVED":
      const newFriendRequest = action.payload;
      const isDuplicateFriend = state.requests.friendRequests.filter(request => request.sender._id === newFriendRequest.sender._id).length > 0;
      if (isDuplicateFriend) {
          // If the request is a duplicate, return the current state without modifying it
          return state;
      } else {
          // If the request is not a duplicate, add it to the outgoingRequests array
          const newState = {
              ...state,
              requests: {
                  ...state.requests,
                  friendRequests: [...state.requests.friendRequests, newFriendRequest],
              },
          };
          return newState;
      }
    case "SET_FRIEND_REQUEST_ACCEPTED":
      return {
        ...state,
        requests: {
          ...state.requests,
          friendRequests: state.requests.friendRequests.filter(
            request => request.sender._id !== action.payload
          ),
        },
      };

    case "SET_YOUR_REQUEST_ACCEPTED":
        return {
          ...state,
          requests: {
            ...state.requests,
            outgoingRequests: state.requests.outgoingRequests.filter(
              request => request.receiver._id !== action.payload
            ),
          },
        };
    case "SET_SENDER_REQUEST_DENIAL":
        return {
          ...state,
          requests: {
            ...state.requests,
            outgoingRequests: state.requests.outgoingRequests.filter(
              request => request.receiver._id !== action.payload
            ),
          },
        };
        case "SET_RECEIVER_REQUEST_DENIAL":
          return {
            ...state,
            requests: {
              ...state.requests,
              friendRequests: state.requests.friendRequests.filter(
                request => request.sender._id !== action.payload
              ),
            },
          };
        
      
    case 'SET_FRIEND_REQUEST':
      return {
        ...state,
        requests: {
          ...state.requests,
          friendRequests: [...state.requests.friendRequests, action.payload],
        },
      };
    case 'FETCH_PENDING_REQUESTS_SUCCESS':
      return {
        ...state,
        requests: {
          friendRequests: action.payload.friendRequests,
          outgoingRequests: action.payload.outgoingRequests,
        },
      };
    default:

      return state;
  }
  
};
export default requestReducer;
