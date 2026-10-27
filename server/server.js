// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Standard middleware setup
app.use(cors());
app.use(express.json());

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

// Health check endpoint for Render service monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend service is active and healthy on Render',
    timestamp: new Date().toISOString()
  });
});

// Root entry point
app.get('/', (req, res) => {
  res.status(200).send('Restaurant App Backend is running live on Render.');
});

// Catch-all handler for undefined endpoints (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error log:', err.stack);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Port configuration (Render dynamically sets process.env.PORT)
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB Atlas and initialize HTTP server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });