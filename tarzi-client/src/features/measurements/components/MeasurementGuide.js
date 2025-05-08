// src/features/measurements/components/MeasurementGuide.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Straighten,
} from '@mui/icons-material';

const MeasurementGuide = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // بيانات القياسات وكيفية أخذها
  const measurementsGuide = [
    {
      name: t('measurements.height'),
      description: 'قف منتصباً بدون أحذية وقم بقياس المسافة من أعلى الرأس إلى الأرض.',
      image: '/assets/images/measurements/height.png',
    },
    {
      name: t('measurements.chest'),
      description: 'قم بقياس المحيط الأكبر للصدر، مع مرور شريط القياس أسفل الإبط وحول الصدر.',
      image: '/assets/images/measurements/chest.png',
    },
    {
      name: t('measurements.waist'),
      description: 'قم بقياس محيط الخصر عند أضيق منطقة، عادة فوق السرة بحوالي 2 سم.',
      image: '/assets/images/measurements/waist.png',
    },
    {
      name: t('measurements.hips'),
      description: 'قم بقياس المحيط الأكبر للأرداف، مع التأكد من أن شريط القياس أفقي تماماً.',
      image: '/assets/images/measurements/hips.png',
    },
    {
      name: t('measurements.shoulder'),
      description: 'قم بقياس المسافة من نهاية كتف إلى نهاية الكتف الآخر عبر الظهر.',
      image: '/assets/images/measurements/shoulder.png',
    },
    {
      name: t('measurements.sleeve'),
      description: 'قم بقياس من نقطة التقاء الكتف بالذراع، مروراً بالمرفق وحتى الرسغ والذراع مثنية قليلاً.',
      image: '/assets/images/measurements/sleeve.png',
    },
    {
      name: t('measurements.inseam'),
      description: 'قم بقياس المسافة من أعلى الجزء الداخلي للساق إلى الكاحل.',
      image: '/assets/images/measurements/inseam.png',
    },
    {
      name: t('measurements.neck'),
      description: 'قم بقياس محيط الرقبة من أسفل تفاحة آدم، مع ترك مساحة مريحة لإصبع.',
      image: '/assets/images/measurements/neck.png',
    },
  ];
  
  // نصائح عامة
  const measurementTips = [
    'استخدم شريط قياس مرن للحصول على قياسات دقيقة.',
    'قف بشكل مستقيم ومريح أثناء أخذ القياسات.',
    'خذ القياسات على الجسم مباشرة أو مع ارتداء ملابس خفيفة جداً.',
    'للحصول على أدق النتائج، اطلب المساعدة من شخص آخر لأخذ القياسات.',
    'قم بأخذ القياسات مرتين للتأكد من صحتها.',
    'لا تشد شريط القياس بشكل مفرط، ولا تتركه فضفاضاً.',
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {t('measurements.measurementGuide')}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {t('measurements.guideDescription')}
      </Typography>
      
      {/* نصائح عامة */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: 'primary.light', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            opacity: 0.1,
            transform: 'rotate(-10deg)',
            zIndex: 0,
          }}
        >
          <Straighten sx={{ fontSize: 140 }} />
        </Box>
        
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ zIndex: 1, position: 'relative' }}>
          {t('general.tips')}
        </Typography>
        
        <List sx={{ zIndex: 1, position: 'relative' }}>
          {measurementTips.map((tip, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <CheckCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={tip}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      {/* دليل القياسات */}
      <Typography variant="h6" gutterBottom>
        {t('measurements.howToMeasure')}
      </Typography>
      
      {isMobile ? (
        // عرض القياسات كأكورديون للموبايل
        <Box>
          {measurementsGuide.map((measurement, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography fontWeight="medium">{measurement.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {measurement.image && (
                    <Grid item xs={12}>
                      <Box
                        component="img"
                        src={measurement.image}
                        alt={measurement.name}
                        sx={{
                          width: '100%',
                          maxHeight: 200,
                          objectFit: 'contain',
                          mb: 1,
                        }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      {measurement.description}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        // عرض القياسات كجدول للديسكتوب
        <Grid container spacing={2}>
          {measurementsGuide.map((measurement, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  {measurement.name}
                </Typography>
                
                {measurement.image && (
                  <Box
                    component="img"
                    src={measurement.image}
                    alt={measurement.name}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'contain',
                      mb: 2,
                      alignSelf: 'center',
                    }}
                  />
                )}
                
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {measurement.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MeasurementGuide;