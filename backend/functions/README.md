# Functions Directory Structure

This directory contains all backend processing functions organized by category.

## 📁 Directory Structure

### `/cronjobs`
Scheduled automated tasks and background jobs:
- `marketValueCronJob.js` - Market value update scheduler
- `portfolioCronjob.js` - Portfolio data maintenance

### `/scrapers`
Data extraction and web scraping utilities:

#### `/scrapers/web`
General web content scrapers:
- `dscScraper.js` - DSC financial data scraper
- `eventScraper.js` - Financial events scraper
- `fetchForum.js` - Forum content fetcher
- `fundLetterScraper.js` - Fund letter document scraper
- `holdingScraper.js` - Holdings data scraper
- `marketValueScraper.js` - Market value data scraper
- `ownershipHistoryScraper.js` - Ownership history tracker
- `topInvestorScraper.js` - Top investor data scraper
- `vietStockOverviewScraper.js` - Vietnamese stock overview
- `vnexpressScraper.js` - VnExpress news scraper
- `vozScraper.js` - VOZ forum content scraper

#### `/scrapers/macro`
Macroeconomic data scrapers:
- `vietStockScraperCPI.js` - Consumer Price Index data
- `vietStockScraperFDI.js` - Foreign Direct Investment data
- `vietStockScraperGDP.js` - GDP statistics
- `vietStockScraperImportExport.js` - Trade balance data

#### `/scrapers/market`
Market-specific data scrapers:
- `filingsDocuments.js` - SEC filings and regulatory documents

### `/trading`
Trading simulation and strategy modules:
- `tradingsimulator.py` - Python trading simulator engine

### `/utils`
Utility functions and helpers:
- `finCompare.js` - Financial comparison utilities
- `requirements.txt` - Python dependencies

### `/data`
Static data files and configurations:
- `fundLetterData.json` - Fund letter templates and data
- `investorCards.json` - Investor profile data

## 🚀 Usage

Each directory contains specialized functions for different aspects of the FinBud platform:

1. **Scrapers** extract real-time data from various sources
2. **Cronjobs** maintain data freshness automatically
3. **Trading** modules provide simulation capabilities
4. **Utils** offer reusable functionality across the platform

## 📝 Development Notes

- All scrapers include error handling and rate limiting
- Cronjobs are configured with appropriate scheduling
- Trading functions support both paper and simulation modes
- Utils are designed for maximum reusability 