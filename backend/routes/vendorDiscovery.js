const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Simulated vendor database (in real app, this would be external APIs/web scraping)
const VENDOR_MARKETPLACE = [
  {
    source: 'Alibaba',
    vendors: [
      { name: 'Shenzhen Tech Electronics Co.', country: 'China', rating: 4.7, minOrder: 100, deliveryDays: 15 },
      { name: 'Guangzhou Smart Supplies', country: 'China', rating: 4.5, minOrder: 50, deliveryDays: 18 },
      { name: 'Beijing Innovation Tech', country: 'China', rating: 4.8, minOrder: 200, deliveryDays: 12 }
    ]
  },
  {
    source: 'Amazon Business',
    vendors: [
      { name: 'TechDirect USA', country: 'USA', rating: 4.6, minOrder: 1, deliveryDays: 2 },
      { name: 'Office Supplies Plus', country: 'USA', rating: 4.4, minOrder: 1, deliveryDays: 3 },
      { name: 'ElectroWorld Distribution', country: 'USA', rating: 4.9, minOrder: 5, deliveryDays: 1 }
    ]
  },
  {
    source: 'IndiaMART',
    vendors: [
      { name: 'Mumbai Electronics Hub', country: 'India', rating: 4.3, minOrder: 25, deliveryDays: 10 },
      { name: 'Delhi Office Mart', country: 'India', rating: 4.2, minOrder: 30, deliveryDays: 12 },
      { name: 'Bangalore Tech Suppliers', country: 'India', rating: 4.6, minOrder: 20, deliveryDays: 8 }
    ]
  },
  {
    source: 'Made-in-China',
    vendors: [
      { name: 'Shanghai Quality Products', country: 'China', rating: 4.4, minOrder: 150, deliveryDays: 14 },
      { name: 'Ningbo Trade Company', country: 'China', rating: 4.5, minOrder: 100, deliveryDays: 16 }
    ]
  },
  {
    source: 'Global Sources',
    vendors: [
      { name: 'Hong Kong Trading Co.', country: 'Hong Kong', rating: 4.7, minOrder: 50, deliveryDays: 10 },
      { name: 'Taiwan Electronics Export', country: 'Taiwan', rating: 4.8, minOrder: 75, deliveryDays: 9 }
    ]
  }
];

// Product categories with price ranges
const PRODUCT_PRICING = {
  'Laptop': { basePrice: 800, variance: 300 },
  'Mouse': { basePrice: 10, variance: 5 },
  'Keyboard': { basePrice: 40, variance: 20 },
  'Cable': { basePrice: 3, variance: 2 },
  'Chair': { basePrice: 120, variance: 50 },
  'Lamp': { basePrice: 15, variance: 8 },
  'Paper': { basePrice: 2, variance: 1 },
  'Pen': { basePrice: 3, variance: 2 },
  'Stand': { basePrice: 25, variance: 10 },
  'HDMI': { basePrice: 6, variance: 3 }
};

