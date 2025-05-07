<template>
    <div>
        <!-- Table Selection Buttons -->
        <div class="button-group">
            <button
                class="button"
                :class="{selected: selectedTable === tName}"
                v-for="tName in tableName"
                :key="tName"  
                @click="selectedTable = tName" 
            >
                {{ t(`macroEcon.${matchName[tName]}`) }}
            </button>
        </div>

        <!-- Filter Bar -->
        <template v-if="selectedTable && selectedTable !== 'Tổng quan'">
            <div class="filter">
                <div class="inline-label-select">
                    <label>{{ $t('macroEcon.viewBy') }}:
                        <select v-model="filterType" class="select-box">
                            <option v-if="selectedTable === 'GDP'" value="quý">{{ $t('macroEcon.quarter') }}</option>
                            <option v-else value="tháng">{{ $t('macroEcon.month') }}</option>
                            <option value="năm">{{ $t('macroEcon.year') }}</option>
                        </select>
                    </label>
                </div>

                <!-- Filter for quý -->
                <template v-if="filterType === 'quý'">
                    <div class="inline-label-select">
                        <label>{{ $t('macroEcon.from') }}:
                            <select v-model="fromQuarter" class="select-box">
                                <option v-for="q in Quarters" :key="q" :value="`Quý ${q}`">{{ $t('macroEcon.quarter') }} {{ q }}</option>
                            </select>
                        </label>
                    </div>
                </template>

                <!-- Filter for tháng -->
                <template v-if="filterType === 'tháng'">
                    <div class="inline-label-select">
                        <label>{{ $t('macroEcon.from') }}:
                            <select v-model="fromMonth" class="select-box">
                                <option v-for="m in Months" :key="m" :value="`Tháng ${m}`">{{ $t('macroEcon.month') }} {{ m }}</option>
                            </select>
                        </label>
                    </div>
                </template>

                <!-- Filter for năm (from) -->
                <div class="inline-label-select">
                    <label>{{ $t('macroEcon.from') }}:
                        <select v-model="fromYear" class="select-box">
                            <option v-for="y in Years" :key="y" :value="y">{{ y }}</option>
                        </select>
                    </label>
                </div>

                <!-- Filter for quý -->
                <template v-if="filterType === 'quý'">
                    <div class="inline-label-select">
                        <label>{{ $t('macroEcon.to') }}:
                            <select v-model="toQuarter" class="select-box">
                                <option v-for="q in Quarters" :key="q" :value="`Quý ${q}`">{{ $t('macroEcon.quarter') }} {{ q }}</option>
                            </select>
                        </label>
                    </div>
                </template>

                <!-- Filter for tháng -->
                <template v-if="filterType === 'tháng'">
                    <div class="inline-label-select">
                        <label>{{ $t('macroEcon.to') }}:
                            <select v-model="toMonth" class="select-box">
                                <option v-for="m in Months" :key="m" :value="`Tháng ${m}`">{{ $t(`macroEcon.enMonth.${m}`) }}</option>
                            </select>
                        </label>
                    </div>
                </template>

                <!-- Filter for năm (to) -->
                <div class="inline-label-select">
                    <label>{{ $t('macroEcon.to') }}:
                        <select v-model="toYear" class="select-box">
                            <option v-for="y in Years" :key="y" :value="y">{{ y }}</option>
                        </select>
                    </label>
                </div>

                <!-- Button -->
                <div>
                    <button 
                        class="filter-button"
                        @click="fetchData(selectedTable)"
                    >
                        {{ $t('macroEcon.see') }}
                    </button>
                </div>
            </div>
        </template>


        <!-- Table Display -->
        <table class="table-container">
            <thead>
                <tr>
                    <th
                        v-for="header in tableHeaders"
                        :key="header"
                        class="header"
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="(row, rowIndex) in tableRows" 
                    :key="rowIndex"
                >   
                    <td
                        v-for="(cell, cellIndex) in row" 
                        :key="cellIndex"
                        :class="{ 'highlight-row': row.length >= 1 && row[1] === ''  }"
                    >
                        {{ cell }} 
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import axios from 'axios';
    import { nextTick } from 'vue';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
    const tableRows = ref({});
    const tableHeaders = ref({});
    const selectedTable = ref('Tổng quan');
    const filterType = ref('');
    const fromQuarter = ref('Quý 1');
    const toQuarter = ref('Quý 4');
    const fromMonth = ref('Tháng 1');
    const toMonth = ref('Tháng 12');
    const fromYear = ref((new Date().getFullYear() - 1).toString());
    const toYear = ref(new Date().getFullYear().toString());

    const Quarters = ref(['1', '2', '3', '4']); // Q1–Q4
    const Months = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']); 
    const Years = ref([]);
    const currentYear = new Date().getFullYear();

    const tableName = ['Tổng quan', 'GDP', 'FDI', 'CPI', 'Xuất-Nhập khẩu'];
    const matchName = {
        'Tổng quan': 'overview',
        'GDP': 'gdp',
        'FDI': 'fdi',
        'CPI': 'cpi',
        'Xuất-Nhập khẩu': 'importExport'
    };

    for (let year = 1990; year <= currentYear; year++) {
        Years.value.push(year.toString());
    }

    watch(selectedTable, (newTable) => {
        if (newTable === 'GDP') {
            filterType.value = 'quý';
        } else {
            filterType.value = 'tháng';
        }
    }, { immediate: true });

    watch(filterType, (newType) => {
        console.log('Filter type changed to:', newType);
    });

    const header = {
        'Tổng quan': ['STT', 'Chỉ tiêu', 'Đơn vị tính', 'Số liệu mới nhất', 'Giá trị', 'Đồ thị'],
        'GDP': ['Chỉ tiêu', 'Đơn vị tính'],
        'FDI': ['Chỉ tiêu', 'Đơn vị tính'],
        'CPI': ['Chỉ tiêu', 'Đơn vị tính'],
        'Xuất-Nhập khẩu': ['Chỉ tiêu', 'Đơn vị tính'],
    };

    const tableSources = {
        'Tổng quan': '.netlify/functions/server/api/vietstock/Overview',
        'GDP': '.netlify/functions/server/api/vietstock/GDP/filter/',
        'FDI': '.netlify/functions/server/api/vietstock/FDI/filter/',
        'CPI': '.netlify/functions/server/api/vietstock/CPI/filter/',
        'Xuất-Nhập khẩu': '.netlify/functions/server/api/vietstock/ImportExport/filter/',
    };

    const getData = async (tName) => {
        const url = tableSources[tName];
        console.log('Start fetching data from api: ', url);
        let response = null;
        try {
            console.log(`Starting fetching data from ${tName}`);
            if (tName === 'Tổng quan') {
                const result = [];
                response = await axios.get(url);
                if (response) {
                    console.log(response);
                    const data = response.data;
                    data.forEach(row => {
                        result.push([
                            row.ordinalNumber,
                            row.indicator,
                            row.unit,
                            row.latestData?.chart,
                            row.latestData?.value,
                            row.latestData?.chartUrl
                        ]);
                    });

                    tableHeaders.value = header[tName] || [];

                    return result;
                }
                else {
                    console.log(`Error fetching table ${tName}`);
                }
            }
            else {
                if (tName === 'GDP') {
                    const fType = (filterType === 'năm') ? 'year' : 'quarter';
                    response = await axios.post(`${url}${fType}`, {
                        startQuarter: fromQuarter.value,
                        startYear: fromYear.value,
                        endQuarter: toQuarter.value,
                        endYear: toYear.value
                    });
                }
                else {
                    const fType = (filterType === 'năm') ? 'year' : 'month';
                    response = await axios.post(`${url}${fType}`, {
                        startMonth: fromMonth.value,
                        startYear: fromYear.value,
                        endMonth: toMonth.value,
                        endYear: toYear.value
                    });
                }
                if (response) {
                    const rows = response.data.data;
                    console.log(rows);
                    let result = [];
                    const headers = [];

                    if (rows.length > 0 && rows[0].value.length > 0) {
                        for (let i = 0; i < rows[0].value.length; i++) {
                            result.push([]);
                        }
                    }
                    console.log(result);



                    for (let index = 0; index < rows.length; index++) {
                        const row = rows[index];
                        console.log('Row: ', row);

                        if (tName === 'GDP') {
                            headers.push(`${row.quarter} ${row.year}`);
                        } else {
                            headers.push(`${row.month} ${row.year}`);
                        }

                        for (let i = 0; i < row.value.length; i++) {
                            const data = row.value[i];
                            if (data.category) {
                                if (result[i].length == 0) {
                                    result[i].push(data.category); 
                                    result[i].push('');
                                    result[i].push('');
                                }
                                else result[i].push('');
                            }
                            else {
                                if (result[i].length === 0) {
                                    result[i].push(data.chi_tieu);
                                    result[i].push(data.don_vi);
                                } 
                                result[i].push(data.gia_tri);
                            }
                        };
                    }

                    tableHeaders.value = (header[tName] || []).concat(headers);

                    return result;
                }
                else {
                    console.log(`Error fetching table`);
                }
            }
        }
        catch (error) {
            console.log(`Error fetching table ${tName}: `, error);
        }
    };

    const fetchData = async(tName) => {
        try {
            console.log(`Currently fetching data from ${selectedTable.value}`);
            tableHeaders.value = [];
            tableRows.value = [];
            tableRows.value = await getData(tName);
            console.log(tableRows.value);
        }
        catch (error) {
            console.error('Failed to fetch data: ', error);
        }
    }

    onMounted(async () => {
        fetchData(selectedTable.value);
    });

    watch(selectedTable, (newTable) => {
        fetchData(newTable);
    });

