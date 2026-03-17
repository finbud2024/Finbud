import express from 'express';
import axios from 'axios';

const peAnalysisRoute = express.Router();

// Market data and financial ratios
const SECTOR_MULTIPLES = {
  'saas': { 
    evRevenue: [8, 15], 
    evEbitda: [25, 45], 
    growth: [30, 80],
    marginProfile: { gross: [75, 85], ebitda: [20, 35] }
  },
  'fintech': { 
    evRevenue: [5, 12], 
    evEbitda: [20, 35], 
    growth: [25, 60],
    marginProfile: { gross: [60, 75], ebitda: [15, 30] }
  },
  'ecommerce': { 
    evRevenue: [2, 6], 
    evEbitda: [12, 25], 
    growth: [15, 40],
    marginProfile: { gross: [40, 60], ebitda: [8, 20] }
  },
  'healthcare': { 
    evRevenue: [6, 12], 
    evEbitda: [18, 30], 
    growth: [20, 50],
    marginProfile: { gross: [70, 85], ebitda: [18, 32] }
  },
  'edtech': { 
    evRevenue: [4, 8], 
    evEbitda: [15, 28], 
    growth: [25, 55],
    marginProfile: { gross: [65, 80], ebitda: [12, 25] }
  }
};

const INTEREST_RATES = {
  'series-a': { min: 8, max: 12 },
  'series-b': { min: 7, max: 10 },
  'growth': { min: 6, max: 9 },
  'buyout': { min: 5, max: 8 }
};

