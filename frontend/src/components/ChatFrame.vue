<template>
    <div class="chat-frame">
        <slot></slot> <!-- Content from parent component will be inserted here -->
    </div>
</template>

<script>
export default {
  name: 'ChatFrame'
}
</script>

<style>
.chat-frame {
    height: 80%; /* Fixed height */
    overflow-y: auto; /* Enables vertical scrolling */
    padding: 0 10px; /* Optional: adds some padding inside the frame */
    /* border: 1px solid #ccc;  */
}
</style>
