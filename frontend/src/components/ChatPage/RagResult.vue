<template>
  <div class="rag-result">
    <!-- Loading/Status Section -->
    <div v-if="status === 'loading'" class="rag-status">
      <div class="status-icon">
        <div class="loading-spinner"></div>
      </div>
      <div class="status-text">
        <span>Retrieving relevant information...</span>
      </div>
    </div>

    <!-- Error Section -->
    <div v-else-if="status === 'error'" class="rag-error">
      <div class="status-icon">
        <div class="error-icon">✕</div>
      </div>
      <div class="error-message">
        <span>{{ errorMessage || 'No relevant information found' }}</span>
      </div>
    </div>

    <!-- Success Section with Markdown Answer -->
    <div v-else-if="status === 'success'" class="rag-content">
      <div class="answer-content markdown-content" v-html="renderedMarkdown" @click="handleSourcePillClick"></div>
      
      <!-- Source Links Section -->
      <div v-if="sourceLinks.length > 0" class="source-links">
        <h4>Sources:</h4>
        <div class="source-list">
          <a 
            v-for="(link, index) in sourceLinks" 
            :key="index"
            :href="link.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="source-link"
          >
            <span class="source-number">[{{ index + 1 }}]</span>
            <span class="source-domain">{{ getDomainFromUrl(link.url) }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";

export default {
  name: 'RagResult',
  props: {
    status: {
      type: String,
      required: true,
      validator: value => ['loading', 'success', 'error'].includes(value)
    },
    formattedAnswer: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sourceLinks: []
    }
  },
  computed: {
    renderedMarkdown() {
      try {
        // Configure marked options
        marked.setOptions({
          breaks: true,
          gfm: true,
          headerIds: false,
          mangle: false,
          sanitize: false,
        });

        // Process the markdown and extract source pills
        const processedMarkdown = this.processMarkdownWithSourcePills(this.formattedAnswer);
        return marked(processedMarkdown || "");
      } catch (err) {
        console.error("Markdown render error:", err);
        return this.formattedAnswer;
      }
    }
  },
  watch: {
    formattedAnswer: {
      immediate: true,
      handler(newAnswer) {
        if (newAnswer) {
          this.extractSourceLinks();
        }
      }
    }
  },
  methods: {
    processMarkdownWithSourcePills(markdown) {
      if (!markdown) return '';
      
      // Extract footnotes from markdown
      const footnotes = {};
      const footnoteRegex = /\[\^(\d+)\]:\s*(https?:\/\/[^\s]+)/g;
      
      let match;
      while ((match = footnoteRegex.exec(markdown)) !== null) {
        footnotes[match[1]] = match[2];
      }

      // Replace inline citations with source pills
      let processedMarkdown = markdown.replace(/\[\^(\d+)\]/g, (_, id) => {
        const url = footnotes[id];
        if (!url) return `[^${id}]`; // fallback
        
        return `<span class="source-pill" data-source-id="${id}" data-url="${url}" title="Click to view source">${this.getDomainFromUrl(url)}</span>`;
      });

      // Remove footnote definitions so they don't render at bottom
      processedMarkdown = processedMarkdown.replace(
        /\[\^\d+\]:\s*https?:\/\/[^\s]+\s*/g,
        ""
      );

      return processedMarkdown;
    },
    extractSourceLinks() {
      // Extract source links from the markdown content
      const footnotes = {};
      const footnoteRegex = /\[\^(\d+)\]:\s*(https?:\/\/[^\s]+)/g;
      
      let match;
      while ((match = footnoteRegex.exec(this.formattedAnswer)) !== null) {
        footnotes[match[1]] = match[2];
      }

      // Convert to source links array
      this.sourceLinks = Object.entries(footnotes).map(([id, url]) => ({
        url: url,
        id: id
      }));
    },
    getDomainFromUrl(url) {
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        return domain;
      } catch {
        return url;
      }
    },
    handleSourcePillClick(event) {
      const target = event.target;
      if (target.classList.contains('source-pill')) {
        const url = target.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank');
        }
      }
    }
  }
}
</script>

<style scoped>
.rag-result {
  padding: 16px;
  margin: 8px 0;
  border-radius: 12px;
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e1e5e9);
  transition: all 0.3s ease;
}

/* Status Styles */
.rag-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: var(--primary-light, #f0f8ff);
  border-radius: 8px;
}

.status-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-icon {
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
}

.status-text {
  font-size: 14px;
  color: var(--text-secondary, #666);
}

/* Error Styles */
.rag-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: var(--error-light, #fdf2f2);
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
}

.error-message {
  font-size: 14px;
  color: var(--error-text, #e74c3c);
}

/* Content Styles */
.rag-content {
  line-height: 1.6;
}

.answer-content {
  margin-bottom: 16px;
}

.answer-content :deep(h1),
.answer-content :deep(h2),
.answer-content :deep(h3),
.answer-content :deep(h4),
.answer-content :deep(h5),
.answer-content :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: var(--text-primary, #333);
  font-weight: 600;
}

.answer-content :deep(p) {
  margin-bottom: 1em;
  color: var(--text-primary, #333);
}

.answer-content :deep(ul),
.answer-content :deep(ol) {
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.answer-content :deep(li) {
  margin-bottom: 0.5em;
}

.answer-content :deep(code) {
  background-color: var(--code-bg, #f4f4f4);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.answer-content :deep(pre) {
  background-color: var(--code-bg, #f4f4f4);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

.answer-content :deep(blockquote) {
  border-left: 4px solid var(--primary-color, #3498db);
  padding-left: 16px;
  margin: 1em 0;
  font-style: italic;
  color: var(--text-secondary, #666);
}

.answer-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.answer-content :deep(th),
.answer-content :deep(td) {
  border: 1px solid var(--border-color, #e1e5e9);
  padding: 8px 12px;
  text-align: left;
}

.answer-content :deep(th) {
  background-color: var(--table-header-bg, #f8f9fa);
  font-weight: 600;
}

/* Source Pill Styles */
.answer-content :deep(.source-pill) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--source-pill-color);
  color: var(--black-in-light-mode);
  font-size: 0.7em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
  vertical-align: baseline;
  margin-left: 2px;
  margin-right: 1px;
  height: 14px;
  min-width: 14px;
  border: transparent;
  border-radius: 6px;
  padding: 0 3px;
}

.answer-content :deep(.source-pill:hover) {
  background-color: var(--black-in-light-mode);
  color: var(--white-in-light-mode);
  transform: translateY(-1px);
  box-shadow: 0 1px 3px rgba(52, 152, 219, 0.3);
}

.answer-content :deep(.source-pill::after) {
  display: none;
}

/* Source Links Section */
.source-links {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color, #e1e5e9);
}

.source-links h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, #666);
}

.source-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.source-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-primary, #333);
  font-size: 13px;
  transition: all 0.2s ease;
}

.source-link:hover {
  background-color: var(--secondary-bg, #f8f9fa);
  color: var(--primary-color, #3498db);
}

.source-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85em;
  font-weight: 500;
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
}

.source-domain {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .rag-result {
    padding: 12px;
  }
  
  .source-list {
    flex-direction: column;
  }
  
  .source-link {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
