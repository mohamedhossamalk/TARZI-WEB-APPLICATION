// src/features/services/pages/ServiceDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  BookmarkAdd as BookmarkAddIcon,
  BookmarkAdded as BookmarkAddedIcon,
  LocalShipping as LocalShippingIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Close as CloseIcon,
  Verified as VerifiedIcon,
  VerifiedUser as VerifiedUserIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useAuth } from '../../../core/hooks/useAuth';
import professionalService from '../services/professionalService';

// مكون TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
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

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isProfessional, user } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  // حالة التبويبات
  const [tabValue, setTabValue] = useState(0);
  
  // حالة مربع حوار معرض الصور
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // مربع حوار الاتصال
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageError, setMessageError] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب تفاصيل الخدمة
        const serviceResponse = await professionalService.getServiceById(id);
        setService(serviceResponse.data.service);
        
        // جلب المراجعات
        const reviewsResponse = await professionalService.getServiceReviews(id);
        setReviews(reviewsResponse.data.reviews);
        
        // تحقق إذا كانت الخدمة مفضلة للمستخدم الحالي
        if (isAuthenticated) {
          const favoritesResponse = await professionalService.getFavoriteServices();
          const isFav = favoritesResponse.data.services.some(
            fav => fav._id === serviceResponse.data.service._id
          );
          setIsFavorite(isFav);
        }
        
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب تفاصيل الخدمة');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [id, isAuthenticated]);

  // تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // فتح معرض الصور
  const handleOpenGallery = (index) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  // إغلاق معرض الصور
  const handleCloseGallery = () => {
    setGalleryOpen(false);
  };

  // التنقل بين الصور
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? service.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === service.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // إضافة/إزالة من المفضلة
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }
    
    try {
      if (isFavorite) {
        await professionalService.removeFromFavorites(id);
      } else {
        await professionalService.addToFavorites(id);
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite status:', err);
    }
  };

  // فتح مربع حوار الاتصال
  const handleOpenContactDialog = () => {
    setContactDialogOpen(true);
  };

  // إغلاق مربع حوار الاتصال
  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
    setMessageText('');
    setMessageError(null);
    
    // بعد إغلاق مربع الحوار بعد الإرسال الناجح
    if (messageSent) {
      setTimeout(() => {
        setMessageSent(false);
      }, 500);
    }
  };

  // إرسال رسالة للمحترف
  const handleSendMessage = async () => {
    try {
      setSendingMessage(true);
      setMessageError(null);
      
      if (!messageText.trim()) {
        setMessageError('يرجى كتابة رسالة');
        setSendingMessage(false);
        return;
      }
      
      await professionalService.sendMessageToProfessional({
        professionalId: service.professional._id,
        serviceId: service._id,
        message: messageText
      });
      
      setMessageSent(true);
      setMessageText('');
      
      // إغلاق مربع الحوار بعد لحظات
      setTimeout(() => {
        handleCloseContactDialog();
      }, 2000);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setMessageError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setSendingMessage(false);
    }
  };

  // حساب متوسط التقييم
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !service) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'لم يتم العثور على الخدمة'}
        </Alert>
        <Button
          component={RouterLink}
          to="/services"
          sx={{ mt: 2 }}
          variant="outlined"
          startIcon={<KeyboardArrowLeftIcon />}
        >
          العودة إلى الخدمات
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* شريط التنقل */}
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
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/services"
        >
          الخدمات المهنية
        </Link>
        <Typography color="text.primary">{service.title}</Typography>
      </Breadcrumbs>

      {/* رأس الصفحة */}
      <Grid container spacing={3}>
        {/* الجزء الأيسر: صورة الخدمة الرئيسية */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={service.images?.[0] || '/assets/images/service-placeholder.jpg'}
              alt={service.title}
              onClick={() => handleOpenGallery(0)}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                }
              }}
            />
            
            {service.images && service.images.length > 1 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PhotoLibraryIcon />}
                size="small"
                onClick={() => handleOpenGallery(0)}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  opacity: 0.9,
                }}
              >
                عرض الصور ({service.images.length})
              </Button>
            )}
          </Box>
          
          {/* معرض الصور المصغرة */}
          {service.images && service.images.length > 1 && (
            <Box sx={{ display: 'flex', mt: 2, gap: 1, overflowX: 'auto' }}>
              {service.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${service.title} - صورة ${index + 1}`}
                  onClick={() => handleOpenGallery(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    border: index === 0 ? '2px solid' : '1px solid',
                    borderColor: index === 0 ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>
        
        {/* الجزء الأيمن: معلومات الخدمة */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={service.category?.name || 'خدمة مهنية'} 
                color="primary" 
                size="small"
                variant="outlined"
              />
              
              {/* حالة الخدمة */}
              {service.isVerified && (
                <Chip 
                  icon={<VerifiedIcon />}
                  label="خدمة موثقة" 
                  color="success" 
                  size="small"
                  sx={{ mr: 1 }}
                />
              )}
            </Box>
            
            {/* عنوان الخدمة */}
            <Typography variant="h4" component="h1" gutterBottom>
              {service.title}
            </Typography>
            
            {/* التقييم */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={service.rating || 0} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({service.reviewsCount || reviews.length} تقييم)
              </Typography>
            </Box>
            
            {/* السعر */}
            <Typography variant="h5" color="primary.main" sx={{ mb: 3, fontWeight: 'bold' }}>
              {service.price} ر.س
            </Typography>
            
            {/* وقت التسليم */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                مدة التنفيذ: <strong>{service.deliveryTime}</strong> {service.deliveryTime > 10 ? 'يوم' : 'أيام'}
              </Typography>
            </Box>
            
            {/* مقدم الخدمة */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={service.professional?.avatar}
                alt={service.professional?.name}
                sx={{ mr: 1 }}
              />
              <Box>
                <Typography variant="body1">
                  <RouterLink 
                    to={`/professionals/${service.professional?._id}`}
                    style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                  >
                    {service.professional?.name}
                  </RouterLink>
                  {service.professional?.isVerified && (
                    <VerifiedUserIcon 
                      fontSize="small" 
                      color="primary" 
                      sx={{ ml: 0.5, verticalAlign: 'middle' }} 
                    />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  مقدم خدمة محترف
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* وصف مختصر */}
            <Typography variant="body1" paragraph>
              {service.shortDescription || service.description?.substring(0, 200) + (service.description?.length > 200 ? '...' : '')}
            </Typography>
            
            {/* ميزات مختصرة */}
            {service.features && service.features.length > 0 && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  تتضمن الخدمة:
                </Typography>
                <List dense disablePadding>
                  {service.features.slice(0, 3).map((feature, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
                {service.features.length > 3 && (
                  <Button 
                    onClick={() => setTabValue(0)} 
                    sx={{ mt: 1 }}
                    size="small"
                  >
                    عرض جميع المميزات ({service.features.length})
                  </Button>
                )}
              </Box>
            )}
            
            {/* أزرار العمليات */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<MessageIcon />}
                  onClick={handleOpenContactDialog}
                >
                  تواصل مع المحترف
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  component={RouterLink}
                  to="/login"
                  state={{ from: `/services/${id}` }}
                  startIcon={<MessageIcon />}
                >
                  سجل دخول للتواصل
                </Button>
              )}
              
              <Button
                variant={isFavorite ? "outlined" : "outlined"}
                color={isFavorite ? "secondary" : "primary"}
                startIcon={isFavorite ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
                onClick={handleToggleFavorite}
                disabled={!isAuthenticated}
              >
                {isFavorite ? 'تمت الإضافة' : 'أضف للمفضلة'}
              </Button>
              
              {/* زر التعديل للمحترف صاحب الخدمة */}
              {isProfessional && user && service.professional._id === user._id && (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  to={`/services/edit/${service._id}`}
                >
                  تعديل
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* تبويبات المحتوى */}
      <Box sx={{ width: '100%', mt: 4 }}>
        <Paper>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="التفاصيل" />
              <Tab label="المراجعات والتقييمات" />
              <Tab label="الأسئلة الشائعة" />
            </Tabs>
          </Box>
          
          {/* تبويب التفاصيل */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  وصف الخدمة
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {service.description}
                </Typography>
                
                {/* ميزات الخدمة */}
                {service.features && service.features.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      ما الذي تتضمنه الخدمة
                    </Typography>
                    <Grid container spacing={2}>
                      {service.features.map((feature, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <ListItem disableGutters>
                            <ListItemIcon>
                              <CheckIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                          </ListItem>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    معلومات إضافية
                  </Typography>
                  <List dense>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocalShippingIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="وقت التسليم"
                        secondary={`${service.deliveryTime} ${service.deliveryTime > 10 ? 'يوم' : 'أيام'}`}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AttachMoneyIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="السعر"
                        secondary={`${service.price} ر.س`}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold', color: 'primary.main' }}
                      />
                    </ListItem>
                    
                    {service.category && (
                      <ListItem disableGutters>
                        <ListItemText
                          primary="الفئة"
                          secondary={service.category.name}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                    
                    <ListItem disableGutters>
                      <ListItemText
                        primary="تاريخ الإضافة"
                        secondary={new Date(service.createdAt).toLocaleDateString('ar-EG')}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* تبويب المراجعات */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    التقييمات والمراجعات
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={calculateAverageRating()} precision={0.5} readOnly size="large" />
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {calculateAverageRating().toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({reviews.length} مراجعة)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {isAuthenticated && (
                  <Button 
                    variant="contained"
                    color="primary"
                  >
                    أضف تقييمك
                  </Button>
                )}
              </Box>
              
              <Divider sx={{ mb: 4 }} />
              
              {reviews.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    لا توجد تقييمات لهذه الخدمة حتى الآن
                  </Typography>
                </Box>
              ) : (
                reviews.map((review) => (
                  <Paper 
                    key={review._id} 
                    variant="outlined"
                    sx={{ p: 3, mb: 3 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={review.user.avatar} 
                        alt={review.user.name}
                        sx={{ mr: 2 }}
                      >
                        {review.user.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {review.user.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={review.rating} size="small" readOnly />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                      {review.comment}
                    </Typography>
                    
                    {review.professionalResponse && (
                      <Box sx={{ mt: 2, pr: 2, borderRight: 2, borderColor: 'primary.main' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary">
                          رد مقدم الخدمة
                        </Typography>
                        <Typography variant="body2">
                          {review.professionalResponse}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))
              )}
              
              {reviews.length > 5 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Button variant="outlined">
                    عرض المزيد من التقييمات
                  </Button>
                </Box>
              )}
            </Box>
          </TabPanel>
          
          {/* تبويب الأسئلة الشائعة */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              الأسئلة الشائعة
            </Typography>
            
            {service.faqs && service.faqs.length > 0 ? (
              service.faqs.map((faq, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {faq.question}
                  </Typography>
                  <Typography variant="body1">
                    {faq.answer}
                  </Typography>
                  {index < service.faqs.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))
            ) : (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  لا توجد أسئلة شائعة متاحة لهذه الخدمة
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>
      </Box>
      
      {/* مربع حوار معرض الصور */}
      <Dialog
        open={galleryOpen}
        onClose={handleCloseGallery}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">معرض الصور</Typography>
            <IconButton onClick={handleCloseGallery} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={service.images?.[currentImageIndex]}
              alt={`${service.title} - صورة ${currentImageIndex + 1}`}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto'
              }}
            />
            
            {service.images && service.images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </>
            )}
          </Box>
              {/* صور مصغرة للتنقل */}
          {service.images && service.images.length > 1 && (
            <Box sx={{ display: 'flex', mt: 2, gap: 1, overflowX: 'auto', justifyContent: 'center' }}>
              {service.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${service.title} - صورة مصغرة ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    border: currentImageIndex === index ? '2px solid' : '1px solid',
                    borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1, mr: 2 }}>
            {currentImageIndex + 1} من {service.images?.length || 0}
          </Typography>
          <Button onClick={handleCloseGallery}>إغلاق</Button>
        </DialogActions>
      </Dialog>
      
      {/* مربع حوار التواصل مع المحترف */}
      <Dialog
        open={contactDialogOpen}
        onClose={!sendingMessage ? handleCloseContactDialog : undefined}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          تواصل مع {service.professional?.name}
        </DialogTitle>
        <DialogContent>
          {messageError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {messageError}
            </Alert>
          )}
          
          {messageSent ? (
            <Alert severity="success">
              تم إرسال رسالتك بنجاح! سيقوم المحترف بالرد عليك قريباً.
            </Alert>
          ) : (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                يرجى كتابة رسالتك بخصوص الخدمة "{service.title}". سيتواصل معك المحترف في أقرب وقت ممكن.
              </DialogContentText>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  تفاصيل الخدمة:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={service.images?.[0]}
                    alt={service.title}
                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {service.price} ر.س
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <TextField
                autoFocus
                multiline
                rows={4}
                label="الرسالة"
                fullWidth
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={sendingMessage}
                placeholder="اكتب رسالتك هنا... (مثال: أرغب في الاستفسار عن تفاصيل الخدمة)"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="caption" color="text.secondary">
                * سيتم إرسال رسالتك إلى {service.professional?.name} وسيتم إعلامك عند الرد عليها في صفحة الرسائل
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog} disabled={sendingMessage}>
            إلغاء
          </Button>
          {!messageSent && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSendMessage}
              disabled={sendingMessage || messageText.trim() === ''}
              startIcon={sendingMessage && <CircularProgress size={20} color="inherit" />}
            >
              {sendingMessage ? 'جاري الإرسال...' : 'إرسال'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* خدمات مشابهة */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          خدمات مشابهة قد تعجبك
        </Typography>
        <Grid container spacing={3}>
          {service.relatedServices && service.relatedServices.length > 0 ? (
            service.relatedServices.map((relatedService) => (
              <Grid item key={relatedService._id} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={relatedService.image || '/assets/images/service-placeholder.jpg'}
                    alt={relatedService.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" component="div" gutterBottom noWrap>
                      {relatedService.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={relatedService.rating || 0} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({relatedService.reviewsCount || 0})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary.main">
                      {relatedService.price} ر.س
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to={`/services/${relatedService._id}`}
                      variant="outlined"
                      fullWidth
                    >
                      عرض الخدمة
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  لا توجد خدمات مشابهة متاحة حالياً
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* بطاقة المعلومات في أسفل الصفحة للمزيد عن المحترف */}
      <Paper sx={{ p: 3, mt: 6, backgroundColor: 'background.paper' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={service.professional?.avatar}
                alt={service.professional?.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {service.professional?.name}
                  {service.professional?.isVerified && (
                    <VerifiedUserIcon 
                      fontSize="small" 
                      color="primary" 
                      sx={{ ml: 0.5, verticalAlign: 'middle' }} 
                    />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  محترف في {service.category?.name || 'الخياطة والتفصيل'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Rating value={service.professional?.rating || 0} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({service.professional?.reviewsCount || 0} تقييم)
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph>
              {service.professional?.bio || 'محترف متخصص في مجال الخياطة والتفصيل يقدم خدمات عالية الجودة لعملائه.'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
              <Button
                component={RouterLink}
                to={`/professionals/${service.professional?._id}`}
                variant="outlined"
                startIcon={<PersonIcon />}
              >
                عرض الملف الشخصي
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<MessageIcon />}
                onClick={handleOpenContactDialog}
                disabled={!isAuthenticated}
              >
                تواصل مع المحترف
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ServiceDetailPage;