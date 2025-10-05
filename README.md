# 🛒 SmartVendor - AI-Powered Vendor Management System

<div align="center">

![AI-Powered](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=google)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Intelligent vendor purchasing management with AI recommendations and Skyscanner-style vendor discovery**

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#tech-stack)

</div>

---

## 🌟 Overview

SmartVendor is a cutting-edge vendor purchasing management system that uses **Google Gemini AI** to help shop owners make smart purchasing decisions. Like Skyscanner for flights, SmartVendor searches across multiple online marketplaces to find the best vendors at the cheapest prices.

### 🎯 Key Highlights

- 🤖 **AI-Powered Recommendations** using Google Gemini 2.5 Pro
- 🔍 **Skyscanner-Style Vendor Search** across 5+ marketplaces
- 📦 **Smart Capacity Management** - Never over-order!
- 💰 **Automatic Price Comparison** with bulk discounts
- 📊 **Real-time Analytics** and insights
- 🎨 **Beautiful Material-UI Interface**

---

## ✨ Features

### 1. 🧠 AI-Powered Intelligence
- Smart purchase recommendations based on inventory levels
- Predictive analytics for stock trends
- Best vendor selection using multiple factors
- Natural language insights and explanations

### 2. 🔍 Multi-Marketplace Vendor Discovery
Search vendors from:
- **Alibaba** (China) - Bulk manufacturing
- **Amazon Business** (USA) - Fast delivery
- **IndiaMART** (India) - Competitive pricing
- **Made-in-China** - Direct manufacturers
- **Global Sources** - International trade

### 3. 📦 Store Capacity Management
- Set maximum storage capacity for each item
- Visual progress bars showing capacity usage
- Smart ordering that respects space limits
- Color-coded indicators (Green/Yellow/Orange)

### 4. 💰 Intelligent Price Comparison
- Automatic bulk discount calculations (5-15%)
- Location-based pricing
- Compare delivery times vs. costs
- Find fastest, cheapest, or best-rated vendors

### 5. 📊 Advanced Analytics
- Real-time inventory tracking
- Low stock alerts
- Purchase order history
- Vendor performance metrics
- Spending trends analysis

---

## 🎬 Demo

### Inventory with Capacity Management
```
Product: Laptop - Dell XPS 15
Current Stock: 5/20 units
[▓▓▓░░░░░░░] 25% capacity
Status: Low Stock ⚠️
Recommendation: Order 15 units (respects capacity limit)
```

### Vendor Discovery Search
```
Searching for: "Wireless Mouse" (50 units)
Found: 13 vendors

🏆 Best Deal: Delhi Office Mart (India)
   💰 $8.92/unit | ⭐ 4.2/5 | 🚚 12 days
   Total: $446 (10% bulk discount applied)
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- MongoDB
- Google Gemini API Key ([Get Free Key](https://makersuite.google.com/app/apikey))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smartvendor.git
   cd smartvendor
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Install AI Service Dependencies**
   ```bash
   cd ai-service
   pip3 install -r requirements.txt
   ```

5. **Configure Environment Variables**

   **Backend** (`backend/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/vendor-management
   JWT_SECRET=your_jwt_secret_here
   AI_SERVICE_URL=http://localhost:5001
   PORT=3001
   ```

   **AI Service** (`ai-service/.env`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5001
   FLASK_ENV=development
   ```

   **Frontend** (`frontend/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```

6. **Seed Database with Sample Data**
   ```bash
   cd backend
   node seedData.js
   ```

7. **Start All Services**

   **Terminal 1 - AI Service:**
   ```bash
   cd ai-service
   python3 app.py
   ```

   **Terminal 2 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 3 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the Application**
   ```
   Open: http://localhost:3000
   Login: test@example.com
   Password: test123
   ```

---

## 📖 Usage

### 1. Managing Inventory
- Add products with capacity limits
- Track stock levels in real-time
- View capacity utilization with visual bars
- Get alerts when stock is low

### 2. Searching Vendors Online
1. Go to **Vendors** page
2. Click **"Search Online Vendors"**
3. Enter product name (e.g., "Wireless Mouse")
4. Set quantity for bulk pricing
5. Click **"Search Vendors"**
6. Compare results and select best deal

### 3. Creating Purchase Orders
- View AI recommendations
- Auto-generate orders based on low stock
- Track order status (Pending → Approved → Ordered → Received)
- View order history and analytics

### 4. AI Insights
- Get smart recommendations
- View inventory predictions
- Analyze vendor performance
- Optimize purchasing decisions

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 with TypeScript
- **Material-UI** 5.14 for beautiful components
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### AI Service
- **Python Flask** framework
- **Google Gemini 2.5 Pro** AI model
- **NumPy & Pandas** for data analysis
- **scikit-learn** for ML operations

---

## 📁 Project Structure

```
smartvendor/
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── context/    # React context
│   └── package.json
├── backend/            # Node.js Express backend
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   ├── server.js       # Entry point
│   └── package.json
├── ai-service/         # Python Flask AI service
│   ├── services/       # AI logic
│   ├── app.py          # Flask app
│   └── requirements.txt
└── README.md
```

---

## 🎯 Key Features Explained

### Store Capacity Management
Each inventory item has a maximum capacity limit. The system:
- Tracks current stock vs. maximum capacity
- Shows visual progress bars (Green → Yellow → Orange)
- Prevents over-ordering beyond storage limits
- Calculates remaining space automatically

**Example:**
```javascript
{
  name: "Laptop - Dell XPS 15",
  currentStock: 5,
  maxCapacity: 20,
  remainingCapacity: 15  // Auto-calculated
}
```

### Vendor Discovery Algorithm
The system searches multiple marketplaces and:
- Calculates location-based pricing (China: 0.7x, India: 0.8x, USA: 1.2x)
- Applies bulk discounts (5-15% based on quantity)
- Considers vendor ratings in pricing
- Sorts by best value (price + quality + speed)

---

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/me       - Get current user
```

### Inventory
```
GET    /api/inventory           - Get all items
POST   /api/inventory           - Add new item
PUT    /api/inventory/:id       - Update item
DELETE /api/inventory/:id       - Delete item
GET    /api/inventory/low-stock - Get low stock items
```

### Vendor Discovery
```
POST /api/vendor-discovery/search   - Search vendors
POST /api/vendor-discovery/compare  - Compare vendors
GET  /api/vendor-discovery/vendor-details/:source/:name
```

### AI Recommendations
```
POST /api/ai/recommend-purchase   - Get purchase recommendations
GET  /api/ai/inventory-insights   - Get inventory insights
POST /api/ai/generate-order       - Generate auto purchase order
```

---

## 🧪 Testing

### Test Vendor Discovery
```bash
./test-vendor-discovery.sh
```

### Manual Testing
1. Login with test account
2. View inventory (7 items low stock)
3. Search for "Wireless Mouse"
4. Compare 13+ vendors
5. Create purchase order

---

## 🚢 Deployment

### Environment Variables for Production

Update `.env` files with production values:
- MongoDB Atlas connection string
- Production API URLs
- Secure JWT secret
- Valid Gemini API key

### Deploy Options
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, DigitalOcean
- **AI Service**: Google Cloud Run, AWS Lambda
- **Database**: MongoDB Atlas

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful AI capabilities
- **Material-UI** for beautiful components
- **MongoDB** for flexible database
- **Skyscanner** for UI/UX inspiration

---

## 📞 Support

For issues and questions:
- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/smartvendor/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/smartvendor/discussions)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ and 🤖 AI

</div>
