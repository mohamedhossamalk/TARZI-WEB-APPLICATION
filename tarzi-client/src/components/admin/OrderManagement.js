import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { getAllOrders, updateOrderStatus } from '../../store/actions/orderActions';
import { getStatusColor } from '../../utils/helpers';

const OrderManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, loading, error, success } = useSelector(state => state.orders);
  
  // Table pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Load orders when component mounts
  useEffect(() => {
    dispatch(getAllOrders()).catch(err => {
      console.error('Failed to fetch orders:', err);
    });
  }, [dispatch]);
  
  // Refresh orders after status update
  useEffect(() => {
    if (success) {
      dispatch(getAllOrders()).catch(err => {
        console.error('Failed to refresh orders:', err);
      });
    }
  }, [success, dispatch]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0); // Reset to first page when filtering
  };
  
  // Handle status change
  const handleStatusChange = (id, status) => (event) => {
    dispatch(updateOrderStatus(id, event.target.value));
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Ensure orders is an array before filtering
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  // Filter orders based on search and status
  const filteredOrders = safeOrders.filter(order => {
    // Search filter
    const searchMatch = 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.username && order.user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const statusMatch = !statusFilter || order.status === statusFilter;
    
    return searchMatch && statusMatch;
  });
  
  // Available statuses for filter and dropdown
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            sx={{ flexGrow: 1 }}
            variant="outlined"
            placeholder={t('common.search')}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            value={searchTerm}
            onChange={handleSearch}
          />
          
          <TextField
            select
            label={t('order.status')}
            value={statusFilter}
            onChange={handleStatusFilterChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">
              {t('common.all')}
            </MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {t(`order.${status}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('order.orderNumber')}</TableCell>
                    <TableCell>{t('order.customer')}</TableCell>
                    <TableCell align="right">{t('cart.total')}</TableCell>
                    <TableCell align="center">{t('order.date')}</TableCell>
                    <TableCell align="center">{t('order.status')}</TableCell>
                    <TableCell align="right">{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((order) => (
                        <TableRow key={order._id}>
                          <TableCell component="th" scope="row">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>
                            {order.user?.username || t('admin.deletedUser')}
                          </TableCell>
                          <TableCell align="right">
                            {order.totalPrice?.toLocaleString()} {t('common.currency')}
                          </TableCell>
                          <TableCell align="center">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              select
                              value={order.status}
                              onChange={handleStatusChange(order._id, order.status)}
                              size="small"
                              sx={{ minWidth: 120 }}
                              SelectProps={{
                                renderValue: (value) => (
                                  <Chip
                                    label={t(`order.${value}`)}
                                    color={getStatusColor(value)}
                                    size="small"
                                  />
                                )
                              }}
                            >
                              {statuses.map((status) => (
                                <MenuItem 
                                  key={status} 
                                  value={status}
                                  disabled={order.status === 'cancelled' && status !== 'cancelled'}
                                >
                                  {t(`order.${status}`)}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              component={RouterLink}
                              to={`/admin/orders/${order._id}`}
                              startIcon={<ViewIcon />}
                              size="small"
                            >
                              {t('common.view')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t('order.noOrders')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage={t('common.rowsPerPage')}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default OrderManagement;