<!-- ChatFrame.vue -->
<template>
    <div class="chat-frame-container">
        <div class="chat-frame">
            <slot></slot> <!-- Content from parent component will be inserted here -->
        </div>
    </div>
</template>

<script>
export default {
  name: 'ChatFrame'
}
</script>

<style scoped>
.chat-frame-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--bg-primary);
}

.chat-frame {
    height: calc(100% - 100px); /* Fixed height */
    width: 100%; /* Fixed width */
    overflow-y: auto;
}

@media (max-width: 768px) {
    .chat-frame {
        height: calc(100vh - 160px); /* Adjust height for mobile */
        padding-bottom: 80px; /* More padding on mobile */
    }
}
</style>