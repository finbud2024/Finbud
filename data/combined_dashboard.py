import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import yfinance as yf
import pandas as pd
pd.options.mode.chained_assignment = None
from dash.exceptions import PreventUpdate
from datetime import date, timedelta, datetime
import plotly.graph_objects as go
from plotly.subplots import make_subplots 
import numpy as np
from arch import arch_model
from arch.__future__ import reindexing
import os.path

## Function for downloading/updating benchmark data
def N50():
    now = datetime.now()
    today345pm = now.replace(hour=15, minute=45, second=0, microsecond=0)
    if os.path.exists('benchmark.csv'):
        beta_r = pd.read_csv('benchmark.csv')
        if not beta_r.empty:
            last_date = beta_r['Date'].iloc[-1]
            if last_date != date.today().isoformat() and date.today().isoweekday() in range(1, 6) and now > today345pm:
                beta_r = yf.download('^NSEI', start='2020-01-01')
                beta_r.reset_index(inplace=True)
                beta_r.to_csv('benchmark.csv')
        else:
            beta_r = yf.download('^NSEI', start='2020-01-01')
            beta_r.reset_index(inplace=True)
            beta_r.to_csv('benchmark.csv')
    else:
        beta_r = yf.download('^NSEI', start='2020-01-01')
        beta_r.reset_index(inplace=True)
        beta_r.to_csv('benchmark.csv')
    return beta_r

## Functions for calculating SMA, EMA, MACD, RSI
def SMA(data, period = 100, column = 'Adj Close'):
        return data[column].rolling(window=period).mean()

def EMA(data, period = 20, column = 'Adj Close'):
        return data[column].ewm(span=period, adjust = False).mean()

def MACD(data, period_long = 26, period_short = 12, period_signal = 9, column = 'Adj Close'):
        shortEMA = EMA(data, period_short, column=column)
        longEMA = EMA(data, period_long, column=column)
        data['MACD'] = shortEMA - longEMA
        data['Signal_Line'] = EMA(data, period_signal, column = 'MACD')
        return data

def RSI(data, period = 14, column = 'Adj Close'):
        delta = data[column].diff(1)
        delta = delta[1:]
        up = delta.copy()
        down = delta.copy()
        up[up<0] = 0
        down[down>0] = 0
        data['up'] = up
        data['down'] = down
        avg_gain = SMA(data, period, column = 'up')
        avg_loss = abs(SMA(data, period, column = 'down'))
        RS = avg_gain/avg_loss
        RSI = 100.0 - (100.0/(1.0+RS))
        data['RSI'] = RSI
        return data

def BB(data):
        data['TP'] = (data['Adj Close'] + data['Low'] + data['High'])/3
        data['std'] = data['TP'].rolling(20).std(ddof=0)
        data['MA-TP'] = data['TP'].rolling(20).mean()
        data['BOLU'] = data['MA-TP'] + 2*data['std']
        data['BOLD'] = data['MA-TP'] - 2*data['std']
        return data

## Function for plotting Stock Prices, Volume, Indicators & Returns
def get_stock_price_fig(df,v2,v3):

        fig = make_subplots(rows=4, cols=1, shared_xaxes=True, vertical_spacing=0.05,
        row_width=[0.1,0.2,0.1, 0.3],subplot_titles=("", "", v2, v3 + ' %'))

        fig.add_trace(go.Candlestick(
                        x=df['Date'],
                        open=df['Open'],
                        high=df['High'],
                        low=df['Low'],
                        close=df['Adj Close'],showlegend = False, name = 'Price'),row=1,col=1)

        fig.add_trace(go.Bar(x=df['Date'], y=df['Volume'],opacity=0.5,showlegend = False, name = 'Volume'),
        row = 2, col= 1)

        # Indicators
        if v2=='RSI':
                fig.add_trace(go.Scatter(x = df['Date'], y=df['RSI'], mode="lines", name = 'RSI',
                marker=dict(color='rgb(31, 119, 180)'), showlegend = False),row = 3, col= 1)
                fig.layout.xaxis.showgrid=False
        elif v2=='SMA':
                fig.add_trace(go.Scatter(x = df['Date'], y=df['SMA_50'], mode="lines", name = 'SMA_50', 
                showlegend = False, marker=dict(color='rgb(31, 119, 180)')),row = 3, col= 1)
                fig.add_trace(go.Scatter(x = df['Date'], y=df['SMA_200'], mode="lines", name = 'SMA_200', 
                showlegend = False, marker=dict(color='#ff3333')),row = 3, col= 1)
                fig.layout.xaxis.showgrid=False
        elif v2=='EMA':
                fig.add_trace(go.Scatter(x = df['Date'], y=df['EMA'], mode="lines", name = 'EMA', 
                showlegend = False, marker=dict(color='rgb(31, 119, 180)')),row = 3, col= 1)
                fig.layout.xaxis.showgrid=False
        elif v2=='MACD':
                fig.add_trace(go.Scatter(x = df['Date'], y=df['MACD'], mode="lines",name = 'MACD', 
                showlegend = False, marker=dict(color='rgb(31, 119, 180)')),row = 3, col= 1)
                fig.add_trace(go.Scatter(x = df['Date'], y=df['Signal_Line'], mode="lines",name='Signal_Line', 
                showlegend = False, marker=dict(color='#ff3333')),row = 3, col= 1)
                fig.layout.xaxis.showgrid=False
        elif v2=='Bollinger Bands':
                fig.add_trace(go.Scatter(x = df['Date'], y=df['Adj Close'], mode="lines",
                line=dict(color='rgb(31, 119, 180)'),name = 'Close',showlegend = False),row = 3, col= 1) 
                fig.add_trace(go.Scatter(x = df['Date'], y=df['BOLU'],mode="lines", line=dict(width=0.5), 
                marker=dict(color="#89BCFD"),showlegend=False,name = 'Upper Band'),row = 3, col= 1)
                fig.add_trace(go.Scatter(x = df['Date'], y=df['BOLD'], mode="lines",line=dict(width=0.5),
                marker=dict(color="#89BCFD"),showlegend=False,fillcolor='rgba(56, 224, 56, 0.5)',fill='tonexty',name = 'Lower Band'),row = 3, col= 1)
                fig.layout.xaxis.showgrid=False        

        # Returns
        if v3=="Daily Returns":
                rets = df['Adj Close']/df['Adj Close'].shift(1) - 1
                fig.add_trace(go.Scatter(x = df['Date'], y=rets, mode="lines", showlegend = False, name = 'Daily Return', line=dict(color='#FF4136')),
                row = 4, col= 1,)
                fig.layout.xaxis.showgrid=False
        elif v3=="Cumulative Returns":
                rets = df['Adj Close']/df['Adj Close'].shift(1) - 1
                cum_rets = (rets + 1).cumprod()
                fig.add_trace(go.Scatter(x = df['Date'], y=cum_rets, mode="lines", showlegend = False, name = 'Cumulative Returns', line=dict(color='#FF4136')),
                row = 4, col=1)
                fig.layout.xaxis.showgrid=False

        fig.update(layout_xaxis_rangeslider_visible=False)
        fig.update_layout(margin=dict(b=0,t=0,l=0,r=0),plot_bgcolor='#ebf3ff',width=500, height=600, 
                        xaxis_showticklabels=True, xaxis4_showticklabels=False, xaxis3_showgrid = False, xaxis4_showgrid = False)
        fig.layout.xaxis.showgrid=False
        return fig

## Function for calculating Alpha & Beta ratio
def alpha_beta(benchmark, df):
        risk_free_rate = 0.04
        benchmark = benchmark[["Date", 'Adj Close']]
        benchmark['Date']= pd.to_datetime(benchmark['Date'])
        benchmark.columns = ['Date', "NIFTY"]
        benchmark = pd.merge(benchmark, df[['Date', 'Adj Close']], how='inner', on='Date')
        benchmark.columns = ['Date', 'NIFTY', 'Stock']
        benchmark['NIFTY Returns'] = benchmark['NIFTY'].pct_change(1).mul(100)
        benchmark['Stock Returns'] = benchmark['Stock'].pct_change(1).mul(100)
        benchmark['NIFTY Returns'] -= risk_free_rate
        benchmark['Stock Returns'] -= risk_free_rate
        benchmark.dropna(inplace=True)
        cov = np.cov(benchmark["Stock Returns"],benchmark["NIFTY Returns"])
        Beta_Ratio = cov[0,1]/cov[1,1]
        Alpha_Ratio = np.mean(benchmark["Stock Returns"]) - Beta_Ratio*np.mean(benchmark["NIFTY Returns"])
        return round(Alpha_Ratio*12,3), round(Beta_Ratio,2)

