<template>
    <div class="data-card">
        <div class="card-header">
            <h3 class="title">{{ title }}</h3>
            <span style="white-space: nowrap;"class="doc-count">{{ docsCount }} docs</span>
        </div>

        <div class="card-body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    docsCount: Number
})
</script>

<style scoped>
.data-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  height: 250px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  margin-bottom: 12px;
}

.title {
  font-size: 1rem;
  margin: 0;
}

.doc-count {
  font-size: 0.9rem;
  color: #6c757d;
}

.card-body {
  flex: 1;
  overflow-y: auto;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 4px;
}
</style>