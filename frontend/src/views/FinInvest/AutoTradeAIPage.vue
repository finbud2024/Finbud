<template>
  <div class="autotrade-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>AutoTrade AI</h1>
        <p>Giao dịch tự động với quyết định được hỗ trợ bởi AI</p>
      </div>

      <div class="nav-tabs">
        <button class="tab active">ĐỘ CHÍNH XÁC</button>
        <button class="tab">NGƯỜI DÙNG</button>
        <button class="tab">HOẠT ĐỘNG</button>
      </div>
    </div>

    <div class="autotrade-content">
      <!-- Strategy Section -->
      <div class="section">
        <h2>Bắt đầu chiến lược mới</h2>
        <p class="section-desc">Chọn chiến lược phù hợp với mục tiêu đầu tư của bạn</p>

        <div class="strategy-options">
          <!-- Conservative -->
          <div class="strategy-card" @click="toggleStrategy('conservative')"
            :class="{ active: activeStrategy === 'conservative' }">
            <div class="strategy-icon">🔵</div>
            <h3>Bảo thủ</h3>
            <p>Rủi ro thấp, tăng trưởng ổn định</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">15%</span>
                <span class="metric-label">LỢI NHUẬN KỲ VỌNG</span>
              </div>
              <div class="metric">
                <span class="metric-value">30</span>
                <span class="metric-label">NGÀY</span>
              </div>
            </div>
          </div>

          <!-- Moderate -->
          <div class="strategy-card" @click="toggleStrategy('moderate')"
            :class="{ active: activeStrategy === 'moderate' }">
            <div class="strategy-icon">⚖️</div>
            <h3>Trung bình</h3>
            <p>Cân bằng giữa rủi ro và lợi nhuận</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">20%</span>
                <span class="metric-label">LỢI NHUẬN KỲ VỌNG</span>
              </div>
              <div class="metric">
                <span class="metric-value">10</span>
                <span class="metric-label">NGÀY</span>
              </div>
            </div>
          </div>

          <!-- Aggressive -->
          <div class="strategy-card" @click="toggleStrategy('aggressive')"
            :class="{ active: activeStrategy === 'aggressive' }">
            <div class="strategy-icon">🚀</div>
            <h3>Mạo hiểm</h3>
            <p>Rủi ro cao, tiềm năng lợi nhuận lớn</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">25%</span>
                <span class="metric-label">LỢI NHUẬN KỲ VỌNG</span>
              </div>
              <div class="metric">
                <span class="metric-value">5</span>
                <span class="metric-label">NGÀY</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Capital Allocation -->
        <div class="capital-allocation">
          <h3>Phân bổ vốn</h3>
          <div class="input-wrapper">
            <input v-model.number="capital" type="number" min="0" step="100" placeholder="Nhập số tiền ($)" />
          </div>
        </div>

        <button class="action-button" :disabled="!activeStrategy || !capital" @click="startStrategy">
          {{ !activeStrategy ? "Chọn chiến lược" : !capital ? "Nhập số vốn" : "Bắt đầu chiến lược" }}
        </button>
      </div>

      <!-- Package Section -->
      <div class="section">
        <h2>Chọn gói đầu tư</h2>
        <p v-if="loadingPackages" class="loading-text">Đang tải gói đầu tư…</p>
        <div v-else class="package-options">
          <div v-for="pkg in investPackages" :key="pkg.key" class="package-card"
            :class="{ active: activePackage === pkg.key }" @click="onClickPackage(pkg.key)">
            <h3>{{ pkg.name }}</h3>
            <p>{{ pkg.desc }}</p>
            <div class="stocks-list">
              <span v-for="s in pkg.stocks" :key="s" class="stock-tag">{{ s }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chatbot Section -->
      <div class="section">
        <h2>Chatbot FAQ</h2>
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
              <span class="typing-indicator"><span></span><span></span><span></span></span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="chat-controls">
          <div class="model-info">
            Đang dùng mô hình: <strong>Gemini</strong>
          </div>

          <div class="input-group">
            <input v-model="userInput" @keyup.enter="sendChat" :disabled="loading" maxlength="500"
              placeholder="Đặt câu hỏi về giao dịch..." class="chat-input" />
            <button class="send-button" :disabled="loading || !userInput.trim()" @click="sendChat">
              {{ loading ? "⏳" : "Gửi" }}
            </button>
          </div>
        </div>

        <!-- Quick Questions -->
        <div class="quick-questions">
          <p>Câu hỏi nhanh:</p>
          <div class="question-buttons">
            <button v-for="q in quickQuestions" :key="q" :disabled="loading" class="quick-question-btn"
              @click="askQuickQuestion(q)">
              {{ q }}
            </button>
          </div>
        </div>
      </div>

      <!-- Investments Section -->
      <div class="section">
        <h2>Danh mục đầu tư tự động</h2>
        <div class="investment-cards">
          <div class="investment-card" v-for="card in exampleCards" :key="card.ticker">
            <div class="card-header">
              <div class="ticker">{{ card.ticker }}</div>
              <div class="status" :class="card.status.toLowerCase()">
                {{ card.status === "ACTIVE" ? "ĐANG MỞ" : "ĐÃ ĐÓNG" }}
              </div>
            </div>
            <div class="card-content">
              <div class="strategy-tag" :class="card.strategy">
                {{ getStrategyLabel(card.strategy) }}
              </div>
              <div class="transaction">Mua: ${{ card.bought.toFixed(4) }}</div>
              <div v-if="card.sold" class="transaction">Bán: ${{ card.sold.toFixed(4) }}</div>
              <div v-if="card.status === 'ACTIVE'" class="transaction">
                <span class="profit-loss" :class="getProfitLossClass(card)">
                  {{ getProfitLoss(card) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Section -->
      <div class="section">
        <h2>Tổng quan hiệu suất</h2>
        <div class="performance-metrics">
          <div class="metric-card">
            <h3>Tổng lợi nhuận</h3>
            <div class="metric-value positive">
              +${{ totalProfit.toFixed(2) }}
            </div>
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
import { useInvestPackages } from "@/components/FinInvest/FinAutoTrade/useInvestPackages";

/* —————————————————— Packages —————————————————— */
const {
  investPackages,
  loadingPackages,
  activePackage,
  loadInvestPackages,
  selectPackage
} = useInvestPackages();

onMounted(loadInvestPackages);

function onClickPackage(pkgKey) {
  const pkg = selectPackage(pkgKey);
  if (pkg) {
    askQuestion(
      `Giải thích tại sao gói ${pkg.name} (${pkg.desc}) gồm các mã ${pkg.stocks.join(", ")} và khi nào nên đầu tư?`
    );
  }
}

/* —————————————————— Strategy helpers —————————————————— */
function getStrategyLabel(s) {
  return (
    { conservative: "Bảo thủ", moderate: "Trung bình", aggressive: "Mạo hiểm" }[
    s
    ] || s
  );
}
function getProfitLoss(card) {
  if (card.status !== "ACTIVE" || !card.currentPrice) return "";
  const diff = card.currentPrice - card.bought;
  const pct = ((diff / card.bought) * 100).toFixed(2);
  return `${diff >= 0 ? "+" : ""}$${diff.toFixed(4)} (${pct}%)`;
}
function getProfitLossClass(card) {
  if (card.status !== "ACTIVE" || !card.currentPrice) return "";
  return card.currentPrice - card.bought >= 0 ? "positive" : "negative";
}

/* —————————————————— Static demo data (unchanged) —————————————————— */
const strategies = reactive({
  conservative: { title: "Bảo thủ", desc: "Rủi ro thấp, tăng trưởng ổn định" },
  moderate: { title: "Trung bình", desc: "Cân bằng giữa rủi ro và lợi nhuận" },
  aggressive: { title: "Mạo hiểm", desc: "Rủi ro cao, tiềm năng lợi nhuận lớn" }
});
const exampleCards = reactive([
  { ticker: "NVDA", status: "CLOSED", strategy: "aggressive", bought: 8.4367, sold: 9.2403 },
  { ticker: "MSFT", status: "CLOSED", strategy: "conservative", bought: 2.5589, sold: 2.8148 },
  { ticker: "AAPL", status: "ACTIVE", strategy: "moderate", bought: 5.231, currentPrice: 5.675, sold: 0 },
  { ticker: "TSLA", status: "ACTIVE", strategy: "aggressive", bought: 3.7892, currentPrice: 3.234, sold: 0 }
]);

/* —————————————————— Refs & computed —————————————————— */
const activeStrategy = ref(null);
const capital = ref(null);
const chatMessages = reactive([]);
const userInput = ref("");
const loading = ref(false);

const totalProfit = computed(() =>
  exampleCards.reduce(
    (sum, c) =>
      c.status === "CLOSED"
        ? sum + (c.sold - c.bought)
        : c.currentPrice
          ? sum + (c.currentPrice - c.bought)
          : sum,
    0
  )
);
const activeStrategiesCount = computed(() =>
  exampleCards.filter(c => c.status === "ACTIVE").length
);
const completedTransactions = computed(() =>
  exampleCards.filter(c => c.status === "CLOSED").length
);

const quickQuestions = [
  "Chiến lược nào phù hợp với tôi?",
  "Rủi ro của giao dịch tự động?",
  "Cách tối ưu hóa lợi nhuận?",
  "Thời điểm tốt nhất để đầu tư?"
];

/* —————————————————— Chat helpers —————————————————— */
function scrollChatToBottom() {
  nextTick(() => {
    const el = document.querySelector(".chat-window");
    if (el) el.scrollTop = el.scrollHeight;
  });
}

function composeSystemContext() {
  const strat = activeStrategy.value
    ? strategies[activeStrategy.value].title
    : "Chưa chọn";
  const cap = capital.value ?? 0;
  const cards = exampleCards
    .map(
      c =>
        `${c.ticker}: ${c.status}, strat=${c.strategy}, buy=${c.bought}, sold=${c.sold || 0
        }`
    )
    .join(" | ");

  return `Bạn là AutoTrade AI.
Chiến lược: ${strat}
Vốn: $${cap}
Danh mục: ${cards}
Trả lời ngắn gọn, chuyên nghiệp, tiếng Việt.`;
}

async function askQuestion(q) {
  loading.value = true;
  chatMessages.push({ role: "user", content: q });
  scrollChatToBottom();

  const history = [
    { role: "system", content: composeSystemContext() },
    ...chatMessages.slice(-10)
  ];

  try {
    const ans = await gptServices(history, "gemini");
    chatMessages.push({
      role: "assistant",
      content: stripMarkdown(ans) // ← apply here
    });
  } catch (err) {
    chatMessages.push({
      role: "assistant",
      content: "Lỗi kết nối AI, thử lại sau."
    });
  } finally {
    loading.value = false;
    scrollChatToBottom();
  }
}

function sendChat() {
  if (!userInput.value.trim()) return;
  const q = userInput.value.trim();
  userInput.value = "";
  askQuestion(q);
}
function askQuickQuestion(q) {
  userInput.value = q;
  sendChat();
}

/* —————————————————— Strategy actions —————————————————— */
function toggleStrategy(key) {
  activeStrategy.value = activeStrategy.value === key ? null : key;
  if (activeStrategy.value) {
    askQuestion(
      `Hãy giải thích về chiến lược ${strategies[key].title} và những lưu ý khi áp dụng?`
    );
  }
}
function startStrategy() {
  if (!activeStrategy.value || !capital.value) return;
  chatMessages.push({
    role: "assistant",
    content: `✅ Bắt đầu chiến lược ${strategies[activeStrategy.value].title
      } với vốn $${capital.value}.`
  });
  scrollChatToBottom();
}

function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s*/gm, '')          // Remove Markdown headings
    .replace(/\*\*(.*?)\*\*/g, '$1')      // Remove bold **
    .replace(/\*(.*?)\*/g, '$1')          // Remove italic *
    .replace(/__([^_]+)__/g, '$1')        // Remove bold __text__
    .replace(/_([^_]+)_/g, '$1')          // Remove italic _text_
    .replace(/~~(.*?)~~/g, '$1')          // Remove strikethrough
    .replace(/`{1,3}[^`]*`{1,3}/g, '')    // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')      // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/\\([*_~`])/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')           // Remove Markdown headings
    .replace(/\*\*(.*?)\*\*/g, '$1')       // Remove bold **
    .replace(/\*(.*?)\*/g, '$1')           // Remove italic *
    .replace(/^-?\s*\*+/gm, '')            // Remove bullet point lines
    .replace(/•/g, '')                     // Optional: Remove other bullet styles
    .replace(/[*]/g, '')                   // Remove all stray asterisks
    .replace(/\n{2,}/g, '\n\n')        // Unescape escaped markdown
    .trim();
}


