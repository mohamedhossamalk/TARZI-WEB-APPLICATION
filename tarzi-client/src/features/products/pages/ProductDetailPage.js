// src/features/products/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Chip,
  Divider,
  Rating,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  Card,
  CardContent,
  Skeleton
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';

// دالة تنسيق العملة البسيطة
const formatCurrency = (value) => {
  return `${value.toFixed(2)} ر.س`;
};

// لنقوم بإنشاء hooks وهمية إذا لم تكن متوفرة
const useAuth = () => {
  return {
    isAuthenticated: true,
    user: { _id: '123', name: 'مستخدم تجريبي' }
  };
};

const useCart = () => {
  return {
    addToCart: (product) => {
      console.log('Adding product to cart:', product);
      // هنا يمكنك إضافة منطق إضافة المنتج إلى السلة
      alert('تمت إضافة المنتج إلى السلة');
    }
  };
};

const useMeasurements = () => {
  return {
    measurements: [
      { _id: '1', name: 'المقاس الافتراضي', isDefault: true },
      { _id: '2', name: 'مقاس مخصص', isDefault: false }
    ],
    defaultMeasurement: { _id: '1', name: 'المقاس الافتراضي', isDefault: true }
  };
};

// مكون ImageGallery بسيط
const ImageGallery = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <img 
          src={items[currentIndex]?.original || '/assets/images/placeholder.png'} 
          alt="صورة المنتج"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items.map((item, index) => (
          <Box 
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{ 
              width: 60, 
              height: 60, 
              cursor: 'pointer',
              border: currentIndex === index ? '2px solid primary.main' : '1px solid grey.300'
            }}
          >
            <img 
              src={item.thumbnail} 
              alt={`صورة مصغرة ${index}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// خدمة المنتجات البسيطة
const productService = {
  getProductById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            product: {
              _id: id,
              name: 'قميص أزرق كلاسيكي',
              description: 'قميص رجالي كلاسيكي بلون أزرق فاتح مصنوع من القطن المصري الفاخر.',
              details: 'قميص رجالي كلاسيكي مصنوع من أجود أنواع القماش، مناسب لجميع المناسبات.',
              price: 299,
              discount: 10,
              images: ['/assets/images/placeholder.png', '/assets/images/placeholder.png'],
              rating: 4.5,
              reviewsCount: 12,
              inStock: true,
              stockQuantity: 25,
              category: { _id: '1', name: 'قمصان' },
              fabricOptions: [
                { value: 'cotton', label: 'قطن' },
                { value: 'silk', label: 'حرير' }
              ],
              colorOptions: [
                { value: 'blue', label: 'أزرق', color: '#1976d2' },
                { value: 'white', label: 'أبيض', color: '#ffffff' }
              ],
              specifications: [
                { name: 'الخامة', value: 'قطن 100%' },
                { name: 'نمط', value: 'كلاسيكي' }
              ]
            }
          }
        });
      }, 500);
    });
  }
};

// مكون TabPanel المستخدم في الصفحة
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { measurements, defaultMeasurement } = useMeasurements();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [fabricChoice, setFabricChoice] = useState('');
  const [colorChoice, setColorChoice] = useState('');
  const [measurementId, setMeasurementId] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState(false);

  // جلب تفاصيل المنتج باستخدام useEffect بدلاً من useQuery
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response.data.product);
        
        // تعيين الخيارات الافتراضية
        if (response.data.product.fabricOptions && response.data.product.fabricOptions.length > 0) {
          setFabricChoice(response.data.product.fabricOptions[0].value);
        }
        
        if (response.data.product.colorOptions && response.data.product.colorOptions.length > 0) {
          setColorChoice(response.data.product.colorOptions[0].value);
        }
        
        // تعيين المقاس الافتراضي إذا كان متاحاً
        if (defaultMeasurement) {
          setMeasurementId(defaultMeasurement._id);
        }
        
      } catch (err) {
        setError('حدث خطأ أثناء جلب تفاصيل المنتج');
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, defaultMeasurement]);

  // تحويل الصور إلى التنسيق المطلوب لمكون معرض الصور
  const getGalleryImages = () => {
    if (!product || !product.images || product.images.length === 0) {
      return [
        {
          original: '/assets/images/placeholder.png',
          thumbnail: '/assets/images/placeholder.png',
        }
      ];
    }

    return product.images.map(image => ({
      original: image,
      thumbnail: image,
    }));
  };

  // تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // تغيير الكمية
  const handleQuantityChange = (event) => {
    setQuantity(Math.max(1, parseInt(event.target.value) || 1));
  };

  // إضافة إلى المفضلة
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      // إذا لم يكن المستخدم مسجلاً، توجيهه لتسجيل الدخول
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    setIsFavorite(!isFavorite);
  };

  // مشاركة المنتج
  const handleShare = () => {
    // محاكاة مشاركة المنتج
    alert('تمت مشاركة المنتج');
  };

  // إضافة إلى السلة
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    // التحقق من اختيار مقاس
    if (product.requiresMeasurements && !measurementId) {
      alert('يرجى اختيار مقاس');
      return;
    }
    
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.discount ? calculateDiscountedPrice(product.price, product.discount) : product.price,
      quantity: quantity,
      image: product.images?.[0] || '',
      fabricChoice: fabricChoice || null,
      colorChoice: colorChoice || null,
      measurementId: measurementId || null,
    });
  };

  // حساب السعر بعد الخصم
  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };
  
  // توسيع/طي الوصف
  const toggleDescription = () => {
    setExpandedDesc(!expandedDesc);
  };

  // إنشاء محتوى مؤقت أثناء التحميل
  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          component={RouterLink}
          to="/products"
          sx={{ mt: 2 }}
          variant="outlined"
        >
          العودة إلى المنتجات
        </Button>
      </Container>
    );
  }

  // التحقق من وجود المنتج
  if (!product) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="info">لم يتم العثور على المنتج</Alert>
        <Button
          component={RouterLink}
          to="/products"
          sx={{ mt: 2 }}
          variant="outlined"
        >
          العودة إلى المنتجات
        </Button>
      </Container>
    );
  }

  // حساب السعر بعد الخصم
  const discountedPrice = product.discount
    ? calculateDiscountedPrice(product.price, product.discount)
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* شريط التنقل */}
      <Breadcrumbs separator={<KeyboardArrowLeftIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Link underline="hover" color="inherit" component={RouterLink} to="/products">
          المنتجات
        </Link>
        {product.category && (
          <Link underline="hover" color="inherit" component={RouterLink} to={`/products?category=${product.category._id}`}>
            {product.category.name}
          </Link>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* صور المنتج */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <ImageGallery
              items={getGalleryImages()}
            />
          </Box>
        </Grid>

        {/* تفاصيل المنتج */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating
              value={product.rating || 0}
              precision={0.5}
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({product.reviewsCount || 0} تقييم)
            </Typography>
          </Box>

          {product.discount ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mr: 2 }}>
                {formatCurrency(discountedPrice)}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  textDecoration: 'line-through', 
                  color: 'text.secondary' 
                }}
              >
                {formatCurrency(product.price)}
              </Typography>
              <Chip 
                label={`${product.discount}% خصم`} 
                color="error" 
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
          ) : (
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
              {formatCurrency(product.price)}
            </Typography>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body1" 
              sx={{
                maxHeight: expandedDesc ? 'none' : '80px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {product.description}
            </Typography>
            {product.description && product.description.length > 200 && (
              <Button
                endIcon={expandedDesc ? <ArrowUpIcon /> : <ArrowDownIcon />}
                onClick={toggleDescription}
                sx={{ mt: 1, color: 'text.secondary' }}
                size="small"
              >
                {expandedDesc ? 'عرض أقل' : 'عرض المزيد'}
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* خيارات المنتج */}
          <Box sx={{ mb: 3 }}>
            {product.fabricOptions && product.fabricOptions.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>نوع القماش</InputLabel>
                <Select
                  value={fabricChoice}
                  label="نوع القماش"
                  onChange={(e) => setFabricChoice(e.target.value)}
                >
                  {product.fabricOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {product.colorOptions && product.colorOptions.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>اللون</InputLabel>
                <Select
                  value={colorChoice}
                  label="اللون"
                  onChange={(e) => setColorChoice(e.target.value)}
                >
                  {product.colorOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: option.color || option.value,
                            mr: 1,
                            border: '1px solid #ddd'
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {product.requiresMeasurements && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>المقاس</InputLabel>
                <Select
                  value={measurementId}
                  label="المقاس"
                  onChange={(e) => setMeasurementId(e.target.value)}
                  error={!measurementId}
                >
                  {measurements && measurements.length > 0 ? (
                    measurements.map((measurement) => (
                      <MenuItem key={measurement._id} value={measurement._id}>
                        {measurement.name}
                        {measurement.isDefault && ' (افتراضي)'}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      لا توجد مقاسات محفوظة
                    </MenuItem>
                  )}
                </Select>
                {measurements && measurements.length === 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Button 
                      component={RouterLink} 
                      to="/measurements/add" 
                      size="small" 
                      color="primary"
                    >
                      إضافة مقاس جديد
                    </Button>
                  </Box>
                )}
              </FormControl>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                type="number"
                label="الكمية"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1 }}
                sx={{ width: 100, mr: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                {product.inStock ? (
                  <>
                    {product.stockQuantity > 10 ? (
                      <Chip label="متوفر" color="success" size="small" />
                    ) : product.stockQuantity > 0 ? (
                      <Chip label={`متبقي ${product.stockQuantity} فقط`} color="warning" size="small" />
                    ) : (
                      <Chip label="غير متوفر" color="error" size="small" />
                    )}
                  </>
                ) : (
                  <Chip label="غير متوفر" color="error" size="small" />
                )}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!product.inStock || product.stockQuantity === 0}
              sx={{ flexGrow: 1, mr: 1 }}
            >
              إضافة إلى السلة
            </Button>
            
            <IconButton 
              color={isFavorite ? 'error' : 'default'}
              onClick={handleToggleFavorite}
              aria-label="أضف إلى المفضلة"
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            
            <IconButton 
              onClick={handleShare}
              aria-label="مشاركة"
            >
              <ShareIcon />
            </IconButton>
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="body2">
              <strong>التوصيل:</strong> خلال 3-7 أيام عمل
            </Typography>
            <Typography variant="body2">
              <strong>الضمان:</strong> ضمان الجودة لمدة 30 يوم
            </Typography>
            <Typography variant="body2">
              <strong>الإرجاع:</strong> خلال 14 يوم من تاريخ الاستلام
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="product tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="التفاصيل" />
          <Tab label="المواصفات" />
          <Tab label="التقييمات" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {product.details || product.description}
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {product.specifications && product.specifications.length > 0 ? (
            <Grid container spacing={2}>
              {product.specifications.map((spec, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {spec.name}
                    </Typography>
                    <Typography variant="body2">
                      {spec.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              لا توجد مواصفات متاحة لهذا المنتج.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              لا توجد تقييمات لهذا المنتج حتى الآن.
            </Typography>
          </Box>
        </TabPanel>
      </Box>

      <Box sx={{ mt: 6, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          منتجات مشابهة
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="80%" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;