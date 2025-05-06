import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  ShoppingBag as OrdersIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const OrderSuccessPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 5,
          mb: 8
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600
          }}
        >
          <SuccessIcon
            color="success"
            sx={{ fontSize: 80, mb: 2 }}
          />
          
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('orderSuccess.title')}
          </Typography>
          
          <Typography variant="body1" align="center" paragraph>
            {t('orderSuccess.message')}
          </Typography>
          
          <Divider sx={{ width: '100%', my: 3 }} />
          
          <Typography variant="body1" align="center" paragraph>
            {t('orderSuccess.trackMessage')}
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              width: '100%',
              gap: 2,
              mt: 2
            }}
          >
            <Button
              component={RouterLink}
              to="/orders"
              variant="contained"
              color="primary"
              startIcon={<OrdersIcon />}
              fullWidth
            >
              {t('orderSuccess.viewOrders')}
            </Button>
            
            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              color="primary"
              startIcon={<HomeIcon />}
              fullWidth
            >
              {t('orderSuccess.continueShopping')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OrderSuccessPage;