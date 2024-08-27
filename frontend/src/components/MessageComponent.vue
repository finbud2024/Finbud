<template>
  <div>
    <div :class="['message-wrapper', { user: isUser, bot: !isUser }]">
      <img :src="avatarSrc" class="avatar" />
      <div class="message-content-wrapper">
          <!-- Displayed text -->
          <div v-if="htmlContent" :class="['message-content']" v-html="htmlContent"></div>
          <div v-else  :class="['message-content', { 'typing': typing }]">{{ displayedText }}</div>
          <!-- Sources -->
            <section class="sources" v-if="sources && sources.length > 0">
              <SearchResult :sources="sources" />
            </section>
            <!-- Videos -->
            <section class="videos" v-if="videos && videos.length > 0">
              <Video :videos="videos" />
            </section>
            <!-- Follow-up questions -->
            <div class="relevant-questions" v-if="relevantQuestions && relevantQuestions.length > 0">
              <h3>Suggested Question</h3>
              <ul>
                <li v-for="(question, i) in relevantQuestions" :key="i" @click="handleQuestionClick(question)">
                  {{ question }}
                </li>
              </ul>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchResult from '../components/chatbot/SearchResult.vue';
import Video from '../components/chatbot/Video.vue';

export default {
  name: 'MessageComponent',
  components: { SearchResult, Video },
  props: ['isUser', 'text', 'typing', 'timestamp', 'username', 'avatarSrc','htmlContent','sources','videos','relevantQuestions'],
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
    },
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
    },
    handleQuestionClick(question) {
      this.$emit('question-click', question);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const chatFrame = document.querySelector(".chat-frame");
      if (chatFrame) {
        chatFrame.scrollTo({
          top: chatFrame.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  },
  mounted() {
    if (this.typing) {
      this.startTypingEffect();
    }
      // const chatContainer = document.querySelector('.chat-container');
      // const messageContents = document.querySelectorAll('.message-content');
      // const containerWidth = chatContainer.offsetWidth;
      // messageContents.forEach(messageContent => {
      //   if (containerWidth > 400) {
      //     messageContent.style.setProperty('--container-width', `${containerWidth}px`);
      //     messageContent.style.fontSize = 'clamp(0.75rem, calc(var(--container-width) * 0.056), 1.25rem)';
      //   } else {
      //     messageContent.style.fontSize = '14px';
      //   }
      // });
  },
};
</script>

<style scoped>
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
th,
td {
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
  padding: 0 17.42%;
  container-name: chatComponent;
}


.message-content-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.25rem;
  word-wrap: break-word;
}

/*
  .bot {
    padding: 0 0 0 14%;
  }

  .user {
    padding: 0 16% 0 0;
  }

  */

.bot .message-content-wrapper {
  max-width: 100%;
  padding-right: calc(1% + 30px + 18px);
}

.user .message-content-wrapper {
  max-width: 60%;
}

.bot .avatar {
  width: 41px;
  aspect-ratio: 1;
  border-radius: 50%;
  margin-left: 1%;
}

.user .avatar {
  width: 41px;
  aspect-ratio: 1;
  border-radius: 50%;
  margin-right: 1%;
}

.user {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 16px;
  background-color: #007bff;
  color: #fff;
  /* background-color: papayawhip;
    color: black; */
  border: 1px solid transparent;
  text-align: left;
  white-space: pre-wrap;
  line-height: 1.2;
  font-size: clamp(0.75rem, calc(var(--container-width) * 0.056), 1.25rem);
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

  .combined-content {
  display: flex;
  flex-direction: column;
}


.relevant-questions {
  width: 100%;
  margin-top: 10px;
}

.relevant-questions ul {
  list-style-type: none;
  padding: 0;
}

.relevant-questions li {
  padding: 10px;
  background-color: #f8f9fa;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.relevant-questions li:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

/* Media queries */
@media (max-width: 768px) {
  .message-wrapper {
    padding: 0 5vw;
  }
}

@container messageComponent (max-width: 401px) {
  .message-content {
    font-size: 14px;
  }

  .message-wrapper {
    padding: 0;
  }
}


.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff; /* Added background color for sidebar */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
  border-radius: 8px; /* Added border-radius for rounded corners */
  margin-right: 20px; /* Added margin for spacing */
}

.toggle-sidebar-btn {
  display: none;
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 1000;
  color: black;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-sidebar-btn:hover {
  background-color: #2980b9;
  color: white; /* Changed text color on hover */
}

.chat-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  position: relative;
  background-color: #fff; /* Added background color for chat container */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
  border-radius: 8px; /* Added border-radius for rounded corners */
  padding: 20px; /* Added padding for spacing */
}

@media (max-width: 768px) {
  .side-bar {
    display: none;
  }

  .toggle-sidebar-btn {
    display: block;
  }

  .chat-header {
    font-size: 1rem;
    padding: 10px;
  }
}

.overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.side-bar.is-visible {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 60%;
  height: 100%;
  background-color: rgb(248, 249, 254);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.side-bar.is-visible {
  transform: translateX(0);
}

.guidance-btn {
  height: 50px;
  width: 130px;
  position: fixed;
  bottom: calc(15%);
  right: -105px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center; /* Centered content vertically */
  justify-content: center; /* Centered content horizontally */
  padding: 10px; /* Added padding for spacing */
  border-radius: 25px; /* Added border-radius for rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
}

.guidance-btn:hover {
  transform: translateX(-90px);
}

.guidance-image-container {
  margin-left: -25px;
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.guidance-image {
  width: 35px;
  aspect-ratio: 1;
  border-radius: 50%;
}

.guidance-text {
  font-size: 1.25rem;
  padding-top: 15px;
  margin-left: 10px; /* Added margin for spacing */
}

.is-guidance-visible {
  right: calc(25% + 19px - 80px);
}
</style>