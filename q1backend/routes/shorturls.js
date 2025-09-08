// Backend-Test-Submission/routes/shorturls.js
// Routes for URL shortening functionality - FIXED VERSION

const express = require('express');
const router = express.Router();

// Import utilities
const { generateShortcode } = require('../utils/shortcode-generator');
const { isValidUrl } = require('../utils/url-validator');
const { saveUrl, getUrlByShortcode, incrementClickCount, getUrlStats } = require('../data/urls');

// Import logging middleware
const LoggingMiddleware = require('../../LogMiddleware/logging-middleware');
const config = require('../../LogMiddleware/config');
const logger = new LoggingMiddleware(config.ACCESS_TOKEN);

// POST /shorturls - Create a shortened URL
router.post('/shorturls', async (req, res) => {
  try {
    await logger.info('backend', 'controller', 'Creating new short URL request received');
    
    const { url, validity, shortcode } = req.body;

    // Validate required fields
    if (!url) {
      await logger.warn('backend', 'controller', 'URL creation failed - missing URL');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'URL is required'
      });
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      await logger.warn('backend', 'controller', 'URL creation failed - invalid URL format');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid URL format. Please provide a valid URL.'
      });
    }

    // Set validity (default to 30 minutes)
    const validityMinutes = validity || 30;
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + validityMinutes);

    // Generate or use provided shortcode
    let finalShortcode;
    if (shortcode) {
      // Check if custom shortcode already exists
      const existingUrl = getUrlByShortcode(shortcode);
      if (existingUrl) {
        await logger.warn('backend', 'controller', `URL creation failed - shortcode '${shortcode}' already exists`);
        return res.status(409).json({
          error: 'Conflict',
          message: 'Shortcode already exists. Please choose a different one.'
        });
      }
      finalShortcode = shortcode;
    } else {
      finalShortcode = generateShortcode();
    }

    // Save the URL
    const urlData = {
      shortcode: finalShortcode,
      originalUrl: url,
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      clickCount: 0,
      clicks: []
    };

    saveUrl(urlData);

    // Generate the short link
    const shortLink = `http://localhost:8080/${finalShortcode}`;

    await logger.info('backend', 'controller', `Short URL created successfully: ${finalShortcode} -> ${url}`);

    res.status(201).json({
      shortLink: shortLink,
      expiry: expiryDate.toISOString()
    });

  } catch (error) {
    await logger.error('backend', 'controller', `Error creating short URL: ${error.message}`);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create short URL'
    });
  }
});

// GET /shorturls/:shortcode - Get statistics for a shortcode
router.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    
    await logger.info('backend', 'controller', `Statistics requested for shortcode: ${shortcode}`);

    const urlData = getUrlByShortcode(shortcode);

    if (!urlData) {
      await logger.warn('backend', 'controller', `Statistics request failed - shortcode '${shortcode}' not found`);
      return res.status(404).json({
        error: 'Not Found',
        message: 'Shortcode not found'
      });
    }

    // Check if expired
    const now = new Date();
    const expiryDate = new Date(urlData.expiryDate);
    
    if (now > expiryDate) {
      await logger.warn('backend', 'controller', `Statistics request failed - shortcode '${shortcode}' has expired`);
      return res.status(410).json({
        error: 'Gone',
        message: 'Short link has expired'
      });
    }

    const stats = getUrlStats(shortcode);

    await logger.info('backend', 'controller', `Statistics retrieved successfully for shortcode: ${shortcode}`);

    res.json(stats);

  } catch (error) {
    await logger.error('backend', 'controller', `Error retrieving statistics: ${error.message}`);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve statistics'
    });
  }
});

// GET /:shortcode - Redirect to original URL
router.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;

    await logger.info('backend', 'controller', `Redirect requested for shortcode: ${shortcode}`);

    const urlData = getUrlByShortcode(shortcode);

    if (!urlData) {
      await logger.warn('backend', 'controller', `Redirect failed - shortcode '${shortcode}' not found`);
      return res.status(404).json({
        error: 'Not Found',
        message: 'Shortcode not found'
      });
    }

    // Check if expired
    const now = new Date();
    const expiryDate = new Date(urlData.expiryDate);
    
    if (now > expiryDate) {
      await logger.warn('backend', 'controller', `Redirect failed - shortcode '${shortcode}' has expired`);
      return res.status(410).json({
        error: 'Gone',
        message: 'Short link has expired'
      });
    }

    // Record the click
    const clickData = {
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent') || 'Unknown',
      referer: req.get('Referer') || 'Direct',
      ip: req.ip || 'Unknown',
      location: 'Unknown' // In a real app, you'd use IP geolocation
    };

    incrementClickCount(shortcode, clickData);

    await logger.info('backend', 'service', `Successful redirect: ${shortcode} -> ${urlData.originalUrl}`);

    // Redirect to original URL
    res.redirect(302, urlData.originalUrl);

  } catch (error) {
    await logger.error('backend', 'controller', `Error processing redirect: ${error.message}`);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process redirect'
    });
  }
});

module.exports = router;