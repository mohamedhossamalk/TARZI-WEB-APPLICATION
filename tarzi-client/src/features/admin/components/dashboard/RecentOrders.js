// src/features/admin/components/dashboard/RecentOrders.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { formatDate, formatCurrency } from '../../../../core/utils/formatters';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

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

const RecentOrders = ({ orders = [] }) => {
  const navigate = useNavigate();

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  if (!orders.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد طلبات حديثة
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>رقم الطلب</TableCell>
            <TableCell>العميل</TableCell>
            <TableCell>التاريخ</TableCell>
            <TableCell>المبلغ</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>عرض</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} hover>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.user.username}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>
                <Chip 
                  label={getStatusText(order.status)} 
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewOrder(order._id)}
                >
                  عرض
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentOrders;