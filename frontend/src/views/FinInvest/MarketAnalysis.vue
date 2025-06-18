<template>
    <div class="page-container">
        <!-- ChatBot component -->
        <ChatBot :botMessage="templateChat" />



        <!-- Market Analysis -->
        <div class="market-analysis">
            <div class="market-header">
                <h1>{{ t('marketAnalysisPage.marketAnalysisTitle') }}</h1>
                <p>{{ t('marketAnalysisPage.marketAnalysisDescription') }}</p>
            </div>

            <div class="market-grid">
                <div 
                    v-for="(category, key, index) in marketAnalysis.marketAnalysis.components" 
                    :key="key"
                    class="market-card"
                >
                    <h3>
                        {{ t('marketAnalysisPage.marketAnalysis.' + key) }}
                        <i class="fas fa-chart-bar"></i>
                    </h3>

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
                        <div class="news-card" style="height: calc(30% - 5px);" v-if="news.length > 0">
                            <img 
                                :src="news[0].featuredImage" 
                                alt="AI News"
                                class="news-image"
                            >
                            <div class="news-content">
                                <router-link
                                    class="news-title clamp-text"
                                    :to="{ name: 'NewsDetail', params: { id: news[0]._id } }"
                                >
                                    {{ news[0].title }}
                                </router-link>
                                <span class="news-source">
                                    {{ news[0].sourceId?.name || 'Unknown Source' }} -
                                    {{ new Date(news[0].createdAt).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }) }}
                                </span>
                                <p class="clamp-text">
                                    {{ news[0].description }}
                                </p>
                                <div class="news-tags-container">
                                    <div
                                        v-for="(tag, index) in news[0].tags"
                                        :key="index"
                                    >
                                        <div v-if="index < 3" class="news-tag">
                                            <p style="margin: 0; padding: 0;">{{ tag }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="small-news-card-wrapper">
                            <div v-for="(newsItem, index) in smallNewsCardsFirst" :key="index" class="small-news-card">
                                <img 
                                    :src="newsItem.featuredImage" 
                                    alt="AI News"
                                    class="news-image"
                                    style="width: 50%; height: 40%;"
                                >
                                <div class="news-content">
                                    <router-link
                                        class="news-title clamp-text"
                                        :to="{ name: 'NewsDetail', params: { id: newsItem._id } }"
                                        style="font-size: 14px;"
                                    >
                                        {{ newsItem.title }}
                                    </router-link>
                                    <span class="news-source">
                                        {{ newsItem.sourceId?.name || 'Unknown Source' }} -
                                        {{ new Date(newsItem.createdAt).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }) }}
                                    </span>
                                    <div class="news-tags-container">
                                        <div
                                            v-for="(tag, index) in newsItem.tags"
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
                        <div class="small-news-card-wrapper">
                            <div v-for="(newsItem, index) in smallNewsCardsSecond" :key="index" class="small-news-card">
                                <img 
                                    :src="newsItem.featuredImage" 
                                    alt="AI News"
                                    class="news-image"
                                    style="width: 50%; height: 40%;"
                                >
                                <div class="news-content">
                                    <router-link
                                        class="news-title clamp-text"
                                        :to="{ name: 'NewsDetail', params: { id: newsItem._id } }"
                                        style="font-size: 14px;"
                                    >
                                        {{ newsItem.title }}
                                    </router-link>
                                    <span class="news-source">
                                        {{ newsItem.sourceId?.name || 'Unknown Source' }} -
                                        {{ new Date(newsItem.createdAt).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }) }}
                                    </span>
                                    <div class="news-tags-container">
                                        <div
                                            v-for="(tag, index) in newsItem.tags"
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
import { getAllNews } from '@/services/dailyNewsService';
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
const news = ref([]);

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

// Fetch news data
const fetchNews = async () => {
    try {
        const newsData = await getAllNews();
        news.value = newsData;
        // Split news into featured and small cards
        if (newsData.length > 0) {
            smallNewsCardsFirst.value = newsData.slice(1, 4);
            smallNewsCardsSecond.value = newsData.slice(4, 7);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
};

onMounted(async () => {
    getTable(selectedCategory.value);
    await fetchNews();
    stockTableRows.value.push(getStockTable(marketAnalysis.value.Stock.Title[0]));
    stockTableRows.value.push(getStockTable(marketAnalysis.value.Stock.Title[1]));
    stockTableRows.value.push(getStockTable(marketAnalysis.value.Stock.Title[2]));
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

.market-analysis {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.market-header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
}

.market-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
}

.market-header h1::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: #000;
    border-radius: 2px;
}

.market-header p {
    font-size: 1.1rem;
    color: #64748b;
    word-break: break-word;
    max-width: 700px;
    margin: 0 auto;
}

.market-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.market-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #eee;
    position: relative;
    overflow: hidden;
}

.market-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #000;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}

.market-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.market-card:hover::before {
    transform: scaleX(1);
}

.market-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #000;
    display: flex;
    align-items: center;
    gap: 10px;
}

