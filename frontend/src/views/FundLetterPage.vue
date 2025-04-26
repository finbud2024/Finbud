<template>
  <div class="fund-archive-background">

  <div class="fund-archive-container">
    <div class="fund-archive-content">
      <div class="fund-archive-header">
        <h1>Fund Letters Archive</h1>
        <p>Curated List of Quarterly Hedge Fund Letters</p>
      </div>

      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by name of fund"
        class="search-input"
      />

      <div class="filters">
        <select v-model="selectedYear" class="dropdown">
          <option value="">All Years</option>
          <option v-for="year in years" :key="year">{{ year }}</option>
        </select>

        <select v-model="selectedQuarter" class="dropdown">
          <option value="">All Quarters</option>      
          <option v-for="q in quarters" :key="q">{{ q }}</option>
        </select>
      </div>

      <div v-if="filteredLetters.length" class="letters-list-scroll-container">
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

      <div v-else class="no-results">
        No letters found for selected filters.
      </div>
    </div>
  </div>
  <div class="fund-archive-header" style="margin-bottom: 1rem;">
    <h1>Greatest Investor Compilations</h1>
  </div>
  <div class="custom-flex" style="flex-wrap: wrap; gap: 0.5rem; margin-top: 0;">
    
    <li
      v-for="card in investorCards"
      :key="card.name"
      class="content-card"
      style="flex: 1 1 calc(33.333% - 0.5rem); max-width: 200px; height: 250px;"
    >
      <!-- Overlay -->
      <span class="overlay" aria-hidden="true"></span>
      
      <!-- Clickable Card Content -->
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
        <h3 class="card-title">{{card.name}}</h3>
        <p class="card-description">
          {{ card.description }}
        </p>
      </a>
    </li>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import rawData from '../../../backend/functions/fundLetterData.json'
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import investorData from '../../../backend/functions/investorCards.json';
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
      //console.log('Processing Item:', item);
      const [nameWithDate, link] = item.split(' - ');
      const match = nameWithDate.match(/^(.*)\(([^)]+)\)\s*$/);
      // Match name and date
      const fullName = match ? match[1].trim() : nameWithDate.trim(); // Extract name
      const date = match ? match[2].trim() : ''; // Extract date
      allLetters.push({ year, quarter, name: fullName, link, date });
    }
  }
}
console.log('All Letters:', allLetters);
const filteredLetters = computed(() => {
  return allLetters.filter(letter => {
    const matchesYear = !selectedYear.value || letter.year === selectedYear.value
    const matchesQuarter = !selectedQuarter.value || letter.quarter === selectedQuarter.value
    const matchesSearch = letter.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchesYear && matchesQuarter && matchesSearch
  })
})
</script>

<style scoped>
.fund-archive-background {
  margin-bottom: 10rem;
  background-color: #111827;
}
.fund-archive-container {
  min-height: 100vh;
  background-color: #111827;
  color: white;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
}

.fund-archive-content {
  width: 100%;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.fund-archive-header {
  text-align: center;
}

.fund-archive-header h1 {
  font-size: 2.25rem;
  font-weight: bold;
  color: white;
}

.fund-archive-header p {
  color: #9ca3af;
}

.search-input {
  width: 97%;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #1f2937;
  color: white;
  border: none;
  font-size: 1rem;

}

.search-input::placeholder {
  color: #6b7280;
}

.filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .filters {
    grid-template-columns: repeat(2, 1fr);
  }
}

.dropdown {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #1f2937;
  color: white;
  border: none;
  font-size: 1rem;
}

.letters-list {
  background-color: #1f2937;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.letter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #374151;
  transition: background-color 0.2s ease-in-out;
}

.letter-item:last-child {
  border-bottom: none;
}

.letter-item:hover {
  background-color: #374151;
}

.letter-link {
  font-weight: 500;
  color: white;
  text-decoration: none;
}

.letter-link:hover {
  text-decoration: underline;
}

.letter-meta {
  font-size: 0.875rem;
  color: #9ca3af;
}

.no-results {
  color: #9ca3af;
  text-align: center;
  padding-top: 40px;
}

a {
  word-break: break-word;
}
.letters-list-scroll-container {
  max-height: 400px;
  overflow-y: auto;
  background-color: #1f2937;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

/* Optional: Customize scrollbar */
.letters-list-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.letters-list-scroll-container::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 4px;
}

.letters-list-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.custom-flex {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem; /* or use a CSS variable if you have one */
  margin:10rem;
}
.content-card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 100%;
  max-width: 270px;
  min-width: 270px;
  border-radius: 12px;
  background-color: #1f2937; /* dark background */
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.overlay {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 56px;
  width: 100%;
  background-color: rgba(64, 64, 79, 0.3);
  backdrop-filter: blur(6px);
  opacity: 0.85;
  z-index: 0;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-link {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  text-decoration: none;
  color: white;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  object-fit: cover;
}

.card-title {
  font-family: "Space Grotesk", sans-serif;
  font-weight: bold;
  font-size: 1rem;
  margin: 1rem 0 0;
  color:white;
  text-align: center;
}

.card-description {
  font-size: 0.875rem;
  color: #d1d5db;
  margin-top: 0.25rem;
}
</style>
