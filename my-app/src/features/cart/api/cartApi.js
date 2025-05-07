// src/features/cart/api/cartApi.js
import { api } from '../../../services/api';

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/cart/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/item/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/item/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;