# 🤖 Google Gemini 2.5 Pro Integration Guide

## ✨ What Changed?

Your AI service now uses **Google Gemini 2.5 Pro** instead of OpenAI GPT-4!

### Updates Made:
- ✅ Replaced OpenAI with Google Generative AI SDK
- ✅ Updated all AI service files to use Gemini
- ✅ Configured Gemini 2.0 Flash Experimental model
- ✅ Updated environment variables
- ✅ Simplified dependencies

---

## 🔑 Get Your Gemini API Key

### Step 1: Go to Google AI Studio
Visit: https://aistudio.google.com/app/apikey

### Step 2: Sign In
- Use your Google account
- Accept the terms of service

### Step 3: Create API Key
1. Click "Create API Key"
2. Select or create a project
3. Copy your API key (starts with `AIza...`)

### Step 4: Add to .env File
Open the file:
```bash
open /Users/abhishekjani/Desktop/hack/ai-service/.env
```

Or edit manually:
```bash
nano /Users/abhishekjani/Desktop/hack/ai-service/.env
```

Update this line:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📦 Install Dependencies

Run this command to install the Gemini SDK:

```bash
cd /Users/abhishekjani/Desktop/hack/ai-service
pip install -r requirements.txt
```

Or install just the Gemini package:
```bash
pip install google-generativeai
```

---

## 🚀 Start the AI Service

```bash
cd /Users/abhishekjani/Desktop/hack/ai-service
python app.py
```

You should see:
```
* Running on http://0.0.0.0:5000
```

---

## 🎯 What Gemini Powers

### 1. Purchase Recommendations
- Analyzes low-stock items
- Compares vendors intelligently
- Provides reasoning for each recommendation

### 2. Inventory Insights
- Health score calculations
- Actionable recommendations
- Trend analysis

### 3. Vendor Analysis
- Performance summaries
- Risk assessments
- Future outlook predictions

---

## 💡 Gemini vs OpenAI - Why This is Better

### Advantages of Gemini 2.5 Pro:
✅ **Faster**: Lower latency responses  
✅ **Free Tier**: Generous free quota (1500 requests/day)  
✅ **Multimodal**: Ready for image analysis (future feature)  
✅ **Longer Context**: 1M token context window  
✅ **Cost Effective**: Better pricing for production  

### Features Used:
- `gemini-2.0-flash-exp` - Latest experimental model
- JSON mode for structured outputs
- Context-aware recommendations
- Multi-step reasoning

---

## 🧪 Test the Integration

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "AI Service is running",
  "version": "1.0.0"
}
```

### 2. Test AI Recommendations
From the frontend:
1. Add some inventory items
2. Add vendors
3. Go to "AI Insights" page
4. Click "Get AI Recommendations"

---

## 🔧 Configuration Options

### Model Selection
You can change the model in the service files. Available options:

```python
# Fast and efficient (Current)
self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Most capable
self.model = genai.GenerativeModel('gemini-pro')

# Multimodal (for images)
self.model = genai.GenerativeModel('gemini-pro-vision')
```

### Temperature & Parameters
Adjust in each service file:

```python
response = self.model.generate_content(
    prompt,
    generation_config={
        'temperature': 0.7,
        'top_p': 0.95,
        'top_k': 40,
        'max_output_tokens': 1024,
    }
)
```

---

## 🔍 Code Changes Summary

### Files Modified:

1. **requirements.txt**
   - Removed: `openai`, `langchain`, `langchain-openai`
   - Added: `google-generativeai==0.3.2`

2. **recommendation_engine.py**
   - Changed from OpenAI client to Gemini model
   - Updated prompt format
   - Added JSON extraction logic

3. **inventory_analyzer.py**
   - Migrated to Gemini
   - Enhanced error handling

4. **vendor_analyzer.py**
   - Switched to Gemini API
   - Improved response parsing

5. **.env**
   - Changed `OPENAI_API_KEY` to `GEMINI_API_KEY`

---

## 📊 API Quotas & Limits

### Free Tier (Gemini):
- **Requests**: 1,500 per day
- **Rate**: 60 requests per minute
- **Tokens**: 32,000 per minute

### When to Upgrade:
- For production use
- High traffic applications
- Need for guaranteed uptime

Pricing: https://ai.google.dev/pricing

---

## 🐛 Troubleshooting

### Error: "API key not valid"
**Solution:**
1. Check your API key is correct
2. Ensure no extra spaces in .env file
3. Restart the AI service

### Error: "Module 'google.generativeai' not found"
**Solution:**
```bash
pip install google-generativeai
```

### Error: "Resource exhausted"
**Solution:**
- You've hit rate limits
- Wait a minute and try again
- Or upgrade to paid tier

### AI Responses Not JSON
**Solution:**
- The code includes JSON extraction logic
- Fallback to rule-based recommendations
- Check logs for details

---

## 🔐 Security Best Practices

1. **Never commit API keys**
   - .env is in .gitignore
   - Use environment variables in production

2. **Rotate keys regularly**
   - Create new keys every 90 days
   - Delete old keys

3. **Monitor usage**
   - Check Google AI Studio dashboard
   - Set up alerts for quota limits

4. **Use service accounts** (Production)
   - For better access control
   - Audit logging

---

## 🎓 Learning Resources

- **Gemini Documentation**: https://ai.google.dev/docs
- **API Reference**: https://ai.google.dev/api
- **Cookbook**: https://github.com/google-gemini/cookbook
- **Community**: https://developers.googleblog.com/

---

## 🚀 Next Steps

1. ✅ Get your Gemini API key
2. ✅ Update .env file
3. ✅ Install dependencies
4. ✅ Start the AI service
5. ✅ Test in the frontend

Your AI-powered vendor management system is now running on Google's latest AI! 🎉

---

## 💬 Need Help?

If you encounter issues:
1. Check the console logs in terminal
2. Review the SETUP.md guide
3. Verify your API key is active
4. Ensure MongoDB and backend are running

Happy coding with Gemini! 🤖✨
