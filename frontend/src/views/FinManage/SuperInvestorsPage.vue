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
  <div class="page-container">
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

    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="title">{{ $t('superInvestorPage.title') }}</h1>
    </div>

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
.page-container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000000;
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
  background: #000000;
  border-radius: 2px;
}

.investors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1400px;
  width: 100%;
  padding: 20px;
  animation: fadeInUp 0.5s ease;
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
@media (max-width: 768px) {
  .investors-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 10px;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .bot-chat-container {
    right: -280px;
    width: 250px;
  }

  .bot-chat-container.bot-visible {
    transform: translateX(-280px);
  }
  
  .bot-message {
    max-width: 220px;
    padding: 10px 15px;
  }
}
</style>
