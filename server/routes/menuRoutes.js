// server/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

const { protect, managerOnly } = require('../middleware/authMiddleware');

// Public routes (Koi bhi dekh sakta hai)
router.route('/')
  .get(getMenuItems)
  .post(protect, managerOnly, createMenuItem); // Sirf manager add kar sakta hai

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, managerOnly, updateMenuItem)    // Sirf manager update kar sakta hai
  .delete(protect, managerOnly, deleteMenuItem); // Sirf manager delete kar sakta hai

module.exports = router;