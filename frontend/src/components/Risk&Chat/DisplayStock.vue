<template>
    <div class="main-container">
        <!-- Big Container to hold both Stock History and Selection Table -->
        <div class="inner-container">
            <!-- Left Container for Stock History -->
            <div class="stock-history-container">
                <div class="data-table">
                    <h1>Stock History</h1>
                    <div v-if="errorStock" class="error">{{ errorStock }}</div>
                    <div v-else-if="loadingStock" class="loadingStock">Loading...</div>
                    <div v-else>
                        <table>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Open</th>
                                    <th>High</th>
                                    <th>Low</th>
                                    <th>Close</th>
                                    <th>Volume</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody v-if="paginatedStockList.length" class="table-body">
                                <tr v-for="stock in paginatedStockList" :key="stock.uuid" class="table-row">
                                    <td>{{ stock["symbol"] }}</td>
                                    <td>{{ stock["open"] }} B</td>
                                    <td>{{ stock["high"] }} B</td>
                                    <td>{{ stock["low"] }} B</td>
                                    <td>{{ stock["close"] }} B</td>
                                    <td>{{ stock["volume"] }}</td>
                                    <td>{{ formattedDate(stock["date"]) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <Pagination :currentPage.sync="currentStockPage" :totalPages="stockTotalPages" @update:currentPage="updateStockCurrentPage" />
                    </div>
                </div>
            </div>

            <!-- Right Container for Selection Table -->
            <div class="selection-container">
                <div class="calendar-container">
                    <label for="">Please select one</label>
                    <select v-model="selected">
                        <option v-for="stock in stockCurrencies" :key="stock" :value="stock">{{ stock }}</option>
                    </select>
                    <div class="datebox">
                        <label for="">Choose a date</label>
                        <VueDatePicker v-model="startDate" :min-date="minDate" :max-date="maxDate" prevent-min-max-navigation />
                    </div>
                    <div class="datebox">
                        <label for="">Choose an end date</label>
                        <VueDatePicker v-model="endDate" :min-date="minDate" :max-date="maxDate" prevent-min-max-navigation />
                        <input class="styled" type="button" value="Show" @click="queryDate" />
                    </div>
                </div>
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
export default {
    name: 'DisplayStock',
    components: {
        VueDatePicker,
        Pagination,
    },
    data() {
        return {
            stockApiKey : 'ZkYvEJRJsmC1R51bmmHB9S3Kysuv56sVNJoFVDZu',
            startDate: new Date("2024-02-01"),
            endDate: new Date(),
            minDate: new Date("2024-02-01"),
            maxDate: new Date(),
            stockcurrencies: ['IBM','AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'BRK.B', 'NVDA', 'JNJ', 'WMT', 'JPM', 'PG', 'DIS', 'MA', 'NFLX', 'ADBE', 'PYPL', 'INTC', 'CSCO'],
            selected: "",
            stockList: [],
            errorStock: null,
            loading: true,
            currentStockPage: 1,
            currentStockPage: 1,
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
        stockTotalPages() {
            return Math.ceil(this.stockList.length / this.itemsPerPage);
        },
        paginatedStockList() {
            const start = (this.currentStockPage - 1) * this.itemsPerPage;
            return this.stockList.slice(start, start + this.itemsPerPage);
        },
    },
    watcher: {
        stockList(newV) {
            this.paginatedStockList();
        }
    },
    methods: {
        async queryDate() {
            try {
                const send = this.selected;
                const endDate = await this.formattedDate(this.endDate);
                const startDate = await this.formattedDate(this.startDate);
                const responses = await axios.get(`https://api.stockdata.org/v1/data/eod?symbols=${this.selected}&api_token=${this.stockApiKey}&date_from=${startDate}&date_to=${endDate}`);
                console.log("from DisplayStock Page:", responses.data.data);
                this.stockList = responses.data.data;
                this.loading = false;
            } catch (error) {
                console.log("from DisplayStock Page:", error);
                this.loading = false;
            }
        },
        updateStockCurrentPage(newPage) {
            this.currentStockPage = newPage;
        },
        formattedDate(date) {
            const newDate = new Date(date);
            return newDate.toISOString().split('T')[0];
        },
    },
}
</script>
<style scoped>
.main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.inner-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
}

.stock-history-container {
    flex-basis: 75%;
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* New styles for Stock History section title */
.stock-history-container h1 {
    font-weight: bold;
    color: #007bff; /* Blue color similar to Crypto Quotes section */
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid #007bff; /* Underline similar to Crypto Quotes section */
    padding-bottom: 0.5rem;
    text-align: left;
}

.selection-container {
    flex-basis: 25%;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calendar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

select, .VueDatePicker, input.styled {
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

select:focus, .VueDatePicker:focus {
    border-color: #007bff;
    outline: none;
}

input.styled {
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

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 0.9rem;
}

thead {
    background-color: #f8f8f8;
}

th, td {
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

.table-row {
    transition: background-color 0.3s ease;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
    .inner-container {
        flex-direction: column;
        gap: 10px;
    }

    .stock-history-container, .selection-container {
        flex-basis: 100%;
    }
}
</style>
