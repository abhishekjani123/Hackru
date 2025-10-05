const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  minStockLevel: {
    type: Number,
    required: true,
    default: 10
  },
  maxStockLevel: {
    type: Number,
    default: 100
  },
  maxCapacity: {
    type: Number,
    required: true,
    default: 100,
    min: 0
  },
  unit: {
    type: String,
    default: 'units'
  },
  costPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  lastRestocked: Date,
  reorderPoint: {
    type: Number,
    default: 15
  },
  averageDailySales: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'discontinued'],
    default: 'in-stock'
  },
  image: String,
  tags: [String]
}, {
  timestamps: true
});

// Virtual for stock status
inventoryItemSchema.virtual('stockStatus').get(function() {
  if (this.currentStock === 0) return 'out-of-stock';
  if (this.currentStock <= this.reorderPoint) return 'low-stock';
  return 'in-stock';
});

// Virtual for remaining capacity
inventoryItemSchema.virtual('remainingCapacity').get(function() {
  return Math.max(0, this.maxCapacity - this.currentStock);
});

// Virtual for capacity utilization percentage
inventoryItemSchema.virtual('capacityUtilization').get(function() {
  if (this.maxCapacity === 0) return 0;
  return (this.currentStock / this.maxCapacity) * 100;
});

// Update status before saving
inventoryItemSchema.pre('save', function(next) {
  if (this.currentStock === 0) {
    this.status = 'out-of-stock';
  } else if (this.currentStock <= this.reorderPoint) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  next();
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
