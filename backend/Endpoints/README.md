# Endpoints Directory Structure

This directory contains all API endpoints organized by functional domain.

## 📁 Directory Structure

### `/auth`
Authentication and user management:
- `authRoute.js` - Login, logout, registration endpoints
- `userRoute.js` - User profile and settings management
- `notiRoute.js` - Notification system endpoints

### `/finance`
Financial data and portfolio management:
- `stockRoute.js` - Stock market data endpoints
- `stockTransactionRoute.js` - Stock trading operations
- `transactionRoute.js` - General financial transactions
- `portfolioRoute.js` - Portfolio management endpoints
- `goalRoute.js` - Financial goal tracking
- `finCoinRouter.js` - FinCoin virtual currency system
- `finCompareRoute.js` - Financial product comparison tools

### `/social`
Social features and educational content:
- `forumRoute.js` - Community forum endpoints
- `threadRoute.js` - Forum thread management
- `postRoute.js` - Post creation and management
- `courseRoute.js` - Educational course content
- `eventRoute.js` - Financial events and calendar

### `/trading`
Trading simulation and analysis:
- `QuantSimulatorRoute.js` - Quantitative trading simulator
- `cryptoRoute.js` - Cryptocurrency trading endpoints
- `quantSimulator/` - Advanced simulation modules
  - `multiplierSimulator.js` - Leverage trading simulation
  - `multiplierSimulatorEndpoints.js` - API endpoints for multiplier trading

### `/data`
Data aggregation and market information:
- `vietStock.js` - Vietnamese stock market data
- `newsRoute.js` - Financial news aggregation
- `articleRoute.js` - Article content management
- `superInvestorsRoute.js` - Super investor tracking
- `finData/` - Financial data sub-modules
  - `filingsRoute.js` - SEC filings and regulatory data
  - `transactionRoute.js` - Transaction data processing

### `/services`
Core platform services:
- `chatRoute.js` - AI chat and assistance endpoints
- `proxyRoute.js` - External API proxy services
- `subChat/` - Specialized chat modules
  - `chatStockRoute.js` - Stock-specific chat features

### `/external`
Third-party service integrations:
- `PlaidService.js` - Banking and financial account integration

### `/analytics` (Empty)
Reserved for future analytics endpoints

## 🔗 API Patterns

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/verify` - Token verification

### Finance
- `GET /stocks/:symbol` - Stock data
- `POST /portfolio/add` - Add to portfolio
- `GET /transactions/history` - Transaction history

### Social
- `GET /forum/threads` - Forum threads
- `POST /forum/thread` - Create thread
- `GET /events/calendar` - Event calendar

### Trading
- `POST /trading/simulate` - Run simulation
- `GET /trading/history` - Trading history
- `POST /crypto/trade` - Crypto trading

## 🚀 Usage

Each endpoint category serves specific platform functionality:

1. **Auth** - User identity and session management
2. **Finance** - Core financial data and operations
3. **Social** - Community and educational features
4. **Trading** - Simulation and analysis tools
5. **Data** - Market information and aggregation
6. **Services** - Platform utilities and AI features
7. **External** - Third-party integrations

## 📝 Development Guidelines

- All endpoints include proper error handling
- Authentication middleware applied where required
- Rate limiting implemented for data-intensive endpoints
- Consistent response formats across all routes
- Comprehensive input validation and sanitization

## 🔒 Security

- JWT token-based authentication
- Input validation on all endpoints
- CORS configuration for frontend integration
- Rate limiting to prevent abuse
- Secure external API key management 