<template>
    <div class="page-container">
        <!-- ChatBot component -->
        <ChatBot :botMessage="templateChat" />

        <h1 class="page-title">
            {{ t('marketAnalysisPage.marketAnalysisTitle') }}
        </h1>

        <!-- Market Analysis -->
        <div class="container-card-big">
            <div class="market-analysis-container">
                <h2 class="component-title">
                    {{ t('marketAnalysisPage.marketAnalysisTitle') }}
                </h2>
                <div class="card-container">
                    <div 
                        v-for="(category, key, index) in marketAnalysis.marketAnalysis.components" 
                        :key="key"
                        class="card"
                    >
                        <p class="card-title">
                            {{ t('marketAnalysisPage.marketAnalysis.' + key) }}
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
                                <p :style="{ fontSize: '11px', fontWeight: 600, margin: 0, padding: 0 }">{{ t('marketAnalysisPage.Positive') }}</p>
                                <p :style="{ margin: '2px 0 0 0', fontWeight: 600, padding: 0 }">{{ category.Positive }}</p>
                            </div>
                            <div 
                                class="neutral-detail-container"
                                :style="{ width: category.Neutral }"
                            >
                                <p :style="{ fontSize: '11px', fontWeight: 600, margin: 0, padding: 0 }">{{ t('marketAnalysisPage.Neutral') }}</p>
                                <p :style="{ margin: '2px 0 0 0', fontWeight: 600, padding: 0 }">{{ category.Neutral }}</p>
                            </div>
                            <div 
                                class="negative-detail-container"
                                :style="{ width: category.Negative }"
                            >
                                <p :style="{ fontSize: '11px', fontWeight: 600, margin: 0, padding: 0 }">{{ t('marketAnalysisPage.Negative') }}</p>
                                <p :style="{ margin: '2px 0 0 0', fontWeight: 600, padding: 0 }">{{ category.Negative }}</p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <p>{{ t('marketAnalysisPage.LastUpdated') }}: {{ category.LastUpdated }}</p>
                            <a :href="`/market-analysis/insight/${category.type}`" style="color: var(--black-in-light-mode); text-decoration: none;">{{ t('marketAnalysisPage.Insight') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Trending AI News -->
        <div class="trend-ai-news-container">
            <div 
                class="container-card-big"
                style="width: calc(50% - 10px); padding-right: 0;"
            >
                <div class="topic-container">
                    <h2 class="component-title">{{ t('marketAnalysisPage.trend.title') }}</h2>
                    <div class="topic-card">
                        <div class="title-group">
                            <div class="button-group">
                                <button
                                    class="button"
                                    :class="{selected: selectedCategory === category}"
                                    v-for="(category, index) in marketAnalysis.Topic.Categories"
                                    :key="index"
                                    @click="selectedCategory = category"
                                >
                                    {{ t('marketAnalysisPage.trend.categories.' + category) }}
                                </button>
                            </div>

                            <div>
                                <label>
                                    <select 
                                        v-model="selectedDate"
                                        class="date-label"
                                    >
                                        <option
                                            v-for="(date, index) in marketAnalysis.Date"
                                            :key="index"
                                            :value="date"
                                        >
                                            {{ t('marketAnalysisPage.' + date) }}
                                        </option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        <table class="table-container">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{ t('marketAnalysisPage.trend.topic') }}</th>
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
                                            :style="{fontSize: '14px', fontWeight: '600', color: 'var(--black-in-light-mode)'}"
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
                style="width: calc(50% - 10px); padding-left: 0;"
            >
                <div class="topic-container">
                    <h2 class="component-title">
                        {{ t('marketAnalysisPage.AINews') }}
                    </h2>

                    <div class="topic-card">

                        <!-- TOP LARGE NEWS CARD -->
                        <div class="news-card" style="height: calc(30% - 5px);">
                            <img 
                                :src="marketAnalysis.AI_News.AI_News[0].link" 
                                alt="AI News"
                                class="news-image"
                            >
                            <div class="news-content">
                                <router-link
                                    class="news-title clamp-text"
                                    :to="`/market-analysis/news/${marketAnalysis.AI_News.AI_News[0].id}`"
                                >
                                    {{ marketAnalysis.AI_News.AI_News[0].title }}
                                </router-link>
                                <p class="news-datetime-creator">
                                    <strong class="news-source" style="color: black;">{{ marketAnalysis.AI_News.AI_News[0].source }}</strong> -
                                    {{ marketAnalysis.AI_News.AI_News[0].datetime }}
                                </p>
                                <p class="clamp-text">
                                    {{ marketAnalysis.AI_News.AI_News[0].content }}
                                </p>
                                <div class="news-tags-container">
                                    <div
                                        v-for="(tag, index) in marketAnalysis.AI_News.AI_News[0].tags"
                                        :key="index"
                                    >
                                        <div v-if="index < 3" class="news-tag">
                                            <p style="margin: 0; padding: 0;">{{ tag }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SMALL NEWS ROW 1 -->
                        <div class="small-news-card-wrapper">
                            <div 
                                v-for="(news, index) in smallNewsCardsFirst" 
                                :key="index" 
                                class="small-news-card"
                            >
                                <img 
                                    :src="news.link" 
                                    alt="AI News"
                                    class="news-image"
                                    style="width: 50%; height: 40%;"
                                >
                                <div class="news-content">
                                    <router-link
                                        class="news-title clamp-text"
                                        :to="`/market-analysis/news/${news.id}`"
                                        style="font-size: 14px;"
                                    >
                                        {{ news.title }}
                                    </router-link>
                                    <p class="news-datetime-creator">
                                        <strong class="news-source" style="color: black;">{{ news.source }}</strong> -
                                        {{ news.datetime }}
                                    </p>
                                    <div class="news-tags-container">
                                        <div
                                            v-for="(tag, index) in news.tags"
                                            :key="index"
                                        >
                                            <div v-if="index < 3" class="news-tag">
                                                <p style="margin: 0; padding: 0;">{{ tag }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SMALL NEWS ROW 2 -->
                        <div class="small-news-card-wrapper">
                            <div 
                                v-for="(news, index) in smallNewsCardsSecond" 
                                :key="index" 
                                class="small-news-card"
                            >
                                <img 
                                    :src="news.link" 
                                    alt="AI News"
                                    class="news-image"
                                    style="width: 50%; height: 40%;"
                                >
                                <div class="news-content">
                                    <router-link
                                        class="news-title clamp-text"
                                        :to="`/market-analysis/news/${news.id}`"
                                        style="font-size: 14px;"
                                    >
                                        {{ news.title }}
                                    </router-link>
                                    <p class="news-datetime-creator">
                                        <strong class="news-source" style="color: black;">{{ news.source }}</strong> -
                                        {{ news.datetime }}
                                    </p>
                                    <div class="news-tags-container">
                                        <div
                                            v-for="(tag, index) in news.tags"
                                            :key="index"
                                        >
                                            <div v-if="index < 3" class="news-tag">
                                                <p style="margin: 0; padding: 0;">{{ tag }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Stock -->
        <div class="stock-container">
            <div class="container-card-big">
                <div class="stock-card-container">
                    <div
                        v-for="(title, index) in marketAnalysis.Stock.Title"
                        :key="index"
                        class="stock-card"
                    >
                        <div style="display: flex; justify-content: space-between; flex-wrap: wrap">
                            <h2 
                                class="component-title"
                                :style="{color: title === 'Positive' ? '#27db54' : title === 'Neutral' ? '#e2d32b' : '#d23737'}"
                            >
                                {{ title }}
                            </h2>
                            <div>
                                <label>
                                    <select 
                                        v-model="selectedDate"
                                        class="date-label"
                                    >
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
                                    <th>{{ t('marketAnalysisPage.trend.topic') }}</th>
                                    <th></th>
                                    <th>{{ t('marketAnalysisPage.mentions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(row, rowIndex) in stockTableRows[index]"
                                    :key="rowIndex"
                                >
                                    <td>{{ row.rank }}</td>
                                    <td>
                                        <div
                                            :style="{fontSize: '14px', fontWeight: '600', color: 'var(--black-in-light-mode)'}"
                                        >
                                            {{ row.stock_code }}
                                        </div>
                                    </td>
                                    <td>
                                        <div 
                                            class="progress-container"
                                            :style="{backgroundColor: title === 'Positive' ? '#80ed9b' : title === 'Neutral' ? '#fff480' : '#fa7979'}"
                                        >
                                            <div class="progress-bar" :style="{ width: (1 - (row.mentions / maxVal[title])) * 100 + '%' }"></div>
                                        </div>
                                    </td>
                                    <td>
                                        {{ row.mentions }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

import ChatBot from "../../components/ChatBot/DraggableChatBot.vue";
import marketAnalysisData from './MarketAnalysis/marketAnalysis.json';
import trendingIcon from '@/assets/increaseTrend.png';
import fallingIcon from '@/assets/decreaseTrend.png';
import emergingIcon from '@/assets/emergingTrend.png';
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const { t } = useI18n()

const marketAnalysis = ref(marketAnalysisData);
const selectedCategory = ref(marketAnalysis.value.Topic.Categories[0]);
const tableRows = ref([]);
const stockTableRows = ref([]);
const selectedDate = ref(marketAnalysis.value.Date.Today);
const smallNewsCardsFirst = ref([]);
const smallNewsCardsSecond = ref([]);
const maxVal = ref({});

const getTable = (tName) => {
    tableRows.value = marketAnalysis.value.Topic.Articles[selectedDate.value][tName];
}

watch(selectedDate, (newDate) => {
    getTable(selectedCategory.value);
});

const getStockTable = (tName) => {
    const temp = marketAnalysis.value.Stock.Stock[tName].Data;
    let max = 0;
    for (let i = 0; i < temp.length; i++) {
        if (temp[i].mentions > max) {
            max = temp[i].mentions;
        }
    }
    maxVal.value[tName] = max;
    return temp;
}

const getIcon = (tag) => {
    if (tag === 'Trending') return trendingIcon;
    if (tag === 'Falling') return fallingIcon;
    if (tag === 'Emerging') return emergingIcon;
}

onMounted(async () => {
    getTable(selectedCategory.value);
    smallNewsCardsFirst.value = marketAnalysis.value.AI_News.AI_News.slice(1).slice(0, 3);
    smallNewsCardsSecond.value = marketAnalysis.value.AI_News.AI_News.slice(1).slice(3, 6);
    stockTableRows.value.push(getStockTable(marketAnalysis.value.Stock.Title[0]));
    stockTableRows.value.push(getStockTable(marketAnalysis.value.Stock.Title[1]));
    stockTableRows.value.push(getStockTable(marketAnalysis.value.Stock.Title[2]));
    console.log(maxVal.value['Positive']);
});

watch(selectedCategory, (newCategory) => {
    getTable(newCategory);
});
    
</script>

<style scoped>

.page-container {
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    overflow-y: auto;
    overflow-x: hidden;
}

.page-title {
    font-size: 60px;
    font-weight: 800;
    margin-top: 20px;
    margin-bottom: 5px;
    text-align: center;
}

@media (max-width: 768px) {
    .page-title {
        font-size: 28px;
    }
}

.container-card-big {
    margin-top: 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
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
    flex-wrap: wrap;
}

.card {
    width: calc((100% - 40px) / 3);
    min-width: 250px;
    flex: 1;
    border-radius: 10px;
    box-shadow: 
        0 2px 6px rgba(181, 181, 181, 0.438);
    background-color: transparent;
    color: var(--black-in-light-mode);
    padding: 20px;
    box-sizing: border-box;
}

.card:hover {
    transform: translateY(-5px);
}

.card-title, .component-title {
    font-weight: 800;
    font-size: 24px;
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
  background-color: #27db54; /* green */
}

.neutral {
  background-color: #e2d32b; /* amber */
}

.negative {
  background-color: #d23737; /* red */
}

.details-container {
    display: flex;
    font-size: 12px;
    margin: 0;
    padding: 0;
}

.positive-detail-container {
    color: #27db54; /* green */
}

.neutral-detail-container {
    color: #e2d32b; /* amber */
}

.negative-detail-container {
    color: #d23737; /* red */
}

.topic-container {
    padding: 10px;
    height: 100%;
}

.topic-card {
    border-radius: 10px;
    box-shadow: 
        0 2px 6px rgba(181, 181, 181, 0.438);
    background-color: transparent;
    color: var(--black-in-light-mode);
    width: 100%;
    font-size: 15px;
    padding: 10px;
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
}

.trend-ai-news-container {
    display: flex;
    width: 100%;
    gap: 20px;
    flex-wrap: wrap;
    align-items: stretch;
}

.button-group {
    display: flex;
    padding: 0;
    flex-wrap: wrap;
    gap: 10px;
}

.title-group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease-in-out;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    color: var(--black-in-light-mode);
    white-space: nowrap;
}

.button.selected {
    border-radius: 10px;
    background-color: var(--black-in-light-mode);
    color: var(--white-in-light-mode);
}

.news-card {
    display: flex;
    gap: 10px;
    width: 100%;
    height: 200px;
    background-color: var(--white-in-light-mode);
    border-radius: 8px;
    box-shadow: 0 10px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    align-items: center;
}

.news-image {
    width: 40%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
}

.news-title {
    font-size: 20px;
    font-weight: 800;
    color: var(--black-in-light-mode);
    margin: 0;
}

.clamp-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.news-datetime-creator {
    font-size: 12px;
    font-weight: 400;
    color: rgb(184, 184, 184);
    font-style: italic;
    margin: 0;
    padding: 0;
}

.news-tags-container {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.news-tag {
    font-size: 12px;
    font-weight: 400;
    color: var(--white-in-light-mode);
    background-color: var(--black-in-light-mode);
    font-style: italic;
    margin: 0;
    padding: 5px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
}

.news-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
    flex: 1;
}

.small-news-card-wrapper {
    padding-top: 10px;
    display: flex;
    gap: 10px;
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    border-radius: 8px;
}

.small-news-card {
    gap: 10px;
    width: 100%;
    height: 100%;
    align-items: center;
    padding-top: 10px;
    font-size: 10px;
    height: calc(100% - 10px);
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
}

.stock-card-container {
    display: flex;
    width: 100%;
    padding: 10px;
    gap: 20px;
    flex-wrap: wrap;
}

.stock-card {
    width: calc((100% - 40px) / 3);
    height: 100%;
    background-color: var(--white-in-light-mode);
    border-radius: 8px;
    box-shadow: 
        0 2px 6px rgba(181, 181, 181, 0.438);
    color: white;
    padding: 10px;
}

@media (max-width: 1000px) {
    .trend-ai-news-container > .container-card-big {
        width: 100% !important;
    }
}

.table-container {
    margin-top: 20px;
    margin-left: 0;
    margin-right: 0;
    justify-content: center;
    width: 100%;
    overflow-x: auto;
    display: block;
    border-radius: 10px;
    border: none;
}

.progress-container {
  width: 100%;
  background-color: #717171;
  overflow: hidden;
  position: relative;
  height: 24px;
}

.progress-bar {
  background-color: rgb(255, 255, 255);
  height: 100%;
  transition: width 0.3s ease;
}


thead tr th {
    font-size: 14px;
    font-weight: 800;
    color: var(--black-in-light-mode);
    background-color: var(--white-in-light-mode);
}

tbody tr td {
    color: var(--black-in-light-mode);
    background-color: var(--white-in-light-mode);
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
    color: var(--white-in-light-mode);
    background-color: var(--black-in-light-mode);
    border: none;
    width: 150px;
}

@media (max-width: 768px) {
    .table-container {
        font-size: 14px;
    }
    
    .table-container td {
        padding: 8px;
    }
    
    .button {
        padding: 0.3rem 0.7rem;
        font-size: 14px;
    }
    
    .date-label {
        width: 100%;
        margin-top: 10px;
    }
    
    .date-label select {
        width: 100%;
    }
}

@media (max-width: 460px) {
    .stock-card-container {
        display: block;
        width: 100%;
    }

    .stock-card {
        width: 100%;
        margin-bottom: 10px;
    }

}
</style>