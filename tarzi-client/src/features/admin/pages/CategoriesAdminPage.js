// src/features/admin/pages/CategoriesAdminPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Dialog,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CategoriesTable from '../components/categories/CategoriesTable';
import CategoryFormAdmin from '../components/categories/CategoryFormAdmin';
import adminService from '../services/adminService';

const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // جلب الفئات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await adminService.getCategories();
        setCategories(response.data.categories);
      } catch (error) {
        setError('حدث خطأ أثناء جلب الفئات');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refreshTrigger]);

  // فتح نموذج إضافة فئة جديدة
  const handleOpenAddDialog = () => {
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  // فتح نموذج تعديل فئة
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  // إغلاق نموذج الفئة
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  // حفظ الفئة (إضافة/تعديل)
  const handleSaveCategory = async (categoryData) => {
    try {
      if (selectedCategory) {
        await adminService.updateCategory(selectedCategory._id, categoryData);
      } else {
        await adminService.createCategory(categoryData);
      }
      setRefreshTrigger(prev => prev + 1); // تحديث الفئات
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
      throw error; // سيتم التقاطها في نموذج الفئة
    }
  };

  // حذف فئة
  const handleDeleteCategory = async (categoryId) => {
    try {
      await adminService.deleteCategory(categoryId);
      setRefreshTrigger(prev => prev + 1); // تحديث الفئات بعد الحذف
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          إدارة الفئات
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          إضافة فئة جديدة
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 2 }}>
          <CategoriesTable 
            categories={categories}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </Paper>
      )}
      
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <CategoryFormAdmin 
          category={selectedCategory}
          onSave={handleSaveCategory}
          onCancel={handleCloseDialog}
        />
      </Dialog>
    </Container>
  );
};

export default CategoriesAdminPage;