## Function for calculating Sharpe & Sortino Ratio
def sharpe_sortino(df):
        df['Normalized Returns'] = df['Adj Close']/df.iloc[0]['Adj Close']
        df['Daily Normalized Returns'] = df['Normalized Returns'].pct_change(1)
        Sharpe_Ratio = round((df['Daily Normalized Returns'].mean()/df['Daily Normalized Returns'].std())*(252**0.5),2)
        down_returns = df.loc[df['Daily Normalized Returns'] < 0]
        down_SD = down_returns['Daily Normalized Returns'].std()
        Sortino_Ratio = round((df['Daily Normalized Returns'].mean()/down_SD)*(252**0.5),2)
        return Sharpe_Ratio, Sortino_Ratio

## Function for calculating change
def change_graph(current, yesterday):
        fig = go.Figure(go.Indicator(mode="number+delta",value=current,
        delta={'reference': yesterday, 'relative': True,'valueformat':'.2%'}))

        fig.update_traces(delta_font={'size':15},number_font = {'size':40})
        fig.update_layout(height=100, margin=dict(b=10,t=20,l=100),)

        if current >= yesterday:
                fig.update_traces(delta_increasing_color='green')
        elif current < yesterday:
                fig.update_traces(delta_decreasing_color='red')
        return fig

## Function for simulation of prices using Geometric Brownian Modeling 
def gbm(df):

        end_date = date.today().isoformat()   
        pred_end_date = (date.today()+timedelta(days=30)).isoformat()
        df = df.reset_index(drop=True)
        returns = (df['Adj Close'] - df.shift(1)['Adj Close'])/df.shift(1)['Adj Close']

        # Assigning Parameters
        S = df.loc[df.shape[0]-1,'Adj Close']
        dt = 1
        trading_days = pd.date_range(start=pd.to_datetime(end_date,format='%Y-%m-%d') + 
                        pd.Timedelta('1 days'),
                        end=pd.to_datetime(pred_end_date,format='%Y-%m-%d')).to_series().map(lambda k:
                        1 if k.isoweekday() in range(1,6) else 0).sum()
        N = trading_days/dt
        t = np.arange(1,int(N)+1)
        mu = np.mean(returns)
        sd = np.std(returns)
        pred_no = 10
        b = {str(k): np.random.normal(0,1,int(N)) for k in range(1, pred_no+1)}
        W = {str(k): b[str(k)].cumsum() for k in range(1, pred_no+1)}

        # Drift & Diffusion 
        drift = (mu-0.5 * sd**2) * t
        diffusion = {str(k): sd*W[str(k)] for k in range(1, pred_no+1)}

        # Prediction Values
        Pred = np.array([S*np.exp(drift+diffusion[str(k)]) for k in range(1, pred_no+1)]) 
        Pred = np.hstack((np.array([[S] for k in range(pred_no)]), Pred))

        fig = go.Figure()
        for i in range(pred_no):
                fig.add_trace(go.Scatter(mode="lines",showlegend = False, line=dict(color='rgb(31, 119, 180)'),
                                x = df['Date'], y = df['Adj Close'],name = 'Close'))
                fig.add_trace(go.Scatter(mode="lines",showlegend = False,
                                x=pd.date_range(start=df['Date'].max(),
                                end = pred_end_date, freq='D').map(lambda k:
                                k if k.isoweekday() in range(1,6) else np.nan).dropna(),
                                y=Pred[i,:],name=str(i)))
                fig.layout.xaxis.showgrid=False   
                fig.update_layout(margin=dict(b=0,t=0,l=0,r=0),plot_bgcolor='#ebf3ff',width=500, height=300)

        return fig


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
    fig.layout.xaxis.showgrid=False
    fig.update_layout(margin=dict(b=0, t=0, l=0, r=0), plot_bgcolor='#ebf3ff', width=500, height=200)

    return fig


web = dash.Dash(external_stylesheets=['https://codepen.io/chriddyp/pen/bWLwgP.css'])

# Adding custom CSS
web.css.append_css({
    'external_url': 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
})

