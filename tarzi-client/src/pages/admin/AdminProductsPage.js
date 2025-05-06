import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../store/actions/productActions';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminProductsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, loading, error, createSuccess, updateSuccess, deleteSuccess } = useSelector(state => state.products);
  
  // Table pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    fabricOptions: '',
    colorOptions: '',
    isFeatured: false,
    isActive: true
  });
  
  // Load products when component mounts
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  
  // Reset form after successful operations
  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      handleCloseProductDialog();
      handleCloseDeleteDialog();
      // Refresh products list
      dispatch(getProducts());
    }
  }, [createSuccess, updateSuccess, deleteSuccess, dispatch]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  // Filter products based on search term
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Dialog handlers
  const handleOpenProductDialog = (product = null) => {
    if (product) {
      // Edit mode - populate form
      setCurrentProduct(product);
      setProductForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        imageUrl: product.imageUrl || '',
        fabricOptions: (product.fabricOptions || []).join(', '),
        colorOptions: (product.colorOptions || []).join(', '),
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== false // Default to true if not explicitly false
      });
    } else {
      // Add mode - reset form
      setCurrentProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        fabricOptions: '',
        colorOptions: '',
        isFeatured: false,
        isActive: true
      });
    }
    setOpenProductDialog(true);
  };
  
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setCurrentProduct(null);
  };
  
  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };
  
  // Form handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmitProduct = () => {
    // Convert comma-separated strings to arrays
    const formData = {
      ...productForm,
      price: parseFloat(productForm.price),
      fabricOptions: productForm.fabricOptions.split(',').map(item => item.trim()).filter(Boolean),
      colorOptions: productForm.colorOptions.split(',').map(item => item.trim()).filter(Boolean)
    };
    
    if (currentProduct) {
      // Update existing product
      dispatch(updateProduct(currentProduct._id, formData));
    } else {
      // Create new product
      dispatch(createProduct(formData));
    }
  };
  
  const handleDeleteProduct = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete._id));
    }
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">
              {t('admin.products')}
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenProductDialog()}
            >
              {t('admin.addProduct')}
            </Button>
          </Box>
          
          <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t('common.search')}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                value={searchTerm}
                onChange={handleSearch}
              />
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
                        <TableCell>{t('product.name')}</TableCell>
                        <TableCell>{t('product.price')}</TableCell>
                        <TableCell>{t('product.category')}</TableCell>
                        <TableCell align="center">{t('product.status')}</TableCell>
                        <TableCell align="right">{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts && filteredProducts
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((product) => (
                          <TableRow key={product._id}>
                            <TableCell component="th" scope="row">
                              {product.name}
                              {product.isFeatured && (
                                <Chip
                                  label={t('product.featured')}
                                  color="secondary"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {product.price?.toLocaleString()} {t('common.currency')}
                            </TableCell>
                            <TableCell>
                              {product.category || '-'}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={product.isActive !== false ? t('product.active') : t('product.inactive')}
                                color={product.isActive !== false ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenProductDialog(product)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleOpenDeleteDialog(product)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      
                      {(!filteredProducts || filteredProducts.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            {t('product.noProductsFound')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredProducts?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage={t('common.rowsPerPage')}
                />
              </>
            )}
          </Paper>
        </Container>
      </Box>
      
      {/* Product Dialog */}
      <Dialog
        open={openProductDialog}
        onClose={handleCloseProductDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentProduct ? t('admin.editProduct') : t('admin.addProduct')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label={t('product.name')}
                fullWidth
                required
                value={productForm.name}
                onChange={handleFormChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label={t('product.description')}
                fullWidth
                multiline
                rows={3}
                value={productForm.description}
                onChange={handleFormChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label={t('product.price')}
                fullWidth
                required
                type="number"
                value={productForm.price}
                onChange={handleFormChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label={t('product.category')}
                fullWidth
                value={productForm.category}
                onChange={handleFormChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="imageUrl"
                label={t('product.imageUrl')}
                fullWidth
                value={productForm.imageUrl}
                onChange={handleFormChange}
                helperText={t('product.imageUrlHelp')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="fabricOptions"
                label={t('product.fabricOptions')}
                fullWidth
                value={productForm.fabricOptions}
                onChange={handleFormChange}
                helperText={t('product.optionsHelp')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="colorOptions"
                label={t('product.colorOptions')}
                fullWidth
                value={productForm.colorOptions}
                onChange={handleFormChange}
                helperText={t('product.optionsHelp')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="isFeatured"
                    checked={productForm.isFeatured}
                    onChange={handleFormChange}
                    color="secondary"
                  />
                }
                label={t('product.featured')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={productForm.isActive}
                    onChange={handleFormChange}
                    color="primary"
                  />
                }
                label={t('product.active')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmitProduct}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          {t('admin.deleteProductConfirmation')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('admin.deleteProductWarning', { name: productToDelete?.name })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductsPage;