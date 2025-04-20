```vue
<template>
    <div class="data-page-container">
        <div class="data-header">
            <h3 class="text-xl font-semibold">{{ ticker.toUpperCase() }} Documents</h3>
            <div class="buttons-header">
                <BButton style="white-space: nowrap;" variant="primary">
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
        <div v-for="item in data?.financials" :key="item.id" class="card-row">
          <a :href="item.documentUrl" class="doc-link">{{ item.reportType }}</a>
          <span>{{ ticker.toUpperCase() }}</span>
          <span>{{ item.periodDate }}</span>
          <span>{{ item.filingDate }}</span>
        </div>
      </DataCard>

      <DataCard title="News" :docsCount="data?.news.length || 0">
        <div v-for="item in data?.news" :key="item.id" class="card-row">
          <a :href="item.documentUrl" class="doc-link">{{ item.reportType }}</a>
          <span>{{ ticker.toUpperCase() }}</span>
          <span>{{ item.periodDate }}</span>
          <span>{{ item.filingDate }}</span>
        </div>
      </DataCard>

      <DataCard title="Proxies" :docsCount="data?.proxies.length || 0">
        <div v-for="item in data?.proxies" :key="item.id" class="card-row">
          <a :href="item.documentUrl" class="doc-link">{{ item.reportType }}</a>
          <span>{{ ticker.toUpperCase() }}</span>
          <span>{{ item.reportType }}</span>
          <span>{{ item.filingDate }}</span>
        </div>
      </DataCard>

      <DataCard title="Form 4" :docsCount="data?.form4.length || 0">
        <div v-for="item in data?.form4" :key="item.id" class="card-row">
          <a :href="item.documentUrl" class="doc-link">Form 4</a>
          <span>{{ ticker.toUpperCase() }}</span>
          <span>{{ item.periodDate }}</span>
          <span>{{ item.filingDate }}</span>
        </div>
      </DataCard>

        </div>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { ref, onMounted, watch, computed } from 'vue';
import { BButton } from 'bootstrap-vue-3';
import DataCard from '@/components/finDataPage/DataCard.vue';
import TicketSearchModal from '@/components/finDataPage/TicketSearchModal.vue';
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
const loadFilings = async () => {
  try {
    await fetchCompanyFilings(ticker.value)

    const filings = await getCompanyFilingsFromDB(ticker.value)
    console.log("filings in FE", filings)
    return {
      financials: filings.filter(f => f.reportType === '10-K' || f.reportType === '10-Q'),
      news: filings.filter(f => f.reportType === '8-K'),
      proxies: filings.filter(f => f.reportType == 'DEF 14A' || f.reportType == 'DEFA14A'),
      form4: filings.filter(f => f.reportType === '4')
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

// onMounted(async () => {
//   try {
//     // companies.value = await getAllCompanies()
//     // await loadFilings()
//     // await getEarningCalendars()
//     // await loadEarningTranscripts()
//   } catch(er){
//     console.log("Error loading filings in FE", er)
//   }
// })

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

</style>