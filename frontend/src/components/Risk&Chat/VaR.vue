<template>
    <div class="container">
        <div class="carlendar-container"><label for="">Please select one</label>
            <select v-model="selected">
                <option v-for="stock in stockcurrencies" :key="stock" :value="stock">{{ stock }}</option>
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
            </div>
            <input class ="numberInput"
                type="number"
                v-model.number="confidentLevel"
                @input="checkMaxValue"
                placeholder="Enter confident level:"
                max="100"
                />
            <input
                class ="numberInput"
                type="number"
                v-model.number="money"
                placeholder="Enter your money:"
                />
            <input class="styled" type="button" value="Show" @click="getVaR" :disabled="isFormValid" />        
            <div v-if="VaRValue != ''">
                <h3>Your Value at Risk is: {{ VaRValue }}</h3>
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
            confidentLevel: '',
            money: '',
            lowList: [],
            dailyReturns : [],
            percentile : '',
            percentileReturn : '',
            VaRValue : ''
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
        isFormValid() {
            const valid = this.money == '' || this.confidentLevel == '';
            return valid;
        },
    },
    methods: {
        checkMaxValue() {
        if (this.confidentLevel > 100) {
        this.confidentLevel = 100; // Limit the value to 100
        }
    },
        async getVaR() {
            try {
                const send = this.selected;
                const endDate =  this.formattedDate(this.endDate);
                const startDate =  this.formattedDate(this.startDate);
                const responses = await axios.get(`https://api.stockdata.org/v1/data/eod?symbols=${this.selected}&api_token=${this.stockApiKey}&date_from=${startDate}&date_to=${endDate}`);
                // console.log("from DisplayStock Page:", responses.data.data);
                this.stockList = responses.data.data;
                for(let stock of this.stockList){
                    this.lowList.push(stock.low)
                }
                console.log("LowList:", this.lowList);
                    for (let index =1 ; index <  this.lowList.length; index ++) {
                        const dailyReturn = (this.lowList[index] - this.lowList[index - 1]) / this.lowList[index - 1];
                        this.dailyReturns.push(dailyReturn);
                    }
                    this.dailyReturns.sort((a, b) => a - b)
                    console.log("Daily Returns:", this.dailyReturns);
                    
                    this.percentile = Math.round((100-this.confidentLevel)*0.01*this.dailyReturns.length +1) -1;
                    this.percentileReturn = this.dailyReturns[this.percentile];
                    this.VaRValue = this.percentileReturn* this.money
                    console.log("Rounded Percentile:", this.percentile);
                    
                    console.log(" Percentile Return:", this.percentileReturn);
                    console.log(" Potential Loss:", this.VaRValue);

            } catch (error) {
                console.log("from DisplayStock Page:", error);
            }
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
    margin: 10px;
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
input.numberInput {
    padding: 10px 20px;
    margin: 10px 0;
    border: none;
    border-radius: 4px;
    background-color: white;
    color: black;
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
input.styled:disabled {
    background-color: #abc8ea;
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


/* Responsive Styles */

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