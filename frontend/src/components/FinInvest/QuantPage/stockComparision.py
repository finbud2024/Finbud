from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import yfinance as yf

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your Vue dev server origin if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock")
def get_stock(ticker: str, interval: str = '1d', days: int = 30):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    try:
        df = yf.download(ticker, start=start_date, end=end_date, interval=interval)
        if df.empty:
            return {"error": f"No data for {ticker}"}

        return {
            "dates": [str(d.date()) for d in df.index],
            "closes": df["Close"].fillna(method='ffill').tolist()
        }

    except Exception as e:
        return {"error": str(e)}
