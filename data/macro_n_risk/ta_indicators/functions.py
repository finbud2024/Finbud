import yfinance as yf
import plotly.graph_objects as go
from plotly.subplots import make_subplots 
import pandas as pd
pd.options.mode.chained_assignment = None 
import numpy as np
from datetime import date, timedelta, datetime
from arch import arch_model
import os.path

def N50():
    now = datetime.now()
    today345pm = now.replace(hour=15, minute=45, second=0, microsecond=0)
    if os.path.exists('benchmark.csv'):
        beta_r = pd.read_csv('benchmark.csv')
        if not beta_r.empty:
            last_date = beta_r['Date'].iloc[-1]
            if last_date != date.today().isoformat() and date.today().isoweekday() in range(1, 6) and now > today345pm:
                beta_r = yf.download('^NSEI', start='2020-01-01', progress=False)
                beta_r.reset_index(inplace=True)
                beta_r.to_csv('benchmark.csv')
        else:
            beta_r = yf.download('^NSEI', start='2020-01-01', progress=False)
            beta_r.reset_index(inplace=True)
            beta_r.to_csv('benchmark.csv')
    else:
        beta_r = yf.download('^NSEI', start='2020-01-01', progress=False)
        beta_r.reset_index(inplace=True)
        beta_r.to_csv('benchmark.csv')
    return beta_r

def check_columns(data, required_columns):
    for col in required_columns:
        if col not in data.columns:
            raise KeyError(f"Missing required column: {col}")

def SMA(data, period=100, column='Adj Close'):
    check_columns(data, [column])
    data[f'SMA_{period}'] = data[column].rolling(window=period).mean()
    return data

def EMA(data, period=20, column='Adj Close'):
    check_columns(data, [column])
    data[f'EMA_{period}'] = data[column].ewm(span=period, adjust=False).mean()
    return data

def MACD(data, period_long=26, period_short=12, period_signal=9, column='Adj Close'):
    check_columns(data, [column])
    shortEMA = EMA(data, period_short, column=column)[f'EMA_{period_short}']
    longEMA = EMA(data, period_long, column=column)[f'EMA_{period_long}']
    data['MACD'] = shortEMA - longEMA
    data['Signal_Line'] = EMA(data, period_signal, column='MACD')[f'EMA_{period_signal}']
    return data

def RSI(data, period=14, column='Adj Close'):
    check_columns(data, [column])
    delta = data[column].diff(1)
    delta = delta[1:]
    up = delta.copy()
    down = delta.copy()
    up[up < 0] = 0
    down[down > 0] = 0
    data['up'] = up
    data['down'] = down
    avg_gain = SMA(data, period, column='up')[f'SMA_{period}']
    avg_loss = abs(SMA(data, period, column='down')[f'SMA_{period}'])
    RS = avg_gain / avg_loss
    RSI = 100.0 - (100.0 / (1.0 + RS))
    data['RSI'] = RSI
    return data

def BB(data):
    required_columns = ['Adj Close', 'Low', 'High']
    check_columns(data, required_columns)
    data['TP'] = (data['Adj Close'] + data['Low'] + data['High']) / 3
    data['std'] = data['TP'].rolling(20).std(ddof=0)
    data['MA-TP'] = data['TP'].rolling(20).mean()
    data['BOLU'] = data['MA-TP'] + 2 * data['std']
    data['BOLD'] = data['MA-TP'] - 2 * data['std']
    return data

# Load data
df = yf.download('AAPL', start='2020-01-01')

## Function for plotting Stock Prices, Volume, Indicators & Returns
def get_stock_price_fig(df, v2, v3):
    fig = make_subplots(rows=4, cols=1, shared_xaxes=True, vertical_spacing=0.05,
                        row_width=[0.1, 0.2, 0.1, 0.3], subplot_titles=("", "", v2, v3 + ' %'))

    fig.add_trace(go.Candlestick(
                    x=df['Date'],
                    open=df['Open'],
                    high=df['High'],
                    low=df['Low'],
                    close=df['Adj Close'], showlegend=False, name='Price'), row=1, col=1)

    fig.add_trace(go.Bar(x=df['Date'], y=df['Volume'], opacity=0.5, showlegend=False, name='Volume'),
                  row=2, col=1)

    # Indicators
    if v2 == 'RSI':
        fig.add_trace(go.Scatter(x=df['Date'], y=df['RSI'], mode="lines", name='RSI',
                                 marker=dict(color='rgb(31, 119, 180)'), showlegend=False), row=3, col=1)
        fig.layout.xaxis.showgrid=False
    elif v2 == 'SMA':
        fig.add_trace(go.Scatter(x=df['Date'], y=df['SMA_50'], mode="lines", name='SMA_50',
                                 showlegend=False, marker=dict(color='rgb(31, 119, 180)')), row=3, col=1)
        fig.add_trace(go.Scatter(x=df['Date'], y=df['SMA_200'], mode="lines", name='SMA_200',
                                 showlegend=False, marker=dict(color='#ff3333')), row=3, col=1)
        fig.layout.xaxis.showgrid=False
    elif v2 == 'EMA':
        fig.add_trace(go.Scatter(x=df['Date'], y=df['EMA_20'], mode="lines", name='EMA_20',
                                 showlegend=False, marker=dict(color='rgb(31, 119, 180)')), row=3, col=1)
        fig.layout.xaxis.showgrid=False
    elif v2 == 'MACD':
        fig.add_trace(go.Scatter(x=df['Date'], y=df['MACD'], mode="lines", name='MACD',
                                 showlegend=False, marker=dict(color='rgb(31, 119, 180)')), row=3, col=1)
        fig.add_trace(go.Scatter(x=df['Date'], y=df['Signal_Line'], mode="lines", name='Signal_Line',
                                 showlegend=False, marker=dict(color='#ff3333')), row=3, col=1)
        fig.layout.xaxis.showgrid=False
    elif v2 == 'Bollinger Bands':
        fig.add_trace(go.Scatter(x=df['Date'], y=df['Adj Close'], mode="lines",
                                 line=dict(color='rgb(31, 119, 180)'), name='Close', showlegend=False), row=3, col=1)
        fig.add_trace(go.Scatter(x=df['Date'], y=df['BOLU'], mode="lines", line=dict(width=0.5),
                                 marker=dict(color="#89BCFD"), showlegend=False, name='Upper Band'), row=3, col=1)
        fig.add_trace(go.Scatter(x=df['Date'], y=df['BOLD'], mode="lines", line=dict(width=0.5),
                                 marker=dict(color="#89BCFD"), showlegend=False, fillcolor='rgba(56, 224, 56, 0.5)', fill='tonexty', name='Lower Band'), row=3, col=1)
        fig.layout.xaxis.showgrid=False        

    # Returns
    if v3 == "Daily Returns":
        rets = df['Adj Close'] / df['Adj Close'].shift(1) - 1
        fig.add_trace(go.Scatter(x=df['Date'], y=rets, mode="lines", showlegend=False, name='Daily Return', line=dict(color='#FF4136')),
                      row=4, col=1)
        fig.layout.xaxis.showgrid=False
    elif v3 == "Cumulative Returns":
        rets = df['Adj Close'] / df['Adj Close'].shift(1) - 1
        cum_rets = (rets + 1).cumprod()
        fig.add_trace(go.Scatter(x=df['Date'], y=cum_rets, mode="lines", showlegend=False, name='Cumulative Returns', line=dict(color='#FF4136')),
                      row=4, col=1)
        fig.layout.xaxis.showgrid=False

    fig.update(layout_xaxis_rangeslider_visible=False)
    fig.update_layout(margin=dict(b=0, t=0, l=0, r=0), plot_bgcolor='#ebf3ff', width=500, height=600,
                      xaxis_showticklabels=True, xaxis4_showticklabels=False, xaxis3_showgrid=False, xaxis4_showgrid=False)
    fig.layout.xaxis.showgrid=False
    return fig

## Function for calculating Alpha & Beta ratio
def alpha_beta(benchmark, df):
    risk_free_rate = 0.04
    benchmark = benchmark[["Date", 'Adj Close']]
    benchmark['Date'] = pd.to_datetime(benchmark['Date'])
    benchmark.columns = ['Date', "NIFTY"]
    benchmark = pd.merge(benchmark, df[['Date', 'Adj Close']], how='inner', on='Date')
    benchmark.columns = ['Date', 'NIFTY', 'Stock']
    benchmark['NIFTY Returns'] = benchmark['NIFTY'].pct_change(1).mul(100)
    benchmark['Stock Returns'] = benchmark['Stock'].pct_change(1).mul(100)
    benchmark['NIFTY Returns'] -= risk_free_rate
    benchmark['Stock Returns'] -= risk_free_rate
    benchmark.dropna(inplace=True)
    cov = np.cov(benchmark["Stock Returns"], benchmark["NIFTY Returns"])
    Beta_Ratio = cov[0, 1] / cov[1, 1]
    Alpha_Ratio = np.mean(benchmark["Stock Returns"]) - Beta_Ratio * np.mean(benchmark["NIFTY Returns"])
    return round(Alpha_Ratio * 12, 3), round(Beta_Ratio, 2)

## Function for calculating Sharpe & Sortino Ratio
def sharpe_sortino(df):
    df['Normalized Returns'] = df['Adj Close'] / df.iloc[0]['Adj Close']
    df['Daily Normalized Returns'] = df['Normalized Returns'].pct_change(1)
    Sharpe_Ratio = round((df['Daily Normalized Returns'].mean() / df['Daily Normalized Returns'].std()) * (252 ** 0.5), 2)
    down_returns = df.loc[df['Daily Normalized Returns'] < 0]
    down_SD = down_returns['Daily Normalized Returns'].std()
    Sortino_Ratio = round((df['Daily Normalized Returns'].mean() / down_SD) * (252 ** 0.5), 2)
    return Sharpe_Ratio, Sortino_Ratio

## Function for calculating change
def change_graph(current, yesterday):
    fig = go.Figure(go.Indicator(mode="number+delta", value=current,
                                 delta={'reference': yesterday, 'relative': True, 'valueformat': '.2%'}))

    fig.update_traces(delta_font={'size': 15}, number_font={'size': 40})
    fig.update_layout(height=100, margin=dict(b=10, t=20, l=100), )

    if current >= yesterday:
        fig.update_traces(delta_increasing_color='green')
    elif current < yesterday:
        fig.update_traces(delta_decreasing_color='red')
    return fig

## Function for simulation of prices using Geometric Brownian Modeling 
def gbm(df):

    end_date = date.today().isoformat()
    pred_end_date = (date.today() + timedelta(days=30)).isoformat()
    df = df.reset_index(drop=True)
    returns = (df['Adj Close'] - df.shift(1)['Adj Close']) / df.shift(1)['Adj Close']

    # Assigning Parameters
    S = df.loc[df.shape[0] - 1, 'Adj Close']
    dt = 1
    trading_days = pd.date_range(start=pd.to_datetime(end_date, format='%Y-%m-%d') +
                                 pd.Timedelta('1 days'),
                                 end=pd.to_datetime(pred_end_date, format='%Y-%m-%d')).to_series().map(lambda k:
                                                                                                         1 if k.isoweekday() in range(1, 6) else 0).sum()
    N = trading_days / dt
    t = np.arange(1, int(N) + 1)
    mu = np.mean(returns)
    sd = np.std(returns)
    pred_no = 10
    b = {str(k): np.random.normal(0, 1, int(N)) for k in range(1, pred_no + 1)}
    W = {str(k): b[str(k)].cumsum() for k in range(1, pred_no + 1)}

    # Drift & Diffusion 
    drift = (mu - 0.5 * sd ** 2) * t
    diffusion = {str(k): sd * W[str(k)] for k in range(1, pred_no + 1)}

    # Prediction Values
    Pred = np.array([S * np.exp(drift + diffusion[str(k)]) for k in range(1, pred_no + 1)])
    Pred = np.hstack((np.array([[S] for k in range(pred_no)]), Pred))

    fig = go.Figure()
    for i in range(pred_no):
        fig.add_trace(go.Scatter(mode="lines", showlegend=False, line=dict(color='rgb(31, 119, 180)'),
                                 x=df['Date'], y=df['Adj Close'], name='Close'))
        fig.add_trace(go.Scatter(mode="lines", showlegend=False,
                                 x=pd.date_range(start=df['Date'].max(),
                                                 end=pred_end_date, freq='D').map(lambda k:
                                                                                 k if k.isoweekday() in range(1, 6) else np.nan).dropna(),
                                 y=Pred[i, :], name=str(i)))
        fig.layout.xaxis.showgrid = False
        fig.update_layout(margin=dict(b=0, t=0, l=0, r=0), plot_bgcolor='#ebf3ff', width=500, height=300)

    return fig

## Function for forecasting volatility using GARCH model
def garch(df):
    pred_end_date = (date.today() + timedelta(days=30)).isoformat()
    df = df.reset_index(drop=True)
    df = df.set_index('Date')
    df['returns'] = df['Adj Close'].pct_change(1).mul(100)
    df['vola'] = df['returns'].abs()
    train_df = df.head(26)
    test_df = df.tail(5)

    garch_df = pd.DataFrame(df['returns'].shift(1).loc[df.index])
    garch_df.loc[train_df.index, 'returns'] = train_df['returns']

    model = arch_model(garch_df['returns'][1:], p=1, q=1, vol="GARCH", dist='normal')
    model_results = model.fit(last_obs=np.datetime64(test_df.index[0]), update_freq=5, disp='off')

    # Prediction Values
    forecasts = model_results.forecast(horizon=30, start=test_df.index[-1], method='simulation')
    forecasts = forecasts.variance.T ** 0.5

    fig = go.Figure()
    fig.add_trace(go.Scatter(mode='lines', showlegend=False, line=dict(color='rgb(31, 119, 180)'),
                             x=df.index,
                             y=df['vola'], name='Volatility'))
    fig.add_trace(go.Scatter(mode='lines', showlegend=False,
                             x=pd.date_range(start=test_df.index[-1], end=pd.to_datetime(pred_end_date, format='%Y-%m-%d')),
                             y=forecasts[test_df.index[-1]], name='Forecast'))
    fig.layout.xaxis.showgrid = False
    fig.update_layout(margin=dict(b=0, t=0, l=0, r=0), plot_bgcolor='#ebf3ff', width=500, height=200)

    return fig

## Functions for actionable insights comments
def comment_alpha(alpha, beta, stock):
    if alpha < -0.01:
        return f"{stock} is underperforming compared to the market. The {stock} returns haven't been as good as expected based on its beta and the market's performance. This means if the market returned 10%, and alpha value of {stock} is {alpha} with beta of {beta}. It is expected that {stock} to return {round(beta * 10 + alpha, 2)}%"
    elif -0.01 < alpha < 0.01:
        return f"Alpha = 0 in this case. This suggests the {stock} performance has been in line with expectations. The returns are what you would anticipate based on ONLY beta and the market's movement. It is expected that {stock} to return {beta * 10}% if the market returns 10%"
    elif alpha > 0.01:
        return f"{stock} is outperforming compared to the market. {stock} has delivered returns that are higher than what could be explained by its beta and the market movement. This means if the market returned 10%, and alpha value of {stock} is {alpha} with beta of {beta}. It is expected that {stock} to return {round(beta * 10 + alpha, 2)}%"

def comment_beta(beta, stock):
    if beta < 0:
        return f"Negative Beta: The price movement of {stock} tends to move in the opposite direction of the market."
    elif beta == 0:
        return f"Beta = 0: The price movement of {stock} is independent of the market, meaning that if NYSE increase 1%, then {stock} price will increase {beta}%"
    elif beta < 1:
        return f"Beta < 1: The price movement of {stock} tends to be less volatile than the market, meaning that if NYSE increase 1%, then {stock} price will increase {beta}%"
    elif beta == 1:
        return f"Beta = 1: The price movement of {stock} tends to move in line with the market, meaning that if NYSE increase 1%, then {stock} price will increase {beta}%"
    else:
        return f"Beta > 1: The price movement of {stock} tends to be more volatile than the market, meaning that if NYSE increase 1%, then {stock} price will increase {beta}%"

def comment_sharpe_ratio(sharpe, stock):
    if sharpe < 0:
        return f"The investment is generating returns lower than the risk-free rate and has a higher volatility (with a Sharpe ratio of {sharpe}). This is a very undesirable situation for investors, making the investment in {stock} is very risk for long-term."
    elif sharpe < 1:
        return f"The strategy for long and mid-term investment should not be considered, since {stock} shows sharpe of {sharpe} less than 1, indicates that it has many risks when comparing profit with volatility."
    elif sharpe > 1:
        return f"The Sharpe ratio in this case is good, signifying that the investment offers a good return relative to its risk. Long and mid-term strategy should be considered."

def comment_sortino_ratio(sortino, stock):
    if sortino < 1:
        return f"A low Sortino ratio ({sortino}) suggests you might not be getting enough return to compensate for the potential negative fluctuations in the investment's value. Becareful when taking risk in investing {stock}"
    elif sortino > 1:
        return f"This Sortino indicator is preferred. It indicates you're getting a good return for the amount of downside risk you're taking on."
    

def bollinger_bands_insight(df):
    if 'BOLU' not in df.columns or 'BOLD' not in df.columns or 'MA-TP' not in df.columns:
        return ""
    last_close = df['Adj Close'].iloc[-1]
    last_upper = df['BOLU'].iloc[-1]
    last_lower = df['BOLD'].iloc[-1]
    band_width = (last_upper - last_lower) / df['MA-TP'].iloc[-1]

    if last_close > last_upper:
        return f"The stock is trading above the upper Bollinger Band (${last_upper:.2f}), suggesting it might be overbought. Current band width is {band_width:.2%}, indicating {'high' if band_width > 0.1 else 'low'} volatility."
    elif last_close < last_lower:
        return f"The stock is trading below the lower Bollinger Band (${last_lower:.2f}), suggesting it might be oversold. Current band width is {band_width:.2%}, indicating {'high' if band_width > 0.1 else 'low'} volatility."
    else:
        return f"The stock is trading within the Bollinger Bands (${last_lower:.2f} - ${last_upper:.2f}). Current band width is {band_width:.2%}, indicating {'high' if band_width > 0.1 else 'low'} volatility."

def rsi_insight(df):
    if 'RSI' not in df.columns:
        return ""
    last_rsi = df['RSI'].iloc[-1]
    if last_rsi > 70:
        return f"RSI is currently at {last_rsi:.2f}, suggesting the stock might be overbought. Consider potential sell signals."
    elif last_rsi < 30:
        return f"RSI is currently at {last_rsi:.2f}, suggesting the stock might be oversold. This could present a buying opportunity."
    else:
        return f"RSI is currently at {last_rsi:.2f}, indicating neutral momentum."

def sma_insight(df):
    if 'SMA_50' not in df.columns or 'SMA_200' not in df.columns:
        return ""
    last_sma50 = df['SMA_50'].iloc[-1]
    last_sma200 = df['SMA_200'].iloc[-1]
    last_close = df['Adj Close'].iloc[-1]
    
    if last_sma50 > last_sma200 and last_close > last_sma50:
        return f"The 50-day SMA (${last_sma50:.2f}) is above the 200-day SMA (${last_sma200:.2f}), and the price is above both, indicating a strong bullish trend."
    elif last_sma50 < last_sma200 and last_close < last_sma50:
        return f"The 50-day SMA (${last_sma50:.2f}) is below the 200-day SMA (${last_sma200:.2f}), and the price is below both, indicating a strong bearish trend."
    else:
        return f"The price (${last_close:.2f}) is {'above' if last_close > last_sma50 else 'below'} the 50-day SMA (${last_sma50:.2f}) and {'above' if last_close > last_sma200 else 'below'} the 200-day SMA (${last_sma200:.2f}), suggesting a {'bullish' if last_close > last_sma200 else 'bearish'} bias."

def ema_insight(df):
    if 'EMA' not in df.columns:
        return ""
    last_ema = df['EMA'].iloc[-1]
    last_close = df['Adj Close'].iloc[-1]
    
    if last_close > last_ema:
        return f"The stock price (${last_close:.2f}) is above the EMA (${last_ema:.2f}), suggesting a bullish trend."
    else:
        return f"The stock price (${last_close:.2f}) is below the EMA (${last_ema:.2f}), suggesting a bearish trend."

def macd_insight(df):
    if 'MACD' not in df.columns or 'Signal_Line' not in df.columns:
        return ""
    last_macd = df['MACD'].iloc[-1]
    last_signal = df['Signal_Line'].iloc[-1]
    
    if last_macd > last_signal:
        return f"The MACD ({last_macd:.2f}) is above the signal line ({last_signal:.2f}), indicating a bullish trend."
    else:
        return f"The MACD ({last_macd:.2f}) is below the signal line ({last_signal:.2f}), indicating a bearish trend."
