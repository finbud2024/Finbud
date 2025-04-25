<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Fund Letters</h1>
  
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <select v-model="selectedYear" class="p-2 border rounded w-full sm:w-auto">
          <option value="">All Years</option>
          <option v-for="year in years" :key="year">{{ year }}</option>
        </select>
  
        <select v-model="selectedQuarter" class="p-2 border rounded w-full sm:w-auto">
          <option value="">All Quarters</option>
          <option v-for="q in quarters" :key="q">{{ q }}</option>
        </select>
  
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by name..."
          class="p-2 border rounded flex-1"
        />
      </div>
  
      <div v-if="filteredLetters.length">
        <ul class="space-y-2">
          <li
            v-for="(item, index) in filteredLetters"
            :key="index"
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2"
          >
            <div>
              <a
                :href="item.link"
                target="_blank"
                class="text-blue-600 hover:underline font-medium"
              >
                {{ item.name }}
              </a>
              <div class="text-sm text-gray-500">
                {{ item.year }} - {{ item.quarter }}
              </div>
            </div>
          </li>
        </ul>
      </div>
  
      <div v-else class="text-gray-500 text-center mt-8">
        No letters found for selected filters.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'

  import rawData from '../../../backend/functions/fundLetterData.json'
  const selectedYear = ref('')
  const selectedQuarter = ref('')
  const searchTerm = ref('')
  
  const years = Object.keys(rawData)
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  
  // Flatten the JSON into an array of objects
  const allLetters = []
  for (const year of years) {
    const yearData = rawData[year]
    for (const quarter in yearData) {
      const items = yearData[quarter]
      for (const item of items) {
        const [name, link] = item.split(' - ')
        allLetters.push({ year, quarter, name, link })
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
  </script>
  
  <style scoped>
  a {
    word-break: break-word;
  }
  </style>
  