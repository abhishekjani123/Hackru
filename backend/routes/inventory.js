const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const auth = require('../middleware/auth');

// Get all inventory items
router.get('/', auth, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = { user: req.userId };

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await InventoryItem.find(query)
      .populate('supplier', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get low stock items
router.get('/low-stock', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find({
      user: req.userId,
      $expr: { $lte: ['$currentStock', '$reorderPoint'] }
    }).populate('supplier', 'name email');
    
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await InventoryItem.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('supplier');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create inventory item
router.post('/', auth, async (req, res) => {
  try {
    const item = new InventoryItem({
      ...req.body,
      user: req.userId
    });
    
    await item.save();
    res.status(201).json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update inventory item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await InventoryItem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inventory item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await InventoryItem.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update stock
router.post('/bulk-update', auth, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, currentStock }
    
    const promises = updates.map(update =>
      InventoryItem.findOneAndUpdate(
        { _id: update.id, user: req.userId },
        { currentStock: update.currentStock },
        { new: true }
      )
    );
    
    const items = await Promise.all(promises);
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
