<template>
  <div class="main-content-container">
    <h2 class="title">Daily AI Finance Reports Generator</h2>
    <div class="powered-by">
      Powered by <a href="#" class="mindpal-link">FinBudAI<span class="external-icon">↗</span></a>
    </div>
    <button class="start-button" @click="$emit('start-workflow')">
      Start workflow
    </button>
  </div>
</template>

<script>

export default {
  name: 'MainContent',
  emits: ['start-workflow']
}
</script>

<style scoped>
.main-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--black-in-light-mode);
  border-radius: 12px;
  padding: 60px 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: var(--white-in-dark-mode);
  margin-bottom: 15px;
  text-align: center;
}

.powered-by {
  font-size: 14px;
  color: var(--white-in-dark-mode);
  margin-bottom: 40px;
}

.mindpal-link {
  color: var(--white-in-dark-mode);
  text-decoration: none;
  font-weight: 500;
}

.external-icon {
  font-size: 12px;
}

.start-button {
  background-color: #007bff;
  color: var(--white-in-dark-mode);
  font-size: 16px;
  font-weight: 500;
  padding: 14px 70px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-button:hover {
  background-color: #0095ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(140, 125, 247, 0.2);
}

@media (max-width: 768px) {
  .main-content-container {
    padding: 40px 20px;
  }
  
  .title {
    font-size: 26px;
  }
  
  .start-button {
    padding: 12px 50px;
  }
}
</style>