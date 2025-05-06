import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';  // تم تصحيح الاستيراد
import authReducer from './reducers/authReducer';
import productReducer from './reducers/productReducer';
import orderReducer from './reducers/orderReducer';
import cartReducer from './reducers/cartReducer';
import measurementReducer from './reducers/measurementReducer';
import adminReducer from './reducers/adminReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  orders: orderReducer,
  cart: cartReducer,
  measurements: measurementReducer,
  admin: adminReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;