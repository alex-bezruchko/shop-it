import { FETCH_PRODUCTS } from '../actions/productActions';

const initialState = {
    products: []
  };
  
  const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PRODUCTS:
        return {
          ...state,
          products: action.payload,
        };
      case 'ADD_PRODUCT':
        console.log(action.payload)
        return {
          ...state,
          products: [...state.products, action.payload]
        };
      case 'REMOVE_PRODUCT':
        return {
          ...state,
          products: state.products.filter(product => product.id !== action.payload)
        };
      default:
        return state;
    }
  };
  
  export default productReducer;