// src/features/cart/components/OrderSuccess.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';

const OrderSuccess = ({ orderNumber }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      
      <Typography variant="h4" gutterBottom>
        تم استلام طلبك بنجاح!
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        رقم الطلب: <strong>{orderNumber}</strong>
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        شكراً لطلبك. سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني.
        <br />
        يمكنك متابعة حالة طلبك من خلال صفحة الطلبات الخاصة بك.
      </Typography>
      
      <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          ماذا يحدث الآن؟
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                1. مراجعة الطلب
              </Typography>
              <Typography variant="body2">
                سيتم مراجعة طلبك والتأكد من توفر جميع المنتجات.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                2. تجهيز الطلب
              </Typography>
              <Typography variant="body2">
                بعد المراجعة، سيتم تجهيز طلبك للشحن خلال 1-2 يوم عمل.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                3. شحن وتوصيل
              </Typography>
              <Typography variant="body2">
                سيتم شحن طلبك وتوصيله إلى العنوان المحدد خلال 3-7 أيام عمل.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          component={RouterLink}
          to={`/orders/${orderNumber}`}
          variant="outlined"
          startIcon={<ReceiptIcon />}
        >
          تفاصيل الطلب
        </Button>
        
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          startIcon={<ShoppingBagIcon />}
        >
          متابعة التسوق
        </Button>
      </Box>
    </Box>
  );
};

export default OrderSuccess;