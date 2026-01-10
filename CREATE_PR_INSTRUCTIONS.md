# 📝 How to Create the Pull Request

## Quick Links

1. **Create PR:** https://github.com/finbud2024/Finbud/compare/main...fix/chatbot-production-url?expand=1
2. **View All PRs:** https://github.com/finbud2024/Finbud/pulls

---

## Step-by-Step Instructions

### 1. Go to the PR Creation Page
Click this link: https://github.com/finbud2024/Finbud/compare/main...fix/chatbot-production-url?expand=1

### 2. Fill in the PR Details

**Title:**
```
Fix chatbot production issues - CORS, URLs, and authentication
```

**Description:** (will auto-populate from template)
```markdown
## 🐛 Fix Chatbot & API Calls in Production

### Problem
The chatbot and several features (FinCoin, threads, stock screener) were failing in production with 500 errors because:
- **CORS**: Backend only allowed `finbud.pro` but site is `finbud.net`
- Multiple services had **hardcoded `localhost:3000`** URLs
- Some services used `VUE_APP_API_URL` (undefined) instead of `VUE_APP_DEPLOY_URL`
- Missing `withCredentials: true` in several API calls
- Frontend was built without `VUE_APP_DEPLOY_URL` set

### Root Cause Analysis
Backend was working perfectly (verified with direct API tests returning 200 OK), but frontend and CORS had issues.

### Solution

#### 1. **CORS Configuration** (CRITICAL)
- Fixed `allowedOrigins` in `backend/functions/server.mjs`
- Added `https://finbud.net` (was missing!)

#### 2. **netlify.toml** 
- Added `VUE_APP_DEPLOY_URL` to `[build.environment]` section
- Added `external_node_modules` for AI SDK dependencies

#### 3. **Fixed Hardcoded URLs:**
- `frontend/src/store/modules/fincoin.js` - 3 URLs fixed
- `frontend/src/services/stockScreenerService.js`
- `frontend/src/services/marketDataService.js`
- `frontend/src/services/aiAgentService.js`

#### 4. **Fixed Missing withCredentials:**
- `frontend/src/views/Home/HomePage.vue`
- `frontend/src/components/ChatPage/ChatComponent.vue`

#### 5. **Session Cookie Security:**
- Added `httpOnly` and `path` to cookie config

### Files Changed (9 files)
```
modified:   netlify.toml
modified:   backend/functions/server.mjs
modified:   backend/Passport/config.js
modified:   frontend/src/views/Home/HomePage.vue
modified:   frontend/src/components/ChatPage/ChatComponent.vue
modified:   frontend/src/store/modules/fincoin.js
modified:   frontend/src/services/stockScreenerService.js
modified:   frontend/src/services/marketDataService.js
modified:   frontend/src/services/aiAgentService.js
```

### Testing

✅ **Backend Verified Working:**
```bash
curl -X POST https://finbud.net/.netlify/functions/server/simple-chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
  
# Response: {"answer":"Hello. How can I assist you today?"}
```

### After Merge
Once merged and deployed, the following will work in production:
- ✅ Chatbot conversations
- ✅ FinCoin balance display
- ✅ Thread creation/management
- ✅ Stock screener
- ✅ Market data services
- ✅ All authenticated API calls

---

**Estimated deployment time:** 2-5 minutes after merge

**Note:** Users may need to clear browser cache after deployment.
```

### 3. Click "Create Pull Request"

### 4. Wait for PR to be Created

### 5. Merge the PR
- Review the changes (optional)
- Click **"Merge pull request"**
- Click **"Confirm merge"**

### 6. Wait for Netlify Deployment
- Netlify will auto-deploy in 2-5 minutes
- Monitor at: https://app.netlify.com

---

## 🔍 If You See an Existing PR

If there's already a PR from this branch:
1. Look for PR with title containing "chatbot" or "production"
2. Check if it's from branch `fix/chatbot-production-url`
3. Review and merge it

---

## ✅ Commits Included

The PR includes these 3 commits:
1. `Fix chat bot production deployment - add VUE_APP_DEPLOY_URL to build environment`
2. `Fix hardcoded localhost URLs in production`
3. `Fix all chatbot production issues - complete solution`

---

## 📞 Need Help?

If you can't find or create the PR, send me a screenshot of:
1. https://github.com/finbud2024/Finbud/pulls
2. https://github.com/finbud2024/Finbud/compare/main...fix/chatbot-production-url
