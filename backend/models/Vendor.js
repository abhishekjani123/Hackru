const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  website: String,
  category: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  deliveryTime: {
    type: Number,
    default: 7 // days
  },
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  products: [{
    itemName: String,
    itemSKU: String,
    price: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    moq: { // Minimum Order Quantity
      type: Number,
      default: 1
    },
    leadTime: Number,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  performance: {
    onTimeDelivery: {
      type: Number,
      default: 100
    },
    qualityScore: {
      type: Number,
      default: 5
    },
    responseTime: {
      type: Number,
      default: 24 // hours
    },
    totalOrders: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  notes: String
}, {
  timestamps: true
});

// Calculate average product price
vendorSchema.methods.getAveragePrice = function() {
  if (this.products.length === 0) return 0;
  const total = this.products.reduce((sum, product) => sum + product.price, 0);
  return total / this.products.length;
};

module.exports = mongoose.model('Vendor', vendorSchema);
