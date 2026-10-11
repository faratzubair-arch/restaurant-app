const Order = require('../models/orderModel');
const MenuItem = require('../models/MenuItem');

// Create Order with server-side price calculation and availability check
const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    let calculatedTotalPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const dbMenuItem = await MenuItem.findById(item.menuItem || item.dishId);
      
      if (!dbMenuItem) {
        return res.status(404).json({ message: `Menu item not found` });
      }

      if (dbMenuItem.isAvailable === false) {
        return res.status(400).json({ message: `Item ${dbMenuItem.name} is currently unavailable` });
      }

      // Server-side price calculation for security (never trust client total)
      const itemTotal = dbMenuItem.price * item.quantity;
      calculatedTotalPrice += itemTotal;

      verifiedOrderItems.push({
        menuItem: dbMenuItem._id,
        quantity: item.quantity,
        price: dbMenuItem.price
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      totalPrice: calculatedTotalPrice,
      status: 'Pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Customer's Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.menuItem').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders (Manager)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').populate('orderItems.menuItem').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status (Manager)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const currentStatus = order.status;

    // Status validation rules
    if (status === 'Cancelled') {
      if (currentStatus !== 'Pending') {
        return res.status(400).json({ message: 'Order can only be cancelled while it is Pending' });
      }
    } else {
      const statusFlow = { Pending: 1, Preparing: 2, Ready: 3, Served: 4 };
      if (statusFlow[status] <= statusFlow[currentStatus]) {
        return res.status(400).json({ message: `Cannot change status backwards from ${currentStatus} to ${status}` });
      }
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };