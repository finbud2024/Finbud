import dash_bootstrap_components as dbc
from dash import Dash, html, State, callback, Output, Input, dcc
from dash.exceptions import PreventUpdate
import plotly.graph_objects as go
import yfinance as yf
import sys
sys.path.append('D:/Work/FinBud-Git')
from valuation_functions import *

app = Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP, dbc.icons.FONT_AWESOME])
app.layout = html.Div([
    html.Div(html.H1("Company Overview", 
             style={ "text-align": "center",
             "background-color": "rgb(5, 12, 156)",
             "color": "white", "height": "75px", "font-size": "50px"}),
             style={"padding": "5px", "align-items": "center"}),
    dcc.Dropdown(id="pick_ticker1", options=[
                {"label": "Apple Inc.", "value": "AAPL"},
                {"label": "Microsoft Corporation", "value": "MSFT"},
                {"label": "Amazon.com Inc.", "value": "AMZN"},
                {"label": "Tesla Inc.", "value": "TSLA"},
                {"label": "Alphabet Inc. (Google)", "value": "GOOGL"},
            ], placeholder='Select Stock', style={'width': '90%', 'margin': '0 auto 20px auto'}),
    dcc.Graph(id="value_estimation_graph")
])

@callback(Output("value_estimation_graph", "figure"),
          [Input('pick_ticker1', 'value')])
def fair_estimation(pick_ticker1):
    fair_val = round(fair_value(pick_ticker1),2)
    com = yf.Ticker(pick_ticker1)
    name = com.info['shortName']
    current_price = com.info['currentPrice']
    price_diff = fair_val - current_price
    percent_diff = round(abs(price_diff)/fair_val, 2)
    fig = go.Figure()
    # Charts part
    fig.add_trace(go.Bar(
        x=[fair_val*1.5],
        name='Over value',
        orientation='h',
        marker=dict(
            color='rgb(255, 105, 105)',
            line=dict(color='red', width=3)
        )
    ))
    fig.add_trace(go.Bar(
        x=[fair_val*1.2],
        name='Fair value',
        orientation='h',
        marker=dict(
            color='rgb(255, 219, 92)',
            line=dict(color='rgb(255, 191, 0)', width=3)
        )
    ))
    fig.add_trace(go.Bar(
        x=[fair_val*0.8],
        name='Under value',
        orientation='h',
        marker=dict(
            color='rgb(195, 255, 147)',
            line=dict(color='rgb(6, 208, 1)',width=3)
        )
    ))

    fig.add_trace(go.Bar(
        x=[fair_val],
        y=[-0.2],
        name='Fair value',
        orientation='h',
        width = 0.25,
        marker_color='rgb(52, 73, 85)',
        opacity=0.8,
        texttemplate=f"Fair value<br>${fair_val}",
        textposition="inside",
        textangle=0,
        textfont=dict(
            color="white",
            size=18)
    ))

    fig.add_trace(go.Bar(
        x=[current_price],
        y=[0.2],
        name='Current value',
        orientation='h',
        width = 0.25,
        marker_color='rgb(34, 40, 49)',
        texttemplate=f"Current value<br>${current_price}",
        textposition="inside",
        textangle=0,
        textfont=dict(
            color="white",
            size=18)
    ))

    # Words part
    # Below chart
    fig.add_annotation(
        x=fair_val,
        y=-0.75,
        text="Just right",
        showarrow=False,
        textangle=-25,
        yanchor='bottom',
        font=dict(  # Font properties
            family="Arial Black",  # Replace with your chosen bold font
            size=12,  # Optional: adjust font size
            color='white'  # Optional: adjust text color
        )
    )
    fig.add_annotation(
        x=fair_val*0.8,
        y=-0.75,
        text="20% Undervalued",
        showarrow=False,
        textangle=-25,
        yanchor='bottom',
        font=dict(  # Font properties
            family="Arial Black",  # Replace with your chosen bold font
            size=12,  # Optional: adjust font size
            color='white'  # Optional: adjust text color
        )
    )
    fig.add_annotation(
        x=fair_val*1.2,
        y=-0.75,
        text="20% Overvalued",
        showarrow=False,
        textangle=-25,
        yanchor='bottom',
        font=dict(  # Font properties
            family="Arial Black",  # Replace with your chosen bold font
            size=12,  # Optional: adjust font size
            color='white'  # Optional: adjust text color
        )
    )
    # Above chart
    fig.add_shape(type="line",
        x0=current_price, y0=0.6,
        x1=current_price, y1=0.3,
        line=dict(
            color="white",
            dash="dash",
            width=1
        ))
    fig.add_shape(type="line",
        x0=fair_val, y0=0.6,
        x1=fair_val, y1=-0.1,
        line=dict(
            color="white",
            dash="dash",
            width=1
        ))

    if fair_val > current_price:
        fig.add_annotation(
            text=f"Under value {percent_diff}%",
            x=fair_val*0.8, y=0.7,
            showarrow=False,
            font=dict(family="Arial Black", size=14, color="green")
        )
        fig.add_shape(type="line",
        x0=fair_val, y0=0.6,
        x1=current_price, y1=0.6,
        line=dict(
            color="green",
            width=2
        ))
    else: 
        fig.add_annotation(
            text=f"Over value {percent_diff}%",
            x=fair_val*1.2, y=0.7,
            showarrow=False,
            font=dict(family="Arial Black", size=14, color="red")
        )
        fig.add_shape(type="line",
        x0=fair_val, y0=0.6,
        x1=current_price, y1=0.6,
        line=dict(
            color="red",
            width=2
        ))
    fig.update_layout(
        barmode='overlay',
        plot_bgcolor="rgb(4, 28, 50)",  # Transparent plot area
        paper_bgcolor="white",
        title=f"Fair value of {name} stock",
        font=dict(size=15),
        title_x=0.5, title_y=0.9
    )
    fig.update_xaxes(visible=False)
    fig.update_yaxes(visible=False)
    return fig

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=8055)