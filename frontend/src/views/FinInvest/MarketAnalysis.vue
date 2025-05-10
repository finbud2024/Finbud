<template>
    <div>
        <h1 class="page-title">
            {{ marketAnalysis.marketAnalysisTitle }}
        </h1>

        <div class="container-card-big">
            <div class="market-analysis-container">
                <h2 class="component-title">
                    {{ marketAnalysis.marketAnalysis.title }}
                </h2>
                <div class="card-container">
                    <div 
                        v-for="(category, key, index) in marketAnalysis.marketAnalysis.components" 
                        :key="key"
                        class="card"
                    >
                        <p class="card-title">
                            {{ key }}
                        </p>

                        <div 
                            class="percentage-bar"
                            :style="{ width: category.Positive + category.Neutral + category.Negative }"
                        >
                            <span class="positive" :style="{ width: category.Positive }"></span>
                            <span class="neutral" :style="{ width: category.Neutral }"></span>
                            <span class="negative" :style="{ width: category.Negative }"></span>
                        </div>

                        <div class="details-container">
                            <div 
                                class="positive-detail-container"
                                :style="{ width: category.Positive }"
                            >
                                <p :style="{ fontSize: '11px', margin: 0, padding: 0 }">Positive</p>
                                <p :style="{ margin: '2px 0 0 0', padding: 0 }">{{ category.Positive }}</p>
                            </div>
                            <div 
                                class="neutral-detail-container"
                                :style="{ width: category.Neutral }"
                            >
                                <p :style="{ fontSize: '11px', margin: 0, padding: 0 }">Neutral</p>
                                <p :style="{ margin: '2px 0 0 0', padding: 0 }">{{ category.Neutral }}</p>
                            </div>
                            <div 
                                class="negative-detail-container"
                                :style="{ width: category.Negative }"
                            >
                                <p :style="{ fontSize: '11px', margin: 0, padding: 0 }">Negative</p>
                                <p :style="{ margin: '2px 0 0 0', padding: 0 }">{{ category.Negative }}</p>
                            </div>
                        </div>

                        <p>Last Updated: {{ category.LastUpdated }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="trend-ai-news-container">
        <div 
            class="container-card-big"
            style="width: calc(50% - 20px)"
        >
            <div class="topic-container">
                <h2 class="component-title">{{ marketAnalysis.Topic.Topic }}</h2>
                <div class="topic-card">
                    <div class="button-group">
                        <button
                            class="button"
                            :class="{selected: selectedCategory === category}"
                            v-for="(category, index) in marketAnalysis.Topic.Categories"
                            :key="index"
                            @click="selectedCategory = category"
                        >
                            {{ category }}
                        </button>

                        <div>
                            <label class="date-label">
                                <select>
                                    <option
                                        v-for="(date, index) in marketAnalysis.Date"
                                        :key="index"
                                    >
                                        {{ date }}
                                    </option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <table class="table-container">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Topic</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, rowIndex) in tableRows"
                                :key="rowIndex"
                            >
                                <td>{{ row.Rank }}</td>
                                <td>
                                    <a
                                        :style="{fontSize: '14px', fontWeight: '600', color: 'black'}"
                                        :href="row.Link"
                                    >
                                        {{ row.Title }}
                                    </a>
                                    <div style="display: flex; gap: 10px;">
                                        <div
                                            :style="{fontSize: '12px', fontWeight: '400'}"
                                        >
                                            {{ row.Time }}
                                        </div>
                                        <div
                                            :style="{display: 'flex', gap: '5px'}"
                                        >
                                            <img 
                                                v-if="row.Tag === 'Trending' || row.Tag === 'Emerging' || row.Tag === 'Falling'"
                                                :src="getIcon(row.Tag)" 
                                                :style="{width: '15px', height: '15px'}" 
                                            />
                                            <div
                                                :style="{fontSize: '12px', fontWeight: '700'}"
                                                :class="{'trending': row.Tag === 'Trending', 'emerging': row.Tag === 'Emerging', 'falling': row.Tag === 'Falling'}"
                                            >
                                                {{ row.Tag }}
                                        </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>  

        <div 
            class="container-card-big"
            style="width: calc(50% - 20px)"
        >

        </div>
    </div>

</template>

<script setup>

import marketAnalysisData from './marketAnalysis.json';
import trendingIcon from '@/assets/increaseTrend.png';
import fallingIcon from '@/assets/decreaseTrend.png';
import emergingIcon from '@/assets/emergingTrend.png';
import { ref, onMounted, watch } from 'vue'

const marketAnalysis = ref(marketAnalysisData);
const selectedCategory = ref(marketAnalysis.value.Topic.Categories[0]);
const tableRows = ref([]);

const getTable = (tName) => {
    tableRows.value = marketAnalysis.value.Topic.Articles[tName];
}

const getIcon = (tag) => {
    if (tag === 'Trending') return trendingIcon;
    if (tag === 'Falling') return fallingIcon;
    if (tag === 'Emerging') return emergingIcon;
}

onMounted(async () => {
    getTable(selectedCategory.value);
});

watch(selectedCategory, (newCategory) => {
    getTable(newCategory);
});
    
</script>

<style scoped>

.page-title {
    font-size: 40px;
    font-weight: 1000;
    margin-top: 20px;
    margin-bottom: 5px;
    text-align: center;
}

.container-card-big {
    margin-top: 0;
    padding: 20px;
}

.market-analysis-container {
    padding: 10px;
    width: 100%;
}

.card-container {
    margin: 0;
    display: flex;
    width: 100%;
    gap: 20px;
}

.card {
    width: calc((100% - 40px) / 3); 
    border-radius: 8px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    background-color: rgb(43, 43, 43) !important;
    color: white !important;
    padding: 20px;
}

.card:hover {
    background-color: rgb(72, 72, 72) !important;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.card-title, .component-title {
    font-weight: 800;
    font-size: 20px;
    margin-bottom: 12px;
}

.percentage-bar {
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #eee;
  margin-top: 5px;
}

.percentage-bar span {
  height: 100%;
}

.positive {
  background-color: #80ed9b; /* green */
}

.neutral {
  background-color: #fff480; /* amber */
}

.negative {
  background-color: #fa7979; /* red */
}

.details-container {
    display: flex;
    font-size: 12px;
    margin: 0;
    padding: 0;
}

.positive-detail-container {
    color: #80ed9b; /* green */
}

.neutral-detail-container {
    color: #fff480; /* amber */
}

.negative-detail-container {
    color: #fa7979; /* red */
}

.topic-container {
    padding: 10px;
}

.topic-card {
    border-radius: 8px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    background-color: rgb(43, 43, 43) !important;
    color: white !important;
    width: 100%;
    font-size: 15px;
    padding: 10px;
}

.button-group {
    display: flex;
    padding: 0;
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  border-radius: 0.375rem; /* rounded-md */
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  color: white;
}

.button.selected {
    border-bottom: 2px solid white;
}

.trend-ai-news-container {
    display: flex;
    width: 100%;
    gap: 20px;
}

.table-container {
    margin-top: 10px;
    margin-left: 0;
    margin-right: 0;
    justify-content: center;
    width: 100%
}

thead tr th {
    border: none;
    background-color: rgb(229, 229, 229);
    color: rgb(101, 101, 101);
    font-size: 14px;
    font-weight: 800;
}

.trending {
    color: #23d30b; /* green */
}

.emerging {
    color: #ffa600; /* amber */
}

.falling {
    color: #dc0101; /* red */
}

.date-label {
    font-size: 14px;
    font-weight: 800;
    color: rgb(101, 101, 101);
    width: 100px;
}

</style>