<template>
  <div class="chat-section">
    <div class="chat-header">
      <h2 class="chat-title">Financial Analysis</h2>

      <div class="powered-by">
        Powered by <a href="#" class="provider-link">FinBud<span class="arrow-icon">↗</span></a>
      </div>
      
      <div class="action-buttons">
        <button class="analysis-button ticker-button" @click="startFinancialNewsAnalysis('AAPL')">
          <span class="ticker-icon">💹</span> Analyze AAPL
        </button>
        
        <button class="analysis-button market-button" @click="startFinancialNewsAnalysis('', 'general')">
          <span class="market-icon">📊</span> Market Overview
        </button>

        <button
          :class="['model-btn', selectedModel === 'chatgpt' ? 'active' : '']"
          @click="selectedModel = 'chatgpt'"
        >
          ChatGPT
        </button>
        <button
          :class="['model-btn', selectedModel === 'deepseek' ? 'active' : '']"
          @click="selectedModel = 'deepseek'"
        >
          DeepSeek
        </button>
        
        <div class="social-share">
          <div class="share-buttons">
            <button class="share-button copy" title="Copy link" @click="copyResultLink">
              <span class="icon-copy"></span>
            </button>
            <button class="share-button twitter" title="Share on Twitter" @click="shareOnTwitter">  
              <span class="icon-twitter"></span>
            </button>
            <button class="share-button facebook" title="Share on Facebook" @click="shareOnFacebook">
              <span class="icon-facebook"></span>
            </button>
            <button class="share-button linkedin" title="Share on LinkedIn" @click="shareOnLinkedin">
              <span class="icon-linkedin"></span>
            </button>
          </div>
          <div class="model-toggle">
