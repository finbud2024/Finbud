import yfinance as yf
import pandas as pd
from datetime import datetime
from flask import Flask, Blueprint, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

app = Flask(__name__)

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'your_secret_key'

main = Blueprint('main', __name__, url_prefix='/')

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/update_data', methods=['POST'])
def update_data():
    ticker = request.form['ticker']
    start_date = request.form['start_date']
    end_date = request.form['end_date']

    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')

    data = fetch_stock_data(ticker, start_date, end_date)
    processed_data = process_data(data)
    html_table = processed_data.to_html(classes='data-table')
    return jsonify({'html_table': html_table, 'data': processed_data.to_dict(orient='records')})

@main.route('/predict', methods=['POST'])
def predict():
    ticker = request.form['ticker']
    start_date = request.form['start_date']
    end_date = request.form['end_date']

    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')

    data = fetch_stock_data(ticker, start_date, end_date)
    processed_data = process_data(data)

    # Prepare data for LSTM model
    close_prices = processed_data['Close'].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)

    # Create training data
    train_data = []
    for i in range(60, len(scaled_data)):
        train_data.append(scaled_data[i-60:i, 0])

    train_data = np.array(train_data)
    train_data = np.reshape(train_data, (train_data.shape[0], train_data.shape[1], 1))

    # Build and train LSTM model
    model = create_lstm_model()
    model.fit(train_data, scaled_data[60:], epochs=1, batch_size=1)

    # Prepare test data for prediction
    test_data = scaled_data[-60:]
    X_test = np.array([test_data])  # Initial X_test for prediction
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    # Predict next 10 days
    predictions = []
    for _ in range(10):
        pred = model.predict(X_test)
        predictions.append(pred[0, 0])
        # Update X_test for the next prediction
        new_input = np.roll(X_test, -1, axis=1)
        new_input[0, -1, 0] = pred  # Append the predicted value
        X_test = new_input

    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1)).flatten()

    # Create a response
    future_dates = pd.date_range(start=processed_data['Date'].iloc[-1] + pd.Timedelta(days=1), periods=10)
    prediction_data = pd.DataFrame({'Date': future_dates, 'Predicted_Close': predictions})

    return jsonify(prediction_data.to_dict(orient='records'))



def fetch_stock_data(ticker, start_date, end_date):
    stock = yf.Ticker(ticker)
    data = stock.history(start=start_date, end=end_date)
    data.reset_index(inplace=True)
    return data

def process_data(data):
    required_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
    processed_data = data[required_columns]
    return processed_data

def create_lstm_model():
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(60, 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50, return_sequences=False))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))

    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

app.register_blueprint(main)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888, debug=True)


