import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Rating,
  Chip
} from '@mui/material';
import {
  AddShoppingCart as CartIcon
} from '@mui/icons-material';
import { addToCart } from '../../store/actions/cartActions';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetails = ({ product }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState({});
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Form validation
  const validate = () => {
    let tempErrors = {};
    
    if (!selectedFabric) tempErrors.fabric = t('validation.fabric.required');
    if (!selectedColor) tempErrors.color = t('validation.color.required');
    if (quantity < 1) tempErrors.quantity = t('validation.quantity.min');
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (validate()) {
      dispatch(addToCart({
        ...product,
        fabricChoice: selectedFabric,
        colorChoice: selectedColor,
        quantity,
        additionalRequests
      }));
      
      setSnackbarOpen(true);
    }
  };
  
  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  if (!product) {
    return null;
  }
  
  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              width: '100%',
              maxHeight: 500,
              objectFit: 'contain',
              mb: { xs: 2, md: 0 }
            }}
            src={product.imageUrl || 'https://placehold.co/500x500?text=Tarzi'}
            alt={product.name}
          />
          
          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
              {product.images.slice(0, 4).map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: '1px solid #ddd'
                  }}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                />
              ))}
            </Box>
          )}
        </Grid>
        
        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating
              value={product.rating || 0}
              precision={0.5}
              readOnly
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.numReviews || 0} {t('product.reviews')})
            </Typography>
          </Box>
          
          {product.isFeatured && (
            <Chip
              label={t('product.featured')}
              color="secondary"
              size="small"
              sx={{ mb: 2 }}
            />
          )}
          
          <Typography variant="h5" color="primary" gutterBottom>
            {product.price?.toLocaleString()} {t('common.currency')}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Fabric Selection */}
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!errors.fabric}
          >
            <InputLabel id="fabric-select-label">
              {t('product.fabric')}
            </InputLabel>
            <Select
              labelId="fabric-select-label"
              id="fabric-select"
              value={selectedFabric}
              label={t('product.fabric')}
              onChange={(e) => setSelectedFabric(e.target.value)}
            >
              {product.fabricOptions?.map((fabric) => (
                <MenuItem key={fabric} value={fabric}>
                  {fabric}
                </MenuItem>
              ))}
            </Select>
            {errors.fabric && <FormHelperText>{errors.fabric}</FormHelperText>}
          </FormControl>
          
          {/* Color Selection */}
          <FormControl 
            fullWidth 
            margin="normal"
            error={!!errors.color}
          >
            <InputLabel id="color-select-label">
              {t('product.color')}
            </InputLabel>
            <Select
              labelId="color-select-label"
              id="color-select"
              value={selectedColor}
              label={t('product.color')}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {product.colorOptions?.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
            {errors.color && <FormHelperText>{errors.color}</FormHelperText>}
          </FormControl>
          
          {/* Quantity */}
          <FormControl 
            fullWidth 
            margin="normal"
            error={!!errors.quantity}
          >
            <TextField
              id="quantity"
              label={t('product.quantity')}
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            {errors.quantity && <FormHelperText>{errors.quantity}</FormHelperText>}
          </FormControl>
          
          {/* Additional Requests */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="additionalRequests"
              label={t('order.additionalRequests')}
              multiline
              rows={3}
              value={additionalRequests}
              onChange={(e) => setAdditionalRequests(e.target.value)}
            />
          </FormControl>
          
          {/* Add to Cart Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CartIcon />}
            fullWidth
            onClick={handleAddToCart}
            sx={{ mt: 3 }}
          >
            {t('product.addToCart')}
          </Button>
        </Grid>
      </Grid>
      
      {/* Product Details Tabs */}
      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product tabs"
          >
            <Tab label={t('product.description')} id="product-tab-0" />
            <Tab label={t('product.reviews')} id="product-tab-1" />
          </Tabs>
        </Box>
        
        {/* Description Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1">
            {product.description}
          </Typography>
        </TabPanel>
        
        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={1}>
          {product.numReviews > 0 ? (
            <Typography variant="body1">
              Reviews will be implemented here
            </Typography>
          ) : (
            <Typography variant="body1">
              {t('product.noReviews')}
            </Typography>
          )}
        </TabPanel>
      </Box>
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {t('product.addedToCart')}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProductDetails;