# Database Schema Directory Structure

This directory contains all MongoDB/Mongoose schema definitions organized by functional domain.

## 📁 Directory Structure

### `/core`
Core system and user management schemas:
- `User.js` - User account and profile schema
- `Chat.js` - Chat and messaging system schema
- `Noti.js` - Notification system schema
- `Source.js` - Data source and reference schema

### `/social`
Social features and educational content schemas:
- `Post.js` - Forum post and content schema
- `Thread.js` - Discussion thread schema
- `Comment.js` - Comment and reply schema
- `Forum.js` - Forum category and structure schema
- `Course.js` - Educational course content schema
- `Event.js` - Financial events and calendar schema
- `Article.js` - Article and blog content schema
- `Quiz.js` - Educational quiz and assessment schema

### `/trading`
Trading simulation and transaction schemas:
- `StockTransaction.js` - Stock trading operations schema
- `ChatStockSimulator.js` - Trading simulator chat schema
- `Crypto.js` - Cryptocurrency trading schema
- `Transaction.js` - General transaction schema

### `/finance`
Financial management and portfolio schemas:
- `Portfolio.js` - User portfolio management schema
- `UserHolding.js` - Individual asset holdings schema
- `Goal.js` - Financial goal tracking schema
- `FinCoinTransaction.js` - Virtual currency transaction schema
- `FCompare.js` - Financial product comparison schema

### `/market-data`
Market information and data aggregation schemas:
- `Stock.js` - Stock information and metadata schema
- `MarketValue.js` - Market valuation data schema
- `Holding.js` - Institutional holdings schema
- `CompanyPortfolio.js` - Company portfolio tracking schema
- `TopInvestors.js` - Top investor tracking schema
- `ScrapedUser.js` - Scraped user data schema
- `vietStockCPI.js` - Vietnamese CPI data schema
- `vietStockFDI.js` - Vietnamese FDI data schema
- `vietStockGDP.js` - Vietnamese GDP data schema
- `vietStockImportExport.js` - Vietnamese trade data schema
- `vietStockOverview.js` - Vietnamese market overview schema

#### `/market-data/finData`
Financial data sub-schemas:
- `CompanySchema.js` - Company information schema
- `EarningCalendar.js` - Earnings calendar schema
- `FilingsSchema.js` - SEC filings schema
- `TransactionSchema.js` - Financial transaction data schema

### `/analytics` (Reserved)
Future analytics and reporting schemas

## 🔗 Schema Relationships

### Core Dependencies
- `User.js` → Referenced by most other schemas for user associations
- `Source.js` → Referenced by data schemas for tracking data origins

### Social Network
```
Forum.js → Thread.js → Post.js → Comment.js
Course.js → Quiz.js
Event.js → Calendar integration
```

### Trading Flow
```
User.js → Portfolio.js → UserHolding.js
User.js → StockTransaction.js → Transaction.js
ChatStockSimulator.js → Trading simulations
```

### Market Data Flow
```
Stock.js → MarketValue.js
CompanyPortfolio.js → Holding.js
TopInvestors.js → ScrapedUser.js
```

## 🚀 Usage Examples

### Core Schemas
```javascript
const User = require('./core/User');
const Chat = require('./core/Chat');
```

### Social Features
```javascript
const Post = require('./social/Post');
const Thread = require('./social/Thread');
const Course = require('./social/Course');
```

### Trading
```javascript
const Portfolio = require('./finance/Portfolio');
const StockTransaction = require('./trading/StockTransaction');
```

### Market Data
```javascript
const Stock = require('./market-data/Stock');
const MarketValue = require('./market-data/MarketValue');
const CompanyData = require('./market-data/finData/CompanySchema');
```

## 📝 Schema Design Guidelines

### 1. **Naming Conventions**
- Use PascalCase for schema names
- Use descriptive, clear names
- Add Schema suffix for sub-schemas

### 2. **Field Standards**
```javascript
{
  _id: ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}
```

### 3. **Validation Rules**
- Add required fields validation
- Include data type validation
- Set appropriate min/max constraints
- Use custom validators when needed

### 4. **Indexing Strategy**
- Index frequently queried fields
- Create compound indexes for complex queries
- Add text indexes for search functionality

## 🔄 Migration Notes

### Import Path Updates
When using the reorganized schemas, update import paths:

```javascript
// Old paths
require('./User')
require('./Stock')
require('./Portfolio')

// New paths
require('./core/User')
require('./market-data/Stock')
require('./finance/Portfolio')
```

### Database Relationships
No changes to actual database collections or relationships - only file organization has changed.

## 🛠️ Adding New Schemas

When creating new schemas:

1. **Choose appropriate category** based on functionality
2. **Follow naming conventions** established in each directory
3. **Include standard fields** (timestamps, status flags)
4. **Add proper validation** and indexing
5. **Update this README** with new schema information
6. **Document relationships** with existing schemas

## 🔒 Security Considerations

- **User data** in core schemas requires encryption for sensitive fields
- **Financial data** in finance and trading schemas needs audit trails
- **Market data** should include data source validation
- **Social content** requires content moderation flags

## 📊 Performance Optimization

- **Core schemas** are heavily accessed - optimize with proper indexing
- **Market data schemas** handle large volumes - consider partitioning
- **Social schemas** benefit from text search indexes
- **Trading schemas** require real-time performance optimization 