// src/features/products/api/productsApi.js
import { api } from '../../../services/api';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),
    
    searchProducts: builder.query({
      query: (query) => ({
        url: '/products/search',
        params: { q: query },
      }),
      providesTags: ['Product'],
    }),
    
    addReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),
  }),
});

export const {

useAddReviewMutation,
useGetFeaturedProductsQuery,
useGetProductByIdQuery,
useGetProductsQuery,
useSearchProductsQuery

} = productsApi;