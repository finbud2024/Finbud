import dash_bootstrap_components as dbc
from dash import Dash, html, State, callback, Output, Input, dcc
from dash.exceptions import PreventUpdate
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px

df = pd.read_excel("D:/Work/FinBud/all_tickers_NYSE.xlsx")
df = df.dropna(axis=0).reset_index(drop=True)
x_axis = ['P/E', 'P/B']
app = Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP, dbc.icons.FONT_AWESOME])

industry_options = df['industry'].unique()
ticker_options = df['ticker_symbol']
app.layout = html.Div([
    html.Div(html.H1("Personal Stock Porfolio Dashboard", 
             style={ "text-align": "center",
             "background-color": "rgb(5, 12, 156)",
             "color": "white", "height": "75px", "font-size": "50px"}),
             style={"padding": "5px", "align-items": "center"}),
    html.Div(html.H2("Current Holding", 
             style={"text-align": "left",
                    "background-color": "rgb(53, 114, 239)",
                    "color": "white", "height": "40px", "font-size": "25px"})),
    dbc.Container([
    # Header 1: Individual stocks
    dbc.Row([
        dbc.Col([html.Div([
            html.P('Stock (Exchange:Ticker)',
                   className = 'format_text',
                   style={'color': 'rgb(53, 114, 239)',
                          "font-weight": "bold"})
                   ], className = 'industry_label')], width = 2),
        dbc.Col([html.Div([
            html.P('Industry',
                   className = 'format_text',
                   style={'color': 'rgb(53, 114, 239)',
                          "font-weight": "bold"})
                   ], className = 'industry_label')], width = 2),
        dbc.Col([html.Div([
            html.P('Units',
                   className = 'format_text',
                   style={'color': 'rgb(53, 114, 239)',
                          "font-weight": "bold"})
                   ], className = 'units_label')], width = 1),
        dbc.Col([html.Div([
            html.P('Current Price',
                   className = 'format_text',
                   style={'color': 'rgb(53, 114, 239)',
                          "font-weight": "bold"})
            ], className = 'price_label')], width = 1),
        dbc.Col([html.Div([
            html.P("Today change",
                   className = 'format_text',
                   style={'color': 'rgb(53, 114, 239)',
                          "font-weight": "bold"})
            ], className = 'price_label')], width = 1),
        dbc.Col([html.Div([
            html.P('Gain/ Loss',
                   className = 'format_text',
                   style={'color': 'rgb(53, 114, 239)',
                          "font-weight": "bold"})
            ], className = 'price_label')], width = 1),
        dbc.Col([html.Div([
            html.P('Bollinger Bands over 12 months',
                   className = 'format_text',
                   style={'color': 'rgb(53, 114, 239)',
                          "font-weight": "bold"})
            ], className = 'price_label')], width = 4),
        html.Hr(className = 'top_border'),
        dbc.Col([
        dcc.Dropdown(
            id="pick_ticker1",
            options=[{'label':i, 'value':i, 'search':i} for i in ticker_options],
            value=industry_options[0],
            style={'width': '60%', 'margin-top': '10px'}),
        dcc.Dropdown(
            id="pick_ticker2",
            options=[{'label':i, 'value':i, 'search':i} for i in ticker_options],
            style={'width': '60%', 'margin-top': '20px'}),
        dcc.Dropdown(
            id="pick_ticker3",
            options=[{'label':i, 'value':i, 'search':i} for i in ticker_options],
            style={'width': '60%', 'margin-top': '20px'}),
        dcc.Dropdown(
            id="pick_ticker4",
            options=[{'label':i, 'value':i, 'search':i} for i in ticker_options],
            style={'width': '60%', 'margin-top': '20px'})
        ], width = 2),
        dbc.Col([
        html.Div([
            html.Div(id = 'pick_industry1',
                     style = {'margin-top': '10px'}),
            html.Div(id = 'pick_industry2',
                     style = {'margin-top': '20px'}),
            html.Div(id = 'pick_industry3',
                     style = {'margin-top': '20px'})
        ])
        ], width = 2),
        dbc.Col([
        html.Div([
            html.Div("blank",
                     style = {'margin-top': '10px'}),
            html.Div("bank",
                     style = {'margin-top': '20px'}),
            html.Div("blank",
                     style = {'margin-top': '20px'})
            ])
        ], width = 1),
        dbc.Col([
        html.Div([
            html.Div(id = 'price_stock1',
                     style = {'margin-top': '10px'}),
            html.Div(id = 'price_stock2',
                     style = {'margin-top': '20px'}),
            html.Div(id = 'price_stock3',
                     style = {'margin-top': '20px'})
            ])
        ], width = 1),
        dbc.Col([
        html.Div([
            html.Div(id = 'price_change1',
                     style = {'margin-top': '10px'}),
            html.Div(id = 'price_change2',
                     style = {'margin-top': '20px'}),
            html.Div(id = 'price_change3',
                     style = {'margin-top': '20px'})
            ])
        ], width = 1),
        dbc.Col([
        html.Div([
            html.Div("bank",
                     style = {'margin-top': '10px'}),
            html.Div("blank",
                     style = {'margin-top': '20px'}),
            html.Div("blank",
                     style = {'margin-top': '20px'})
            ])
        ], width = 1),
        dbc.Col([
            dcc.Graph(id="bb1", style={'width': '100%', 'height': '30vh'}, 
                      config={'displayModeBar': False}),
            dcc.Graph(id="bb2", style={'width': '100%', 'height': '30vh'}, 
                      config={'displayModeBar': False}),
            dcc.Graph(id="bb3", style={'width': '100%', 'height': '30vh'}, config={'displayModeBar': False}),
            dcc.Graph(id="bb4", style={'width': '100%', 'height': '30vh'}, config={'displayModeBar': False}),
              ], width = 4, className='no-padding')
        ])
], fluid = True),      
    # Header 2: Industry
    html.Div([
        html.H2(
            "Portfolio By Industry",
            style={
                "text_align": "left",
                "background-color": "rgb(53, 114, 239)",
                "color": "white",
                "height": "40px",
                "font-size": "25px",
                "line-height": "40px",  # Match line height with height
                "width": "100%",
                "text-align": "left"}
    )
        ]),
    dbc.Container([
    dbc.Row([
        dbc.Col([
            html.Div([
                html.P("Comparison Stocks in the Industry Map",
                       className = 'format_text',
                       style={'color': 'rgb(53, 114, 239)',
                       "font-weight": "bold"}) 
                       ], className = 'industry_comparison')]),
        dbc.Col([
            html.Div([
                html.P("Watch List",
                       className = 'format_text',
                       style={'color': 'rgb(53, 114, 239)',
                              "font-weight": "bold"}) 
                       ], className = 'industry_comparison')]),
        html.Hr(className = 'top_border'),
            dcc.Dropdown(
                id="pick-indsutry",
                options=[{'label':i, 'value':i, 'search':i} for i in industry_options],
                value=industry_options[0], 
                style={'width': '49%', 'display': 'inline-block'}
                ),
            dcc.Graph(id="bubble"),
            html.Div([
                html.Span("Pick yor x-axis", style={'marginRight': '7px'}),
                dcc.Dropdown(
                    id="x-axis",
                    options=[{'label':i, 'value':i, 'search':i} for i in x_axis],
                    clearable=False,
                    value=x_axis[0],
                    style={'width': '30%'},
                    className='dropdown-with-caret')
                ])
            ]),
        dbc.Col([
            dcc.Graph(id="candle1"),
            dcc.Graph(id="candle2")
            ])
        ], fluid = True)

])

