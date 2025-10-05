const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  items: [{
    inventoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem'
    },
    name: String,
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'],
    default: 'draft'
  },
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  aiRecommendation: {
    score: Number,
    reasoning: String,
    alternativeVendors: [{
      vendorId: mongoose.Schema.Types.ObjectId,
      estimatedSavings: Number,
      reason: String
    }]
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  notes: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

// Generate order number before saving
purchaseOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.constructor.countDocuments();
    this.orderNumber = `PO-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate totals
  this.items.forEach(item => {
    item.totalPrice = item.quantity * item.unitPrice;
  });
  
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.total = this.subtotal + this.tax + this.shipping;
  
  next();
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
