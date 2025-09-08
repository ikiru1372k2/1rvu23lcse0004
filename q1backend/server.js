const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    port: PORT 
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working !',
    frontend: 'http://localhost:3000'
  });
});

// TODO: Add your routes here
// Example structure:
// app.use('/api/products', require('./routes/products'));
// app.use('/api/categories', require('./routes/categories'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

app.listen(PORT, () => {
  console.log(`
Server is running!
Listening on port ${PORT}
Health check: http://localhost:${PORT}/health
API Test: http://localhost:${PORT}/api/test
  `);
});