@callback(Output('pick_industry1', 'children'),
         [Input('pick_ticker1', 'value')])
def update_industry1(pick_ticker1):
    if pick_ticker1 is None:
        raise PreventUpdate
    else:
        industry1 = df[df['ticker_symbol'] == pick_ticker1]['industry'].iloc[0]
        return industry1
    
@callback(Output('pick_industry2', 'children'),
          [Input('pick_ticker2', 'value')])
def update_industry2(pick_ticker2):
    if pick_ticker2 is None:
        raise PreventUpdate
    else:
        industry2 = df[df['ticker_symbol'] == pick_ticker2]['industry'].iloc[0]
        return industry2

@callback(Output('pick_industry3', 'children'),
          [Input('pick_ticker3', 'value')])
def update_industry3(pick_ticker3):
    if pick_ticker3 is None:
        raise PreventUpdate
    else:
        industry3 = df[df['ticker_symbol'] == pick_ticker3]['industry'].iloc[0]
        return industry3
    
@callback(Output('price_stock1', 'children'),
          [Input('pick_ticker1', 'value')])
def update_price1(pick_ticker1):
    if pick_ticker1 is None:
        raise PreventUpdate
    else:
        price_stock1 = yf.download(pick_ticker1, period="1d")
        today_close = price_stock1["Close"].iloc[0]
        formatted_price = "${:,.2f}".format(today_close)
        return formatted_price

