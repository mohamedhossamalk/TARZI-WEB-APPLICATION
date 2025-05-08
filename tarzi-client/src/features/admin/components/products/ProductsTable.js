// src/features/admin/components/products/ProductsTable.js
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
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const ProductsTable = ({ products = [], onEditProduct, onDeleteProduct }) => {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null, productName: '' });

  const handleOpenDeleteDialog = (product) => {
    setDeleteDialog({
      open: true,
      productId: product._id,
      productName: product.name
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, productId: null, productName: '' });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.productId) {
      await onDeleteProduct(deleteDialog.productId);
    }
    handleCloseDeleteDialog();
  };

  if (!products.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد منتجات لعرضها
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>المنتج</TableCell>
              <TableCell>السعر</TableCell>
              <TableCell>الفئة</TableCell>
              <TableCell>المخزون</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow hover key={product._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      alt={product.name}
                      src={product.images && product.images.length > 0 ? product.images[0] : '/assets/images/placeholder.png'}
                      variant="rounded"
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Typography variant="body2">{product.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{product.price} ج.م</TableCell>
                <TableCell>{product.category?.name || 'غير مصنف'}</TableCell>
                <TableCell>
                  {product.quantity > 10 ? (
                    <Chip label={`${product.quantity} قطعة`} color="success" size="small" />
                  ) : product.quantity > 0 ? (
                    <Chip label={`${product.quantity} قطعة`} color="warning" size="small" />
                  ) : (
                    <Chip label="غير متوفر" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.isActive ? 'نشط' : 'غير نشط'} 
                    color={product.isActive ? 'primary' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Tooltip title="تعديل">
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => onEditProduct(product)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleOpenDeleteDialog(product)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* حوار تأكيد الحذف */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من حذف المنتج: <strong>{deleteDialog.productName}</strong>؟
            <br />
            هذا الإجراء لا يمكن التراجع عنه.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductsTable;