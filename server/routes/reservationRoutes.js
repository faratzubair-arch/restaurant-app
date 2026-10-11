// server/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus
} = require('../controllers/reservationController');
// Middleware path corrected to authMiddleware
const { protect, managerOnly } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReservation).get(protect, managerOnly, getAllReservations);
router.route('/my').get(protect, getMyReservations);
router.route('/:id').patch(protect, managerOnly, updateReservationStatus);

module.exports = router;