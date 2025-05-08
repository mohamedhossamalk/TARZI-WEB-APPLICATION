// src/features/products/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  Paper,
  Chip,
  Rating,
  Breadcrumbs,
  Link,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Home,
} from '@mui/icons-material';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import productService from '../services/productService';
import { useCart } from '../../../core/hooks/useCart';
import { useMeasurements } from '../../../core/hooks/useMeasurements';
import { useAuth } from '../../../core/hooks/useAuth';

// مكون تبويب المنتج
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { measurements, isLoading: measurementsLoading } = useMeasurements();
  
  const [quantity, setQuantity] = useState(1);
  const [fabricChoice, setFabricChoice] = useState('');
  const [colorChoice, setColorChoice] = useState('');
  const [measurementId, setMeasurementId] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // جلب بيانات المنتج
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery(['product', id], () => productService.getProductById(id));

  // قائمة الصور للمعرض
  const images = product
    ? product.images.map((img) => ({
        original: img,
        thumbnail: img,
      }))
    : [];
  
  // ضمان وجود صورة واحدة على الأقل
  if (images.length === 0) {
    images.push({
      original: '/assets/images/placeholder.png',
      thumbnail: '/assets/images/placeholder.png',
    });
  }

  // تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // تغيير الكمية
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  // تبديل المفضلة
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // يمكن إضافة منطق لحفظ المفضلة في API
  };

  // مشاركة المنتج
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط المنتج إلى الحافظة');
    }
  };

  // إضافة إلى السلة
  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product, quantity, fabricChoice, colorChoice, measurementId);
    } else {
      navigate('/login', { state: { from: window.location.pathname } });
    }
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    return price.toLocaleString('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    });
  };

  // حساب السعر بعد الخصم إذا كان هناك خصم
  const hasDiscount = product?.discount > 0;
  const originalPrice = product?.price || 0;
  const discountedPrice = hasDiscount
    ? originalPrice - (originalPrice * product.discount / 100)
    : originalPrice;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* شريط التنقل */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Link
          component={RouterLink}
          to="/products"
          color="inherit"
          underline="hover"
        >
          المنتجات
        </Link>
        <Typography color="text.primary">{product?.name || 'تفاصيل المنتج'}</Typography>
      </Breadcrumbs>
      
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.response?.data?.message ||
            'حدث خطأ في تحميل بيانات المنتج. يرجى المحاولة مرة أخرى.'}
        </Alert>
      )}
      
      {isLoading ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={30} width="30%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} width="50%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" height={50} width="40%" />
              <Skeleton variant="rectangular" height={50} width="40%" />
            </Box>
          </Grid>
        </Grid>
      ) : (
        product && (
          <Grid container spacing={4}>
            {/* معرض الصور */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2}>
                <ImageGallery
                  items={images}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                  thumbnailPosition="bottom"
                />
              </Paper>
            </Grid>
            
            {/* تفاصيل المنتج */}
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    {product.name}
                  </Typography>
                  <Box>
                    <IconButton
                      aria-label="أضف إلى المفضلة"
                      onClick={handleToggleFavorite}
                      color={isFavorite ? 'error' : 'default'}
                    >
                      {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton aria-label="مشاركة المنتج" onClick={handleShare}>
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* التقييم */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={product.rating || 0} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    ({product.numReviews || 0} تقييم)
                  </Typography>
                  
                  {product.category && (
                    <Chip
                      label={product.category.name}
                      variant="outlined"
                      size="small"
                      color="primary"
                      component={RouterLink}
                      to={`/products?category=${product.category._id}`}
                      clickable
                      sx={{ mr: 1 }}
                    />
                  )}
                </Box>
                
                {/* السعر */}
                <Box sx={{ mb: 3 }}>
                  {hasDiscount ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        {formatPrice(discountedPrice)}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                          mr: 2,
                          textDecoration: 'line-through',
                        }}
                      >
                        {formatPrice(originalPrice)}
                      </Typography>
                      <Chip
                        label={`خصم ${product.discount}%`}
                        color="error"
                        size="small"
                      />
                    </Box>
                  ) : (
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      {formatPrice(originalPrice)}
                    </Typography>
                  )}
                </Box>
                
                {/* الوصف المختصر */}
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                {/* خيارات المنتج */}
                <Grid container spacing={2}>
                  {/* اختيار القماش */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="fabric-label">اختيار القماش</InputLabel>
                      <Select
                        labelId="fabric-label"
                        id="fabric-select"
                        value={fabricChoice}
                        label="اختيار القماش"
                        onChange={(e) => setFabricChoice(e.target.value)}
                      >
                        <MenuItem value="قطن">قطن</MenuItem>
                        <MenuItem value="كتان">كتان</MenuItem>
                        <MenuItem value="حرير">حرير</MenuItem>
                        <MenuItem value="صوف">صوف</MenuItem>
                        <MenuItem value="بوليستر">بوليستر</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* اختيار اللون */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="color-label">اختيار اللون</InputLabel>
                      <Select
                        labelId="color-label"
                        id="color-select"
                        value={colorChoice}
                        label="اختيار اللون"
                        onChange={(e) => setColorChoice(e.target.value)}
                      >
                        <MenuItem value="أبيض">أبيض</MenuItem>
                        <MenuItem value="أسود">أسود</MenuItem>
                        <MenuItem value="أزرق">أزرق</MenuItem>
                        <MenuItem value="أحمر">أحمر</MenuItem>
                        <MenuItem value="رمادي">رمادي</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* اختيار المقاس */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="measurement-label">اختيار المقاس</InputLabel>
                      <Select
                        labelId="measurement-label"
                        id="measurement-select"
                        value={measurementId}
                        label="اختيار المقاس"
                        onChange={(e) => setMeasurementId(e.target.value)}
                      >
                        {measurementsLoading ? (
                          <MenuItem disabled>جاري تحميل المقاسات...</MenuItem>
                        ) : measurements && measurements.length > 0 ? (
                          measurements.map((measurement) => (
                            <MenuItem key={measurement._id} value={measurement._id}>
                              {measurement.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            لا توجد مقاسات محفوظة
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* اختيار الكمية */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="quantity"
                      label="الكمية"
                      type="number"
                      fullWidth
                      value={quantity}
                      onChange={handleQuantityChange}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  {!isAuthenticated && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      يجب تسجيل الدخول أولاً لإضافة المنتج إلى السلة
                    </Alert>
                  )}
                  
                  {isAuthenticated && !measurementId && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      يجب اختيار المقاس قبل إضافة المنتج إلى السلة.
                      {measurements?.length === 0 && (
                        <> يرجى <Link component={RouterLink} to="/measurements">إضافة مقاس جديد</Link> أولاً.</>
                      )}
                    </Alert>
                  )}
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    fullWidth
                    disabled={isAuthenticated ? !measurementId : false}
                  >
                    إضافة إلى السلة
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )
      )}
      
      {/* التبويبات */}
      {!isLoading && product && (
        <Box sx={{ width: '100%', mt: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="product tabs"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="الوصف التفصيلي" id="product-tab-0" />
              <Tab label="المواصفات" id="product-tab-1" />
              <Tab label="التقييمات" id="product-tab-2" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1">
              {product.description}
            </Typography>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {spec.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {spec.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center" color="text.secondary">
                    لا توجد مواصفات متاحة لهذا المنتج
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {product.reviews && product.reviews.length > 0 ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    متوسط التقييم
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {product.rating.toFixed(1)}
                    </Typography>
                    <Rating value={product.rating} precision={0.1} readOnly size="large" />
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      ({product.reviews.length} تقييم)
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {product.reviews.map((review, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 2 }}>{review.username?.charAt(0) || 'U'}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {review.username || 'مستخدم'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={review.rating} precision={0.5} readOnly size="small" />
                          <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
                            {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body1" paragraph>
                      {review.comment}
                    </Typography>
                    {index < product.reviews.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  لا توجد تقييمات حتى الآن
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  كن أول من يقيم هذا المنتج بعد الشراء
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Box>
      )}
      
      {/* المنتجات المشابهة */}
      {!isLoading && product && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            منتجات مشابهة
          </Typography>
          <Grid container spacing={3}>
            {isLoading ? (
              Array.from(new Array(4)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={30} width="80%" />
                      <Skeleton variant="text" height={20} width="40%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              // يمكن إضافة المنطق لجلب وعرض المنتجات المشابهة
              <Grid item xs={12}>
                <Typography variant="body1" align="center" color="text.secondary">
                  سيتم عرض المنتجات المشابهة هنا
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetailPage;