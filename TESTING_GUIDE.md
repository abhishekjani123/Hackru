# 🚀 Testing Guide - AI Vendor Management System

## ✅ System Status

All services are currently running:
- ✅ **Frontend**: http://localhost:3000
- ✅ **Backend API**: http://localhost:3001
- ✅ **AI Service**: http://localhost:5001

---

## 🔐 Login Credentials

**Email**: `test@example.com`  
**Password**: `test123`

---

## 📦 Dummy Data Included

### **10 Inventory Items** (Products):

1. **Laptop - Dell XPS 15** - Low stock (5/10) - $1200
2. **Wireless Mouse** - Low stock (3/20) - $15
3. **USB-C Cable** - OUT OF STOCK (0/50) ⚠️ - $5
4. **Office Chair** - In stock (12/8) - $150
5. **Desk Lamp** - In stock (25/15) - $20
6. **Printer Paper A4** - Low stock (8/30) - $3
7. **Blue Ink Pen** - Low stock (2/25) - $4
8. **Monitor Stand** - In stock (15/10) - $30
9. **Wireless Keyboard** - Low stock (7/15) - $60
10. **HDMI Cable 2m** - Low stock (1/20) - $8

**Stock Status**:
- ⚠️ **7 items** need reordering
- 🚨 **1 item** is out of stock (USB-C Cable)

### **7 Vendors** with Different Pricing:

1. **TechSupply Co.** ⭐4.5 - Fast delivery (3 days)
   - Laptops, Mice, Cables
   
2. **Office Solutions Ltd** ⭐4.2 - Medium delivery (5 days)
   - Chairs, Lamps, Paper
   
3. **Global Electronics Hub** ⭐4.8 - Fastest delivery (2 days) 🚀
   - Premium pricing, best quality
   
4. **Budget Office Supplies** ⭐3.9 - Slowest (7 days) but cheapest 💰
   - Paper, Pens, Cables
   
5. **Premium Furniture Co** ⭐4.6 - Furniture specialist (10 days)
   - High-end chairs, lamps, stands
   
6. **Quick Tech Distributors** ⭐4.3 - Good balance (4 days)
   - Mice, Keyboards, Cables
   
7. **Wholesale Office Mart** ⭐4.1 - Best for bulk (6 days)
   - Chairs, Paper, Pens

---

## 🎯 What to Test

### 1. **Dashboard** 📊
- View inventory statistics
- See low stock alerts
- Check quick actions

### 2. **Inventory Management** 📦
- Browse all 10 products
- Filter by category (Electronics, Furniture, Office Supplies)
- See stock status indicators:
  - 🔴 Red = Out of stock
  - 🟡 Yellow = Low stock
  - 🟢 Green = In stock
- Add new inventory items
- Edit existing items
- View which items need reordering

### 3. **Vendor Management** 🏪
- View all 7 vendors
- Compare vendor ratings
- Check delivery times
- See product catalogs with pricing
- Add new vendors
- Edit vendor information

### 4. **Purchase Orders** 📋
- Create new purchase orders
- Select vendors
- Add multiple items to an order
- See total calculations
- View order history
- Track order status (Pending, Approved, Completed)

### 5. **AI Insights** 🤖 (Powered by Google Gemini 2.5 Pro)
- Get smart recommendations on:
  - Which vendors offer the best prices
  - Optimal reorder quantities
  - Best time to reorder
  - Vendor comparison for specific items
- Inventory analysis
- Predictive insights

---

## 🔥 Key Features to Try

### **Smart Vendor Comparison**
1. Go to **Purchase Orders**
2. Try to order "USB-C Cable" (currently out of stock)
3. The AI will suggest:
   - **Budget Office Supplies**: $4.00/unit (cheapest but 7 days)
   - **TechSupply Co.**: $4.50/unit (3 days)
   - **Global Electronics Hub**: $7.50/unit (fastest - 2 days)

### **Automated Stock Alerts**
- Dashboard shows **7 items** needing attention
- Click on alerts to view details
- Get AI recommendations for reordering

### **Vendor Performance Tracking**
- Compare vendors by:
  - Rating (⭐)
  - Delivery time
  - Price competitiveness
  - Payment terms

---

## 🎨 UI Features

- **Modern Material Design** with beautiful cards and animations
- **Responsive Layout** - works on all screen sizes
- **Color-coded Status** indicators for quick visual scanning
- **Interactive Charts** showing inventory trends
- **Real-time Updates** when data changes

---

## 💡 Test Scenarios

### Scenario 1: **Emergency Stock Replenishment**
1. Notice "USB-C Cable" is out of stock
2. Go to AI Insights → Get recommendations
3. Create purchase order with fastest vendor
4. Track order status

### Scenario 2: **Cost Optimization**
1. Check multiple low-stock items
2. Compare vendors for each item
3. Create bulk order with cheapest vendors
4. Calculate savings

### Scenario 3: **Vendor Evaluation**
1. View all vendors
2. Compare ratings and delivery times
3. Check product availability
4. Make informed decision

---

## 🆘 Troubleshooting

### If Frontend doesn't load:
```bash
cd /Users/abhishekjani/Desktop/hack/frontend
npm start
```

### If Backend API fails:
```bash
cd /Users/abhishekjani/Desktop/hack/backend
npm run dev
```

### If AI Service is down:
```bash
cd /Users/abhishekjani/Desktop/hack/ai-service
python3 app.py
```

### To reset dummy data:
```bash
cd /Users/abhishekjani/Desktop/hack/backend
node seedData.js
```

---

## 📱 Quick Access URLs

- **Application**: http://localhost:3000
- **API Health Check**: http://localhost:3001/api/auth/health
- **AI Service Health**: http://localhost:5001/health

---

## 🎉 Have Fun Testing!

The system is fully loaded with realistic data. Try different workflows, test the AI recommendations, and explore all the features!

**Need to add your own Gemini API Key?**
Edit: `/Users/abhishekjani/Desktop/hack/ai-service/.env`
```
GEMINI_API_KEY=your_actual_api_key_here
```
