import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import OrderItem from '../components/orders/OrderItem';
import { getUserOrders } from '../store/actions/orderActions';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrdersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Fetch user orders on component mount
  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);
  
  // Filter orders by status for each tab
  const getFilteredOrders = (statusFilter = null) => {
    if (!orders) return [];
    
    if (statusFilter === null) {
      // All orders
      return orders;
    }
    
    // Filter by status
    return orders.filter(order => order.status === statusFilter);
  };
  
  // Get count of orders by status for tab badges
  const getStatusCount = (status) => {
    if (!orders) return 0;
    return orders.filter(order => order.status === status).length;
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('nav.orders')}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {!orders || orders.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                {t('order.noOrders')}
              </Alert>
            ) : (
              <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="order tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab 
                      label={`${t('order.all')} (${orders.length})`} 
                      id="order-tab-0" 
                    />
                    <Tab 
                      label={`${t('order.pending')} (${getStatusCount('pending')})`} 
                      id="order-tab-1" 
                    />
                    <Tab 
                      label={`${t('order.processing')} (${getStatusCount('processing')})`} 
                      id="order-tab-2" 
                    />
                    <Tab 
                      label={`${t('order.shipped')} (${getStatusCount('shipped')})`} 
                      id="order-tab-3" 
                    />
                    <Tab 
                      label={`${t('order.delivered')} (${getStatusCount('delivered')})`} 
                      id="order-tab-4" 
                    />
                    <Tab 
                      label={`${t('order.cancelled')} (${getStatusCount('cancelled')})`} 
                      id="order-tab-5" 
                    />
                  </Tabs>
                </Box>
                
                <TabPanel value={tabValue} index={0}>
                  {getFilteredOrders().map(order => (
                    <OrderItem key={order._id} order={order} />
                  ))}
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  {getFilteredOrders('pending').length > 0 ? (
                    getFilteredOrders('pending').map(order => (
                      <OrderItem key={order._id} order={order} />
                    ))
                  ) : (
                    <Typography color="text.secondary" align="center">
                      {t('order.noOrdersStatus', { status: t('order.pending').toLowerCase() })}
                    </Typography>
                  )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  {getFilteredOrders('processing').length > 0 ? (
                    getFilteredOrders('processing').map(order => (
                      <OrderItem key={order._id} order={order} />
                    ))
                  ) : (
                    <Typography color="text.secondary" align="center">
                      {t('order.noOrdersStatus', { status: t('order.processing').toLowerCase() })}
                    </Typography>
                  )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={3}>
                  {getFilteredOrders('shipped').length > 0 ? (
                    getFilteredOrders('shipped').map(order => (
                      <OrderItem key={order._id} order={order} />
                    ))
                  ) : (
                    <Typography color="text.secondary" align="center">
                      {t('order.noOrdersStatus', { status: t('order.shipped').toLowerCase() })}
                    </Typography>
                  )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={4}>
                  {getFilteredOrders('delivered').length > 0 ? (
                    getFilteredOrders('delivered').map(order => (
                      <OrderItem key={order._id} order={order} />
                    ))
                  ) : (
                    <Typography color="text.secondary" align="center">
                      {t('order.noOrdersStatus', { status: t('order.delivered').toLowerCase() })}
                    </Typography>
                  )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={5}>
                  {getFilteredOrders('cancelled').length > 0 ? (
                    getFilteredOrders('cancelled').map(order => (
                      <OrderItem key={order._id} order={order} />
                    ))
                  ) : (
                    <Typography color="text.secondary" align="center">
                      {t('order.noOrdersStatus', { status: t('order.cancelled').toLowerCase() })}
                    </Typography>
                  )}
                </TabPanel>
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default OrdersPage;