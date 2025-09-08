import axios from 'axios';
import { CreateUrlRequest, CreateUrlResponse, GetStatsResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const urlService = {
  async createShortUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    try {
      const response = await api.post('/shorturls', {
        url: data.originalUrl,
        validity: data.validityMinutes,
      });
      
      // Transform backend response to frontend format
      const shortCode = response.data.shortLink.split('/').pop();
      const transformedData = {
        id: shortCode,
        originalUrl: data.originalUrl,
        shortCode: shortCode,
        shortUrl: response.data.shortLink,
        createdAt: new Date().toISOString(),
        expiresAt: response.data.expiry,
        clickCount: 0,
      };
      
      return {
        success: true,
        data: transformedData,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Failed to create short URL',
      };
    }
  },

  async getUrlStats(shortCode: string): Promise<GetStatsResponse> {
    try {
      const response = await api.get(`/shorturls/${shortCode}`);
      
      // Transform backend response to frontend format
      const transformedData = {
        shortCode: response.data.shortcode,
        originalUrl: response.data.originalUrl,
        clickCount: response.data.clickCount,
        createdAt: response.data.createdAt,
        expiresAt: response.data.expiryDate,
        clicks: response.data.clicks || [],
      };
      
      return {
        success: true,
        data: transformedData,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch URL statistics',
      };
    }
  },
};

export default api;
