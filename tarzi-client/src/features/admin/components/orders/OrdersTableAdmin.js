// src/features/admin/components/orders/OrdersTableAdmin.js
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Chip,
  Button,
  Menu,
  MenuItem,
  Pagination,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { formatDate, formatCurrency } from '../../../../core/utils/formatters';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'قيد الانتظار',
    'processing': 'قيد المعالجة',
    'shipped': 'تم الشحن',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغي'
  };
  return statusMap[status] || status;
};

const OrdersTableAdmin = ({ orders = [], onViewOrder, onUpdateStatus, page, totalPages, onPageChange }) => {
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const handleOpenStatusMenu = (event, order) => {
    setStatusAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };
  
  const handleCloseStatusMenu = () => {
    setStatusAnchorEl(null);
    setSelectedOrder(null);
  };
  
  const handleStatusChange = (newStatus) => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      onUpdateStatus(selectedOrder._id, newStatus);
    }
    handleCloseStatusMenu();
  };
  
  if (!orders.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد طلبات لعرضها
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>رقم الطلب</TableCell>
              <TableCell>العميل</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>المبلغ الإجمالي</TableCell>
              <TableCell>طريقة الدفع</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow hover key={order._id}>
                <TableCell>
                  <Box sx={{ fontWeight: 'bold' }}>
                    {order.orderNumber || `#${order._id.substring(0, 8)}`}
                  </Box>
                </TableCell>
                <TableCell>{order.user?.username || 'غير معروف'}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 
                   order.paymentMethod === 'card' ? 'بطاقة ائتمان' : order.paymentMethod}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => handleOpenStatusMenu(e, order)}
                    endIcon={<ArrowDownIcon />}
                    sx={{ borderRadius: 2 }}
                    color={getStatusColor(order.status)}
                  >
                    {getStatusText(order.status)}
                  </Button>
                </TableCell>
                <TableCell>
                  <Tooltip title="عرض التفاصيل">
                    <IconButton 
                      color="primary" 
                      size="small" 
                      onClick={() => onViewOrder(order._id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* ترقيم الصفحات */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={onPageChange} 
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
      
      {/* قائمة تغيير الحالة */}
      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={handleCloseStatusMenu}
      >
        <MenuItem 
          onClick={() => handleStatusChange('pending')}
          disabled={selectedOrder?.status === 'pending'}
        >
          <Chip 
            label="قيد الانتظار" 
            color="warning" 
            size="small" 
            sx={{ minWidth: 100 }}
          />
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange('processing')}
          disabled={selectedOrder?.status === 'processing'}
        >
          <Chip 
            label="قيد المعالجة" 
            color="info" 
            size="small" 
            sx={{ minWidth: 100 }}
          />
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange('shipped')}
          disabled={selectedOrder?.status === 'shipped'}
        >
          <Chip 
            label="تم الشحن" 
            color="primary" 
            size="small" 
            sx={{ minWidth: 100 }}
          />
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange('delivered')}
          disabled={selectedOrder?.status === 'delivered'}
        >
          <Chip 
            label="تم التسليم" 
            color="success" 
            size="small" 
            sx={{ minWidth: 100 }}
          />
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleStatusChange('cancelled')}
          disabled={selectedOrder?.status === 'cancelled'}
        >
          <Chip 
            label="ملغي" 
            color="error" 
            size="small" 
            sx={{ minWidth: 100 }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

// تأكد من إضافة export default بشكل واضح
export default OrdersTableAdmin;