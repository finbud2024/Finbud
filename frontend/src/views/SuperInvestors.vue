<script setup>
import { ref, onMounted } from 'vue';
import InvestorCard from '@/components/superInvestors/InvestorCard/InvestorCard.vue';
import { getInvestors } from '@/services/investorService';

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
  let summary = "👋 Hello! Looking for investment insights?\n\n";

  if (investors.value && investors.value.length) {
    summary += "Here are some top investors you might be interested in:\n\n";
    investors.value.slice(0, 3).forEach(investor => {
      summary += `🔹 ${investor.name} from ${investor.company}\n`;
      if (investor.marketValue) {
        summary += `   Portfolio Value: $${investor.marketValue}\n`;
      }
      if (investor.holdingPeriod) {
        summary += `   Average Holding Period: ${investor.holdingPeriod}\n`;
      }
      summary += '\n';
    });
  }
  
  summary += "Would you like to learn more about their investment strategies?";
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
      <h1 class="title">Super Investors</h1>
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
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
}

.investors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}

img {
  max-width: 30px;
  height: auto;
  vertical-align: middle;
  margin-right: 8px;
}

/* Bot Chat Styles */
.bot-chat-container {
  position: fixed;
  left: -350px;
  top: 30%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 100;
  transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1s ease;
  opacity: 0;
  transform: translateX(0);
  pointer-events: none;
}

.bot-chat-container.bot-visible {
  transform: translateX(350px);
  opacity: 1;
  pointer-events: auto;
}

.bot-chat-container.bot-hidden {
  transform: translateX(350px) translateY(50px);
  opacity: 0;
  transition: transform 1s ease, opacity 1s ease;
}

.bot-image {
  width: 60px;
  height: auto;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.5s ease;
  border-radius: 50%;
}

.bot-visible .bot-image {
  animation: botBounce 1s ease-out;
}

.bot-message {
  margin-top: 10px;
  background: #2196F3;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 280px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.3s;
}

.bot-message.message-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
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
  opacity: 0.3;
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

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
}

@keyframes typing {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes botBounce {
  0% { transform: translateY(20px); opacity: 0; }
  60% { transform: translateY(-5px); }
  80% { transform: translateY(2px); }
  100% { transform: translateY(0); opacity: 1; }
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .bot-chat-container {
    left: auto;
    right: -300px;
    bottom: 20px;
    top: auto;
  }
  
  .bot-chat-container.bot-visible {
    transform: translateX(-310px);
  }
  
  .bot-chat-container.bot-hidden {
    transform: translateX(-310px) translateY(50px);
  }
}

@media screen and (max-width: 576px) {
  .bot-chat-container {
    width: 250px;
  }
  
  .bot-message {
    max-width: 220px;
  }
}
</style>
