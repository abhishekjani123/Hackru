const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../models/PurchaseOrder');
const InventoryItem = require('../models/InventoryItem');
const auth = require('../middleware/auth');

// Get all purchase orders
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.userId };

    if (status) query.status = status;

    const orders = await PurchaseOrder.find(query)
      .populate('vendor', 'name email phone')
      .populate('items.inventoryItem', 'name sku')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single purchase order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await PurchaseOrder.findOne({
      _id: req.params.id,
      user: req.userId
    })
      .populate('vendor')
      .populate('items.inventoryItem')
      .populate('approvedBy', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create purchase order
router.post('/', auth, async (req, res) => {
  try {
    const order = new PurchaseOrder({
      ...req.body,
      user: req.userId
    });
    
    await order.save();
    await order.populate('vendor');
    
    res.status(201).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update purchase order
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await PurchaseOrder.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('vendor');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve purchase order
router.post('/:id/approve', auth, async (req, res) => {
  try {
    const order = await PurchaseOrder.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = 'approved';
    order.approvedBy = req.userId;
    order.approvedAt = new Date();
    
    await order.save();
    await order.populate('vendor');
    
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark order as received and update inventory
router.post('/:id/receive', auth, async (req, res) => {
  try {
    const order = await PurchaseOrder.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = 'received';
    order.actualDeliveryDate = new Date();
    
    // Update inventory quantities
    for (const item of order.items) {
      if (item.inventoryItem) {
        await InventoryItem.findByIdAndUpdate(item.inventoryItem, {
          $inc: { currentStock: item.quantity },
          lastRestocked: new Date()
        });
      }
    }
    
    await order.save();
    await order.populate('vendor');
    
    res.json({ order, message: 'Inventory updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel purchase order
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await PurchaseOrder.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status: 'cancelled' },
      { new: true }
    ).populate('vendor');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
