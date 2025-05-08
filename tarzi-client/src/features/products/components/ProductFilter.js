// src/features/products/components/ProductFilters.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  TextField,
  Button,
  Slider,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import productService from '../services/productService';

const ProductFilters = ({ filters, onApplyFilters }) => {
  const [categories, setCategories] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [colors, setColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [expandedPanel, setExpandedPanel] = useState('categories');

  // جلب بيانات الفلاتر
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // استدعاء API لجلب الفئات
        const categoriesResponse = await productService.getCategories();
        setCategories(categoriesResponse.data.categories);
        
        // جلب قائمة الأقمشة
        const fabricsResponse = await productService.getFabrics();
        setFabrics(fabricsResponse.data.fabrics);
        
        // جلب قائمة الألوان
        const colorsResponse = await productService.getColors();
        setColors(colorsResponse.data.colors);
        
        // جلب نطاق السعر
        const priceRangeResponse = await productService.getPriceRange();
        setPriceRange([
          priceRangeResponse.data.minPrice || 0,
          priceRangeResponse.data.maxPrice || 5000
        ]);
        
      } catch (error) {
        console.error('Error fetching filter data:', error);
        
        // استخدام بيانات وهمية في حالة الخطأ
        setCategories([
          { _id: '1', name: 'قمصان' },
          { _id: '2', name: 'بناطيل' },
          { _id: '3', name: 'بدل' },
          { _id: '4', name: 'عبايات' },
          { _id: '5', name: 'فساتين' }
        ]);
        
        setFabrics([
          { _id: 'cotton', name: 'قطن' },
          { _id: 'silk', name: 'حرير' },
          { _id: 'wool', name: 'صوف' },
          { _id: 'polyester', name: 'بوليستر' },
          { _id: 'linen', name: 'كتان' }
        ]);
        
        setColors([
          { _id: 'black', name: 'أسود', hex: '#000000' },
          { _id: 'white', name: 'أبيض', hex: '#FFFFFF' },
          { _id: 'blue', name: 'أزرق', hex: '#0000FF' },
          { _id: 'red', name: 'أحمر', hex: '#FF0000' },
          { _id: 'green', name: 'أخضر', hex: '#008000' }
        ]);
      }
    };
    
    fetchFilterData();
  }, []);

  // تحديث الفلاتر المؤقتة عندما تتغير الفلاتر
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // تغيير لوحة التوسعة
  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  // تغيير الفئة
  const handleCategoryChange = (event) => {
    setTempFilters({
      ...tempFilters,
      category: event.target.value
    });
  };

  // تغيير نطاق السعر
  const handlePriceRangeChange = (event, newValue) => {
    setTempFilters({
      ...tempFilters,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    });
  };

  // تغيير القماش
  const handleFabricChange = (event) => {
    setTempFilters({
      ...tempFilters,
      fabric: event.target.value
    });
  };

  // تغيير اللون
  const handleColorChange = (event) => {
    setTempFilters({
      ...tempFilters,
      color: event.target.value
    });
  };

  // تغيير ترتيب المنتجات
  const handleSortChange = (event) => {
    setTempFilters({
      ...tempFilters,
      sortBy: event.target.value
    });
  };

  // تطبيق الفلاتر
  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
  };

  // إعادة ضبط الفلاتر
  const handleResetFilters = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      fabric: '',
      color: '',
      sortBy: 'newest'
    };
    
    setTempFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  // قيم السعر المعروضة
  const priceText = (value) => `${value} ر.س`;

  return (
    <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          تصفية المنتجات
        </Typography>
        
        <Button
          startIcon={<ClearIcon />}
          size="small"
          onClick={handleResetFilters}
        >
          إعادة ضبط
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          ترتيب حسب
        </Typography>
        <FormControl fullWidth size="small">
          <RadioGroup
            value={tempFilters.sortBy || 'newest'}
            onChange={handleSortChange}
          >
            <FormControlLabel value="newest" control={<Radio />} label="الأحدث" />
            <FormControlLabel value="price_asc" control={<Radio />} label="السعر: من الأقل للأعلى" />
            <FormControlLabel value="price_desc" control={<Radio />} label="السعر: من الأعلى للأقل" />
            <FormControlLabel value="rating" control={<Radio />} label="التقييم" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Accordion
        expanded={expandedPanel === 'categories'}
        onChange={handlePanelChange('categories')}
        disableGutters
        elevation={0}
        sx={{ 
          '&:before': { display: 'none' },
          border: 'none',
          mb: 1
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0 }}
        >
          <Typography variant="subtitle1" fontWeight="medium">الفئات</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormControl fullWidth>
            <RadioGroup
              value={tempFilters.category || ''}
              onChange={handleCategoryChange}
            >
              <FormControlLabel value="" control={<Radio />} label="جميع الفئات" />
              {categories.map((category) => (
                <FormControlLabel
                  key={category._id}
                  value={category._id}
                  control={<Radio />}
                  label={category.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ mb: 2 }} />

      <Accordion
        expanded={expandedPanel === 'price'}
        onChange={handlePanelChange('price')}
        disableGutters
        elevation={0}
        sx={{ 
          '&:before': { display: 'none' },
          border: 'none',
          mb: 1
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0 }}
        >
          <Typography variant="subtitle1" fontWeight="medium">نطاق السعر</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={[
                tempFilters.minPrice !== '' ? parseInt(tempFilters.minPrice) : priceRange[0],
                tempFilters.maxPrice !== '' ? parseInt(tempFilters.maxPrice) : priceRange[1]
              ]}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              valueLabelFormat={priceText}
              min={priceRange[0]}
              max={priceRange[1]}
              step={50}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <TextField
                label="من"
                value={tempFilters.minPrice !== '' ? tempFilters.minPrice : priceRange[0]}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : '';
                  setTempFilters({ ...tempFilters, minPrice: value });
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ر.س</InputAdornment>,
                }}
                variant="outlined"
                size="small"
                type="number"
                sx={{ width: '45%' }}
              />
              
              <TextField
                label="إلى"
                value={tempFilters.maxPrice !== '' ? tempFilters.maxPrice : priceRange[1]}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : '';
                  setTempFilters({ ...tempFilters, maxPrice: value });
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">ر.س</InputAdornment>,
                }}
                variant="outlined"
                size="small"
                type="number"
                sx={{ width: '45%' }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ mb: 2 }} />

      <Accordion
        expanded={expandedPanel === 'fabrics'}
        onChange={handlePanelChange('fabrics')}
        disableGutters
        elevation={0}
        sx={{ 
          '&:before': { display: 'none' },
          border: 'none',
          mb: 1
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0 }}
        >
          <Typography variant="subtitle1" fontWeight="medium">نوع القماش</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormControl fullWidth>
            <RadioGroup
              value={tempFilters.fabric || ''}
              onChange={handleFabricChange}
            >
              <FormControlLabel value="" control={<Radio />} label="جميع الأقمشة" />
              {fabrics.map((fabric) => (
                <FormControlLabel
                  key={fabric._id}
                  value={fabric._id}
                  control={<Radio />}
                  label={fabric.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ mb: 2 }} />

      <Accordion
        expanded={expandedPanel === 'colors'}
        onChange={handlePanelChange('colors')}
        disableGutters
        elevation={0}
        sx={{ 
          '&:before': { display: 'none' },
          border: 'none',
          mb: 1
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0 }}
        >
          <Typography variant="subtitle1" fontWeight="medium">اللون</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <FormControl fullWidth>
            <RadioGroup
              value={tempFilters.color || ''}
              onChange={handleColorChange}
            >
              <FormControlLabel value="" control={<Radio />} label="جميع الألوان" />
              {colors.map((color) => (
                <FormControlLabel
                  key={color._id}
                  value={color._id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          mr: 1,
                          bgcolor: color.hex,
                          border: '1px solid #ddd',
                          display: 'inline-block'
                        }}
                      />
                      {color.name}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleApplyFilters}
      >
        تطبيق الفلاتر
      </Button>
      
      {/* عرض الفلاتر النشطة */}
      {Object.entries(tempFilters).some(([key, value]) => value && key !== 'sortBy') && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            الفلاتر النشطة:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tempFilters.category && (
              <Chip 
                label={`الفئة: ${categories.find(c => c._id === tempFilters.category)?.name || 'محددة'}`}
                onDelete={() => {
                  setTempFilters({ ...tempFilters, category: '' });
                }}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {(tempFilters.minPrice || tempFilters.maxPrice) && (
              <Chip 
                label={`السعر: ${tempFilters.minPrice || priceRange[0]} - ${tempFilters.maxPrice || priceRange[1]} ر.س`}
                onDelete={() => {
                  setTempFilters({ ...tempFilters, minPrice: '', maxPrice: '' });
                }}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {tempFilters.fabric && (
              <Chip 
                label={`القماش: ${fabrics.find(f => f._id === tempFilters.fabric)?.name || 'محدد'}`}
                onDelete={() => {
                  setTempFilters({ ...tempFilters, fabric: '' });
                }}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {tempFilters.color && (
              <Chip   label={`اللون: ${colors.find(c => c._id === tempFilters.color)?.name || 'محدد'}`}
              onDelete={() => {
                setTempFilters({ ...tempFilters, color: '' });
              }}
              size="small"
              color="primary"
              variant="outlined"
              icon={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: colors.find(c => c._id === tempFilters.color)?.hex || '#000',
                    mr: 1
                  }}
                />
              }
            />
          )}
        </Box>
      </Box>
    )}
  </Paper>
);
};

export default ProductFilters;