import API from './api';

const OrderService = {
  createOrder: (orderData) => {
    return API.post('/orders', orderData);
  },

  getUserOrders: () => {
    return API.get('/orders/my-orders');
  },

  getOrderById: (id) => {
    return API.get(`/orders/${id}`);
  },

  updateOrderStatus: (id, status) => {
    return API.put(`/orders/${id}/status`, { status });
  },

  cancelOrder: (id) => {
    return API.put(`/orders/${id}/cancel`);
  },

  // Admin operations
  getAllOrders: () => {
    return API.get('/orders');
  },

  getOrdersByStatus: (status) => {
    return API.get(`/orders/status/${status}`);
  },

  updateOrder: (id, orderData) => {
    return API.put(`/orders/${id}`, orderData);
  }
};

export default OrderService;