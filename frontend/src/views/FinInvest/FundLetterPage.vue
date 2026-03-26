<template>
  <div class="fin-speak-page fund-letter-page">
    <!-- Bot chat component -->
    <ChatBot :botMessage="templateChat" />

    <div class="fund-archive-container">
      <div class="fund-archive-content">
        <header class="fin-speak-hero-block">
          <p class="fin-speak-eyebrow">{{ $t('finSpeak.slogan') }}</p>
          <h1 class="fin-speak-page-title">{{ $t('fundLettersArchive') }}</h1>
          <p class="fin-speak-lead">{{ $t('curatedListSubtitle') }}</p>
        </header>
        <div class="outer-container-first">
          <!-- Search and Filter Section -->
          <div class="search-filter-section">
            <div class="search-container">
              <input
                v-model="searchTerm"
                type="text"
                :placeholder="$t('searchPlaceholder')"
                class="search-input"
              />
              <i class="search-icon">🔍</i>
            </div>

            <div class="filters">
              <div class="filter-group">
                <select id="year-select" v-model="selectedYear" class="dropdown">
                  <option value="">{{ $t('allYears') }}</option>
                  <option v-for="year in years" :key="year">{{ year }}</option>
                </select>
              </div>

              <div class="filter-group">
                <select id="quarter-select" v-model="selectedQuarter" class="dropdown">
                  <option value="">{{ $t('allQuarters') }}</option>
                  <option v-for="q in quarters" :key="q">{{ q }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Letters List Section -->
          <div v-if="filteredLetters.length" class="letters-container">
            <div class="letters-header">
              <span class="header-fund">{{ $t('fundName') }}</span>
              <span class="header-date">{{ $t('date') }}</span>
            </div>
            <div class="letters-list-scroll-container">
              <div class="letters-list">
                <div
                  v-for="(item, index) in filteredLetters"
                  :key="index"
                  class="letter-item"
                >
                  <a
                    :href="item.link"
                    target="_blank"
                    class="letter-link"
                  >
                    {{ item.name }}
                  </a>
                  <span class="letter-meta">{{ item.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-results">
            <i class="empty-icon">📄</i>
            <p>{{ $t('noResults') }}</p>
            <button @click="resetFilters" class="reset-button">{{ $t('resetFilters') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Greatest Investors Section -->
    <div class="outer-container">
      <div class="investors-section">
        <header class="fin-speak-hero-block investors-hero">
          <p class="fin-speak-eyebrow">{{ $t('finSpeak.slogan') }}</p>
          <h2 class="fin-speak-page-title">{{ $t('greatestInvestors') }}</h2>
          <p class="fin-speak-lead">{{ $t('learnFromMasters') }}</p>
        </header>
        
        <div class="investors-grid">
          <div
            v-for="card in investorCards"
            :key="card.name"
            class="investor-card"
          >
            <div class="card-overlay" aria-hidden="true"></div>
            
            <a
              class="card-link"
              :href="card.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                class="profile-image"
                :src="require(`@/assets/investorCards/${card.img}`)"
                :alt="`${card.name} profile picture`"
              />
              <h3 class="card-title">{{ card.name }}</h3>
              <p class="card-description">
                {{ card.description[$i18n.locale]}}
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
//backend/functions/data/fundLetterData.json
import rawData from '../../../../backend/functions/data/fundLetterData.json'
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import investorData from '../../../../backend/functions/data/investorCards.json';
import ChatBot from "../../components/ChatBot/DraggableChatBot.vue";
const templateChat = `Hello! I'm here to help you find the best hedge fund letters. 
You can search by fund name or filter by year and quarter. If you have any questions, feel free to ask!`;
const investorCards = investorData;
const selectedYear = ref('')
const selectedQuarter = ref('')
const searchTerm = ref('')

const years = Object.keys(rawData)
const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

const allLetters = [];
for (const year of years) {
  const yearData = rawData[year];
  for (const quarter in yearData) {
    const items = yearData[quarter];
    for (const item of items) {
      const [nameWithDate, link] = item.split(' - ');
      const match = nameWithDate.match(/^(.*)\(([^)]+)\)\s*$/);
      // Match name and date
      const fullName = match ? match[1].trim() : nameWithDate.trim(); // Extract name
      const date = match ? match[2].trim() : ''; // Extract date
      allLetters.push({ year, quarter, name: fullName, link, date });
    }
  }
}

const filteredLetters = computed(() => {
  return allLetters.filter(letter => {
    const matchesYear = !selectedYear.value || letter.year === selectedYear.value
    const matchesQuarter = !selectedQuarter.value || letter.quarter === selectedQuarter.value
    const matchesSearch = letter.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchesYear && matchesQuarter && matchesSearch
  })
})

const resetFilters = () => {
  selectedYear.value = '';
  selectedQuarter.value = '';
  searchTerm.value = '';
}
</script>

<style scoped>
.fund-letter-page {
  padding-bottom: 3rem;
}

.fund-archive-container {
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.fund-archive-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.investors-hero {
  margin-top: 2rem;
}

.outer-container-first {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.75rem 1.5rem;
  box-sizing: border-box;
  background: var(--card-bg, #fff);
  border-radius: 16px;
  border: 1px solid var(--border-color, #e8eaef);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.06);
}

.outer-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  box-sizing: border-box;
}

.search-filter-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 10px;
  background: var(--bg-secondary, #f8fafc);
  color: var(--text-primary, #0f172a);
  border: 1px solid var(--border-color, #e2e8f0);
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #22a36a;
  box-shadow: 0 0 0 3px rgba(34, 163, 106, 0.15);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-style: normal;
}

.filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .filters {
    grid-template-columns: repeat(2, 1fr);
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: var(--bg-secondary, #f8fafc);
  color: var(--text-primary, #0f172a);
  border: 1px solid var(--border-color, #e2e8f0);
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  cursor: pointer;
}

.dropdown:focus {
  outline: none;
  border-color: #22a36a;
}

.letters-container {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #e2e8f0);
}

.letters-header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: var(--bg-secondary, #f1f5f9);
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.header-fund {
  flex-grow: 1;
}

.letters-list-scroll-container {
  max-height: 480px;
  overflow-y: auto;
}

.letter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-color, #e8eaef);
  transition: background-color 0.15s ease;
}

.letter-item:last-child {
  border-bottom: none;
}

.letter-item:hover {
  background-color: rgba(34, 163, 106, 0.06);
}

.letter-link {
  font-weight: 500;
  color: var(--text-primary, #0f172a);
  text-decoration: none;
  word-break: break-word;
  flex-grow: 1;
}

.letter-link:hover {
  color: #22a36a;
}

.letter-meta {
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
  white-space: nowrap;
  margin-left: 1rem;
}

.no-results {
  text-align: center;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 12px;
  border: 1px dashed var(--border-color, #cbd5e1);
  color: var(--text-secondary, #64748b);
}

.reset-button {
  padding: 0.5rem 1.25rem;
  background: var(--primary-color, #000);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.reset-button:hover {
  opacity: 0.9;
}

.investors-section {
  width: 100%;
}

.investors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.investor-card {
  position: relative;
  border-radius: 14px;
  background: var(--card-bg, #fff);
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border-color, #e8eaef);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  height: 300px;
}

.investor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 56px;
  width: 100%;
  background: linear-gradient(90deg, #1a1d26 0%, #2d3142 100%);
  opacity: 0.92;
  z-index: 0;
}

.card-link {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.profile-image {
  width: 96px;
  height: 96px;
  border-radius: 9999px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
}

.card-title {
  font-weight: 700;
  font-size: 1.15rem;
  margin: 1rem 0 0;
  color: var(--text-primary, #0f172a);
  text-align: center;
}

.card-description {
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
  text-align: center;
  line-height: 1.5;
}

.dark-mode .outer-container-first {
  background: var(--card-bg, #1e293b);
  border-color: #334155;
}

.dark-mode .letter-link {
  color: var(--text-primary, #f1f5f9);
}

.dark-mode .letter-link:hover {
  color: #34d399;
}

.dark-mode .investor-card {
  background: var(--card-bg, #1e293b);
  border-color: #334155;
}

.dark-mode .card-title {
  color: #f1f5f9;
}

.dark-mode .card-description {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .outer-container-first {
    padding: 1.25rem 1rem;
  }

  .investors-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
