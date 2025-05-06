import {
  ADMIN_STATS_REQUEST,
  ADMIN_STATS_SUCCESS,
  ADMIN_STATS_FAILURE,
  ADMIN_USERS_REQUEST,
  ADMIN_USERS_SUCCESS,
  ADMIN_USERS_FAILURE,
  ADMIN_USER_UPDATE_REQUEST,
  ADMIN_USER_UPDATE_SUCCESS,
  ADMIN_USER_UPDATE_FAILURE,
  ADMIN_USER_DELETE_REQUEST,
  ADMIN_USER_DELETE_SUCCESS,
  ADMIN_USER_DELETE_FAILURE
} from '../actions/adminActions';

const initialState = {
  stats: null,
  users: [], // تهيئة كمصفوفة فارغة
  loading: false,
  error: null,
  updateSuccess: false,
  deleteSuccess: false
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    // Dashboard stats
    case ADMIN_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ADMIN_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload,
        error: null
      };
    
    case ADMIN_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Users list
    case ADMIN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        updateSuccess: false,
        deleteSuccess: false
      };
    
    case ADMIN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: Array.isArray(action.payload) ? action.payload : [], // تأكد من أن users مصفوفة
        error: null
      };
    
    case ADMIN_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Update user
    case ADMIN_USER_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        updateSuccess: false,
        error: null
      };
    
    case ADMIN_USER_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: Array.isArray(state.users) 
          ? state.users.map(user => user._id === action.payload._id ? action.payload : user)
          : [],
        updateSuccess: true,
        error: null
      };
    
    case ADMIN_USER_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        updateSuccess: false,
        error: action.payload
      };
    
    // Delete user
    case ADMIN_USER_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        deleteSuccess: false,
        error: null
      };
    
    case ADMIN_USER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: Array.isArray(state.users)
          ? state.users.filter(user => user._id !== action.payload)
          : [],
        deleteSuccess: true,
        error: null
      };
    
    case ADMIN_USER_DELETE_FAILURE:
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

export default adminReducer;