/* —————————————————— Lifecycle —————————————————— */
onMounted(() => {
  chatMessages.push({
    role: "assistant",
    content: "Chào mừng bạn đến với AutoTrade AI! Tôi có thể giúp gì cho bạn hôm nay?"
  });
});
</script>

<style scoped>
:root {
  --font-base: 16px;
  --font-large: 18px;
  --font-xlarge: 22px;
  --font-title: 28px;
}

/* Base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f5f7fa;
  line-height: 1.5;
  font-size: var(--font-base);
}

.autotrade-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f5f7fa;
}

/* Header */
.page-header {
  background-color: #fff;
  border-radius: 12px;
  padding: 40px 20px 0;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.page-header h1 {
  font-size: var(--font-title);
  font-weight: 600;
  margin-bottom: 10px;
}

.page-header p {
  font-size: var(--font-base);
  color: #666;
  margin-bottom: 20px;
}

.nav-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  padding: 18px;
  background: none;
  border: none;
  font-size: var(--font-base);
  font-weight: 600;
  color: #666;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.tab.active {
  color: #000;
  border-bottom: 2px solid #000;
}

/* Sections */
.autotrade-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section h2 {
  font-size: var(--font-xlarge);
  font-weight: 600;
  margin-bottom: 10px;
}

.section-desc {
  color: #666;
  margin-bottom: 30px;
  font-size: var(--font-base);
}

