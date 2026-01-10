## 🐛 Fix Chatbot & API Calls in Production

### Problem
The chatbot and several features (FinCoin, threads, stock screener) were failing in production with 500 errors because:
- Multiple services had **hardcoded `localhost:3000`** URLs
- Some services used `VUE_APP_API_URL` (undefined) instead of `VUE_APP_DEPLOY_URL`
- The frontend was built without `VUE_APP_DEPLOY_URL` set, causing API calls to fail

### Root Cause Analysis
Backend was working perfectly (verified with direct API tests returning 200 OK), but frontend had mixed URL configurations:
- Some components used `process.env.VUE_APP_DEPLOY_URL` correctly ✅
- Others had hardcoded `http://localhost:3000` ❌
- Others used wrong env var `VUE_APP_API_URL` ❌

### Solution

#### 1. **netlify.toml** 
- Added `VUE_APP_DEPLOY_URL` to `[build.environment]` section
- Added `external_node_modules` for AI SDK dependencies

#### 2. **Fixed Hardcoded URLs:**
- `frontend/src/store/modules/fincoin.js` - 3 URLs fixed
- `frontend/src/services/stockScreenerService.js`
- `frontend/src/services/marketDataService.js`
- `frontend/src/services/aiAgentService.js`

### Files Changed
```
netlify.toml                                    | +2 
frontend/src/store/modules/fincoin.js           | 3 changes
frontend/src/services/stockScreenerService.js   | 1 change
frontend/src/services/marketDataService.js      | 1 change
frontend/src/services/aiAgentService.js         | 1 change
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
- ✅ AI agent features

---

**Estimated deployment time:** 2-5 minutes after merge
