<template>
    <div class="modal-overlay" v-if="show" @click.self="emit('close')">
      <div class="modal-content search-modal">
        <div class="search-header">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="query"
            class="search-input"
            type="text"
            placeholder="Search ticker..."
          />
          <button class="close-button" @click="emit('close')">&times;</button>
        </div>
  
        <div class="search-results">
          <h6 class="category-title">Companies</h6>
          <ul>
            <li
              v-for="company in filteredCompanies"
              :key="company.symbol"
              class="search-item"
              @click="select(company)"
            >
              ${{ company.ticker }} — {{ company.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    show: Boolean,
    companies: Array
  })
  const emit = defineEmits(['close', 'select'])
  
  const query = ref('')
  
  const filteredCompanies = computed(() =>
    props.companies.filter(c =>
      `${c.ticker} ${c.name}`.toLowerCase().includes(query.value.toLowerCase())
    )
  )
  
  function select(company) {
    emit('select', company)
    emit('close')
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content.search-modal {
    background: white;
    border-radius: 10px;
    padding: 1rem;
    width: 500px;
    max-height: 80vh;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    flex-direction: column;
  }
  
  .search-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .search-icon {
    font-size: 1.2rem;
    color: #6c757d;
  }
  
  .search-input {
    flex: 1;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
  }
  
  .category-title {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .search-results{
    overflow-y: auto;
  }
  .search-results ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .search-item {
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .search-item:hover {
    background-color: #f1f5f9;
  }
  </style>
  