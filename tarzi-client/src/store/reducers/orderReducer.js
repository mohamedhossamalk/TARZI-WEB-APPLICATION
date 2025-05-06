import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAILURE,
  ORDER_USER_LIST_REQUEST,
  ORDER_USER_LIST_SUCCESS,
  ORDER_USER_LIST_FAILURE,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAILURE,
  ORDER_CANCEL_REQUEST,
  ORDER_CANCEL_SUCCESS,
  ORDER_CANCEL_FAILURE,
  ORDER_ADMIN_LIST_REQUEST,
  ORDER_ADMIN_LIST_SUCCESS,
  ORDER_ADMIN_LIST_FAILURE,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_FAILURE
} from '../actions/orderActions';

const initialState = {
  orders: [], // تهيئة كمصفوفة فارغة
  order: null,
  loading: false,
  error: null,
  success: false
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create order
    case ORDER_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        success: true,
        error: null
      };
    
    case ORDER_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    // User order list
    case ORDER_USER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ORDER_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: Array.isArray(action.payload) ? action.payload : [],
        error: null
      };
    
    case ORDER_USER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Order details
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: null
      };
    
    case ORDER_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Cancel order
    case ORDER_CANCEL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case ORDER_CANCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        // Update the order in the orders array too
        orders: state.orders.map(o =>
          o._id === action.payload._id ? action.payload : o
        ),
        success: true,
        error: null
      };
    
    case ORDER_CANCEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    // Admin - Order list
    case ORDER_ADMIN_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ORDER_ADMIN_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: Array.isArray(action.payload) ? action.payload : [], // تأكد من أن Orders مصفوفة
        error: null
      };
    
    case ORDER_ADMIN_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Update order
    case ORDER_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case ORDER_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        // Update the order in the orders array too
        orders: Array.isArray(state.orders) 
          ? state.orders.map(o => o._id === action.payload._id ? action.payload : o)
          : [],
        success: true,
        error: null
      };
    
    case ORDER_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    default:
      return state;
  }
};

export default orderReducer;