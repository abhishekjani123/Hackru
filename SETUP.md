# 🚀 Quick Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v4.4 or higher) - Running locally or use MongoDB Atlas
- **npm** or **yarn**

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..

# Install Python dependencies for AI service
cd ai-service && pip install -r requirements.txt && cd ..
```

### 2. Set Up Environment Variables

#### Backend (.env)
Create or update `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/vendor-management
JWT_SECRET=your_super_secret_jwt_key_change_this
AI_SERVICE_URL=http://localhost:5000
PORT=3001
NODE_ENV=development
```

#### AI Service (.env)
Create or update `ai-service/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
FLASK_ENV=development
```

**Get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste it in the `.env` file

#### Frontend (.env)
Already created at `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001
```

### 3. Start MongoDB

Make sure MongoDB is running:

**MacOS:**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud):
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI` in `backend/.env`

### 4. Start the Application

#### Option A: Start All Services Together
```bash
npm run dev
```

#### Option B: Start Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python app.py
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **AI Service:** http://localhost:5000

## First Time Setup

### Create Your Account
1. Open http://localhost:3000
2. Click "Create one" to register
3. Fill in your shop details:
   - Full Name
   - Email & Password
   - Shop Name & Type
   - Phone Number
4. Click "Create Account"

### Add Sample Data

#### 1. Add Vendors
Go to **Vendors** page and add some vendors:
- Name: "ABC Wholesale"
- Email: abc@wholesale.com
- Phone: (555) 123-4567
- Delivery Time: 7 days
- Rating: 4/5

#### 2. Add Inventory Items
Go to **Inventory** page and add items:
- Name: "Coffee Beans"
- Category: "Food"
- Current Stock: 5
- Reorder Point: 15
- Cost Price: $10
- Selling Price: $15

#### 3. Let AI Help!
Go to **AI Insights** and click:
- "Get AI Recommendations" - AI analyzes inventory and suggests purchases
- "Generate Purchase Orders" - Auto-create orders with best vendors

## Features Overview

### 🤖 AI-Powered Features
- **Smart Vendor Recommendations:** AI compares vendors and finds best deals
- **Automated Purchase Orders:** One-click order generation
- **Inventory Insights:** Predictive analytics and trends
- **Vendor Performance Analysis:** AI-driven vendor scoring

### 📊 Dashboard
- Real-time inventory metrics
- Low stock alerts
- Spending trends
- Top vendors

### 📦 Inventory Management
- Add/Edit/Delete items
- Track stock levels
- Low stock warnings
- Reorder point notifications

### 🏪 Vendor Management
- Vendor profiles with ratings
- Performance tracking
- Product catalogs
- Comparison tools

### 🛒 Purchase Orders
- Create manual orders
- AI-generated orders
- Order tracking
- Receive and approve orders

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running. Start it with the commands above.

### OpenAI API Error
```
Error: Invalid API key
```
**Solution:** 
1. Check your API key in `ai-service/.env`
2. Ensure you have credits in your OpenAI account
3. The app works without OpenAI (uses rule-based logic) but AI features are limited

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Kill the process using the port:
```bash
# MacOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Errors
**Solution:** Make sure all three services are running on correct ports:
- Frontend: 3000
- Backend: 3001
- AI Service: 5000

## Development Tips

### Testing API Endpoints
Use tools like Postman or curl:

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Viewing Database
Use MongoDB Compass (GUI):
- Download from https://www.mongodb.com/products/compass
- Connect to: mongodb://localhost:27017
- Database: vendor-management

### Code Structure
```
hack/
├── backend/           # Express.js REST API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   └── middleware/    # Auth, validation
├── frontend/          # React TypeScript app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Main pages
│   │   ├── services/    # API calls
│   │   └── context/     # Auth context
├── ai-service/        # Python Flask AI service
│   └── services/      # AI engines
└── package.json       # Root scripts
```

## Next Steps

1. ✅ Add more inventory items
2. ✅ Add multiple vendors with products
3. ✅ Let AI generate purchase recommendations
4. ✅ Create and approve purchase orders
5. ✅ Track vendor performance
6. ✅ Analyze spending trends

## Support

For issues or questions:
- Check troubleshooting section above
- Review the main README.md
- Check API documentation

## Production Deployment

For production:
1. Use strong JWT_SECRET
2. Enable MongoDB authentication
3. Use environment-specific .env files
4. Add rate limiting
5. Enable HTTPS
6. Set up proper logging
7. Use process managers (PM2 for Node, Gunicorn for Python)

Happy coding! 🎉
