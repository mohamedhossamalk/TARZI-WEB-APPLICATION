import API from './api';

const MeasurementService = {
  getUserMeasurements: () => {
    return API.get('/measurements/my-measurements');
  },

  getMeasurementById: (id) => {
    return API.get(`/measurements/${id}`);
  },

  createMeasurement: (measurementData) => {
    return API.post('/measurements', measurementData);
  },

  updateMeasurement: (id, measurementData) => {
    return API.put(`/measurements/${id}`, measurementData);
  },

  deleteMeasurement: (id) => {
    return API.delete(`/measurements/${id}`);
  }
};

export default MeasurementService;