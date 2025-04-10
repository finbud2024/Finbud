<template>
  <div class="app-container">
    <div class="main-content">
      <BackNavigation />
      <PageHeader title="Daily AI Finance Reports Generator" />
      
      <div v-if="!showChat" class="content-wrapper">        
        <MainContent @start-workflow="startWorkflow" />
      </div>
      
      <ChatSection v-else ref="chatSection" @process-pdf="processPDF" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import BackNavigation from '@/components/Agent/BackNavigation.vue'
import PageHeader from '@/components/Agent/PageHeader.vue'
import MainContent from '@/components/Agent/MainContent.vue'
import ChatSection from '@/components/Agent/ChatSection.vue'

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
  color: #536f96;
  background: #caeaff;
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