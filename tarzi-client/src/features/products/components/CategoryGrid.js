// src/features/products/components/CategoryGrid.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert
} from '@mui/material';
import productService from '../services/productService';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getCategories();
        setCategories(response.data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('حدث خطأ أثناء جلب الفئات');
        
        // استخدام بيانات وهمية في حالة الفشل
        setCategories([
          { _id: '1', name: 'قمصان', imageUrl: '/assets/images/categories/shirts.jpg' },
          { _id: '2', name: 'بناطيل', imageUrl: '/assets/images/categories/pants.jpg' },
          { _id: '3', name: 'بدل', imageUrl: '/assets/images/categories/suits.jpg' },
          { _id: '4', name: 'عبايات', imageUrl: '/assets/images/categories/abayas.jpg' },
          { _id: '5', name: 'فساتين', imageUrl: '/assets/images/categories/dresses.jpg' },
          { _id: '6', name: 'أحذية', imageUrl: '/assets/images/categories/shoes.jpg' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {categories.map((category) => (
        <Grid item xs={6} sm={4} md={2} key={category._id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 5
              },
              borderRadius: 2
            }}
          >
            <CardActionArea
              component={RouterLink}
              to={`/products?category=${category._id}`}
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                image={category.imageUrl || `/assets/images/categories/placeholder.jpg`}
                alt={category.name}
                sx={{
                  height: 140,
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div">
                  {category.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid;