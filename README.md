# 🛒 Smart Vendor Purchasing Management System

An AI-powered vendor purchasing management platform that helps shop owners automate inventory management, find the best vendors, and create smart purchase orders.

## 🚀 Features

- **Intelligent Inventory Analysis**: AI-powered detection of low stock items
- **Smart Vendor Comparison**: Automated vendor search with price comparison
- **Automated Purchase Orders**: AI-generated purchase orders with best deals
- **Predictive Analytics**: Recommendations for stock optimization
- **Beautiful UI**: Modern, minimalistic, and story-driven interface
- **Real-time Insights**: Live dashboard with actionable metrics

## 🛠️ Tech Stack

- **Frontend**: React, Material-UI, Chart.js, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **AI Service**: Python, Flask, OpenAI GPT-4, LangChain
- **Database**: MongoDB
- **Authentication**: JWT

## 📦 Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
   - Backend: Create `backend/.env`
   - AI Service: Create `ai-service/.env`

3. Start the development servers:
```bash
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:5000
PORT=3001
```

### AI Service (.env)
```
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

## 📱 Usage

1. Register your shop and add inventory items
2. Add vendor information and pricing
3. Let AI analyze your inventory and suggest optimal purchases
4. Review and approve automated purchase orders
5. Track vendor performance and optimize costs

## 🎨 Design Philosophy

The UI is designed to be:
- **Story-driven**: Clear purpose and user journey
- **Minimalistic**: Focus on what matters
- **Interactive**: Engaging animations and transitions
- **Eye-pleasing**: Modern color schemes and typography

## 🤖 AI Features

- Inventory demand forecasting
- Vendor price prediction
- Automated negotiation insights
- Smart reorder point calculations
- Seasonal trend analysis

## 📄 License

MIT
