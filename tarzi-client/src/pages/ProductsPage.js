import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  InputAdornment,
  Divider,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import ProductList from '../components/products/ProductList';
import { getProducts } from '../store/actions/productActions';

const ProductsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, loading, error } = useSelector(state => state.products);
  
  // Get category from URL if available
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    category: categoryFromUrl || '',
    priceRange: [0, 10000],
    sort: 'newest'
  });
  
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock categories - would come from API in production
  const categories = [
    { _id: 'cat1', name: 'قمصان' },
    { _id: 'cat2', name: 'بناطيل' },
    { _id: 'cat3', name: 'جاكيتات' },
    { _id: 'cat4', name: 'بدل' }
  ];
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value
    }));
    setPage(1); // Reset to first page on filter change
  };
  
  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    handleFilterChange('priceRange', newValue);
  };
  
  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  // Fetch products when filters or pagination change
  useEffect(() => {
    const apiFilters = {
      page,
      search: filters.search,
      category: filters.category,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      sort: filters.sort
    };
    
    dispatch(getProducts(apiFilters));
  }, [dispatch, page, filters]);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('nav.products')}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Mobile filter toggle */}
        <Grid item xs={12} sx={{ display: { md: 'none' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder={t('common.search')}
              variant="outlined"
              size="small"
              fullWidth
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 1 }}
            />
            <IconButton 
              color="primary"
              onClick={toggleFilters}
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <FilterIcon />
            </IconButton>
          </Box>
        </Grid>
        
        {/* Filters sidebar */}
        <Grid 
          item 
          xs={12} 
          md={3}
          sx={{ 
            display: { 
              xs: showFilters ? 'block' : 'none', 
              md: 'block' 
            } 
          }}
        >
          <Paper sx={{ p: 2, mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
              {t('product.filters')}
            </Typography>
            
            {/* Search input (desktop) */}
            <Box sx={{ mb: 3, display: { xs: 'none', md: 'block' } }}>
              <TextField
                label={t('common.search')}
                variant="outlined"
                size="small"
                fullWidth
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Categories */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-select-label">
                  {t('product.category')}
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={filters.category}
                  label={t('product.category')}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">
                    {t('product.allCategories')}
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography id="price-range-slider" gutterBottom>
                {t('product.priceRange')}
              </Typography>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {filters.priceRange[0]} {t('common.currency')}
                </Typography>
                <Typography variant="body2">
                  {filters.priceRange[1]} {t('common.currency')}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Sort */}
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-select-label">
                  {t('product.sort')}
                </InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={filters.sort}
                  label={t('product.sort')}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <MenuItem value="newest">{t('product.newest')}</MenuItem>
                  <MenuItem value="price_asc">{t('product.priceLowToHigh')}</MenuItem>
                  <MenuItem value="price_desc">{t('product.priceHighToLow')}</MenuItem>
                  <MenuItem value="rating">{t('product.topRated')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>
        
        {/* Product list */}
        <Grid item xs={12} md={9}>
          <ProductList
            products={products}
            loading={loading}
            error={error}
            totalPages={5} // This would come from API pagination info
            page={page}
            onPageChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsPage;