export const RESEARCH_BRIEF = {
  domain: "FinTech & Digital Assets",
  objective: "analyze",
  entities: "Tesla stock and competitive landscape in electric vehicle industry",
  time_horizon: "5-year analysis (2020-2024)",
  geography: "Global markets",
  data_constraints: "no preference",
  output_preferences: "detailed report, Vietnamese",
};

export const MECE_JSON_RESPONSE_SIMPLE = {
  "root": {
    "name": "Global Asset Pricing Analysis",
    "id": "0",
    "children": [
      {
        "name": "Equity Market Dynamics",
        "id": "0.1",
        "children": [
          {
            "name": "Valuation Model Performance",
            "id": "0.1.1",
            "children": [
              {
                "name": "DCF Model Accuracy",
                "id": "0.1.1.1",
                "children": [
                  {
                    "name": "Projected Cash Flow Analysis",
                    "id": "0.1.1.1.1",
                    "goal": "Assess accuracy of DCF projections vs. actuals.",
                    "data_sources": [
                      "Company 10K filings (2020-2024)",
                      "Bloomberg terminal",
                      "IBES estimates"
                    ],
                    "methods": [
                      "Regression analysis",
                      "Time series forecasting",
                      "Monte Carlo simulation"
                    ],
                    "deliverables": [
                      "Report on DCF projection accuracy",
                      "Statistical analysis of forecast errors"
                    ]
                  },
                  {
                    "name": "Discount Rate Sensitivity Analysis",
                    "id": "0.1.1.1.2",
                    "goal": "Determine impact of discount rate changes on valuation.",
                    "data_sources": [
                      "Federal Reserve data",
                      "Corporate bond yields",
                      "Equity risk premium data"
                    ],
                    "methods": [
                      "Sensitivity analysis",
                      "Scenario analysis",
                      "Correlation analysis"
                    ],
                    "deliverables": [
                      "Sensitivity analysis report",
                      "Scenario-based valuation adjustments"
                    ]
                  },
                  {
                    "name": "Terminal Value Estimation",
                    "id": "0.1.1.1.3",
                    "goal": "Evaluate different terminal value calculation methods.",
                    "data_sources": [
                      "Historical growth rates",
                      "Industry benchmarks",
                      "Perpetuity growth models"
                    ],
                    "methods": [
                      "Comparative analysis",
                      "Statistical modeling",
                      "Sensitivity testing"
                    ],
                    "deliverables": [
                      "Report on terminal value estimation methods",
                      "Justification for chosen method"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

export const MECE_JSON_FULL_RESPONSE = {
    "root": {
      "name": "Global Asset Pricing Analysis",
      "id": "0",
      "children": [
        {
          "name": "Equity Market Dynamics",
          "id": "0.1",
          "children": [
            {
              "name": "Valuation Model Performance",
              "id": "0.1.1",
              "children": [
                {
                  "name": "DCF Model Accuracy",
                  "id": "0.1.1.1",
                  "children": [
                    {
                      "name": "Projected Cash Flow Analysis",
                      "id": "0.1.1.1.1",
                      "goal": "Assess accuracy of DCF projections vs. actuals.",
                      "data_sources": [
                        "Company 10K filings (2020-2024)",
                        "Bloomberg terminal",
                        "IBES estimates"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Time series forecasting",
                        "Monte Carlo simulation"
                      ],
                      "deliverables": [
                        "Report on DCF projection accuracy",
                        "Statistical analysis of forecast errors"
                      ]
                    },
                    {
                      "name": "Discount Rate Sensitivity Analysis",
                      "id": "0.1.1.1.2",
                      "goal": "Determine impact of discount rate changes on valuation.",
                      "data_sources": [
                        "Federal Reserve data",
                        "Corporate bond yields",
                        "Equity risk premium data"
                      ],
                      "methods": [
                        "Sensitivity analysis",
                        "Scenario analysis",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "Sensitivity analysis report",
                        "Scenario-based valuation adjustments"
                      ]
                    },
                    {
                      "name": "Terminal Value Estimation",
                      "id": "0.1.1.1.3",
                      "goal": "Evaluate different terminal value calculation methods.",
                      "data_sources": [
                        "Historical growth rates",
                        "Industry benchmarks",
                        "Perpetuity growth models"
                      ],
                      "methods": [
                        "Comparative analysis",
                        "Statistical modeling",
                        "Sensitivity testing"
                      ],
                      "deliverables": [
                        "Report on terminal value estimation methods",
                        "Justification for chosen method"
                      ]
                    }
                  ]
                },
                {
                  "name": "Relative Valuation Metrics",
                  "id": "0.1.1.2",
                  "children": [
                    {
                      "name": "P/E Ratio Analysis",
                      "id": "0.1.1.2.1",
                      "goal": "Compare P/E ratios across sectors and geographies.",
                      "data_sources": [
                        "Bloomberg terminal",
                        "FactSet",
                        "Company financial statements"
                      ],
                      "methods": [
                        "Statistical analysis",
                        "Regression analysis",
                        "Peer group comparison"
                      ],
                      "deliverables": [
                        "P/E ratio comparison report",
                        "Identification of undervalued/overvalued stocks"
                      ]
                    },
                    {
                      "name": "Price-to-Book Valuation",
                      "id": "0.1.1.2.2",
                      "goal": "Assess valuation based on price-to-book ratios.",
                      "data_sources": [
                        "Company balance sheets",
                        "Market data providers",
                        "Industry reports"
                      ],
                      "methods": [
                        "Ratio analysis",
                        "Regression analysis",
                        "Peer analysis"
                      ],
                      "deliverables": [
                        "Price-to-book valuation report",
                        "Comparison with industry averages"
                      ]
                    },
                    {
                      "name": "EV/EBITDA Analysis",
                      "id": "0.1.1.2.3",
                      "goal": "Evaluate enterprise value relative to EBITDA.",
                      "data_sources": [
                        "Company financial statements",
                        "Market data",
                        "Analyst reports"
                      ],
                      "methods": [
                        "Ratio analysis",
                        "Regression",
                        "Peer comparison"
                      ],
                      "deliverables": [
                        "EV/EBITDA valuation report",
                        "Industry benchmarking"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "Factor Investing Performance",
              "id": "0.1.2",
              "children": [
                {
                  "name": "Value Factor Returns",
                  "id": "0.1.2.1",
                  "children": [
                    {
                      "name": "High Book-to-Market Stocks",
                      "id": "0.1.2.1.1",
                      "goal": "Analyze performance of high book-to-market stocks.",
                      "data_sources": [
                        "CRSP database",
                        "Compustat",
                        "Bloomberg"
                      ],
                      "methods": [
                        "Portfolio construction",
                        "Return attribution",
                        "Risk analysis"
                      ],
                      "deliverables": [
                        "Value factor performance report",
                        "Risk-adjusted return analysis"
                      ]
                    },
                    {
                      "name": "Low P/E Ratio Stocks",
                      "id": "0.1.2.1.2",
                      "goal": "Evaluate returns of low P/E ratio stocks.",
                      "data_sources": [
                        "CRSP",
                        "Compustat",
                        "Bloomberg"
                      ],
                      "methods": [
                        "Portfolio construction",
                        "Return attribution",
                        "Risk analysis"
                      ],
                      "deliverables": [
                        "Low P/E ratio performance report",
                        "Comparison with market benchmarks"
                      ]
                    },
                    {
                      "name": "Dividend Yield Strategies",
                      "id": "0.1.2.1.3",
                      "goal": "Assess performance of dividend yield-based strategies.",
                      "data_sources": [
                        "CRSP",
                        "Compustat",
                        "Bloomberg"
                      ],
                      "methods": [
                        "Portfolio construction",
                        "Return attribution",
                        "Risk analysis"
                      ],
                      "deliverables": [
                        "Dividend yield strategy report",
                        "Income generation analysis"
                      ]
                    }
                  ]
                },
                {
                  "name": "Momentum Factor Returns",
                  "id": "0.1.2.2",
                  "children": [
                    {
                      "name": "Past Year Winners",
                      "id": "0.1.2.2.1",
                      "goal": "Analyze performance of stocks with high past-year returns.",
                      "data_sources": [
                        "CRSP",
                        "Bloomberg",
                        "FactSet"
                      ],
                      "methods": [
                        "Portfolio construction",
                        "Return attribution",
                        "Risk analysis"
                      ],
                      "deliverables": [
                        "Momentum factor performance report",
                        "Analysis of momentum crashes"
                      ]
                    },
                    {
                      "name": "Short-Term Reversals",
                      "id": "0.1.2.2.2",
                      "goal": "Evaluate short-term reversal strategies.",
                      "data_sources": [
                        "CRSP",
                        "Bloomberg",
                        "FactSet"
                      ],
                      "methods": [
                        "Portfolio construction",
                        "Return attribution",
                        "Risk analysis"
                      ],
                      "deliverables": [
                        "Short-term reversal strategy report",
                        "Transaction cost analysis"
                      ]
                    },
                    {
                      "name": "Trend Following Strategies",
                      "id": "0.1.2.2.3",
                      "goal": "Assess trend-following strategies in equity markets.",
                      "data_sources": [
                        "CRSP",
                        "Bloomberg",
                        "FactSet"
                      ],
                      "methods": [
                        "Portfolio construction",
                        "Return attribution",
                        "Risk analysis"
                      ],
                      "deliverables": [
                        "Trend-following strategy report",
                        "Performance during different market regimes"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Fixed Income Market Analysis",
          "id": "0.2",
          "children": [
            {
              "name": "Yield Curve Dynamics",
              "id": "0.2.1",
              "children": [
                {
                  "name": "Term Structure Modeling",
                  "id": "0.2.1.1",
                  "children": [
                    {
                      "name": "Nelson-Siegel Model",
                      "id": "0.2.1.1.1",
                      "goal": "Fit Nelson-Siegel model to yield curve data.",
                      "data_sources": [
                        "Treasury yield data",
                        "Bloomberg",
                        "Federal Reserve data"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Optimization techniques",
                        "Time series analysis"
                      ],
                      "deliverables": [
                        "Nelson-Siegel model parameters",
                        "Yield curve forecasts"
                      ]
                    },
                    {
                      "name": "Svensson Model",
                      "id": "0.2.1.1.2",
                      "goal": "Fit Svensson model to yield curve data.",
                      "data_sources": [
                        "Treasury yield data",
                        "Bloomberg",
                        "Federal Reserve data"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Optimization techniques",
                        "Time series analysis"
                      ],
                      "deliverables": [
                        "Svensson model parameters",
                        "Yield curve forecasts"
                      ]
                    },
                    {
                      "name": "Dynamic Term Structure Models",
                      "id": "0.2.1.1.3",
                      "goal": "Evaluate dynamic term structure models.",
                      "data_sources": [
                        "Treasury yield data",
                        "Bloomberg",
                        "Federal Reserve data"
                      ],
                      "methods": [
                        "Kalman filter",
                        "Maximum likelihood estimation",
                        "Time series analysis"
                      ],
                      "deliverables": [
                        "Dynamic term structure model parameters",
                        "Yield curve forecasts"
                      ]
                    }
                  ]
                },
                {
                  "name": "Yield Spread Analysis",
                  "id": "0.2.1.2",
                  "children": [
                    {
                      "name": "Credit Spread Analysis",
                      "id": "0.2.1.2.1",
                      "goal": "Analyze credit spreads between corporate and government bonds.",
                      "data_sources": [
                        "Corporate bond yields",
                        "Treasury yields",
                        "Credit ratings data"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Correlation analysis",
                        "Spread duration analysis"
                      ],
                      "deliverables": [
                        "Credit spread analysis report",
                        "Identification of undervalued/overvalued bonds"
                      ]
                    },
                    {
                      "name": "Inflation Expectations",
                      "id": "0.2.1.2.2",
                      "goal": "Assess impact of inflation expectations on yield spreads.",
                      "data_sources": [
                        "TIPS yields",
                        "Inflation data",
                        "Survey data"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Correlation analysis",
                        "Break-even inflation rate analysis"
                      ],
                      "deliverables": [
                        "Inflation expectations report",
                        "Impact on yield spreads"
                      ]
                    },
                    {
                      "name": "Liquidity Premiums",
                      "id": "0.2.1.2.3",
                      "goal": "Evaluate liquidity premiums in fixed income markets.",
                      "data_sources": [
                        "Bond trading volumes",
                        "Bid-ask spreads",
                        "Off-the-run Treasury yields"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Liquidity ratio analysis",
                        "Market microstructure analysis"
                      ],
                      "deliverables": [
                        "Liquidity premium analysis report",
                        "Impact on bond pricing"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "Credit Risk Modeling",
              "id": "0.2.2",
              "children": [
                {
                  "name": "Credit Default Swaps (CDS)",
                  "id": "0.2.2.1",
                  "children": [
                    {
                      "name": "CDS Spread Analysis",
                      "id": "0.2.2.1.1",
                      "goal": "Analyze CDS spreads as indicators of credit risk.",
                      "data_sources": [
                        "CDS market data",
                        "Credit ratings",
                        "Company financial data"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Correlation analysis",
                        "Hazard rate modeling"
                      ],
                      "deliverables": [
                        "CDS spread analysis report",
                        "Credit risk assessment"
                      ]
                    },
                    {
                      "name": "Implied Default Probabilities",
                      "id": "0.2.2.1.2",
                      "goal": "Calculate implied default probabilities from CDS spreads.",
                      "data_sources": [
                        "CDS market data",
                        "Risk-free rates",
                        "Recovery rates"
                      ],
                      "methods": [
                        "Survival analysis",
                        "Hazard rate modeling",
                        "Bootstrapping techniques"
                      ],
                      "deliverables": [
                        "Implied default probability report",
                        "Comparison with credit ratings"
                      ]
                    },
                    {
                      "name": "CDS Index Performance",
                      "id": "0.2.2.1.3",
                      "goal": "Evaluate performance of CDS indices.",
                      "data_sources": [
                        "CDS index data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "CDS index performance report",
                        "Benchmarking analysis"
                      ]
                    }
                  ]
                },
                {
                  "name": "Structural Credit Models",
                  "id": "0.2.2.2",
                  "children": [
                    {
                      "name": "Merton Model",
                      "id": "0.2.2.2.1",
                      "goal": "Apply Merton model to assess credit risk.",
                      "data_sources": [
                        "Company asset values",
                        "Debt levels",
                        "Volatility data"
                      ],
                      "methods": [
                        "Option pricing theory",
                        "Monte Carlo simulation",
                        "Distance-to-default calculation"
                      ],
                      "deliverables": [
                        "Merton model credit risk assessment",
                        "Comparison with market data"
                      ]
                    },
                    {
                      "name": "KMV Model",
                      "id": "0.2.2.2.2",
                      "goal": "Apply KMV model to assess credit risk.",
                      "data_sources": [
                        "Company asset values",
                        "Debt levels",
                        "Volatility data"
                      ],
                      "methods": [
                        "Option pricing theory",
                        "Monte Carlo simulation",
                        "Distance-to-default calculation"
                      ],
                      "deliverables": [
                        "KMV model credit risk assessment",
                        "Comparison with market data"
                      ]
                    },
                    {
                      "name": "CreditMetrics",
                      "id": "0.2.2.2.3",
                      "goal": "Apply CreditMetrics model to assess portfolio credit risk.",
                      "data_sources": [
                        "Credit ratings",
                        "Transition matrices",
                        "Correlation data"
                      ],
                      "methods": [
                        "Monte Carlo simulation",
                        "Credit portfolio modeling",
                        "Risk aggregation"
                      ],
                      "deliverables": [
                        "CreditMetrics portfolio risk assessment",
                        "Scenario analysis"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Alternative Investments Analysis",
          "id": "0.3",
          "children": [
            {
              "name": "Hedge Fund Strategy Performance",
              "id": "0.3.1",
              "children": [
                {
                  "name": "Equity Hedge Funds",
                  "id": "0.3.1.1",
                  "children": [
                    {
                      "name": "Long/Short Equity Strategies",
                      "id": "0.3.1.1.1",
                      "goal": "Analyze performance of long/short equity hedge funds.",
                      "data_sources": [
                        "Hedge fund databases",
                        "Market data",
                        "Fund disclosures"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Factor analysis"
                      ],
                      "deliverables": [
                        "Long/short equity strategy report",
                        "Alpha generation analysis"
                      ]
                    },
                    {
                      "name": "Equity Market Neutral Strategies",
                      "id": "0.3.1.1.2",
                      "goal": "Evaluate performance of equity market neutral hedge funds.",
                      "data_sources": [
                        "Hedge fund databases",
                        "Market data",
                        "Fund disclosures"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Factor analysis"
                      ],
                      "deliverables": [
                        "Equity market neutral strategy report",
                        "Correlation analysis"
                      ]
                    },
                    {
                      "name": "Sector-Specific Equity Funds",
                      "id": "0.3.1.1.3",
                      "goal": "Assess performance of sector-specific equity hedge funds.",
                      "data_sources": [
                        "Hedge fund databases",
                        "Market data",
                        "Fund disclosures"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Factor analysis"
                      ],
                      "deliverables": [
                        "Sector-specific equity fund report",
                        "Sector allocation analysis"
                      ]
                    }
                  ]
                },
                {
                  "name": "Fixed Income Arbitrage",
                  "id": "0.3.1.2",
                  "children": [
                    {
                      "name": "Convertible Arbitrage",
                      "id": "0.3.1.2.1",
                      "goal": "Analyze performance of convertible arbitrage hedge funds.",
                      "data_sources": [
                        "Hedge fund databases",
                        "Market data",
                        "Fund disclosures"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Option pricing models"
                      ],
                      "deliverables": [
                        "Convertible arbitrage strategy report",
                        "Delta hedging analysis"
                      ]
                    },
                    {
                      "name": "Fixed Income Relative Value",
                      "id": "0.3.1.2.2",
                      "goal": "Evaluate performance of fixed income relative value hedge funds.",
                      "data_sources": [
                        "Hedge fund databases",
                        "Market data",
                        "Fund disclosures"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Yield curve analysis"
                      ],
                      "deliverables": [
                        "Fixed income relative value strategy report",
                        "Spread analysis"
                      ]
                    },
                    {
                      "name": "Mortgage-Backed Securities (MBS)",
                      "id": "0.3.1.2.3",
                      "goal": "Assess performance of MBS arbitrage hedge funds.",
                      "data_sources": [
                        "Hedge fund databases",
                        "Market data",
                        "Fund disclosures"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Prepayment modeling"
                      ],
                      "deliverables": [
                        "MBS arbitrage strategy report",
                        "Duration analysis"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "Private Equity Performance",
              "id": "0.3.2",
              "children": [
                {
                  "name": "Buyout Funds",
                  "id": "0.3.2.1",
                  "children": [
                    {
                      "name": "Vintage Year Analysis",
                      "id": "0.3.2.1.1",
                      "goal": "Analyze performance of buyout funds by vintage year.",
                      "data_sources": [
                        "Private equity databases",
                        "Fund disclosures",
                        "Industry reports"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Cash flow analysis"
                      ],
                      "deliverables": [
                        "Buyout fund vintage year report",
                        "IRR analysis"
                      ]
                    },
                    {
                      "name": "Geographic Focus",
                      "id": "0.3.2.1.2",
                      "goal": "Evaluate performance of buyout funds by geographic focus.",
                      "data_sources": [
                        "Private equity databases",
                        "Fund disclosures",
                        "Industry reports"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Cash flow analysis"
                      ],
                      "deliverables": [
                        "Buyout fund geographic focus report",
                        "Regional performance analysis"
                      ]
                    },
                    {
                      "name": "Sector Specialization",
                      "id": "0.3.2.1.3",
                      "goal": "Assess performance of buyout funds by sector specialization.",
                      "data_sources": [
                        "Private equity databases",
                        "Fund disclosures",
                        "Industry reports"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Cash flow analysis"
                      ],
                      "deliverables": [
                        "Buyout fund sector specialization report",
                        "Industry performance analysis"
                      ]
                    }
                  ]
                },
                {
                  "name": "Venture Capital Funds",
                  "id": "0.3.2.2",
                  "children": [
                    {
                      "name": "Early-Stage Investments",
                      "id": "0.3.2.2.1",
                      "goal": "Analyze performance of venture capital funds investing in early-stage companies.",
                      "data_sources": [
                        "Private equity databases",
                        "Fund disclosures",
                        "Industry reports"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Cash flow analysis"
                      ],
                      "deliverables": [
                        "Early-stage venture capital fund report",
                        "Exit analysis"
                      ]
                    },
                    {
                      "name": "Late-Stage Investments",
                      "id": "0.3.2.2.2",
                      "goal": "Evaluate performance of venture capital funds investing in late-stage companies.",
                      "data_sources": [
                        "Private equity databases",
                        "Fund disclosures",
                        "Industry reports"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Cash flow analysis"
                      ],
                      "deliverables": [
                        "Late-stage venture capital fund report",
                        "Growth analysis"
                      ]
                    },
                    {
                      "name": "Technology Sector Focus",
                      "id": "0.3.2.2.3",
                      "goal": "Assess performance of venture capital funds focused on the technology sector.",
                      "data_sources": [
                        "Private equity databases",
                        "Fund disclosures",
                        "Industry reports"
                      ],
                      "methods": [
                        "Return attribution",
                        "Risk analysis",
                        "Cash flow analysis"
                      ],
                      "deliverables": [
                        "Technology sector venture capital fund report",
                        "Innovation analysis"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Macroeconomic Impact on Asset Pricing",
          "id": "0.4",
          "children": [
            {
              "name": "Interest Rate Effects",
              "id": "0.4.1",
              "children": [
                {
                  "name": "Federal Reserve Policy",
                  "id": "0.4.1.1",
                  "children": [
                    {
                      "name": "Impact on Equity Valuations",
                      "id": "0.4.1.1.1",
                      "goal": "Analyze the impact of Federal Reserve interest rate policy on equity valuations.",
                      "data_sources": [
                        "Federal Reserve data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Event study analysis",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "Federal Reserve policy impact report",
                        "Valuation adjustments"
                      ]
                    },
                    {
                      "name": "Impact on Bond Yields",
                      "id": "0.4.1.1.2",
                      "goal": "Evaluate the impact of Federal Reserve interest rate policy on bond yields.",
                      "data_sources": [
                        "Federal Reserve data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Event study analysis",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "Federal Reserve policy impact report",
                        "Yield curve analysis"
                      ]
                    },
                    {
                      "name": "Impact on Credit Spreads",
                      "id": "0.4.1.1.3",
                      "goal": "Assess the impact of Federal Reserve interest rate policy on credit spreads.",
                      "data_sources": [
                        "Federal Reserve data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Event study analysis",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "Federal Reserve policy impact report",
                        "Credit risk assessment"
                      ]
                    }
                  ]
                },
                {
                  "name": "Global Interest Rate Differentials",
                  "id": "0.4.1.2",
                  "children": [
                    {
                      "name": "Currency Effects",
                      "id": "0.4.1.2.1",
                      "goal": "Analyze the impact of global interest rate differentials on currency exchange rates.",
                      "data_sources": [
                        "Central bank data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Carry trade analysis",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "Global interest rate differential report",
                        "Currency forecasts"
                      ]
                    },
                    {
                      "name": "Capital Flows",
                      "id": "0.4.1.2.2",
                      "goal": "Evaluate the impact of global interest rate differentials on capital flows.",
                      "data_sources": [
                        "Central bank data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Balance of payments analysis",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "Global interest rate differential report",
                        "Capital flow analysis"
                      ]
                    },
                    {
                      "name": "Emerging Market Vulnerabilities",
                      "id": "0.4.1.2.3",
                      "goal": "Assess the vulnerabilities of emerging markets to global interest rate changes.",
                      "data_sources": [
                        "Central bank data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Crisis prediction models",
                        "Correlation analysis"
                      ],
                      "deliverables": [
                        "Emerging market vulnerability report",
                        "Risk assessment"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "Inflation Dynamics",
              "id": "0.4.2",
              "children": [
                {
                  "name": "Inflation Expectations",
                  "id": "0.4.2.1",
                  "children": [
                    {
                      "name": "Survey Data Analysis",
                      "id": "0.4.2.1.1",
                      "goal": "Analyze survey data to assess inflation expectations.",
                      "data_sources": [
                        "Survey of Professional Forecasters",
                        "University of Michigan Consumer Survey",
                        "Inflation expectation surveys"
                      ],
                      "methods": [
                        "Time series analysis",
                        "Regression analysis",
                        "Sentiment analysis"
                      ],
                      "deliverables": [
                        "Inflation expectation report",
                        "Forecast accuracy analysis"
                      ]
                    },
                    {
                      "name": "Market-Based Measures",
                      "id": "0.4.2.1.2",
                      "goal": "Evaluate market-based measures of inflation expectations.",
                      "data_sources": [
                        "TIPS yields",
                        "Inflation swaps",
                        "Inflation options"
                      ],
                      "methods": [
                        "Break-even inflation rate analysis",
                        "Term structure modeling",
                        "Option pricing models"
                      ],
                      "deliverables": [
                        "Inflation expectation report",
                        "Comparison with survey data"
                      ]
                    },
                    {
                      "name": "Impact on Asset Allocation",
                      "id": "0.4.2.1.3",
                      "goal": "Assess the impact of inflation expectations on asset allocation decisions.",
                      "data_sources": [
                        "Survey data",
                        "Market data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Portfolio optimization",
                        "Scenario analysis",
                        "Risk-adjusted return analysis"
                      ],
                      "deliverables": [
                        "Asset allocation strategy report",
                        "Inflation-protected portfolio construction"
                      ]
                    }
                  ]
                },
                {
                  "name": "Supply Chain Disruptions",
                  "id": "0.4.2.2",
                  "children": [
                    {
                      "name": "Impact on Consumer Prices",
                      "id": "0.4.2.2.1",
                      "goal": "Analyze the impact of supply chain disruptions on consumer prices.",
                      "data_sources": [
                        "Supply chain data",
                        "Consumer price index data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Input-output analysis",
                        "Cost-push inflation modeling"
                      ],
                      "deliverables": [
                        "Supply chain disruption report",
                        "Inflation forecast adjustments"
                      ]
                    },
                    {
                      "name": "Impact on Producer Prices",
                      "id": "0.4.2.2.2",
                      "goal": "Evaluate the impact of supply chain disruptions on producer prices.",
                      "data_sources": [
                        "Supply chain data",
                        "Producer price index data",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Regression analysis",
                        "Input-output analysis",
                        "Cost-push inflation modeling"
                      ],
                      "deliverables": [
                        "Supply chain disruption report",
                        "Inflation forecast adjustments"
                      ]
                    },
                    {
                      "name": "Policy Responses",
                      "id": "0.4.2.2.3",
                      "goal": "Assess policy responses to supply chain-driven inflation.",
                      "data_sources": [
                        "Central bank statements",
                        "Government policies",
                        "Economic indicators"
                      ],
                      "methods": [
                        "Event study analysis",
                        "Policy impact assessment",
                        "Comparative analysis"
                      ],
                      "deliverables": [
                        "Policy response report",
                        "Inflation control strategy analysis"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }; 