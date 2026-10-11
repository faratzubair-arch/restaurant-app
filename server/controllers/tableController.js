// server/controllers/tableController.js
const Table = require('../models/Table');

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Server error while fetching tables.' });
  }
};