/* Strategy */
.strategy-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.strategy-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.strategy-card:hover {
  border-color: #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.strategy-card.active {
  border-color: #000;
}

.strategy-icon {
  font-size: 26px;
  margin-bottom: 18px;
}

.strategy-card h3 {
  font-size: var(--font-large);
  font-weight: 600;
  margin-bottom: 10px;
}

.strategy-card p {
  font-size: var(--font-base);
  color: #666;
  margin-bottom: 22px;
}

.strategy-metrics {
  display: flex;
  justify-content: space-between;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
}

.metric-label {
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
}

/* Capital input */
.capital-allocation {
  margin-bottom: 30px;
}

.capital-allocation h3 {
  font-size: var(--font-large);
  margin-bottom: 16px;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: var(--font-base);
}

.input-wrapper input:focus {
  outline: none;
  border-color: #000;
}

/* Main CTA */
.action-button {
  width: 100%;
  padding: 18px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: var(--font-base);
  font-weight: 500;
  cursor: pointer;
}

.action-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Investment Packages */
.loading-text {
  text-align: center;
  color: #666;
  padding: 20px;
}

.package-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.package-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.package-card:hover {
  border-color: #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.package-card.active {
  border-color: #000;
}

.package-card h3 {
  font-size: var(--font-large);
  margin-bottom: 10px;
}

