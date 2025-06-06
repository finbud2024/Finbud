<template>
  <div class="app-container">
    <div class="main-content">
      <BackNavigation />
      <PageHeader :title="$t('agentPage.title')" />
      
      <div v-if="!showChat" class="content-wrapper">        
        <MainContent @start-workflow="startWorkflow" />
      </div>
      
      <ChatSection v-else ref="chatSection" @process-pdf="processPDF" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import BackNavigation from '@/components/FinAgentPage/BackNavigation.vue'
import PageHeader from '@/components/FinAgentPage/PageHeader.vue'
import MainContent from '@/components/FinAgentPage/MainContent.vue'
import ChatSection from '@/components/FinAgentPage/ChatSection.vue'

export default defineComponent({
  name: "AgentPage",
  components: {
    BackNavigation,
    PageHeader,
    MainContent,
    ChatSection,
  },
  setup() {
    const showChat = ref(false);
    const chatSection = ref(null);

    const startWorkflow = () => {
      showChat.value = true;
      setTimeout(() => {
        if (chatSection.value) {
          chatSection.value.startFinancialNewsAnalysis('AAPL');
        }
      }, 100);
    };

    return {
      showChat,
      chatSection,
      startWorkflow,
    };
  }
})
</script>

<style>
.app-container {
  font-family: 'Inter', 'Arial', sans-serif;
  margin: 0 auto;
  padding: 20px 40px;
  color: var(--text-primary);
  background: var(--bg-primary);
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.content-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }
}
</style>