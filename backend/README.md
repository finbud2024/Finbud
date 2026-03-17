# Backend Structure

## Directory Organization

### `/models/`
Database schemas and models (previously `Database_Schema/`)
- **core/**: Core models (User, Chat, Noti, Source)
- **finance/**: Financial models (Goal, Portfolio, FinCoin, etc.)
- **market-data/**: Market data models (Stock, Holding, MarketValue, etc.)
- **social/**: Social features models (Article, Forum, Course, etc.)
- **trading/**: Trading models (Transaction, StockTransaction, Crypto, etc.)

### `/routes/`
API route handlers (previously `Endpoints/`)
- **auth/**: Authentication routes
- **data/**: Data retrieval routes
- **finance/**: Financial feature routes
- **services/**: Service routes (chat, proxy, etc.)
- **social/**: Social feature routes
- **trading/**: Trading routes

### `/functions/`
Server functions and utilities
- **cronjobs/**: Scheduled tasks
- **scrapers/**: Web scraping utilities
- **utils/**: Helper functions

### `/middleware/`
Express middleware (authentication, validation, etc.)

### `/Passport/`
Passport.js authentication strategies

### `/utils/`
General utility functions

## Naming Convention
- Use camelCase for files: `routeName.js`
- Use kebab-case for folders: `feature-name/`