web.layout = html.Div([
    html.Div([
        html.Div([
            html.H1('Dashboard', style={'text-align': 'center'}, className="start"),
            html.H6("Time Period", style={'color': 'white'}),
            dcc.Dropdown(id="time_period", options=[
                {'label': '6 Months', 'value': '6m'},
                {'label': '1 year', 'value': '1y'},
                {'label': '3 years', 'value': '3y'},
                {'label': '5 years', 'value': '5y'},
            ], placeholder='Time Period', value='1y'),
            html.Br(),
            html.H6("Technical Indicators", style={'color': 'white'}),
            dcc.Dropdown(id="indicators", options=[
                {'label': 'RSI', 'value': 'RSI'},
                {'label': 'SMA', 'value': 'SMA'},
                {'label': 'EMA', 'value': 'EMA'},
                {'label': 'MACD', 'value': 'MACD'},
                {'label': 'Bollinger Bands', 'value': 'Bollinger Bands'}
            ], placeholder='Indicator', value='Bollinger Bands'),
            html.Br(),
            html.H6("Returns", style={'color': 'white'}),
            dcc.Dropdown(id="returns", options=[
                {'label': 'Daily Returns', 'value': 'Daily Returns'},
                {'label': 'Cumulative Returns', 'value': 'Cumulative Returns'}
            ], placeholder='Returns', value='Daily Returns'),
        ], className="animate__animated animate__fadeInLeft"),
    ], className="Navigation", style={'background-color': '#2b2b2b', 'padding': '20px', 'border-radius': '10px'}),
    html.Br(), html.Br(),
    html.Div([
        html.Div([
            dcc.Dropdown(id="dropdown_tickers", options=[
                {"label": "Apple Inc.", "value": "AAPL"},
                {"label": "Microsoft Corporation", "value": "MSFT"},
                {"label": "Amazon.com Inc.", "value": "AMZN"},
                {"label": "Tesla Inc.", "value": "TSLA"},
                {"label": "Alphabet Inc. (Google)", "value": "GOOGL"},
            ], placeholder='Select Stock', style={'width': '80%', 'margin': '0 auto'}),
            html.Div([], id="c_graph"),
            html.Div([], id="graphs"),
            html.Br(),
            html.H4('Past Trend vs. Future Projections', style={'text-align': 'center'}),
            html.H5('Closing Prices', style={'text-align': 'center'}),
            html.Div([], id="gbm_graph"),
            html.Br(),
            html.H5('Daily Volatility (%)', style={'text-align': 'center'}),
            html.Div([], id="garch_graph"),
            html.Br(),
            html.H4('Risk Ratios', style={'text-align': 'center'}),
            html.Div([
                html.Div([
                    html.H6("Alpha (NIFTY 50)"),
                    html.Div(id="a_val"),
                ], style={'width': '49%', 'display': 'inline-block'}),
                html.Div([
                    html.H6("Beta (NIFTY 50)"),
                    html.Div(id="b_val"),
                ], style={'width': '49%', 'display': 'inline-block'}),
            ]),
            html.Div([
                html.Div([
                    html.H6("Sharpe Ratio"),
                    html.Div(id="sr_val"),
                ], style={'width': '49%', 'display': 'inline-block'}),
                html.Div([
                    html.H6("Sortino Ratio"),
                    html.Div(id="sor_val"),
                ], style={'width': '49%', 'display': 'inline-block'}),
            ]),
            html.Div([
                html.H6("Standard Deviation"),
                html.Div(id="sd_val"),
            ]),
        ], id="main-content", className="panel animate__animated animate__fadeInUp"),
    ], className="Panel1", style={'width': '48%', 'display': 'inline-block', 'vertical-align': 'top', 'margin': '0 1%'}),
    html.Div([
        html.Div([
            dcc.Dropdown(id="dropdown_tickers2", options=[
                {"label": "Apple Inc.", "value": "AAPL"},
                {"label": "Microsoft Corporation", "value": "MSFT"},
                {"label": "Amazon.com Inc.", "value": "AMZN"},
                {"label": "Tesla Inc.", "value": "TSLA"},
                {"label": "Alphabet Inc. (Google)", "value": "GOOGL"},
            ], placeholder='Select Stock', style={'width': '80%', 'margin': '0 auto'}),
            html.Div([], id="c_graph2"),
            html.Div([], id="graphs2"),
            html.Br(),
            html.H4('Past Trend vs. Future Projections', style={'text-align': 'center'}),
            html.H5('Closing Prices', style={'text-align': 'center'}),
            html.Div([], id="gbm_graph2"),
            html.Br(),
            html.H5('Daily Volatility (%)', style={'text-align': 'center'}),
            html.Div([], id="garch_graph2"),
            html.Br(),
            html.H4('Risk Ratios', style={'text-align': 'center'}),
            html.Div([
                html.Div([
                    html.H6("Alpha (NIFTY 50)"),
                    html.Div(id="a_val2"),
                ], style={'width': '49%', 'display': 'inline-block'}),
                html.Div([
                    html.H6("Beta (NIFTY 50)"),
                    html.Div(id="b_val2"),
                ], style={'width': '49%', 'display': 'inline-block'}),
            ]),
            html.Div([
                html.Div([
                    html.H6("Sharpe Ratio"),
                    html.Div(id="sr_val2"),
                ], style={'width': '49%', 'display': 'inline-block'}),
                html.Div([
                    html.H6("Sortino Ratio"),
                    html.Div(id="sor_val2"),
                ], style={'width': '49%', 'display': 'inline-block'}),
            ]),
            html.Div([
                html.H6("Standard Deviation"),
                html.Div(id="sd_val2"),
            ]),
        ], id="main-content2", className="panel animate__animated animate__fadeInUp"),
    ], className="Panel2", style={'width': '48%', 'display': 'inline-block', 'vertical-align': 'top', 'margin': '0 1%'}),
    html.Br(),
    html.Div([
        html.H3('Interpretation', style={'text-align': 'center'}),
        html.H5('Technical indicators'),
        html.Li('Bollinger Bands is a measure of volatility. High volatility is signified by wide bands while low volatility is signified by narrow bands. Generally, high volatility is followed by low volatility'),
        html.Li('RSI or Relative Strength Index, is a measure to evaluate overbought and oversold conditions.'),
        html.Li('SMA or Simple Moving Average using 50 day (fast) and 200 day (slow) lines - short term going above long term is bullish trend. Short term going below long term is bearish'),
        html.Li('EMA or Exponential Moving Average gives higher significance to recent price data'),
        html.Li('MACD or Moving Average Convergence Divergence signifies no trend reversal unless there are crossovers. The market is bullish when signal line crosses above blue line, bearish when signal line crosses below blue line'),
        html.H5('Risk ratios'),
        html.Li('Alpha: Return performance as compared to benchmark of market'),
        html.Li('Beta: Relative price movement of a stock to go up and down as compared to the market trend'),
        html.Li('Sharpe Ratio: Returns generated per unit of risk - the higher the better'),
        html.Li('Sortino Ratio: Returns as compared to only downside risk'),
    ], className="Panels animate__animated animate__fadeInRight", style={'width': '80%', 'margin': '0 auto'})
], className="container")

