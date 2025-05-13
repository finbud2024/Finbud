<template>
    <div class="full-container">
      <div class="container">
        <div>
          <!-- Market Analysis -->
          <div style="width: 100%;">
            <div class="title">{{ t('marketAnalysisPage.marketAnalysisTitle') }}</div>
            <div class="market-analysis-container">
                <div class="market-analysis-card" style="background-color: #000000; color: white;">
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
  }
  
  .container {
    max-width: calc(100% - 20px);
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    border-radius: 4px;
    border: 1px solid rgb(221, 221, 221);
  }

  .title {
    margin-top: 20px;
    font-size: 30px;
    font-weight: 750;
    color: black;
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
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    border-radius: 4px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(221, 221, 221);
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
    background-color: #000000;
    color: #acfeac;
  }

  .Neutral {
    background-color: #000000;
    color: #ffff9e;
  }

  .Negative {
    background-color: #000000;
    color: #fd9e9e;
  }

  .button-group {
    display: flex;
    margin-top: 20px;
    align-items: center;
    align-self: center;
    gap: 5px;
  }

  .button-group button {
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .button-group button.active {
    background-color: #0a0a0a;
    color: white;
    border-color: #606060;
  }

  .button-group button:hover {
    background-color: #f0f0f0;
  }

  .button-group button.active:hover {
    background-color: #424242;
  }
  
  td {
    white-space: normal;        
    word-wrap: break-word;      
    word-break: break-word;     
  }

  .style-table {
    width: 100%;            
    table-layout: auto;    
    border-radius: 4px;
  }

  tr th {
    background-color: #000000;
    color: white;
  }

  .details-container {
    background-color: #fff;
    color: #000;
    border-radius: 4px;
  }

  </style>
  