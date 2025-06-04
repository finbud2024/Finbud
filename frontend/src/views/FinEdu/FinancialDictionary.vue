<template>
  <div class="financial-dictionary">
    <!-- Header Section -->
    <div class="dictionary-header">
      <div class="container">
        <h1 class="page-title">{{ $t('financialDictionary.title') }}</h1>
        <p class="page-subtitle">{{ $t('financialDictionary.subtitle') }}</p>
        
        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('financialDictionary.searchPlaceholder')"
              class="search-input"
              @input="handleSearch"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
              <font-awesome-icon icon="fa-solid fa-times" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dictionary-content">
      <div class="container">
        <div class="content-grid">
          <!-- Sidebar with Categories -->
          <div class="sidebar">
            <div class="categories-section">
              <h3>{{ $t('financialDictionary.categories') }}</h3>
              <div class="category-list">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  :class="['category-btn', { active: selectedCategory === category.id }]"
                  @click="selectCategory(category.id)"
                >
                  <font-awesome-icon :icon="category.icon" class="category-icon" />
                  <span>{{ $t(`financialDictionary.categoryNames.${category.id}`) }}</span>
                  <span class="term-count">({{ getTermCountByCategory(category.id) }})</span>
                </button>
              </div>
            </div>

            <!-- Alphabet Filter -->
            <div class="alphabet-section">
              <h3>{{ $t('financialDictionary.alphabetFilter') }}</h3>
              <div class="alphabet-grid">
                <button
                  v-for="letter in alphabet"
                  :key="letter"
                  :class="['alphabet-btn', { active: selectedLetter === letter }]"
                  @click="selectLetter(letter)"
                >
                  {{ letter }}
                </button>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="stats-section">
              <h3>{{ $t('financialDictionary.stats') }}</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">{{ totalTerms }}</div>
                  <div class="stat-label">{{ $t('financialDictionary.totalTerms') }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ categories.length }}</div>
                  <div class="stat-label">{{ $t('financialDictionary.categories') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Terms List -->
          <div class="terms-section">
            <!-- Filter Info -->
            <div class="filter-info" v-if="searchQuery || selectedCategory || selectedLetter">
              <div class="active-filters">
                <span v-if="searchQuery" class="filter-tag">
                  {{ $t('financialDictionary.searchResults') }}: "{{ searchQuery }}"
                  <button @click="clearSearch" class="remove-filter">×</button>
                </span>
                <span v-if="selectedCategory" class="filter-tag">
                  {{ $t(`financialDictionary.categoryNames.${selectedCategory}`) }}
                  <button @click="clearCategory" class="remove-filter">×</button>
                </span>
                <span v-if="selectedLetter" class="filter-tag">
                  {{ $t('financialDictionary.letter') }}: {{ selectedLetter }}
                  <button @click="clearLetter" class="remove-filter">×</button>
                </span>
              </div>
              <button @click="clearAllFilters" class="clear-all-btn">
                {{ $t('financialDictionary.clearAll') }}
              </button>
            </div>

            <!-- Terms Grid -->
            <div class="terms-grid" v-if="!loading">
              <div
                v-for="term in paginatedTerms"
                :key="term.id"
                class="term-card"
                @click="selectTerm(term)"
              >
                <div class="term-header">
                  <h4 class="term-title">{{ term.term }}</h4>
                  <span class="term-category">{{ $t(`financialDictionary.categoryNames.${term.category}`) }}</span>
                </div>
                <p class="term-preview">{{ truncateText(term.definition, 100) }}</p>
                <div class="term-footer">
                  <span class="difficulty-badge" :class="term.difficulty">
                    {{ $t(`financialDictionary.difficulty.${term.difficulty}`) }}
                  </span>
                  <button class="read-more-btn">
                    {{ $t('financialDictionary.readMore') }}
                    <font-awesome-icon icon="fa-solid fa-arrow-right" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>{{ $t('financialDictionary.loading') }}</p>
            </div>

            <!-- No Results -->
            <div v-if="!loading && filteredTerms.length === 0" class="no-results">
              <font-awesome-icon icon="fa-solid fa-search" class="no-results-icon" />
              <h3>{{ $t('financialDictionary.noResults') }}</h3>
              <p>{{ $t('financialDictionary.noResultsDesc') }}</p>
              <button @click="clearAllFilters" class="reset-btn">
                {{ $t('financialDictionary.resetFilters') }}
              </button>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination">
              <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="pagination-btn"
              >
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                :class="['pagination-btn', { active: page === currentPage }]"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
              
              <button
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
                class="pagination-btn"
              >
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Term Detail Modal -->
    <div v-if="selectedTermDetail" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedTermDetail.term }}</h2>
          <button @click="closeModal" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="term-meta">
            <span class="term-category-badge">
              {{ $t(`financialDictionary.categoryNames.${selectedTermDetail.category}`) }}
            </span>
            <span class="difficulty-badge" :class="selectedTermDetail.difficulty">
              {{ $t(`financialDictionary.difficulty.${selectedTermDetail.difficulty}`) }}
            </span>
          </div>
          
          <div class="term-definition">
            <h4>{{ $t('financialDictionary.definition') }}</h4>
            <p>{{ selectedTermDetail.definition }}</p>
          </div>
          
          <div v-if="selectedTermDetail.example" class="term-example">
            <h4>{{ $t('financialDictionary.example') }}</h4>
            <p class="example-text">{{ selectedTermDetail.example }}</p>
          </div>
          
          <div v-if="selectedTermDetail.relatedTerms?.length" class="related-terms">
            <h4>{{ $t('financialDictionary.relatedTerms') }}</h4>
            <div class="related-terms-list">
              <button
                v-for="relatedId in selectedTermDetail.relatedTerms"
                :key="relatedId"
                @click="selectRelatedTerm(relatedId)"
                class="related-term-btn"
              >
                {{ getTermById(relatedId)?.term }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinancialDictionary',
  data() {
    return {
      searchQuery: '',
      selectedCategory: null,
      selectedLetter: null,
      selectedTermDetail: null,
      currentPage: 1,
      itemsPerPage: 12,
      loading: false,
      
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      
      categories: [
        { id: 'banking', icon: 'fa-solid fa-university' },
        { id: 'investing', icon: 'fa-solid fa-chart-line' },
        { id: 'insurance', icon: 'fa-solid fa-shield-alt' },
        { id: 'loans', icon: 'fa-solid fa-hand-holding-usd' },
        { id: 'markets', icon: 'fa-solid fa-chart-bar' },
        { id: 'cryptocurrency', icon: 'fa-brands fa-bitcoin' },
        { id: 'personal-finance', icon: 'fa-solid fa-wallet' },
        { id: 'taxes', icon: 'fa-solid fa-calculator' },
        { id: 'economics', icon: 'fa-solid fa-globe' },
        { id: 'trading', icon: 'fa-solid fa-exchange-alt' }
      ],
      
      financialTerms: [
        // Banking Terms
        {
          id: 1,
          term: "APR",
          definition: "Annual Percentage Rate - Lãi suất phần trăm hàng năm là chi phí hàng năm của một khoản vay, bao gồm lãi suất và các phí khác, được thể hiện dưới dạng phần trăm.",
          category: "banking",
          difficulty: "beginner",
          example: "Nếu thẻ tín dụng có APR 18%, bạn sẽ trả 18% lãi hàng năm trên số dư chưa thanh toán.",
          relatedTerms: [2, 5]
        },
        {
          id: 2,
          term: "Interest Rate",
          definition: "Lãi suất - Tỷ lệ phần trăm mà người vay phải trả cho việc sử dụng tiền của người cho vay trong một khoảng thời gian nhất định.",
          category: "banking",
          difficulty: "beginner",
          example: "Nếu bạn gửi 1 triệu VND với lãi suất 5%/năm, sau 1 năm bạn sẽ có 1,05 triệu VND.",
          relatedTerms: [1, 3]
        },
        {
          id: 3,
          term: "Compound Interest",
          definition: "Lãi kép - Lãi được tính trên cả số tiền gốc ban đầu và lãi đã tích lũy từ các kỳ trước đó.",
          category: "banking",
          difficulty: "intermediate",
          example: "Gửi 10 triệu VND với lãi kép 10%/năm, sau 2 năm bạn có: 10M × (1.1)² = 12,1 triệu VND.",
          relatedTerms: [2, 4]
        },
        
        // Investing Terms
        {
          id: 4,
          term: "Dividend",
          definition: "Cổ tức - Khoản tiền mà công ty trả cho các cổ đông từ lợi nhuận của công ty, thường được trả theo định kỳ.",
          category: "investing",
          difficulty: "beginner",
          example: "Nếu bạn sở hữu 100 cổ phiếu và công ty trả cổ tức 1000 VND/cổ phiếu, bạn nhận được 100,000 VND.",
          relatedTerms: [6, 7]
        },
        {
          id: 5,
          term: "P/E Ratio",
          definition: "Tỷ lệ Giá/Thu nhập - Chỉ số đánh giá mức độ đắt đỏ của cổ phiếu bằng cách so sánh giá cổ phiếu với thu nhập trên mỗi cổ phiếu.",
          category: "investing",
          difficulty: "intermediate",
          example: "Cổ phiếu giá 200,000 VND với EPS 10,000 VND có P/E = 20, nghĩa là nhà đầu tư trả 20 lần thu nhập để mua cổ phiếu.",
          relatedTerms: [6, 8]
        },
        {
          id: 6,
          term: "Market Cap",
          definition: "Vốn hóa thị trường - Tổng giá trị của tất cả cổ phiếu đang lưu hành của một công ty, tính bằng giá cổ phiếu nhân với số lượng cổ phiếu.",
          category: "investing",
          difficulty: "beginner",
          example: "Công ty có 1 triệu cổ phiếu, giá 50,000 VND/cổ phiếu thì vốn hóa = 50 tỷ VND.",
          relatedTerms: [4, 5]
        },
        
        // Market Terms
        {
          id: 7,
          term: "Bull Market",
          definition: "Thị trường tăng - Thời kỳ giá chứng khoán tăng liên tục và tâm lý nhà đầu tư tích cực.",
          category: "markets",
          difficulty: "beginner",
          example: "Thị trường chứng khoán Việt Nam từ 2020-2021 được coi là bull market với VN-Index tăng từ 800 lên 1500 điểm.",
          relatedTerms: [8, 9]
        },
        {
          id: 8,
          term: "Bear Market",
          definition: "Thị trường giảm - Thời kỳ giá chứng khoán giảm liên tục và tâm lý nhà đầu tư bi quan.",
          category: "markets",
          difficulty: "beginner",
          example: "Thị trường chứng khoán thế giới năm 2008 là một bear market điển hình do khủng hoảng tài chính.",
          relatedTerms: [7, 9]
        },
        {
          id: 9,
          term: "Volatility",
          definition: "Biến động - Mức độ thay đổi giá của một tài sản trong một khoảng thời gian, thường được đo bằng độ lệch chuẩn.",
          category: "markets",
          difficulty: "intermediate",
          example: "Cổ phiếu có giá dao động từ 100-200k trong tháng có volatility cao hơn cổ phiếu dao động 100-110k.",
          relatedTerms: [7, 8]
        },
        
        // Cryptocurrency Terms
        {
          id: 10,
          term: "Blockchain",
          definition: "Chuỗi khối - Công nghệ sổ cái phân tán lưu trữ thông tin giao dịch trên nhiều máy tính, đảm bảo tính minh bạch và bảo mật.",
          category: "cryptocurrency",
          difficulty: "intermediate",
          example: "Bitcoin sử dụng blockchain để ghi lại tất cả giao dịch mà không cần ngân hàng trung ương.",
          relatedTerms: [11, 12]
        },
        {
          id: 11,
          term: "Mining",
          definition: "Đào coin - Quá trình sử dụng sức mạnh tính toán để xác thực giao dịch và tạo ra tiền điện tử mới.",
          category: "cryptocurrency",
          difficulty: "advanced",
          example: "Thợ đào Bitcoin sử dụng máy tính chuyên dụng để giải các bài toán phức tạp và nhận Bitcoin làm phần thưởng.",
          relatedTerms: [10, 12]
        },
        {
          id: 12,
          term: "Wallet",
          definition: "Ví điện tử - Phần mềm hoặc thiết bị lưu trữ khóa riêng tư để truy cập và quản lý tiền điện tử.",
          category: "cryptocurrency",
          difficulty: "beginner",
          example: "MetaMask là một ví điện tử phổ biến để lưu trữ Ethereum và các token ERC-20.",
          relatedTerms: [10, 11]
        },
        
        // Personal Finance Terms
        {
          id: 13,
          term: "Emergency Fund",
          definition: "Quỹ khẩn cấp - Số tiền dự trữ để đối phó với các chi phí bất ngờ như mất việc, bệnh tật, hoặc sửa chữa xe cộ.",
          category: "personal-finance",
          difficulty: "beginner",
          example: "Chuyên gia khuyên nên có quỹ khẩn cấp bằng 3-6 tháng chi phí sinh hoạt, khoảng 30-60 triệu VND.",
          relatedTerms: [14, 15]
        },
        {
          id: 14,
          term: "Budget",
          definition: "Ngân sách - Kế hoạch chi tiêu có hệ thống để theo dõi thu nhập và chi phí trong một khoảng thời gian nhất định.",
          category: "personal-finance",
          difficulty: "beginner",
          example: "Ngân sách 50/30/20: 50% thu nhập cho nhu cầu thiết yếu, 30% cho giải trí, 20% cho tiết kiệm.",
          relatedTerms: [13, 15]
        },
        {
          id: 15,
          term: "Credit Score",
          definition: "Điểm tín dụng - Số điểm đánh giá khả năng trả nợ của cá nhân dựa trên lịch sử tài chính, ảnh hưởng đến khả năng vay vốn.",
          category: "personal-finance",
          difficulty: "intermediate",
          example: "Điểm tín dụng cao (trên 700) giúp bạn được duyệt vay với lãi suất thấp hơn.",
          relatedTerms: [13, 14]
        }
      ]
    };
  },
  
  computed: {
    filteredTerms() {
      let terms = [...this.financialTerms];
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        terms = terms.filter(term => 
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (this.selectedCategory) {
        terms = terms.filter(term => term.category === this.selectedCategory);
      }
      
      // Filter by letter
      if (this.selectedLetter) {
        terms = terms.filter(term => 
          term.term.charAt(0).toUpperCase() === this.selectedLetter
        );
      }
      
      // Sort alphabetically
      return terms.sort((a, b) => a.term.localeCompare(b.term));
    },
    
    totalTerms() {
      return this.financialTerms.length;
    },
    
    totalPages() {
      return Math.ceil(this.filteredTerms.length / this.itemsPerPage);
    },
    
    paginatedTerms() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTerms.slice(start, end);
    },
    
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 2;
      
      const range = [];
      const rangeWithDots = [];
      
      for (let i = Math.max(2, current - delta);
           i <= Math.min(total - 1, current + delta);
           i++) {
        range.push(i);
      }
      
      if (current - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }
      
      rangeWithDots.push(...range);
      
      if (current + delta < total - 1) {
        rangeWithDots.push('...', total);
      } else if (total > 1) {
        rangeWithDots.push(total);
      }
      
      return rangeWithDots;
    }
  },
  
  methods: {
    handleSearch() {
      this.currentPage = 1;
    },
    
    selectCategory(categoryId) {
      this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId;
      this.currentPage = 1;
    },
    
    selectLetter(letter) {
      this.selectedLetter = this.selectedLetter === letter ? null : letter;
      this.currentPage = 1;
    },
    
    selectTerm(term) {
      this.selectedTermDetail = term;
      document.body.style.overflow = 'hidden';
    },
    
    closeModal() {
      this.selectedTermDetail = null;
      document.body.style.overflow = 'auto';
    },
    
    selectRelatedTerm(termId) {
      const term = this.getTermById(termId);
      if (term) {
        this.selectedTermDetail = term;
      }
    },
    
    getTermById(id) {
      return this.financialTerms.find(term => term.id === id);
    },
    
    getTermCountByCategory(categoryId) {
      return this.financialTerms.filter(term => term.category === categoryId).length;
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
    
    clearCategory() {
      this.selectedCategory = null;
      this.currentPage = 1;
    },
    
    clearLetter() {
      this.selectedLetter = null;
      this.currentPage = 1;
    },
    
    clearAllFilters() {
      this.searchQuery = '';
      this.selectedCategory = null;
      this.selectedLetter = null;
      this.currentPage = 1;
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },
    
    truncateText(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  },
  
  mounted() {
    // Simulate loading
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  
  beforeUnmount() {
    document.body.style.overflow = 'auto';
  }
};
</script>

<style scoped>
.financial-dictionary {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dictionary-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-container {
  max-width: 500px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #666;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #333;
}

.dictionary-content {
  padding: 4rem 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.categories-section,
.alphabet-section,
.stats-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.categories-section h3,
.alphabet-section h3,
.stats-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  background: #f8f9fa;
  color: #555;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.category-btn:hover,
.category-btn.active {
  background: #667eea;
  color: white;
  transform: translateX(5px);
}

.category-icon {
  width: 16px;
  flex-shrink: 0;
}

.term-count {
  margin-left: auto;
  font-size: 0.8rem;
  opacity: 0.7;
}

.alphabet-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.alphabet-btn {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.alphabet-btn:hover,
.alphabet-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.terms-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.filter-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.active-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.remove-filter {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  margin-left: 0.25rem;
}

.clear-all-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.clear-all-btn:hover {
  background: #d32f2f;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.term-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.term-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.term-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.term-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.term-category {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.term-preview {
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.term-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.difficulty-badge.beginner {
  background: #e8f5e8;
  color: #2e7d32;
}

.difficulty-badge.intermediate {
  background: #fff3e0;
  color: #f57c00;
}

.difficulty-badge.advanced {
  background: #ffebee;
  color: #c62828;
}

.read-more-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  color: #5a6fd8;
  transform: translateX(3px);
}

.loading-state,
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.reset-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.reset-btn:hover {
  background: #5a6fd8;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn {
  background: white;
  border: 1px solid #e0e0e0;
  color: #666;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
}

.pagination-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #667eea;
}

.pagination-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 0 2rem 2rem;
}

.term-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.term-category-badge {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.term-definition,
.term-example,
.related-terms {
  margin-bottom: 2rem;
}

.term-definition h4,
.term-example h4,
.related-terms h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
}

.term-definition p,
.example-text {
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.example-text {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  font-style: italic;
}

.related-terms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.related-term-btn {
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.related-term-btn:hover {
  background: #1976d2;
  color: white;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .terms-grid {
    grid-template-columns: 1fr;
  }
  
  .alphabet-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-info {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .modal-content {
    margin: 1rem;
    max-height: 90vh;
  }
  
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .search-input {
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  }
  
  .dictionary-header {
    padding: 2rem 0;
  }
  
  .dictionary-content {
    padding: 2rem 0;
  }
}
</style> 