```vue
<template>
    <div class="data-page-container">
        <div class="data-header">
            <h3 class="text-xl font-semibold">{{ ticker.toUpperCase() }} Documents</h3>
            <div class="buttons-header">
                <BButton style="white-space: nowrap;" variant="primary" @click="gotoCompanyReport">
                    View {{ ticker.toUpperCase() }} Company Report
                </BButton>

                <BButton style="white-space: nowrap;" variant="light" @click="showSearchModal = true">
                    <i class="bi bi-search me-2"></i>
                    <span>Search ticker...</span>
                </BButton>
                <TicketSearchModal 
    :show="showSearchModal"
    :companies="companies"
    @close="showSearchModal = false"
    @select="handleTickerSelect"
  />
            </div>
        </div>

        <div class="data-body">
          
          <DataCard title="Financials" :docsCount="data?.financials.length || 0">
            <!-- Skeleton Loader -->
            <div v-if="loadingCards">
              <div class="skeleton-card"></div>
            </div>
            <div v-for="item in data?.financials" :key="item.id" class="card-row">
              <a :href="item.documentUrl" class="doc-link">{{ item.reportType }}</a>
              <span>{{ ticker.toUpperCase() }}</span>
              <span>{{ item.periodDate }}</span>
              <span>{{ item.filingDate }}</span>
            </div>
          </DataCard>

      <DataCard title="News" :docsCount="data?.news.length || 0">
        <!-- Skeleton Loader -->
        <div v-if="loadingCards">
              <div class="skeleton-card"></div>
            </div>
        <div v-for="item in data?.news" :key="item.id" class="card-row">
          <a :href="item.documentUrl" class="doc-link">{{ item.reportType }}</a>
          <span>{{ ticker.toUpperCase() }}</span>
          <span>{{ item.periodDate }}</span>
          <span>{{ item.filingDate }}</span>
        </div>
      </DataCard>

      <DataCard title="Proxies" :docsCount="data?.proxies.length || 0">
        <!-- Skeleton Loader -->
        <div v-if="loadingCards">
              <div class="skeleton-card"></div>
            </div>
        <div v-for="item in data?.proxies" :key="item.id" class="card-row">
          <a :href="item.documentUrl" class="doc-link">{{ item.reportType }}</a>
          <span>{{ ticker.toUpperCase() }}</span>
          <span>{{ item.reportType }}</span>
          <span>{{ item.filingDate }}</span>
        </div>
      </DataCard>

      <DataCard title="Form 4" :docsCount="data?.form4.length || 0">
        <!-- Skeleton Loader -->
        <div v-if="loadingCards">
              <div class="skeleton-card"></div>
            </div>
        <div v-for="item in data?.form4" :key="item.id" class="card-row">
          <a :href="item.documentUrl" class="doc-link">Form 4</a>
          <span>{{ ticker.toUpperCase() }}</span>
          <span>{{ item.periodDate }}</span>
          <span>{{ item.filingDate }}</span>
        </div>
      </DataCard>

        </div>
        <div v-if="earningItems.length > 0">
          <b-table :items="earningItems" :fields="fields" bordered striped small hover>
        <template #cell(reportDate)="data">
          {{ data.item.reportDate }}
        </template>
        <template #cell(fiscalDateEnding)="data">
          {{ data.item.fiscalDateEnding }}
        </template>
      </b-table>
        </div>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { ref, onMounted, watch, computed } from 'vue';
import { BButton, BTable } from 'bootstrap-vue-3';
import DataCard from '@/components/finInvest/finDataPage/DataCard.vue';
import TicketSearchModal from '@/components/finInvest/finDataPage/TicketSearchModal.vue';
import { getAllCompanies, fetchCompanyFilings, getCompanyFilingsFromDB, getEarningCalendars, getEarningTranscripts } from '@/services/finDataService';

const route = useRoute();
const router = useRouter()
const ticker = ref(route.params.ticker || 'AAPL')
const showSearchModal = ref(false)
// const companies = ref([])
const financials = ref([])
const proxies = ref([])
const form4 = ref([])
const earningTranscripts = ref([])
const news = ref([])
const earningItems = ref([]);
const loadingCards = ref(true);
const fields = [
    { key: 'symbol', label: 'Ticker' },
    { key: 'name', label: 'Company Name' },
    { key: 'reportDate', label: 'Report Date' },
    { key: 'fiscalDateEnding', label: 'Fiscal Period Ending' },
    { key: 'estimate', label: 'Estimate' },
    { key: 'currency', label: 'Currency' },
  ];

  onMounted(async () => {
    try {
      const data = await getEarningCalendars(ticker.value.toUpperCase());
      earningItems.value = data || [];
    } catch (error) {
      console.error('Error loading earning calendar', error);
    }
  });

function gotoCompanyReport(){
  router.push(`/company-report/${ticker.value.toLowerCase()}`);
}
const loadFilings = async () => {
  try {
    loadingCards.value = true;
    await fetchCompanyFilings(ticker.value)

    const filings = await getCompanyFilingsFromDB(ticker.value)
    console.log("filings in FE", filings)
    loadingCards.value = false;
    return {
      financials: filings.filter(f => f.reportType === '10-K' || f.reportType === '10-Q').sort((a, b) => new Date(b.filingDate - a.filingDate)),
      news: filings.filter(f => f.reportType === '8-K').sort((a, b) => new Date(b.filingDate - a.filingDate)),
      proxies: filings.filter(f => f.reportType == 'DEF 14A' || f.reportType == 'DEFA14A').sort((a, b) => new Date(b.filingDate - a.filingDate)),
      form4: filings.filter(f => f.reportType === '4').sort((a, b) => new Date(b.filingDate - a.filingDate)),
    }
  } catch (error){
    console.log("error fetching companies from BE", error)
  }
}
const {data, isLoading, error} = useQuery({
  queryKey: ["filings", ticker],
  queryFn: loadFilings,
  staleTime: 300000
})
const { data: companiesData } = useQuery({
  queryKey: ['companies'],
  queryFn: getAllCompanies,
  staleTime: 300000
})
const companies = computed(() => companiesData.value || []);

watch(
  () => route.params.ticker,
  async (newTicker) => {
    ticker.value = newTicker || 'AAPL';
    financials.value = []
    news.value = []
    proxies.value = []
    form4.value = []
    // await loadFilings();
    // await loadEarningTranscripts()
  }
);

function handleTickerSelect(company) {
  if (company?.ticker){
    router.push(`/docs/${company.ticker.toLowerCase()}`)
    showSearchModal.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
.data-page-container{
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    padding: 1rem 4rem
}
.data-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 4rem;
}
.buttons-header{
    display: flex;
    align-items: center;
    gap: 1rem;
}

.data-body{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  padding: 0.4rem 0.5rem;
  border-radius: 0.4rem;
  transition: background 0.2s ease;
}

.skeleton-card {
  height: 120px;
  border-radius: 8px;
  background: linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

</style>