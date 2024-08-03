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
}

.chat-frame {
    height: 94%; /* Fixed height */
    width: 100%; /* Fixed width */
    overflow-y: auto;
}
  
</style>
