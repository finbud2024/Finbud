<template>
  <div>
    <div :class="['message-wrapper', { user: isUser, bot: !isUser }]">
      <img :src="avatarSrc" class="avatar" />
      <div class="message-content-wrapper">
        <!-- Displayed text -->
        <div
          v-if="mentorParts && !isUser"
          class="message-content finbud-mentor-bubble"
        >
          <div v-if="isThinking" class="thinking-animation">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <template v-else>
            <p v-if="mentorParts.insight" class="mentor-insight">
              {{ mentorParts.insight }}
            </p>
            <p v-if="mentorParts.explanation" class="mentor-explanation">
              {{ mentorParts.explanation }}
            </p>
            <p v-if="mentorParts.suggestion" class="mentor-suggestion">
              {{ mentorParts.suggestion }}
            </p>
            <div
              v-if="financeCard && financeCard.symbol"
              class="finance-mini-card"
              :aria-label="'Quote ' + financeCard.symbol"
            >
              <span class="finance-mini-card__sym">{{ financeCard.symbol }}</span>
              <span
                v-if="financeCard.trend"
                class="finance-mini-card__trend"
                :class="
                  financeCard.trendDir === 'down'
                    ? 'finance-mini-card__trend--down'
                    : 'finance-mini-card__trend--up'
                "
                >Trend: {{ financeCard.trend }}</span
              >
              <span
                v-if="financeCard.risk"
                class="finance-mini-card__risk"
                :class="
                  financeCard.riskLevel === 'high'
                    ? 'finance-mini-card__risk--high'
                    : ''
                "
                >Risk: {{ financeCard.risk }}</span
              >
            </div>
          </template>
        </div>
        <div
          v-else-if="htmlContent"
          :class="['message-content', { 'finbud-bot-bubble': !isUser }]"
          v-html="htmlContent"
        ></div>
        <div
          v-else-if="markdown"
          :class="[
            'message-content',
            'markdown-content',
            { 'finbud-bot-bubble': !isUser },
          ]"
          v-html="renderedMarkdown"
        ></div>
        <div
          v-else
          :class="[
            'message-content',
            { typing: typing, 'finbud-bot-bubble': !isUser },
          ]"
        >
          <div v-if="isThinking" class="thinking-animation">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <template v-else>
            <p v-html="displayedText"></p>
            <div
              v-if="!isUser && financeCard && financeCard.symbol && !mentorParts"
              class="finance-mini-card"
              :aria-label="'Quote ' + financeCard.symbol"
            >
              <span class="finance-mini-card__sym">{{ financeCard.symbol }}</span>
              <span
                v-if="financeCard.trend"
                class="finance-mini-card__trend"
                :class="
                  financeCard.trendDir === 'down'
                    ? 'finance-mini-card__trend--down'
                    : 'finance-mini-card__trend--up'
                "
                >Trend: {{ financeCard.trend }}</span
              >
              <span
                v-if="financeCard.risk"
                class="finance-mini-card__risk"
                :class="
                  financeCard.riskLevel === 'high'
                    ? 'finance-mini-card__risk--high'
                    : ''
                "
                >Risk: {{ financeCard.risk }}</span
              >
            </div>
          </template>
        </div>
        <!-- SLOTS FOR CUSTOM CONTENT (GAMES, ETC) -->
        <slot></slot>
        
        <!-- Finance Card (Transactions/Charts) -->
        <div v-if="financeCard" class="finance-summary-card animate-up">
          <div class="summary-header">
            <span class="summary-label">{{ financeCard.type === 'income' ? 'Income' : 'Expense' }} Recorded</span>
            <span class="summary-amount" :class="financeCard.type">
              {{ financeCard.type === 'income' ? '+' : '-' }}${{ financeCard.amount }}
            </span>
          </div>
          <div class="summary-desc">{{ financeCard.description }}</div>
          
          <div v-if="financeCard.chartData" class="summary-chart">
            <apexchart 
              type="donut" 
              height="200" 
              :options="financeCard.chartData.options" 
              :series="financeCard.chartData.series" 
            />
          </div>
        </div>
        
        <!-- Action Menu Grid -->
        <div v-if="isActionMenu && actions.length" class="action-menu-grid animate-up">
          <button
            v-for="(action, i) in actions"
            :key="i"
            class="menu-action-btn"
            @click="$emit('action-click', action.cmd)"
          >
            {{ action.label }}
          </button>
        </div>

        <!-- Inline Quiz Card -->
        <div v-if="isQuiz && quiz" class="quiz-card-inline animate-up">
          <div class="quiz-question-header">Quick Quiz: {{ quiz.topic || 'Finance' }}</div>
          <div class="quiz-question-text">{{ quiz.question }}</div>
          <div class="quiz-options-list">
            <button
              v-for="(opt, i) in quiz.options"
              :key="i"
              class="quiz-opt-btn"
              @click="$emit('quiz-click', { quiz, selected: i })"
            >
              <span class="opt-index">{{ String.fromCharCode(65 + i) }}</span>
              <span class="opt-text">{{ opt }}</span>
            </button>
          </div>
        </div>

        <!-- Confirmation Buttons (e.g., Stock analysis) -->
        <div v-if="isConfirm" class="confirm-actions-inline animate-up">
          <div class="confirm-query" v-if="text">Analyze this further?</div>
          <div class="confirm-btn-row">
            <button
              class="confirm-btn yes"
              @click="$emit('confirm-click', { action: confirmAction, result: true, params: confirmParams })"
            >
              Analyze now
            </button>
            <button
              class="confirm-btn no"
              @click="$emit('confirm-click', { action: confirmAction, result: false })"
            >
              Maybe later
            </button>
          </div>
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
        <div
          class="relevant-questions relevant-questions--chips"
          v-if="relevantQuestions && relevantQuestions.length > 0"
        >
          <ul>
            <li
              v-for="(question, i) in relevantQuestions"
              :key="i"
              @click="handleQuestionClick(question)"
            >
              {{ question }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchResult from "../components/ChatBot/SearchResult.vue";
import Video from "../components/ChatBot/Video.vue";
import { marked } from "marked"; // Import the marked library

export default {
  name: "MessageComponent",
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
      default: "",
    },
    typing: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    financeCard: {
      type: Object,
      default: null,
    },
    isActionMenu: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array,
      default: () => [],
    },
    isQuiz: {
      type: Boolean,
      default: false,
    },
    quiz: {
      type: Object,
      default: null,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    confirmAction: {
      type: String,
      default: "",
    },
    confirmParams: {
      type: Object,
      default: null,
    },
    avatarSrc: {
      type: String,
      default: "",
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
    htmlContent: {
      type: String,
      default: "",
    },
    mentorParts: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      textProgress: 0, // Initial progress of the typing animation
    };
  },
  computed: {
    displayedText() {
      let text = this.typing
        ? this.text.substring(0, this.textProgress)
        : this.text;

      // Always apply basic markdown formatting as a safety net
      // Process in specific order to avoid conflicts
      let processedText = text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text first
        .replace(/\*([^*\n]+?)\*/g, function (match, p1) {
          // Only replace single * if it's not part of ** and doesn't span lines
          if (match.includes("<strong>")) {
            return match; // Already processed
          }
          return `<em>${p1}</em>`;
        })
        .replace(/`(.*?)`/g, "<code>$1</code>"); // Inline code

      // Handle list items properly by wrapping them in ul tags
      let lines = processedText.split("\n");
      let result = [];
      let inList = false;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let isListItem = /^(\s*)[*-]\s+(.+)$/.test(line);

        if (isListItem) {
          if (!inList) {
            result.push('<ul style="margin: 0; padding-left: 20px;">');
            inList = true;
          }
          let listContent = line.replace(/^(\s*)[*-]\s+(.+)$/, "$2");
          result.push(`<li style="margin: 4px 0;">${listContent}</li>`);
        } else {
          if (inList) {
            result.push("</ul>");
            inList = false;
          }
          if (line.trim()) {
            result.push(line);
          }
          // Add line break for any line (including empty ones) except the last one
          if (i < lines.length - 1) {
            result.push("<br>");
          }
        }
      }

      if (inList) {
        result.push("</ul>");
      }

      return result.join("");
    },
    renderedMarkdown() {
      console.log("renderedMarkdown called with:", {
        markdown: this.markdown,
        text: this.text,
      });
      try {
        if (this.markdown && this.text) {
          // Configure marked options
          marked.setOptions({
            breaks: true, // Convert \n to <br>
            gfm: true, // GitHub flavored markdown
            headerIds: false, // Don't add ids to headers
            mangle: false, // Don't escape HTML
            sanitize: false, // Don't sanitize HTML
          });

          let processedText = this.text;

          // Apply basic markdown formatting as fallback
          processedText = processedText
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
            .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>") // Italic text (not preceded or followed by *)
            .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
            .replace(/\n/g, "<br>"); // Line breaks

          console.log("Manual processed text:", processedText);

          // Try to use marked for more complex markdown
          try {
            const markedResult = marked(this.text);
            console.log("Marked result:", markedResult);
            // If marked successfully processes the text and includes proper formatting, use it
            if (
              markedResult &&
              (markedResult.includes("<strong>") ||
                markedResult.includes("<em>") ||
                markedResult.includes("<h"))
            ) {
              console.log("Using marked result");
              return markedResult;
            }
          } catch (markedError) {
            console.warn(
              "Marked failed, using fallback formatting:",
              markedError
            );
          }

          // Return the manually processed text as fallback
          console.log("Using manual processed text");
          return processedText;
        }
        console.log("No markdown flag or text, returning original text");
        return this.text;
      } catch (error) {
        console.error("Error rendering markdown:", error);
        return this.text;
      }
    },
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
      this.$emit("question-click", question);
    },
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
  font-weight: 700;
  color: inherit; /* inherit text color from user/bot message */
}