.package-card p {
  font-size: var(--font-base);
  color: #666;
  margin-bottom: 16px;
}

.stocks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stock-tag {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* Investment cards */
.investment-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.investment-card {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
}

.ticker {
  font-size: var(--font-large);
  font-weight: 600;
}

.status {
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}

.status.active {
  background-color: #e6f7ed;
  color: #0d9f4f;
}

.status.closed {
  background-color: #f0f0f0;
  color: #666;
}

.card-content {
  padding: 16px;
}

.strategy-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #fff;
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
  margin-bottom: 10px;
  font-size: var(--font-base);
}

.profit-loss.positive {
  color: #0d9f4f;
  font-weight: 600;
}

.profit-loss.negative {
  color: #ff6384;
  font-weight: 600;
}

/* Performance */
.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.metric-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.metric-card h3 {
  font-size: var(--font-base);
  color: #666;
  margin-bottom: 10px;
}

.metric-card .metric-value {
  font-size: 26px;
  font-weight: 600;
}

.metric-card .metric-value.positive {
  color: #0d9f4f;
}

.chart-container {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 24px;
}

.chart-container h3 {
  font-size: var(--font-large);
  margin-bottom: 15px;
}

.chart-placeholder {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

/* Chat */
.chat-window {
  height: 340px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.chat-welcome {
  text-align: center;
  color: #666;
  padding: 20px;
}

.chat-bubble {
  margin-bottom: 16px;
  max-width: 90%;
}

.chat-bubble.user {
  margin-left: auto;
}

.chat-content {
  background-color: #fff;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: var(--font-base);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.chat-bubble.user .chat-content {
  background-color: #f0f0f0;
}

.message-text {
  display: block;
  margin-top: 6px;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background-color: #888;
  border-radius: 50%;
  animation: typing 1.4s infinite both;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    transform: scale(0.6);
    opacity: 0.6;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(0.6);
    opacity: 0.6;
  }
}

.chat-controls {
  margin-bottom: 20px;
}

.model-info {
  font-size: var(--font-base);
  color: #666;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  gap: 12px;
}

.chat-input {
  flex: 1;
  padding: 14px 18px;
  font-size: var(--font-base);
  border: 1px solid #ddd;
  border-radius: 8px;
}

.chat-input:focus {
  outline: none;
  border-color: #000;
}

.send-button {
  padding: 14px 24px;
  font-size: var(--font-base);
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Quick questions */
.quick-questions p {
  font-size: var(--font-base);
  font-weight: 500;
  margin-bottom: 12px;
}

.question-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-question-btn {
  padding: 10px 16px;
  font-size: var(--font-base);
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.quick-question-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.quick-question-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {

  .strategy-options,
  .package-options,
  .investment-cards,
  .performance-metrics {
    grid-template-columns: 1fr;
  }

  .input-group {
    flex-direction: column;
  }

  .section {
    padding: 20px;
  }
}
</style>
