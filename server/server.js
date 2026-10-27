// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Standard middleware setup
app.use(cors());
app.use(express.json());

// Cached database connection for Vercel Serverless execution
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is missing.');
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connection established successfully.');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    throw err;
  }
};

// Middleware to ensure database connection before handling API routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Import API routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const tableRoutes = require('./routes/tableRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/tables', tableRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend service is active and healthy on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Root entry point
app.get('/', (req, res) => {
  res.status(200).send('Restaurant App Backend is running live on Vercel.');
});

// Catch-all handler for undefined endpoints (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error log:', err.stack);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Local development listener
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app;