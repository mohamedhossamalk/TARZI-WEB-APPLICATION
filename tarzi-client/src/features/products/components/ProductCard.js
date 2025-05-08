// src/features/products/components/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import { ShoppingCart, Visibility } from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  // الصورة الرئيسية للمنتج
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : '/assets/images/placeholder.png';

  // تنسيق السعر
  const formatPrice = (price) => {
    return price.toLocaleString('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    });
  };

  // حساب السعر بعد الخصم إذا كان هناك خصم
  const hasDiscount = product.discount > 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={handleViewDetails}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={mainImage}
            alt={product.name}
          />
          {hasDiscount && (
            <Chip
              label={`خصم ${product.discount}%`}
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
              }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={product.rating || 0}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.numReviews || 0})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {hasDiscount ? (
              <>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {formatPrice(discountedPrice)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    ml: 1,
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(originalPrice)}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                {formatPrice(originalPrice)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          sx={{ mr: 1 }}
        >
          إضافة للسلة
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Visibility />}
          onClick={handleViewDetails}
        >
          التفاصيل
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;