</script>

<style>

.button-group {
    padding-left: 10%;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    gap: 16px;
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  border-radius: 0.375rem; /* rounded-md */
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  border-bottom: 2px solid transparent;
  border-radius: 0;
}

.button.selected {
    border-bottom: 2px solid black;
}

.filter-button {
    background-color: black;
    color: white;
    border-radius: 0.375rem; /* rounded-md */
    font-weight: 500;
    width: 130px;
    height: 30px;
    margin-left: 1rem;
}

.filter {
    padding-left: 10%;
    padding-top: 10px;
    padding-bottom: 20px;
    display: flex;
    font-weight: 500;
    align-items: center;
    height: 100%;
    flex-wrap: wrap;
}

.inline-label-select {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  padding-right: 8px;
}

.inline-label-select label {
  white-space: nowrap;
  vertical-align: middle;
}

.select-box {
    width: 130px;
    height: 30px;
    text-align: center;
    text-align-last: center;
    vertical-align: middle; 
    border-radius: 0.375rem;
    border-color: black;
    color: black;
    background-color: white;
    padding: 0 10px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
}

.select-box:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.select-box option {
    text-align: center;
    padding: 10px;
}

table {
    width: 80%;
    margin: 0 auto;
    color: black;
    background-color: white;
    border-radius: 5px;
    border: 1px solid gray;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: relative;
}

.highlight-row {
    background-color: #d9d9d9 !important; 
    font-weight: 800;
    color: black;
}


.header {
    color: white;
    background-color: rgb(0, 0, 0);
    font-weight: bold;
}

.table-container {
    max-width: 100%;
    overflow-x: auto;
    display: block;
}

th, td {
    border: 1px solid gray;
}

tr:hover td {
    background-color: rgb(234, 234, 234);
    font-weight: bold;
    color: black;
}

@media (max-width: 1200px) {
    .button-group {
        padding-top: 60px;
    }
}

</style>