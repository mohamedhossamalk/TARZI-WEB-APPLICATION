// src/features/measurements/api/measurementsApi.js
import { api } from '../../../services/api';

export const measurementsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserMeasurements: builder.query({
      query: () => '/measurements',
      providesTags: ['Measurement'],
    }),
    
    getMeasurementById: builder.query({
      query: (id) => `/measurements/${id}`,
      providesTags: (result, error, id) => [{ type: 'Measurement', id }],
    }),
    
    addMeasurement: builder.mutation({
      query: (data) => ({
        url: '/measurements',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Measurement'],
    }),
    
    updateMeasurement: builder.mutation({
      query: ({ id, data }) => ({
        url: `/measurements/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Measurement', id },
        'Measurement',
      ],
    }),
    
    deleteMeasurement: builder.mutation({
      query: (id) => ({
        url: `/measurements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Measurement'],
    }),
  }),
});

export const {
  useGetUserMeasurementsQuery,
  useGetMeasurementByIdQuery,
  useAddMeasurementMutation,
  useUpdateMeasurementMutation,
  useDeleteMeasurementMutation,
} = measurementsApi;