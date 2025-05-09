// src/features/services/components/ServiceGrid.js
import React from 'react';
import { Grid } from '@mui/material';
import ServiceCard from './ServiceCard';

const ServiceGrid = ({ services }) => {
  return (
    <Grid container spacing={3}>
      {services.map((service) => (
        <Grid item key={service._id} xs={12} sm={6} md={4}>
          <ServiceCard service={service} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceGrid;