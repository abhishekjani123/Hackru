const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const PurchaseOrder = require('../models/PurchaseOrder');
const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth');

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Inventory stats
    const totalItems = await InventoryItem.countDocuments({ user: req.userId });
    const lowStockItems = await InventoryItem.countDocuments({
      user: req.userId,
      $expr: { $lte: ['$currentStock', '$reorderPoint'] }
    });
    const outOfStockItems = await InventoryItem.countDocuments({
      user: req.userId,
      currentStock: 0
    });
    
    // Calculate total inventory value
    const inventoryValue = await InventoryItem.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } }
        }
      }
    ]);
    
    // Purchase order stats
    const pendingOrders = await PurchaseOrder.countDocuments({
      user: req.userId,
      status: { $in: ['pending', 'approved', 'ordered'] }
    });
    
    const monthlySpending = await PurchaseOrder.aggregate([
      {
        $match: {
          user: req.userId,
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    
    // Vendor stats
    const activeVendors = await Vendor.countDocuments({
      user: req.userId,
      status: 'active'
    });
    
    // Top vendors by performance
    const topVendors = await Vendor.find({ user: req.userId })
      .sort({ 'performance.onTimeDelivery': -1, rating: -1 })
      .limit(5)
      .select('name rating performance.onTimeDelivery performance.totalOrders');
    
    // Recent low stock alerts
    const lowStockAlerts = await InventoryItem.find({
      user: req.userId,
      $expr: { $lte: ['$currentStock', '$reorderPoint'] }
    })
      .sort({ currentStock: 1 })
      .limit(10)
      .select('name currentStock reorderPoint category');
    
    // Format alerts with proper structure
    const formattedAlerts = [];
    
    // Out of stock alert
    const outOfStock = lowStockAlerts.filter(item => item.currentStock === 0);
    if (outOfStock.length > 0) {
      formattedAlerts.push({
        level: 'critical',
        message: `${outOfStock.length} item(s) are out of stock`,
        items: outOfStock.map(item => item.name)
      });
    }
    
    // Low stock alert
    const lowStock = lowStockAlerts.filter(item => item.currentStock > 0 && item.currentStock <= item.reorderPoint);
    if (lowStock.length > 0) {
      formattedAlerts.push({
        level: 'warning',
        message: `${lowStock.length} item(s) need reordering`,
        items: lowStock.map(item => item.name)
      });
    }
    
    // Pending orders alert
    if (pendingOrders > 0) {
      formattedAlerts.push({
        level: 'info',
        message: `${pendingOrders} pending purchase order(s)`,
        items: []
      });
    }
    
    res.json({
      inventory: {
        totalItems,
        lowStockItems,
        outOfStockItems,
        totalValue: inventoryValue[0]?.totalValue || 0
      },
      purchaseOrders: {
        pendingOrders,
        monthlySpending: monthlySpending[0]?.total || 0
      },
      vendors: {
        activeVendors,
        topVendors
      },
      alerts: formattedAlerts,
      lowStockItems: lowStockAlerts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get spending trends
router.get('/spending-trends', auth, async (req, res) => {
  try {
    const { period = '6' } = req.query; // months
    const months = parseInt(period);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const trends = await PurchaseOrder.aggregate([
      {
        $match: {
          user: req.userId,
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSpending: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({ trends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inventory insights
router.get('/inventory-insights', auth, async (req, res) => {
  try {
    // Category distribution
    const categoryDistribution = await InventoryItem.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Items by status
    const statusDistribution = await InventoryItem.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Fast moving items (high average daily sales)
    const fastMovingItems = await InventoryItem.find({ user: req.userId })
      .sort({ averageDailySales: -1 })
      .limit(10)
      .select('name averageDailySales currentStock category');
    
    res.json({
      categoryDistribution,
      statusDistribution,
      fastMovingItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
