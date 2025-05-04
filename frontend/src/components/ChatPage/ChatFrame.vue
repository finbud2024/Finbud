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
    height: 50vh; /* Fixed height */
    overflow-y: auto; /* Enables vertical scrolling */
	max-width: 150%;
	width: 100%;
    /* padding: 0 10px; */
    /* border: 1px solid #ccc;  */
}

.chat-frame::-webkit-scrollbar {
    /* width: 2px; Make the scrollbar thinner */
    display: none; /* Hide the scrollbar */
}
</style>