beta_r = N50()

@web.callback(
    [Output("c_graph", "children"),
     Output("graphs", "children"),
     Output("a_val", "children"),
     Output("b_val", "children"),
     Output("sr_val", "children"),
     Output("sor_val", "children"),
     Output("sd_val", "children"),
     Output("gbm_graph", "children"),
     Output("garch_graph", "children")],
    [Input("time_period", "value"),
     Input("dropdown_tickers", "value"),
     Input("indicators", "value"),
     Input("returns", "value")]
)
def stock_prices(v, v2, v3, v4):
    if v2 is None:
        raise PreventUpdate

    if os.path.exists(v2 + '.csv'):
        df = pd.read_csv(v2 + '.csv')
        now = datetime.now()
        today345pm = now.replace(hour=15, minute=45, second=0, microsecond=0)
        if not df.empty and df['Date'].iloc[-1] != date.today().isoformat() and date.today().isoweekday() in range(1, 6) and now > today345pm:
            df = yf.download(v2, start='2020-01-01')
            df.reset_index(inplace=True)
            df.to_csv(v2 + '.csv')
    else:
        df = yf.download(v2, start='2020-01-01')
        df.reset_index(inplace=True)
        df.to_csv(v2 + '.csv')

    df = df.tail(1800)
    df['Date'] = pd.to_datetime(df['Date'])

    if v == '6m':
        time_period = 126
    elif v == '1y':
        time_period = 252
    elif v == '3y':
        time_period = 756
    elif v == '5y':
        time_period = 1800

    beta_r = pd.read_csv('benchmark.csv')
    beta_r = beta_r.tail(time_period)
    df_data = df.tail(time_period)
    Alpha_Ratio, Beta_Ratio = alpha_beta(beta_r, df_data)
    SD = round(df_data['Adj Close'].std(), 2)
    Sharpe_Ratio, Sortino_Ratio = sharpe_sortino(df_data)

    MACD(df)
    RSI(df)
    BB(df)
    df['SMA_50'] = SMA(df, 50)
    df['SMA_200'] = SMA(df, 200)
    df['EMA'] = EMA(df)

    fig = get_stock_price_fig(df.tail(time_period), v3, v4)
    current = df_data.iloc[-1][2]
    yesterday = df_data.iloc[-2][2]
    fig1 = change_graph(current, yesterday)

    df = df[['Date', 'Adj Close']]
    fig2 = gbm(df.tail(30))
    fig3 = garch(df.tail(30))

    return [dcc.Graph(figure=fig1, config={'displayModeBar': False}),
            dcc.Graph(figure=fig, config={'displayModeBar': False}),
            Alpha_Ratio,
            Beta_Ratio,
            Sharpe_Ratio,
            Sortino_Ratio,
            SD,
            dcc.Graph(figure=fig2, config={'displayModeBar': False}),
            dcc.Graph(figure=fig3, config={'displayModeBar': False})]

