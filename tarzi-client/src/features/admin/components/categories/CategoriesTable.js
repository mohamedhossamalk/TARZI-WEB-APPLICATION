// src/features/admin/components/categories/CategoriesTable.js
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const CategoriesTable = ({ categories = [], onEditCategory, onDeleteCategory }) => {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, categoryId: null, categoryName: '' });

  const handleOpenDeleteDialog = (category) => {
    setDeleteDialog({
      open: true,
      categoryId: category._id,
      categoryName: category.name
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, categoryId: null, categoryName: '' });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.categoryId) {
      await onDeleteCategory(deleteDialog.categoryId);
    }
    handleCloseDeleteDialog();
  };

  if (!categories.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد فئات لعرضها
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الفئة</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>عدد المنتجات</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow hover key={category._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {category.image && (
                      <Avatar
                        alt={category.name}
                        src={category.image}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                    )}
                    <Typography variant="body2">{category.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                <TableCell>{category.productCount || 0}</TableCell>
                <TableCell>
                  <Chip 
                    label={category.isActive ? 'نشط' : 'غير نشط'} 
                    color={category.isActive ? 'primary' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Tooltip title="تعديل">
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => onEditCategory(category)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleOpenDeleteDialog(category)}
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
            هل أنت متأكد من حذف الفئة: <strong>{deleteDialog.categoryName}</strong>؟
            <br />
            قد يؤثر هذا على المنتجات المرتبطة بهذه الفئة.
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

export default CategoriesTable;