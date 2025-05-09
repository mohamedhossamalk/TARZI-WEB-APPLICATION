// src/features/services/pages/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../../core/hooks/useAuth';
import professionalService from '../services/professionalService';
import ServiceGrid from '../components/ServiceGrid';

const ServicesPage = () => {
  const { isAuthenticated, isProfessional } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // فلترة وبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب الخدمات
        const servicesResponse = await professionalService.getServices({
          category: selectedCategory !== 'all' ? selectedCategory : '',
          search: searchQuery,
          sortBy: sortBy
        });
        setServices(servicesResponse.data.services);
        
        // جلب فئات الخدمات
        const categoriesResponse = await professionalService.getServiceCategories();
        setCategories(categoriesResponse.data.categories);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب الخدمات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [selectedCategory, sortBy]);

  // تطبيق الفلترة عند البحث
  const handleSearch = (e) => {
    e.preventDefault();
    // إعادة طلب الخدمات مع معيار البحث الجديد
    setLoading(true);
    // تنفيذ البحث سيتم في useEffect إذا تم تغيير searchQuery
  };

  // تغيير الفئة
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // تغيير ترتيب النتائج
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs separator={<KeyboardArrowLeftIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Typography color="text.primary">الخدمات المهنية</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          الخدمات المهنية
        </Typography>
        
        {isProfessional && (
          <Button
            component={RouterLink}
            to="/services/new"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            إضافة خدمة جديدة
          </Button>
        )}
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
        اكتشف مجموعة متنوعة من الخدمات المهنية في مجال الخياطة والتصميم، مقدمة من محترفين ذوي خبرة طويلة.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* بحث */}
          <Grid item xs={12} md={5}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="ابحث عن خدمات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button type="submit" color="primary">
                        بحث
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
          
          {/* فلترة حسب الفئة */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">الفئة</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="الفئة"
                onChange={handleCategoryChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">كل الفئات</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* الترتيب */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">الترتيب حسب</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy}
                label="الترتيب حسب"
                onChange={handleSortChange}
              >
                <MenuItem value="popularity">الأكثر شيوعاً</MenuItem>
                <MenuItem value="newest">الأحدث</MenuItem>
                <MenuItem value="price_asc">السعر: من الأقل إلى الأعلى</MenuItem>
                <MenuItem value="price_desc">السعر: من الأعلى إلى الأقل</MenuItem>
                <MenuItem value="rating">التقييم</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : services.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            لا توجد خدمات متاحة تطابق معايير البحث
          </Typography>
        </Box>
      ) : (
        <ServiceGrid services={services} />
      )}

      {isProfessional && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            هل أنت خياط أو مصمم محترف؟
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            قم بإضافة خدماتك المهنية والوصول إلى عملاء جدد من خلال منصة تارزي
          </Typography>
          <Button
            component={RouterLink}
            to="/services/manage"
            variant="contained"
            color="primary"
            size="large"
          >
            إدارة خدماتك المهنية
          </Button>
        </Box>
      )}

      {!isProfessional && !loading && (
        <Box sx={{ mt: 6, py: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            هل أنت محترف في مجال الخياطة؟
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }} color="text.secondary">
            انضم إلينا كمزود خدمة محترف وقم بالوصول إلى المزيد من العملاء وتنمية أعمالك
          </Typography>
          <Button
            component={RouterLink}
            to={isAuthenticated ? "/professional-signup" : "/register?type=professional"}
            variant="contained"
            color="secondary"
            size="large"
          >
            انضم كمحترف
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ServicesPage;