@web.callback(
    [Output("c_graph2", "children"),
     Output("graphs2", "children"),
     Output("a_val2", "children"),
     Output("b_val2", "children"),
     Output("sr_val2", "children"),
     Output("sor_val2", "children"),
     Output("sd_val2", "children"),
     Output("gbm_graph2", "children"),
     Output("garch_graph2", "children")],
    [Input("time_period", "value"),
     Input("dropdown_tickers2", "value"),
     Input("indicators", "value"),
     Input("returns", "value")]
)
def stock_prices2(v, v2, v3, v4):
    if v2 is None:
        raise PreventUpdate

    if os.path.exists(v2 + '.csv'):
        df2 = pd.read_csv(v2 + '.csv')
        now = datetime.now()
        today345pm = now.replace(hour=15, minute=45, second=0, microsecond=0)
        if df2['Date'].iloc[-1] != date.today().isoformat() and date.today().isoweekday() in range(1, 6) and now > today345pm:
            df2 = yf.download(v2, start='2020-01-01')
            df2.reset_index(inplace=True)
            df2.to_csv(v2 + '.csv')
    else:
        df2 = yf.download(v2, start='2020-01-01')
        df2.reset_index(inplace=True)
        df2.to_csv(v2 + '.csv')

    df2 = df2.tail(1800)
    df2['Date'] = pd.to_datetime(df2['Date'])

    if v == '6m':
        time_period = 126
    elif v == '1y':
        time_period = 252
    elif v == '3y':
        time_period = 756
    elif v == '5y':
        time_period = 1800

    beta_r2 = pd.read_csv('benchmark.csv')
    beta_r2 = beta_r2.tail(time_period)
    df_data = df2.tail(time_period)
    Alpha_Ratio, Beta_Ratio = alpha_beta(beta_r2, df_data)
    SD = round(df_data['Adj Close'].std(), 2)
    Sharpe_Ratio, Sortino_Ratio = sharpe_sortino(df_data)

    MACD(df2)
    RSI(df2)
    BB(df2)
    df2['SMA_50'] = SMA(df2, 50)
    df2['SMA_200'] = SMA(df2, 200)
    df2['EMA'] = EMA(df2)

    fig = get_stock_price_fig(df2.tail(time_period), v3, v4)
    current = df2.iloc[-1][2]
    yesterday = df2.iloc[-2][2]
    fig1 = change_graph(current, yesterday)

    df2 = df2[['Date', 'Adj Close']]
    fig2 = gbm(df2.tail(30))
    fig3 = garch(df2.tail(30))

    return [dcc.Graph(figure=fig1, config={'displayModeBar': False}),
            dcc.Graph(figure=fig, config={'displayModeBar': False}),
            Alpha_Ratio,
            Beta_Ratio,
            Sharpe_Ratio,
            Sortino_Ratio,
            SD,
            dcc.Graph(figure=fig2, config={'displayModeBar': False}),
            dcc.Graph(figure=fig3, config={'displayModeBar': False})]

web.run_server(debug=True, port=8051)