// Enhanced Deal Analysis
peAnalysisRoute.post('/analyze-deal', async (req, res) => {
  try {
    const { companyName, sector, stage, ebitda, revenue, teamScore, marketSize, competitiveAdvantage } = req.body;

    if (!companyName || !sector || !ebitda || !revenue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate comprehensive deal metrics
    const analysis = calculateDealMetrics(req.body);
    
    // Generate AI-powered insights
    const insights = generateDealInsights(req.body, analysis);
    
    // Market comparison
    const marketComparison = await getMarketComparison(sector, stage);
    
    // Risk assessment
    const riskAssessment = calculateRiskMetrics(req.body, analysis);

    const result = {
      dealId: `deal_${Date.now()}`,
      timestamp: new Date().toISOString(),
      companyInfo: {
        name: companyName,
        sector,
        stage
      },
      financialMetrics: analysis,
      insights,
      marketComparison,
      riskAssessment,
      recommendations: generateRecommendations(analysis, riskAssessment)
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Deal analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze deal' });
  }
});

// LBO Model Calculator
peAnalysisRoute.post('/lbo-model', async (req, res) => {
  try {
    const { 
      ebitda, 
      debtMultiple, 
      exitMultiple, 
      interestRate, 
      holdingPeriod, 
      ebitdaGrowth = 15,
      taxRate = 25,
      capexAsPercentOfRevenue = 3,
      workingCapitalAsPercentOfRevenue = 2
    } = req.body;

    const lboModel = calculateLBOModel({
      ebitda,
      debtMultiple,
      exitMultiple,
      interestRate,
      holdingPeriod,
      ebitdaGrowth,
      taxRate,
      capexAsPercentOfRevenue,
      workingCapitalAsPercentOfRevenue
    });

    res.json({ success: true, data: lboModel });
  } catch (error) {
    console.error('LBO calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate LBO model' });
  }
});

// Deal Memo Generator
peAnalysisRoute.post('/generate-memo', async (req, res) => {
  try {
    const { dealData, userPreferences = {} } = req.body;
    
    const memo = await generateComprehensiveMemo(dealData, userPreferences);
    
    res.json({ success: true, data: memo });
  } catch (error) {
    console.error('Memo generation error:', error);
    res.status(500).json({ error: 'Failed to generate deal memo' });
  }
});

// Market Intelligence
peAnalysisRoute.get('/market-intelligence/:sector', async (req, res) => {
  try {
    const { sector } = req.params;
    const { stage, geography = 'global' } = req.query;
    
    const intelligence = await getMarketIntelligence(sector, stage, geography);
    
    res.json({ success: true, data: intelligence });
  } catch (error) {
    console.error('Market intelligence error:', error);
    res.status(500).json({ error: 'Failed to fetch market intelligence' });
  }
});

// Comparable Deals Database
peAnalysisRoute.get('/comparable-deals', async (req, res) => {
  try {
    const { sector, stage, revenueRange, timeframe = '24m' } = req.query;
    
    const comparables = await getComparableDeals({
      sector,
      stage,
      revenueRange,
      timeframe
    });
    
    res.json({ success: true, data: comparables });
  } catch (error) {
    console.error('Comparables error:', error);
    res.status(500).json({ error: 'Failed to fetch comparable deals' });
  }
});

// Helper Functions
function calculateDealMetrics(dealData) {
  const { sector, stage, ebitda, revenue, teamScore = 75, marketSize } = dealData;
  const sectorData = SECTOR_MULTIPLES[sector];
  
  // Valuation metrics
  const evRevenue = revenue * ((sectorData.evRevenue[0] + sectorData.evRevenue[1]) / 2);
  const evEbitda = ebitda * ((sectorData.evEbitda[0] + sectorData.evEbitda[1]) / 2);
  const impliedValuation = (evRevenue + evEbitda) / 2;
  
  // Financial health
  const ebitdaMargin = (ebitda / revenue) * 100;
  const revenueMultiple = evRevenue / revenue;
  const ebitdaMultiple = evEbitda / ebitda;
  
  // Growth projections
  const projectedGrowth = (sectorData.growth[0] + sectorData.growth[1]) / 2;
  
  // Overall score calculation
  const valuationScore = Math.min(100, Math.max(0, 
    50 + (revenueMultiple - 5) * 10 + (ebitdaMargin - 15) * 2
  ));
  
  const teamAdjustment = (teamScore - 75) * 0.3;
  const marketAdjustment = marketSize ? Math.log10(marketSize) * 5 : 0;
  
  const overallScore = Math.min(100, Math.max(0, 
    valuationScore + teamAdjustment + marketAdjustment
  ));

  return {
    valuation: {
      impliedValuation: Math.round(impliedValuation * 100) / 100,
      evRevenue: Math.round(evRevenue * 100) / 100,
      evEbitda: Math.round(evEbitda * 100) / 100,
      revenueMultiple: Math.round(revenueMultiple * 100) / 100,
      ebitdaMultiple: Math.round(ebitdaMultiple * 100) / 100
    },
    margins: {
      ebitdaMargin: Math.round(ebitdaMargin * 100) / 100,
      projectedGrossMargin: (sectorData.marginProfile.gross[0] + sectorData.marginProfile.gross[1]) / 2
    },
    growth: {
      projectedGrowth: Math.round(projectedGrowth * 100) / 100,
      impliedExitValue: Math.round(impliedValuation * (1 + projectedGrowth/100) ** 3 * 100) / 100
    },
    scoring: {
      overall: Math.round(overallScore),
      valuation: Math.round(valuationScore),
      team: teamScore,
      market: Math.round(marketAdjustment * 10)
    }
  };
}

function calculateLBOModel(params) {
  const {
    ebitda,
    debtMultiple,
    exitMultiple,
    interestRate,
    holdingPeriod,
    ebitdaGrowth,
    taxRate,
    capexAsPercentOfRevenue,
    workingCapitalAsPercentOfRevenue
  } = params;

  // Initial structure
  const initialDebt = ebitda * debtMultiple;
  const initialEquity = ebitda * exitMultiple - initialDebt;
  const purchasePrice = initialDebt + initialEquity;

  // Project financials
  const projections = [];
  let currentEbitda = ebitda;
  let currentDebt = initialDebt;
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= holdingPeriod; year++) {
    currentEbitda *= (1 + ebitdaGrowth / 100);
    const interestExpense = currentDebt * (interestRate / 100);
    const ebit = currentEbitda; // Simplified
    const taxableIncome = Math.max(0, ebit - interestExpense);
    const taxes = taxableIncome * (taxRate / 100);
    const netIncome = ebit - interestExpense - taxes;
    
    // Cash flow calculations
    const revenue = currentEbitda / (ebitda / (ebitda * 5)); // Assumed revenue multiple
    const capex = revenue * (capexAsPercentOfRevenue / 100);
    const workingCapitalChange = revenue * (workingCapitalAsPercentOfRevenue / 100);
    
    const freeCashFlow = netIncome + currentEbitda - ebit - capex - workingCapitalChange;
    const debtPaydown = Math.max(0, freeCashFlow * 0.5); // 50% to debt paydown
    
    currentDebt = Math.max(0, currentDebt - debtPaydown);
    cumulativeCashFlow += freeCashFlow - debtPaydown;

    projections.push({
      year,
      ebitda: Math.round(currentEbitda * 100) / 100,
      netIncome: Math.round(netIncome * 100) / 100,
      freeCashFlow: Math.round(freeCashFlow * 100) / 100,
      debt: Math.round(currentDebt * 100) / 100,
      cumulativeCashFlow: Math.round(cumulativeCashFlow * 100) / 100
    });
  }

  // Exit calculations
  const exitEbitda = currentEbitda;
  const exitValue = exitEbitda * exitMultiple;
  const remainingDebt = currentDebt;
  const equityValue = exitValue - remainingDebt;
  
  // Returns calculation
  const totalReturn = equityValue + cumulativeCashFlow;
  const multipleOfMoney = totalReturn / initialEquity;
  const irr = Math.pow(multipleOfMoney, 1/holdingPeriod) - 1;

  return {
    structure: {
      purchasePrice: Math.round(purchasePrice * 100) / 100,
      initialDebt: Math.round(initialDebt * 100) / 100,
      initialEquity: Math.round(initialEquity * 100) / 100,
      debtToEquity: Math.round((initialDebt / initialEquity) * 100) / 100
    },
    projections,
    exit: {
      exitValue: Math.round(exitValue * 100) / 100,
      remainingDebt: Math.round(remainingDebt * 100) / 100,
      equityValue: Math.round(equityValue * 100) / 100
    },
    returns: {
      multipleOfMoney: Math.round(multipleOfMoney * 100) / 100,
      irr: Math.round(irr * 10000) / 100, // Convert to percentage
      totalCashFlow: Math.round(cumulativeCashFlow * 100) / 100,
      paybackPeriod: Math.round((initialEquity / (cumulativeCashFlow / holdingPeriod)) * 100) / 100
    }
  };
}

