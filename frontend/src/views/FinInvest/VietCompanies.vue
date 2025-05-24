<template>
  <div class="viet-companies-page">
    <h1>{{ $t('vietCompanies.title') }}</h1>
    <div class="filters-row">
      <div class="filters-bar">
        <label for="san-select">{{ $t('vietCompanies.sanGiaoDich') }}</label>
        <select id="san-select" v-model="selectedSan" @change="onSanChange">
          <option value="all">{{ $t('vietCompanies.tatCa') }}</option>
          <option value="HOSE">HOSE</option>
          <option value="HNX">HNX</option>
          <option value="UPCoM">UPCoM</option>
          <option value="OTC">OTC</option>
          <option value="Khác">{{ $t('vietCompanies.khac') }}</option>
        </select>
      </div>
      <div class="alphabet-filter">
        <span
          v-for="letter in alphabet"
          :key="letter"
          :class="{ active: firstLetter === letter }"
          @click="setFirstLetter(letter)"
        >
          {{ letter === 'all' ? $t('vietCompanies.tatCa') : letter }}
        </span>
      </div>
    </div>
    <div v-if="loading">{{ $t('vietCompanies.loading') }}</div>
    <table v-else class="companies-table">
      <thead>
        <tr>
          <th>{{ $t('vietCompanies.stt') }}</th>
          <th @click="sortBy('Mã CK')" style="cursor:pointer">
            {{ $t('vietCompanies.maCK') }}
            <span v-if="sortField === 'Mã CK'">
              <span v-if="sortOrder === 1">▲</span>
              <span v-else>▼</span>
            </span>
          </th>
          <th>{{ $t('vietCompanies.tenCongTy') }}</th>
          <th>{{ $t('vietCompanies.nganh') }}</th>
          <th>{{ $t('vietCompanies.san') }}</th>
          <th @click="sortBy('Khối lượng NY/ĐKGD')" style="cursor:pointer">
            {{ $t('vietCompanies.khoiLuong') }}
            <span v-if="sortField === 'Khối lượng NY/ĐKGD'">
              <span v-if="sortOrder === 1">▲</span>
              <span v-else>▼</span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(company, idx) in companies" :key="company._id">
          <td>{{ (page - 1) * limit + idx + 1 }}</td>
          <td>{{ company['Mã CK'] }}</td>
          <td>{{ company['Tên công ty'] }}</td>
          <td>{{ $t('industries.' + (company['Ngành'] || 'Khac')) }}</td>
          <td>{{ company['Sàn'] }}</td>
          <td>{{ company['Khối lượng NY/ĐKGD'] }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="page === 1" @click="changePage(page - 1)">{{ $t('vietCompanies.previous') }}</button>
      <span>{{ $t('vietCompanies.page') }} {{ page }} {{ $t('vietCompanies.of') }} {{ totalPages }}</span>
      <button :disabled="page === totalPages" @click="changePage(page + 1)">{{ $t('vietCompanies.next') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VietCompanies',
  data() {
    return {
      companies: [],
      loading: true,
      page: 1,
      totalPages: 1,
      limit: 20,
      firstLetter: 'all',
      alphabet: ['all', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')],
      sortField: 'Mã CK',
      sortOrder: 1, // 1 for ascending, -1 for descending
      selectedSan: 'all',
    };
  },
  methods: {
    async fetchCompanies() {
      this.loading = true;
      try {
        const res = await fetch(
          `/api/vietstock/companies?page=${this.page}&limit=${this.limit}&firstLetter=${this.firstLetter}` +
          `&sortField=${encodeURIComponent(this.sortField)}&sortOrder=${this.sortOrder}` +
          `&san=${this.selectedSan}`
        );
        const data = await res.json();
        this.companies = data.companies;
        this.totalPages = data.totalPages;
      } catch (e) {
        this.companies = [];
        this.totalPages = 1;
      }
      this.loading = false;
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchCompanies();
      }
    },
    setFirstLetter(letter) {
      this.firstLetter = letter;
      this.page = 1;
      this.fetchCompanies();
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder = -this.sortOrder;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
      this.page = 1;
      this.fetchCompanies();
    },
    onSanChange() {
      this.page = 1;
      this.fetchCompanies();
    },
  },
  mounted() {
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.viet-companies-page {
  padding: 2rem;
  /* max-width: 1200px; */
  /* margin: 0 auto; */
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.filters-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0;
}

.filters-bar label {
  font-weight: 500;
  font-size: 1.05rem;
}

.filters-bar select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
}

.alphabet-filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  background: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0;
}

.alphabet-filter span {
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  background: #f4f4f4;
  border: 1px solid #e0e0e0;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}

.alphabet-filter span.active {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
  font-weight: bold;
}

.companies-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
}

.companies-table th, .companies-table td {
  padding: 12px 10px;
  text-align: left;
}

.companies-table th {
  background: #f4f4f4;
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 1.05rem;
  color: #333;
}

.companies-table tr:nth-child(even) {
  background: #fafbfc;
}

.companies-table tr:hover {
  background: #e3f0fa;
  transition: background 0.2s;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-start;
}

.pagination button {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 7px 18px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination button:disabled {
  background: #b0b0b0;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1.05rem;
  color: #333;
}
</style> 