<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import InvestorCard from '@/components/FinManage/SuperInvestorsPage/InvestorCard/InvestorCard.vue';
import { getInvestors } from '@/services/investorService';

const { t: $t } = useI18n();
const investors = ref([]);
const showBot = ref(false);
const hidingBot = ref(false);
const showMessage = ref(false);
const hidingMessage = ref(false);
const isTyping = ref(false);
const typedContent = ref("");
const botMessage = ref("");
const typingSpeed = 50;
const words = ref([]);
const currentWordIndex = ref(0);
let botObserver = null;
let typingTimer = null;
let botHideTimer = null;

onMounted(async () => {
  try {
    const rawInvestors = await getInvestors();
    investors.value = rawInvestors;
    startBotAnimation();
  } catch (error) {
    console.error("Failed to fetch investors:", error);
  }
});

const formatInvestorSummary = () => {
  let summary = `👋 ${$t('superInvestorPage.greeting')}\n\n`;

  if (investors.value && investors.value.length) {
    summary += `${$t('superInvestorPage.topInvestorsIntro')}\n\n`;
    investors.value.slice(0, 3).forEach(investor => {
      summary += `🔹 ${investor.name} ${$t('superInvestorPage.from')} ${investor.company}\n`;
      if (investor.marketValue) {
        summary += `   ${$t('superInvestorPage.portfolioValue')}: $${investor.marketValue}\n`;
      }
      if (investor.holdingPeriod) {
        summary += `   ${$t('superInvestorPage.avgHoldingPeriod')}: ${investor.holdingPeriod}\n`;
      }
      summary += '\n';
    });
  }
  
  summary += $t('superInvestorPage.learnMorePrompt');
  return summary;
};

const startBotAnimation = () => {
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
  if (botHideTimer) {
    clearTimeout(botHideTimer);
  }
  
  hidingBot.value = false;
  hidingMessage.value = false;
  typedContent.value = "";
  
  showBot.value = true;
  
  setTimeout(() => {
    showMessage.value = true;
    isTyping.value = true;
    
    setTimeout(() => {
      isTyping.value = false;
      botMessage.value = formatInvestorSummary();
      startWordByWordTyping();
    }, 1500);
  }, 800);
  
  if (botObserver) {
    botObserver.disconnect();
  }
};

const startWordByWordTyping = () => {
  words.value = botMessage.value.split(/( |\n)/g).filter(word => word !== "");
  currentWordIndex.value = 0;
  typedContent.value = "";
  typeNextWord();
};

const typeNextWord = () => {
  if (currentWordIndex.value < words.value.length) {
    const word = words.value[currentWordIndex.value];
    
    if (word === "\n") {
      typedContent.value += "<br>";
    } else {
      typedContent.value += word;
    }
    
    currentWordIndex.value++;
    
    typingTimer = setTimeout(() => {
      typeNextWord();
    }, typingSpeed * (word.length / 2 + 1));
  } else {
    scheduleHideBot();
  }
};

const scheduleHideBot = () => {
  botHideTimer = setTimeout(() => {
    hideBot();
  }, 60000);
};

const hideBot = () => {
  hidingMessage.value = true;
  
  setTimeout(() => {
    hidingBot.value = true;
    
    setTimeout(() => {
      showBot.value = false;
      showMessage.value = false;
      hidingBot.value = false;
      hidingMessage.value = false;
      typedContent.value = "";
    }, 1000);
  }, 500);
};
</script>

<template>
  <div class="page-container fin-speak-page">
    <!-- Bot Chat Component -->
    <div class="bot-chat-container" :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }">
      <img class="bot-image" src="@/assets/botrmbg.png" alt="Bot" />
      <div class="bot-message" :class="{ 'message-visible': showMessage, 'message-hidden': hidingMessage }">
        <div v-if="isTyping" class="typing-animation">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div v-else class="typed-message" v-html="typedContent"></div>
      </div>
    </div>

    <header class="fin-speak-hero-block super-investors-hero">
      <p class="fin-speak-eyebrow">{{ $t('finSpeak.slogan') }}</p>
      <h1 class="fin-speak-page-title super-investors-title">{{ $t('superInvestorPage.title') }}</h1>
      <p class="fin-speak-lead">{{ $t('finSpeak.superInvestorsLead') }}</p>
    </header>

    <!-- Investors Grid -->
    <div class="investors-grid">
      <InvestorCard
        v-for="investor in investors"
        :key="investor._id"
        :_id="investor._id"
        :name="investor.name"
        :company="investor.company"
        :avatar="investor.profileURL"
        :marketValue="investor.marketValue"
        :holdingPeriod="investor.holdingPeriod || 'N/A'"
        :positions="investor.positions"
        :turnover="investor.turnover ? investor.turnover : 'N/A'"
        :stocks="investor.stocks"
      />
    </div>
  </div>