function generateDealInsights(dealData, analysis) {
  const { sector, stage, companyName } = dealData;
  const { scoring } = analysis;

  const insights = [];

  // Valuation insights
  if (analysis.valuation.revenueMultiple > SECTOR_MULTIPLES[sector].evRevenue[1]) {
    insights.push({
      type: 'warning',
      category: 'Valuation',
      message: `Revenue multiple của ${companyName} cao hơn trung bình thị trường cho sector ${sector}`,
      recommendation: 'Cần thẩm định kỹ lưỡng về growth trajectory và sustainable competitive advantage'
    });
  }

  // Margin insights
  if (analysis.margins.ebitdaMargin < SECTOR_MULTIPLES[sector].marginProfile.ebitda[0]) {
    insights.push({
      type: 'risk',
      category: 'Profitability',
      message: 'EBITDA margin thấp hơn benchmark của sector',
      recommendation: 'Focus vào operational efficiency và cost optimization opportunities'
    });
  }

  // Growth insights
  if (analysis.growth.projectedGrowth > 50) {
    insights.push({
      type: 'opportunity',
      category: 'Growth',
      message: 'High growth potential được identify',
      recommendation: 'Verify growth assumptions và ensure adequate capital for scaling'
    });
  }

  // Overall scoring insights
  if (scoring.overall >= 80) {
    insights.push({
      type: 'positive',
      category: 'Overall',
      message: 'Deal có potential cao với strong fundamentals',
      recommendation: 'Move to detailed due diligence phase'
    });
  } else if (scoring.overall < 60) {
    insights.push({
      type: 'caution',
      category: 'Overall',
      message: 'Deal có nhiều risk factors cần được address',
      recommendation: 'Cần comprehensive risk mitigation plan trước khi proceed'
    });
  }

  return insights;
}

