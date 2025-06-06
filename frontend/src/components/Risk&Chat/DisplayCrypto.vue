<template>
    <div class="main-container">
        <!-- Big Container to hold both Crypto History and Selection Table -->
        <div class="inner-container">
            <!-- Left Container for Crypto History -->
            <div class="crypto-history-container">
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
                        <Pagination :currentPage.sync="currentCryptoPage" :totalPages="cryptoTotalPages" @update:currentPage="updateCryptoCurrentPage" />
                    </div>
                </div>
            </div>

            <!-- Right Container for Selection Table -->
            <div class="selection-container">
                <div class="calendar-container">
                    <label for="">Please select one</label>
                    <select v-model="selected">
                        <option v-for="crypto in cryptocurrencies" :key="crypto" :value="crypto">{{ crypto }}</option>
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
                const responses = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/queryRoute`, { "symbol": this.selected, "startDate": this.startDate, "endDate": this.endDate });
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
.main-container {
    width: 100%; /* Ensures the container takes up the full width available */
    max-width: 1100px; /* Sets a maximum width similar to the "Crypto Quotes" container */
    margin: 0 auto; /* Centers the container horizontally */
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

.crypto-history-container {
    flex-basis: 75%; /* Adjusts the width to take up 75% of the inner-container */
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* New styles for Crypto History section title */
.crypto-history-container h1 {
    font-weight: bold;
    color: #000000;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid #000000;
    padding-bottom: 0.5rem;
    text-align: left;
}

.selection-container {
    flex-basis: 25%; /* Adjusts the width to take up 25% of the inner-container */
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
    border-color: #000000;
    outline: none;
}

input.styled {
    background-color: #000000;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

input.styled:hover {
    background-color: #333333;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

input.styled:active {
    background-color: #666666;
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
    color: white;
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

    .crypto-history-container, .selection-container {
        flex-basis: 100%;
    }
}
</style>

