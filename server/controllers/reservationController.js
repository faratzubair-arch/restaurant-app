const Reservation = require('../models/reservationModel');

const createReservation = async (req, res) => {
  try {
    const { tableNumber, guests, date, time } = req.body;

    const existingBooking = await Reservation.findOne({
      tableNumber,
      date,
      time,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Table is already booked at this date and time' });
    }

    const reservation = new Reservation({
      user: req.user._id,
      tableNumber,
      guests,
      date,
      time,
      status: 'Pending'
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    const updated = await reservation.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReservation, getMyReservations, getAllReservations, updateReservationStatus };