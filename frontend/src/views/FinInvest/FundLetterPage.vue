<template>
  <div class="fund-archive-background">
    <!-- Bot chat component -->
    <ChatBot :botMessage="templateChat" />

    <!-- Outer container added here -->
    <div class="fund-archive-container">
      <div class="fund-archive-content">
        <!-- Main Header Section -->
        <div class="fund-archive-header">
          <h1>{{ $t('fundLettersArchive') }}</h1>
          <p>{{ $t('curatedListSubtitle') }}</p>
        </div>
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
        <div class="fund-archive-header">
          <h1>{{ $t('greatestInvestors') }}</h1>
          <p>{{ $t('learnFromMasters') }}</p>
        </div>
        
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
.fund-archive-background {
  background-color: var(--black-in-dark-mode);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--white-in-dark-mode);
  padding-bottom: 4rem;
}

/* Added outer container styling */
.outer-container-first {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 3rem;
  box-sizing: border-box;
  background-color: var(--chat-text-color);
  border-radius: 1rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.outer-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 3rem;
  box-sizing: border-box;
  background-color:var(--black-in-dark-mode);


}

.fund-archive-container {
  min-height: 80vh;

  display: flex;
  justify-content: center;
}

.fund-archive-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.fund-archive-header {
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
}

.fund-archive-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--white-in-dark-mode);
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
  background: var(--white-in-dark-mode);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.fund-archive-header p {
  color: #9ca3af;
  font-size: 1.25rem;
}

/* Search and Filters */
.search-filter-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-container {
  position: relative;
  width: 98%;
}

.search-input {
  width: 97%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border-radius: 0.5rem;
  background-color: var(--card-bg);
  color: var(--white-in-dark-mode);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;

  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
}

.search-input::placeholder {
  color: #6b7280;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
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

.filter-group label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.dropdown {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--card-bg);
  color: var(--white-in-dark-mode);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown:focus {
  outline: none;
  border-color: black;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
}

/* Letters List Section */
.letters-container {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  overflow: hidden;
  background-color:var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.letters-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  font-weight: 600;
  color: #9ca3af;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-fund {
  flex-grow: 1;
}

.letters-list-scroll-container {
  max-height: 500px;
  overflow-y: auto;
}

.letters-list {
  background-color: transparent;
}

.letter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
}

.letter-item:last-child {
  border-bottom: none;
}

.letter-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.letter-link {
  font-weight: 500;
  color: var(--white-in-dark-mode);
  text-decoration: none;
  word-break: break-word;
  flex-grow: 1;
  transition: color 0.2s ease;
}

.letter-link:hover {
  color: grey;
}

.letter-meta {
  font-size: 0.875rem;
  color: #9ca3af;
  white-space: nowrap;
  margin-left: 1rem;
}

.results-counter {
  padding: 0.75rem 1.5rem;
  text-align: right;
  font-size: 0.875rem;
  color: #9ca3af;
  background-color: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.no-results {
  color: #9ca3af;
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: rgba(30, 30, 35, 0.5);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
  font-style: normal;
}

.reset-button {
  padding: 0.5rem 1.5rem;
  background-color: var(--white-in-dark-mode);
  color: var(--black-in-dark-mode);
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background-color: var(--white-in-dark-mode);
}

/* Scrollbar styling */
.letters-list-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.letters-list-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.letters-list-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.letters-list-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

/* Investors Section */
.investors-section {
  width: 100%;

}

.investors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.investor-card {
  position: relative;
  border-radius: 1rem;
  background-color: var(--white-in-dark-mode);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 300px;
}

.investor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  background: var(--black-in-dark-mode);
  opacity: 0.85;
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
  color: white;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 9999px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.card-title {
  font-family: "Space Grotesk", sans-serif;
  font-weight: bold;
  font-size: 1.25rem;
  margin: 1rem 0 0;
  color:var(--black-in-dark-mode);
  text-align: center;
}

.card-description {
  font-size: 0.875rem;
  color: var(--black-in-dark-mode);
  text-align: center;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .outer-container {
    padding: 0 1rem;
  }
  
  .investors-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .fund-archive-header h1 {
    font-size: 2rem;
  }
  
  .fund-archive-header p {
    font-size: 1rem;
  }
}
</style>