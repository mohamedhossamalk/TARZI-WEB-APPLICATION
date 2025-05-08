// src/features/admin/pages/OrdersAdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import OrdersTableAdmin from '../components/orders/OrdersTableAdmin';
import adminService from '../services/adminService';

const OrdersAdminPage = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // التبويبات حسب حالة الطلب
  const tabStatus = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  // جلب الطلبات
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const params = {
          page,
          pageSize: 10,
          keyword,
          status: tabStatus[activeTab] || status
        };
        
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        
        const response = await adminService.getOrders(params);
        
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        setError('حدث خطأ أثناء جلب الطلبات');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [page, keyword, status, dateFrom, dateTo, activeTab]);
  
  // تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
    setStatus(''); // إعادة ضبط حقل الحالة عند تغيير التبويب
  };
  
  // معالجة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    // تم التنفيذ بالفعل بواسطة useEffect
  };
  
  // مسح البحث
  const handleClearSearch = () => {
    setKeyword('');
    setPage(1);
  };
  
  // تغيير الصفحة
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  
  // عرض تفاصيل طلب
  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  // تصدير الطلبات
  const handleExportOrders = () => {
    // يمكن تنفيذ تصدير البيانات إلى CSV هنا
    console.log('تصدير الطلبات');
  };
  
  // تحديث حالة الطلب
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, { status: newStatus });
      
      // تحديث حالة الطلب محليًا
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          إدارة الطلبات
        </Typography>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExportOrders}
        >
          تصدير الطلبات
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="جميع الطلبات" />
          <Tab label="قيد الانتظار" />
          <Tab label="قيد المعالجة" />
          <Tab label="تم الشحن" />
          <Tab label="تم التسليم" />
          <Tab label="ملغية" />
        </Tabs>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="بحث برقم الطلب أو اسم العميل..."
                size="small"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: keyword ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
            </form>
          </Grid>
          
          {activeTab === 0 && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>حالة الطلب</InputLabel>
                <Select
                  value={status}
                  label="حالة الطلب"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="">جميع الحالات</MenuItem>
                  <MenuItem value="pending">قيد الانتظار</MenuItem>
                  <MenuItem value="processing">قيد المعالجة</MenuItem>
                  <MenuItem value="shipped">تم الشحن</MenuItem>
                  <MenuItem value="delivered">تم التسليم</MenuItem>
                  <MenuItem value="cancelled">ملغي</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="من تاريخ"
              type="date"
              size="small"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="إلى تاريخ"
              type="date"
              size="small"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          {/* يمكن إضافة المزيد من الفلاتر حسب الحاجة */}
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <OrdersTableAdmin 
          orders={orders} 
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateOrderStatus}
          page={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      )}
    </Container>
  );
};

export default OrdersAdminPage;