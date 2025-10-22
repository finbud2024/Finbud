import express from 'express';
import StockPrice from '../../Database_Schema/market-data/Stock.js';
import validateRequest from '../../utils/validation/validateRequest.js';
import { isAuthenticated } from '../../middleware/auth.js';
import axios from 'axios';

const stockRoute = express.Router();

// Function to get shares outstanding from a financial data API
async function getSharesOutstanding(symbol) {
    try {
        // Using Alpha Vantage API as an example (you can replace with any financial data API)
        // Note: You'll need to add your API key to the environment variables
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        if (!apiKey) {
            console.warn('ALPHA_VANTAGE_API_KEY not configured, skipping shares outstanding lookup');
            return null;
        }
        
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'OVERVIEW',
                symbol: symbol,
                apikey: apiKey
            }
        });
        
        if (response.data && response.data.SharesOutstanding) {
            return parseInt(response.data.SharesOutstanding);
        }
        return null;
    } catch (error) {
        console.warn(`Failed to get shares outstanding for ${symbol}:`, error.message);
        return null;
    }
}

// Function to calculate market cap
function calculateMarketCap(price, sharesOutstanding) {
    if (!price || !sharesOutstanding) return null;
    return price * sharesOutstanding;
}

stockRoute.get("/api/stocks", isAuthenticated, async (req, res) => {
    const { 
        page = 1, 
        pageSize = 10, // Match max concurrent TradingView widgets 
        search, 
        sortBy = "market_cap_basic", 
        sortOrder = "desc", 
        markets = "america",
        sector,
        marketCap,
        peMin,
        peMax,
        priceMin,
        priceMax,
        volume,
        dividendMin,
        dividendMax
    } = req.query;
    const pageNumber = parseInt(page);
    const size = parseInt(pageSize);

    const start = (pageNumber - 1) * size;
    const end = start + size - 1;

    try {
        // Implement complex multi-filter logic: (multi marketcap OR sector OR multi volume) AND (multi marketcap OR sector OR multi volume)
        // This requires making multiple API calls and combining results
        
        let allResults = [];
        let totalCount = 0;
        
        // Parse filter parameters
        const sectors = sector ? sector.split(',').map(s => s.trim()).filter(s => s) : [];
        const marketCapTiers = marketCap ? marketCap.split(',').map(tier => tier.trim()).filter(tier => tier) : [];
        const volumePresets = volume ? volume.split(',').map(v => v.trim()).filter(v => v) : [];
        
        // Volume preset definitions
        const volumePresetDefs = {
            low: { min: 0, max: 10000000 },
            medium: { min: 10000000, max: 50000000 },
            high: { min: 50000000, max: 1000000000 }
        };
        
        // Market cap tier definitions
        const marketCapTierDefs = {
            mega: { min: 200000000000, max: null },
            large: { min: 10000000000, max: 200000000000 },
            mid: { min: 2000000000, max: 10000000000 },
            small: { min: 300000000, max: 2000000000 },
            micro: { min: null, max: 300000000 }
        };
        
        // If no complex filters, use simple approach
        // Complex logic only needed when multiple values are selected within the same filter type
        // OR when market cap filtering is needed (since TradingView API doesn't have direct market cap filters)
        const hasMultipleSectors = sectors.length > 1;
        const hasMultipleMarketCaps = marketCapTiers.length > 1;
        const hasMultipleVolumes = volumePresets.length > 1;
        const hasMultipleFilterTypes = (sectors.length > 0 ? 1 : 0) + (marketCapTiers.length > 0 ? 1 : 0) + (volumePresets.length > 0 ? 1 : 0) > 1;
        const needsMarketCapFiltering = marketCapTiers.length > 0;
        
        if (!hasMultipleSectors && !hasMultipleMarketCaps && !hasMultipleVolumes && !hasMultipleFilterTypes && !needsMarketCapFiltering) {
            // Use existing simple filter logic
            const filters = [];
            
            if (search) {
                filters.push({
        left: "name,description",
        operation: "match",
        right: search
                });
            }
            
            if (sectors.length === 1) {
                filters.push({
                    left: "sector",
                    operation: "match",
                    right: sectors[0]
                });
            }
            
            if (peMin && peMin !== 'null' && peMin !== 'Infinity' && !isNaN(parseFloat(peMin))) {
                filters.push({
                    left: "price_earnings_ttm",
                    operation: "greater",
                    right: parseFloat(peMin)
                });
            }
            if (peMax && peMax !== 'null' && peMax !== 'Infinity' && !isNaN(parseFloat(peMax))) {
                filters.push({
                    left: "price_earnings_ttm",
                    operation: "less",
                    right: parseFloat(peMax)
                });
            }
            
            if (priceMin && priceMin !== 'null' && priceMin !== 'Infinity' && !isNaN(parseFloat(priceMin))) {
                filters.push({
                    left: "close",
                    operation: "greater",
                    right: parseFloat(priceMin)
                });
            }
            if (priceMax && priceMax !== 'null' && priceMax !== 'Infinity' && !isNaN(parseFloat(priceMax))) {
                filters.push({
                    left: "close",
                    operation: "less",
                    right: parseFloat(priceMax)
                });
            }
            
            if (volumePresets.length === 1 && volumePresetDefs[volumePresets[0]]) {
                const preset = volumePresetDefs[volumePresets[0]];
                if (preset.min > 0) {
                    filters.push({
                        left: "volume",
                        operation: "greater",
                        right: preset.min
                    });
                }
                if (preset.max < 1000000000) {
                    filters.push({
                        left: "volume",
                        operation: "less",
                        right: preset.max
                    });
                }
            }
            
            if (dividendMin && dividendMin !== 'null' && dividendMin !== 'Infinity' && !isNaN(parseFloat(dividendMin))) {
                filters.push({
                    left: "dividends_yield_current",
                    operation: "greater",
                    right: parseFloat(dividendMin)
                });
            }
            if (dividendMax && dividendMax !== 'null' && dividendMax !== 'Infinity' && !isNaN(parseFloat(dividendMax))) {
                filters.push({
                    left: "dividends_yield_current",
                    operation: "less",
                    right: parseFloat(dividendMax)
                });
            }
            
            const filter = filters.length > 0 ? filters : undefined;
            
        const response = await axios.post(
            "https://scanner.tradingview.com/global/scan?label-product=markets-screener",
            {
                columns: [
                    "name", "description", "fundamental_currency_code", "close", "currency",
                        "change", "volume", "relative_volume_10d_calc", "price_earnings_ttm",
                        "earnings_per_share_diluted_ttm", "dividends_yield_current", "market", "sector",
                        "market_cap_basic"
                ],
                ignore_unknown_fields: false,
                options: { lang: "en" },
                range: [start, end],
                filter,
                markets: [markets],
                sort: {
                    sortBy,
                    sortOrder: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
                    nullsFirst: false
                },
            },
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
                    "Accept": "application/json",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Referer": "https://vn.tradingview.com/",
                    "Content-Type": "text/plain;charset=UTF-8",
                    "Origin": "https://vn.tradingview.com",
                    "Connection": "keep-alive"
                }
            }
        );

            totalCount = response.data.totalCount;
            allResults = response.data.data;
        } else {
            // Complex multi-filter logic: Proper OR within filter types, AND across filter types
            // Expected: (Sector1 OR Sector2) AND (MarketCap1 OR MarketCap2) AND (Volume1 OR Volume2)
            console.log(`🔄 Implementing multi-filter logic (OR within types, AND across types):`);
            console.log(`  Sectors: ${sectors.join(', ') || 'none'}`);
            console.log(`  Market Cap Tiers: ${marketCapTiers.join(', ') || 'none'}`);
            console.log(`  Volume Presets: ${volumePresets.join(', ') || 'none'}`);
            
            // Optimization: Only generate combinations for sector + volume
            // Market cap will be applied as post-processing since TradingView API doesn't have direct market cap filters
            const filterCombinations = [];
            
            // Create combinations only for sector and volume (market cap applied separately)
            const sectorOptions = sectors.length > 0 ? sectors : [null];
            const volumeOptions = volumePresets.length > 0 ? volumePresets : [null];
            
            sectorOptions.forEach(sector => {
                volumeOptions.forEach(volume => {
                    filterCombinations.push({ sector, volume });
                });
            });
            
            console.log(`  Generated ${filterCombinations.length} filter combinations`);
            
            // Make API calls for each combination
            const apiPromises = filterCombinations.map(async (combo, index) => {
                try {
                    const filters = [];
                    
                    // Add base filters (P/E, price, dividend)
                    if (peMin && peMin !== 'null' && peMin !== 'Infinity' && !isNaN(parseFloat(peMin))) {
                        filters.push({
                            left: "price_earnings_ttm",
                            operation: "greater",
                            right: parseFloat(peMin)
                        });
                    }
                    if (peMax && peMax !== 'null' && peMax !== 'Infinity' && !isNaN(parseFloat(peMax))) {
                        filters.push({
                            left: "price_earnings_ttm",
                            operation: "less",
                            right: parseFloat(peMax)
                        });
                    }
                    
                    if (priceMin && priceMin !== 'null' && priceMin !== 'Infinity' && !isNaN(parseFloat(priceMin))) {
                        filters.push({
                            left: "close",
                            operation: "greater",
                            right: parseFloat(priceMin)
                        });
                    }
                    if (priceMax && priceMax !== 'null' && priceMax !== 'Infinity' && !isNaN(parseFloat(priceMax))) {
                        filters.push({
                            left: "close",
                            operation: "less",
                            right: parseFloat(priceMax)
                        });
                    }
                    
                    if (dividendMin && dividendMin !== 'null' && dividendMin !== 'Infinity' && !isNaN(parseFloat(dividendMin))) {
                        filters.push({
                            left: "dividends_yield_current",
                            operation: "greater",
                            right: parseFloat(dividendMin)
                        });
                    }
                    if (dividendMax && dividendMax !== 'null' && dividendMax !== 'Infinity' && !isNaN(parseFloat(dividendMax))) {
                        filters.push({
                            left: "dividends_yield_current",
                            operation: "less",
                            right: parseFloat(dividendMax)
                        });
                    }
                    
                    // Add combination-specific filters
                    if (combo.sector) {
                        filters.push({
                            left: "sector",
                            operation: "match",
                            right: combo.sector
                        });
                    }
                    
                    if (combo.volume && volumePresetDefs[combo.volume]) {
                        const preset = volumePresetDefs[combo.volume];
                        if (preset.min > 0) {
                            filters.push({
                                left: "volume",
                                operation: "greater",
                                right: preset.min
                            });
                        }
                        if (preset.max < 1000000000) {
                            filters.push({
                                left: "volume",
                                operation: "less",
                                right: preset.max
                            });
                        }
                    }
                    
                    const filter = filters.length > 0 ? filters : undefined;
                    
                    // Make API call with larger range to get more data
                    const response = await axios.post(
                        "https://scanner.tradingview.com/global/scan?label-product=markets-screener",
                        {
                            columns: [
                                "name", "description", "fundamental_currency_code", "close", "currency",
                                "change", "volume", "relative_volume_10d_calc", "price_earnings_ttm",
                                "earnings_per_share_diluted_ttm", "dividends_yield_current", "market", "sector",
                                "market_cap_basic"
                            ],
                            ignore_unknown_fields: false,
                            options: { lang: "en" },
                            range: [0, 9999], // Get more data for complex filtering
                            filter,
                            markets: [markets],
                            sort: {
                                sortBy,
                                sortOrder: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
                                nullsFirst: false
                            },
                        },
                        {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
                                "Accept": "application/json",
                                "Accept-Language": "en-US,en;q=0.5",
                                "Accept-Encoding": "gzip, deflate, br, zstd",
                                "Referer": "https://vn.tradingview.com/",
                                "Content-Type": "text/plain;charset=UTF-8",
                                "Origin": "https://vn.tradingview.com",
                                "Connection": "keep-alive"
                            }
                        }
                    );
                    
                    console.log(`  ✅ Combination ${index + 1} (${JSON.stringify(combo)}): ${response.data.data.length} stocks`);
                    return response.data.data;
                } catch (error) {
                    console.error(`  ❌ Combination ${index + 1} failed:`, error.message);
                    return [];
                }
            });
            
            // Wait for all API calls to complete
            const allCombinationResults = await Promise.all(apiPromises);
            
            // Combine and deduplicate results
            const stockMap = new Map();
            allCombinationResults.forEach(results => {
                results.forEach(stock => {
                    const stockName = stock.d[0]; // name is at index 0
                    if (!stockMap.has(stockName)) {
                        stockMap.set(stockName, stock);
                    }
                });
            });
            
            allResults = Array.from(stockMap.values());
            totalCount = allResults.length;
            
            console.log(`  📊 Combined results: ${totalCount} unique stocks from ${filterCombinations.length} combinations`);
        }
        
        // Apply market cap filtering if requested (post-processing)
        let filteredData = allResults;
        if (marketCapTiers.length > 0) {
            console.log(`🔄 Applying market cap filtering for: ${marketCapTiers.join(', ')}`);
            
            // Filter stocks based on market cap - check if stock matches ANY of the selected tiers (OR logic)
            filteredData = allResults.filter(stock => {
                const marketCapBasic = stock.d[14]; // market_cap_basic is at index 14 (after adding description)
                
                // If market cap data is not available, try to estimate from price
                let marketCap = marketCapBasic;
                if (!marketCap || marketCap === null) {
                    // Fallback: estimate market cap from price (rough approximation)
                    const price = stock.d[3];
                    // Assume average shares outstanding based on price
                    const estimatedShares = price > 100 ? 1000000000 : 2000000000;
                    marketCap = price * estimatedShares;
                }
                
                // Check if the stock's market cap falls into ANY of the selected tiers
                const matchesAnyTier = marketCapTiers.some(tier => {
                    const tierDef = marketCapTierDefs[tier.toLowerCase()];
                    if (!tierDef) return false;
                    
                    const { min, max } = tierDef;
                    
                    // Check if market cap is within this tier's range
                    const aboveMin = min === null || marketCap >= min;
                    const belowMax = max === null || marketCap < max;
                    
                    return aboveMin && belowMax;
                });
                
                return matchesAnyTier;
            });
            
            console.log(`  📊 Market cap filtering: ${allResults.length} -> ${filteredData.length} stocks (matching any of: ${marketCapTiers.join(', ')})`);
        }
        
        // Calculate market cap distribution across ALL filtered stocks
        const marketCapCounts = {
            mega: 0,    // >= 200B
            large: 0,   // 10B - 200B
            mid: 0,     // 2B - 10B
            small: 0,   // 300M - 2B
            micro: 0    // < 300M
        };
        
        // Calculate sector distribution across ALL filtered stocks
        const sectorCounts = {
            technology: 0,
            healthcare: 0,
            financials: 0,
            energy: 0,
            industrials: 0,
            materials: 0,
            utilities: 0,
            realestate: 0,
            consumer_discretionary: 0,
            consumer_staples: 0,
            telecommunications: 0
        };
        
        filteredData.forEach(stock => {
            const marketCap = stock.d[14]; // Updated index after adding description column
            if (!marketCap || marketCap === null) {
                return; // Skip stocks without market cap data
            }
            
            if (marketCap >= 200000000000) {
                marketCapCounts.mega++;
            } else if (marketCap >= 10000000000) {
                marketCapCounts.large++;
            } else if (marketCap >= 2000000000) {
                marketCapCounts.mid++;
            } else if (marketCap >= 300000000) {
                marketCapCounts.small++;
            } else if (marketCap > 0) {
                marketCapCounts.micro++;
            }
            
            // Count sectors using the same mapping logic as frontend
            const stockSector = stock.d[13]; // sector field
            if (stockSector) {
                // Map backend sector names to frontend sector keys
                if (stockSector === 'Technology Services' || stockSector === 'Electronic Technology') {
                    sectorCounts.technology++;
                } else if (stockSector === 'Health Technology' || stockSector === 'Health Services' || stockSector === 'Biotechnology' || stockSector === 'Pharmaceuticals') {
                    sectorCounts.healthcare++;
                } else if (stockSector === 'Finance' || stockSector === 'Banking' || stockSector === 'Insurance' || stockSector === 'Real Estate Investment Trusts') {
                    sectorCounts.financials++;
                } else if (stockSector === 'Energy Minerals' || stockSector === 'Oil & Gas Production' || stockSector === 'Oil & Gas Refining & Marketing') {
                    sectorCounts.energy++;
                } else if (stockSector === 'Industrial Services' || stockSector === 'Transportation' || stockSector === 'Aerospace & Defense') {
                    sectorCounts.industrials++;
                } else if (stockSector === 'Non-Energy Minerals' || stockSector === 'Process Industries') {
                    sectorCounts.materials++;
                } else if (stockSector === 'Utilities') {
                    sectorCounts.utilities++;
                } else if (stockSector === 'Real Estate Investment Trusts' || stockSector === 'Real Estate') {
                    sectorCounts.realestate++;
                } else if (stockSector === 'Retail Trade' || stockSector === 'Consumer Services' || stockSector === 'Consumer Durables') {
                    sectorCounts.consumer_discretionary++;
                } else if (stockSector === 'Consumer Non-Durables' || stockSector === 'Food & Beverages') {
                    sectorCounts.consumer_staples++;
                } else if (stockSector === 'Communications' || stockSector === 'Telecommunications') {
                    sectorCounts.telecommunications++;
                }
            }
        });
        
        // Calculate average market cap across ALL filtered stocks
        let avgMarketCap = null;
        if (filteredData.length > 0) {
            const validMarketCaps = filteredData
                .map(stock => stock.d[14]) // market_cap_basic
                .filter(marketCap => marketCap && marketCap !== null && marketCap > 0);
            
            if (validMarketCaps.length > 0) {
                const sum = validMarketCaps.reduce((acc, cap) => acc + cap, 0);
                avgMarketCap = sum / validMarketCaps.length;
            }
        }
        
        // Apply pagination to filtered results
        const paginatedResults = filteredData.slice(start, end + 1);
        
        // Format the data
        const formattedData = paginatedResults.map((stock, index) => {
            // Log first few stocks to debug
            if (index < 3) {
                console.log(`📊 Stock ${index}:`, {
                    symbol: stock.d[0],
                    name: stock.d[1],
                    description: stock.d[2],
                    price: stock.d[4]
                });
            }
            
            // Get company name - prefer TradingView description, fallback to helper function
            const tvDescription = stock.d[2];
            const symbolOnly = stock.d[0].includes(':') ? stock.d[0].split(':')[1] : stock.d[0];
            const companyName = (tvDescription && tvDescription.trim() !== '') 
                ? tvDescription 
                : getCompanyName(stock.d[0]);
            
            return {
                name: stock.d[0],
                symbol: symbolOnly, // Add clean symbol field
                description: companyName,
                companyName: companyName,
                shortCompanyName: getShortCompanyName(stock.d[0]),
                currency: stock.d[3],
                close: stock.d[4],
                priceCurrency: stock.d[5],
                priceChange: stock.d[6],
                volume: stock.d[7],
                relativeVolume: stock.d[8],
                PERatio: stock.d[9],
                EPS: stock.d[10],
                dividendYield: stock.d[11],
                market: stock.d[12],
                sector: stock.d[13],
                marketCapBasic: stock.d[14] || null
            };
        });
        
        // Calculate total pages based on filtered results
        const totalPages = Math.ceil(filteredData.length / size);

        res.json({
            page: pageNumber,
            totalPages: totalPages,
            pageSize: size,
            totalCount: filteredData.length, // Use filtered count
            avgMarketCap: avgMarketCap, // Average market cap of ALL filtered stocks
            stocks: formattedData,
            marketCapCounts: marketCapCounts, // Add market cap distribution
            sectorCounts: sectorCounts // Add sector distribution
        });
    } catch (error) {
        console.error("Error fetching data from TradingView:", error);
        console.error("Request parameters:", req.query);
        res.status(500).json({ 
            error: "Failed to fetch data",
            details: error.message
        });
    }
});

