import yfinance as yf
def fair_value(ticker):
    tick = yf.Ticker(ticker)
    market_cap = tick.info['marketCap']
    current_price = tick.info['currentPrice']
    # Assumptions:
    discount_rate = 0.05
    perpetual_growth_rate = 0.02
    growth_rate = 0.1
    years = [1,2,3,4,5]
    freecashflow = [99584] # Web scrape to get this
    futurefreecashflow = []
    terminalvalue = 99584*(1+perpetual_growth_rate)/(discount_rate - perpetual_growth_rate)
    terminalvaluediscounted = terminalvalue/(1+discount_rate)**5

    for year in years:
        cashflow = 99584 * (1+growth_rate)**year
        futurefreecashflow.append(cashflow)

    sum_5_yr = sum(futurefreecashflow)
    grand_total = sum_5_yr + terminalvaluediscounted

    fairvalue = (grand_total*10**6)*current_price/market_cap
    return(fairvalue)