function calculateRiskMetrics(dealData, analysis) {
  const { sector, stage, ebitda, revenue } = dealData;
  
  // Market risk
  const marketVolatility = {
    'saas': 0.25,
    'fintech': 0.35,
    'ecommerce': 0.40,
    'healthcare': 0.20,
    'edtech': 0.30
  }[sector];

  // Stage risk
  const stageRisk = {
    'series-a': 0.60,
    'series-b': 0.45,
    'growth': 0.30,
    'buyout': 0.20
  }[stage];

  // Financial risk
  const revenueConcentration = Math.random() * 0.3 + 0.1; // Simulated
  const customerRetention = Math.random() * 0.2 + 0.8; // Simulated
  
  const overallRisk = (marketVolatility + stageRisk + revenueConcentration + (1-customerRetention)) / 4;

  return {
    overall: Math.round(overallRisk * 100),
    components: {
      market: Math.round(marketVolatility * 100),
      stage: Math.round(stageRisk * 100),
      financial: Math.round(((revenueConcentration + (1-customerRetention)) / 2) * 100),
      operational: Math.round((Math.random() * 0.3 + 0.2) * 100)
    },
    riskFactors: [
      'Market competition intensification',
      'Customer concentration dependency',
      'Key person risk in management',
      'Regulatory changes impact',
      'Technology disruption threat'
    ]
  };
}

function generateRecommendations(analysis, riskAssessment) {
  const recommendations = [];

  if (analysis.scoring.overall >= 75) {
    recommendations.push({
      priority: 'high',
      action: 'Proceed to detailed due diligence',
      timeline: '2-3 weeks',
      focus: ['Financial audit', 'Market validation', 'Team assessment']
    });
  }

  if (riskAssessment.overall > 60) {
    recommendations.push({
      priority: 'high',
      action: 'Develop comprehensive risk mitigation strategy',
      timeline: '1-2 weeks',
      focus: ['Diversification plans', 'Operational improvements', 'Market expansion']
    });
  }

  if (analysis.valuation.revenueMultiple > 10) {
    recommendations.push({
      priority: 'medium',
      action: 'Negotiate valuation adjustment',
      timeline: '1 week',
      focus: ['Comparable analysis', 'Growth verification', 'Terms optimization']
    });
  }

  return recommendations;
}

async function getMarketComparison(sector, stage) {
  // Simulated market data - in real implementation, this would fetch from databases
  const marketData = {
    sectorTrends: {
      growthRate: SECTOR_MULTIPLES[sector].growth[1],
      medianValuation: (SECTOR_MULTIPLES[sector].evRevenue[0] + SECTOR_MULTIPLES[sector].evRevenue[1]) / 2,
      dealCount: Math.floor(Math.random() * 50) + 20,
      hotness: Math.random() > 0.5 ? 'hot' : 'moderate'
    },
    stageBenchmarks: {
      typical_check_size: {
        'series-a': [2, 8],
        'series-b': [8, 25],
        'growth': [25, 100],
        'buyout': [100, 500]
      }[stage],
      success_rate: {
        'series-a': 0.15,
        'series-b': 0.25,
        'growth': 0.40,
        'buyout': 0.65
      }[stage]
    }
  };

  return marketData;
}

