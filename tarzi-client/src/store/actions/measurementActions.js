import MeasurementService from '../../services/measurementService';

// Action Types
export const MEASUREMENT_LIST_REQUEST = 'MEASUREMENT_LIST_REQUEST';
export const MEASUREMENT_LIST_SUCCESS = 'MEASUREMENT_LIST_SUCCESS';
export const MEASUREMENT_LIST_FAILURE = 'MEASUREMENT_LIST_FAILURE';
export const MEASUREMENT_DETAILS_REQUEST = 'MEASUREMENT_DETAILS_REQUEST';
export const MEASUREMENT_DETAILS_SUCCESS = 'MEASUREMENT_DETAILS_SUCCESS';
export const MEASUREMENT_DETAILS_FAILURE = 'MEASUREMENT_DETAILS_FAILURE';
export const MEASUREMENT_CREATE_REQUEST = 'MEASUREMENT_CREATE_REQUEST';
export const MEASUREMENT_CREATE_SUCCESS = 'MEASUREMENT_CREATE_SUCCESS';
export const MEASUREMENT_CREATE_FAILURE = 'MEASUREMENT_CREATE_FAILURE';
export const MEASUREMENT_UPDATE_REQUEST = 'MEASUREMENT_UPDATE_REQUEST';
export const MEASUREMENT_UPDATE_SUCCESS = 'MEASUREMENT_UPDATE_SUCCESS';
export const MEASUREMENT_UPDATE_FAILURE = 'MEASUREMENT_UPDATE_FAILURE';
export const MEASUREMENT_DELETE_REQUEST = 'MEASUREMENT_DELETE_REQUEST';
export const MEASUREMENT_DELETE_SUCCESS = 'MEASUREMENT_DELETE_SUCCESS';
export const MEASUREMENT_DELETE_FAILURE = 'MEASUREMENT_DELETE_FAILURE';

// Get user measurements
export const getUserMeasurements = () => async (dispatch) => {
  dispatch({ type: MEASUREMENT_LIST_REQUEST });
  
  try {
    const response = await MeasurementService.getUserMeasurements();
    dispatch({
      type: MEASUREMENT_LIST_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MEASUREMENT_LIST_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء استرداد القياسات'
    });
    throw error;
  }
};

// Get measurement details
export const getMeasurementDetails = (id) => async (dispatch) => {
  dispatch({ type: MEASUREMENT_DETAILS_REQUEST });
  
  try {
    const response = await MeasurementService.getMeasurementById(id);
    dispatch({
      type: MEASUREMENT_DETAILS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MEASUREMENT_DETAILS_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء استرداد تفاصيل القياس'
    });
    throw error;
  }
};

// Create measurement
export const createMeasurement = (measurementData) => async (dispatch) => {
  dispatch({ type: MEASUREMENT_CREATE_REQUEST });
  
  try {
    const response = await MeasurementService.createMeasurement(measurementData);
    dispatch({
      type: MEASUREMENT_CREATE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MEASUREMENT_CREATE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء إنشاء القياس'
    });
    throw error;
  }
};

// Update measurement
export const updateMeasurement = (id, measurementData) => async (dispatch) => {
  dispatch({ type: MEASUREMENT_UPDATE_REQUEST });
  
  try {
    const response = await MeasurementService.updateMeasurement(id, measurementData);
    dispatch({
      type: MEASUREMENT_UPDATE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MEASUREMENT_UPDATE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء تحديث القياس'
    });
    throw error;
  }
};

// Delete measurement
export const deleteMeasurement = (id) => async (dispatch) => {
  dispatch({ type: MEASUREMENT_DELETE_REQUEST });
  
  try {
    await MeasurementService.deleteMeasurement(id);
    dispatch({
      type: MEASUREMENT_DELETE_SUCCESS,
      payload: id
    });
    
    return id;
  } catch (error) {
    dispatch({
      type: MEASUREMENT_DELETE_FAILURE,
      payload: error.response?.data?.message || 'حدث خطأ أثناء حذف القياس'
    });
    throw error;
  }
};