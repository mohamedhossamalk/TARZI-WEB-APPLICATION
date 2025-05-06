import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAILURE,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAILURE,
  PRODUCT_FEATURED_REQUEST,
  PRODUCT_FEATURED_SUCCESS,
  PRODUCT_FEATURED_FAILURE,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAILURE,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAILURE,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAILURE
} from '../actions/productActions';

const initialState = {
  products: [],
  featuredProducts: [],
  product: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // List products
    case PRODUCT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null
      };
    
    case PRODUCT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Product details
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        error: null
      };
    
    case PRODUCT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Featured products
    case PRODUCT_FEATURED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case PRODUCT_FEATURED_SUCCESS:
      return {
        ...state,
        loading: false,
        featuredProducts: action.payload,
        error: null
      };
    
    case PRODUCT_FEATURED_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Create product
    case PRODUCT_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        createSuccess: false,
        error: null
      };
    
    case PRODUCT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload],
        createSuccess: true,
        error: null
      };
    
    case PRODUCT_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        createSuccess: false,
        error: action.payload
      };
    
    // Update product
    case PRODUCT_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        updateSuccess: false,
        error: null
      };
    
    case PRODUCT_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        ),
        product: action.payload,
        updateSuccess: true,
        error: null
      };
    
    case PRODUCT_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        updateSuccess: false,
        error: action.payload
      };
    
    // Delete product
    case PRODUCT_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        deleteSuccess: false,
        error: null
      };
    
    case PRODUCT_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter(product => product._id !== action.payload),
        deleteSuccess: true,
        error: null
      };
    
    case PRODUCT_DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        deleteSuccess: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default productReducer;