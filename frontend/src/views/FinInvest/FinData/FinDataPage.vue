<template>
    <div class="data-page-container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner-large"></div>
            <h3>Loading {{ ticker.toUpperCase() }} documents...</h3>
            <p>Please wait while we fetch the latest filings.</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <div class="error-icon">
                <font-awesome-icon icon="fa-solid fa-exclamation-triangle" />
            </div>
            <h3>Error Loading Documents</h3>
            <p>{{ error.message || 'Failed to load documents for ' + ticker.toUpperCase() }}</p>
            <button @click="retryLoading" class="retry-btn">
                <font-awesome-icon icon="fa-solid fa-refresh" />
                Try Again
            </button>
        </div>

        <!-- Main Content -->
        <div v-else>
            <div class="data-header">
                <div class="header-info">
                    <h3 class="page-title">{{ ticker.toUpperCase() }} Documents</h3>
                    <p class="page-subtitle">Financial filings, earnings reports, and regulatory documents</p>
                </div>
                <div class="buttons-header">
                    <button class="action-button primary" @click="gotoCompanyReport">
                        <font-awesome-icon icon="fa-solid fa-chart-line" />
                        View {{ ticker.toUpperCase() }} Company Report
                    </button>

                    <button class="action-button secondary" @click="showSearchModal = true">
                        <font-awesome-icon icon="fa-solid fa-search" />
                        Search ticker...
                    </button>
                </div>
            </div>

            <!-- Statistics Overview -->
            <div class="stats-overview">
                <div class="stat-card">
                    <div class="stat-number">{{ data?.financials?.length || 0 }}</div>
                    <div class="stat-label">Financial Reports</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ data?.news?.length || 0 }}</div>
                    <div class="stat-label">News Filings</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ data?.proxies?.length || 0 }}</div>
                    <div class="stat-label">Proxy Statements</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ data?.form4?.length || 0 }}</div>
                    <div class="stat-label">Insider Trading</div>
                </div>
            </div>

            <div class="data-body">
                <DataCard title="Financials" :docsCount="data?.financials?.length || 0">
                    <!-- Skeleton Loader -->
                    <div v-if="loadingCards" class="skeleton-container">
                        <div class="skeleton-card" v-for="i in 3" :key="i"></div>
                    </div>
                    <div v-else-if="data?.financials?.length" class="document-list">
                        <div v-for="item in data.financials" :key="item.id" class="document-row">
                            <div class="document-info">
                                <a :href="item.documentUrl" target="_blank" class="doc-link">
                                    <font-awesome-icon icon="fa-solid fa-file-pdf" />
                                    {{ item.reportType }}
                                </a>
                                <div class="document-meta">
                                    <span class="ticker-tag">{{ ticker.toUpperCase() }}</span>
                                    <span class="date-info">
                                        <font-awesome-icon icon="fa-solid fa-calendar" />
                                        Filed: {{ formatDate(item.filingDate) }}
                                    </span>
                                </div>
                            </div>
                            <div class="document-actions">
                                <button class="action-btn" @click="openDocument(item.documentUrl)">
                                    <font-awesome-icon icon="fa-solid fa-external-link-alt" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-state">
                        <font-awesome-icon icon="fa-solid fa-inbox" />
                        <p>No financial reports available</p>
                    </div>
                </DataCard>

                <DataCard title="News & Events" :docsCount="data?.news?.length || 0">
                    <div v-if="loadingCards" class="skeleton-container">
                        <div class="skeleton-card" v-for="i in 3" :key="i"></div>
                    </div>
                    <div v-else-if="data?.news?.length" class="document-list">
                        <div v-for="item in data.news" :key="item.id" class="document-row">
                            <div class="document-info">
                                <a :href="item.documentUrl" target="_blank" class="doc-link">
                                    <font-awesome-icon icon="fa-solid fa-newspaper" />
                                    {{ item.reportType }}
                                </a>
                                <div class="document-meta">
                                    <span class="ticker-tag">{{ ticker.toUpperCase() }}</span>
                                    <span class="date-info">
                                        <font-awesome-icon icon="fa-solid fa-calendar" />
                                        Filed: {{ formatDate(item.filingDate) }}
                                    </span>
                                </div>
                            </div>
                            <div class="document-actions">
                                <button class="action-btn" @click="openDocument(item.documentUrl)">
                                    <font-awesome-icon icon="fa-solid fa-external-link-alt" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-state">
                        <font-awesome-icon icon="fa-solid fa-inbox" />
                        <p>No news filings available</p>
                    </div>
                </DataCard>

                <DataCard title="Proxy Statements" :docsCount="data?.proxies?.length || 0">
                    <div v-if="loadingCards" class="skeleton-container">
                        <div class="skeleton-card" v-for="i in 3" :key="i"></div>
                    </div>
                    <div v-else-if="data?.proxies?.length" class="document-list">
                        <div v-for="item in data.proxies" :key="item.id" class="document-row">
                            <div class="document-info">
                                <a :href="item.documentUrl" target="_blank" class="doc-link">
                                    <font-awesome-icon icon="fa-solid fa-users" />
                                    {{ item.reportType }}
                                </a>
                                <div class="document-meta">
                                    <span class="ticker-tag">{{ ticker.toUpperCase() }}</span>
                                    <span class="date-info">
                                        <font-awesome-icon icon="fa-solid fa-calendar" />
                                        Filed: {{ formatDate(item.filingDate) }}
                                    </span>
                                </div>
                            </div>
                            <div class="document-actions">
                                <button class="action-btn" @click="openDocument(item.documentUrl)">
                                    <font-awesome-icon icon="fa-solid fa-external-link-alt" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-state">
                        <font-awesome-icon icon="fa-solid fa-inbox" />
                        <p>No proxy statements available</p>
                    </div>
                </DataCard>

                <DataCard title="Form 4 - Insider Trading" :docsCount="data?.form4?.length || 0">
                    <div v-if="loadingCards" class="skeleton-container">
                        <div class="skeleton-card" v-for="i in 3" :key="i"></div>
                    </div>
                    <div v-else-if="data?.form4?.length" class="document-list">
                        <div v-for="item in data.form4" :key="item.id" class="document-row">
                            <div class="document-info">
                                <a :href="item.documentUrl" target="_blank" class="doc-link">
                                    <font-awesome-icon icon="fa-solid fa-user-tie" />
                                    Form 4 - Insider Trading
                                </a>
                                <div class="document-meta">
                                    <span class="ticker-tag">{{ ticker.toUpperCase() }}</span>
                                    <span class="date-info">
                                        <font-awesome-icon icon="fa-solid fa-calendar" />
                                        Filed: {{ formatDate(item.filingDate) }}
                                    </span>
                                </div>
                            </div>
                            <div class="document-actions">
                                <button class="action-btn" @click="openDocument(item.documentUrl)">
                                    <font-awesome-icon icon="fa-solid fa-external-link-alt" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-state">
                        <font-awesome-icon icon="fa-solid fa-inbox" />
                        <p>No insider trading forms available</p>
                    </div>
                </DataCard>
            </div>

            <!-- Earnings Calendar Section -->
            <div v-if="earningItems.length > 0" class="earnings-section">
                <h3 class="section-title">
                    <font-awesome-icon icon="fa-solid fa-calendar-check" />
                    Earnings Calendar
                </h3>
                <div class="earnings-table-wrapper">
                    <table class="earnings-table">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Company</th>
                                <th>Report Date</th>
                                <th>Fiscal Period</th>
                                <th>Estimate</th>
                                <th>Currency</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in earningItems" :key="item.symbol">
                                <td class="symbol-cell">{{ item.symbol }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ formatDate(item.reportDate) }}</td>
                                <td>{{ formatDate(item.fiscalDateEnding) }}</td>
                                <td class="estimate-cell">{{ item.estimate || 'N/A' }}</td>
                                <td>{{ item.currency }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Search Modal -->
        <TicketSearchModal 
            :show="showSearchModal"
            :companies="companies"
            @close="showSearchModal = false"
            @select="handleTickerSelect"
        />
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { ref, onMounted, watch, computed } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faSearch, faChartLine, faExclamationTriangle, faRefresh, faCalendar,
  faFilePdf, faNewspaper, faUsers, faUserTie, faExternalLinkAlt,
  faInbox, faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import DataCard from '@/components/FinInvest/FinDataPage/DataCard.vue';
import TicketSearchModal from '@/components/FinInvest/FinDataPage/TicketSearchModal.vue';
import { getAllCompanies, fetchCompanyFilings, getCompanyFilingsFromDB, getEarningCalendars } from '@/services/finDataService';

// Add icons to library
library.add(
  faSearch, faChartLine, faExclamationTriangle, faRefresh, faCalendar,
  faFilePdf, faNewspaper, faUsers, faUserTie, faExternalLinkAlt,
  faInbox, faCalendarCheck
);

const route = useRoute();
const router = useRouter();
const ticker = ref(route.params.ticker || 'AAPL');
const showSearchModal = ref(false);
const earningItems = ref([]);
const loadingCards = ref(true);

onMounted(async () => {
  try {
    const data = await getEarningCalendars(ticker.value.toUpperCase());
    earningItems.value = data || [];
  } catch (error) {
    console.error('Error loading earning calendar', error);
  }
});

function gotoCompanyReport() {
  router.push(`/company-report/${ticker.value.toLowerCase()}`);
}

const loadFilings = async () => {
  try {
    loadingCards.value = true;
    await fetchCompanyFilings(ticker.value);

    const filings = await getCompanyFilingsFromDB(ticker.value);
    console.log("filings in FE", filings);
    loadingCards.value = false;
    return {
      financials: filings.filter(f => f.reportType === '10-K' || f.reportType === '10-Q').sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate)),
      news: filings.filter(f => f.reportType === '8-K').sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate)),
      proxies: filings.filter(f => f.reportType == 'DEF 14A' || f.reportType == 'DEFA14A').sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate)),
      form4: filings.filter(f => f.reportType === '4').sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate)),
    };
  } catch (error) {
    console.log("error fetching companies from BE", error);
    throw error;
  }
};

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["filings", ticker],
  queryFn: loadFilings,
  staleTime: 300000,
  retry: 2
});

const { data: companiesData } = useQuery({
  queryKey: ['companies'],
  queryFn: getAllCompanies,
  staleTime: 300000
});

const companies = computed(() => companiesData.value || []);

watch(
  () => route.params.ticker,
  async (newTicker) => {
    ticker.value = newTicker || 'AAPL';
    try {
      const data = await getEarningCalendars(ticker.value.toUpperCase());
      earningItems.value = data || [];
    } catch (error) {
      console.error('Error loading earning calendar', error);
    }
  }
);

function handleTickerSelect(company) {
  if (company?.ticker) {
    router.push(`/docs/${company.ticker.toLowerCase()}`);
    showSearchModal.value = false;
  }
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

const openDocument = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

const retryLoading = () => {
  refetch();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.data-page-container {
    width: 100%;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    font-family: 'Inter', sans-serif;
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    color: #64748b;
}

.loading-spinner-large {
    width: 48px;
    height: 48px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #000000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error State */
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    color: #dc2626;
}

.error-icon {
    font-size: 3rem;
    color: #ef4444;
    margin-bottom: 1rem;
}

.retry-btn {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #000000;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
}

.retry-btn:hover {
    background: #000000;
    transform: translateY(-1px);
}

/* Header */
.data-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
}

.header-info {
    flex: 1;
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
}

.page-subtitle {
    color: #64748b;
    font-size: 1rem;
    margin: 0;
}

.buttons-header {
    display: flex;
    gap: 1rem;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
}

.action-button.primary {
    background: #000000;
    color: white;
}

.action-button.primary:hover {
    background: #000000;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-button.secondary {
    background: #f8fafc;
    color: #475569;
    border: 1px solid #e2e8f0;
}

.action-button.secondary:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
}

