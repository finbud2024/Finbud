<template>
    <div :class="['message-wrapper', { 'user': isUser, 'bot': !isUser }]">
      <img :src="avatarSrc" class="avatar">
      <div class="message-content-wrapper">
        <div class="username">{{ username }}</div>
        <div :class="['message-content', { 'typing': typing }]">{{ text }}</div>
      </div>
      <div class="timestamp">{{ timestamp }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MessageComponent',
    props: ['isUser', 'text', 'typing', 'timestamp', 'username', 'avatarSrc'],
  }
  </script>
  
  <style scoped>
.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 16px;
}

.message-content-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 60%;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content {
  display: inline-block;
  padding: 10px;
  margin: 4px 0;
  border-radius: 16px;
  max-width: 80%;
  background-color: #007bff;
  color: #fff;
  border: 1px solid transparent;
  text-align: left;
  overflow: hidden;
  white-space: pre-line;
  animation: typing 4s steps(40) forwards, blink-caret .75s step-end infinite alternate;
  border-right: 2px solid;
  word-wrap: break-word;
}

@keyframes typing {
  from { max-width: 0; }
  to { max-width: 1000px; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: black; }
}

.message-container.is-user .message-content {
  background-color: #f0f0f0;
  color: #000;
}
</style>
