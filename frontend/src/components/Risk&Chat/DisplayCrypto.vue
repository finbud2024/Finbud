<template>
    <div class="container">
        <div class="carlendar-container"><label for="">Please select one</label>
            <select v-model="selected">
                <option v-for="crypto in cryptocurrencies" :key="crypto" :value="crypto">{{ crypto }}</option>
            </select>
            <div class="datebox">
                <label for="">Choose an end date</label>
                <VueDatePicker v-model="startDate" :min-date="minDate" :max-date="maxDate" prevent-min-max-navigation>
                </VueDatePicker>
            </div>
            <div class="datebox">
                <label for="">Choose an end date</label>
                <VueDatePicker v-model="endDate" :min-date="minDate" :max-date="maxDate" prevent-min-max-navigation>
                </VueDatePicker>
                <input class="styled" type="button" value="Show" @click="queryDate" />
            </div>
        </div>
        <div class="data-table">
            <h1>Crypto History</h1>
            <div v-if="errorCrypto" class="error">{{ errorCrypto }}</div>
            <div v-else-if="loadingCrypto" class="loadingCrypto">Loading...</div>
            <div v-else>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Open</th>
                            <th>High</th>
                            <th>Close</th>
                            <th>Volume</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody v-if="paginatedCryptoList.length" class="table-body">
                        <tr v-for="crypto in paginatedCryptoList" :key="crypto.uuid" class="table-row">
                            <td> {{ crypto["cryptoName"] }}</td>
                            <td> {{ crypto["symbol"] }} </td>
                            <td> {{ crypto["open"] }} B</td>
                            <td> {{ crypto["high"] }} B</td>
                            <td> {{ crypto["close"] }} B</td>
                            <td> {{ crypto["volume"] }} </td>
                            <td> {{ formattedDate(crypto["date"]) }} </td>
                        </tr>
                    </tbody>
                </table>
                <Pagination :currentPage.sync="currentCryptoPage" :totalPages="cryptoTotalPages"
                    @update:currentPage="updateCryptoCurrentPage" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import Pagination from './Pagination.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/.netlify/functions/server' : 'https://finbud-ai.netlify.app/.netlify/functions/server';
export default {
    name: 'DisplayCrypto',
    components: {
        VueDatePicker,
        Pagination,
    },
    data() {
        return {
            startDate: new Date("2024-02-12"),
            endDate: new Date(),
            minDate: new Date("2024-02-01"),
            maxDate: new Date(),
            cryptocurrencies: ['BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE', 'LUNA', 'LINK', 'AVAX', 'MATIC', 'ALGO', 'ATOM', 'UNI', 'ICP', 'FTT', 'VET', 'AAVE', 'XTZ'],
            selected: "",
            cryptoList: [],
            errorCrypto: null,
            loading: true,
            currentStockPage: 1,
            currentCryptoPage: 1,
            itemsPerPage: 10,
        }
    },
    setup() {
        const date = ref();
        return {
            date
        }
    },
    computed: {
        minDate() { return new Date("2024-02-01") },
        maxDate() { return new Date() },
        cryptoTotalPages() {
            return Math.ceil(this.cryptoList.length / this.itemsPerPage);
        },
        paginatedCryptoList() {
            const start = (this.currentCryptoPage - 1) * this.itemsPerPage;
            return this.cryptoList.slice(start, start + this.itemsPerPage);
        },
    },
    watcher: {
        cryptoList(newV) {
            this.paginatedCryptoList();
        }
    },
    methods: {
        async queryDate() {
            try {
                const send = this.selected;
                const responses = await axios.post(`${apiUrl}/displayCrypto`, { "symbol": this.selected, "startDate": this.startDate, "endDate": this.endDate });
                console.log("from DisplayCrypto Page:", responses.data);
                this.cryptoList = responses.data;
                this.loading = false;
            } catch (error) {
                console.log("from DisplayCrypto Page:", error);
                this.loading = false;
            }
        },
        updateCryptoCurrentPage(newPage) {
            this.currentCryptoPage = newPage;
        },
        formattedDate(date) {
            const newDate = new Date(date);
            return newDate.toISOString().split('T')[0];
        },
    },
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.carlendar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
}

select {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    font-size: 16px;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s;
}

select:focus {
    border-color: #007bff;
    outline: none;
}

::placeholder {
    color: #888;
}

input.styled {
    padding: 10px 20px;
    margin: 10px 0;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

input.styled:hover {
    background-color: #0056b3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

input.styled:active {
    background-color: #004494;
}

.VueDatePicker {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    font-size: 16px;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.VueDatePicker:focus {
    border-color: #007bff;
    outline: none;
}

.data-table {
    padding: 20px;
    width: 40%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
    border-radius: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 0.9rem;
}

thead {
    background-color: #f8f8f8;
}

th,
td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}

tr:hover {
    background-color: #f1f1f1;
}

.error {
    color: red;
}

.loading {
    color: gray;
}

.positive {
    color: green;
}

.negative {
    color: red;
}

.table-row {
    transition: background-color 0.3s ease;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
    .data-table {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .home-container {
        padding: 10px;
        max-width: 100%;
    }

    select,
    .VueDatePicker,
    input.styled {
        font-size: 14px;
    }
}
</style>