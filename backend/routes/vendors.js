const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth');

// Get all vendors
router.get('/', auth, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = { user: req.userId };

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await Vendor.find(query).sort({ rating: -1 });
    res.json({ vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single vendor
router.get('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json({ vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create vendor
router.post('/', auth, async (req, res) => {
  try {
    const vendor = new Vendor({
      ...req.body,
      user: req.userId
    });
    
    await vendor.save();
    res.status(201).json({ vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vendor
router.put('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json({ vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vendor
router.delete('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json({ message: 'Vendor deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Compare vendors for a product
router.post('/compare', auth, async (req, res) => {
  try {
    const { itemName } = req.body;
    
    const vendors = await Vendor.find({
      user: req.userId,
      status: 'active',
      'products.itemName': { $regex: itemName, $options: 'i' }
    });
    
    const comparison = vendors.map(vendor => {
      const product = vendor.products.find(p => 
        p.itemName.toLowerCase().includes(itemName.toLowerCase())
      );
      
      return {
        vendorId: vendor._id,
        vendorName: vendor.name,
        price: product?.price || 0,
        moq: product?.moq || 1,
        leadTime: product?.leadTime || vendor.deliveryTime,
        rating: vendor.rating,
        onTimeDelivery: vendor.performance.onTimeDelivery
      };
    }).sort((a, b) => a.price - b.price);
    
    res.json({ comparison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
