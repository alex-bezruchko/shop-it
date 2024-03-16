// productActions.js

export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS,
  payload: products,
});
