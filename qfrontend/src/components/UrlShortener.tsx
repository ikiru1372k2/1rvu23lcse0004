'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { ContentCopy, Link as LinkIcon, Schedule } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { urlValidationSchema } from '../utils/validation';
import { urlService } from '../utils/api';
import { ShortUrl } from '../types';

interface UrlShortenerProps {
  onUrlCreated?: (url: ShortUrl) => void;
}

interface FormData {
  originalUrl: string;
  validityMinutes?: number;
}

const UrlShortener: React.FC<UrlShortenerProps> = ({ onUrlCreated }) => {
  const [shortUrl, setShortUrl] = useState<ShortUrl | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(urlValidationSchema),
    defaultValues: {
      originalUrl: '',
      validityMinutes: 30,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await urlService.createShortUrl({
        originalUrl: data.originalUrl,
        validityMinutes: data.validityMinutes,
      });

      if (response.success && response.data) {
        setShortUrl(response.data);
        onUrlCreated?.(response.data);
      } else {
        setError(response.error || 'Failed to create short URL');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            URL Shortener
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Create short, memorable URLs that are easy to share
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="originalUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Enter your URL"
                      placeholder="https://example.com"
                      error={!!errors.originalUrl}
                      helperText={errors.originalUrl?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="validityMinutes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Validity (minutes)"
                      type="number"
                      inputProps={{ min: 1, max: 1440 }}
                      error={!!errors.validityMinutes}
                      helperText={errors.validityMinutes?.message || 'Default: 30 minutes'}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Shorten URL'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {shortUrl && (
            <Paper elevation={2} sx={{ mt: 3, p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                ✅ URL Shortened Successfully!
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="inherit" gutterBottom>
                  Original URL:
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 1 }}>
                  {shortUrl.originalUrl}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="inherit" gutterBottom>
                  Short URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {shortUrl.shortUrl}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={() => copyToClipboard(shortUrl.shortUrl)}
                    sx={{ minWidth: 'auto' }}
                  >
                    Copy
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<Schedule />}
                  label={`Expires: ${formatDate(shortUrl.expiresAt)}`}
                  size="small"
                  color="default"
                />
                <Chip
                  label={getTimeRemaining(shortUrl.expiresAt)}
                  size="small"
                  color={getTimeRemaining(shortUrl.expiresAt) === 'Expired' ? 'error' : 'primary'}
                />
                <Chip
                  label={`Clicks: ${shortUrl.clickCount}`}
                  size="small"
                  color="secondary"
                />
              </Box>

              <Button
                variant="outlined"
                onClick={() => {
                  setShortUrl(null);
                  reset();
                }}
                sx={{ color: 'inherit', borderColor: 'inherit' }}
              >
                Create Another URL
              </Button>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UrlShortener;
