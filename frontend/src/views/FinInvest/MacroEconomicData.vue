<template>
    <div class="full-screen-container">
        <!-- ChatBot component -->
        <ChatBot :botMessage="templateChat" />

        <!-- Title -->
        <div class="title">{{ t('macroEconomic') }}</div>

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
                    <label>{{ t('macroEcon.viewBy') }}:
                        <select v-model="filterType" class="select-box">
                            <option v-if="selectedTable === 'GDP'" value="quý">{{ t('macroEcon.quarter') }}</option>
                            <option v-else value="tháng">{{ t('macroEcon.month') }}</option>
                            <option value="năm">{{ t('macroEcon.year') }}</option>
                        </select>
                    </label>
                </div>

                <div class="mobile-filter">
                    <!-- Filter for quý -->
                    <template v-if="filterType === 'quý'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.from') }}:
                                <select v-model="fromQuarter" class="select-box">
                                    <option v-for="q in Quarters" :key="q" :value="`Quý ${q}`">{{ t('macroEcon.quarter') }} {{ q }}</option>
                                </select>
                            </label>
                        </div>
                    </template>

                    <!-- Filter for tháng -->
                    <template v-if="filterType === 'tháng'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.from') }}:
                                <select v-model="fromMonth" class="select-box">
                                    <option v-for="m in Months" :key="m" :value="`Tháng ${m}`">{{ t(`macroEcon.enMonth.${m}`) }}</option>
                                </select>
                            </label>
                        </div>
                    </template>

                    <!-- Filter for năm (from) -->
                    <div class="inline-label-select">
                        <label>{{ t('macroEcon.from') }}:
                            <select v-model="fromYear" class="select-box">
                                <option v-for="y in Years" :key="y" :value="y">{{ y }}</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div class="mobile-filter">
                    <!-- Filter for quý -->
                    <template v-if="filterType === 'quý'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.to') }}:
                                <select v-model="toQuarter" class="select-box">
                                    <option v-for="q in Quarters" :key="q" :value="`Quý ${q}`">{{ t('macroEcon.quarter') }} {{ q }}</option>
                                </select>
                            </label>
                        </div>
                    </template>

                    <!-- Filter for tháng -->
                    <template v-if="filterType === 'tháng'">
                        <div class="inline-label-select">
                            <label>{{ t('macroEcon.to') }}:
                                <select v-model="toMonth" class="select-box">
                                    <option v-for="m in Months" :key="m" :value="`Tháng ${m}`">{{ t(`macroEcon.enMonth.${m}`) }}</option>
                                </select>
                            </label>
                        </div>
                    </template>

                    <!-- Filter for năm (to) -->
                    <div class="inline-label-select">
                        <label>{{ t('macroEcon.to') }}:
                            <select v-model="toYear" class="select-box">
                                <option v-for="y in Years" :key="y" :value="y">{{ y }}</option>
                            </select>
                        </label>
                    </div>
                </div>

                <!-- Button -->
                <div>
                    <button 
                        class="filter-button"
                        @click="fetchData(selectedTable)"
                    >
                        {{ t('macroEcon.see') }}
                    </button>
                </div>
            </div>
        </template>

        <!-- Table Display -->
        <div class="responsive-table">
            <div v-if="loading">
                <div 
                    class="loading-container"
                    :class="{
                        'table-tong-quan': selectedTable === 'Tổng quan',
                        'table-gdp': selectedTable === 'GDP',
                        'table-fdi': selectedTable === 'FDI',
                        'table-cpi': selectedTable === 'CPI',
                        'table-xnk': selectedTable === 'Xuất-Nhập khẩu'
                    }"
                >
                </div>
            </div>
            <table v-else class="table-container">
                <thead>
                    <tr>
                        <th
                            v-for="(header, index) in tableHeaders"
                            :key="header"
                            class="header"
                            :class="{
                                'sticky-col': (index === 0 || index === 1) && selectedTable !== 'Tổng quan',
                                'sticky-first': index === 0 && selectedTable !== 'Tổng quan',
                                'sticky-second': index === 1 && selectedTable !== 'Tổng quan'
                            }"
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
                            class="cell-style"
                            :class="{
                                'highlight-row': row.length >= 1 && row[1] === '',
                                'sticky-col': (cellIndex === 0 || cellIndex === 1) && selectedTable !== 'Tổng quan',
                                'sticky-first': cellIndex === 0 && selectedTable !== 'Tổng quan',
                                'sticky-second': cellIndex === 1 && selectedTable !== 'Tổng quan'
                            }"
                        >
                            <div>{{ cell }} </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
    import axios from 'axios';
    import { nextTick } from 'vue';
    import { useI18n } from 'vue-i18n';
    import ChatBot from "../../components/chatbot/DraggableChatBot.vue";

    const { t } = useI18n();

    const templateChat = `
        ${t('macroEcon.chat')}
    `;
    
    const loading = ref(false);

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
        loading.value = true;
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
        finally {
            loading.value = false;
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

<style>
body[data-route*="macro-economic"] .chatBubble .chatBubbleContainer .chatBubbleHeader {
    background-color: black !important;
    color: white !important;
}

body[data-route*="macro-economic"] .chatBubble .chatBubbleContainer .chatBubbleHeader .chatBubbleTittle {
    color: white !important;
}

body[data-route*="macro-economic"] .chatBubble .chatBubbleContainer .chatBubbleHeader .chatBubbleTittle .link {
    color: white !important;
    text-decoration: none !important;
}

body[data-route*="macro-economic"] .chatBubble .chatBubbleContainer .chatBubbleHeader .closeChatBubble {
    color: white !important;
}
</style>

<style scoped>

.full-screen-container {
    background-color: var(--black-in-dark-mode);
    color: var(--white-in-dark-mode);
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
    /* position: fixed; */
}

.title {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    padding-top: 20px;
}

.button-group {
    padding-left: 10%;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
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
    color: var(--white-in-dark-mode);
}

.button.selected {
    border-bottom: 2px solid var(--white-in-dark-mode);
}

.filter-button {
    background-color: var(--white-in-dark-mode);
    color: var(--black-in-dark-mode);
    border-radius: 0.375rem; 
    border: none;
    box-shadow: 
        0 2px 6px rgba(181, 181, 181, 0.438), 
        0 8px 24px rgba(152, 152, 152, 0.372);
    font-weight: 500;
    width: 130px;
    height: 30px;
    margin-left: 1rem;
}

.filter {
    padding-left: 10%;
    padding-top: 0;
    padding-bottom: 20px;
    display: flex;
    font-weight: 500;
    align-items: center;
    flex-wrap: wrap;
}

.mobile-filter {
    display: flex;
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
    border: none;
    color: var(--black-in-dark-mode);
    background-color: var(--white-in-dark-mode);
    box-shadow: 
        0 2px 6px rgba(181, 181, 181, 0.438), 
        0 8px 24px rgba(152, 152, 152, 0.363);
    padding: 0 10px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    font-weight: 500;
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

.loading-container {
    height: 100px;
    border-radius: 8px;
    background: linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

.table-tong-quan {
    height: 672px;
}

.table-gdp {
    height: 961.333px;
}

.table-fdi {
    height: 208.667px;
}

.table-cpi {
    height: 816.000px;
}

.table-xnk {
    height: 1120.670px;
}

table {
    width: 80%;
    margin: 0 auto;
    color: black;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
} 

.highlight-row {
    background-color: var(--white-in-dark-mode); 
    font-weight: 800;
    color: var(--black-in-dark-mode);
    box-shadow: 0 2px 6px rgba(181, 181, 181, 0.438), 
                0 8px 24px rgba(152, 152, 152, 0.372);
}

.cell-style {
    background-color: var(--black-in-dark-mode);
    color: var(--white-in-dark-mode);
}

.header {
    color: var(--black-in-dark-mode);
    background-color: var(--white-in-dark-mode);
    font-weight: bold;
}

.header-first-column {
    width: 150px;
}

.table-container {
    width: 100%;
    color: black;
    background-color: white;
    border-radius: 5px;
    border-collapse: collapse;
    border: none;
}


.responsive-table {
    table-layout: fixed;
    overflow-x: auto;
    width: 80%;
    margin: 0 auto;
    border: none;
    box-shadow: 
        0 2px 6px rgba(181, 181, 181, 0.438), 
        0 8px 24px rgba(152, 152, 152, 0.363);
    -webkit-overflow-scrolling: touch; /* for iOS smooth scrolling */
}

/* tr:hover .header.sticky-col {
    background-color: rgb(0, 0, 0);
    color: white;
} */

@media (max-width: 768px) {
    .button-group {
        padding-top: 60px;
    }

    .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    } 

    table {
        width: 100%;
        min-width: 800px; /* Ensures table doesn't get too compressed */
    }
}

@media (max-width: 390px) {
    .button-group {
        padding-top: 10px;
        flex-direction: row;  /* Arrange buttons in rows */
        flex-wrap: wrap;      /* Allow buttons to wrap onto the next line */
        justify-content: center; /* Center the buttons horizontally */
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 0;
        font-size: 10px;
        display: flex;
    }


    .button {
        width: 45%;  /* Ensure buttons take up half of the available width */
        margin: 0;  /* Add some space between buttons */
        padding: 5px;
        text-align: center;
        align-items: center;
    }


    .full-screen-container {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        font-size: 13px;
    }

    .title {
        font-size: 1.5rem;
        padding-top: 70px;
    }

    .table-container {
        width: 100%;
        border: none;
    }
    
    tbody tr {
        border: none;
    }

    .filter {
        height: auto;
        padding: 0;
        padding-bottom: 5px;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    
    .select-box {
        width: 90px;
    }

    .mobile-filter {
        display: flex;
        padding-left: 0;
        padding-right: 0;
        justify-content: center;
    }

    .filter-button {
        justify-content: center;
        align-items: center;
    }

    .inline-label-select {
        display: flex;
        align-items: center;
        justify-content: center;
    }

}

</style>
