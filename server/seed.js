// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const Table = require('./models/Table');

// Load environment variables
dotenv.config();

const menuItems = [
  { name: 'Chicken Biryani', description: 'Spicy traditional rice dish with tender chicken', price: 450, category: 'Main Course', isAvailable: true },
  { name: 'Beef Karahi', description: 'Rich and spicy beef curry cooked in a wok', price: 1200, category: 'Main Course', isAvailable: true },
  { name: 'Seekh Kabab', description: 'Juicy grilled minced meat skewers', price: 350, category: 'Appetizers', isAvailable: true },
  { name: 'Garlic Naan', description: 'Soft flatbread brushed with garlic and butter', price: 80, category: 'Appetizers', isAvailable: true },
  { name: 'Mango Lassi', description: 'Refreshing sweet yogurt-based mango drink', price: 250, category: 'Beverages', isAvailable: true },
  { name: 'Kheer', description: 'Traditional creamy rice pudding', price: 200, category: 'Desserts', isAvailable: true },
  { name: 'Zinger Burger', description: 'Crispy fried chicken fillet in a bun with mayo', price: 500, category: 'Fast Food', isAvailable: true },
  { name: 'Club Sandwich', description: 'Triple-decker sandwich with chicken, egg, and fries', price: 450, category: 'Fast Food', isAvailable: true },
  { name: 'Chicken Corn Soup', description: 'Warm and comforting chicken and corn soup', price: 300, category: 'Appetizers', isAvailable: true },
  { name: 'Mutton Pulao', description: 'Aromatic rice cooked with tender mutton chunks', price: 650, category: 'Main Course', isAvailable: true },
  { name: 'Masala Fries', description: 'Crispy potato fries tossed in special spices', price: 250, category: 'Appetizers', isAvailable: true },
  { name: 'Pina Colada', description: 'Tropical pineapple and coconut mocktail', price: 350, category: 'Beverages', isAvailable: true },
  { name: 'Chocolate Brownie', description: 'Rich fudge brownie served warm', price: 300, category: 'Desserts', isAvailable: true },
  { name: 'Green Tea', description: 'Soothing traditional green tea', price: 80, category: 'Beverages', isAvailable: true },
  { name: 'Fresh Lime', description: 'Refreshing sparkling lime drink', price: 150, category: 'Beverages', isAvailable: true }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await MenuItem.deleteMany();
    await User.deleteMany();
    await Table.deleteMany();

    // Insert menu items
    await MenuItem.insertMany(menuItems);
    console.log('Menu Items Seeded!');

    // Hash password for manager & customer (Assignment Requirement)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Create default manager and customer users
    await User.create([
      {
        name: 'Restaurant Manager',
        email: 'manager@restaurant.com',
        password: hashedPassword,
        role: 'manager',
        phone: '03001112233'
      },
      {
        name: 'Aam Customer',
        email: 'customer@restaurant.com',
        password: hashedPassword,
        role: 'customer',
        phone: '03004445566'
      }
    ]);
    console.log('Default Manager and Customer Created!');

    // Create 6 tables (Assignment Requirement)
    await Table.insertMany([
      { tableNumber: 1, capacity: 2, status: 'Available' },
      { tableNumber: 2, capacity: 4, status: 'Available' },
      { tableNumber: 3, capacity: 6, status: 'Available' },
      { tableNumber: 4, capacity: 8, status: 'Available' },
      { tableNumber: 5, capacity: 4, status: 'Available' },
      { tableNumber: 6, capacity: 2, status: 'Available' }
    ]);
    console.log('Tables Seeded!');

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();