/* Statistics Overview */
.stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    text-align: center;
    transition: all 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #000000;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Data Body */
.data-body {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
}

/* Document List */
.skeleton-container {
    padding: 1rem 0;
}

.skeleton-card {
    height: 60px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
    margin-bottom: 1rem;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.document-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.document-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.document-row:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateX(4px);
}

.document-info {
    flex: 1;
}

.doc-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #000000;
    text-decoration: none;
    font-weight: 600;
    margin-bottom: 0.5rem;
    transition: color 0.2s ease;
}

.doc-link:hover {
    color: #000000;
}

.document-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.ticker-tag {
    background: #e0f2fe;
    color: #0369a1;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.date-info {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #64748b;
    font-size: 0.875rem;
}

.document-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    padding: 0.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: #f1f5f9;
    color: #000000;
    border-color: #cbd5e1;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    color: #94a3b8;
    text-align: center;
}

.empty-state svg {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.empty-state p {
    margin: 0;
    font-style: italic;
}

/* Earnings Section */
.earnings-section {
    margin-top: 3rem;
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

.earnings-table-wrapper {
    overflow-x: auto;
}

.earnings-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
}

.earnings-table th {
    background: #f8fafc;
    color: #374151;
    font-weight: 600;
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.earnings-table td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
}

.earnings-table tbody tr:hover {
    background: #f8fafc;
}

.symbol-cell {
    font-weight: 600;
    color: #000000;
}

.estimate-cell {
    font-weight: 500;
    color: #059669;
}

/* Responsive Design */
@media (max-width: 768px) {
    .data-page-container {
        padding: 1rem;
    }
    
    .data-header {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
    }
    
    .buttons-header {
        flex-direction: column;
        width: 100%;
    }
    
    .action-button {
        justify-content: center;
    }
    
    .stats-overview {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .data-body {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .document-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .document-meta {
        gap: 0.5rem;
    }
    
    .earnings-table {
        font-size: 0.875rem;
    }
    
    .earnings-table th,
    .earnings-table td {
        padding: 0.75rem 0.5rem;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 1.5rem;
    }
    
    .stats-overview {
        grid-template-columns: 1fr;
    }
    
    .stat-number {
        font-size: 2rem;
    }
}
</style>