</div>

        </div>
      </div>
    </div>
    
    <div class="chat-content">
      <!-- Workflow Steps -->
      <div class="workflow-steps">
        <div class="workflow-step">
          <div class="step-icon">📄</div>
          <div class="step-content">
            <div class="step-header" @click="toggleStep('loading')">
              <span class="step-indicator" :class="{ 'active': processingSteps.loading, 'completed': completedSteps.loading }">●</span>
              <h3 class="step-title">Loading Financial Data</h3>
              <button class="toggle-button">
                <span class="toggle-icon">{{ stepsVisible.loading ? '▼' : '►' }}</span>
              </button>
            </div>
            
            <div v-if="stepsVisible.loading" class="step-body">
              <div class="step-message">
                <span v-if="processingSteps.loading" class="processing-icon">⚙️</span>
                <span v-else-if="completedSteps.loading" class="completed-icon">✓</span>
                <span class="message-text">{{ processingMessages.loading || 'Click a button above to start analysis' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Splitting Document Step -->
        <div v-if="stepsVisible.splitting" class="workflow-step">
          <div class="step-icon">✂️</div>
          <div class="step-content">
            <div class="step-header" @click="toggleStep('splitting')">
              <span class="step-indicator" :class="{ 'active': processingSteps.splitting, 'completed': completedSteps.splitting }">●</span>
              <h3 class="step-title">Processing Data</h3>
              <button class="toggle-button">
                <span class="toggle-icon">{{ stepsVisible.splitting ? '▼' : '►' }}</span>
              </button>
            </div>
            
            <div v-if="stepsVisible.splitting" class="step-body">
              <div class="step-message">
                <span v-if="processingSteps.splitting" class="processing-icon">⚙️</span>
                <span v-else-if="completedSteps.splitting" class="completed-icon">✓</span>
                <span class="message-text">{{ processingMessages.splitting }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Data Extraction Step -->
        <div v-if="stepsVisible.extraction" class="workflow-step">
          <div class="step-icon">🔍</div>
          <div class="step-content">
            <div class="step-header" @click="toggleStep('extraction')">
              <span class="step-indicator" :class="{ 'active': processingSteps.extraction, 'completed': completedSteps.extraction }">●</span>
              <h3 class="step-title">Extracting Financial Data</h3>
              <button class="toggle-button">
                <span class="toggle-icon">{{ stepsVisible.extraction ? '▼' : '►' }}</span>
              </button>
            </div>
            
            <div v-if="stepsVisible.extraction" class="step-body">
              <div class="step-message">
                <span v-if="processingSteps.extraction" class="processing-icon">⚙️</span>
                <span v-else-if="completedSteps.extraction" class="completed-icon">✓</span>
                <span class="message-text">{{ processingMessages.extraction }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Summary Generation Step -->
        <div v-if="stepsVisible.summary" class="workflow-step">
          <div class="step-icon">📝</div>
          <div class="step-content">
            <div class="step-header" @click="toggleStep('summary')">
              <span class="step-indicator" :class="{ 'active': processingSteps.summary, 'completed': completedSteps.summary }">●</span>
              <h3 class="step-title">Generating Summary</h3>
              <button class="toggle-button">
                <span class="toggle-icon">{{ stepsVisible.summary ? '▼' : '►' }}</span>
              </button>
            </div>
            
            <div v-if="stepsVisible.summary" class="step-body">
              <div class="step-message" v-if="processingSteps.summary">
                <span class="processing-icon">⚙️</span>
                <span class="message-text">{{ processingMessages.summary }}</span>
              </div>
              
              <div v-if="completedSteps.summary" class="summary-content">
              <div id="pdf-report-content">
                <div class="summary-section">
                  <h4 class="summary-heading">Executive Summary</h4>
                  <div class="summary-text" v-html="analysisResults.executiveSummary"></div>
                </div>
                
                <div class="summary-section">
                  <h4 class="summary-heading">Financial Analysis Summary</h4>
                  <div class="summary-text" v-html="analysisResults.summary"></div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recommendations Step -->
        <div v-if="stepsVisible.recommendations" class="workflow-step">
          <div class="step-icon">🔗</div>
          <div class="step-content">
            <div class="step-header" @click="toggleStep('recommendations')">
              <span class="step-indicator" :class="{ 'active': processingSteps.recommendations, 'completed': completedSteps.recommendations }">●</span>
              <h3 class="step-title">Finding Related Resources</h3>
              <button class="toggle-button">
                <span class="toggle-icon">{{ stepsVisible.recommendations ? '▼' : '►' }}</span>
              </button>
            </div>
            
            <div v-if="stepsVisible.recommendations" class="step-body">
              <div class="step-message" v-if="processingSteps.recommendations">
                <span class="processing-icon">⚙️</span>
                <span class="message-text">{{ processingMessages.recommendations }}</span>
              </div>
              
              <div v-if="completedSteps.recommendations" class="recommendations-content">
                <h4 class="summary-heading">Recommended Resources</h4>
                <div class="summary-text" v-html="analysisResults.recommendations"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="hasError" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
      
      <!-- Export Results Section -->
      <div class="export-section" v-if="completedSteps.recommendations">
        <button class="export-pdf-button" @click="exportAnalysisAsPDF">
          <span class="download-icon">↓</span> Export Analysis as PDF
        </button>
      </div>
      <div class="exported-reports">
        <h2>Exported Reports</h2>
        <table class="min-w-full border mt-2">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 text-left">Date & Time</th>
              <th class="px-4 py-2 text-left">File Name</th>
              <th class="px-4 py-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in exportedReports" :key="index" class="border-t">
              <td class="px-4 py-2">{{ file.timestamp }}</td>
              <td class="px-4 py-2">{{ file.filename }}</td>
              <td class="px-4 py-2">
                <a :href="file.url" download :title="file.filename" class="text-blue-500 underline">Download</a>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
    </div>
  </div>
</template>

<script>
import { processFinancialNews } from '@/components/FinAgentPage/agent.js'
import SocialShare from './SocialShare.vue';
import html2pdf from 'html2pdf.js';

export default {
  name: 'ChatSection',
  components: {
    SocialShare
  },
  data() {
    return {
      selectedModel: 'chatgpt',
      processingSteps: {
        loading: false,
        splitting: false,
        extraction: false,
        summary: false,
        recommendations: false
      },
      completedSteps: {
        loading: false,
        splitting: false,
        extraction: false,
        summary: false,
        recommendations: false
      },
      stepsVisible: {
        loading: true,
        splitting: false,
        extraction: false,
        summary: false,
        recommendations: false
      },
      processingMessages: {
        loading: '',
        splitting: '',
        extraction: '',
        summary: '',
        recommendations: ''
      },
      analysisResults: {
        summary: '',
        executiveSummary: '',
        extractedData: [],
        recommendations: ''
      },
      selectedFile: null,
      hasError: false,
      errorMessage: '',
      exportedReports: []
    };
  },
  mounted() {
    // ✅ Fetch exported reports when component is mounted
    fetch('https://finbud.pro/api/reports')
      .then(res => res.json())
      .then(data => {
        this.exportedReports = data;
      })
      .catch(err => {
        console.error('Failed to fetch reports:', err);
      });
  },
  methods: {
    // Delay method for workflow
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    processPDF() {
    console.log("TODO: implement PDF logic");
  },

    // Added the missing resetState method
    resetState() {
      for (const key in this.processingSteps) {
        this.processingSteps[key] = false;
        this.completedSteps[key] = false;
      }

      for (const key in this.stepsVisible) {
        this.stepsVisible[key] = false;
      }
      this.stepsVisible.loading = true;

      for (const key in this.processingMessages) {
        this.processingMessages[key] = '';
      }
      
      // Reset results
      this.analysisResults = {
        summary: '',
        executiveSummary: '',
        extractedData: [],
        recommendations: ''
      };
      
      this.hasError = false;
      this.errorMessage = '';
    },
    
    toggleStep(step) {
      this.stepsVisible[step] = !this.stepsVisible[step];
    },
    
    async startFinancialNewsAnalysis(ticker = 'AAPL', category = 'finance') {
      this.resetState();
      this.selectedFile = { name: ticker ? `${ticker} News Analysis` : `${category.charAt(0).toUpperCase() + category.slice(1)} Market News` };
      
      try {
      const generator = processFinancialNews(ticker, category, this.selectedModel);

      for await (const result of generator) {
        switch (result.step) {
          case 'fetchingNews':
            this.stepsVisible.loading = true;
            this.processingSteps.loading = true;
            this.processingMessages.loading = result.message;
            break;

          case 'splittingText':
            this.stepsVisible.splitting = true;
            this.processingSteps.loading = false;
            this.completedSteps.loading = true;
            this.processingSteps.splitting = true;
            this.processingMessages.splitting = result.message;
            break;

          case 'extractingInsights':
            this.processingSteps.splitting = false;
            this.completedSteps.splitting = true;
            this.stepsVisible.extraction = true;
            this.processingSteps.extraction = true;
            this.processingMessages.extraction = result.message;
            break;

          case 'generatingSummary':
            this.processingSteps.extraction = false;
            this.completedSteps.extraction = true;
            this.stepsVisible.summary = true;
            this.processingSteps.summary = true;
            this.processingMessages.summary = result.message;
            break;

          case 'findingSimilar':
            this.processingSteps.summary = false;
            this.completedSteps.summary = true;
            this.stepsVisible.recommendations = true;
            this.processingSteps.recommendations = true;
            this.processingMessages.recommendations = result.message;
            break;

          case 'executiveSummary':
            this.processingSteps.recommendations = false;
            this.completedSteps.recommendations = true;
            break;

          case 'done':
            this.analysisResults.summary = result.summary;
            this.analysisResults.executiveSummary = result.executiveSummary;
            this.analysisResults.recommendations = result.recommendations;
            break;

          case 'error':
            this.hasError = true;
            this.errorMessage = "Failed to process: " + result.error;
            return;
        }

        // Allow the DOM to update between steps
        await this.$nextTick();
      }
    } catch (error) {
      this.hasError = true;
      this.errorMessage = "Failed to process financial news: " + error.message;
      this.processingSteps.loading = false;
    }
    },
      
      processAnalysisResults(results) {
        if (!results) {
          this.hasError = true;
          this.errorMessage = "No results received from analysis";
          this.processingSteps.loading = false;
          return;
        }
        
        this.processingMessages.loading = `Loaded: ${this.selectedFile.name}`;
        this.completedSteps.loading = true;
        this.processingSteps.loading = false;
        
        this.processingSteps.splitting = true;
        this.processingMessages.splitting = "Processing financial data...";
        setTimeout(() => {
          this.completedSteps.splitting = true;
          this.processingSteps.splitting = false;
          
          this.processingSteps.extraction = true;
          this.processingMessages.extraction = "Extracting key financial indicators...";
          setTimeout(() => {
            this.completedSteps.extraction = true;
            this.processingSteps.extraction = false;
            
            this.processingSteps.summary = true;
            this.processingMessages.summary = "Generating comprehensive financial summary...";
            setTimeout(() => {
              this.analysisResults.summary = results.summary;
              this.analysisResults.executiveSummary = results.executiveSummary;
              this.completedSteps.summary = true;
              this.processingSteps.summary = false;
              
              this.processingSteps.recommendations = true;
              this.processingMessages.recommendations = "Finding related financial resources...";
              setTimeout(() => {
                this.analysisResults.recommendations = results.recommendations;
                this.completedSteps.recommendations = true;
                this.processingSteps.recommendations = false;
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      },
      
      copyResultLink() {
        const analysisText = `Financial Analysis Summary:\n\n${this.getTextContent(this.analysisResults.executiveSummary)}\n\n${this.getTextContent(this.analysisResults.summary)}\n\nRecommendations:\n${this.getTextContent(this.analysisResults.recommendations)}`;
        
        navigator.clipboard.writeText(analysisText)
          .then(() => {
            alert('Analysis copied to clipboard!');
          })
          .catch(err => {
            console.error('Failed to copy analysis: ', err);
            alert('Failed to copy analysis to clipboard');
          });
      },
      
      getTextContent(html) {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
      },
      
      shareOnTwitter() {
        const tweetText = `Check out this financial analysis: ${this.getTextContent(this.analysisResults.executiveSummary).substring(0, 180)}...`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
      },
      
      shareOnFacebook() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
      },
      
      shareOnLinkedin() {
        const title = this.selectedFile?.name || 'Financial Analysis';
        const summary = this.getTextContent(this.analysisResults.executiveSummary).substring(0, 250);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`, '_blank');
      },
      
      exportAnalysisAsPDF() {
        const element = document.getElementById('pdf-report-content');

        const plainText = this.analysisResults.summary?.replace(/<[^>]+>/g, '') || '';
        const keywords = plainText.split(' ').slice(0, 3).join('_');
        const timestamp = new Date().toLocaleString();
        const filename = `${keywords || 'Financial_Report'}_${Date.now()}.pdf`;  // ✅ define here

        const opt = {
          margin: 0.5,
          filename, // ✅ now filename is defined
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
          fetch('/api/save-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename,                     // ✅ filename used again here
              html: element.innerHTML,
              timestamp
            })
              })
              .then(res => res.json())
              .then(data => {
                this.exportedReports.unshift({
                  filename,
                  timestamp,
                  url: data.url
                });
              });
            });
          }
        }
      }

</script>

<style scoped>
.chat-section {
  background-color: #000000;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.chat-header {
  margin-bottom: 30px;
}

.chat-title {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 8px 0;
}


.powered-by {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 20px;
}

.provider-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.provider-link:hover {
  color: #0095ff;
}

.arrow-icon {
  font-size: 12px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.analysis-button {
  display: flex;
  align-items: center;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticker-button {
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
}

.ticker-button:hover {
  background-color: #3a56d4;
  transform: translateY(-2px);
}

.market-button {
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0 4px 12px rgba(58, 12, 163, 0.2);
}

.market-button:hover {
  background-color: #3a56d4;
  transform: translateY(-2px);
}

.ticker-icon, .market-icon {
  margin-right: 8px;
}

.export-pdf-button {
  display: flex;
  align-items: center;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.export-pdf-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.download-icon {
  margin-right: 8px;
}

.share-buttons {
  display: flex;
  gap: 10px;
}

.share-button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.share-button:hover {
  transform: scale(1.1);
}

.copy {
  background-color: #f2f2f2;
}

.twitter {
  background-color: #1DA1F2;
  color: #f8f9fa;
}

.facebook {
  background-color: #4267B2;
  color: #f8f9fa;
}

.linkedin {
  background-color: #0077B5;
  color: #f8f9fa;
}

.chat-content {
  display: flex;
  flex-direction: column;
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.workflow-step {
  display: flex;
  gap: 16px;
}

.step-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-content {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
}

.step-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.step-header:hover {
  background-color: #f0f2f5;
}

.step-indicator {
  font-size: 12px;
  color: #9ca3af;
  margin-right: 10px;
}

.step-indicator.active {
  color: #f59e0b;
  animation: pulse 1.5s infinite;
}

.step-indicator.completed {
  color: #10b981;
}

.step-title {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}

.toggle-icon {
  font-size: 12px;
}

.step-body {
  background-color: #f9fafb;
  border-radius: 0 0 12px 12px;
  padding: 16px;
  margin-top: 2px;
}

.step-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.processing-icon {
  animation: spin 2s linear infinite;
}

.completed-icon {
  color: #10b981;
}

.message-text {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.5;
}

.summary-content, .recommendations-content {
  width: 100%;
}

.summary-section {
  margin-bottom: 24px;
}

.summary-heading {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.summary-text {
  color: #4b5563;
  line-height: 1.6;
  font-size: 15px;
}

.summary-text h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 24px 0 16px 0;
}

.summary-text h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 20px 0 12px 0;
}

.summary-text p {
  margin: 0 0 16px 0;
}

.summary-text p:last-child {
  margin-bottom: 0;
}

.summary-text ul, .summary-text ol {
  margin: 16px 0;
  padding-left: 24px;
}

.summary-text li {
  margin-bottom: 8px;
}

.summary-text a {
  color: #4361ee;
  text-decoration: none;
  transition: color 0.2s;
}

.summary-text a:hover {
  color: #3a56d4;
  text-decoration: underline;
}

.export-section {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(185, 28, 28, 0.1);
}

.error-icon {
  font-size: 20px;
}

.social-share {
  display: flex;
  align-items: center;
}

.share-buttons {
  display: flex;
}

.share-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.share-button:hover {
  transform: scale(1.05);
}

.copy {
  background-color: #cbd5e0;
}

.twitter {
  background-color: #38b2f8;
}

.facebook {
  background-color: #4267B2;
}

.linkedin {
  background-color: #0077B5;
}

.icon-copy, .icon-twitter, .icon-facebook, .icon-linkedin {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: white;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.icon-copy {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
}

.icon-twitter {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-facebook {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-linkedin {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'%3E%3C/path%3E%3Crect x='2' y='9' width='4' height='12'%3E%3C/rect%3E%3Ccircle cx='4' cy='4' r='2'%3E%3C/circle%3E%3C/svg%3E");
}

.icon-copy {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
}

.icon-twitter {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-facebook {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-linkedin {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'%3E%3C/path%3E%3Crect x='2' y='9' width='4' height='12'%3E%3C/rect%3E%3Ccircle cx='4' cy='4' r='2'%3E%3C/circle%3E%3C/svg%3E");
}

.chat-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.chat-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-toggle {
  display: flex;
  gap: 4 px;
  margin-top: 4px;
}

.model-btn {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 20px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #1f2937;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.model-btn:hover {
  background-color: #f3f4f6;
}

.model-btn.active {
  background-color: #1e40af;
  color: white;
  border-color: #1e40af;
}

.exported-reports {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  border-radius: 12px;
  margin-top: 30px;
}



@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .chat-section {
    padding: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .share-buttons {
    margin-top: 12px;
    justify-content: center;
  }
  
  .chat-title {
    font-size: 24px;
  }
  
  .workflow-step {
    gap: 10px;
  }
  
  .step-title {
    font-size: 15px;
  }
  
  .summary-heading {
    font-size: 16px;
  }

  .chat-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .model-toggle {
    align-self: flex-end;
  }
  
}
</style>