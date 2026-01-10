# 🔧 Netlify Deployment Fix Guide

## Problem Summary
The chatbot works locally but returns **500 Internal Server Error** on production at https://finbud.net/chat-view

## Root Cause
The backend `/simple-chat` endpoint is failing because all AI providers (OpenAI, Gemini, Groq) are unavailable. This typically happens when:
1. ❌ **Missing or invalid API keys** on Netlify
2. ❌ **Environment variables not configured** properly
3. ❌ **API rate limits exceeded**

---

## ✅ Solution: Configure Netlify Environment Variables

### Step 1: Access Netlify Environment Variables

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Select your **Finbud** site
3. Click **Site settings** → **Environment variables**

### Step 2: Add/Verify These Environment Variables

Add the following variables (replace with your actual keys):

#### **Required Variables (Backend)**

```bash
# MongoDB Connection
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database

# Session Security
SESSION_SECRET=your-random-secret-key-here-at-least-32-characters-long

# AI Provider Keys (AT LEAST ONE REQUIRED)
GROQ_API_KEY=your-groq-api-key-here
VUE_APP_OPENAI_API_KEY=your-openai-key-here
VUE_APP_GEMINI_API_KEY=your-gemini-key-here

# Node Environment
NODE_ENV=production
```

#### **Required Variables (Frontend)**

```bash
# Backend API URL
VUE_APP_DEPLOY_URL=https://finbud.net/.netlify/functions/server

# Optional: If you want frontend to use API keys directly
VUE_APP_OPENAI_API_KEY=your-openai-key-here
VUE_APP_GEMINI_API_KEY=your-gemini-key-here
```

### Step 3: Get Your API Keys

If you don't have API keys, here's where to get them:

#### **Groq (Recommended - Free & Fast)**
1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up / Log in
3. Go to **API Keys** → **Create API Key**
4. Copy the key (format: `gsk_...`)

#### **OpenAI (Optional)**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy the key (format: `sk-...`)

#### **Gemini (Optional)**
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy the key (format: `AIza...`)

### Step 4: Trigger New Deployment

After adding/updating environment variables:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete (usually 2-5 minutes)

---

## 🧪 Testing After Deployment

### Test 1: Direct API Test

Open browser console on https://finbud.net and run:

```javascript
fetch('https://finbud.net/.netlify/functions/server/simple-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }]
  })
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e));
```

**Expected result:** `✅ Success: { answer: "..." }`

### Test 2: Use the Chat Interface

1. Go to https://finbud.net/chat-view
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+F5)
4. Send a test message

---

## 🔍 Debugging Tips

### Check Netlify Function Logs

1. Go to Netlify Dashboard → **Functions** tab
2. Click on **server** function
3. View recent logs to see error messages

### Common Error Messages & Solutions

| Error Message | Solution |
|--------------|----------|
| `OpenAI failed, trying Gemini: 429` | OpenAI rate limit - needs valid GROQ_API_KEY |
| `All Gemini models failed` | Invalid Gemini key or model deprecated |
| `Groq API key not configured` | Add GROQ_API_KEY to Netlify env vars |
| `AI service temporarily unavailable` | All 3 providers failed - check all API keys |

---

## 📊 Current API Fallback Flow

Your backend tries providers in this order:

1. **OpenAI** (`gpt-3.5-turbo`) → If fails (429 or invalid key)
2. **Gemini** (tries 3 models: `gemini-1.5-flash`, `gemini-pro`, `gemini-1.0-pro`) → If all fail
3. **Groq** (`llama-3.3-70b-versatile`) → If fails
4. **Returns 500 error** ❌

**Recommendation:** Focus on getting a valid `GROQ_API_KEY` as it's free, fast, and reliable.

---

## ✅ Verification Checklist

- [ ] All required environment variables added to Netlify
- [ ] At least one valid AI API key configured (GROQ recommended)
- [ ] `VUE_APP_DEPLOY_URL` set to `https://finbud.net/.netlify/functions/server`
- [ ] Triggered new deployment with "Clear cache"
- [ ] Tested direct API endpoint (returns 200)
- [ ] Tested chat interface (messages work)
- [ ] Checked Netlify function logs (no errors)

---

## 🆘 Still Not Working?

If you've completed all steps and it still doesn't work:

1. **Check Netlify Function Logs** for specific error messages
2. **Verify API keys are valid** by testing them directly on provider websites
3. **Check API quotas** - you might have exceeded free tier limits
4. **Contact me** with:
   - Screenshot of Netlify function logs
   - Screenshot of environment variables (hide actual keys)
   - Any error messages from browser console

---

## 📝 Notes

- Environment variables in Netlify are **case-sensitive**
- After updating env vars, you **MUST redeploy** for changes to take effect
- Free tier API limits:
  - Groq: 30 requests/minute (good for testing)
  - OpenAI: Requires paid account for production
  - Gemini: 60 requests/minute (free tier)