@callback(Output('price_stock2', 'children'),
          [Input('pick_ticker2', 'value')])
def update_price2(pick_ticker2):
    if pick_ticker2 is None:
        raise PreventUpdate
    else:
        price_stock2 = yf.download(pick_ticker2, period="1d")
        today_close = price_stock2["Close"].iloc[0]
        formatted_price = "${:,.2f}".format(today_close)
        return formatted_price

@callback(Output('price_stock3', 'children'),
          [Input('pick_ticker3', 'value')])
def update_price3(pick_ticker3):
    if pick_ticker3 is None:
        raise PreventUpdate
    else:
        price_stock3 = yf.download(pick_ticker3, period="1d")
        today_close = price_stock3["Close"].iloc[0]
        formatted_price = "${:,.2f}".format(today_close)
        return formatted_price

@callback(Output('price_change1', 'children'),
          [Input('pick_ticker1', 'value')])
def update_change1(pick_change1):
    if pick_change1 is None:
        raise PreventUpdate
    else:
        price_change1 = yf.download(pick_change1, period="5d")
        today_close = price_change1["Close"].iloc[-1]
        yesterday_close = price_change1["Close"].iloc[-2]
        percentage_change = ((today_close-yesterday_close) / yesterday_close) * 100
        if percentage_change > 0:
            return html.Div([
                    html.P('+{0:,.2f}%'.format(percentage_change),
                           style={'color': 'green'}),
                    #html.I(className="fas fa-caret-up", style={'margin-left': '5px'})
                    ])
        elif percentage_change < 0:
            return html.Div([
                html.Span(
                    html.P('{0:,.2f}%'.format(percentage_change),
                           style={'color': 'red'})
                    )])
        elif percentage_change == 0:
            return html.Div([
                       html.P('{0:,.2f}%'.format(percentage_change),
                       className = 'indicator2'),
                       ], className = 'value_indicator_row')

@callback(Output('price_change2', 'children'),
          [Input('pick_ticker2', 'value')])
def update_change2(pick_change2):
    if pick_change2 is None:
        raise PreventUpdate
    else:
        price_change2 = yf.download(pick_change2, period="5d")
        today_close = price_change2["Close"].iloc[-1]
        yesterday_close = price_change2["Close"].iloc[-2]
        percentage_change = ((today_close-yesterday_close) / yesterday_close) * 100
        if percentage_change > 0:
            return html.Div([
                html.P('+{0:,.2f}%'.format(percentage_change),
                       style={'color': 'green'})
                    ])
        elif percentage_change < 0:
            return html.Div([
                html.Span( 
                    html.P('{0:,.2f}%'.format(percentage_change),
                           style={'color': 'red'})
                    )])
        elif percentage_change == 0:
            return html.Div([
                       html.P('{0:,.2f}%'.format(percentage_change),
                       className = 'indicator2'),
                       ], className = 'value_indicator_row')
        
@callback(Output('price_change3', 'children'),
          [Input('pick_ticker3', 'value')])
def update_change3(pick_change3):
    if pick_change3 is None:
        raise PreventUpdate
    else:
        price_change3 = yf.download(pick_change3, period="5d")
        today_close = price_change3["Close"].iloc[-1]
        yesterday_close = price_change3["Close"].iloc[-2]
        percentage_change = ((today_close-yesterday_close) / yesterday_close) * 100
        if percentage_change > 0:
            return html.Div([
                html.P('+{0:,.2f}%'.format(percentage_change),
                       style={'color': 'green'})
                    ])
        elif percentage_change < 0:
            return html.Div([
                html.Span( 
                    html.P('{0:,.2f}%'.format(percentage_change),
                           style={'color': 'red'})
                    )])
        elif percentage_change == 0:
            return html.Div([
                       html.P('{0:,.2f}%'.format(percentage_change),
                       className = 'indicator2'),
                       ], className = 'value_indicator_row')
      
@callback(Output('bb1', 'figure'),
          [Input('pick_ticker1', 'value')])
