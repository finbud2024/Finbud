# Utils Directory Structure

This directory contains utility functions organized by category for better maintainability and reusability.

## 📁 Directory Structure

### `/validation`
Input validation and request verification utilities:
- `validateRequest.js` - Request validation middleware and helpers

### `/data-processing`
Data transformation and processing utilities:
- `stockSeeding.js` - Stock data seeding and initialization
- `filingsDateUtils.js` - Date processing for SEC filings
- `getRecentQuarter.js` - Quarter calculation utilities

### `/xml-parsing`
XML processing and parsing utilities:
- `parsingXML.js` - General XML parsing functions
- `processForm4.js` - SEC Form 4 specific XML processing

### `/file-management`
File system operations and document management:
- `setupUserDocuments.js` - User document initialization and setup

### `/scraping`
Web scraping utilities and helpers:
- `scraperUtils.js` - Common scraping functions and utilities

## 🚀 Usage Examples

### Validation
```javascript
const { validateRequest } = require('./validation/validateRequest');
// Validate incoming API requests
```

### Data Processing
```javascript
const { getRecentQuarter } = require('./data-processing/getRecentQuarter');
// Get current or recent quarter information
```

### XML Parsing
```javascript
const { parseXML } = require('./xml-parsing/parsingXML');
// Parse XML documents and forms
```

### File Management
```javascript
const { setupUserDocuments } = require('./file-management/setupUserDocuments');
// Initialize user document structure
```

### Scraping
```javascript
const { scraperUtils } = require('./scraping/scraperUtils');
// Common scraping utilities
```

## 📝 Development Guidelines

1. **Reusability** - All utilities should be designed for maximum reusability
2. **Error Handling** - Include comprehensive error handling in all functions
3. **Documentation** - Add JSDoc comments for all exported functions
4. **Testing** - Write unit tests for critical utility functions
5. **Performance** - Optimize for performance, especially for frequently used utilities

## 🔄 Import Path Updates

When using these utilities, update your import paths:

```javascript
// Old paths
require('../utils/validateRequest')
require('../utils/stockSeeding')

// New paths
require('../utils/validation/validateRequest')
require('../utils/data-processing/stockSeeding')
```

## 🛠️ Adding New Utilities

When adding new utility functions:

1. Choose the appropriate category directory
2. If no suitable category exists, create a new one
3. Follow existing naming conventions
4. Add comprehensive documentation
5. Update this README with new utilities 