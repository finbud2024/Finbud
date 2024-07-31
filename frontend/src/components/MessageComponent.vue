<template>
  <div>
    <div :class="['message-wrapper', { 'user': isUser, 'bot': !isUser }]">
      <img :src="avatarSrc" class="avatar">
      <div class="message-content-wrapper">
        <!-- <div class="username">{{ username }}</div> -->
        <div v-if="htmlContent" :class="['message-content']" v-html="htmlContent"></div>
        <div v-else  :class="['message-content', { 'typing': typing }]">{{ displayedText }}</div>
      </div>
      <!-- <div class="timestamp">{{ timestamp }}</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageComponent',
  props: ['isUser', 'text', 'typing', 'timestamp', 'username', 'avatarSrc','htmlContent'],
  data() {
    return {
      textProgress: 0, // Initial progress of the typing animation
    };
  },
  computed: {
    displayedText() {
      // Return the substring of text based on the current typing progress
      return this.text.substring(0, this.textProgress);
    },
  },
  watch: {
    typing(newValue) {
      if (newValue) {
        // Start typing effect when typing is true
        this.startTypingEffect();
      }
    }
  },
  methods: {
    startTypingEffect() {
      const length = this.text.length;
      const typingSpeed = 5; // milliseconds per character
      let currentLength = 0;

      const interval = setInterval(() => {
        currentLength++;
        this.textProgress = currentLength;
        if (currentLength >= length) {
          clearInterval(interval); // Stop the interval when the full text is displayed
        }
      }, typingSpeed);
    }
  },
  mounted() {
    if (this.typing) {
      this.startTypingEffect();
    }
  }
}
</script>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 0.9rem;
    color: black;
  }
  thead {
    background-color: #f8f8f8;
  }
  th,td {
    padding: 8px;
    text-align: left;
    border: 3px solid #000;
  }
  th {
    background-color: #f2f2f2;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  tr:nth-child(odd) {
    background-color: #fff;
  }

  .message-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-bottom: 16px;
    overflow: hidden;
    word-wrap: break-word;
  }

  .message-content-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 60%;
    line-height: 1.25rem;
    word-wrap: break-word;
  }

  .bot .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: 1%;
  }

  .user .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1%;
  }

  .user {
    display: flex;
    flex-direction: row-reverse;
  }

  .message-content {
    font-size: 0.9rem;
    display: flex;
    flex-direction:column;
    padding: 10px;
    margin: 4px 0;
    border-radius: 16px;
    background-color: #007bff;
    color: #fff; 
    /* background-color: papayawhip;
    color: black; */
    border: 1px solid transparent;
    text-align: left;
    white-space: pre-wrap; 
  }

  @keyframes typing {
    from {
      width: 0; /* Use width instead of max-width for a smoother start */
    }
    to {
      width: 100%; /* Adjust to full width of the containing block */
    }
  }


  .message-container.is-user .message-content {
    background-color: #f0f0f0;
    color: #000;
  }
</style>
