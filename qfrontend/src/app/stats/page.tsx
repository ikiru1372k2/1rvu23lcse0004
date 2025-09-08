'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import UrlStats from '../../components/UrlStats';

const StatsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          URL Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Track clicks, locations, and performance of your shortened URLs
        </Typography>
      </Box>
      
      <UrlStats />
    </Container>
  );
};

export default StatsPage;

