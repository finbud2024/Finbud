<template>
  <div class="pe-deal-scout">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">
            <font-awesome-icon icon="fa-solid fa-search-dollar" class="scout-icon" />
            FinXpert: Private Equity Deal Scout
          </h1>
          <p class="subtitle">AI chuyên gia hỗ trợ khám phá, thẩm định và mô phỏng thương vụ PE</p>
        </div>
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalDeals }}</span>
            <span class="stat-label">Deals Analyzed</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ avgIRR }}%</span>
            <span class="stat-label">Avg IRR</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${{ medianEV }}M</span>
            <span class="stat-label">Median EV</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div class="dashboard-container">
      <div class="left-panel">
        
        <!-- Deal Input Section -->
        <div class="feature-card deal-input">
          <div class="card-header">
            <h3><font-awesome-icon icon="fa-solid fa-plus" /> Tạo Deal Mới</h3>
          </div>
          <div class="card-content">
            <div class="input-group">
              <label>Tên công ty</label>
              <input v-model="dealForm.companyName" type="text" placeholder="VD: TechViet Solutions">
            </div>
            <div class="input-row">
              <div class="input-group">
                <label>Ngành</label>
                <select v-model="dealForm.sector">
                  <option value="saas">SaaS</option>
                  <option value="fintech">FinTech</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="healthcare">HealthTech</option>
                  <option value="edtech">EdTech</option>
                </select>
              </div>
              <div class="input-group">
                <label>Stage</label>
                <select v-model="dealForm.stage">
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="growth">Growth</option>
                  <option value="buyout">Buyout</option>
                </select>
              </div>
            </div>
            <div class="input-row">
              <div class="input-group">
                <label>EBITDA (M USD)</label>
                <input v-model.number="dealForm.ebitda" type="number" placeholder="5">
              </div>
              <div class="input-group">
                <label>Revenue (M USD)</label>
                <input v-model.number="dealForm.revenue" type="number" placeholder="20">
              </div>
            </div>
            <button @click="analyzeDeal" class="analyze-btn">
              <font-awesome-icon icon="fa-solid fa-chart-line" />
              Phân tích Deal
            </button>
          </div>
        </div>

        <!-- LBO Calculator -->
        <div class="feature-card lbo-calculator" v-if="showCalculator">
          <div class="card-header">
            <h3><font-awesome-icon icon="fa-solid fa-calculator" /> LBO Calculator</h3>
          </div>
          <div class="card-content">
            <div class="calculator-inputs">
              <div class="input-row">
                <div class="input-group">
                  <label>Debt/EBITDA Multiple</label>
                  <input v-model.number="lboData.debtMultiple" type="range" min="3" max="8" step="0.5" 
                         @input="calculateLBO">
                  <span class="range-value">{{ lboData.debtMultiple }}x</span>
                </div>
                <div class="input-group">
                  <label>Exit Multiple</label>
                  <input v-model.number="lboData.exitMultiple" type="range" min="8" max="20" step="0.5"
                         @input="calculateLBO">
                  <span class="range-value">{{ lboData.exitMultiple }}x</span>
                </div>
              </div>
              <div class="input-row">
                <div class="input-group">
                  <label>Interest Rate (%)</label>
                  <input v-model.number="lboData.interestRate" type="range" min="3" max="12" step="0.25"
                         @input="calculateLBO">
                  <span class="range-value">{{ lboData.interestRate }}%</span>
                </div>
                <div class="input-group">
                  <label>Holding Period (Years)</label>
                  <input v-model.number="lboData.holdingPeriod" type="range" min="3" max="8" step="1"
                         @input="calculateLBO">
                  <span class="range-value">{{ lboData.holdingPeriod }} năm</span>
                </div>
              </div>
            </div>
            
            <div class="lbo-results">
              <div class="result-card">
                <h4>IRR</h4>
                <div class="result-value" :class="getIRRClass(lboResults.irr)">{{ lboResults.irr }}%</div>
              </div>
              <div class="result-card">
                <h4>Cash-on-Cash</h4>
                <div class="result-value">{{ lboResults.cashOnCash }}x</div>
              </div>
              <div class="result-card">
                <h4>Payback Period</h4>
                <div class="result-value">{{ lboResults.paybackPeriod }} năm</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deal Structuring -->
        <div class="feature-card deal-structuring" v-if="showStructuring">
          <div class="card-header">
            <h3><font-awesome-icon icon="fa-solid fa-layer-group" /> Deal Structuring</h3>
          </div>
          <div class="card-content">
            <div class="structure-options">
              <div class="input-group">
                <label>Preferred Shares (%)</label>
                <input v-model.number="structureData.preferredPercent" type="range" min="10" max="80" step="5"
                       @input="calculateWaterfall">
                <span class="range-value">{{ structureData.preferredPercent }}%</span>
              </div>
              <div class="input-group">
                <label>Liquidation Preference</label>
                <select v-model="structureData.liquidationPref" @change="calculateWaterfall">
                  <option value="1x">1x Non-Participating</option>
                  <option value="2x">2x Non-Participating</option>
                  <option value="1x-participating">1x Participating</option>
                </select>
              </div>
            </div>
            
            <div class="waterfall-chart">
              <h4>Exit Waterfall Simulation</h4>
              <div class="exit-scenarios">
                <div v-for="scenario in exitScenarios" :key="scenario.name" class="scenario-card">
                  <h5>{{ scenario.name }}</h5>
                  <div class="scenario-value">${{ scenario.exitValue }}M</div>
                  <div class="distribution">
                    <div class="dist-item">
                      <span>Investors: </span>
                      <span class="amount">${{ scenario.investorReturn }}M</span>
                    </div>
                    <div class="dist-item">
                      <span>Founders: </span>
                      <span class="amount">${{ scenario.founderReturn }}M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="right-panel">
        
        <!-- Deal Scoring -->
        <div class="feature-card deal-scoring" v-if="dealScore">
          <div class="card-header">
            <h3><font-awesome-icon icon="fa-solid fa-star" /> Deal Score</h3>
          </div>
          <div class="card-content">
            <div class="overall-score">
              <div class="score-circle">
                <span class="score-number">{{ dealScore.overall }}</span>
                <span class="score-label">/100</span>
              </div>
              <div class="score-grade" :class="getScoreGrade(dealScore.overall)">
                {{ getScoreLabel(dealScore.overall) }}
              </div>
            </div>
            
            <div class="score-breakdown">
              <div v-for="metric in dealScore.metrics" :key="metric.name" class="metric-item">
                <div class="metric-info">
                  <span class="metric-name">{{ metric.name }}</span>
                  <span class="metric-score">{{ metric.score }}/25</span>
                </div>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: (metric.score/25*100) + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="key-questions">
              <h4>Key Questions to Ask:</h4>
              <ul class="question-list">
                <li v-for="question in keyQuestions" :key="question">{{ question }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Market Dashboard -->
        <div class="feature-card market-dashboard">
          <div class="card-header">
            <h3><font-awesome-icon icon="fa-solid fa-chart-bar" /> Market Trends</h3>
          </div>
          <div class="card-content">
            <div class="trend-stats">
              <div class="trend-item">
                <div class="trend-label">Q4 2024 Deals</div>
                <div class="trend-value">847</div>
                <div class="trend-change positive">+12%</div>
              </div>
              <div class="trend-item">
                <div class="trend-label">Median EV/EBITDA</div>
                <div class="trend-value">12.3x</div>
                <div class="trend-change negative">-2%</div>
              </div>
            </div>
            
            <div class="hot-sectors">
              <h4>Hot Sectors</h4>
              <div class="sector-list">
                <div v-for="sector in hotSectors" :key="sector.name" class="sector-item">
                  <span class="sector-name">{{ sector.name }}</span>
                  <span class="sector-deals">{{ sector.deals }} deals</span>
                  <div class="sector-bar">
                    <div class="sector-fill" :style="{ width: sector.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deal Memo Generator -->
        <div class="feature-card deal-memo" v-if="showMemo">
          <div class="card-header">
            <h3><font-awesome-icon icon="fa-solid fa-file-alt" /> AI Deal Memo</h3>
            <button @click="generateMemo" class="generate-btn">Generate</button>
          </div>
          <div class="card-content">
            <div class="memo-preview" v-if="dealMemo.generated">
              <div class="memo-section">
                <h4>Investment Highlights</h4>
                <ul>
                  <li v-for="highlight in dealMemo.highlights" :key="highlight">{{ highlight }}</li>
                </ul>
              </div>
              <div class="memo-section">
                <h4>Key Risks</h4>
                <ul>
                  <li v-for="risk in dealMemo.risks" :key="risk">{{ risk }}</li>
                </ul>
              </div>
              <div class="memo-section">
                <h4>Next Steps</h4>
                <ul>
                  <li v-for="step in dealMemo.nextSteps" :key="step">{{ step }}</li>
                </ul>
              </div>
            </div>
            <div v-else class="memo-placeholder">
              <p>Nhấn "Generate" để tạo deal memo dựa trên dữ liệu đã nhập</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faSearchDollar, faPlus, faCalculator, faChartLine, faLayerGroup,
  faStar, faChartBar, faFileAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faSearchDollar, faPlus, faCalculator, faChartLine, faLayerGroup,
  faStar, faChartBar, faFileAlt
);