// New endpoint for getting filtered counts without loading all data
stockRoute.get("/api/stocks/counts", async (req, res) => {
    const { markets = "america", sector, marketCap, peMin, peMax, priceMin, priceMax, volume, dividendMin, dividendMax } = req.query;
    
    try {
        // Parse filter parameters
        const sectors = sector ? sector.split(',').map(s => s.trim()).filter(s => s) : [];
        const marketCapTiers = marketCap ? marketCap.split(',').map(tier => tier.trim()).filter(tier => tier) : [];
        const volumePresets = volume ? volume.split(',').map(v => v.trim()).filter(v => v) : [];
        
        // Volume preset definitions
        const volumePresetDefs = {
            low: { min: 0, max: 10000000 },
            medium: { min: 10000000, max: 50000000 },
            high: { min: 50000000, max: 1000000000 }
        };
        
        // Market cap tier definitions
        const marketCapTierDefs = {
            mega: { min: 200000000000, max: null },
            large: { min: 10000000000, max: 200000000000 },
            mid: { min: 2000000000, max: 10000000000 },
            small: { min: 300000000, max: 2000000000 },
            micro: { min: null, max: 300000000 }
        };
        
        let totalCount = 0;
        
        // If no complex filters, use simple approach
        // Complex logic only needed when multiple values are selected within the same filter type
        // OR when market cap filtering is needed (since TradingView API doesn't have direct market cap filters)
        const hasMultipleSectors = sectors.length > 1;
        const hasMultipleMarketCaps = marketCapTiers.length > 1;
        const hasMultipleVolumes = volumePresets.length > 1;
        const hasMultipleFilterTypes = (sectors.length > 0 ? 1 : 0) + (marketCapTiers.length > 0 ? 1 : 0) + (volumePresets.length > 0 ? 1 : 0) > 1;
        const needsMarketCapFiltering = marketCapTiers.length > 0;
        
        if (!hasMultipleSectors && !hasMultipleMarketCaps && !hasMultipleVolumes && !hasMultipleFilterTypes && !needsMarketCapFiltering) {
            // Use existing simple filter logic
            const filters = [];
            
            if (sectors.length === 1) {
                filters.push({
                    left: "sector",
                    operation: "match",
                    right: sectors[0]
                });
            }
            
            if (peMin && peMin !== 'null' && peMin !== 'Infinity' && !isNaN(parseFloat(peMin))) {
                filters.push({
                    left: "price_earnings_ttm",
                    operation: "greater",
                    right: parseFloat(peMin)
                });
            }
            if (peMax && peMax !== 'null' && peMax !== 'Infinity' && !isNaN(parseFloat(peMax))) {
                filters.push({
                    left: "price_earnings_ttm",
                    operation: "less",
                    right: parseFloat(peMax)
                });
            }
            
            if (priceMin && priceMin !== 'null' && priceMin !== 'Infinity' && !isNaN(parseFloat(priceMin))) {
                filters.push({
                    left: "close",
                    operation: "greater",
                    right: parseFloat(priceMin)
                });
            }
            if (priceMax && priceMax !== 'null' && priceMax !== 'Infinity' && !isNaN(parseFloat(priceMax))) {
                filters.push({
                    left: "close",
                    operation: "less",
                    right: parseFloat(priceMax)
                });
            }
            
            if (volumePresets.length === 1 && volumePresetDefs[volumePresets[0]]) {
                const preset = volumePresetDefs[volumePresets[0]];
                if (preset.min > 0) {
                    filters.push({
                        left: "volume",
                        operation: "greater",
                        right: preset.min
                    });
                }
                if (preset.max < 1000000000) {
                    filters.push({
                        left: "volume",
                        operation: "less",
                        right: preset.max
                    });
                }
            }
            
            if (dividendMin && dividendMin !== 'null' && dividendMin !== 'Infinity' && !isNaN(parseFloat(dividendMin))) {
                filters.push({
                    left: "dividends_yield_current",
                    operation: "greater",
                    right: parseFloat(dividendMin)
                });
            }
            if (dividendMax && dividendMax !== 'null' && dividendMax !== 'Infinity' && !isNaN(parseFloat(dividendMax))) {
                filters.push({
                    left: "dividends_yield_current",
                    operation: "less",
                    right: parseFloat(dividendMax)
                });
            }
            
            const filter = filters.length > 0 ? filters : undefined;
            
            // Get just the count without loading all data
            const response = await axios.post(
                "https://scanner.tradingview.com/global/scan?label-product=markets-screener",
                {
                    columns: ["name"], // Minimal columns for counting
                    ignore_unknown_fields: false,
                    options: { lang: "en" },
                    range: [0, 0], // Just get count
                    filter,
                    markets: [markets],
                    sort: {
                        sortBy: "market_cap_basic",
                        sortOrder: "desc",
                        nullsFirst: false
                    },
                },
                {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
                        "Accept": "application/json",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Accept-Encoding": "gzip, deflate, br, zstd",
                        "Referer": "https://vn.tradingview.com/",
                        "Content-Type": "text/plain;charset=UTF-8",
                        "Origin": "https://vn.tradingview.com",
                        "Connection": "keep-alive"
                    }
                }
            );
            
            totalCount = response.data.totalCount;
        } else {
            // Complex multi-filter logic: Proper OR within filter types, AND across filter types
            // Expected: (Sector1 OR Sector2) AND (MarketCap1 OR MarketCap2) AND (Volume1 OR Volume2)
            console.log(`🔄 Implementing multi-filter logic for counts (OR within types, AND across types):`);
            console.log(`  Sectors: ${sectors.join(', ') || 'none'}`);
            console.log(`  Market Cap Tiers: ${marketCapTiers.join(', ') || 'none'}`);
            console.log(`  Volume Presets: ${volumePresets.join(', ') || 'none'}`);
            
            // Optimization: Only generate combinations for sector + volume
            // Market cap will be applied as post-processing since TradingView API doesn't have direct market cap filters
            const filterCombinations = [];
            
            // Create combinations only for sector and volume (market cap applied separately)
            const sectorOptions = sectors.length > 0 ? sectors : [null];
            const volumeOptions = volumePresets.length > 0 ? volumePresets : [null];
            
            sectorOptions.forEach(sector => {
                volumeOptions.forEach(volume => {
                    filterCombinations.push({ sector, volume });
                });
            });
            
            console.log(`  Generated ${filterCombinations.length} filter combinations for counts`);
            
            // Make API calls for each combination
            const apiPromises = filterCombinations.map(async (combo, index) => {
                try {
                    const filters = [];
                    
                    // Add base filters (P/E, price, dividend)
                    if (peMin && peMin !== 'null' && peMin !== 'Infinity' && !isNaN(parseFloat(peMin))) {
                        filters.push({
                            left: "price_earnings_ttm",
                            operation: "greater",
                            right: parseFloat(peMin)
                        });
                    }
                    if (peMax && peMax !== 'null' && peMax !== 'Infinity' && !isNaN(parseFloat(peMax))) {
                        filters.push({
                            left: "price_earnings_ttm",
                            operation: "less",
                            right: parseFloat(peMax)
                        });
                    }
                    
                    if (priceMin && priceMin !== 'null' && priceMin !== 'Infinity' && !isNaN(parseFloat(priceMin))) {
                        filters.push({
                            left: "close",
                            operation: "greater",
                            right: parseFloat(priceMin)
                        });
                    }
                    if (priceMax && priceMax !== 'null' && priceMax !== 'Infinity' && !isNaN(parseFloat(priceMax))) {
                        filters.push({
                            left: "close",
                            operation: "less",
                            right: parseFloat(priceMax)
                        });
                    }
                    
                    if (dividendMin && dividendMin !== 'null' && dividendMin !== 'Infinity' && !isNaN(parseFloat(dividendMin))) {
                        filters.push({
                            left: "dividends_yield_current",
                            operation: "greater",
                            right: parseFloat(dividendMin)
                        });
                    }
                    if (dividendMax && dividendMax !== 'null' && dividendMax !== 'Infinity' && !isNaN(parseFloat(dividendMax))) {
                        filters.push({
                            left: "dividends_yield_current",
                            operation: "less",
                            right: parseFloat(dividendMax)
                        });
                    }
                    
                    // Add combination-specific filters
                    if (combo.sector) {
                        filters.push({
                            left: "sector",
                            operation: "match",
                            right: combo.sector
                        });
                    }
                    
                    if (combo.volume && volumePresetDefs[combo.volume]) {
                        const preset = volumePresetDefs[combo.volume];
                        if (preset.min > 0) {
                            filters.push({
                                left: "volume",
                                operation: "greater",
                                right: preset.min
                            });
                        }
                        if (preset.max < 1000000000) {
                            filters.push({
                                left: "volume",
                                operation: "less",
                                right: preset.max
                            });
                        }
                    }
                    
                    const filter = filters.length > 0 ? filters : undefined;
                    
                    // Get just the count without loading all data
                    const response = await axios.post(
                        "https://scanner.tradingview.com/global/scan?label-product=markets-screener",
                        {
                            columns: ["name"], // Minimal columns for counting
                            ignore_unknown_fields: false,
                            options: { lang: "en" },
                            range: [0, 0], // Just get count
                            filter,
                            markets: [markets],
                            sort: {
                                sortBy: "market_cap_basic",
                                sortOrder: "desc",
                                nullsFirst: false
                            },
                        },
                        {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
                                "Accept": "application/json",
                                "Accept-Language": "en-US,en;q=0.5",
                                "Accept-Encoding": "gzip, deflate, br, zstd",
                                "Referer": "https://vn.tradingview.com/",
                                "Content-Type": "text/plain;charset=UTF-8",
                                "Origin": "https://vn.tradingview.com",
                                "Connection": "keep-alive"
                            }
                        }
                    );
                    
                    console.log(`  ✅ Count combination ${index + 1} (${JSON.stringify(combo)}): ${response.data.totalCount} stocks`);
                    return response.data.totalCount;
                } catch (error) {
                    console.error(`  ❌ Count combination ${index + 1} failed:`, error.message);
                    return 0;
                }
            });
            
            // Wait for all API calls to complete
            const allCounts = await Promise.all(apiPromises);
            
            // Sum up all counts (this gives us the OR logic within each filter type)
            totalCount = allCounts.reduce((sum, count) => sum + count, 0);
            
            console.log(`  📊 Individual counts: ${allCounts.join(', ')}`);
            console.log(`  📊 Combined counts: ${totalCount} total stocks from ${filterCombinations.length} combinations`);
        }
        
        res.json({
            totalCount: totalCount,
            filters: req.query,
            note: marketCapTiers.length > 0 ? 'Count is approximate. Market cap filtering is applied post-API call.' : undefined
        });
    } catch (error) {
        console.error("Error fetching stock counts:", error);
        console.error("Request parameters:", req.query);
        res.status(500).json({ 
            error: "Failed to fetch stock counts",
            details: error.message
        });
    }
});

