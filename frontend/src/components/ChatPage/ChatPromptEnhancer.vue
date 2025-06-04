<template>
  <div class="prompt-enhancer">
    <!-- Quick Action Buttons -->
    <div class="quick-actions" v-if="showQuickActions">
      <div class="action-category" v-for="category in actionCategories" :key="category.name">
        <h4>{{ category.name }}</h4>
        <div class="action-buttons">
          <button 
            v-for="action in category.actions" 
            :key="action.id"
            @click="selectTemplate(action)"
            class="action-btn"
            :class="action.type"
          >
            <font-awesome-icon :icon="action.icon" />
            <span>{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contextual Suggestions -->
    <div class="contextual-suggestions" v-if="contextualSuggestions.length > 0">
      <h4>💡 Gợi ý dựa trên ngữ cảnh</h4>
      <div class="suggestion-pills">
        <button 
          v-for="suggestion in contextualSuggestions" 
          :key="suggestion.id"
          @click="applySuggestion(suggestion)"
          class="suggestion-pill"
        >
          {{ suggestion.text }}
        </button>
      </div>
    </div>

    <!-- Prompt Templates Modal -->
    <div class="template-modal" v-if="showTemplateModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedAction.label }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p class="template-description">{{ selectedAction.description }}</p>
          
          <!-- Dynamic form fields -->
          <div class="form-group" v-for="field in selectedAction.fields" :key="field.name">
            <label>{{ field.label }}</label>
            <input 
              v-if="field.type === 'text' || field.type === 'number'"
              :type="field.type"
              v-model="templateData[field.name]"
              :placeholder="field.placeholder"
              class="form-input"
            />
            <select 
              v-else-if="field.type === 'select'"
              v-model="templateData[field.name]"
              class="form-select"
            >
              <option value="">{{ field.placeholder }}</option>
              <option v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <!-- Preview -->
          <div class="preview-section">
            <h4>🔍 Xem trước tin nhắn:</h4>
            <div class="preview-text">{{ generatePreview() }}</div>
          </div>

          <!-- Action buttons -->
          <div class="modal-actions">
            <button @click="closeModal" class="btn btn-secondary">Hủy</button>
            <button @click="applyTemplate" class="btn btn-primary">Sử dụng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Smart Prompt Suggestions -->
    <div class="smart-suggestions" v-if="smartSuggestions.length > 0">
      <h4>🤖 Gợi ý thông minh</h4>
      <div class="smart-suggestion-cards">
        <div 
          v-for="suggestion in smartSuggestions" 
          :key="suggestion.id"
          @click="applySuggestion(suggestion)"
          class="smart-card"
        >
          <div class="card-icon">
            <font-awesome-icon :icon="suggestion.icon" />
          </div>
          <div class="card-content">
            <h5>{{ suggestion.title }}</h5>
            <p>{{ suggestion.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Prompt Quality Checker -->
    <div class="quality-checker" v-if="currentPrompt && showQualityChecker">
      <div class="quality-score">
        <span class="score-label">Chất lượng prompt:</span>
        <div class="score-bar">
          <div 
            class="score-fill" 
            :style="{ width: qualityScore + '%', backgroundColor: getScoreColor(qualityScore) }"
          ></div>
        </div>
        <span class="score-value">{{ qualityScore }}/100</span>
      </div>
      
      <div class="quality-tips" v-if="qualityTips.length > 0">
        <h5>💡 Cách cải thiện:</h5>
        <ul>
          <li v-for="tip in qualityTips" :key="tip">{{ tip }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatPromptEnhancer',
  props: {
    currentPrompt: {
      type: String,
      default: ''
    },
    chatHistory: {
      type: Array,
      default: () => []
    },
    userContext: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showQuickActions: true,
      showTemplateModal: false,
      showQualityChecker: true,
      selectedAction: null,
      templateData: {},
      actionCategories: [
        {
          name: '💰 Tài chính cá nhân',
          actions: [
            {
              id: 'add_income',
              label: 'Thêm thu nhập',
              icon: 'fa-plus',
              type: 'income',
              description: 'Ghi nhận khoản thu nhập mới vào tài khoản',
              template: 'Tôi vừa nhận được {amount} từ {source}',
              fields: [
                { name: 'amount', label: 'Số tiền', type: 'number', placeholder: 'Nhập số tiền' },
                { name: 'source', label: 'Nguồn thu', type: 'select', placeholder: 'Chọn nguồn thu', options: ['Lương', 'Thưởng', 'Đầu tư', 'Freelance', 'Khác'] }
              ]
            },
            {
              id: 'add_expense',
              label: 'Ghi chi tiêu',
              icon: 'fa-minus',
              type: 'expense',
              description: 'Ghi nhận khoản chi tiêu',
              template: 'Tôi vừa chi {amount} cho {category}',
              fields: [
                { name: 'amount', label: 'Số tiền', type: 'number', placeholder: 'Nhập số tiền' },
                { name: 'category', label: 'Danh mục', type: 'select', placeholder: 'Chọn danh mục', options: ['Ăn uống', 'Giao thông', 'Mua sắm', 'Giải trí', 'Y tế', 'Giáo dục', 'Khác'] }
              ]
            },
            {
              id: 'create_goal',
              label: 'Tạo mục tiêu',
              icon: 'fa-target',
              type: 'goal',
              description: 'Tạo mục tiêu tiết kiệm mới',
              template: 'Tôi muốn tạo mục tiêu tiết kiệm {amount} để {purpose}',
              fields: [
                { name: 'amount', label: 'Số tiền mục tiêu', type: 'number', placeholder: 'Nhập số tiền' },
                { name: 'purpose', label: 'Mục đích', type: 'text', placeholder: 'Ví dụ: mua xe, du lịch...' }
              ]
            }
          ]
        },
        {
          name: '📈 Đầu tư & Cổ phiếu',
          actions: [
            {
              id: 'advanced_stock_analysis',
              label: 'Phân tích cổ phiếu chuyên sâu',
              icon: 'fa-chart-line',
              type: 'stock',
              description: 'Phân tích toàn diện một cổ phiếu với các chỉ số kỹ thuật và cơ bản',
              template: 'Phân tích chuyên sâu cổ phiếu {symbol} trong khung thời gian {timeframe}, bao gồm: (1) Phân tích kỹ thuật với RSI, MACD, Moving Averages, Bollinger Bands, (2) Phân tích cơ bản: P/E ratio, ROE, debt-to-equity, revenue growth, profit margins, (3) So sánh với các đối thủ cạnh tranh trong ngành {sector}, (4) Đánh giá rủi ro và tiềm năng tăng trưởng, (5) Khuyến nghị BUY/HOLD/SELL với mức giá mục tiêu và điểm stop-loss cụ thể',
              fields: [
                { name: 'symbol', label: 'Mã cổ phiếu', type: 'text', placeholder: 'VD: AAPL, MSFT, GOOGL, TSLA, NVDA' },
                { name: 'timeframe', label: 'Khung thời gian phân tích', type: 'select', placeholder: 'Chọn thời gian', options: ['1 tuần', '1 tháng', '3 tháng', '6 tháng', '1 năm', '2 năm'] },
                { name: 'sector', label: 'Ngành nghề', type: 'text', placeholder: 'VD: Technology, Healthcare, Finance, Energy' }
              ]
            },
            {
              id: 'market_research_search',
              label: 'Nghiên cứu thị trường với tìm kiếm',
              icon: 'fa-search',
              type: 'search',
              description: 'Tìm kiếm và phân tích thông tin thị trường mới nhất',
              template: '#search Nghiên cứu toàn diện về {topic} trong {timeframe} qua, tập trung vào {focus_area}. Tìm kiếm thông tin từ: (1) Báo cáo tài chính chính thức từ các công ty, (2) Phân tích từ Goldman Sachs, JP Morgan, Morgan Stanley, (3) Tin tức từ Bloomberg, Reuters, CNBC, (4) Dữ liệu kinh tế từ Fed, IMF, World Bank, (5) Sentiment analysis từ Twitter, Reddit, financial forums. Tổng hợp và đưa ra insight có giá trị cho quyết định đầu tư',
              fields: [
                { name: 'topic', label: 'Chủ đề nghiên cứu', type: 'text', placeholder: 'VD: AI revolution impact on tech stocks, Federal Reserve policy changes, China economic outlook' },
                { name: 'timeframe', label: 'Khoảng thời gian', type: 'select', placeholder: 'Chọn thời gian', options: ['24 giờ', '1 tuần', '1 tháng', '3 tháng', '6 tháng'] },
                { name: 'focus_area', label: 'Lĩnh vực tập trung', type: 'select', placeholder: 'Chọn trọng tâm', options: ['Market sentiment', 'Financial performance', 'Technical analysis', 'Regulatory impact', 'Competitive landscape', 'Innovation trends'] }
              ]
            },
            {
              id: 'portfolio_optimization',
              label: 'Tối ưu hóa danh mục đầu tư',
              icon: 'fa-chart-pie',
              type: 'portfolio',
              description: 'Phân tích và tối ưu hóa danh mục đầu tư theo Modern Portfolio Theory',
              template: 'Tối ưu hóa danh mục đầu tư với mức độ rủi ro {risk_level}, vốn đầu tư {capital} VNĐ, thời gian đầu tư {investment_horizon}. Áp dụng Modern Portfolio Theory để: (1) Tính toán efficient frontier, (2) Đề xuất asset allocation tối ưu giữa stocks/bonds/commodities/REITs/cash, (3) Tính expected return và Sharpe ratio, (4) Stress testing với các kịch bản thị trường khác nhau, (5) Rebalancing strategy định kỳ',
              fields: [
                { name: 'risk_level', label: 'Mức độ rủi ro chấp nhận', type: 'select', placeholder: 'Chọn mức rủi ro', options: ['Thấp - Conservative (20-30% stocks)', 'Trung bình - Moderate (50-70% stocks)', 'Cao - Aggressive (80-100% stocks)'] },
                { name: 'capital', label: 'Vốn đầu tư (VNĐ)', type: 'number', placeholder: '100000000' },
                { name: 'investment_horizon', label: 'Thời gian đầu tư', type: 'select', placeholder: 'Chọn thời gian', options: ['Ngắn hạn (< 1 năm)', 'Trung hạn (1-5 năm)', 'Dài hạn (5-10 năm)', 'Rất dài hạn (> 10 năm)'] }
              ]
            },
            {
              id: 'sector_rotation_analysis',
              label: 'Phân tích luân chuyển ngành',
              icon: 'fa-sync-alt',
              type: 'strategy',
              description: 'Phân tích chiến lược sector rotation theo chu kỳ kinh tế',
              template: 'Phân tích chiến lược sector rotation cho giai đoạn {economic_phase} của chu kỳ kinh tế. Đánh giá hiệu suất historical và triển vọng của các ngành: (1) Technology & Growth stocks, (2) Healthcare & Defensive sectors, (3) Financials & Cyclical stocks, (4) Energy & Materials, (5) Consumer Discretionary vs Staples, (6) REITs & Utilities. Đề xuất timing và tỷ lệ phân bổ cụ thể cho từng ngành',
              fields: [
                { name: 'economic_phase', label: 'Giai đoạn chu kỳ kinh tế', type: 'select', placeholder: 'Chọn giai đoạn', options: ['Early Cycle - Phục hồi kinh tế', 'Mid Cycle - Tăng trưởng ổn định', 'Late Cycle - Đỉnh tăng trưởng', 'Recession - Suy thoái kinh tế'] }
              ]
            },
            {
              id: 'competitive_analysis_search',
              label: 'Phân tích cạnh tranh với tìm kiếm',
              icon: 'fa-users',
              type: 'competitive',
              description: 'So sánh competitive landscape và positioning',
              template: '#search So sánh chi tiết {main_company} với các đối thủ cạnh tranh {competitors} trong ngành {industry}. Phân tích: (1) Market share và positioning, (2) Financial metrics comparison (revenue, profit margins, ROE, debt levels), (3) Innovation pipeline và R&D spending, (4) Strategic advantages và moats, (5) Valuation multiples (P/E, P/S, EV/EBITDA), (6) Management quality và corporate governance, (7) Future growth prospects và risks',
              fields: [
                { name: 'main_company', label: 'Công ty chính', type: 'text', placeholder: 'VD: Apple, Tesla, Microsoft, Amazon' },
                { name: 'competitors', label: 'Đối thủ cạnh tranh', type: 'text', placeholder: 'VD: Samsung & Google (cho Apple), Ford & GM (cho Tesla)' },
                { name: 'industry', label: 'Ngành công nghiệp', type: 'text', placeholder: 'VD: Consumer Electronics, Electric Vehicles, Cloud Computing' }
              ]
            },
            {
              id: 'risk_management_system',
              label: 'Hệ thống quản lý rủi ro',
              icon: 'fa-shield-alt',
              type: 'risk',
              description: 'Xây dựng framework quản lý rủi ro toàn diện',
              template: 'Thiết kế hệ thống quản lý rủi ro cho danh mục {portfolio_value} VNĐ với tolerance {risk_tolerance}. Bao gồm: (1) Tính toán Value at Risk (VaR) và Conditional VaR, (2) Thiết lập stop-loss levels và position sizing, (3) Portfolio diversification analysis và correlation matrix, (4) Stress testing với scenarios: market crash, interest rate changes, recession, (5) Hedging strategies với options/futures, (6) Dynamic rebalancing rules, (7) Performance attribution và risk-adjusted returns',
              fields: [
                { name: 'portfolio_value', label: 'Giá trị danh mục (VNĐ)', type: 'number', placeholder: '500000000' },
                { name: 'risk_tolerance', label: 'Khả năng chịu rủi ro', type: 'select', placeholder: 'Chọn mức độ', options: ['Rất thấp (max 5% drawdown)', 'Thấp (max 10% drawdown)', 'Trung bình (max 20% drawdown)', 'Cao (max 30% drawdown)'] }
              ]
            },
            {
              id: 'buy_stock_advanced',
              label: 'Lệnh mua có phân tích',
              icon: 'fa-shopping-cart',
              type: 'trading',
              description: 'Đặt lệnh mua với phân tích đầy đủ',
              template: 'Tôi muốn mua {quantity} cổ phiếu {symbol} với ngân sách {budget} VNĐ. Hãy phân tích: (1) Timing entry point tối ưu, (2) Technical indicators hỗ trợ quyết định, (3) Risk/reward ratio, (4) Position sizing phù hợp với danh mục, (5) Stop-loss và take-profit levels, (6) Impact lên diversification của portfolio hiện tại',
              fields: [
                { name: 'symbol', label: 'Mã cổ phiếu', type: 'text', placeholder: 'VD: AAPL, GOOGL' },
                { name: 'quantity', label: 'Số lượng cổ phiếu', type: 'number', placeholder: '10' },
                { name: 'budget', label: 'Ngân sách (VNĐ)', type: 'number', placeholder: '50000000' }
              ]
            }
          ]
        },
        {
          name: '🎓 Kiến thức tài chính',
          actions: [
            {
              id: 'define_term',
              label: 'Giải thích thuật ngữ',
              icon: 'fa-book',
              type: 'education',
              description: 'Tìm hiểu ý nghĩa của thuật ngữ tài chính',
              template: 'Giải thích cho tôi thuật ngữ {term}',
              fields: [
                { name: 'term', label: 'Thuật ngữ', type: 'text', placeholder: 'VD: P/E ratio, ROI, IPO...' }
              ]
            },
            {
              id: 'market_analysis',
              label: 'Phân tích thị trường',
              icon: 'fa-globe',
              type: 'analysis',
              description: 'Nhận định về tình hình thị trường',
              template: 'Phân tích tình hình thị trường {market} hiện tại',
              fields: [
                { name: 'market', label: 'Thị trường', type: 'select', placeholder: 'Chọn thị trường', options: ['Cổ phiếu Việt Nam', 'Cổ phiếu Mỹ', 'Tiền điện tử', 'Vàng', 'Bất động sản'] }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    contextualSuggestions() {
      // Generate suggestions based on chat history and current context
      const suggestions = [];
      
      if (this.chatHistory.length === 0) {
        suggestions.push(
          { id: 'welcome1', text: 'Tôi muốn biết cách đầu tư cho người mới bắt đầu' },
          { id: 'welcome2', text: 'Hướng dẫn tôi lập ngân sách hàng tháng' },
          { id: 'welcome3', text: 'Phân tích danh mục đầu tư của tôi' }
        );
      }
      
      // Based on recent messages
      const recentMessages = this.chatHistory.slice(-3);
      if (recentMessages.some(msg => msg.text.includes('cổ phiếu'))) {
        suggestions.push(
          { id: 'stock1', text: 'Phân tích rủi ro của danh mục hiện tại' },
          { id: 'stock2', text: 'Gợi ý cổ phiếu phù hợp với tôi' }
        );
      }
      
      return suggestions;
    },
    
    smartSuggestions() {
      // AI-powered smart suggestions
      return [
        {
          id: 'smart1',
          title: 'Tối ưu hóa câu hỏi',
          description: 'Làm cho câu hỏi cụ thể và chi tiết hơn',
          icon: 'fa-magic',
          action: 'optimize'
        },
        {
          id: 'smart2', 
          title: 'Thêm ngữ cảnh',
          description: 'Bổ sung thông tin về tình huống cá nhân',
          icon: 'fa-user-plus',
          action: 'add_context'
        },
        {
          id: 'smart3',
          title: 'Chia nhỏ câu hỏi',
          description: 'Tách thành nhiều câu hỏi đơn giản',
          icon: 'fa-list',
          action: 'split_question'
        }
      ];
    },
    
    qualityScore() {
      if (!this.currentPrompt) return 0;
      
      let score = 0;
      const prompt = this.currentPrompt.toLowerCase();
      
      // Length and detail check (more demanding)
      if (prompt.length > 20) score += 15;
      if (prompt.length > 50) score += 15;
      if (prompt.length > 100) score += 15;
      if (prompt.length > 200) score += 10;
      
      // Specificity and personal context (higher weight)
      if (prompt.includes('tôi') || prompt.includes('của tôi') || prompt.includes('cho tôi')) score += 20;
      if (/\d+/.test(prompt)) score += 15; // Contains specific numbers
      if (prompt.match(/\d+\.?\d*\s*(triệu|tỷ|nghìn|vnđ|vnd|\$|usd)/)) score += 10; // Financial amounts
      
      // Question clarity and structure
      if (prompt.includes('?') || prompt.includes('như thế nào') || prompt.includes('làm sao') || prompt.includes('hãy')) score += 10;
      if (prompt.includes('phân tích') || prompt.includes('đánh giá') || prompt.includes('so sánh')) score += 10;
      
      // Advanced financial keywords (higher weight for sophisticated terms)
      const basicFinKeywords = ['đầu tư', 'cổ phiếu', 'tiền', 'ngân sách', 'tiết kiệm', 'lãi suất'];
      const advancedFinKeywords = ['portfolio', 'p/e ratio', 'rsi', 'macd', 'roi', 'roe', 'sharpe ratio', 'var', 'beta', 'alpha', 'diversification', 'correlation', 'volatility'];
      
      if (basicFinKeywords.some(keyword => prompt.includes(keyword))) score += 10;
      if (advancedFinKeywords.some(keyword => prompt.includes(keyword))) score += 20;
      
      // Technical analysis terms
      const techAnalysisTerms = ['moving average', 'bollinger bands', 'support', 'resistance', 'fibonacci', 'candlestick', 'volume', 'momentum'];
      if (techAnalysisTerms.some(term => prompt.includes(term))) score += 15;
      
      // Context and planning indicators (higher weight)
      if (prompt.includes('hiện tại') || prompt.includes('mục tiêu') || prompt.includes('kế hoạch') || prompt.includes('chiến lược')) score += 15;
      if (prompt.includes('ngắn hạn') || prompt.includes('dài hạn') || prompt.includes('trung hạn')) score += 10;
      
      // Search and research indicators
      if (prompt.includes('#search') || prompt.includes('tìm kiếm') || prompt.includes('nghiên cứu')) score += 15;
      
      // Comprehensive analysis indicators
      if (prompt.includes('bao gồm') || prompt.includes('tập trung vào') || prompt.includes('chi tiết')) score += 10;
      if ((prompt.match(/\(\d+\)/g) || []).length >= 3) score += 15; // Structured with numbered points
      
      // Penalty for too short or vague prompts
      if (prompt.length < 15) score -= 20;
      if (prompt.includes('gì') && prompt.length < 30) score -= 10; // Vague questions
      
      return Math.max(0, Math.min(score, 100));
    },
    
    qualityTips() {
      const tips = [];
      const prompt = this.currentPrompt.toLowerCase();
      
      if (prompt.length < 10) {
        tips.push('Hãy mô tả chi tiết hơn về vấn đề bạn muốn hỏi');
      }
      
      if (!prompt.includes('tôi') && !prompt.includes('của tôi')) {
        tips.push('Thêm thông tin về tình huống cá nhân để nhận được lời khuyên phù hợp');
      }
      
      if (!/\d/.test(prompt)) {
        tips.push('Bổ sung số liệu cụ thể (số tiền, thời gian, tỷ lệ...) nếu có');
      }
      
      if (!prompt.includes('?') && !prompt.includes('như thế nào') && !prompt.includes('làm sao')) {
        tips.push('Đặt câu hỏi rõ ràng hơn với từ nghi vấn');
      }
      
      return tips;
    }
  },
  methods: {
    selectTemplate(action) {
      this.selectedAction = action;
      this.templateData = {};
      this.showTemplateModal = true;
    },
    
    closeModal() {
      this.showTemplateModal = false;
      this.selectedAction = null;
      this.templateData = {};
    },
    
    generatePreview() {
      if (!this.selectedAction) return '';
      
      let preview = this.selectedAction.template;
      Object.keys(this.templateData).forEach(key => {
        const value = this.templateData[key];
        if (value) {
          preview = preview.replace(`{${key}}`, value);
        }
      });
      
      return preview;
    },
    
    applyTemplate() {
      const message = this.generatePreview();
      this.$emit('apply-prompt', message);
      this.closeModal();
    },
    
    applySuggestion(suggestion) {
      this.$emit('apply-prompt', suggestion.text);
    },
    
    getScoreColor(score) {
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#FF9800';
      return '#F44336';
    }
  }
}
</script>

<style scoped>
.prompt-enhancer {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 24px;
}

.action-category {
  margin-bottom: 20px;
}

.action-category h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f5f5f5;
  color: #333;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn.income { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; }
.action-btn.expense { background: linear-gradient(135deg, #f44336, #d32f2f); color: white; }
.action-btn.stock { background: linear-gradient(135deg, #2196F3, #1976D2); color: white; }
.action-btn.goal { background: linear-gradient(135deg, #FF9800, #F57C00); color: white; }
.action-btn.education { background: linear-gradient(135deg, #9C27B0, #7B1FA2); color: white; }

/* Contextual Suggestions */
.contextual-suggestions {
  margin-bottom: 20px;
}

.contextual-suggestions h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.suggestion-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-pill {
  padding: 6px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  background: white;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-pill:hover {
  border-color: #2196F3;
  color: #2196F3;
  background: rgba(33, 150, 243, 0.05);
}

/* Template Modal */
.template-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.template-description {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.form-input, .form-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #2196F3;
}

.preview-section {
  margin: 20px 0;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.preview-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
}

.preview-text {
  font-style: italic;
  color: #555;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-primary {
  background: #2196F3;
  color: white;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Smart Suggestions */
.smart-suggestions {
  margin-bottom: 20px;
}

.smart-suggestions h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.smart-suggestion-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.smart-card {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.smart-card:hover {
  border-color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  color: #2196F3;
  font-size: 20px;
  margin-bottom: 8px;
}

.card-content h5 {
  margin: 0 0 4px 0;
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.card-content p {
  margin: 0;
  font-size: 11px;
  color: #666;
  line-height: 1.4;
}

/* Quality Checker */
.quality-checker {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.quality-score {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.score-label {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  min-width: fit-content;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.score-value {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  min-width: fit-content;
}

.quality-tips h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.quality-tips ul {
  margin: 0;
  padding-left: 16px;
}

.quality-tips li {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .prompt-enhancer {
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .action-buttons {
    gap: 6px;
  }
  
  .action-btn {
    font-size: 11px;
    padding: 6px 10px;
  }
  
  .smart-suggestion-cards {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style> 