<template>
  <div class="back-navigation">
    <a href="#" class="back-link">
      <span class="back-icon">←</span>
      <span>Back to all tools</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'BackNavigation'
}
</script>

<style scoped>
.back-navigation {
  margin-bottom: 20px;
}

.back-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #718096;
  font-size: 14px;
  transition: color 0.2s;
  background-color: rgba(229, 231, 235, 0.5);
  padding: 6px 12px;
  border-radius: 6px;
  width: fit-content;
}

.back-link:hover {
  color: #4a5568;
}

.back-icon {
  margin-right: 5px;
}
</style>