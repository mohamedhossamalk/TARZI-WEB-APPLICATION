// src/features/cart/components/CartItemSkeleton.js
import React from 'react';
import { Box, Grid, Skeleton, Divider } from '@mui/material';

const CartItemSkeleton = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Skeleton variant="rectangular" width="100%" height={120} />
        </Grid>
        
        <Grid item xs={12} sm={5}>
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </Grid>
        
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" width={120} height={40} />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={2} sx={{ textAlign: 'end' }}>
          <Skeleton variant="text" width="50%" height={30} sx={{ ml: 'auto' }} />
          <Skeleton variant="circular" width={24} height={24} sx={{ ml: 'auto' }} />
        </Grid>
      </Grid>
      
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default CartItemSkeleton;