</template>

<style scoped>
.super-investors-hero {
  margin-bottom: 1rem;
}

.super-investors-title {
  margin-bottom: 0.35rem;
}

.super-investors-title::after {
  display: none;
}

.page-container {
  min-height: 100vh;
  background: transparent;
  padding: 3rem 1rem;
  padding-bottom: max(3rem, env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease;
  max-width: 100vw;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--fin-speak-heading, #1a1d26);
  margin-bottom: 2rem;
  position: relative;
  animation: slideInDown 0.5s ease;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--fin-speak-accent, #22a36a);
  border-radius: 2px;
}

.investors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 24px;
  max-width: 1400px;
  width: 100%;
  padding: 16px;
  animation: fadeInUp 0.5s ease;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Loading Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Bot Chat Styles */
.bot-chat-container {
  position: fixed;
  right: -350px;
  top: 30%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 15px;
  z-index: 100;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.bot-chat-container.bot-visible {
  transform: translateX(-350px);
  opacity: 1;
}

.bot-chat-container.bot-hidden {
  transform: translateX(0);
  opacity: 0;
}

.bot-image {
  width: 50px;
  height: 50px;
  object-fit: contain;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.3s ease;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.bot-image:hover {
  transform: scale(1.1);
}

.bot-message {
  background: #000000;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-right: 15px;
  max-width: 250px;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(20px);
}

.bot-message.message-visible {
  opacity: 1;
  transform: translateX(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: translateX(20px);
}

.typing-animation {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.6;
}

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
  color: #ffffff;
}

.dot:nth-child(1) {
  animation: typing 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: typing 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: typing 1s infinite 0.4s;
}

@keyframes typing {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .investors-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }
  
  .title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1.25rem 0.75rem;
    padding-bottom: max(1.25rem, env(safe-area-inset-bottom, 0px));
    max-width: 100vw;
    overflow-x: hidden;
  }
  
  .investors-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem 0;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .title {
    font-size: 1.65rem;
    margin-bottom: 1rem;
    text-align: center;
    padding: 0 0.25rem;
    line-height: 1.2;
  }

  .text-center.mb-12 {
    width: 100%;
    max-width: 100%;
    padding: 0 0.5rem;
    box-sizing: border-box;
  }

  .bot-chat-container {
    right: 12px;
    left: auto;
    width: min(300px, calc(100vw - 24px));
    bottom: max(16px, env(safe-area-inset-bottom, 0px));
    top: auto;
    transform: none;
    max-height: 50vh;
  }

  .bot-chat-container.bot-visible {
    transform: none;
    opacity: 1;
  }

  .bot-chat-container.bot-hidden {
    opacity: 0;
    pointer-events: none;
  }
  
  .bot-message {
    max-width: 250px;
    padding: 12px 16px;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .bot-image {
    width: 50px;
    height: 50px;
  }
  
  /* Ensure touch targets are at least 44px */
  .bot-chat-container {
    min-height: 44px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 1rem 0.5rem;
    max-width: 100vw;
    overflow-x: hidden;
  }
  
  .title {
    font-size: 1.35rem;
    margin-bottom: 0.75rem;
  }
  
  .investors-grid {
    gap: 0.75rem;
    padding: 0.25rem 0;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .bot-chat-container {
    width: min(280px, calc(100vw - 20px));
    right: 10px;
  }
  
  .bot-message {
    max-width: 210px;
    padding: 10px 14px;
    font-size: 0.85rem;
  }
}

@media (max-width: 320px) {
  .page-container {
    padding: 0.75rem 0.25rem;
  }
  
  .title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  .investors-grid {
    gap: 0.5rem;
    padding: 0.125rem;
  }
  
  .bot-chat-container {
    right: 8px;
    width: min(260px, calc(100vw - 16px));
  }

  .bot-chat-container.bot-visible {
    transform: none;
  }
  
  .bot-message {
    max-width: 170px;
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  
  .bot-image {
    width: 45px;
    height: 45px;
  }
}

/* Dark mode styles */
.dark-mode .page-container {
  background: transparent;
  color: var(--fin-speak-text, #e4e7ec);
}

.dark-mode .title {
  color: #f9fafb;
}

.dark-mode .title::after {
  background: var(--fin-speak-accent, #34d399);
}

.dark-mode .bot-message {
  background: #374151;
  color: #f9fafb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.dark-mode .typed-message {
  color: #f9fafb;
}

.dark-mode .dot {
  background-color: #f9fafb;
}
</style>
