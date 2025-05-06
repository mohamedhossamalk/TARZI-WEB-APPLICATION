import OrderService from '../../services/orderService';

// Action Types
export const ORDER_CREATE_REQUEST = 'ORDER_CREATE_REQUEST';
export const ORDER_CREATE_SUCCESS = 'ORDER_CREATE_SUCCESS';
export const ORDER_CREATE_FAILURE = 'ORDER_CREATE_FAILURE';
export const ORDER_USER_LIST_REQUEST = 'ORDER_USER_LIST_REQUEST';
export const ORDER_USER_LIST_SUCCESS = 'ORDER_USER_LIST_SUCCESS';
export const ORDER_USER_LIST_FAILURE = 'ORDER_USER_LIST_FAILURE';
export const ORDER_DETAILS_REQUEST = 'ORDER_DETAILS_REQUEST';
export const ORDER_DETAILS_SUCCESS = 'ORDER_DETAILS_SUCCESS';
export const ORDER_DETAILS_FAILURE = 'ORDER_DETAILS_FAILURE';
export const ORDER_CANCEL_REQUEST = 'ORDER_CANCEL_REQUEST';
export const ORDER_CANCEL_SUCCESS = 'ORDER_CANCEL_SUCCESS';
export const ORDER_CANCEL_FAILURE = 'ORDER_CANCEL_FAILURE';
export const ORDER_ADMIN_LIST_REQUEST = 'ORDER_ADMIN_LIST_REQUEST';
export const ORDER_ADMIN_LIST_SUCCESS = 'ORDER_ADMIN_LIST_SUCCESS';
export const ORDER_ADMIN_LIST_FAILURE = 'ORDER_ADMIN_LIST_FAILURE';
export const ORDER_UPDATE_REQUEST = 'ORDER_UPDATE_REQUEST';
export const ORDER_UPDATE_SUCCESS = 'ORDER_UPDATE_SUCCESS';
export const ORDER_UPDATE_FAILURE = 'ORDER_UPDATE_FAILURE';

// Admin - Get all orders
export const getAllOrders = () => async (dispatch) => {
  dispatch({ type: ORDER_ADMIN_LIST_REQUEST });
  
  try {
    const response = await OrderService.getAllOrders();
    const ordersData = response && response.data ? (Array.isArray(response.data) ? response.data : []) : [];
    
    dispatch({
      type: ORDER_ADMIN_LIST_SUCCESS,
      payload: ordersData
    });
    
    return ordersData;
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    // معالجة خطأ الاتصال بالخادم
    const errorMessage = error.response?.data?.message || 
                         (error.message === 'Network Error' ? 
                          'فشل الاتصال بالخادم. تحقق من اتصال الإنترنت.' : 
                          'حدث خطأ أثناء استرداد قائمة الطلبات.');
    
    dispatch({
      type: ORDER_ADMIN_LIST_FAILURE,
      payload: errorMessage
    });
    
    // عند الفشل، إرجاع مصفوفة فارغة لمنع الأخطاء اللاحقة
    return [];
  }
};
// Create order
export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: ORDER_CREATE_REQUEST });
  
  try {
    const response = await OrderService.createOrder(orderData);
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء إنشاء الطلب'
    });
    throw error;
  }
};

// Get user orders
export const getUserOrders = () => async (dispatch) => {
  dispatch({ type: ORDER_USER_LIST_REQUEST });
  
  try {
    const response = await OrderService.getUserOrders();
    dispatch({
      type: ORDER_USER_LIST_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: ORDER_USER_LIST_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء استرداد الطلبات'
    });
    throw error;
  }
};

// Get order details
export const getOrderDetails = (id) => async (dispatch) => {
  dispatch({ type: ORDER_DETAILS_REQUEST });
  
  try {
    const response = await OrderService.getOrderById(id);
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء استرداد تفاصيل الطلب'
    });
    throw error;
  }
};

// Cancel order
export const cancelOrder = (id) => async (dispatch) => {
  dispatch({ type: ORDER_CANCEL_REQUEST });
  
  try {
    const response = await OrderService.cancelOrder(id);
    dispatch({
      type: ORDER_CANCEL_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: ORDER_CANCEL_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء إلغاء الطلب'
    });
    throw error;
  }
};

// Admin - Get all orders
// export const getAllOrders = () => async (dispatch) => {
//   dispatch({ type: ORDER_ADMIN_LIST_REQUEST });
  
//   try {
//     const response = await OrderService.getAllOrders();
//     dispatch({
//       type: ORDER_ADMIN_LIST_SUCCESS,
//       payload: response.data
//     });
    
//     return response.data;
//   } catch (error) {
//     dispatch({
//       type: ORDER_ADMIN_LIST_FAILURE,
//       payload: error.response?.data?.message || 'حدث خطأ أثناء استرداد جميع الطلبات'
//     });
//     throw error;
//   }
// };

// Admin - Update order
export const updateOrder = (id, orderData) => async (dispatch) => {
  dispatch({ type: ORDER_UPDATE_REQUEST });
  
  try {
    const response = await OrderService.updateOrder(id, orderData);
    dispatch({
      type: ORDER_UPDATE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء تحديث الطلب'
    });
    throw error;
  }
};

// Admin - Update order status
export const updateOrderStatus = (id, status) => async (dispatch) => {
  dispatch({ type: ORDER_UPDATE_REQUEST });
  
  try {
    const response = await OrderService.updateOrderStatus(id, status);
    dispatch({
      type: ORDER_UPDATE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الطلب'
    });
    throw error;
  }
};