export default {
  name: 'PrivateEquityDealScoutPage',
  components: { FontAwesomeIcon },
  data() {
    return {
      totalDeals: 1247,
      avgIRR: 23.4,
      medianEV: 125,
      
      showCalculator: false,
      showStructuring: false,
      showMemo: false,
      
      dealForm: {
        companyName: '',
        sector: 'saas',
        stage: 'series-a',
        ebitda: 0,
        revenue: 0
      },
      
      lboData: {
        debtMultiple: 5.0,
        exitMultiple: 12.0,
        interestRate: 6.5,
        holdingPeriod: 5
      },
      
      lboResults: {
        irr: 0,
        cashOnCash: 0,
        paybackPeriod: 0
      },
      
      structureData: {
        preferredPercent: 60,
        liquidationPref: '1x'
      },
      
      exitScenarios: [],
      
      dealScore: null,
      keyQuestions: [],
      
      hotSectors: [
        { name: 'SaaS', deals: 156, percentage: 85 },
        { name: 'FinTech', deals: 89, percentage: 65 },
        { name: 'HealthTech', deals: 67, percentage: 45 },
        { name: 'E-commerce', deals: 45, percentage: 30 }
      ],
      
      dealMemo: {
        generated: false,
        highlights: [],
        risks: [],
        nextSteps: []
      }
    };
  },
  
  methods: {
    analyzeDeal() {
      if (!this.dealForm.companyName || !this.dealForm.ebitda) {
        alert('Vui lòng nhập đầy đủ thông tin cơ bản');
        return;
      }
      
      this.showCalculator = true;
      this.showStructuring = true;
      this.showMemo = true;
      
      this.calculateLBO();
      this.generateDealScore();
      this.calculateWaterfall();
    },
    
    calculateLBO() {
      const equity = this.dealForm.ebitda * this.lboData.exitMultiple;
      const debt = this.dealForm.ebitda * this.lboData.debtMultiple;
      const purchasePrice = equity + debt;
      
      // Simplified IRR calculation
      const exitValue = this.dealForm.ebitda * 1.5 * this.lboData.exitMultiple; // Assume 50% EBITDA growth
      const remainingDebt = debt * 0.3; // Assume 70% debt paydown
      const equityValue = exitValue - remainingDebt;
      
      this.lboResults.cashOnCash = (equityValue / equity).toFixed(1);
      this.lboResults.irr = (Math.pow(equityValue / equity, 1/this.lboData.holdingPeriod) - 1 * 100).toFixed(1);
      this.lboResults.paybackPeriod = (this.lboData.holdingPeriod * 0.7).toFixed(1);
    },
    
    generateDealScore() {
      // Simulate AI scoring
      const baseScore = 60 + Math.random() * 30;
      
      this.dealScore = {
        overall: Math.round(baseScore),
        metrics: [
          { name: 'TAM & Market', score: Math.round(15 + Math.random() * 10) },
          { name: 'Competitive Moat', score: Math.round(12 + Math.random() * 13) },
          { name: 'Scalability', score: Math.round(14 + Math.random() * 11) },
          { name: 'Team & Execution', score: Math.round(16 + Math.random() * 9) }
        ]
      };
      
      // Generate key questions based on lowest scoring area
      const lowestMetric = this.dealScore.metrics.reduce((prev, current) => 
        prev.score < current.score ? prev : current
      );
      
      const questionMap = {
        'TAM & Market': [
          'Thị trường TAM thực tế có lớn như dự báo?',
          'Tốc độ tăng trưởng thị trường có bền vững?',
          'Rào cản gia nhập từ đối thủ lớn như thế nào?'
        ],
        'Competitive Moat': [
          'Lợi thế cạnh tranh có thể bị copy dễ dàng?',
          'Network effect có thực sự mạnh?',
          'Chi phí chuyển đổi của khách hàng ra sao?'
        ],
        'Scalability': [
          'Unit economics có cải thiện khi scale?',
          'Operational leverage có rõ ràng?',
          'Cần bao nhiều vốn để đạt breakeven?'
        ],
        'Team & Execution': [
          'Founder có track record tương tự?',
          'Key personnel retention như thế nào?',
          'Execution capability trong giai đoạn scale?'
        ]
      };
      
      this.keyQuestions = questionMap[lowestMetric.name] || [];
    },
    
    calculateWaterfall() {
      const scenarios = [
        { name: 'Base Case', multiple: 1.0 },
        { name: 'Upside', multiple: 2.0 },
        { name: 'Moonshot', multiple: 4.0 }
      ];
      
      this.exitScenarios = scenarios.map(scenario => {
        const exitValue = this.dealForm.revenue * 5 * scenario.multiple; // 5x revenue multiple
        const preferredAmount = exitValue * this.structureData.preferredPercent / 100;
        const commonAmount = exitValue - preferredAmount;
        
        return {
          name: scenario.name,
          exitValue: exitValue.toFixed(0),
          investorReturn: preferredAmount.toFixed(0),
          founderReturn: commonAmount.toFixed(0)
        };
      });
    },
    
    generateMemo() {
      this.dealMemo = {
        generated: true,
        highlights: [
          `Công ty ${this.dealForm.companyName} trong lĩnh vực ${this.dealForm.sector} đang tăng trưởng mạnh`,
          `EBITDA margin ${((this.dealForm.ebitda/this.dealForm.revenue)*100).toFixed(1)}% cho thấy hiệu quả vận hành tốt`,
          `Thị trường ${this.dealForm.sector} dự kiến CAGR 25-30% trong 5 năm tới`,
          'Management team có kinh nghiệm và vision rõ ràng',
          'Competitive moat mạnh thông qua technology và network effect'
        ],
        risks: [
          'Thị trường cạnh tranh ngày càng khốc liệt',
          'Customer concentration risk nếu phụ thuộc vào vài khách hàng lớn',
          'Regulatory risk trong lĩnh vực fintech/healthcare',
          'Key person dependency trên founder team',
          'Market downturn có thể ảnh hưởng đến growth trajectory'
        ],
        nextSteps: [
          'Deep dive vào financial model và unit economics',
          'Reference check với customers và partners',
          'Technical due diligence về product và platform',
          'Legal DD về IP, contracts và compliance',
          'Management presentation và Q&A session'
        ]
      };
    },
    
    getIRRClass(irr) {
      if (irr >= 25) return 'excellent';
      if (irr >= 20) return 'good';
      if (irr >= 15) return 'fair';
      return 'poor';
    },
    
    getScoreGrade(score) {
      if (score >= 80) return 'grade-a';
      if (score >= 70) return 'grade-b';
      if (score >= 60) return 'grade-c';
      return 'grade-d';
    },
    
    getScoreLabel(score) {
      if (score >= 80) return 'Excellent';
      if (score >= 70) return 'Good';
      if (score >= 60) return 'Fair';
      return 'Poor';
    }
  }
};
</script>

