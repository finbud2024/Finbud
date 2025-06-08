<template>
  <div class="autotrade-container">
    <!-- ▸ Tiêu đề -->
    <div class="page-header">
      <h1>AutoTrade AI</h1>
      <p>Giao dịch tự động với quyết định được hỗ trợ bởi AI</p>
    </div>

    <div class="autotrade-content">
      <!-- 1 ▸ Chọn chiến lược -->
      <div class="strategy-section">
        <div class="section-number">1</div>
        <h2>Bắt đầu chiến lược mới</h2>

        <div class="strategy-options">
          <!-- Bảo thủ -->
          <div class="strategy-card conservative" @click="toggleStrategy('conservative')" tabindex="0"
            :class="{ active: activeStrategy === 'conservative' }">
            <h3>Bảo thủ</h3>
            <p>Rủi ro thấp, tăng trưởng ổn định</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">15%</span>
                <span class="metric-label">Thời hạn tối đa</span>
              </div>
              <div class="metric">
                <span class="metric-label">30 ngày</span>
              </div>
            </div>
          </div>

          <!-- Trung bình -->
          <div class="strategy-card moderate" @click="toggleStrategy('moderate')" tabindex="0"
            :class="{ active: activeStrategy === 'moderate' }">
            <h3>Trung bình</h3>
            <p>Cân bằng giữa rủi ro và lợi nhuận</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">20%</span>
                <span class="metric-label">Thời hạn tối đa</span>
              </div>
              <div class="metric">
                <span class="metric-label">10 ngày</span>
              </div>
            </div>
          </div>

          <!-- Mạo hiểm -->
          <div class="strategy-card aggressive" @click="toggleStrategy('aggressive')" tabindex="0"
            :class="{ active: activeStrategy === 'aggressive' }">
            <h3>Mạo hiểm</h3>
            <p>Rủi ro cao, tiềm năng lợi nhuận lớn</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">25%</span>
                <span class="metric-label">Thời hạn tối đa</span>
              </div>
              <div class="metric">
                <span class="metric-label">5 ngày</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Capital Allocation -->
        <div class="capital-allocation">
          <h3>Phân bổ vốn</h3>
          <input v-model.number="capital" type="number" placeholder="Nhập số tiền ($)" class="amount-input" min="0"
            step="100" />
        </div>

        <!-- Start Strategy Button -->
        <button @click="startStrategy" :disabled="!activeStrategy || !capital" class="start-strategy-btn"
          :class="{ disabled: !activeStrategy || !capital }">
          {{ !activeStrategy ? 'Chọn chiến lược' : !capital ? 'Nhập số vốn' : 'Bắt đầu chiến lược' }}
        </button>
      </div>

      <!-- 4 ▸ Chatbot FAQ -->
      <div class="chatbot-section">
        <div class="section-number">4</div>
        <h2>Chatbot FAQ</h2>

        <!-- Conversation window -->
        <div class="chat-window" ref="chatWindow">
          <div v-if="chatMessages.length === 0" class="chat-welcome">
            <p>Chào mừng đến với AutoTrade AI! Hãy đặt câu hỏi về giao dịch và chiến lược đầu tư.</p>
          </div>
          <div v-for="(msg, i) in chatMessages" :key="i" :class="['chat-bubble', msg.role]">
            <div class="chat-content">
              <strong v-if="msg.role === 'assistant'">🤖 AutoTrade AI:</strong>
              <strong v-else>👤 Bạn:</strong>
              <span class="message-text">{{ msg.content }}</span>
            </div>
          </div>
          <div v-if="loading" class="chat-bubble assistant loading">
            <div class="chat-content">
              <strong>🤖 AutoTrade AI:</strong>
              <span class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="chat-controls">
          <select v-model="provider" class="provider-select">
            <option value="openai">OpenAI GPT</option>
            <option value="gemini">Google Gemini</option>
            <option value="deepseek">DeepSeek</option>
          </select>

          <div class="input-group">
            <input v-model="userInput" @keyup.enter="sendChat" :disabled="loading"
              placeholder="Đặt câu hỏi về giao dịch..." class="chat-input" maxlength="500" />
            <button @click="sendChat" :disabled="loading || !userInput.trim()" class="send-button">
              {{ loading ? '⏳' : '📤' }}
            </button>
          </div>
        </div>

        <!-- Quick Questions -->
        <div class="quick-questions">
          <p>Câu hỏi nhanh:</p>
          <div class="question-buttons">
            <button v-for="question in quickQuestions" :key="question" @click="askQuickQuestion(question)"
              :disabled="loading" class="quick-question-btn">
              {{ question }}
            </button>
          </div>
        </div>
      </div>

      <!-- 2 ▸ Khoản đầu tư -->
      <div class="investments-section">
        <div class="section-number">2</div>
        <h2>Danh mục đầu tư tự động</h2>

        <div class="investment-cards">
          <div class="investment-card" v-for="card in exampleCards" :key="card.ticker">
            <div class="stock-header">
              <div class="stock-name">{{ card.ticker }}</div>
              <div class="status" :class="card.status.toLowerCase()">
                {{ card.status === 'ACTIVE' ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG' }}
              </div>
            </div>
            <div class="stock-details">
              <div class="strategy-tag" :class="card.strategy">
                {{ getStrategyLabel(card.strategy) }}
              </div>
              <div class="transaction">Mua: ${{ card.bought.toFixed(4) }}</div>
              <div class="transaction" v-if="card.sold > 0">Bán: ${{ card.sold.toFixed(4) }}</div>
              <div class="transaction" v-if="card.status === 'ACTIVE'">
                <span class="profit-loss" :class="getProfitLossClass(card)">
                  {{ getProfitLoss(card) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 ▸ Tổng quan hiệu suất -->
      <div class="performance-section">
        <div class="section-number">3</div>
        <h2>Tổng quan hiệu suất</h2>

        <div class="performance-metrics">
          <div class="metric-card">
            <h3>Tổng lợi nhuận</h3>
            <div class="metric-value positive">+${{ totalProfit.toFixed(2) }}</div>
          </div>
          <div class="metric-card">
            <h3>Chiến lược đang hoạt động</h3>
            <div class="metric-value">{{ activeStrategiesCount }}</div>
          </div>
          <div class="metric-card">
            <h3>Giao dịch đã hoàn tất</h3>
            <div class="metric-value">{{ completedTransactions }}</div>
          </div>
        </div>

        <div class="chart-container">
          <h3>Lịch sử hiệu suất</h3>
          <div class="chart-placeholder">
            <p>Biểu đồ hiệu suất sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from "vue";
import { gptServices } from "@/services/gptServices";

// Strategy label helper
function getStrategyLabel(strategy) {
  const labels = {
    conservative: "Bảo thủ",
    moderate: "Trung bình",
    aggressive: "Mạo hiểm",
  };
  return labels[strategy] || strategy;
}

// Profit display helper
function getProfitLoss(card) {
  if (card.status !== "ACTIVE" || !card.currentPrice) return "";
  const profit = card.currentPrice - card.bought;
  const percentage = ((profit / card.bought) * 100).toFixed(2);
  return `${profit >= 0 ? "+" : ""}$${profit.toFixed(4)} (${percentage}%)`;
}

function getProfitLossClass(card) {
  if (card.status !== "ACTIVE" || !card.currentPrice) return "";
  const profit = card.currentPrice - card.bought;
  return profit >= 0 ? "positive" : "negative";
}

// Reactive data
const strategies = reactive({
  conservative: { title: "Bảo thủ", desc: "Rủi ro thấp, tăng trưởng ổn định" },
  moderate: { title: "Trung bình", desc: "Cân bằng giữa rủi ro và lợi nhuận" },
  aggressive: { title: "Mạo hiểm", desc: "Rủi ro cao, tiềm năng lợi nhuận lớn" },
});

const activeStrategy = ref(null);
const capital = ref(null);
const provider = ref("openai");

const exampleCards = reactive([
  { ticker: "NVDA", status: "CLOSED", strategy: "aggressive", bought: 8.4367, sold: 9.2403 },
  { ticker: "MSFT", status: "CLOSED", strategy: "conservative", bought: 2.5589, sold: 2.8148 },
  { ticker: "AAPL", status: "ACTIVE", strategy: "moderate", bought: 5.2310, sold: 0, currentPrice: 5.675 },
  { ticker: "TSLA", status: "ACTIVE", strategy: "aggressive", bought: 3.7892, sold: 0, currentPrice: 3.234 },
]);

const chatMessages = reactive([]);
const userInput = ref("");
const loading = ref(false);

const quickQuestions = [
  "Chiến lược nào phù hợp cho người mới?",
  "Làm thế nào để giảm rủi ro?",
  "Khi nào nên bán cổ phiếu?",
  "Phân tích NVDA hiện tại",
];

const totalProfit = computed(() =>
  exampleCards.reduce((sum, c) =>
    c.status === "CLOSED" ? sum + (c.sold - c.bought)
      : c.currentPrice ? sum + (c.currentPrice - c.bought)
        : sum, 0));

const activeStrategiesCount = computed(
  () => exampleCards.filter(c => c.status === "ACTIVE").length);

const completedTransactions = computed(
  () => exampleCards.filter(c => c.status === "CLOSED").length);

function scrollChatToBottom() {
  nextTick(() => {
    const el = document.querySelector(".chat-window");
    if (el) el.scrollTop = el.scrollHeight;
  });
}

function composeSystemContext() {
  const strat = activeStrategy.value ? strategies[activeStrategy.value].title : "Chưa chọn";
  const cap = capital.value ?? 0;
  const cards = exampleCards
    .map(c => `${c.ticker}: ${c.status}, strategy=${c.strategy}, bought=${c.bought}, sold=${c.sold}`)
    .join(" | ");

  return `Bạn là AutoTrade AI – trợ lý giao dịch tự động chuyên nghiệp.
Dữ liệu hiện tại:
• Chiến lược đang chọn: ${strat}
• Vốn phân bổ: $${cap}
• Danh mục: ${cards}
Hãy trả lời ngắn gọn, chuyên nghiệp và tập trung vào đầu tư, giao dịch. Sử dụng tiếng Việt.`;
}

async function sendChat() {
  if (!userInput.value.trim()) return;
  const q = userInput.value.trim();
  userInput.value = "";
  await askQuestion(q);
}

async function askQuestion(question) {
  loading.value = true;
  chatMessages.push({ role: "user", content: question });
  scrollChatToBottom();

  const history = [
    { role: "system", content: composeSystemContext() },
    ...chatMessages.slice(-10),
  ];

  try {
    const answer = await gptServices(history, provider.value);
    chatMessages.push({ role: "assistant", content: answer });
  } catch (err) {
    console.error(err);
    chatMessages.push({
      role: "assistant",
      content: "Đã xảy ra lỗi khi kết nối AI. Vui lòng thử lại sau.",
    });
  } finally {
    loading.value = false;
    scrollChatToBottom();
  }
}

function toggleStrategy(key) {
  const same = activeStrategy.value === key;
  activeStrategy.value = same ? null : key;
  if (!same) autoAskAboutStrategy(key);
}

function startStrategy() {
  if (!activeStrategy.value || !capital.value) return;
  const strategyName = strategies[activeStrategy.value].title;
  chatMessages.push({
    role: "assistant",
    content: `✅ Đã bắt đầu chiến lược ${strategyName} với vốn $${capital.value}. Hệ thống sẽ tự động thực hiện giao dịch theo chiến lược đã chọn.`,
  });
  scrollChatToBottom();
}

function autoAskAboutStrategy(key) {
  const q = `Hãy giải thích về chiến lược ${strategies[key].title} và những điều cần lưu ý?`;
  askQuestion(q);
}

function askQuickQuestion(q) {
  userInput.value = q;
  sendChat();
}

onMounted(() => {
  chatMessages.push({
    role: "assistant",
    content: "Chào mừng bạn đến với AutoTrade AI! Tôi có thể giúp bạn hiểu về các chiến lược giao dịch, phân tích thị trường và quản lý rủi ro. Hãy chọn một chiến lược hoặc đặt câu hỏi!",
  });
});
</script>


<style scoped>
:root {
  --text-primary: #333;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --primary-blue: #36a2eb;
  --success-green: #4caf50;
  --warning-orange: #ff9800;
  --danger-red: #ff6384;
}

.autotrade-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #36a2eb, #4bc0c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.8;
  color: #666;
}

.autotrade-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

.strategy-section,
.investments-section,
.performance-section,
.chatbot-section {
  background-color: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  border: 1px solid var(--border-color);
}

.section-number {
  position: absolute;
  top: -20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #36a2eb, #4bc0c0);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(54, 162, 235, 0.3);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.strategy-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.strategy-card {
  border-radius: 15px;
  padding: 1.5rem;
  color: #333;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background: white;
}

.strategy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.strategy-card.active {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.strategy-card.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 15px;
  border: 3px solid;
  pointer-events: none;
}

.strategy-card.conservative {
  border: 2px solid #4bc0c0;
}
.strategy-card.conservative.active::after {
  border-color: #4bc0c0;
}

.strategy-card.moderate {
  border: 2px solid #36a2eb;
}
.strategy-card.moderate.active::after {
  border-color: #36a2eb;
}

.strategy-card.aggressive {
  border: 2px solid #ff6384;
}
.strategy-card.aggressive.active::after {
  border-color: #ff6384;
}

.strategy-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.strategy-card p {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  opacity: 0.8;
}

.strategy-metrics {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
}

.metric-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.capital-allocation {
  margin-bottom: 2rem;
}

.capital-allocation h3 {
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
}

.amount-input {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.amount-input:focus {
  outline: none;
  border-color: #36a2eb;
  box-shadow: 0 0 0 3px rgba(54, 162, 235, 0.1);
}

.start-strategy-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #36a2eb, #4bc0c0);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-strategy-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(54, 162, 235, 0.3);
}

.start-strategy-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.investment-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.investment-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.investment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
  align-items: center;
}

.stock-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.status {
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  text-transform: uppercase;
}

.status.closed {
  background-color: #e0e0e0;
  color: #666;
}

.status.active {
  background-color: #4caf50;
  color: white;
}

.stock-details {
  padding: 1rem;
}

.strategy-tag {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 0.8rem;
  color: white;
  font-weight: 500;
}

.strategy-tag.conservative {
  background-color: #4bc0c0;
}

.strategy-tag.moderate {
  background-color: #36a2eb;
}

.strategy-tag.aggressive {
  background-color: #ff6384;
}

.transaction {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.profit-loss.positive {
  color: #4caf50;
  font-weight: bold;
}

.profit-loss.negative {
  color: #ff6384;
  font-weight: bold;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.metric-card h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.metric-card .metric-value {
  font-size: 2rem;
  font-weight: bold;
}

.metric-card .metric-value.positive {
  color: #4caf50;
}

.metric-card .metric-value.negative {
  color: #ff6384;
}

.chart-container {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  min-height: 200px;
  border: 1px solid #e0e0e0;
}

.chart-container h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem 1.5rem 0;
}

.chart-placeholder {
  padding: 2rem;
  text-align: center;
  opacity: 0.6;
}

/* Chatbot Styles */
.chat-window {
  height: 400px;
  overflow-y: auto;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fafafa;
}

.chat-welcome {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.chat-bubble {
  margin-bottom: 1rem;
  max-width: 85%;
}

.chat-bubble.user {
  margin-left: auto;
}

.chat-bubble.assistant {
  margin-right: auto;
}

.chat-content {
  background: white;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.message-text {
  display: block;
  margin-top: 0.3rem;
}

.typing-indicator {
  display: inline-block;
  vertical-align: middle;
}

.typing-indicator span {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin: 0 2px;
  background-color: #999;
  border-radius: 50%;
  animation: typingBlink 1.2s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBlink {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }

  100% {
    opacity: 0.3;
    transform: scale(1);
  }
}

.chat-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.input-group {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-input {
  flex-grow: 1;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(54, 162, 235, 0.1);
}

.send-button {
  padding: 0.8rem 1.2rem;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #258bd4;
}

.provider-select {
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.quick-questions {
  margin-top: 1.5rem;
}

.question-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quick-question-btn {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.quick-question-btn:hover {
  background-color: #e0e0e0;
}

.quick-question-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>