.market-card h3 i {
    font-size: 1.2em;
    opacity: 0.8;
}

.market-card p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.market-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1.5rem;
}

.stat-item {
    text-align: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.stat-item:hover {
    background: #000;
    color: white;
    transform: translateY(-2px);
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.9rem;
    color: #666;
}

.stat-item:hover .stat-label {
    color: rgba(255, 255, 255, 0.8);
}

.chart-section {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 3rem;
    border: 1px solid #eee;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.chart-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #000;
}

.chart-controls {
    display: flex;
    gap: 1rem;
}

.chart-control-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: 1px solid #eee;
    background: white;
    color: #000;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.chart-control-btn:hover,
.chart-control-btn.active {
    background: #000;
    color: white;
    border-color: #000;
}

.insights-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.insight-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #eee;
}

.insight-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.insight-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.insight-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.insight-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #000;
}

.insight-content {
    color: #666;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .market-analysis {
        padding: 1rem;
    }

    .market-header h1 {
        font-size: 2rem;
    }

    .market-grid {
        grid-template-columns: 1fr;
    }

    .chart-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .chart-controls {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 1rem;
    }

    .chart-control-btn {
        white-space: nowrap;
    }

    .insights-section {
        grid-template-columns: 1fr;
    }
}

.container-card-big {
    margin-top: 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
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
    min-height: 180px;
    background-color: var(--white-in-light-mode);
    border-radius: 8px;
    box-shadow: 0 10px 12px rgba(0, 0, 0, 0.1);
    align-items: center;
    flex-direction: row;
}

.news-image {
    width: 40%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
}

.news-title {
    font-size: clamp(16px, 2vw, 20px);
    font-weight: 800;
    color: var(--black-in-light-mode);
    margin: 0;
    word-break: break-word;
}

.clamp-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
}

.news-datetime {
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
    display: flex;
    gap: 10px;
    flex-direction: row;
    width: 100%;
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    border-radius: 8px;
}

.small-news-card {
    width: 100%;
    min-width: 0;
}

.small-news-card .news-image {
    width: 100% !important;
    height: 150px !important;
    object-fit: cover;
    border-radius: 4px;
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

/* === Enhanced Responsive Design === */

/* Large devices (desktops, less than 1200px) */
@media (max-width: 1199.98px) {
    .market-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .trend-ai-news-container {
        flex-direction: column;
        gap: 1.5rem;
    }
    .trend-ai-news-container > .container-card-big {
        width: 100% !important;
        padding: 0 !important;
    }
}

/* Medium devices (tablets, less than 992px) */
@media (max-width: 991.98px) {
    .market-grid {
        grid-template-columns: 1fr;
    }
}

/* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
    .page-container, .market-analysis {
        padding: 0.5rem;
    }
    .market-header h1 {
        font-size: 1.5rem;
    }
    .market-header p {
        font-size: 0.9rem;
    }
    .market-card, .topic-card {
        padding: 1rem;
    }
    .title-group {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }
    .button-group {
        flex-wrap: wrap;
    }
    .date-label {
        width: 100%;
    }
    .news-card {
        flex-direction: column;
        min-height: unset;
        align-items: stretch;
    }
    .news-image {
        width: 100% !important;
        height: 180px !important;
        object-fit: cover;
    }
    .small-news-card-wrapper {
        flex-direction: column;
        gap: 10px;
    }
    .small-news-card {
        width: 100%;
        min-width: 0;
    }
}

/* Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
    .market-header {
        text-align: center;
    }
    .details-container {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
    }
    .positive-detail-container, .neutral-detail-container, .negative-detail-container {
        width: 100% !important;
        text-align: center;
    }
    .table-container {
        font-size: 12px;
    }
    .table-container th, .table-container td {
        padding: 0.5rem 0.25rem;
        word-break: break-all;
    }
    .button {
        width: 100%;
        justify-content: center;
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

@media (max-width: 640px) {
    .market-header h1 {
        font-size: 1.25rem;
        text-align: center;
    }
    
    .market-header p {
        font-size: 0.85rem;
        text-align: center;
    }
    
    .table-container {
        font-size: 12px;
        overflow-x: auto;
    }
    
    .table-container td {
        padding: 6px;
        word-break: break-all;
    }
    
    .button {
        padding: 0.4rem 0.8rem;
        font-size: 12px;
        min-height: 44px; /* Touch-friendly */
    }
    
    .date-label {
        width: 100%;
        margin-top: 10px;
        padding: 0.5rem;
        font-size: 16px; /* Prevent iOS zoom */
        min-height: 44px;
    }
    
    .news-title {
        font-size: 16px !important;
    }
    
    .component-title {
        font-size: 1.125rem;
        text-align: center;
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