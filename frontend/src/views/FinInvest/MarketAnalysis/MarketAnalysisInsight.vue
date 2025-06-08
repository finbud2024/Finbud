<template>
    <div class="full-container">
      <div class="container">
        <div>
          <!-- Market Analysis -->
          <div style="width: 100%;">
            <div class="title">{{ t('marketAnalysisPage.marketAnalysisTitle') }}</div>
            <div class="market-analysis-container">
                <div class="market-analysis-card" style="background-color: var(--black-in-light-mode); color: var(--white-in-light-mode);">
                    <div>
                        <img :src="assessmentIcon" alt="assessment" class="market-analysis-icon"/>
                    </div>
                    <div class="assessment-container">
                        <div style="font-size: 18px; margin-top: 0;">{{ t('marketAnalysisPage.insight.Assessment') }}</div>
                        <div style="display: flex; align-items: center;">
                            <div style="font-size: 60px; font-weight: 700;">45</div>
                        </div>
                    </div>
                </div>
                <div v-for="(item, index) in Level" :key="index" class="market-analysis-card" :class="getCardStyle(item)">
                    <div>
                        <div style="font-size: 18px; font-weight: 600;">{{ t('marketAnalysisPage.' + item) }}</div>
                        <div style="font-size: 60px; font-weight: 700;">{{ LevelValue[index] }}</div>
                    </div>
                </div>
            </div>
          </div>

          <!--Details-->
          <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between;">
                <div class="title" style="align-self: center;">{{ t('marketAnalysisPage.insight.Details') }}</div>
                <div class="button-group">
                    <button 
                      v-for="filter in filterOptions" 
                      :key="filter"
                      :class="{ active: selectedFilter === filter }" 
                      @click="setFilter(filter)"
                    >{{ t('marketAnalysisPage.' + filter) }}</button>
                </div>
            </div>
            <div class="details-container">
                <table class="style-table">
                    <thead>
                        <tr>
                            <th style="width: 10%;">#</th>
                            <th style="width: 15%;">{{ t('marketAnalysisPage.insight.Source') }}</th>
                            <th style="width: 60%;">{{ t('marketAnalysisPage.insight.Analysis') }}</th>
                            <th style="width: 15%;">{{ t('marketAnalysisPage.insight.Reference') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in detailsTable" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.source }}</td>
                            <td>
                                <div v-for="(analysis, index) in item.analysis" :key="index" style="display: flex;">
                                    <div v-if="analysis.tag === 'up'">
                                        <img :src="upIcon" alt="up" style="width: 20px; height: 15px;"/>
                                    </div>
                                    <div v-if="analysis.tag === 'down'">
                                        <img :src="downIcon" alt="down" style="width: 20px; height: 20px;"/>
                                    </div>
                                    <div v-if="analysis.tag === 'flat'">
                                        <img :src="flatIcon" alt="flat" style="width: 20px; height: 20px;"/>
                                    </div>
                                    {{ analysis.analysis }}
                                </div>
                            </td>
                            <td>{{ item.reference }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
          </div>
          <Chart />
      </div>
    </div>
  </template>
  
<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import marketAnalysis from './marketAnalysis.json'
import assessmentIcon from '@/assets/behavior.png'
import upIcon from '@/assets/up.png'
import downIcon from '@/assets/down.png'
import flatIcon from '@/assets/flat.png'
import Chart from './Chart.vue'

const { t } = useI18n()
const route = useRoute()
const type = ref(route.params.type);
const marketAnalysisInsightTitle = ref(marketAnalysis.marketAnalysisInsight[type.value]);
const marketAnalysisInsight = ref(marketAnalysis.marketAnalysis.components[marketAnalysisInsightTitle.value]);
const Positive = ref(marketAnalysisInsight.Positive);
const Neutral = ref(marketAnalysisInsight.Neutral);
const Negative = ref(marketAnalysisInsight.Negative);
const Level = ref(["Positive", "Neutral", "Negative"]);
const LevelValue = ref([]);
const selectedFilter = ref('All');
const filterOptions = ref(['All', 'Positive', 'Neutral', 'Negative']);
const detailsTable = ref(marketAnalysis.marketAnalysisInsight.details);

onMounted(() => {
    LevelValue.value.push(marketAnalysis.marketAnalysis.components[marketAnalysisInsightTitle.value].Positive);
    LevelValue.value.push(marketAnalysis.marketAnalysis.components[marketAnalysisInsightTitle.value].Neutral);
    LevelValue.value.push(marketAnalysis.marketAnalysis.components[marketAnalysisInsightTitle.value].Negative);
})

const getCardStyle = (item) => {
    return item;
}

const setFilter = (filter) => {
    selectedFilter.value = filter;
    if (filter === 'All') {
      detailsTable.value = marketAnalysis.marketAnalysisInsight.details;
    } else if (filter === 'Positive') {
      detailsTable.value = marketAnalysis.marketAnalysisInsight.details.map(item => ({
        ...item,
        analysis: item.analysis?.filter(analysisItem => analysisItem.tag === 'up')
      })).filter(item => item.analysis.length > 0);
    } else if (filter === 'Neutral') {
      detailsTable.value = marketAnalysis.marketAnalysisInsight.details.map(item => ({
        ...item,
        analysis: item.analysis?.filter(analysisItem => analysisItem.tag === 'flat')
      })).filter(item => item.analysis.length > 0);
    } else if (filter === 'Negative') {
      detailsTable.value = marketAnalysis.marketAnalysisInsight.details.map(item => ({
        ...item,
        analysis: item.analysis?.filter(analysisItem => analysisItem.tag === 'down')
      })).filter(item => item.analysis.length > 0);
    }
}
</script>
  
  <style scoped> 
  .full-container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    animation: fadeIn 0.5s ease;
  }

  .container {
    max-width: calc(100% - 20px);
    padding: 2rem;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    opacity: 0;
    animation: slideInUp 0.5s ease forwards;
  }

  .container:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  .title {
    margin-top: 20px;
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--black-in-light-mode);
    animation: slideInDown 0.5s ease;
    text-align: center;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #1a1a1a, #4a4a4a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: gradientText 3s ease infinite;
  }

  .market-analysis-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards 0.2s;
  }

  .market-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .market-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(0,0,0,0.02), rgba(255,255,255,0.1));
    opacity: 0;
    transition: all 0.3s ease;
  }

  .market-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  .market-card:hover::before {
    opacity: 1;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .card-content {
    font-size: 1rem;
    color: #4a4a4a;
    line-height: 1.6;
  }

  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 8px;
    height: 200px;
    margin-bottom: 1rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  @keyframes gradientText {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .title {
      font-size: 2rem;
      margin-top: 1rem;
    }

    .market-analysis-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .market-card {
      padding: 1rem;
    }
  }

  @media (max-width: 480px) {
    .title {
      font-size: 1.75rem;
    }

    .card-title {
      font-size: 1.1rem;
    }

    .card-content {
      font-size: 0.9rem;
    }
  }

  .market-analysis-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .market-analysis-card {
    flex: 1;
    height: 200px;
    min-height: 200px;
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    border-radius: 4px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--white-in-light-mode);
    padding: 10px;
    flex-grow: 1;
  }

  .market-analysis-icon {
    width: 130px;
    height: 130px;
    align-self: center;
    align-items: center;
  }

  .assessment-container {
    margin-left: 10px;
    justify-content: center;
  }

  .Positive { 
    background-color: var(--black-in-light-mode);
    color: #31de31;
  }

  .Neutral {
    background-color: var(--black-in-light-mode);
    color: #e0e000;
  }

  .Negative {
    background-color: var(--black-in-light-mode);
    color: #dd2525;
  }

  .button-group {
    display: flex;
    margin-top: 20px;
    align-items: center;
    align-self: center;
    gap: 5px;
  }

  .button-group button {
    background-color: transparent;
    color: var(--black-in-light-mode);
    border: 1px solid var(--black-in-light-mode);
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .button-group button.active {
    background-color: var(--black-in-light-mode);
    color: var(--white-in-light-mode);
    border-color: var(--white-in-light-mode);
  }

  .button-group button:hover {
    background-color: var(--white-in-light-mode);
  }

  .button-group button.active:hover {
    background-color: var(--black-in-light-mode);
  }
  
  tr td {
    white-space: normal;        
    word-wrap: break-word;      
    word-break: break-word;     
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    border-radius: 10px;
  }

  .style-table {
    width: 100%;            
    table-layout: auto;    
    border-radius: 10px;
  }

  tr th {
    background-color: var(--black-in-light-mode);
    color: var(--white-in-light-mode);
  }

  .details-container {
    background-color: var(--white-in-light-mode);
    color: var(--black-in-light-mode);
    border-radius: 4px;
  }

  </style>
  