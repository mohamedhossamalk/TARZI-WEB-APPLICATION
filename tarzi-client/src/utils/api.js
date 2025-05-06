/**
 * API utility functions
 */

/**
 * Handle API error
 * @param {Error} error Error object from catch block
 * @param {Function} dispatch Redux dispatch function
 * @param {string} actionType Action type to dispatch error
 * @param {string} defaultMessage Default error message
 */
export const handleApiError = (error, dispatch, actionType, defaultMessage = 'حدث خطأ غير متوقع') => {
  let errorMessage = defaultMessage;
  
  if (error.response) {
    // Server responded with error
    const { data } = error.response;
    errorMessage = data.message || data.error || errorMessage;
  } else if (error.request) {
    // No response from server
    errorMessage = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.';
  } else {
    // Error in setting up the request
    errorMessage = error.message || errorMessage;
  }
  
  if (dispatch && actionType) {
    dispatch({ type: actionType, payload: errorMessage });
  }
  
  return errorMessage;
};

/**
 * Format URL parameters
 * @param {Object} params Parameter object
 * @returns {string} URL parameter string
 */
export const formatParams = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, value);
    }
  });
  
  return `?${urlParams.toString()}`;
};

/**
 * Create form data from object
 * @param {Object} data Data object
 * @returns {FormData} Form data
 */
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (key === 'files' || key === 'images') {
          // Handle file array
          for (let i = 0; i < value.length; i++) {
            formData.append(key, value[i]);
          }
        } else {
          // Normal array
          formData.append(key, JSON.stringify(value));
        }
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return formData;
};
