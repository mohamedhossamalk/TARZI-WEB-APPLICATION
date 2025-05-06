import {
  MEASUREMENT_LIST_REQUEST,
  MEASUREMENT_LIST_SUCCESS,
  MEASUREMENT_LIST_FAILURE,
  MEASUREMENT_DETAILS_REQUEST,
  MEASUREMENT_DETAILS_SUCCESS,
  MEASUREMENT_DETAILS_FAILURE,
  MEASUREMENT_CREATE_REQUEST,
  MEASUREMENT_CREATE_SUCCESS,
  MEASUREMENT_CREATE_FAILURE,
  MEASUREMENT_UPDATE_REQUEST,
  MEASUREMENT_UPDATE_SUCCESS,
  MEASUREMENT_UPDATE_FAILURE,
  MEASUREMENT_DELETE_REQUEST,
  MEASUREMENT_DELETE_SUCCESS,
  MEASUREMENT_DELETE_FAILURE
} from '../actions/measurementActions';

const initialState = {
  measurements: [],
  measurement: null,
  loading: false,
  error: null,
  success: false
};

const measurementReducer = (state = initialState, action) => {
  switch (action.type) {
    // List measurements
    case MEASUREMENT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case MEASUREMENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        measurements: action.payload,
        error: null
      };
    
    case MEASUREMENT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Measurement details
    case MEASUREMENT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case MEASUREMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        measurement: action.payload,
        error: null
      };
    
    case MEASUREMENT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Create measurement
    case MEASUREMENT_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case MEASUREMENT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        measurements: [...state.measurements, action.payload],
        measurement: action.payload,
        success: true,
        error: null
      };
    
    case MEASUREMENT_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    // Update measurement
    case MEASUREMENT_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case MEASUREMENT_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        measurements: state.measurements.map(m =>
          m._id === action.payload._id ? action.payload : m
        ),
        measurement: action.payload,
        success: true,
        error: null
      };
    
    case MEASUREMENT_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    // Delete measurement
    case MEASUREMENT_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    
    case MEASUREMENT_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        measurements: state.measurements.filter(m => m._id !== action.payload),
        success: true,
        error: null
      };
    
    case MEASUREMENT_DELETE_FAILURE:
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

export default measurementReducer;