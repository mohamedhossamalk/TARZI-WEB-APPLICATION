import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
  SET_SHIPPING_ADDRESS,
  SET_PAYMENT_METHOD
} from '../actions/cartActions';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : '';

const initialState = {
  items: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: action.payload
      };
    
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: action.payload
      };
    
    case UPDATE_CART_ITEM:
      return {
        ...state,
        items: action.payload
      };
    
    case CLEAR_CART:
      return {
        ...state,
        items: []
      };
    
    case SET_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload
      };
    
    case SET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload
      };
    
    default:
      return state;
  }
};

export default cartReducer;