// Search for vendors selling a specific product
router.post('/search', auth, async (req, res) => {
  try {
    const { productName, category, quantity } = req.body;

    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Simulate API search delay (like real marketplace searches)
    await new Promise(resolve => setTimeout(resolve, 800));

    const searchResults = [];

    // Determine product type from name
    let productType = null;
    let pricingInfo = null;
    for (const [type, pricing] of Object.entries(PRODUCT_PRICING)) {
      if (productName.toLowerCase().includes(type.toLowerCase())) {
        productType = type;
        pricingInfo = pricing;
        break;
      }
    }

    // If no match, use category or default pricing
    if (!pricingInfo) {
      pricingInfo = { basePrice: 50, variance: 20 };
    }

    // Search across all marketplace sources
    for (const marketplace of VENDOR_MARKETPLACE) {
      for (const vendor of marketplace.vendors) {
        // Calculate price based on location and rating
        const locationMultiplier = vendor.country === 'China' ? 0.7 : 
                                   vendor.country === 'India' ? 0.8 :
                                   vendor.country === 'USA' ? 1.2 : 1.0;
        
        const ratingMultiplier = 0.9 + (vendor.rating / 10);
        
        // Add some randomness
        const randomFactor = 0.9 + Math.random() * 0.2;
        
        const unitPrice = Math.round(
          pricingInfo.basePrice * locationMultiplier * ratingMultiplier * randomFactor * 100
        ) / 100;

        // Calculate bulk discount
        const requestedQty = quantity || 1;
        let discount = 0;
        if (requestedQty >= 100) discount = 15;
        else if (requestedQty >= 50) discount = 10;
        else if (requestedQty >= 20) discount = 5;

        const discountedPrice = Math.round(unitPrice * (1 - discount / 100) * 100) / 100;

        searchResults.push({
          vendorName: vendor.name,
          source: marketplace.source,
          country: vendor.country,
          rating: vendor.rating,
          unitPrice: discountedPrice,
          originalPrice: unitPrice,
          discount: discount,
          minimumOrder: vendor.minOrder,
          deliveryTime: vendor.deliveryDays,
          totalCost: requestedQty >= vendor.minOrder ? 
                     Math.round(discountedPrice * requestedQty * 100) / 100 : null,
          available: requestedQty >= vendor.minOrder,
          productName: productName,
          verified: vendor.rating >= 4.5,
          shippingIncluded: vendor.country === 'USA',
          estimatedArrival: new Date(Date.now() + vendor.deliveryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
    }

    // Sort by best value (considering price and rating)
    searchResults.sort((a, b) => {
      if (!a.available && b.available) return 1;
      if (a.available && !b.available) return -1;
      
      const scoreA = (a.rating / a.unitPrice) * (a.shippingIncluded ? 1.1 : 1);
      const scoreB = (b.rating / b.unitPrice) * (b.shippingIncluded ? 1.1 : 1);
      return scoreB - scoreA;
    });

    res.json({
      productName,
      totalResults: searchResults.length,
      searchTime: '0.8s',
      results: searchResults,
      bestDeal: searchResults.find(r => r.available),
      averagePrice: Math.round(
        searchResults.reduce((sum, r) => sum + r.unitPrice, 0) / searchResults.length * 100
      ) / 100
    });

  } catch (error) {
    console.error('Vendor search error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Get vendor details from marketplace
router.get('/vendor-details/:source/:vendorName', auth, async (req, res) => {
  try {
    const { source, vendorName } = req.params;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find the vendor
    let vendorDetails = null;
    for (const marketplace of VENDOR_MARKETPLACE) {
      if (marketplace.source === source) {
        const vendor = marketplace.vendors.find(v => 
          v.name.toLowerCase().includes(vendorName.toLowerCase())
        );
        if (vendor) {
          vendorDetails = {
            ...vendor,
            source: marketplace.source,
            founded: Math.floor(Math.random() * 15) + 2008,
            employees: Math.floor(Math.random() * 500) + 50,
            responseTime: `${Math.floor(Math.random() * 24) + 1} hours`,
            returnPolicy: vendor.country === 'USA' ? '30 days' : '15 days',
            paymentMethods: ['Credit Card', 'PayPal', 'Wire Transfer'],
            certifications: vendor.rating >= 4.5 ? ['ISO 9001', 'CE Certified'] : ['CE Certified'],
            totalProducts: Math.floor(Math.random() * 5000) + 500,
            completedOrders: Math.floor(Math.random() * 10000) + 1000
          };
          break;
        }
      }
    }

    if (!vendorDetails) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendorDetails);
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    res.status(500).json({ message: 'Failed to fetch vendor details' });
  }
});

// Compare vendors for specific product
router.post('/compare', auth, async (req, res) => {
  try {
    const { productName, quantity, maxDeliveryDays, maxBudget } = req.body;

    // Use the search endpoint logic
    const searchReq = { body: { productName, quantity } };
    const searchRes = {
      json: () => {}
    };

    // Get search results
    const response = await new Promise((resolve) => {
      searchRes.json = resolve;
      router.stack[0].route.stack[0].handle(searchReq, searchRes);
    });

    // Filter based on criteria
    let filtered = response.results;
    
    if (maxDeliveryDays) {
      filtered = filtered.filter(v => v.deliveryTime <= maxDeliveryDays);
    }
    
    if (maxBudget && quantity) {
      filtered = filtered.filter(v => v.unitPrice * quantity <= maxBudget);
    }

    // Group by source
    const bySource = {};
    filtered.forEach(vendor => {
      if (!bySource[vendor.source]) {
        bySource[vendor.source] = [];
      }
      bySource[vendor.source].push(vendor);
    });

    res.json({
      comparison: filtered.slice(0, 10),
      bySource,
      recommendations: {
        cheapest: filtered[0],
        fastest: filtered.sort((a, b) => a.deliveryTime - b.deliveryTime)[0],
        bestRated: filtered.sort((a, b) => b.rating - a.rating)[0],
        bestValue: filtered.sort((a, b) => {
          const scoreA = (a.rating * 10) / (a.unitPrice + a.deliveryTime);
          const scoreB = (b.rating * 10) / (b.unitPrice + b.deliveryTime);
          return scoreB - scoreA;
        })[0]
      }
    });
  } catch (error) {
    console.error('Error comparing vendors:', error);
    res.status(500).json({ message: 'Comparison failed' });
  }
});

module.exports = router;
