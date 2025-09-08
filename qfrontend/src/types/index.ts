export interface ShortUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  expiresAt: string;
  clickCount: number;
}

export interface UrlStats {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt: string;
  clicks: ClickData[];
}

export interface ClickData {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  country?: string;
  city?: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  validityMinutes?: number;
}

export interface CreateUrlResponse {
  success: boolean;
  data?: ShortUrl;
  error?: string;
}

export interface GetStatsResponse {
  success: boolean;
  data?: UrlStats;
  error?: string;
}