stockRoute.post("/updateStockDB", validateRequest(StockPrice.schema), async (req, res) => {
    const symbol = req.body.symbol;
    const listOfPrice = req.body.data;
    try {
        await getStockPrice(symbol, listOfPrice);
        return res.status(200).send(`Success saving data for Stock ${symbol}`);
    } catch (error) {
        return res.status(501).send("Internal error: " + error);
    }
});

stockRoute.get("/latestStock", isAuthenticated, async (req, res) => {
    try {
        const latestEntry = await StockPrice.findOne().sort({ date: -1 }).exec();
        if (latestEntry) {
            console.log(latestEntry.date);
            return res.status(200).json(latestEntry.date);
        } else {
            return res.status(404).send("No latest entry found");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});

async function getLatestDate(symbol) {
    const latestEntry = await StockPrice.findOne({ symbol: symbol }).sort({ date: -1 }).exec();
    if (latestEntry) {
        return latestEntry.date;
    } else {
        return null;
    }
}

async function getStockPrice(symbol, listOfPrice) {
    try {
        const latestDateInDB = await getLatestDate(symbol);
        console.log(`Latest Date for ${symbol}: `, new Date(latestDateInDB));
        for (const data of listOfPrice) {
            const recordDate = data["date"];
            if (!latestDateInDB || new Date(recordDate) > new Date(latestDateInDB)) {
                console.log(`Saving data for ${symbol} for date ${recordDate}`);
                await saveNewStock(symbol, data, recordDate);
            }
        }
        console.log(`Saving Stock ${symbol} complete!`);
    } catch (error) {
        console.log('Error in getStockPrice:', error);
    }
}

async function saveNewStock(symbol, data, recordDate) {
    const newStock = new StockPrice({
        symbol: symbol,
        open: data['open'],
        high: data['high'],
        low: data["low"],
        close: data['close'],
        volume: data['5. volume'],
        date: recordDate,
    });
    try {
        await newStock.save();
        console.log("Stock saved successfully", symbol);
    } catch (error) {
        console.log("Error saving new stock", error);
    }
}

// Route for popular stocks
stockRoute.get("/market/popular-stocks", isAuthenticated, async (req, res) => {
    try {
        // Return a list of popular stocks with mock data for now
        const popularStocks = [
            { ticker: 'AAPL', name: 'Apple Inc.', price: 175.84, change: '+2.5%', volume: 45678123 },
            { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 129.85, change: '+1.2%', volume: 34567890 },
            { ticker: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: '-0.8%', volume: 23456789 },
            { ticker: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: '+3.2%', volume: 78901234 },
            { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 140.75, change: '+0.5%', volume: 56789012 },
            { ticker: 'META', name: 'Meta Platforms Inc.', price: 326.08, change: '+1.8%', volume: 12345678 },
            { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 467.23, change: '+4.2%', volume: 23456789 },
            { ticker: 'NFLX', name: 'Netflix Inc.', price: 421.56, change: '-1.1%', volume: 34567890 }
        ];

        res.json({
            success: true,
            stocks: popularStocks,
            count: popularStocks.length
        });
    } catch (error) {
        console.error("Error fetching popular stocks:", error);
        res.status(500).json({ error: "Failed to fetch popular stocks" });
    }
});

// Helper function to get company name from symbol
function getCompanyName(symbol) {
    const companyNames = {
        'AAPL': 'Apple Inc.',
        'GOOGL': 'Alphabet Inc.',
        'GOOG': 'Alphabet Inc.',
        'MSFT': 'Microsoft Corporation',
        'AMZN': 'Amazon.com, Inc.',
        'META': 'Meta Platforms, Inc.',
        'TSLA': 'Tesla, Inc.',
        'NFLX': 'Netflix, Inc.',
        'NVDA': 'NVIDIA Corporation',
        'INTC': 'Intel Corporation',
        'IBM': 'International Business Machines Corporation',
        'CSCO': 'Cisco Systems, Inc.',
        'ORCL': 'Oracle Corporation',
        'ADBE': 'Adobe Inc.',
        'CRM': 'Salesforce, Inc.',
        'PYPL': 'PayPal Holdings, Inc.',
        'AMD': 'Advanced Micro Devices, Inc.',
        'QCOM': 'QUALCOMM Incorporated',
        'TXN': 'Texas Instruments Incorporated',
        'AVGO': 'Broadcom Inc.',
        'SHOP': 'Shopify Inc.',
        'JPM': 'JPMorgan Chase & Co.',
        'V': 'Visa Inc.',
        'MA': 'Mastercard Incorporated',
        'WMT': 'Walmart Inc.',
        'DIS': 'The Walt Disney Company',
        'BAC': 'Bank of America Corporation',
        'XOM': 'Exxon Mobil Corporation',
        'CVX': 'Chevron Corporation',
        'JNJ': 'Johnson & Johnson',
        'PG': 'The Procter & Gamble Company',
        'UNH': 'UnitedHealth Group Incorporated',
        'HD': 'The Home Depot, Inc.',
        'PFE': 'Pfizer Inc.',
        'KO': 'The Coca-Cola Company',
        'PEP': 'PepsiCo, Inc.',
        'ABBV': 'AbbVie Inc.',
        'MRK': 'Merck & Co., Inc.',
        'TMO': 'Thermo Fisher Scientific Inc.',
        'COST': 'Costco Wholesale Corporation',
        'ABT': 'Abbott Laboratories',
        'ACN': 'Accenture plc',
        'NKE': 'NIKE, Inc.',
        'DHR': 'Danaher Corporation',
        'VZ': 'Verizon Communications Inc.',
        'CMCSA': 'Comcast Corporation',
        'ADBE': 'Adobe Inc.',
        'NEE': 'NextEra Energy, Inc.',
        'BMY': 'Bristol-Myers Squibb Company',
        'PM': 'Philip Morris International Inc.',
        'UNP': 'Union Pacific Corporation',
        'RTX': 'RTX Corporation',
        'HON': 'Honeywell International Inc.',
        'T': 'AT&T Inc.',
        'LIN': 'Linde plc',
        'UPS': 'United Parcel Service, Inc.',
        'LOW': 'Lowe\'s Companies, Inc.',
        'BA': 'The Boeing Company',
        'GS': 'The Goldman Sachs Group, Inc.',
        'CAT': 'Caterpillar Inc.',
        'SBUX': 'Starbucks Corporation',
        'AXP': 'American Express Company',
        'AMD': 'Advanced Micro Devices, Inc.',
        'ISRG': 'Intuitive Surgical, Inc.',
        'NOW': 'ServiceNow, Inc.',
        'TJX': 'The TJX Companies, Inc.',
        'BLK': 'BlackRock, Inc.',
        'INTU': 'Intuit Inc.',
        'SPGI': 'S&P Global Inc.',
        'BKNG': 'Booking Holdings Inc.',
        'GILD': 'Gilead Sciences, Inc.',
        'MDLZ': 'Mondelez International, Inc.',
        'SYK': 'Stryker Corporation',
        'ADP': 'Automatic Data Processing, Inc.',
        'REGN': 'Regeneron Pharmaceuticals, Inc.',
        'CI': 'The Cigna Group',
        'MMM': '3M Company',
        'C': 'Citigroup Inc.',
        'ZTS': 'Zoetis Inc.',
        'AMT': 'American Tower Corporation',
        'CB': 'Chubb Limited',
        'MO': 'Altria Group, Inc.',
        'DUK': 'Duke Energy Corporation',
        'SO': 'The Southern Company',
        'EL': 'The Estée Lauder Companies Inc.',
        'TGT': 'Target Corporation',
        'CL': 'Colgate-Palmolive Company',
        'USB': 'U.S. Bancorp',
        'BSX': 'Boston Scientific Corporation',
        'BDX': 'Becton, Dickinson and Company',
        'SHW': 'The Sherwin-Williams Company',
        'TFC': 'Truist Financial Corporation',
        'PNC': 'The PNC Financial Services Group, Inc.',
        'CME': 'CME Group Inc.',
        'AON': 'Aon plc',
        'ITW': 'Illinois Tool Works Inc.',
        'MMC': 'Marsh & McLennan Companies, Inc.',
        'FCX': 'Freeport-McMoRan Inc.',
        'NSC': 'Norfolk Southern Corporation',
        'ECL': 'Ecolab Inc.',
        'GM': 'General Motors Company',
        'F': 'Ford Motor Company',
        'SNAP': 'Snap Inc.',
        'SQ': 'Block, Inc.',
        'UBER': 'Uber Technologies, Inc.',
        'LYFT': 'Lyft, Inc.',
        'ABNB': 'Airbnb, Inc.',
        'COIN': 'Coinbase Global, Inc.',
        'RBLX': 'Roblox Corporation',
        'PLTR': 'Palantir Technologies Inc.',
        'SNOW': 'Snowflake Inc.',
        'DDOG': 'Datadog, Inc.',
        'CRWD': 'CrowdStrike Holdings, Inc.',
        'ZM': 'Zoom Video Communications, Inc.',
        'DOCN': 'DigitalOcean Holdings, Inc.',
        'NET': 'Cloudflare, Inc.',
        'TEAM': 'Atlassian Corporation',
        'OKTA': 'Okta, Inc.',
        'TWLO': 'Twilio Inc.',
        'MDB': 'MongoDB, Inc.',
        'PANW': 'Palo Alto Networks, Inc.',
        'FTNT': 'Fortinet, Inc.'
    };
    
    // Extract the base symbol (remove exchange prefix if exists)
    const baseSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;
    return companyNames[baseSymbol] || baseSymbol;
}

// Helper function to get short company name
function getShortCompanyName(symbol) {
    const shortNames = {
        'AAPL': 'Apple',
        'GOOGL': 'Alphabet',
        'GOOG': 'Alphabet',
        'MSFT': 'Microsoft',
        'AMZN': 'Amazon',
        'META': 'Meta',
        'TSLA': 'Tesla',
        'NFLX': 'Netflix',
        'NVDA': 'NVIDIA',
        'INTC': 'Intel',
        'IBM': 'IBM',
        'CSCO': 'Cisco',
        'ORCL': 'Oracle',
        'ADBE': 'Adobe',
        'CRM': 'Salesforce',
        'PYPL': 'PayPal',
        'AMD': 'AMD',
        'QCOM': 'Qualcomm',
        'TXN': 'Texas Instruments',
        'AVGO': 'Broadcom',
        'SHOP': 'Shopify'
    };
    
    const baseSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;
    return shortNames[baseSymbol] || baseSymbol;
}

export default stockRoute;
