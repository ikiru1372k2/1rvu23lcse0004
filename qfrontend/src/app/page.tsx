'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import UrlShortener from '../components/UrlShortener';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to URL Shortener
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Transform long URLs into short, shareable links and track their performance
        </Typography>
      </Box>
      
      <UrlShortener />
    </Container>
  );
};

export default HomePage;