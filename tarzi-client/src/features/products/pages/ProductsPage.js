// src/features/products/pages/ProductsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import api from '../../../core/api/axios-config';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState(queryParams.get('keyword') || '');
  const [category, setCategory] = useState(queryParams.get('category') || '');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'newest');
  
  // جلب المنتجات من API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // إنشاء معلمات الاستعلام
        const params = {
          page,
          pageSize: 12,
        };
        
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        
        // إضافة معلمات الترتيب
        switch (sortBy) {
          case 'priceAsc':
            params.sort = 'price';
            params.order = 'asc';
            break;
          case 'priceDesc':
            params.sort = 'price';
            params.order = 'desc';
            break;
          case 'rating':
            params.sort = 'rating';
            params.order = 'desc';
            break;
          default:
            params.sort = 'createdAt';
            params.order = 'desc';
        }
        
        const response = await api.get('/products', { params });
        
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.pages);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب المنتجات');
        console.error('خطأ في جلب المنتجات:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [page, keyword, category, sortBy]);
  
  // جلب الفئات من API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories);
      } catch (err) {
        console.error('خطأ في جلب الفئات:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // تحديث عنوان URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [page, keyword, category, sortBy, navigate, location.pathname]);
  
  // معالجة تغيير الصفحة
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // معالجة تغيير الفئة
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };
  
  // معالجة تغيير الترتيب
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };
  
  // معالجة البحث
  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
  };
  
  // معالجة مسح البحث
  const handleClearSearch = () => {
    setKeyword('');
    setPage(1);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        المنتجات
      </Typography>
      
      {/* فلترة وبحث */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                label="بحث"
                variant="outlined"
                size="small"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {keyword && (
                        <IconButton
                          size="small"
                          onClick={handleClearSearch}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      )}
                      <IconButton
                        type="submit"
                        size="small"
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>الفئة</InputLabel>
              <Select
                value={category}
                label="الفئة"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">جميع الفئات</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>الترتيب حسب</InputLabel>
              <Select
                value={sortBy}
                label="الترتيب حسب"
                onChange={handleSortChange}
              >
                <MenuItem value="newest">الأحدث</MenuItem>
                <MenuItem value="priceAsc">السعر: الأقل إلى الأعلى</MenuItem>
                <MenuItem value="priceDesc">السعر: الأعلى إلى الأقل</MenuItem>
                <MenuItem value="rating">التقييم</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* عرض المنتجات */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : products.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          لا توجد منتجات متطابقة مع معايير البحث
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          
          {/* ترقيم الصفحات */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 5,
                mb: 3,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductsPage;