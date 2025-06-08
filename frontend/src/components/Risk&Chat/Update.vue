<script>
import axios from 'axios';
const cryptoApiKey = process.env.VUE_APP_ALPHA_VANTAGE_API_KEY; // alphavantage
const stockApiKey = process.env.VUE_APP_STOCK_DATA_KEY; //stockdata.org 
export default {
    name: 'Update',
    data() {
        cryptoQuotes: []
    },
    methods: {
        //STOCK FUNCTION 
        async getStockPrice() {
            const listOfStocks = ['IBM', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'BRK.B', 'NVDA', 'JNJ', 'WMT', 'JPM', 'PG', 'DIS', 'MA', 'NFLX', 'ADBE', 'PYPL', 'INTC', 'CSCO'];
            try {
                for (const symbol of listOfStocks) {
                    const fetchedData = await this.fetchStockPrice(symbol);
                    const data = fetchedData.data
                    const response = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/updateStockDB`, { "symbol": symbol, "data": data });
                    console.log("From Update.vue", response.data);
                }
            } catch (error) {
                console.log('Error in getStockPrice:', error);
            }
        },
        async fetchStockPrice(stockSymbol) {
            const urlStock = `https://api.stockdata.org/v1/data/eod?symbols=${stockSymbol}&api_token=${stockApiKey}&date_from=2024-06-25`;
            try {
                const res = await axios.get(urlStock)
                return res.data;
            } catch (error) {
                console.log('Error', error);
            }
        },
        async getLatestDateinStockDB() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/latestStock`);
                console.log("Latest Date in Stock DB:", response.data);
                return response.data
            } catch (error) {
                console.log('Error getting latest date in Stock DB', error);
            }
        },

        // CRYPTO FUNCTION 
        async getCryptoPrice() {
            const symbols = ['BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE', 'LUNA', 'LINK', 'AVAX', 'MATIC', 'ALGO', 'ATOM', 'UNI', 'ICP', 'FTT', 'VET', 'AAVE', 'XTZ'];
            try {
                const requests = symbols.map(symbol => {
                    return this.fetchCryptoPrice(symbol);
                });
                const responses = await Promise.all(requests);
                // console.log('Crypto from Alpha vantage responses:', responses);
                this.cryptoQuotes = responses;
                const response = axios.post(`${process.env.VUE_APP_DEPLOY_URL}/updateCryptoDB`, this.cryptoQuotes);
                console.log("From Update.vue:", response);
            } catch (error) {
                this.error = 'Failed to update crypto price';
                console.error('Error:', error);
            }
        },
        async fetchCryptoPrice(symbol) {
            const urlCrypto = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=EUR&apikey=demo`;
            try {
                const res = await axios.get(urlCrypto, {
                    headers: { 'User-Agent': 'request' }
                })
                return res.data
            } catch (error) {
                console.error('Error:', error);
            }
        }, 
        async getLatestDateinCryptoDB() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/latestCrypto`);
                console.log("Latest Date in Crypto DB:",response.data);
                return response.data;
            } catch (error) {
                console.log('Error getting latest date in Crypto DB', error);
            }
        },
        //FUNCTION TO AUTO UPDATE STOCK AND CRYPTO 
        async autoUpdate() {
            const todayDate = await this.resetToMidNight(new Date());
            const latestDateInStockDB = await this.getLatestDateinStockDB();
            const latestDateInCryptoDB = await this.getLatestDateinCryptoDB();
            console.log("Today Date:", new Date(todayDate));
            if (new Date(todayDate) > new Date(latestDateInStockDB)) {
                this.getStockPrice();
            } else {
                console.log("Today Date is equal to the latest Date in Stock, so no need to update DB");
            }
            if (new Date(todayDate) > new Date(latestDateInCryptoDB)) {
                this.getCryptoPrice();
            } else {
                console.log("Today Date is equal to the latest Date in Crypto, so no need to update DB");
            }
        },
        // Reset to midnight of the previous day
        async resetToMidNight(date) {
            date.setUTCDate(date.getUTCDate() - 1);
            date.setUTCHours(0, 0, 0, 0);
            return date.toISOString();
        },
    },

    mounted() {
        this.autoUpdate()
    }
}
</script>