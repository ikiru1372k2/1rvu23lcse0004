'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Link as LinkIcon, Analytics } from '@mui/icons-material';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            URL Shortener
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button color="inherit" startIcon={<LinkIcon />}>
                Shorten URL
              </Button>
            </Link>
            <Link href="/stats" style={{ textDecoration: 'none' }}>
              <Button color="inherit" startIcon={<Analytics />}>
                View Stats
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
