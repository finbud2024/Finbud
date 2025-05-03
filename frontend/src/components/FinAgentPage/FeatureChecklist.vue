<template>
  <div class="feature-checklist">
    <div v-for="(feature, index) in features" :key="index" class="feature-item">
      <span class="checkmark">✓</span>
      <span class="feature-text">{{ feature.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureChecklist',
  data() {
    return {
      features: [
        { text: 'Save results' },
        { text: 'Add your own data' },
        { text: 'Customize workflow' },
        { text: 'Share with others' }
      ]
    }
  }
}
</script>

<style scoped>
.feature-checklist {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 8px;
}

.checkmark {
  color: #4fd1c5;
  margin-right: 5px;
  font-weight: bold;
}

.feature-text {
  font-size: 14px;
  color: #4a5568;
}

@media (max-width: 768px) {
  .feature-checklist {
    justify-content: flex-start;
  }
  
  .feature-item {
    margin-left: 0;
    margin-right: 15px;
  }
}
</style>