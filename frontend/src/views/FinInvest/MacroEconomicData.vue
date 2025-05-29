<template>
    <div class="full-screen-container">
        <ChatBot :botMessage="templateChat" />
        <div class="title">{{ t('macroEconomic') }}</div>

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

        <template v-if="selectedTable && selectedTable !== 'Tổng quan'">
            <div class="filter">
                <div class="inline-label-select">
                    <label>{{ t('macroEcon.viewBy') }}:
                        <select v-model="filterType" class="select-box">
                            <option v-if="selectedTable === 'GDP'" value="quý">{{ t('macroEcon.quarter') }}</option>
                            <option v-else value="tháng">{{ t('macroEcon.month') }}</option>
                            <option value="năm">{{ t('macroEcon.year') }}</option>
                        </select>
                    </label>
                </div>

                <div class="mobile-filter">
                    <template v-if="filterType === 'quý'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.from') }}:
                                <select v-model="fromQuarter" class="select-box">
                                    <option v-for="q in Quarters" :key="q" :value="`Quý ${q}`">{{ t('macroEcon.quarter') }} {{ q }}</option>
                                </select>
                            </label>
                        </div>
                    </template>
                    <template v-if="filterType === 'tháng'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.from') }}:
                                <select v-model="fromMonth" class="select-box">
                                    <option v-for="m in Months" :key="m" :value="`Tháng ${m}`">{{ t(`macroEcon.enMonth.${m}`) }}</option>
                                </select>
                            </label>
                        </div>
                    </template>
                    <div class="inline-label-select">
                        <label>{{ t('macroEcon.from') }}:
                            <select v-model="fromYear" class="select-box">
                                <option v-for="y in Years" :key="y" :value="y">{{ y }}</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div class="mobile-filter">
                    <template v-if="filterType === 'quý'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.to') }}:
                                <select v-model="toQuarter" class="select-box">
                                    <option v-for="q in Quarters" :key="q" :value="`Quý ${q}`">{{ t('macroEcon.quarter') }} {{ q }}</option>
                                </select>
                            </label>
                        </div>
                    </template>
                    <template v-if="filterType === 'tháng'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.to') }}:
                                <select v-model="toMonth" class="select-box">
                                    <option v-for="m in Months" :key="m" :value="`Tháng ${m}`">{{ t(`macroEcon.enMonth.${m}`) }}</option>
                                </select>
                            </label>
                        </div>
                    </template>
                    <div class="inline-label-select">
                        <label>{{ t('macroEcon.to') }}:
                            <select v-model="toYear" class="select-box">
                                <option v-for="y in Years" :key="y" :value="y">{{ y }}</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div>
                    <button class="filter-button" @click="fetchData(selectedTable)">
                        {{ t('macroEcon.see') }}
                    </button>
                </div>
            </div>
        </template>

        <div class="responsive-table">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th v-for="(header, index) in tableHeaders" :key="header" class="header">
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in tableRows" :key="rowIndex">
                            <td v-for="(cell, cellIndex) in row" :key="cellIndex" :class="{ 'highlight-row': row.length >= 1 && row[1] === '' }">
                                {{ cell }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
    import axios from 'axios';
    import { nextTick } from 'vue';
    import { useI18n } from 'vue-i18n';
    import ChatBot from "../../components/ChatBot/DraggableChatBot.vue";

    const { t } = useI18n();

    const templateChat = `
        ${t('macroEcon.chat')}
    `;

    const tableRows = ref({});
    const tableHeaders = ref([]);
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

    const header = computed(() => ({
        'Tổng quan': [
            t('macroEcon.header.STT'), 
            t('macroEcon.header.Chỉ tiêu'), 
            t('macroEcon.header.Đơn vị tính'), 
            t('macroEcon.header.Số liệu mới nhất'), 
            t('macroEcon.header.Giá trị'), 
            t('macroEcon.header.Đồ thị')
        ],
        'GDP': [
            t('macroEcon.header.Chỉ tiêu'), 
            t('macroEcon.header.Đơn vị tính')
        ],
        'FDI': [
            t('macroEcon.header.Chỉ tiêu'), 
            t('macroEcon.header.Đơn vị tính')
        ],
        'CPI': [
            t('macroEcon.header.Chỉ tiêu'), 
            t('macroEcon.header.Đơn vị tính')
        ],
        'Xuất-Nhập khẩu': [
            t('macroEcon.header.Chỉ tiêu'), 
            t('macroEcon.header.Đơn vị tính')
        ]
    }));

    const tableSources = {
        'Tổng quan': '.netlify/functions/server/api/vietstock/Overview',
        'GDP': '.netlify/functions/server/api/vietstock/GDP/filter/',
        'FDI': '.netlify/functions/server/api/vietstock/FDI',
        'CPI': '.netlify/functions/server/api/vietstock/CPI/filter/',
        'Xuất-Nhập khẩu': '.netlify/functions/server/api/vietstock/ImportExport/filter/',
    };

    watch([selectedTable, header], ([newTable]) => {
        if (newTable) {
            tableHeaders.value = header.value[newTable] || [];
        }
    }, { immediate: true });

    const getData = async (tName) => {
        const url = tableSources[tName];
        console.log('Start fetching data from api: ', url);
        let fType = '';
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
                        let temp = '';
                        if (row.latestData?.chart) {
                            temp = row.latestData.chart;
                            if (temp.includes('Tháng')) {
                                const month = t(`macroEcon.enMonth.${temp.match(/Tháng (\d+)\//)[1]}`);
                                const year = temp.match(/\/(\d{4})$/)[1];
                                temp = `${month} ${year}`;
                            }
                            else if (temp.includes('Quý')) {
                                const quarter = t(`macroEcon.enQuarter.${temp.match(/Quý (\d+)\//)[1]}`);
                                const year = temp.match(/\/(\d{4})$/)[1];
                                temp = `${quarter} ${year}`;
                            }
                        }

                        result.push([
                            row.ordinalNumber,
                            t(`macroEcon.Tổng quan.${row.indicator}`),
                            t(`macroEcon.unit.${row.unit}`),
                            temp,
                            row.latestData?.value,
                            row.latestData?.chartUrl
                        ]);
                    });

                    tableHeaders.value = header.value[tName] || [];
                    return result;
                }
                else {
                    console.log(`Error fetching table ${tName}`);
                }
            }
            else if (tName === 'FDI') {
                fType = (filterType.value === 'năm') ? 'year' : 'month';
                console.log('fType: ', fType);
                console.log('fromMonth: ', fromMonth.value);
                console.log('fromYear: ', fromYear.value);
                console.log('toMonth: ', toMonth.value);
                console.log('toYear: ', toYear.value);
                response = await axios.post(`${url}/${fType}`, {
                    fromMonth: fromMonth.value,
                    fromYear: fromYear.value,
                    toMonth: toMonth.value,
                    toYear: toYear.value       
                });
                if (response) {
                    const rows = response.data[0];
                    console.log(rows);
                    let result = [];
                    const headers = [];

                    const temp = (fType === 'year') ? 'Năm' : 'Tháng';

                    if (fType === 'month') {
                        rows.headers.forEach(header => {
                            const month = fType === 'month' ? t(`macroEcon.enMonth.${header.match(/Tháng (\d+)\//)[1]}`) : '';
                            const year = header.match(/\/(\d{4})$/)[1];
                            if (fType === 'month')  
                                headers.push(`${month} ${year}`);
                            else headers.push(`${year}`);
                        });
                    }
                    else {
                        rows.headers.forEach(header => {
                            headers.push(`${header}`);
                        });
                    }

                    let maxLength = 0;
                    result = rows.data.map(row => {
                        const rowData = [t(`macroEcon.${tName}.${temp}.${row[0]}`)];
                        if (row.length > 1) {
                            rowData.push(t(`macroEcon.unit.${row[1]}`));
                        }
                        for (let i = 2; i < row.length - 1; i++) {
                            rowData.push(row[i]);   
                        }   
                        maxLength = Math.max(maxLength, rowData.length);
                        return rowData;
                    });

                    result = result.map(row => {
                        while (row.length < maxLength) {
                            row.push('');
                        }
                        return row;
                    });

                    console.log('Result: ', result);    
                    tableHeaders.value = (header.value[tName] || []).concat(headers);
                    return result;
                }
                else {
                    console.log(`Error fetching table`);
                }
            }
            else {
                if (tName === 'GDP') {
                    fType = (filterType.value === 'năm') ? 'year' : 'quarter';
                    console.log('fType: ', fType);
                    console.log('filterType: ', filterType.value);
                    response = await axios.post(`${url}${fType}`, {
                        startQuarter: fromQuarter.value,
                        startYear: fromYear.value,
                        endQuarter: toQuarter.value,
                        endYear: toYear.value
                    });
                }
                else {
                    fType = (filterType.value === 'năm') ? 'year' : 'month';
                    console.log('fType: ', fType);
                    console.log('filterType: ', filterType.value);
                    response = await axios.post(`${url}${fType}`, {
                        startMonth: fromMonth.value,
                        startYear: fromYear.value,
                        endMonth: toMonth.value,
                        endYear: toYear.value
                    });
                    console.log('Response: ', response.data.data);
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
                            let temp = '';
                            if (row.quarter !== null) {
                                if (row.quarter.includes('Quý')) {
                                    temp = row.quarter.replace('Quý', '');
                                    temp = t(`macroEcon.enQuarter.${parseInt(temp)}`);
                                }
                                else {
                                    temp = row.quarter.replace('tháng', '');
                                    temp = temp + ` ${t('macroEcon.month')}`;
                                }
                            }
                            headers.push(`${temp} ${row.year}`);
                        } else {
                            if (row.month !== null) {
                                let temp = row.month.replace('Tháng', '');
                                temp = t(`macroEcon.enMonth.${parseInt(temp)}`);
                                headers.push(`${temp} ${row.year}`);
                            }
                            else {
                                headers.push(row.year);
                            }
                        }

                        for (let i = 0; i < row.value.length; i++) {
                            const data = row.value[i];
                            if (fType === 'year') {
                                fType = 'Năm';
                            }
                            else if (fType === 'quarter') {
                                fType = 'Quý';
                            }
                            else if (fType === 'month') {
                                fType = 'Tháng';
                            }
                            if (data.category) {
                                if (result[i].length == 0) {
                                    result[i].push(t(`macroEcon.${tName}.${fType}.${data.category}`)); 
                                    result[i].push('');
                                    result[i].push('');
                                }
                                else result[i].push('');
                            }
                            else {
                                if (result[i].length === 0) {
                                    result[i].push(t(`macroEcon.${tName}.${fType}.${data.chi_tieu}`));
                                    result[i].push(t(`macroEcon.unit.${data.don_vi}`));
                                } 
                                result[i].push(data.gia_tri);
                            }
                        };
                    }

                    tableHeaders.value = (header.value[tName] || []).concat(headers);

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
        document.body.setAttribute('data-route', 'macro-economic');
        fetchData(selectedTable.value);
    });

    onUnmounted(() => {
        document.body.removeAttribute('data-route');
    });

    watch(selectedTable, (newTable) => {
        fetchData(newTable);
    });

</script>

<style scoped>
.full-screen-container {
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
  padding: 1rem;
}
.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  padding-top: 20px;
}
.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.button.selected {
  border-bottom: 2px solid black;
}
.filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  gap: 0.5rem;
}
.inline-label-select {
  display: flex;
  align-items: center;
}
.select-box {
  width: 130px;
  height: 30px;
  border-radius: 0.375rem;
  border: 1px solid black;
  padding: 0 10px;
  text-align: center;
  appearance: none;
  background-color: white;
  color: black;
  cursor: pointer;
}
.select-box:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}
.filter-button {
  background-color: black;
  color: white;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  border: none;
}
.table-container {
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 0.75rem;
  border: 1px solid #ddd;
  text-align: left;
}
.header {
  background-color: black;
  color: white;
}
.highlight-row {
  background-color: #f0f0f0;
  font-weight: bold;
}
@media (max-width: 768px) {
  .full-screen-container {
    padding: 0.5rem;
  }
  .title {
    font-size: 1.5rem;
  }
  .button {
    flex: 1 1 45%;
    min-width: 120px;
    text-align: center;
  }
  .select-box {
    width: 100px;
  }
  table {
    min-width: 600px;
  }
}
</style>
