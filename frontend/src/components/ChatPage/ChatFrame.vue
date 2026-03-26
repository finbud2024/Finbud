<template>
  <div class="chat-frame">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ChatFrame",
};
</script>

<style>
.chat-frame {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.chat-frame::-webkit-scrollbar {
  display: none;
}
</style>
