<template>
  <div class="deep-research-result">
    <!-- TradingView chart -->
    <TradingViewWidget
      v-if="chartSymbol"
      :symbol="chartSymbol"
      class="tv-widget"
    />

    <!-- Markdown report body -->
    <section
      v-if="report"
      class="report-body markdown-content"
      v-html="renderedMarkdown"
    />

    <!-- Sources list (optional) -->
    <!--
    <section v-if="sources && sources.length" class="sources-section">
      <SearchResult :sources="sources" />
    </section>

    <section v-if="videos && videos.length" class="videos-section">
      <Video :videos="videos" />
    </section>
    -->

    <!-- Follow-up questions -->
    <section
      v-if="relevantQuestions && relevantQuestions.length"
      class="relevant-questions"
    >
      <h3>Suggested Question</h3>
      <ul>
        <li
          v-for="(question, i) in relevantQuestions"
          :key="i"
          @click="emitQuestion(question)"
        >
          {{ question }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import TradingViewWidget from "../TradingViewWidget.vue";
import SearchResult from "../ChatBot/SearchResult.vue";
import Video from "../ChatBot/Video.vue";
import { marked } from "marked";
import { symbol } from "zod";

export default {
  name: "DeepResearchResult",
  components: {
    TradingViewWidget,
    SearchResult,
    Video,
  },
  props: {
    report: {
      type: String,
      default: "",
    },
    symbol: {
      type: [String, Array],
      default: "",
    },
    ticker: {
      type: [String, Array],
      default: "",
    },
    relevantQuestions: {
      type: Array,
      default: () => [],
    },
    // sources: {
    //   type: Array,
    //   default: () => [],
    // },
    // videos: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  computed: {
    renderedMarkdown() {
      try {
        marked.setOptions({
          breaks: true,
          gfm: true,
          headerIds: false,
          mangle: false,
          sanitize: false,
        });
        return marked(this.report || "");
      } catch (err) {
        console.error("Markdown render error:", err);
        return this.report;
      }
    },
    chartSymbol() {
      const toStr = (val) => Array.isArray(val) ? (val.length ? val[0] : '') : val;
      return toStr(this.symbol) || toStr(this.ticker) || "";
    },
  },
  methods: {
    emitQuestion(question) {
      this.$emit('question-click', question);
    },
  },
};
</script>

<style scoped>
.deep-research-result {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.tv-widget {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.report-body {
  padding: 10px;
  background: var(--card-bg, #f9f9f9);
  border-radius: 8px;
  line-height: 1.5;
}

.sources-section,
.videos-section {
  width: 100%;
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
</style> 