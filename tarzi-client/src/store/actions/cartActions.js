// Action Types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_SHIPPING_ADDRESS = 'SET_SHIPPING_ADDRESS';
export const SET_PAYMENT_METHOD = 'SET_PAYMENT_METHOD';

// Retrieve cart from localStorage
const getCartFromStorage = () => {
  const cartItems = localStorage.getItem('cartItems');
  return cartItems ? JSON.parse(cartItems) : [];
};

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

// Add item to cart
export const addToCart = (item) => (dispatch, getState) => {
  const cartItems = getCartFromStorage();
  
  // Check if item already exists in cart
  const existingItem = cartItems.find(cartItem => 
    cartItem._id === item._id && 
    cartItem.fabricChoice === item.fabricChoice && 
    cartItem.colorChoice === item.colorChoice
  );
  
  let updatedItems;
  
  if (existingItem) {
    // Update quantity if item exists
    updatedItems = cartItems.map(cartItem => 
      cartItem._id === item._id && 
      cartItem.fabricChoice === item.fabricChoice && 
      cartItem.colorChoice === item.colorChoice
        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
        : cartItem
    );
  } else {
    // Add new item to cart
    updatedItems = [...cartItems, item];
  }
  
  dispatch({
    type: ADD_TO_CART,
    payload: updatedItems
  });
  
  saveCartToStorage(updatedItems);
};

// Remove item from cart
export const removeFromCart = (itemId, fabricChoice, colorChoice) => (dispatch) => {
  const cartItems = getCartFromStorage();
  
  const updatedItems = cartItems.filter(item => 
    !(item._id === itemId && 
      item.fabricChoice === fabricChoice && 
      item.colorChoice === colorChoice)
  );
  
  dispatch({
    type: REMOVE_FROM_CART,
    payload: updatedItems
  });
  
  saveCartToStorage(updatedItems);
};

// Update cart item quantity
export const updateCartItem = (itemId, fabricChoice, colorChoice, quantity) => (dispatch) => {
  const cartItems = getCartFromStorage();
  
  const updatedItems = cartItems.map(item => 
    item._id === itemId && 
    item.fabricChoice === fabricChoice && 
    item.colorChoice === colorChoice
      ? { ...item, quantity }
      : item
  );
  
  dispatch({
    type: UPDATE_CART_ITEM,
    payload: updatedItems
  });
  
  saveCartToStorage(updatedItems);
};

// Clear cart
export const clearCart = () => (dispatch) => {
  dispatch({ type: CLEAR_CART });
  localStorage.removeItem('cartItems');
};

// Set shipping address
export const setShippingAddress = (address) => (dispatch) => {
  dispatch({
    type: SET_SHIPPING_ADDRESS,
    payload: address
  });
  
  localStorage.setItem('shippingAddress', JSON.stringify(address));
};

// Set payment method
export const setPaymentMethod = (method) => (dispatch) => {
  dispatch({
    type: SET_PAYMENT_METHOD,
    payload: method
  });
  
  localStorage.setItem('paymentMethod', JSON.stringify(method));
};