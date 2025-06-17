class SelfQuery {
    static DATE_RANGE_KEYWORDS = {
        // Recent time periods
        "recent": { days: 7 },
        "latest": { days: 7 },
        "current": { days: 7 },
        "today": { days: 1 },
        "yesterday": { days: 1 },
        
        // Weekly periods
        "last week": { days: 7 },
        "this week": { start: "current_week" },
        "past week": { days: 7 },
        
        // Monthly periods
        "last month": { days: 30 },
        "this month": { start: "current_month" },
        "past month": { days: 30 },
        "month_to_date": { start: "current_month" },
        
        // Quarterly periods
        "last quarter": { days: 90 },
        "this quarter": { start: "current_quarter" },
        "past quarter": { days: 90 },
        "quarter_to_date": { start: "current_quarter" },
        
        // Yearly periods
        "last year": { days: 365 },
        "this year": { start: "current_year" },
        "past year": { days: 365 },
        "year_to_date": { start: "current_year" },
        "ytd": { start: "current_year" },
        
        // Custom periods
        "last 6 months": { days: 180 },
        "last 3 months": { days: 90 },
        "last 2 years": { days: 730 },
        "last 5 years": { days: 1825 }
    };

    static _validateDate(dateStr) {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    }

    static _extractDateRange(query) {
        if (!query || typeof query !== 'string') {
            console.warn('Invalid query in _extractDateRange:', query);
            return null;
        }

        const queryLower = query.toLowerCase();
        const today = new Date();
        
        try {
            for (const [keyword, rangeInfo] of Object.entries(SelfQuery.DATE_RANGE_KEYWORDS)) {
                if (queryLower.includes(keyword)) {
                    console.log(`🔄 Found date keyword: ${keyword}`);
                    
                    if ('days' in rangeInfo) {
                        const endDate = today.toISOString().split('T')[0];
                        const startDate = new Date(today.getTime() - rangeInfo.days * 24 * 60 * 60 * 1000)
                            .toISOString().split('T')[0];
                        
                        if (!SelfQuery._validateDate(startDate) || !SelfQuery._validateDate(endDate)) {
                            console.warn('⚠️ Invalid date generated:', { startDate, endDate });
                            continue;
                        }
                        
                        return { start_date: startDate, end_date: endDate };
                    } else if ('start' in rangeInfo) {
                        let dateRange;
                        switch (rangeInfo.start) {
                            case 'current_year':
                                dateRange = {
                                    start_date: `${today.getFullYear()}-01-01`,
                                    end_date: today.toISOString().split('T')[0]
                                };
                                break;
                            case 'current_month':
                                dateRange = {
                                    start_date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`,
                                    end_date: today.toISOString().split('T')[0]
                                };
                                break;
                            case 'current_quarter':
                                const quarterStart = Math.floor(today.getMonth() / 3) * 3 + 1;
                                dateRange = {
                                    start_date: `${today.getFullYear()}-${String(quarterStart).padStart(2, '0')}-01`,
                                    end_date: today.toISOString().split('T')[0]
                                };
                                break;
                            case 'current_week':
                                const startOfWeek = new Date(today);
                                startOfWeek.setDate(today.getDate() - today.getDay());
                                dateRange = {
                                    start_date: startOfWeek.toISOString().split('T')[0],
                                    end_date: today.toISOString().split('T')[0]
                                };
                                break;
                            default:
                                console.warn('⚠️ Unknown date range type:', rangeInfo.start);
                                continue;
                        }

                        if (!SelfQuery._validateDate(dateRange.start_date) || !SelfQuery._validateDate(dateRange.end_date)) {
                            console.warn('⚠️ Invalid date generated:', dateRange);
                            continue;
                        }

                        return dateRange;
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('❌ Error in _extractDateRange:', {
                error: error.message,
                query,
                stack: error.stack
            });
            return null;
        }
    }

    async extractMetadata(query) {
        if (!query || typeof query !== 'string') {
            console.warn('⚠️ Invalid query in extractMetadata:', query);
            return {
                modified_query: query,
                date_range: null
            };
        }

        try {
            console.log('🔄 Extracting date range from query...');
            const dateRange = SelfQuery._extractDateRange(query);
            
            if (dateRange) {
                const dateContext = ` between ${dateRange.start_date} and ${dateRange.end_date}`;
                query = query + dateContext;
                console.log('✅ Added date range to query:', {
                    query,
                    dateRange
                });
            } else {
                console.log('ℹ️ No date range found in query');
            }
            
            return {
                modified_query: query,
                date_range: dateRange
            };
        } catch (error) {
            console.error('❌ Error extracting date range:', {
                error: error.message,
                query,
                stack: error.stack
            });
            return {
                modified_query: query,
                date_range: null
            };
        }
    }
}

export default SelfQuery; 