async function generateComprehensiveMemo(dealData, preferences) {
  const memo = {
    executiveSummary: {
      investment_thesis: `${dealData.companyName} represents a compelling investment opportunity in the rapidly growing ${dealData.sector} sector. The company demonstrates strong fundamentals with ${dealData.ebitda}M EBITDA on ${dealData.revenue}M revenue, indicating healthy operational efficiency.`,
      key_highlights: [
        `Market-leading position in ${dealData.sector} with differentiated technology platform`,
        `Strong management team with proven track record of execution`,
        `Significant market opportunity with ${SECTOR_MULTIPLES[dealData.sector].growth[1]}%+ projected growth`,
        `Clear path to scale with attractive unit economics and margin expansion potential`
      ],
      investment_risks: [
        'Competitive landscape intensification',
        'Customer concentration and retention challenges',
        'Regulatory environment changes',
        'Key person dependency risks'
      ]
    },
    financial_analysis: {
      current_metrics: {
        revenue: dealData.revenue,
        ebitda: dealData.ebitda,
        margin: Math.round((dealData.ebitda / dealData.revenue) * 100),
        growth_rate: `${SECTOR_MULTIPLES[dealData.sector].growth[0]}-${SECTOR_MULTIPLES[dealData.sector].growth[1]}%`
      },
      projections: generateFinancialProjections(dealData),
      benchmarking: `Revenue multiple aligns with sector median of ${SECTOR_MULTIPLES[dealData.sector].evRevenue[0]}-${SECTOR_MULTIPLES[dealData.sector].evRevenue[1]}x`
    },
    due_diligence_plan: {
      financial: ['Audit historical financials', 'Validate revenue recognition', 'Assess working capital needs'],
      commercial: ['Market size validation', 'Customer interviews', 'Competitive positioning analysis'],
      operational: ['Technology stack review', 'Scalability assessment', 'Key personnel evaluation'],
      legal: ['Cap table review', 'IP assessment', 'Regulatory compliance check']
    },
    next_steps: [
      'Management presentation and Q&A session',
      'Customer reference calls',
      'Financial and legal due diligence initiation',
      'Investment committee presentation preparation'
    ],
    timeline: '6-8 weeks to closing',
    generated_at: new Date().toISOString()
  };

  return memo;
}

function generateFinancialProjections(dealData) {
  const years = [1, 2, 3, 4, 5];
  const growthRate = (SECTOR_MULTIPLES[dealData.sector].growth[0] + SECTOR_MULTIPLES[dealData.sector].growth[1]) / 2 / 100;
  
  return years.map(year => {
    const projectedRevenue = dealData.revenue * Math.pow(1 + growthRate, year);
    const projectedEbitda = projectedRevenue * (dealData.ebitda / dealData.revenue) * (1 + 0.02 * year); // Margin expansion
    
    return {
      year: `Year ${year}`,
      revenue: Math.round(projectedRevenue),
      ebitda: Math.round(projectedEbitda),
      margin: Math.round((projectedEbitda / projectedRevenue) * 100)
    };
  });
}

async function getMarketIntelligence(sector, stage, geography) {
  // Simulated intelligence data
  return {
    sector_overview: {
      market_size: `$${Math.floor(Math.random() * 100 + 50)}B`,
      growth_rate: `${SECTOR_MULTIPLES[sector].growth[1]}%`,
      key_drivers: [
        'Digital transformation acceleration',
        'Changing consumer behavior',
        'Regulatory tailwinds',
        'Technology advancement'
      ]
    },
    recent_transactions: Array.from({length: 5}, (_, i) => ({
      company: `${sector.charAt(0).toUpperCase() + sector.slice(1)} Company ${i+1}`,
      stage,
      valuation: `$${Math.floor(Math.random() * 200 + 50)}M`,
      multiple: `${Math.floor(Math.random() * 10 + 5)}x revenue`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })),
    market_sentiment: Math.random() > 0.5 ? 'bullish' : 'cautious',
    emerging_trends: [
      'AI/ML integration becoming table stakes',
      'Vertical-specific solutions gaining traction',
      'Sustainability and ESG focus increasing',
      'Customer success becoming critical differentiator'
    ]
  };
}

async function getComparableDeals(params) {
  // Simulated comparable deals
  return {
    total_count: Math.floor(Math.random() * 50 + 10),
    deals: Array.from({length: 8}, (_, i) => ({
      company_name: `Comparable Company ${i+1}`,
      sector: params.sector,
      stage: params.stage,
      valuation: `$${Math.floor(Math.random() * 300 + 50)}M`,
      revenue_multiple: (Math.random() * 10 + 2).toFixed(1),
      ebitda_multiple: (Math.random() * 20 + 10).toFixed(1),
      growth_rate: `${Math.floor(Math.random() * 40 + 20)}%`,
      date: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })),
    summary_stats: {
      median_revenue_multiple: (Math.random() * 5 + 3).toFixed(1),
      median_growth_rate: `${Math.floor(Math.random() * 20 + 25)}%`,
      average_deal_size: `$${Math.floor(Math.random() * 100 + 75)}M`
    }
  };
}

export default peAnalysisRoute; 