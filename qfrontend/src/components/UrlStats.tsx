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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { Search, Link as LinkIcon, Schedule, Visibility, LocationOn } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { shortCodeValidationSchema } from '../utils/validation';
import { urlService } from '../utils/api';
import { UrlStats as UrlStatsType } from '../types';

interface FormData {
  shortCode: string;
}

const UrlStats: React.FC = () => {
  const [stats, setStats] = useState<UrlStatsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(shortCodeValidationSchema),
    defaultValues: {
      shortCode: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // Extract short code from full URL if provided
      let shortCode = data.shortCode;
      if (shortCode.includes('http://') || shortCode.includes('https://')) {
        const urlParts = shortCode.split('/');
        shortCode = urlParts[urlParts.length - 1];
      }

      const response = await urlService.getUrlStats(shortCode);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch URL statistics');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
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

  const getLocationString = (click: any) => {
    if (click.country && click.city) {
      return `${click.city}, ${click.country}`;
    } else if (click.country) {
      return click.country;
    }
    return 'Unknown';
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            <Visibility sx={{ mr: 1, verticalAlign: 'middle' }} />
            URL Statistics
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            View detailed analytics for your shortened URLs
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={8}>
                <Controller
                  name="shortCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Enter Short Code or Full URL"
                      placeholder="abc123 or http://localhost:8080/abc123"
                      error={!!errors.shortCode}
                      helperText={errors.shortCode?.message || 'Enter the 6-8 character short code or full URL'}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                  sx={{ height: '56px' }}
                >
                  {loading ? 'Loading...' : 'Get Stats'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {stats && (
            <Box sx={{ mt: 3 }}>
              <Paper elevation={2} sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h5" gutterBottom>
                  📊 URL Analytics
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="inherit" gutterBottom>
                      Original URL:
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {stats.originalUrl}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="inherit" gutterBottom>
                      Short Code:
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                      {stats.shortCode}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    icon={<Visibility />}
                    label={`Total Clicks: ${stats.clickCount}`}
                    size="medium"
                    color="default"
                  />
                  <Chip
                    icon={<Schedule />}
                    label={`Created: ${formatDate(stats.createdAt)}`}
                    size="medium"
                    color="default"
                  />
                  <Chip
                    label={getTimeRemaining(stats.expiresAt)}
                    size="medium"
                    color={getTimeRemaining(stats.expiresAt) === 'Expired' ? 'error' : 'primary'}
                  />
                </Box>
              </Paper>

              {stats.clicks.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Click History ({stats.clicks.length} clicks)
                  </Typography>
                  
                  <TableContainer component={Paper} elevation={1}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>IP Address</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>User Agent</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.clicks.map((click, index) => (
                          <TableRow key={click.id || index}>
                            <TableCell>
                              {formatDate(click.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {click.ipAddress}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn fontSize="small" />
                                {getLocationString(click)}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {click.userAgent}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {stats.clicks.length === 0 && (
                <Paper elevation={1} sx={{ p: 3, mt: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No clicks recorded yet for this URL.
                  </Typography>
                </Paper>
              )}

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setStats(null);
                  }}
                >
                  Search Another URL
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UrlStats;
