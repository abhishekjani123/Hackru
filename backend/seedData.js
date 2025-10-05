const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const InventoryItem = require('./models/InventoryItem');
const Vendor = require('./models/Vendor');
const PurchaseOrder = require('./models/PurchaseOrder');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vendor-management')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    console.log('🧹 Cleaning existing data...');
    
    // Clear existing data
    await User.deleteMany({});
    await InventoryItem.deleteMany({});
    await Vendor.deleteMany({});
    await PurchaseOrder.deleteMany({});

    console.log('👤 Creating test user...');
    
    // Create a test user (password will be hashed by the User model's pre-save hook)
    const user = await User.create({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'test123',  // Raw password - will be hashed automatically
      shopName: 'Test Shop',
      businessType: 'retail',
      phone: '1234567890'
    });

    console.log('📦 Creating inventory items...');

    // Create inventory items
    const inventoryItems = await InventoryItem.insertMany([
      {
        user: user._id,
        name: 'Laptop - Dell XPS 15',
        sku: 'LAPTOP-001',
        category: 'Electronics',
        description: 'High-performance laptop for business',
        currentStock: 5,
        minStockLevel: 10,
        maxCapacity: 20,
        reorderPoint: 15,
        unit: 'pieces',
        costPrice: 1200,
        sellingPrice: 1500,
        lastRestocked: new Date('2024-01-15')
      },
      {
        user: user._id,
        name: 'Wireless Mouse',
        sku: 'MOUSE-001',
        category: 'Electronics',
        description: 'Ergonomic wireless mouse',
        currentStock: 3,
        minStockLevel: 20,
        maxCapacity: 50,
        reorderPoint: 25,
        unit: 'pieces',
        costPrice: 15,
        sellingPrice: 25,
        lastRestocked: new Date('2024-02-01')
      },
      {
        user: user._id,
        name: 'USB-C Cable',
        sku: 'CABLE-001',
        category: 'Electronics',
        description: '2m USB-C charging cable',
        currentStock: 0,
        minStockLevel: 50,
        maxCapacity: 150,
        reorderPoint: 60,
        unit: 'pieces',
        costPrice: 5,
        sellingPrice: 12,
        lastRestocked: new Date('2024-01-10')
      },
      {
        user: user._id,
        name: 'Office Chair',
        sku: 'CHAIR-001',
        category: 'Furniture',
        description: 'Ergonomic office chair with lumbar support',
        currentStock: 12,
        minStockLevel: 8,
        maxCapacity: 25,
        reorderPoint: 10,
        unit: 'pieces',
        costPrice: 150,
        sellingPrice: 250,
        lastRestocked: new Date('2024-02-10')
      },
      {
        user: user._id,
        name: 'Desk Lamp',
        sku: 'LAMP-001',
        category: 'Furniture',
        description: 'LED desk lamp with adjustable brightness',
        currentStock: 25,
        minStockLevel: 15,
        maxCapacity: 40,
        reorderPoint: 20,
        unit: 'pieces',
        costPrice: 20,
        sellingPrice: 35,
        lastRestocked: new Date('2024-02-20')
      },
      {
        user: user._id,
        name: 'Printer Paper A4',
        sku: 'PAPER-001',
        category: 'Office Supplies',
        description: '500 sheets per pack',
        currentStock: 8,
        minStockLevel: 30,
        maxCapacity: 100,
        reorderPoint: 40,
        unit: 'packs',
        costPrice: 3,
        sellingPrice: 8,
        lastRestocked: new Date('2024-01-20')
      },
      {
        user: user._id,
        name: 'Blue Ink Pen',
        sku: 'PEN-001',
        category: 'Office Supplies',
        description: 'Pack of 10 blue ballpoint pens',
        currentStock: 2,
        minStockLevel: 25,
        maxCapacity: 80,
        reorderPoint: 30,
        unit: 'packs',
        costPrice: 4,
        sellingPrice: 10,
        lastRestocked: new Date('2024-02-05')
      },
      {
        user: user._id,
        name: 'Monitor Stand',
        sku: 'STAND-001',
        category: 'Furniture',
        description: 'Adjustable monitor stand',
        currentStock: 15,
        minStockLevel: 10,
        maxCapacity: 30,
        reorderPoint: 12,
        unit: 'pieces',
        costPrice: 30,
        sellingPrice: 50,
        lastRestocked: new Date('2024-02-15')
      },
      {
        user: user._id,
        name: 'Wireless Keyboard',
        sku: 'KEYBOARD-001',
        category: 'Electronics',
        description: 'Mechanical wireless keyboard',
        currentStock: 7,
        minStockLevel: 15,
        maxCapacity: 35,
        reorderPoint: 20,
        unit: 'pieces',
        costPrice: 60,
        sellingPrice: 95,
        lastRestocked: new Date('2024-01-25')
      },
      {
        user: user._id,
        name: 'HDMI Cable 2m',
        sku: 'HDMI-001',
        category: 'Electronics',
        description: 'High-speed HDMI cable',
        currentStock: 1,
        minStockLevel: 20,
        maxCapacity: 100,
        reorderPoint: 25,
        unit: 'pieces',
        costPrice: 8,
        sellingPrice: 18,
        lastRestocked: new Date('2024-01-30')
      }
    ]);

    console.log('🏪 Creating vendors...');

    // Create vendors
    const vendors = await Vendor.insertMany([
      {
        user: user._id,
        name: 'TechSupply Co.',
        email: 'sales@techsupply.com',
        phone: '+1-555-0101',
        website: 'https://techsupply.com',
        address: {
          street: '123 Tech Street',
          city: 'Silicon Valley',
          state: 'CA',
          country: 'USA',
          zipCode: '94025'
        },
        category: ['Electronics', 'Computer Accessories'],
        rating: 4.5,
        deliveryTime: 3,
        paymentTerms: 'Net 30',
        notes: 'Fast delivery, good quality electronics. Contact: Alice Johnson',
        status: 'active',
        products: [
          { itemName: 'Laptop - Dell XPS 15', itemSKU: 'LAPTOP-001', price: 1150, moq: 1, leadTime: 3 },
          { itemName: 'Wireless Mouse', itemSKU: 'MOUSE-001', price: 14, moq: 10, leadTime: 2 },
          { itemName: 'USB-C Cable', itemSKU: 'CABLE-001', price: 4.5, moq: 20, leadTime: 1 }
        ]
      },
      {
        user: user._id,
        name: 'Office Solutions Ltd',
        email: 'orders@officesolutions.com',
        phone: '+1-555-0202',
        website: 'https://officesolutions.com',
        address: {
          street: '456 Business Ave',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001'
        },
        category: ['Office Supplies', 'Furniture'],
        rating: 4.2,
        deliveryTime: 5,
        paymentTerms: 'Net 45',
        notes: 'Bulk discounts available. Contact: Bob Smith',
        status: 'active',
        products: [
          { itemName: 'Office Chair', itemSKU: 'CHAIR-001', price: 145, moq: 5, leadTime: 7 },
          { itemName: 'Desk Lamp', itemSKU: 'LAMP-001', price: 18, moq: 10, leadTime: 4 },
          { itemName: 'Printer Paper A4', itemSKU: 'PAPER-001', price: 2.8, moq: 50, leadTime: 3 }
        ]
      },
      {
        user: user._id,
        name: 'Global Electronics Hub',
        email: 'contact@globalhub.com',
        phone: '+1-555-0303',
        website: 'https://globalelectronicshub.com',
        address: {
          street: '789 Innovation Drive',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          zipCode: '78701'
        },
        category: ['Electronics', 'Computer Hardware'],
        rating: 4.8,
        deliveryTime: 2,
        paymentTerms: 'Net 15',
        notes: 'Premium quality, slightly higher prices but fastest delivery. Contact: Carol Williams',
        status: 'active',
        products: [
          { itemName: 'Laptop - Dell XPS 15', itemSKU: 'LAPTOP-001', price: 1250, moq: 1, leadTime: 2 },
          { itemName: 'Wireless Keyboard', itemSKU: 'KEYBOARD-001', price: 58, moq: 5, leadTime: 2 },
          { itemName: 'HDMI Cable 2m', itemSKU: 'HDMI-001', price: 7.5, moq: 10, leadTime: 1 }
        ]
      },
      {
        user: user._id,
        name: 'Budget Office Supplies',
        email: 'sales@budgetoffice.com',
        phone: '+1-555-0404',
        website: 'https://budgetoffice.com',
        address: {
          street: '321 Discount Road',
          city: 'Chicago',
          state: 'IL',
          country: 'USA',
          zipCode: '60601'
        },
        category: ['Office Supplies', 'Stationery'],
        rating: 3.9,
        deliveryTime: 7,
        paymentTerms: 'Net 60',
        notes: 'Best prices, slower delivery. Contact: David Brown',
        status: 'active',
        products: [
          { itemName: 'Printer Paper A4', itemSKU: 'PAPER-001', price: 2.5, moq: 100, leadTime: 7 },
          { itemName: 'Blue Ink Pen', itemSKU: 'PEN-001', price: 3.5, moq: 50, leadTime: 5 },
          { itemName: 'USB-C Cable', itemSKU: 'CABLE-001', price: 4, moq: 30, leadTime: 6 }
        ]
      },
      {
        user: user._id,
        name: 'Premium Furniture Co',
        email: 'info@premiumfurniture.com',
        phone: '+1-555-0505',
        website: 'https://premiumfurniture.com',
        address: {
          street: '654 Designer Street',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          zipCode: '90001'
        },
        category: ['Furniture', 'Office Equipment'],
        rating: 4.6,
        deliveryTime: 10,
        paymentTerms: 'Net 30',
        notes: 'High-end office furniture. Contact: Emma Davis',
        status: 'active',
        products: [
          { itemName: 'Office Chair', itemSKU: 'CHAIR-001', price: 155, moq: 3, leadTime: 10 },
          { itemName: 'Monitor Stand', itemSKU: 'STAND-001', price: 28, moq: 5, leadTime: 8 },
          { itemName: 'Desk Lamp', itemSKU: 'LAMP-001', price: 22, moq: 5, leadTime: 7 }
        ]
      },
      {
        user: user._id,
        name: 'Quick Tech Distributors',
        email: 'orders@quicktech.com',
        phone: '+1-555-0606',
        website: 'https://quicktech.com',
        address: {
          street: '987 Speed Lane',
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          zipCode: '98101'
        },
        category: ['Electronics', 'Computer Accessories', 'Cables'],
        rating: 4.3,
        deliveryTime: 4,
        paymentTerms: 'Net 30',
        notes: 'Good balance of price and delivery time. Contact: Frank Miller',
        status: 'active',
        products: [
          { itemName: 'Wireless Mouse', itemSKU: 'MOUSE-001', price: 13.5, moq: 15, leadTime: 3 },
          { itemName: 'Wireless Keyboard', itemSKU: 'KEYBOARD-001', price: 55, moq: 10, leadTime: 3 },
          { itemName: 'HDMI Cable 2m', itemSKU: 'HDMI-001', price: 7, moq: 20, leadTime: 2 }
        ]
      },
      {
        user: user._id,
        name: 'Wholesale Office Mart',
        email: 'wholesale@officemart.com',
        phone: '+1-555-0707',
        website: 'https://officemart.com',
        address: {
          street: '147 Bulk Boulevard',
          city: 'Denver',
          state: 'CO',
          country: 'USA',
          zipCode: '80201'
        },
        category: ['Office Supplies', 'Furniture', 'Stationery'],
        rating: 4.1,
        deliveryTime: 6,
        paymentTerms: 'Net 45',
        notes: 'Best for bulk orders. Contact: Grace Lee',
        status: 'active',
        products: [
          { itemName: 'Office Chair', itemSKU: 'CHAIR-001', price: 140, moq: 10, leadTime: 6 },
          { itemName: 'Printer Paper A4', itemSKU: 'PAPER-001', price: 2.7, moq: 100, leadTime: 5 },
          { itemName: 'Blue Ink Pen', itemSKU: 'PEN-001', price: 3.8, moq: 40, leadTime: 4 }
        ]
      }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - User: ${user.email}`);
    console.log(`   - Password: test123`);
    console.log(`   - Inventory Items: ${inventoryItems.length}`);
    console.log(`   - Vendors: ${vendors.length}`);
    console.log('\n🔍 Inventory Status:');
    console.log(`   - Low Stock Items: ${inventoryItems.filter(i => i.currentStock < i.minStockLevel).length}`);
    console.log(`   - Out of Stock Items: ${inventoryItems.filter(i => i.currentStock === 0).length}`);
    console.log(`   - Needs Reorder: ${inventoryItems.filter(i => i.currentStock <= i.reorderPoint).length}`);
    console.log('\n🎉 You can now login and test the application!');
    console.log('\n🌐 Login credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: test123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