def bb1(pick_ticker1):
    if pick_ticker1 is None:
        raise PreventUpdate
    else:
    # Create df from chosen ticker
        data = yf.download(pick_ticker1,start='2024-01-01')
        data = data.reset_index()
        data['TP'] = (data['Adj Close'] + data['Low'] + data['High'])/3
        data['std'] = data['TP'].rolling(20).std(ddof=0)
        data['MA-TP'] = data['TP'].rolling(20).mean()
        data['BOLU'] = data['MA-TP'] + 2*data['std']
        data['BOLD'] = data['MA-TP'] - 2*data['std']
        
        fig = go.Figure(
            data = [
                go.Scatter(x = data['Date'], 
                           y=data['Adj Close'], 
                           mode="lines",
                           line=dict(color='rgb(31, 119, 180)'),
                           name = 'Close',showlegend = False),
                go.Scatter(x = data['Date'], 
                           y=data['BOLU'],
                           mode="lines", 
                           line=dict(width=0.5), 
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           name = 'Upper Band'),
                go.Scatter(x = data['Date'], 
                           y=data['BOLD'], 
                           mode="lines",
                           line=dict(width=0.5),
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           fillcolor='rgba(56, 224, 56, 0.5)',
                           fill='tonexty',name = 'Lower Band')]
        )
        return fig
    
@callback(Output('bb2', 'figure'),
          [Input('pick_ticker2', 'value')])
def bb2(pick_ticker2):
    if pick_ticker2 is None:
        raise PreventUpdate
    else:
    # Create df from chosen ticker
        data = yf.download(pick_ticker2,start='2024-01-01')
        data = data.reset_index()
        data['TP'] = (data['Adj Close'] + data['Low'] + data['High'])/3
        data['std'] = data['TP'].rolling(20).std(ddof=0)
        data['MA-TP'] = data['TP'].rolling(20).mean()
        data['BOLU'] = data['MA-TP'] + 2*data['std']
        data['BOLD'] = data['MA-TP'] - 2*data['std']
        
        fig = go.Figure(
            data = [
                go.Scatter(x = data['Date'], 
                           y=data['Adj Close'], 
                           mode="lines",
                           line=dict(color='rgb(31, 119, 180)'),
                           name = 'Close',showlegend = False),
                go.Scatter(x = data['Date'], 
                           y=data['BOLU'],
                           mode="lines", 
                           line=dict(width=0.5), 
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           name = 'Upper Band'),
                go.Scatter(x = data['Date'], 
                           y=data['BOLD'], 
                           mode="lines",
                           line=dict(width=0.5),
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           fillcolor='rgba(56, 224, 56, 0.5)',
                           fill='tonexty',name = 'Lower Band')]
        )
        return fig

@callback(Output('bb3', 'figure'),
          [Input('pick_ticker3', 'value')])
def bb3(pick_ticker3):
    if pick_ticker3 is None:
        raise PreventUpdate
    else:
    # Create df from chosen ticker
        data = yf.download(pick_ticker3,start='2024-01-01')
        data = data.reset_index()
        data['TP'] = (data['Adj Close'] + data['Low'] + data['High'])/3
        data['std'] = data['TP'].rolling(20).std(ddof=0)
        data['MA-TP'] = data['TP'].rolling(20).mean()
        data['BOLU'] = data['MA-TP'] + 2*data['std']
        data['BOLD'] = data['MA-TP'] - 2*data['std']
        
        fig = go.Figure(
            data = [
                go.Scatter(x = data['Date'], 
                           y=data['Adj Close'], 
                           mode="lines",
                           line=dict(color='rgb(31, 119, 180)'),
                           name = 'Close',showlegend = False),
                go.Scatter(x = data['Date'], 
                           y=data['BOLU'],
                           mode="lines", 
                           line=dict(width=0.5), 
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           name = 'Upper Band'),
                go.Scatter(x = data['Date'], 
                           y=data['BOLD'], 
                           mode="lines",
                           line=dict(width=0.5),
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           fillcolor='rgba(56, 224, 56, 0.5)',
                           fill='tonexty',name = 'Lower Band')]
        )
        return fig

@callback(Output('bb4', 'figure'),
          [Input('pick_ticker4', 'value')])
def bb4(pick_ticker4):
    if pick_ticker4 is None:
        raise PreventUpdate
    else:
    # Create df from chosen ticker
        data = yf.download(pick_ticker4,start='2024-01-01')
        data = data.reset_index()
        data['TP'] = (data['Adj Close'] + data['Low'] + data['High'])/3
        data['std'] = data['TP'].rolling(20).std(ddof=0)
        data['MA-TP'] = data['TP'].rolling(20).mean()
        data['BOLU'] = data['MA-TP'] + 2*data['std']
        data['BOLD'] = data['MA-TP'] - 2*data['std']
        
        fig = go.Figure(
            data = [
                go.Scatter(x = data['Date'], 
                           y=data['Adj Close'], 
                           mode="lines",
                           line=dict(color='rgb(31, 119, 180)'),
                           name = 'Close',showlegend = False),
                go.Scatter(x = data['Date'], 
                           y=data['BOLU'],
                           mode="lines", 
                           line=dict(width=0.5), 
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           name = 'Upper Band'),
                go.Scatter(x = data['Date'], 
                           y=data['BOLD'], 
                           mode="lines",
                           line=dict(width=0.5),
                           marker=dict(color="#89BCFD"),
                           showlegend=False,
                           fillcolor='rgba(56, 224, 56, 0.5)',
                           fill='tonexty',name = 'Lower Band')]
        )
        return fig
@callback(Output('candle1', 'figure'),
          [Input('pick_ticker1', 'value')])
def candle_1(pick_ticker1):    
    if pick_ticker1 is None:
        raise PreventUpdate
    else:
        data = yf.download(pick_ticker1, start='2024-01-01')
        data=data.reset_index()
        data['Date']= pd.to_datetime(data['Date'])
        candle1 = go.Candlestick(
                        x=data['Date'],
                        open=data['Open'],
                        high=data['High'],
                        low=data['Low'],
                        close=data['Adj Close'],showlegend = False, name = 'Price')
    figure = {'data': [candle1]}
    return figure

@callback(Output('candle2', 'figure'),
          [Input('pick_ticker2', 'value')])
def candle_2(pick_ticker2):    
    if pick_ticker2 is None:
        raise PreventUpdate
    else:
        data = yf.download(pick_ticker2, start='2024-01-01')
        data = data.reset_index()
        candle2 = go.Candlestick(
                        x=data['Date'],
                        open=data['Open'],
                        high=data['High'],
                        low=data['Low'],
                        close=data['Adj Close'],showlegend = False, name = 'Price')
    figure = {'data': [candle2]}
    return figure

@callback(
    Output("bubble", "figure"),
    [Input("pick-indsutry", "value"),
     Input("x-axis", "value")]
)


# Graph
def update_chart(chosen_industry, x_axis):
     grouped_df = df.groupby('industry')
     filtered_df = grouped_df.get_group(chosen_industry)
     # Extract and format data for bubble chart
     stock_options = filtered_df['ticker_symbol'].tolist()
     # Fetch the data from Yahoo Finance
     data = {stock: yf.Ticker(stock) for stock in stock_options}    
     # Create a dataframe to store the financial ratios
     financial_ratios = pd.DataFrame(columns=[
     'Ticker', 'Market Cap', 'P/E', 'P/B', 'EPS'
     ])
     
     # Calculate the financial ratios for each stock
     for ticker in stock_options:
         stock = data[ticker]
         market_cap = stock.info.get('marketCap', None)
         trading_volume = stock.info.get('averageVolume', None)
         pe_ratio = stock.info.get('trailingPE', None)
         pb_ratio = stock.info.get('priceToBook', None)
         eps = stock.info.get('trailingEps', None)
     
     # Create a temporary dataframe for the current stock's ratios
         temp_df = pd.DataFrame([{
             'Ticker': ticker,
             'market_cap': market_cap,
             'trading_volume': trading_volume,
             'P/E': pe_ratio,
             'P/B': pb_ratio,
             'EPS': eps
             }])

         financial_ratios = pd.concat([financial_ratios, temp_df], ignore_index=True)

     financial_ratios = pd.DataFrame(financial_ratios) 
     sustain_comp_adv = financial_ratios[financial_ratios['P/E'] < 100]

     fig = px.scatter(
         sustain_comp_adv, x=x_axis, y="EPS", size="market_cap", color = "Ticker"
     )
 
     return fig
# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=8054)