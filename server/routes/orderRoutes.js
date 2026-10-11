// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
// File ka naam authMiddleware rakha hai is liye yahan path theek kar diya hai
const { protect, managerOnly } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, managerOnly, getAllOrders);
router.route('/my').get(protect, getMyOrders);
router.route('/:id/status').patch(protect, managerOnly, updateOrderStatus);

module.exports = router;