import dash
from dash import dcc, html, dash_table
from dash.dependencies import Input, Output, State
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import requests
import dash_bootstrap_components as dbc

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

app.layout = dbc.Container([
    html.H1('Technical Analysis Dashboard', className='text-center mb-4'),

    dbc.Row([
        dbc.Col([
            dbc.CardGroup([
                dbc.Label('Stock Ticker:'),
                dcc.Input(id='ticker-input', type='text', placeholder='Enter Ticker', className='form-control'),
            ], className='mb-3'),

            dbc.CardGroup([
                dbc.Label('Start Date:'),
                dcc.DatePickerSingle(id='start-date-input', placeholder='Start Date', className='form-control'),
            ], className='mb-3'),

            dbc.CardGroup([
                dbc.Label('End Date:'),
                dcc.DatePickerSingle(id='end-date-input', placeholder='End Date', className='form-control'),
            ], className='mb-3'),

            dbc.Button('Submit', id='submit-button', n_clicks=0, color='primary', className='mr-2'),
        ], width=12),

        dbc.Col([
            dbc.CardGroup([
                dbc.Label('Select Metrics:', className='text-center mb-2'),
                dcc.Checklist(
                    id='metrics-checklist',
                    options=[
                        {'label': 'Moving Average (MA) 20', 'value': 'MA20'},
                        {'label': 'Moving Average (MA) 50', 'value': 'MA50'},
                        {'label': 'Bollinger Bands (BB)', 'value': 'BB'}
                    ],
                    value=['MA20', 'MA50', 'BB'],
                    labelStyle={'display': 'block'}
                ),
            ], className='text-center mb-3')
        ], width=12),

        dbc.Col([
            dcc.Graph(id='stock-graph', className='mb-4'),
        ], width=12),

        dbc.Col([
            dcc.Graph(id='candlestick-graph', className='mb-4'),
        ], width=12),

        dbc.Col([
            dcc.Graph(id='stochastics-graph', className='mb-4'),
        ], width=12),

        dbc.Col([
            dcc.Graph(id='macd-graph', className='mb-4'),
        ], width=12),

        dbc.Col([
            dcc.Graph(id='rsi-graph', className='mb-4'),
        ], width=12),

        dbc.Col([
            html.Div(id='output-table-container'),
        ], width=6),
    ], className='mt-4')
])

def fetch_data(ticker, start_date, end_date):
    response = requests.post('http://127.0.0.1:8888/update_data', data={
        'ticker': ticker,
        'start_date': start_date,
        'end_date': end_date
    })
    if response.status_code != 200:
        return None
    json_response = response.json()
    data = pd.DataFrame(json_response['data'])
    return data

@app.callback(
    Output('output-table-container', 'children'),
    [Input('submit-button', 'n_clicks')],
    [State('ticker-input', 'value'),
     State('start-date-input', 'date'),
     State('end-date-input', 'date')]
)
def update_data_table(n_clicks, ticker, start_date, end_date):
    if n_clicks == 0:
        return dash.no_update

    data = fetch_data(ticker, start_date, end_date)
    if data is None:
        return 'Error fetching data'

    table = dash_table.DataTable(
        columns=[{"name": i, "id": i} for i in data.columns],
        data=data.to_dict('records'),
        style_table={'overflowX': 'auto'},
        style_cell={'textAlign': 'left'}
    )
    return table

# Define callback to update stock price graph
@app.callback(
    Output('stock-graph', 'figure'),
    [Input('submit-button', 'n_clicks')],
    [State('ticker-input', 'value'),
     State('start-date-input', 'date'),
     State('end-date-input', 'date')]
)
def update_stock_graph(n_clicks, ticker, start_date, end_date):
    if n_clicks == 0:
        return dash.no_update

    data = fetch_data(ticker, start_date, end_date)
    if data is None:
        return go.Figure()

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=data['Date'], y=data['Close'], mode='lines', name='Close Price'))
    fig.update_layout(title='Stock Prices Over Time', xaxis_title='Date', yaxis_title='Price')
    return fig

# Define the callback to update the candlestick graph
@app.callback(
    Output('candlestick-graph', 'figure'),
    [Input('submit-button', 'n_clicks'),
     Input('metrics-checklist', 'value')],
    [State('ticker-input', 'value'),
     State('start-date-input', 'date'),
     State('end-date-input', 'date')]
)
def update_candlestick_graph(n_clicks, ma_values, ticker, start_date, end_date):
    if n_clicks is None:
        return dash.no_update

    data = fetch_data(ticker, start_date, end_date)
    if data is None:
        return go.Figure()

    if 'MA20' in ma_values:
        data['MA20'] = data['Close'].rolling(window=20).mean()
    if 'MA50' in ma_values:
        data['MA50'] = data['Close'].rolling(window=50).mean()
    if 'BB' in ma_values:
        data['MA20'] = data['Close'].rolling(window=20).mean()
        data['BB_upper'] = data['MA20'] + 2 * data['Close'].rolling(window=20).std()
        data['BB_lower'] = data['MA20'] - 2 * data['Close'].rolling(window=20).std()

    fig = make_subplots(rows=2, cols=1, shared_xaxes=True, 
                        vertical_spacing=0.02, row_heights=[0.8, 0.2])

    # Add candlestick chart
    fig.add_trace(go.Candlestick(
        x=data['Date'],
        open=data['Open'],
        high=data['High'],
        low=data['Low'],
        close=data['Close'],
        name='Candlestick'
    ), row=1, col=1)

    # Add moving averages to the candlestick chart
    if 'MA20' in ma_values:
        fig.add_trace(go.Scatter(
            x=data['Date'], y=data['MA20'],
            mode='lines',
            name='MA20'
        ), row=1, col=1)
    if 'MA50' in ma_values:
        fig.add_trace(go.Scatter(
            x=data['Date'], y=data['MA50'],
            mode='lines',
            name='MA50'
        ), row=1, col=1)
    if 'BB' in ma_values:
        fig.add_trace(go.Scatter(
            x=data['Date'], y=data['BB_upper'],
            mode='lines',
            name='Bollinger Upper',
            line=dict(color='rgba(0,100,80,0.2)')
        ), row=1, col=1)
        fig.add_trace(go.Scatter(
            x=data['Date'], y=data['BB_lower'],
            mode='lines',
            name='Bollinger Lower',
            line=dict(color='rgba(0,100,80,0.2)')
        ), row=1, col=1)

    # Add volume bar chart
    fig.add_trace(go.Bar(
        x=data['Date'],
        y=data['Volume'],
        marker=dict(color='rgba(0, 0, 255, 0.3)'),
        name='Volume'
    ), row=2, col=1)

    fig.update_layout(
        height=800,
        title='Candlestick Chart with Volume',
        yaxis_title='Price',
        yaxis2_title='Volume',
        xaxis2=dict(
            showticklabels=False
        ),
        xaxis_rangeslider_visible=False,
        showlegend=True
    )
    fig.update_yaxes(range=[0, data['Volume'].max() * 1.1], row=2, col=1)

    return fig


# Define the callback to update the Stochastics graph
@app.callback(
    Output('stochastics-graph', 'figure'),
    [Input('submit-button', 'n_clicks')],
    [State('ticker-input', 'value'),
     State('start-date-input', 'date'),
     State('end-date-input', 'date')]
)
def update_stochastics_graph(n_clicks, ticker, start_date, end_date):
    if n_clicks is None:
        return dash.no_update

    data = fetch_data(ticker, start_date, end_date)
    if data is None:
        return go.Figure()

    # Calculate Stochastics
    data['L14'] = data['Low'].rolling(window=14).min()
    data['H14'] = data['High'].rolling(window=14).max()
    data['%K'] = 100 * ((data['Close'] - data['L14']) / (data['H14'] - data['L14']))
    data['%D'] = data['%K'].rolling(window=3).mean()

    stochastics_fig = go.Figure()
    stochastics_fig.add_trace(go.Scatter(
        x=data['Date'], y=data['%K'],
        mode='lines', name='%K'
    ))
    stochastics_fig.add_trace(go.Scatter(
        x=data['Date'], y=data['%D'],
        mode='lines', name='%D'
    ))
    stochastics_fig.update_layout(
        title='Stochastics Oscillator',
        yaxis_title='Stochastics %',
        xaxis=dict(showticklabels=False),
        width=1000,
        height=400,
        margin=dict(l=20, r=20, t=50, b=20)
    )

    return stochastics_fig

# Define the callback to update the MACD graph
@app.callback(
    Output('macd-graph', 'figure'),
    [Input('submit-button', 'n_clicks')],
    [State('ticker-input', 'value'),
     State('start-date-input', 'date'),
     State('end-date-input', 'date')]
)
def update_macd_graph(n_clicks, ticker, start_date, end_date):
    if n_clicks is None:
        return dash.no_update

    data = fetch_data(ticker, start_date, end_date)
    if data is None:
        return go.Figure()

    # Calculate MACD
    data['EMA12'] = data['Close'].ewm(span=12, adjust=False).mean()
    data['EMA26'] = data['Close'].ewm(span=26, adjust=False).mean()
    data['MACD'] = data['EMA12'] - data['EMA26']
    data['Signal Line'] = data['MACD'].ewm(span=9, adjust=False).mean()

    macd_fig = go.Figure()
    macd_fig.add_trace(go.Scatter(
        x=data['Date'], y=data['MACD'],
        mode='lines', name='MACD'
    ))
    macd_fig.add_trace(go.Scatter(
        x=data['Date'], y=data['Signal Line'],
        mode='lines', name='Signal Line'
    ))
    macd_fig.update_layout(
        title='MACD',
        yaxis_title='MACD',
        xaxis=dict(showticklabels=False),
        width=1000,
        height=400,
        margin=dict(l=20, r=20, t=50, b=20)
    )

    return macd_fig

@app.callback(
    Output('rsi-graph', 'figure'),
    [Input('submit-button', 'n_clicks')],
    [State('ticker-input', 'value'),
     State('start-date-input', 'date'),
     State('end-date-input', 'date')]
)
def update_rsi_graph(n_clicks, ticker, start_date, end_date):
    if n_clicks is None:
        return dash.no_update

    data = fetch_data(ticker, start_date, end_date)
    if data is None or len(data) < 14:
        return go.Figure()

    # Calculate RSI
    delta = data['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(window=14, min_periods=1).mean()
    avg_loss = loss.rolling(window=14, min_periods=1).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    # Create RSI chart
    rsi_fig = go.Figure()
    rsi_fig.add_trace(go.Scatter(
        x=data['Date'], y=rsi,
        mode='lines', name='RSI'
    ))
    rsi_fig.update_layout(
        title='Relative Strength Index (RSI)',
        yaxis_title='RSI',
        xaxis=dict(showticklabels=False),
        width=1000,
        height=400,
        margin=dict(l=20, r=20, t=50, b=20)
    )

    return rsi_fig

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)

