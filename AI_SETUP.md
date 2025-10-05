# 🤖 AI Setup Guide - Google Gemini API

## ⚠️ Current Status

The AI features are currently using **fallback mode** (basic recommendations without AI) because the Gemini API key needs to be configured.

---

## 🔑 How to Get Your Free Gemini API Key

### Step 1: Go to Google AI Studio
Visit: **https://makersuite.google.com/app/apikey**

Or: **https://aistudio.google.com/app/apikey**

### Step 2: Sign in with your Google Account

### Step 3: Create API Key
1. Click "**Create API Key**"
2. Choose "**Create API key in new project**" (or select an existing project)
3. Copy your API key

### Step 4: Update the AI Service Configuration

Edit the file: `/Users/abhishekjani/Desktop/hack/ai-service/.env`

Replace the existing API key with your new one:

```env
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
PORT=5001
FLASK_ENV=development
```

### Step 5: Restart the AI Service

```bash
# Stop the current AI service (Ctrl+C if running)

# Start it again
cd /Users/abhishekjani/Desktop/hack/ai-service
python3 app.py
```

---

## ✅ Verify It's Working

After restarting the AI service:

1. Open the application: http://localhost:3000
2. Go to **AI Insights** page
3. Click "**Get AI Recommendations**"
4. You should see AI-powered recommendations (not fallback mode)

---

## 🆓 Gemini API Pricing

**Good News:** Gemini API has a generous **FREE tier**:

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

Perfect for development and small-scale usage!

---

## 🔍 What Features Use AI?

1. **Smart Vendor Recommendations** 🏪
   - Analyzes inventory and vendors
   - Finds best prices and delivery times
   - Suggests optimal order quantities

2. **Inventory Insights** 📊
   - Predicts stock trends
   - Identifies slow-moving items
   - Recommends reorder timing

3. **Vendor Analysis** 📈
   - Evaluates vendor performance
   - Compares pricing across vendors
   - Provides data-driven insights

---

## 🛡️ Fallback Mode (Current)

Don't worry! The app still works without AI:

✅ **Basic recommendations** based on:
- Vendor ratings
- Delivery times
- Stock levels
- Simple price comparison

❌ **What you're missing without AI:**
- Advanced predictive analytics
- Natural language insights
- Smart pattern recognition
- Contextual recommendations

---

## 🚨 Common Issues

### "403 Forbidden" Error
- **Cause**: Invalid or expired API key
- **Fix**: Generate a new API key and update `.env`

### "429 Too Many Requests"
- **Cause**: Exceeded free tier limits
- **Fix**: Wait 60 seconds or upgrade to paid tier

### AI Service Won't Start
- **Check**: Python 3 is installed: `python3 --version`
- **Check**: Dependencies installed: `pip3 install -r requirements.txt`
- **Check**: Port 5001 is available

---

## 💡 Pro Tips

1. **Keep your API key secret** - Never commit it to Git
2. **Monitor usage** at: https://makersuite.google.com/
3. **Test with small batches** first
4. **The free tier is usually enough** for development

---

## 📞 Need Help?

If you're having trouble:

1. Check the terminal logs for error messages
2. Verify the API key is correct (no extra spaces)
3. Make sure the AI service is running on port 5001
4. Try refreshing your browser

---

## 🎉 Once Configured

After setting up your API key, you'll unlock:

- **Intelligent vendor selection**
- **Predictive inventory management**
- **Cost optimization recommendations**
- **Natural language explanations**
- **Trend analysis and forecasting**

The AI will make your vendor management **10x smarter**! 🚀
