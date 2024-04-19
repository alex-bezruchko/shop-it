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
      // Check if the new request already exists in the outgoingRequests array
      const isDuplicate = state.requests.outgoingRequests.some(request => request.receiver._id === newRequest.receiver._id);
  
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
    
    case "SET_NEW_FRIEND_REQUEST":
      return {
        ...state,
        requests: {
          ...state.requests,
          friendRequests: state.requests.friendRequests.filter(
            request => request.sender._id !== action.payload
          ),
        },
      };
    case "SET_NEW_OUTGOING_REQUESTS":
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
