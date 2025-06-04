<template>
    <div>
      <input
        v-model="query"
        class="search-input"
        type="text"
        placeholder="Search ticker..."
      />
      <ul v-if="filteredCompanies.length" class="search-results">
        <li
          v-for="company in filteredCompanies"
          :key="company.ticker"
          class="search-item"
          @click="select(company.ticker)"
        >
          {{ company.ticker }} - {{ company.name }}
        </li>
      </ul>
    </div>
</template>
  
<script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    companies: Array, // List of companies to search from
  });
  
  const emit = defineEmits(['select']); // Emit the selected ticker
  
  const query = ref(''); // Search query
  
  // Filter companies based on the search query
  const filteredCompanies = computed(() =>
    (props.companies || []).filter((c) =>
      `${c.ticker} ${c.name}`.toLowerCase().includes(query.value.toLowerCase())
    )
  );
  
  // Emit the selected ticker and update the input box
  function select(ticker) {
    query.value = ticker; // Set the selected ticker in the input box
    emit('select', ticker); // Emit the selected ticker to the parent
  }
</script>
  
<style scoped>
  .search-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 0.5rem;
  }
  
  .search-results {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .search-item {
    padding: 0.5rem;
    cursor: pointer;
  }
  
  .search-item:hover {
    background-color: #f1f5f9;
  }
</style>