<style scoped>
.pe-deal-scout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Inter', 'Roboto', sans-serif;
  padding: 2rem;
}

.header-section {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.scout-icon {
  color: #4facfe;
}

.subtitle {
  font-size: 1.1rem;
  color: #8892b0;
  margin: 0;
}

.quick-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #4facfe;
}

.stat-label {
  font-size: 0.9rem;
  color: #8892b0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #8892b0;
  font-size: 0.9rem;
  font-weight: 500;
}

.input-group input, .input-group select {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.analyze-btn, .generate-btn {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.analyze-btn:hover, .generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
}

.calculator-inputs {
  margin-bottom: 2rem;
}

.input-group input[type="range"] {
  width: calc(100% - 60px);
  margin-right: 10px;
}

.range-value {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 50px;
  display: inline-block;
  text-align: center;
}

.lbo-results {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.result-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.result-card h4 {
  margin: 0 0 0.5rem 0;
  color: #8892b0;
  font-size: 0.9rem;
  font-weight: 500;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4facfe;
}

.result-value.excellent { color: #00ff88; }
.result-value.good { color: #4facfe; }
.result-value.fair { color: #ffa500; }
.result-value.poor { color: #ff4757; }

.overall-score {
  text-align: center;
  margin-bottom: 1.5rem;
}

.score-circle {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  margin-bottom: 0.5rem;
  position: relative;
}

.score-number {
  font-size: 2rem;
  font-weight: 700;
  color: #000;
}

.score-label {
  font-size: 1rem;
  color: #333;
}

.score-grade {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.grade-a { background: #00ff88; color: #000; }
.grade-b { background: #4facfe; color: #000; }
.grade-c { background: #ffa500; color: #000; }
.grade-d { background: #ff4757; color: #fff; }

.score-breakdown {
  margin-bottom: 1.5rem;
}

.metric-item {
  margin-bottom: 1rem;
}

.metric-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.metric-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  transition: width 0.5s ease;
}

.key-questions h4 {
  margin-bottom: 0.75rem;
  color: #ffffff;
}

.question-list {
  list-style: none;
  padding: 0;
}

.question-list li {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border-left: 3px solid #4facfe;
  font-size: 0.9rem;
}

.waterfall-chart {
  margin-top: 1.5rem;
}

.exit-scenarios {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.scenario-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.scenario-card h5 {
  margin: 0 0 0.5rem 0;
  color: #8892b0;
}

.scenario-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4facfe;
  margin-bottom: 0.75rem;
}

.distribution {
  font-size: 0.9rem;
}

.dist-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.amount {
  font-weight: 600;
  color: #ffffff;
}

.trend-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.trend-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.trend-label {
  color: #8892b0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.trend-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.trend-change {
  font-size: 0.8rem;
  font-weight: 600;
}

.trend-change.positive { color: #00ff88; }
.trend-change.negative { color: #ff4757; }

.hot-sectors h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.sector-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.sector-bar {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.sector-fill {
  height: 100%;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.memo-section {
  margin-bottom: 1.5rem;
}

.memo-section h4 {
  color: #ffffff;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.memo-section ul {
  list-style: none;
  padding: 0;
}

.memo-section li {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.memo-placeholder {
  text-align: center;
  color: #8892b0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
}

@media (max-width: 1200px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .pe-deal-scout {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .input-row {
    grid-template-columns: 1fr;
  }
  
  .lbo-results {
    grid-template-columns: 1fr;
  }
  
  .exit-scenarios {
    grid-template-columns: 1fr;
  }
}
</style> 