import ProductService from '../../services/productService';

// Action Types
export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS';
export const PRODUCT_LIST_FAILURE = 'PRODUCT_LIST_FAILURE';
export const PRODUCT_DETAILS_REQUEST = 'PRODUCT_DETAILS_REQUEST';
export const PRODUCT_DETAILS_SUCCESS = 'PRODUCT_DETAILS_SUCCESS';
export const PRODUCT_DETAILS_FAILURE = 'PRODUCT_DETAILS_FAILURE';
export const PRODUCT_FEATURED_REQUEST = 'PRODUCT_FEATURED_REQUEST';
export const PRODUCT_FEATURED_SUCCESS = 'PRODUCT_FEATURED_SUCCESS';
export const PRODUCT_FEATURED_FAILURE = 'PRODUCT_FEATURED_FAILURE';
export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST';
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS';
export const PRODUCT_CREATE_FAILURE = 'PRODUCT_CREATE_FAILURE';
export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST';
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS';
export const PRODUCT_UPDATE_FAILURE = 'PRODUCT_UPDATE_FAILURE';
export const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST';
export const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS';
export const PRODUCT_DELETE_FAILURE = 'PRODUCT_DELETE_FAILURE';

// Get all products
// Get all products
export const getProducts = (filters = {}) => async (dispatch) => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  
  try {
    const response = await ProductService.getProducts(filters);
    // تأكد من أن البيانات مصفوفة
    let productsData = [];
    
    if (response && response.data) {
      productsData = Array.isArray(response.data) ? response.data :
                    (response.data.products && Array.isArray(response.data.products)) ? response.data.products :
                    [];
    }
    
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: productsData
    });
    
    return productsData;
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء جلب المنتجات'
    });
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = () => async (dispatch) => {
  dispatch({ type: PRODUCT_FEATURED_REQUEST });
  
  try {
    const response = await ProductService.getFeaturedProducts();
    // تأكد من أن البيانات مصفوفة
    let featuredProducts = [];
    
    if (response && response.data) {
      featuredProducts = Array.isArray(response.data) ? response.data :
                       (response.data.featuredProducts && Array.isArray(response.data.featuredProducts)) ? response.data.featuredProducts :
                       [];
    }
    
    dispatch({
      type: PRODUCT_FEATURED_SUCCESS,
      payload: featuredProducts
    });
    
    return featuredProducts;
  } catch (error) {
    dispatch({
      type: PRODUCT_FEATURED_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء جلب المنتجات المميزة'
    });
    throw error;
  }
};
// Get product details by ID
export const getProductDetails = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST });
  
  try {
    const response = await ProductService.getProductById(id);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء جلب تفاصيل المنتج'
    });
    throw error;
  }
};

// Get featured products


// Create new product (Admin)
export const createProduct = (productData) => async (dispatch) => {
  dispatch({ type: PRODUCT_CREATE_REQUEST });
  
  try {
    const response = await ProductService.createProduct(productData);
    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء إنشاء المنتج'
    });
    throw error;
  }
};

// Update product (Admin)
export const updateProduct = (id, productData) => async (dispatch) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST });
  
  try {
    const response = await ProductService.updateProduct(id, productData);
    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء تحديث المنتج'
    });
    throw error;
  }
};

// Delete product (Admin)
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST });
  
  try {
    await ProductService.deleteProduct(id);
    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
      payload: id
    });
    
    return id;
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء حذف المنتج'
    });
    throw error;
  }
};