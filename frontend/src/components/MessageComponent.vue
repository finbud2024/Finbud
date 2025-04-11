<template>
  <div>
    <div :class="['message-wrapper', { user: isUser, bot: !isUser }]">
      <img :src="avatarSrc" class="avatar" />
      <div class="message-content-wrapper">
          <!-- Displayed text -->
          <div v-if="htmlContent" class="message-content" v-html="htmlContent"></div>
          <div v-else-if="markdown" class="message-content markdown-content" v-html="renderedMarkdown"></div>
          <div v-else :class="['message-content', { 'typing': typing }]">
            <div v-if="isThinking" class="thinking-animation">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <p v-else>{{ displayedText }}</p>
          </div>
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
import marked from 'marked'; // Import the marked library

export default {
  name: 'MessageComponent',
  components: { SearchResult, Video },
  props: {
    isThinking: {
      type: Boolean,
      default: false,
    },
    isUser: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
    typing: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      default: '',
    },
    avatarSrc: {
      type: String,
      default: '',
    },
    htmlContent: {
      type: String,
      default: '',
    },
    sources: {
      type: Array,
      default: () => [],
    },
    videos: {
      type: Array,
      default: () => [],
    },
    relevantQuestions: {
      type: Array,
      default: () => [],
    },
    markdown: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      textProgress: 0, // Initial progress of the typing animation
    };
  },
  computed: {
    displayedText() {
      if(!this.typing) {
        return this.text;
      }
      // Return the substring of text based on the current typing progress
      return this.text.substring(0, this.textProgress);
    },
    renderedMarkdown() {
      try {
        if (this.markdown && this.text) {
          // Configure marked options
          marked.setOptions({
            breaks: true,     // Convert \n to <br>
            gfm: true,        // GitHub flavored markdown
            headerIds: false, // Don't add ids to headers
            mangle: false,    // Don't escape HTML
            sanitize: false   // Don't sanitize HTML
          });
          
          return marked(this.text);
        }
        return this.text;
      } catch (error) {
        console.error('Error rendering markdown:', error);
        return this.text;
      }
    }
  },
  watch: {
    typing(newValue) {
      if (newValue) {
        this.startTypingEffect();
      }
    },
    text() {
      if (this.typing) {
        this.startTypingEffect();
      }
    },
  },
  methods: {
    startTypingEffect() {
      // Reset the progress
      this.textProgress = 0;
      
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
    }
  },
  mounted() {
    if (this.typing) {
      this.startTypingEffect();
    }
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

/* Markdown styles - using ::v-deep for Vue 2 or :deep for Vue 3 */
:deep(.markdown-content h1), 
:deep(.markdown-content h2), 
:deep(.markdown-content h3), 
:deep(.markdown-content h4) {
  margin-top: 16px;
  margin-bottom: 8px;
  color: inherit;
  font-weight: bold;
}

:deep(.markdown-content h1) {
  font-size: 1.8em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.3em;
}

:deep(.markdown-content h2) {
  font-size: 1.5em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.3em;
}

:deep(.markdown-content h3) {
  font-size: 1.3em;
}

:deep(.markdown-content h4) {
  font-size: 1.1em;
}

:deep(.markdown-content ul), 
:deep(.markdown-content ol) {
  padding-left: 2em;
  margin: 8px 0;
}

:deep(.markdown-content li) {
  margin: 4px 0;
}

:deep(.markdown-content p) {
  margin: 8px 0;
}

:deep(.markdown-content strong) {
  font-weight: bold;
}

:deep(.markdown-content em) {
  font-style: italic;
}

:deep(.markdown-content blockquote) {
  padding: 0 1em;
  border-left: 0.25em solid rgba(255, 255, 255, 0.3);
  margin: 8px 0;
  opacity: 0.9;
}

:deep(.markdown-content code) {
  font-family: 'Courier New', Courier, monospace;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

:deep(.markdown-content pre) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
}

/* Make sure user messages with markdown have proper styling */
.user .message-content.markdown-content :deep(h1),
.user .message-content.markdown-content :deep(h2),
.user .message-content.markdown-content :deep(h3),
.user .message-content.markdown-content :deep(h4),
.user .message-content.markdown-content :deep(p),
.user .message-content.markdown-content :deep(li) {
  color: #000;
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
  font-size: clamp(
    0.75rem,
    5.6vw,
    1rem
  ); /*12px, x/3.2 vw, 20px ___ 1vw = 3.2px*/
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 16px;
  background-color: #007bff;
  color: #fff;
  border: 1px solid transparent;
  text-align: left;
  white-space: pre-wrap;
  line-height: 1.3;
}

/* Make sure markdown content also uses flex layout */
.markdown-content {
  display: block !important;
}

/* Override flex for paragraphs in markdown content */
.markdown-content > p {
  display: block;
}

/* thinking animation */
.thinking-animation {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.3;
}

.dot:nth-child(1) {
  animation: thinking 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: thinking 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: thinking 1s infinite 0.4s;
}

@keyframes thinking {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
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