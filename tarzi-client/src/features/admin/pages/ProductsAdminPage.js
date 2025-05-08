// src/features/admin/pages/ProductsAdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Grid,
  Dialog,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import ProductsTable from '../components/products/ProductsTable';
import ProductFormAdmin from '../components/products/ProductFormAdmin';
import adminService from '../services/adminService';

const ProductsAdminPage = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // جلب المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await adminService.getProducts({ keyword });
        setProducts(response.data.products);
      } catch (error) {
        setError('حدث خطأ أثناء جلب المنتجات');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, refreshTrigger]);

  // فتح نموذج إضافة منتج
  const handleOpenAddDialog = () => {
    setSelectedProduct(null);
    setOpenAddDialog(true);
  };

  // فتح نموذج تعديل منتج
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenAddDialog(true);
  };

  // إغلاق نموذج المنتج
  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedProduct(null);
  };

  // حفظ المنتج (إضافة/تعديل)
  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        await adminService.updateProduct(selectedProduct._id, productData);
      } else {
        await adminService.createProduct(productData);
      }
      setRefreshTrigger(prev => prev + 1); // تحديث المنتجات
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error; // سيتم التقاطها في نموذج المنتج
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (productId) => {
    try {
      await adminService.deleteProduct(productId);
      setRefreshTrigger(prev => prev + 1); // تحديث المنتجات بعد الحذف
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // معالجة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    // سيتم تشغيل البحث تلقائياً من خلال useEffect
  };

  // مسح البحث
  const handleClearSearch = () => {
    setKeyword('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          إدارة المنتجات
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          إضافة منتج جديد
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="بحث عن منتج..."
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
        <ProductsTable 
          products={products} 
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
      
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <ProductFormAdmin 
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={handleCloseDialog}
        />
      </Dialog>
    </Container>
  );
};

export default ProductsAdminPage;