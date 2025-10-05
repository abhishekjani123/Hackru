const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const InventoryItem = require('../models/InventoryItem');
const Vendor = require('../models/Vendor');
const PurchaseOrder = require('../models/PurchaseOrder');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// Get AI recommendations for purchase orders
router.post('/recommend-purchase', auth, async (req, res) => {
  try {
    // Get low stock items
    const lowStockItems = await InventoryItem.find({
      user: req.userId,
      $expr: { $lte: ['$currentStock', '$reorderPoint'] }
    }).populate('supplier');
    
    if (lowStockItems.length === 0) {
      return res.json({
        message: 'All items are sufficiently stocked',
        recommendations: []
      });
    }
    
    // Get all vendors
    const vendors = await Vendor.find({
      user: req.userId,
      status: 'active'
    });
    
    try {
      // Try to call AI service
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/recommend-purchase`, {
        items: lowStockItems.map(item => ({
          id: item._id,
          name: item.name,
          currentStock: item.currentStock,
          reorderPoint: item.reorderPoint,
          averageDailySales: item.averageDailySales,
          costPrice: item.costPrice,
          category: item.category
        })),
        vendors: vendors.map(vendor => ({
          id: vendor._id,
          name: vendor.name,
          rating: vendor.rating,
          deliveryTime: vendor.deliveryTime,
          products: vendor.products,
          performance: vendor.performance
        }))
      }, { timeout: 5000 });
      
      res.json(aiResponse.data);
    } catch (aiError) {
      // Fallback: Generate basic recommendations without AI
      console.log('AI service unavailable, using fallback recommendations');
      const recommendations = generateFallbackRecommendations(lowStockItems, vendors);
      res.json({
        message: 'Showing basic recommendations (AI service unavailable)',
        recommendations,
        usingFallback: true
      });
    }
  } catch (error) {
    console.error('Error generating recommendations:', error.message);
    res.status(500).json({
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

// Fallback recommendation function (when AI is unavailable)
function generateFallbackRecommendations(items, vendors) {
  const recommendations = [];
  
  for (const item of items) {
    // Find vendors with matching products
    const matchingVendors = vendors.filter(vendor => 
      vendor.products && vendor.products.some(p => 
        p.itemSKU === item.sku || 
        p.itemName?.toLowerCase().includes(item.name.toLowerCase())
      )
    );
    
    if (matchingVendors.length === 0) continue;
    
    // Sort by rating and delivery time
    matchingVendors.sort((a, b) => {
      const scoreA = (a.rating || 0) * 10 - (a.deliveryTime || 7);
      const scoreB = (b.rating || 0) * 10 - (b.deliveryTime || 7);
      return scoreB - scoreA;
    });
    
    const bestVendor = matchingVendors[0];
    const product = bestVendor.products.find(p => 
      p.itemSKU === item.sku || 
      p.itemName?.toLowerCase().includes(item.name.toLowerCase())
    );
    
    if (product) {
      // Calculate remaining capacity
      const remainingCapacity = item.maxCapacity ? Math.max(0, item.maxCapacity - item.currentStock) : Infinity;
      
      // Calculate ideal quantity
      let idealQuantity = Math.max(
        item.reorderPoint - item.currentStock + 10,
        product.moq || 1
      );
      
      // Respect capacity limit
      const quantity = Math.min(idealQuantity, remainingCapacity);
      
      // Skip if no capacity available
      if (quantity <= 0) continue;
      
      const capacityNote = remainingCapacity < idealQuantity 
        ? ` (Limited by store capacity: ${remainingCapacity} units available)`
        : '';
      
      recommendations.push({
        itemId: item._id,
        itemName: item.name,
        currentStock: item.currentStock,
        reorderPoint: item.reorderPoint,
        maxCapacity: item.maxCapacity || 'Unlimited',
        remainingCapacity: remainingCapacity === Infinity ? 'Unlimited' : remainingCapacity,
        recommendedQuantity: quantity,
        capacityLimited: remainingCapacity < idealQuantity,
        vendorId: bestVendor._id,
        vendorName: bestVendor.name,
        price: product.price,
        totalCost: product.price * quantity,
        estimatedSavings: 0,
        deliveryTime: bestVendor.deliveryTime || 7,
        confidence: 0.7,
        reasoning: `Recommended based on vendor rating (${bestVendor.rating}/5) and delivery time (${bestVendor.deliveryTime} days)${capacityNote}`
      });
    }
  }
  
  return recommendations;
}

// Generate smart purchase order
router.post('/generate-order', auth, async (req, res) => {
  try {
    const { recommendations } = req.body;
    
    if (!recommendations || recommendations.length === 0) {
      return res.status(400).json({ message: 'No recommendations provided' });
    }
    
    // Group recommendations by vendor
    const ordersByVendor = {};
    
    for (const rec of recommendations) {
      if (!ordersByVendor[rec.vendorId]) {
        ordersByVendor[rec.vendorId] = [];
      }
      ordersByVendor[rec.vendorId].push(rec);
    }
    
    // Create purchase orders for each vendor
    const createdOrders = [];
    
    for (const [vendorId, items] of Object.entries(ordersByVendor)) {
      const order = new PurchaseOrder({
        user: req.userId,
        vendor: vendorId,
        items: items.map(item => ({
          inventoryItem: item.itemId,
          name: item.itemName,
          quantity: item.recommendedQuantity,
          unitPrice: item.price
        })),
        isAIGenerated: true,
        status: 'draft',
        aiRecommendation: {
          score: items[0].confidence || 0.85,
          reasoning: 'AI-generated order based on inventory analysis and vendor comparison'
        }
      });
      
      await order.save();
      await order.populate('vendor');
      createdOrders.push(order);
    }
    
    res.json({ orders: createdOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI insights for inventory optimization
router.get('/inventory-insights', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find({ user: req.userId });
    const purchaseOrders = await PurchaseOrder.find({
      user: req.userId,
      createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
    });
    
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/inventory-insights`, {
        items: items.map(item => ({
          id: item._id,
          name: item.name,
          category: item.category,
          currentStock: item.currentStock,
          averageDailySales: item.averageDailySales,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice
        })),
        recentOrders: purchaseOrders.map(order => ({
          date: order.createdAt,
          total: order.total,
          items: order.items.length
        }))
      }, { timeout: 5000 });
      
      res.json(aiResponse.data);
    } catch (aiError) {
      // Fallback: Generate basic insights
      console.log('AI service unavailable, using basic insights');
      const insights = generateFallbackInsights(items, purchaseOrders);
      res.json({
        ...insights,
        message: 'Showing basic insights (AI service unavailable)',
        usingFallback: true
      });
    }
  } catch (error) {
    console.error('Error generating insights:', error.message);
    res.status(500).json({
      message: 'Failed to generate insights',
      error: error.message
    });
  }
});