:deep(.markdown-content em) {
  font-style: italic;
  color: inherit;
}

:deep(.markdown-content strong em),
:deep(.markdown-content em strong) {
  font-weight: 700;
  font-style: italic;
}

:deep(.markdown-content blockquote) {
  padding: 0 1em;
  border-left: 0.25em solid rgba(255, 255, 255, 0.3);
  margin: 8px 0;
  opacity: 0.9;
}

:deep(.markdown-content code) {
  font-family: "Courier New", Courier, monospace;
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

.user .message-content.markdown-content :deep(h1),
.user .message-content.markdown-content :deep(h2),
.user .message-content.markdown-content :deep(h3),
.user .message-content.markdown-content :deep(h4),
.user .message-content.markdown-content :deep(p),
.user .message-content.markdown-content :deep(li) {
  color: inherit;
}
.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 16px;
  overflow: hidden;
  word-wrap: break-word;
  padding: 0;
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
  min-width: 0;
  overflow: hidden;
  padding-right: calc(1% + 30px + 18px);
  box-sizing: border-box;
}

.user .message-content {
  position: relative;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg, 24px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background-color: var(--chat-user-bg-color, #d1fae5);
  color: var(--chat-user-text-color, #064e3b);
  box-shadow: var(--shadow-soft, 0 8px 24px rgba(148, 163, 184, 0.12));
}

.user .message-content:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
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

/* Mobile: wider messages like ChatGPT */
@media (max-width: 768px) {
  .bot .message-content-wrapper {
    padding-right: 8px;
  }
  .user .message-content-wrapper {
    max-width: 85%;
  }
  .bot .avatar,
  .user .avatar {
    width: 28px;
  }
  .message-wrapper {
    gap: 6px;
  }
}

.message-content {
  font-size: clamp(
    0.75rem,
    5.6vw,
    1rem
  ); /*12px, x/3.2 vw, 20px ___ 1vw = 3.2px*/
  font-family: "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  padding: 2%;
  border-radius: 16px;
  background-color: transparent;
  color: var(--text-primary);
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
  background-color: currentColor;
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
  0%,
  100% {
    opacity: 0.4;
    transform: translateY(0) scale(0.9);
  }
  50% {
    opacity: 1;
    transform: translateY(-4px) scale(1.1);
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
  background-color: var(--chat-user-bg-color, #f0f0f0);
  color: var(--chat-user-text-color, #000);
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
  background-color: var(--card-bg, #fff); /* Replaced hardcoded #fff */
  box-shadow: 0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
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
  background-color: var(--bg-primary, #fff); /* Fix background */
  box-shadow: 0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
  border-radius: 8px;
  padding: 20px;
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
  background-color: var(--bg-primary, rgb(248, 249, 254));
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
  background-color: #000000;
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
  background-color: #000000;
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

.message-wrapper:not(.user) .message-content {
  background: var(--chat-assistant-bg-color);
  color: var(--chat-assistant-text-color);
  box-shadow: none;
  border: none;
}

.message-wrapper.user .message-content {
  background: #f7f7f8;
  color: #202123;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.message-content p {
  margin: 0;
  line-height: 1.5;
  font-weight: 450;
}

.message-wrapper:not(.user) .message-content p {
  color: inherit;
}

.message-wrapper:not(.user) .message-content a {
  color: var(--chat-assistant-link-color);
  text-decoration: underline;
}

.message-wrapper:not(.user) .message-content code {
  background: var(--chat-assistant-code-bg-color);
  color: inherit;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

/* Better styling for standalone list items created by markdown processing */
.message-content ul {
  margin: 8px 0 !important;
  padding-left: 20px !important;
}

.message-content li {
  list-style-type: disc;
  margin: 4px 0 !important;
  padding-left: 0 !important;
  line-height: 1.5;
}

/* Reduce padding for markdown ul/ol as well */
:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  padding-left: 20px !important; /* Reduced from 2em (32px) */
  margin: 8px 0 !important;
}

.finbud-bot-bubble,
.finbud-mentor-bubble {
  background-color: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  padding: 10px 0 !important;
  font-family: inherit;
  font-size: 1.05rem;
  line-height: 1.7;
  color: #1E293B;
  border: none !important;
}

.finbud-bot-bubble:hover,
.finbud-mentor-bubble:hover {
  transform: none !important;
  box-shadow: none !important;
}

.mentor-insight {
  font-weight: 600;
  margin: 0 0 10px;
  color: #1a1d26;
}

.mentor-explanation {
  margin: 0 0 12px;
  color: #4a5166;
  font-weight: 400;
}

.mentor-suggestion {
  margin: 0;
  color: #5c6378;
  font-size: 0.9rem;
}

.finance-mini-card {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e8eaef;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
}

.finance-mini-card__sym {
  font-weight: 700;
  letter-spacing: 0.02em;
}

.finance-mini-card__trend {
  font-size: 0.875rem;
}

.finance-mini-card__trend--up {
  color: #15803d;
}

.finance-mini-card__trend--down {
  color: #c2410c;
}

.finance-mini-card__risk {
  font-size: 0.875rem;
  color: #64748b;
}

.finance-mini-card__risk--high {
  color: #ea580c;
  font-weight: 500;
}

/* New Finance Summary Card Styles */
.finance-summary-card {
  margin: 16px 0;
  padding: 16px;
  background: white;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-amount {
  font-size: 1.2rem;
  font-weight: 800;
}

.summary-amount.income { color: #10B981; }
.summary-amount.expense { color: #EF4444; }

.summary-desc {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 16px;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 100%;
  overflow: hidden;
}

.summary-chart {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  justify-content: center;
  max-width: 100%;
  min-height: 200px;
  overflow: hidden;
  box-sizing: border-box;
}

/* Responsive Data Table Styles */
.responsive-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  margin: 16px 0;
  -webkit-overflow-scrolling: touch;
}

.finbud-data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 0.9rem;
  min-width: 600px; /* Force minimum width to enable scrolling */
}

.finbud-data-table th {
  background: #F8FAFC;
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  color: #64748B;
  border-bottom: 2px solid #E2E8F0;
  white-space: nowrap;
}

.finbud-data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #F1F5F9;
  color: #1E293B;
  vertical-align: middle;
}

.finbud-data-table tr:hover {
  background: #F1F5F9;
}

.finbud-data-table img {
  vertical-align: middle;
  margin-right: 10px;
  border-radius: 50%;
}

.table-title {
  font-weight: 900;
  font-size: 1.25rem;
  color: #1E293B;
  margin-bottom: 12px;
}

/* Action Menu Styles */
.action-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.menu-action-btn {
  background: white;
  border: 1px solid #E2E8F0;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1E293B;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.menu-action-btn:hover {
  background: #F8FAFC;
  border-color: #3B82F6;
  color: #3B82F6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

/* Quiz Styles */
.quiz-card-inline {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
}

.quiz-question-header {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748B;
  font-weight: 700;
  margin-bottom: 8px;
}

.quiz-question-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 16px;
  line-height: 1.4;
}

.quiz-options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quiz-opt-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #E2E8F0;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quiz-opt-btn:hover {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.opt-index {
  background: #F1F5F9;
  color: #64748B;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
}

.quiz-opt-btn:hover .opt-index {
  background: #3B82F6;
  color: white;
}

/* Confirm Buttons */
.confirm-actions-inline {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confirm-query {
  font-weight: 600;
  color: #64748B;
  font-size: 0.95rem;
}

.confirm-btn-row {
  display: flex;
  gap: 12px;
}

.confirm-btn {
  padding: 10px 20px;
  border-radius: 99px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #E2E8F0;
}

.confirm-btn.yes {
  background: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

.confirm-btn.yes:hover {
  background: #2563EB;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.confirm-btn.no {
  background: white;
  color: #64748B;
}

.confirm-btn.no:hover {
  background: #F1F5F9;
}

.animate-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.relevant-questions--chips ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.relevant-questions--chips li {
  padding: 8px 14px;
  background: #eceef2;
  border-radius: 999px;
  margin: 0 !important;
  border: none !important;
  font-size: 0.8125rem;
  color: #3d4354;
}

.relevant-questions--chips li:hover {
  background: #e0e3ea;
  transform: none;
}
</style>
