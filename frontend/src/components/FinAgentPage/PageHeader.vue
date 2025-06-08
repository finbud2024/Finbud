<template>
  <div class="page-header">
    <div class="header-top">
      <h1>{{ title }}</h1>
      <CustomButton
        text="Customize this AI workflow"
        icon="arrow-right"
        buttonClass="customize-button"
      />
    </div>
    <div class="header-bottom">
      <div class="social-buttons">
        <SocialShare />
      </div>
      <div class="features-container">
        <FeatureChecklist />
      </div>
    </div>
  </div>
</template>

<script>
import SocialShare from '@/components/FinAgentPage/SocialShare.vue'
import CustomButton from '@/components/FinAgentPage/CustomButton.vue'
import FeatureChecklist from './FeatureChecklist.vue';

export default {
  name: 'PageHeader',
  components: {
    SocialShare,
    CustomButton,
    FeatureChecklist
  },
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.header-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

h1 {
  color: var(--text-primary);
  font-size: 36px;
  font-weight: 700;
  margin: 0;
}

.social-buttons {
  display: flex;
  align-items: center;
}

.features-container {
  display: flex;
  justify-content: flex-end;
}

.customize-button {
  background-color: var(--link-color);
  color: var(--black-in-dark-mode);
  padding: 10px 20px;
  border-radius: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(140, 125, 247, 0.25);
  transition: all 0.2s ease;
  font-size: 14px;
}

.customize-button:hover {
  background-color: var(--black-in-dark-mode);
  color: var(--white-in-dark-mode);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(140, 125, 247, 0.3);
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    align-items: flex-start;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 15px;
  }
  
  .header-bottom {
    flex-direction: column;
  }
  
  .social-buttons {
    margin-bottom: 15px;
  }
  
  .features-container {
    justify-content: flex-start;
  }
}
</style>