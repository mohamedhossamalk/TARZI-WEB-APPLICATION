import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h2" component="h1" gutterBottom color="error">
            404
          </Typography>
          
          <Typography variant="h4" gutterBottom>
            {t('notFound.title')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {t('notFound.message')}
          </Typography>
          
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            sx={{ mt: 2 }}
          >
            {t('notFound.backHome')}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;