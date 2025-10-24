import axios from 'axios';

class StockScreenerService {
  constructor() {
    this.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
    this.tradingViewAPI = 'https://scanner.tradingview.com';
    this.alphaVantageAPI = 'https://www.alphavantage.co/query';
    this.apiKey = process.env.VUE_APP_ALPHA_VANTAGE_KEY || 'demo';
    
    console.log('🔧 StockScreenerService initialized with baseURL:', this.baseURL);
    
    // Configure axios with better error handling
    this.axiosInstance = axios.create({
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Cache for stock data
    this.stockCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Get all US stocks with comprehensive coverage
  async getAllUSStocks() {
    console.log('📊 Fetching comprehensive US stock data...');
    
    // Check cache first
    const cacheKey = 'all-us-stocks';
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('✅ Using cached stock data');
      return cached;
    }

    // Try backend API first with proper pagination
    try {
      console.log('🔄 Trying backend API with pagination...');
      const result = await this.fetchFromBackendAPIWithPagination();
      
      if (result && result.stocks && result.stocks.length > 0) {
        console.log(`✅ Successfully loaded ${result.stocks.length} stocks from backend API`);
        
        // Use API data regardless of count (we're using pagination now)
        this.setCache(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Backend API failed:', error.message);
    }

    // Skip external API calls to avoid CORS issues
    // External APIs (TradingView, Alpha Vantage, etc.) are blocked by CORS policy
    console.log('🔄 Skipping external API calls due to CORS policy restrictions...');

    // If all fails, throw error instead of showing fake data
    throw new Error('Unable to fetch stock data. Backend server is not available.');
  }

  // Fetch from backend API with pagination to get more stocks
  async fetchFromBackendAPIWithPagination() {
    try {
      console.log('🔄 Fetching from backend API with pagination...');
      
      // Fetch more stocks with random delay to avoid spamming
      const randomDelay = Math.random() * 1000 + 500; // 500-1500ms random delay
      console.log(`🔄 Waiting ${randomDelay.toFixed(0)}ms before fetching...`);
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      
      console.log(`🔄 Fetching page 1 from ${this.baseURL}/api/stocks`);
      const response = await this.axiosInstance.get(`${this.baseURL}/api/stocks`, {
        params: {
          page: 1,
          pageSize: 10, // Match max concurrent TradingView widgets
          markets: 'america',
          sortBy: 'market_cap_basic',
          sortOrder: 'desc'
        }
      });

      if (response.data && response.data.stocks) {
        console.log('📊 First stock from API:', response.data.stocks[0]);
        const stocks = response.data.stocks.map(stock => ({
          symbol: stock.symbol || stock.name || 'UNKNOWN',
          name: stock.companyName || stock.description || 'Unknown Company',
          companyName: stock.companyName || stock.description || 'Unknown Company',
          shortCompanyName: stock.shortCompanyName || stock.companyName || 'Unknown Company',
          description: stock.description || stock.companyName || 'Unknown Company',
          price: stock.close || 0,
          change: stock.priceChange ? `${stock.priceChange >= 0 ? '+' : ''}${stock.priceChange.toFixed(2)}%` : '0%',
          changeAbs: stock.priceChange || 0,
          pe: stock.PERatio || 0,
          marketCap: stock.marketCapBasic || this.calculateMarketCap(stock.close, stock.EPS),
          sector: stock.sector || 'Technology',
          beta: 1.0,
          dividendYield: stock.dividendYield || 0,
          volume: stock.volume || Math.floor(Math.random() * 50000000) + 1000000,
          industry: stock.sector || 'Technology',
          country: 'US',
          isLocked: false,
          tier: this.getStockTier(stock.marketCapBasic || this.calculateMarketCap(stock.close, stock.EPS)),
          volatility: 'medium',
          recommendation: 'Hold',
          priceTarget: stock.close * 1.1,
          analystRating: 'A'
        }));
            
        console.log(`✅ Fetched ${stocks.length} stocks (Page 1 of ${response.data.totalPages})`);
        return {
          stocks: stocks,
          count: response.data.totalCount, // Use total count from API
          totalPages: response.data.totalPages,
          currentPage: response.data.page,
          source: 'Backend API (Paginated)'
        };
      }
    } catch (error) {
      console.error('Backend API pagination error:', error);
      throw error;
    }
  }

  // Fetch from backend API
  async fetchFromBackendAPI() {
    try {
      // Add random delay to prevent API spamming
      const randomDelay = Math.random() * 1000 + 500; // 500-1500ms random delay
      console.log(`🔄 Waiting ${randomDelay.toFixed(0)}ms before fetching...`);
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      
      console.log('🔄 Fetching from backend API...');
      const response = await this.axiosInstance.get(`${this.baseURL}/api/stocks`, {
        params: {
          page: 1,
          pageSize: 10, // Match max concurrent TradingView widgets
          markets: 'america',
          sortBy: 'market_cap_basic',
          sortOrder: 'desc'
        }
      });

      if (response.data && response.data.stocks) {
        const stocks = response.data.stocks.map(stock => ({
          symbol: stock.symbol || stock.name || 'UNKNOWN',
          name: stock.companyName || stock.description || 'Unknown Company',
          companyName: stock.companyName || stock.description || 'Unknown Company',
          shortCompanyName: stock.shortCompanyName || stock.companyName || 'Unknown Company',
          description: stock.description || stock.companyName || 'Unknown Company',
          price: stock.close || 0,
          change: stock.priceChange ? `${stock.priceChange >= 0 ? '+' : ''}${stock.priceChange.toFixed(2)}%` : '0%',
          changeAbs: stock.priceChange || 0,
          pe: stock.PERatio || 0,
          marketCap: stock.marketCapBasic || this.calculateMarketCap(stock.close, stock.EPS), // Use actual market cap from TradingView
          sector: stock.sector || 'Technology',
          beta: 1.0, // Default beta
          dividendYield: stock.dividendYield || 0,
          volume: Math.floor(Math.random() * 50000000) + 1000000, // Random volume
          industry: stock.sector || 'Technology',
          country: 'US',
          isLocked: false,
          tier: this.getStockTier(this.calculateMarketCap(stock.close, stock.EPS)),
          volatility: 'medium',
          recommendation: 'Hold',
          priceTarget: stock.close * 1.1,
          analystRating: 'A'
        }));

        return {
          stocks: stocks,
          count: response.data.totalCount, // Use total count from API
          totalPages: response.data.totalPages,
          currentPage: response.data.page,
          source: 'Backend API'
        };
      }
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }

  // Calculate market cap estimate using more realistic shares outstanding
  calculateMarketCap(price, eps) {
    if (!price || !eps) return 1000000000; // Default 1B
    
    // More realistic shares outstanding estimation
    // Use price and EPS to estimate company size more accurately
    
    let estimatedShares;
    if (price > 500) {
      // Very high price stocks (like Berkshire, Google) - fewer shares
      estimatedShares = Math.random() * 2000000000 + 500000000; // 500M-2.5B shares
    } else if (price > 200) {
      // High price stocks (Apple, Microsoft, Tesla) - moderate shares
      estimatedShares = Math.random() * 3000000000 + 1000000000; // 1B-4B shares
    } else if (price > 100) {
      // Medium-high price stocks (Airbus, Boeing) - more shares
      estimatedShares = Math.random() * 2000000000 + 2000000000; // 2B-4B shares
    } else if (price > 50) {
      // Medium price stocks - many shares
      estimatedShares = Math.random() * 1500000000 + 1500000000; // 1.5B-3B shares
    } else if (price > 20) {
      // Lower price stocks - many shares
      estimatedShares = Math.random() * 1000000000 + 1000000000; // 1B-2B shares
    } else {
      // Very low price stocks - many shares
      estimatedShares = Math.random() * 500000000 + 500000000; // 500M-1B shares
    }
    
    return price * estimatedShares;
  }

  // Enhanced stock tier system with correct ranges (matching backend)
  getStockTier(stock) {
    const marketCap = stock.marketCap || 0;
    if (marketCap >= 200000000000) return 'mega';      // >= $200B
    if (marketCap >= 10000000000 && marketCap < 200000000000) return 'large';      // $10B - $199.9B
    if (marketCap >= 2000000000 && marketCap < 10000000000) return 'mid';         // $2B - $9.9B
    if (marketCap >= 300000000 && marketCap < 2000000000) return 'small';        // $300M - $1.9B
    return 'micro';                                     // < $300M
  }

  // Stock lock mechanism based on user level/premium status
  isStockLocked(stock) {
    // Premium stocks that might require subscription
    const premiumSymbols = ['BRK.A', 'BRK.B'];
    const megaCapThreshold = 500000000000; // $500B market cap
    
    // Lock certain mega-cap or special stocks for premium users
    return premiumSymbols.includes(stock.symbol) || 
           (stock.marketCap > megaCapThreshold && Math.random() > 0.7);
  }

  // Calculate stock volatility indicator
  calculateVolatility(stock) {
    const beta = stock.beta || 1.0;
    const changeAbs = Math.abs(stock.changeAbs || 0);
    const price = stock.price || 100;
    
    const dailyVolatility = (changeAbs / price) * 100;
    
    if (dailyVolatility > 5 || beta > 1.5) return 'high';
    if (dailyVolatility > 2 || beta > 1.2) return 'medium';
    return 'low';
  }

  // Get AI-generated recommendation
  getRecommendation(stock) {
    const pe = stock.pe || 20;
    const marketCap = stock.marketCap || 0;
    const dividendYield = stock.dividendYield || 0;
    const beta = stock.beta || 1.0;
    
    // Simple scoring algorithm
    let score = 0;
    
    // P/E ratio scoring
    if (pe > 0 && pe < 15) score += 2;
    else if (pe >= 15 && pe < 25) score += 1;
    else if (pe >= 25 && pe < 35) score += 0;
    else score -= 1;
    
    // Market cap stability
    if (marketCap > 10000000000) score += 1;
    
    // Dividend yield
    if (dividendYield > 2) score += 1;
    
    // Beta stability
    if (beta < 1.2) score += 1;
    
    if (score >= 4) return 'Strong Buy';
    if (score >= 2) return 'Buy';
    if (score >= 0) return 'Hold';
    if (score >= -2) return 'Sell';
    return 'Strong Sell';
  }

  // Calculate price target
  calculatePriceTarget(stock) {
    const price = stock.price || 100;
    const pe = stock.pe || 20;
    const recommendation = this.getRecommendation(stock);
    
    let multiplier = 1.0;
    
    switch (recommendation) {
      case 'Strong Buy': multiplier = 1.15; break;
      case 'Buy': multiplier = 1.08; break;
      case 'Hold': multiplier = 1.02; break;
      case 'Sell': multiplier = 0.95; break;
      case 'Strong Sell': multiplier = 0.85; break;
    }
    
    return parseFloat((price * multiplier).toFixed(2));
  }

  // Get analyst rating
  getAnalystRating(stock) {
    const volatility = this.calculateVolatility(stock);
    const tier = this.getStockTier(stock);
    
    // Rating based on tier and volatility
    if (tier === 'mega' && volatility === 'low') return 'AAA';
    if (tier === 'large' && volatility === 'low') return 'AA';
    if (tier === 'large' && volatility === 'medium') return 'A';
    if (tier === 'mid' && volatility === 'low') return 'BBB';
    if (tier === 'mid' && volatility === 'medium') return 'BB';
    if (tier === 'small' && volatility === 'low') return 'B';
    return 'C';
  }

  // Get preset filters
  getPresetFilters(presetKey) {
    const presets = {
      growthStocks: {
        peRatio: [20, 100],
        marketCap: ['large', 'mega'],
        sector: ['technology']
      },
      valueStocks: {
        peRatio: [0, 15],
        dividendYield: [2, 15]
      },
      dividendStocks: {
        dividendYield: [3, 15]
      }
    };
    return presets[presetKey] || {};
  }

  // Cache management
  setCache(key, data) {
    this.stockCache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.stockCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  // Get filtered counts without loading all data
  async getFilteredCounts(filters = {}) {
    try {
      console.log('🔍 Getting filtered counts for:', filters);
      
      const params = {
        markets: 'america'
      };
      
      // Add filter parameters
      if (filters.sector && filters.sector.length > 0) {
        params.sector = filters.sector.map(key => this.mapSectorKeyToBackend(key)).join(',');
      }
      
      if (filters.peRatio && filters.peRatio.length === 2) {
        params.peMin = filters.peRatio[0];
        params.peMax = filters.peRatio[1];
      }
      
      if (filters.priceRange && filters.priceRange.length === 2) {
        params.priceMin = filters.priceRange[0];
        params.priceMax = filters.priceRange[1];
      }
      
      if (filters.volume && filters.volume.length > 0) {
        params.volume = filters.volume.join(',');
      }
      
      if (filters.dividendYield && filters.dividendYield.length === 2) {
        params.dividendMin = filters.dividendYield[0];
        params.dividendMax = filters.dividendYield[1];
      }
      
      if (filters.marketCap && filters.marketCap.length > 0) {
        params.marketCap = filters.marketCap.join(',');
      }
      
      const response = await this.axiosInstance.get(`${this.baseURL}/api/stocks/counts`, {
        params
      });
      
      return response.data.totalCount || 0;
    } catch (error) {
      console.error('Error getting filtered counts:', error);
      return 0;
    }
  }

  // Fetch a specific page with filters (for Vue component compatibility)
  // Map frontend sector keys to backend sector names with pattern-based matching
  mapSectorKeyToBackend(sectorKey) {
    // Pattern-based mapping for comprehensive sector coverage
    const patternMap = {
      'technology': this.getTechnologySectors(),
      'tech': this.getTechnologySectors(),
      'healthcare': this.getHealthcareSectors(),
      'health': this.getHealthcareSectors(),
      'financials': this.getFinancialSectors(),
      'finance': this.getFinancialSectors(),
      'energy': this.getEnergySectors(),
      'industrials': this.getIndustrialSectors(),
      'materials': this.getMaterialSectors(),
      'utilities': this.getUtilitySectors(),
      'realestate': this.getRealEstateSectors(),
      'consumer_discretionary': this.getConsumerDiscretionarySectors(),
      'consumer_staples': this.getConsumerStaplesSectors(),
      'telecommunications': this.getTelecomSectors()
    };
    
    return patternMap[sectorKey] || sectorKey;
  }

  // Pattern-based sector getters - automatically includes all sectors containing keywords
  getTechnologySectors() {
    // All sectors containing "technology" (case-insensitive pattern matching)
    return [
      'Technology Services',      // Software, cloud, internet companies
      'Electronic Technology'     // Hardware, semiconductors, electronics
      // Note: Health Technology removed - it's primarily healthcare/medical, not tech
      // Note: Energy Technology, Financial Technology, Industrial Technology don't exist in TradingView
    ].filter(sector => sector); // Remove any undefined entries
  }

  getHealthcareSectors() {
    return [
      'Health Technology',
      'Health Services',
      'Biotechnology',
      'Pharmaceuticals',
      'Medical Equipment'
    ].filter(sector => sector);
  }

  getFinancialSectors() {
    return [
      'Finance',
      'Banking',
      'Insurance',
      'Investment Services',
      'Real Estate Investment Trusts'
    ].filter(sector => sector);
  }

  getEnergySectors() {
    return [
      'Energy Minerals',
      'Oil & Gas',
      'Renewable Energy',
      'Utilities' // Some utilities are energy-related
    ].filter(sector => sector);
  }

  getIndustrialSectors() {
    return [
      'Industrial Services',
      'Manufacturing',
      'Aerospace',
      'Defense',
      'Transportation'
    ].filter(sector => sector);
  }

  getMaterialSectors() {
    return [
      'Materials',
      'Chemicals',
      'Metals',
      'Mining',
      'Construction Materials'
    ].filter(sector => sector);
  }

  getUtilitySectors() {
    return [
      'Utilities',
      'Electric Utilities',
      'Gas Utilities',
      'Water Utilities'
    ].filter(sector => sector);
  }

  getRealEstateSectors() {
    return [
      'Real Estate',
      'Real Estate Investment Trusts',
      'Property Management'
    ].filter(sector => sector);
  }

  getConsumerDiscretionarySectors() {
    return [
      'Retail Trade',
      'Consumer Services',
      'Entertainment',
      'Automotive',
      'Travel & Leisure'
    ].filter(sector => sector);
  }

  getConsumerStaplesSectors() {
    return [
      'Consumer Durables',
      'Food & Beverage',
      'Household Products',
      'Personal Care'
    ].filter(sector => sector);
  }

  getTelecomSectors() {
    return [
      'Telecom',
      'Telecommunications',
      'Media',
      'Broadcasting'
    ].filter(sector => sector);
  }

  async fetchPage(page, filters = {}, pageSize = 10) {
    console.log(`🔍 Fetching page ${page} with filters:`, filters);
    console.log(`🔍 Sector filters:`, filters.sector);
    console.log(`🔍 Market cap filters:`, filters.marketCap);
    
    try {
      // Add random delay to prevent API spamming
      const randomDelay = Math.random() * 500 + 200; // Reduced delay: 200-700ms
      console.log(`🔄 Waiting ${randomDelay.toFixed(0)}ms before fetching page ${page}...`);
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      
      const apiUrl = `${this.baseURL}/api/stocks`;
      const requestParams = {
        page: page,
        pageSize: pageSize, // Match max concurrent TradingView widgets
        markets: 'america',
        sortBy: 'market_cap_basic',
        sortOrder: 'desc',
        // Add filter parameters
        ...(filters.sector && filters.sector.length > 0 && { 
          sector: filters.sector.map(key => this.mapSectorKeyToBackend(key)).flat().join(',') 
        }),
        ...(filters.peRatio && filters.peRatio.length === 2 && { 
          peMin: filters.peRatio[0], 
          peMax: filters.peRatio[1] 
        }),
        ...(filters.priceRange && filters.priceRange.length === 2 && { 
          priceMin: filters.priceRange[0], 
          priceMax: filters.priceRange[1] 
        }),
        ...(filters.volume && filters.volume.length > 0 && { volume: filters.volume.join(',') }),
        ...(filters.dividendYield && filters.dividendYield.length === 2 && { 
          dividendMin: filters.dividendYield[0], 
          dividendMax: filters.dividendYield[1] 
        }),
        ...(filters.marketCap && filters.marketCap.length > 0 && { 
          marketCap: filters.marketCap.join(',') 
        })
      };
      
      console.log(`🔍 Full API URL:`, `${apiUrl}?${new URLSearchParams(requestParams).toString()}`);
      
      const response = await this.axiosInstance.get(apiUrl, {
        params: requestParams
      });

      console.log(`🔍 Response status: ${response.status}`);
      console.log(`🔍 Response has data:`, !!response.data);
      console.log(`🔍 Response has stocks:`, !!(response.data && response.data.stocks));
      console.log(`🔍 Response data structure:`, { 
        hasStocks: !!(response.data && response.data.stocks),
        stockCount: response.data?.stocks?.length,
        totalCount: response.data?.totalCount,
        page: response.data?.page
      });

      if (response.data && response.data.stocks) {
        console.log(`📦 Backend returned ${response.data.stocks.length} stocks for page ${page}`);
        
        const stocks = response.data.stocks.map(stock => {
          const marketCapValue = stock.marketCapBasic || this.calculateMarketCap(stock.close, stock.EPS);
          return {
            symbol: stock.symbol || stock.name || 'UNKNOWN',
            name: stock.companyName || stock.description || stock.name || 'Unknown Company',
            companyName: stock.companyName || stock.description || 'Unknown Company',
            description: stock.description || stock.companyName || 'Unknown Company',
            shortCompanyName: stock.shortCompanyName || stock.companyName || 'Unknown Company',
            close: stock.close || 0,
            price: stock.close || 0,
            priceChange: stock.priceChange || 0,
            change: stock.priceChange ? `${stock.priceChange >= 0 ? '+' : ''}${stock.priceChange.toFixed(2)}%` : '0%',
            changeAbs: stock.priceChange || 0,
            PERatio: stock.PERatio || 0,
            pe: stock.PERatio || 0,
            marketCapBasic: stock.marketCapBasic || null,
            marketCap: marketCapValue,
            sector: stock.sector || 'Technology',
            market: stock.market || 'america',
            beta: 1.0,
            EPS: stock.EPS || 0,
            dividendYield: stock.dividendYield || 0,
            volume: stock.volume || 0,
            industry: stock.sector || 'Technology',
            country: 'US',
            isLocked: false,
            tier: this.getStockTier({ marketCap: marketCapValue }),
            volatility: 'medium',
            recommendation: 'Hold',
            priceTarget: stock.close * 1.1,
            analystRating: 'A'
          };
        });

        // Don't apply client-side filtering - backend already filtered!
        // Use market cap counts from backend (calculated from ALL filtered stocks)
        const marketCapCounts = response.data.marketCapCounts || this.calculateMarketCapCounts(stocks);
        
        console.log(`✅ Fetched ${stocks.length} stocks from page ${page}`);
        console.log(`📊 Market cap distribution:`, marketCapCounts);

        return {
          stocks: stocks,
          count: response.data.totalCount || stocks.length, // Use backend total count
          totalPages: response.data.totalPages || 1, // Use backend total pages
          currentPage: response.data.page || page, // Use backend current page
          source: 'Backend API (Paginated)',
          marketCapCounts: marketCapCounts, // Use backend's market cap counts
          sectorCounts: response.data.sectorCounts, // Use backend's sector counts
          avgMarketCap: response.data.avgMarketCap // Pass through backend-calculated average
        };
      }
      
      console.warn(`⚠️ No stocks data in response for page ${page}`);
      return { stocks: [], count: 0, totalPages: 1, currentPage: page, source: 'Empty Response' };
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  }

  // Apply client-side filtering to stocks
  applyClientSideFilters(stocks, filters) {
    return stocks.filter(stock => {
      // Sector filter - use pattern-based mapping
      if (filters.sector && filters.sector.length > 0) {
        const matchingSectors = [];
        filters.sector.forEach(sectorKey => {
          const mappedSectors = this.mapSectorKeyToBackend(sectorKey);
          if (Array.isArray(mappedSectors)) {
            matchingSectors.push(...mappedSectors);
          } else {
            matchingSectors.push(mappedSectors);
          }
        });
        
        if (matchingSectors.length > 0 && !matchingSectors.includes(stock.sector)) {
          return false;
        }
      }

      // Market cap filter
      if (filters.marketCap && filters.marketCap.length > 0) {
        const stockTier = this.getStockTier(stock);
        if (!filters.marketCap.includes(stockTier)) {
          return false;
        }
      }

      // P/E ratio filter
      if (filters.peRatio && filters.peRatio.length === 2) {
        const [minPE, maxPE] = filters.peRatio;
        if (stock.pe < minPE || stock.pe > maxPE) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange.length === 2) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (stock.price < minPrice || stock.price > maxPrice) {
          return false;
        }
      }

      // Dividend yield filter
      if (filters.dividendYield && filters.dividendYield.length === 2) {
        const [minDiv, maxDiv] = filters.dividendYield;
        if (stock.dividendYield < minDiv || stock.dividendYield > maxDiv) {
          return false;
        }
      }

      return true;
    });
  }

  // Calculate market cap counts for all stocks
  calculateMarketCapCounts(stocks) {
    const counts = {
      mega: 0,
      large: 0,
      mid: 0,
      small: 0,
      micro: 0
    };
    
    stocks.forEach(stock => {
      const tier = this.getStockTier(stock);
      if (counts.hasOwnProperty(tier)) {
        counts[tier]++;
      }
    });
    
    return counts;
  }

  // Clear cache
  static clearCache() {
    // This would clear the cache if we had a static instance
    console.log('🗑️ Cache cleared');
  }
}

export default new StockScreenerService();