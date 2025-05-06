import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Stack
} from '@mui/material';
import { addToCart } from '../../store/actions/cartActions';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const {
    _id,
    name,
    description,
    price,
    imageUrl,
    rating,
    numReviews,
    isFeatured
  } = product;
  
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {isFeatured && (
        <Chip
          label={t('product.featured')}
          color="secondary"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1
          }}
        />
      )}
      
      <CardMedia
        component="img"
        height="200"
        image={imageUrl || 'https://placehold.co/300x200?text=Tarzi'}
        alt={name}
        sx={{
          objectFit: 'cover'
        }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {name}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={rating || 0}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({numReviews || 0})
          </Typography>
        </Box>
        
        <Typography variant="h6" component="div" color="primary.main">
          {price.toLocaleString()} {t('common.currency')}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to={`/products/${_id}`}
            size="small"
            variant="outlined"
            sx={{ flex: 1 }}
          >
            {t('product.details')}
          </Button>
          
          <Button
            size="small"
            variant="contained"
            onClick={handleAddToCart}
            sx={{ flex: 1 }}
          >
            {t('product.addToCart')}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default ProductCard;