// Fallback insights function
function generateFallbackInsights(items, orders) {
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
  const lowStockCount = items.filter(item => item.currentStock <= item.reorderPoint).length;
  const outOfStockCount = items.filter(item => item.currentStock === 0).length;
  
  const insights = [
    {
      title: 'Stock Status',
      description: `${lowStockCount} items need reordering, ${outOfStockCount} items are out of stock`,
      priority: outOfStockCount > 0 ? 'high' : 'medium'
    },
    {
      title: 'Inventory Value',
      description: `Total inventory value: $${totalValue.toFixed(2)}`,
      priority: 'low'
    }
  ];
  
  if (orders.length > 0) {
    const avgOrderValue = orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length;
    insights.push({
      title: 'Recent Activity',
      description: `${orders.length} orders in last 90 days, average value: $${avgOrderValue.toFixed(2)}`,
      priority: 'low'
    });
  }
  
  return { insights };
}

// Vendor performance analysis
router.get('/vendor-analysis/:vendorId', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.vendorId,
      user: req.userId
    });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    const orders = await PurchaseOrder.find({
      user: req.userId,
      vendor: vendor._id
    });
    
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/vendor-analysis`, {
      vendor: {
        id: vendor._id,
        name: vendor.name,
        rating: vendor.rating,
        performance: vendor.performance,
        products: vendor.products
      },
      orders: orders.map(order => ({
        date: order.createdAt,
        total: order.total,
        expectedDelivery: order.expectedDeliveryDate,
        actualDelivery: order.actualDeliveryDate,
        status: order.status
      }))
    });
    
    res.json(aiResponse.data);
  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.status(500).json({
      message: 'AI service unavailable',
      error: error.message
    });
  }
});

module.exports = router;
