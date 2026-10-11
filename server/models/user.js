const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'manager'], default: 'customer' }
}, { timestamps: true });

// Yeh line change karein taake double compilation ka error na aaye
module.exports = mongoose.models.User || mongoose.model('User', userSchema);