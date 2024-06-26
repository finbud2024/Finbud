import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import yfinance as yf
import plotly.graph_objects as go
from plotly.subplots import make_subplots 
import pandas as pd
import numpy as np
from datetime import date, datetime, timedelta
import os.path
from functions import *

web = dash.Dash(external_stylesheets=['https://codepen.io/chriddyp/pen/bWLwgP.css'])

# Adding custom CSS
web.css.append_css({
    'external_url': 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
})

web.layout = html.Div([
    html.Div([
        html.Div([
            html.H1('Dashboard', style={'text-align': 'center','color': 'white'}, className="start"),
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
            # Left panel (Ticker 1)
            html.Div([
            dcc.Dropdown(id="dropdown_tickers", options=[
                {"label": "Apple Inc.", "value": "AAPL"},
                {"label": "Microsoft Corporation", "value": "MSFT"},
                {"label": "Amazon.com Inc.", "value": "AMZN"},
                {"label": "Tesla Inc.", "value": "TSLA"},
                {"label": "Alphabet Inc. (Google)", "value": "GOOGL"},
            ], placeholder='Select Stock', style={'width': '90%', 'margin': '0 auto 20px auto'}),
            html.Div([
                dcc.Graph(id="c_graph", style={'margin': '0 auto'}),  
                dcc.Graph(id="graphs", style={'margin': '0 auto'})  
            ], style={'width': '100%', 'text-align': 'center'}),
            html.H4('Past Trend vs. Future Projections', style={'text-align': 'center', 'margin-top': '30px'}),
            html.Div([
                html.Div([
                    html.H5('Closing Prices', style={'text-align': 'center'}),
                    dcc.Graph(id="gbm_graph", style={'margin': '0 auto'})  
                ], style={'width': '48%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([
                    html.H5('Daily Volatility (%)', style={'text-align': 'center'}),
                    dcc.Graph(id="garch_graph", style={'margin': '0 auto'})  
                ], style={'width': '48%', 'display': 'inline-block', 'float': 'right', 'text-align': 'center'}),
            ]),
            html.H4('Risk Ratios', style={'text-align': 'center', 'margin-top': '30px'}),
            html.Div([
                html.Div([html.H6("Alpha (NIFTY 50)"), html.Div(id="a_val")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([html.H6("Beta (NIFTY 50)"), html.Div(id="b_val")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([html.H6("Sharpe Ratio"), html.Div(id="sr_val")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([html.H6("Sortino Ratio"), html.Div(id="sor_val")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),

            ]),
            html.Div([html.H6("Standard Deviation"), html.Div(id="sd_val")], style={'text-align': 'center'}),
        ], className="six columns", style={'width': '48%', 'margin': '0 1%', 'padding': '20px', 'box-shadow': '0px 0px 10px rgba(0,0,0,0.1)', 'text-align': 'center'}),


                    # Right panel (Ticker 2)
        html.Div([
            dcc.Dropdown(id="dropdown_tickers2", options=[
                {"label": "Apple Inc.", "value": "AAPL"},
                {"label": "Microsoft Corporation", "value": "MSFT"},
                {"label": "Amazon.com Inc.", "value": "AMZN"},
                {"label": "Tesla Inc.", "value": "TSLA"},
                {"label": "Alphabet Inc. (Google)", "value": "GOOGL"},
            ], placeholder='Select Stock', style={'width': '90%', 'margin': '0 auto 20px auto'}),
            html.Div([
                dcc.Graph(id="c_graph2", style={'margin': '0 auto'}),  
                dcc.Graph(id="graphs2", style={'margin': '0 auto'})  
            ], style={'width': '100%', 'text-align': 'center'}),
            html.H4('Past Trend vs. Future Projections', style={'text-align': 'center', 'margin-top': '30px'}),
            html.Div([
                html.Div([
                    html.H5('Closing Prices', style={'text-align': 'center'}),
                    dcc.Graph(id="gbm_graph2", style={'margin': '0 auto'})  
                ], style={'width': '48%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([
                    html.H5('Daily Volatility (%)', style={'text-align': 'center'}),
                    dcc.Graph(id="garch_graph2", style={'margin': '0 auto'})  
                ], style={'width': '48%', 'display': 'inline-block', 'float': 'right', 'text-align': 'center'}),
            ]),
            html.H4('Risk Ratios', style={'text-align': 'center', 'margin-top': '30px'}),
            html.Div([
                html.Div([html.H6("Alpha (NIFTY 50)"), html.Div(id="a_val2")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([html.H6("Beta (NIFTY 50)"), html.Div(id="b_val2")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([html.H6("Sharpe Ratio"), html.Div(id="sr_val2")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),
                html.Div([html.H6("Sortino Ratio"), html.Div(id="sor_val2")], style={'width': '24%', 'display': 'inline-block', 'text-align': 'center'}),
            ]),
            html.Div([html.H6("Standard Deviation"), html.Div(id="sd_val2")], style={'text-align': 'center'}),
        ], className="six columns", style={'width': '48%', 'margin': '0 1%', 'padding': '20px', 'box-shadow': '0px 0px 10px rgba(0,0,0,0.1)', 'text-align': 'center'})
        ], className="row"),  # Close the div for the panels

        # Actionable Insights section
        html.Div([
            html.Div([
                html.H3('Actionable Insights for Ticker 1', style={'text-align': 'center'}),
                html.Div([
                    html.Div([
                        html.H5('Technical Indicators', style={'text-align': 'center'}),
                        html.Ul([
                            html.Li(id='bollinger_bands_insight1'),
                            html.Li(id='rsi_insight1'),
                            html.Li(id='sma_insight1'),
                            html.Li(id='ema_insight1'),
                            html.Li(id='macd_insight1'),
                        ], style={'padding-left': '20px'})
                    ], style={'width': '48%', 'display': 'inline-block', 'vertical-align': 'top'}),
                    html.Div([
                        html.H5('Risk Ratios', style={'text-align': 'center'}),
                        html.Ul([
                            html.Li(id='alpha_insight1'),
                            html.Li(id='beta_insight1'),
                            html.Li(id='sharpe_ratio_insight1'),
                            html.Li(id='sortino_ratio_insight1'),
                        ], style={'padding-left': '20px'})
                    ], style={'width': '48%', 'display': 'inline-block', 'vertical-align': 'top'}),
                ]),
            ], className="six columns", style={'width': '48%', 'margin': '0 1%', 'padding': '20px', 'box-shadow': '0px 0px 10px rgba(0,0,0,0.1)'}),

            html.Div([
                html.H3('Actionable Insights for Ticker 2', style={'text-align': 'center'}),
                html.Div([
                    html.Div([
                        html.H5('Technical Indicators', style={'text-align': 'center'}),
                        html.Ul([
                            html.Li(id='bollinger_bands_insight2'),
                            html.Li(id='rsi_insight2'),
                            html.Li(id='sma_insight2'),
                            html.Li(id='ema_insight2'),
                            html.Li(id='macd_insight2'),
                        ], style={'padding-left': '20px'})
                    ], style={'width': '48%', 'display': 'inline-block', 'vertical-align': 'top'}),
                    html.Div([
                        html.H5('Risk Ratios', style={'text-align': 'center'}),
                        html.Ul([
                            html.Li(id='alpha_insight2'),
                            html.Li(id='beta_insight2'),
                            html.Li(id='sharpe_ratio_insight2'),
                            html.Li(id='sortino_ratio_insight2'),
                        ], style={'padding-left': '20px'})
                    ], style={'width': '48%', 'display': 'inline-block', 'vertical-align': 'top'}),
                ]),
            ], className="six columns", style={'width': '48%', 'margin': '0 1%', 'padding': '20px', 'box-shadow': '0px 0px 10px rgba(0,0,0,0.1)'}),
        ], className="row"),
    ]),
])

beta_r = N50()
@web.callback(
    [Output("c_graph", "figure"),
     Output("graphs", "figure"),
     Output("a_val", "children"),
     Output("b_val", "children"),
     Output("sr_val", "children"),
     Output("sor_val", "children"),
     Output("sd_val", "children"),
     Output("gbm_graph", "figure"),
     Output("garch_graph", "figure"),
     Output("bollinger_bands_insight1", "children"),
     Output("rsi_insight1", "children"),
     Output("sma_insight1", "children"),
     Output("ema_insight1", "children"),
     Output("macd_insight1", "children"),
     Output("alpha_insight1", "children"),
     Output("beta_insight1", "children"),
     Output("sharpe_ratio_insight1", "children"),
     Output("sortino_ratio_insight1", "children"),
     Output("c_graph2", "figure"),
     Output("graphs2", "figure"),
     Output("a_val2", "children"),
     Output("b_val2", "children"),
     Output("sr_val2", "children"),
     Output("sor_val2", "children"),
     Output("sd_val2", "children"),
     Output("gbm_graph2", "figure"),
     Output("garch_graph2", "figure"),
     Output("bollinger_bands_insight2", "children"),
     Output("rsi_insight2", "children"),
     Output("sma_insight2", "children"),
     Output("ema_insight2", "children"),
     Output("macd_insight2", "children"),
     Output("alpha_insight2", "children"),
     Output("beta_insight2", "children"),
     Output("sharpe_ratio_insight2", "children"),
     Output("sortino_ratio_insight2", "children")],
    [Input("time_period", "value"),
     Input("dropdown_tickers", "value"),
     Input("indicators", "value"),
     Input("returns", "value"),
     Input("dropdown_tickers2", "value")]
)
def stock_prices(v, v2, v3, v4, v5):
    if v2 is None and v5 is None:
        raise dash.exceptions.PreventUpdate

    results = []

    # Process for ticker 1
    if v2 is not None:
        # Data fetching and processing for ticker 1
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

        df = MACD(df)
        df = RSI(df)
        df = BB(df)
        df = SMA(df, 50)
        df = SMA(df, 200)
        df = EMA(df, 20)

        fig = get_stock_price_fig(df.tail(time_period), v3, v4)

        current = df_data.iloc[-1][2]
        yesterday = df_data.iloc[-2][2]
        fig1 = change_graph(current, yesterday)

        df = df[['Date', 'Adj Close']]
        fig2 = gbm(df.tail(30))
        fig3 = garch(df.tail(30))

        # For ticker 1
        actionable_advice1 = {
            "bollinger_bands": bollinger_bands_insight(df),
            "rsi": rsi_insight(df),
            "sma": sma_insight(df),
            "ema": ema_insight(df),
            "macd": macd_insight(df),
            "alpha": comment_alpha(Alpha_Ratio, Beta_Ratio, v2),
            "beta": comment_beta(Beta_Ratio, v2),
            "sharpe_ratio": comment_sharpe_ratio(Sharpe_Ratio, v2),
            "sortino_ratio": comment_sortino_ratio(Sortino_Ratio, v2)
        }

        results.extend([fig1, fig, Alpha_Ratio, Beta_Ratio, Sharpe_Ratio, Sortino_Ratio, SD, fig2, fig3,
                        actionable_advice1['bollinger_bands'],
                        actionable_advice1['rsi'],
                        actionable_advice1['sma'],
                        actionable_advice1['ema'],
                        actionable_advice1['macd'],
                        actionable_advice1['alpha'],
                        actionable_advice1['beta'],
                        actionable_advice1['sharpe_ratio'],
                        actionable_advice1['sortino_ratio']])
    else:
        results.extend([dash.no_update] * 18)

    # Process for ticker 2
    if v5 is not None:
        # Data fetching and processing for ticker 2
        if os.path.exists(v5 + '.csv'):
            df2 = pd.read_csv(v5 + '.csv')
            now = datetime.now()
            today345pm = now.replace(hour=15, minute=45, second=0, microsecond=0)
            if df2['Date'].iloc[-1] != date.today().isoformat() and date.today().isoweekday() in range(1, 6) and now > today345pm:
                df2 = yf.download(v5, start='2020-01-01')
                df2.reset_index(inplace=True)
                df2.to_csv(v5 + '.csv')
        else:
            df2 = yf.download(v5, start='2020-01-01')
            df2.reset_index(inplace=True)
            df2.to_csv(v5 + '.csv')

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
        df_data2 = df2.tail(time_period)
        Alpha_Ratio2, Beta_Ratio2 = alpha_beta(beta_r2, df_data2)
        SD2 = round(df_data2['Adj Close'].std(), 2)
        Sharpe_Ratio2, Sortino_Ratio2 = sharpe_sortino(df_data2)

        df2 = MACD(df2)
        df2 = RSI(df2)
        df2 = BB(df2)
        df2 = SMA(df2, 50)
        df2 = SMA(df2, 200)
        df2 = EMA(df2, 20)

        fig4 = get_stock_price_fig(df2.tail(time_period), v3, v4)
        current2 = df_data2.iloc[-1][2]
        yesterday2 = df_data2.iloc[-2][2]
        fig5 = change_graph(current2, yesterday2)

        df2 = df2[['Date', 'Adj Close']]
        fig6 = gbm(df2.tail(30))
        fig7 = garch(df2.tail(30))

        # For ticker 2
        actionable_advice2 = {
            "bollinger_bands": bollinger_bands_insight(df2),
            "rsi": rsi_insight(df2),
            "sma": sma_insight(df2),
            "ema": ema_insight(df2),
            "macd": macd_insight(df2),
            "alpha": comment_alpha(Alpha_Ratio2, Beta_Ratio2, v5),
            "beta": comment_beta(Beta_Ratio2, v5),
            "sharpe_ratio": comment_sharpe_ratio(Sharpe_Ratio2, v5),
            "sortino_ratio": comment_sortino_ratio(Sortino_Ratio2, v5)
        }

        results.extend([fig5, fig4, Alpha_Ratio2, Beta_Ratio2, Sharpe_Ratio2, Sortino_Ratio2, SD2, fig6, fig7,
                        actionable_advice2['bollinger_bands'],
                        actionable_advice2['rsi'],
                        actionable_advice2['sma'],
                        actionable_advice2['ema'],
                        actionable_advice2['macd'],
                        actionable_advice2['alpha'],
                        actionable_advice2['beta'],
                        actionable_advice2['sharpe_ratio'],
                        actionable_advice2['sortino_ratio']])
    else:
        results.extend([dash.no_update] * 18)

    return results
web.run_server(debug=True, port=8080)
