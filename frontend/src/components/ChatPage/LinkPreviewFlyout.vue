<template>
  <aside :class="['preview-flyout', { 'is-open': isOpen }]" aria-label="Link preview panel">
    <div class="preview-shell">
      <header class="preview-header">
        <div class="preview-heading">
          <h2 class="preview-title">{{ activeEntryTitle }}</h2>
          <p v-if="activeEntry && activeEntry.sourceLabel" class="preview-subtitle">
            {{ activeEntry.sourceLabel }}
          </p>
        </div>
        <button
          class="preview-close"
          type="button"
          aria-label="Close preview panel"
          @click="$emit('close')"
        >
          ×
        </button>
      </header>

      <div class="preview-body">
        <section v-if="entries.length" class="preview-section">

          <section
            v-for="(entry, index) in entries"
            v-show="index === activeIndex"
            :key="`${entry.id || entry.url || index}-page`"
            class="preview-page"
            role="tabpanel"
          >

            <div
              v-if="entry.content"
              class="preview-card-content"
              v-html="entry.content"
            ></div>
            <div class="preview-page-actions">
              <a
                v-if="entry.url"
                class="preview-source-link"
                :href="entry.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open source
              </a>
            </div>
          </section>
        </section>

        <section v-else class="preview-section">
          <h3 class="preview-section-title">No preview selected</h3>
          <p class="preview-description">
            {{ description }}
          </p>
          <ul class="preview-list">
            <li v-for="item in items" :key="item">
              {{ item }}
            </li>
          </ul>
        </section>

        <section v-if="!entries.length" class="preview-section preview-note">
          <h3 class="preview-section-title">Current status</h3>
          <p>
            The subwindow is ready. In the next step, link clicks from the chat
            response can populate this panel with company or stock exchange
            summaries.
          </p>
        </section>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "LinkPreviewFlyout",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Reference preview",
    },
    subtitle: {
      type: String,
      default: "Waiting for a selected link",
    },
    description: {
      type: String,
      default:
        "When a user clicks a linked company or exchange name in the chat, its summary can appear here instead of opening a new browser tab.",
    },
    items: {
      type: Array,
      default: () => [],
    },
    entries: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  computed: {
    activeEntry() {
      if (!this.entries.length) {
        return null;
      }

      return this.entries[this.activeIndex] || this.entries[0];
    },
    activeEntryTitle() {
      return this.activeEntry?.title || this.title;
    },
  },
  watch: {
    entries: {
      immediate: true,
      handler(newEntries) {
        if (!Array.isArray(newEntries) || !newEntries.length) {
          this.activeIndex = 0;
          return;
        }

        if (this.activeIndex >= newEntries.length) {
          this.activeIndex = 0;
        }
      },
    },
  },
};
</script>

<style scoped>
.preview-flyout {
  width: 340px;
  min-width: 340px;
}

.preview-shell {
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 32%),
    linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(12px);
  color: var(--text-primary);
}

.preview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 22px 18px;
  border-bottom: 1px solid var(--border-color);
}

.preview-heading {
  min-width: 0;
}

.preview-kicker {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.35rem;
  line-height: 1.2;
}

.preview-subtitle {
  margin: 8px 0 0;
  color: rgba(100, 116, 139, 0.95);
  line-height: 1.45;
}

.preview-close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
  color: var(--text-primary);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 22px;
}

.preview-body::-webkit-scrollbar {
  width: 8px;
}

.preview-body::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.45);
}

.preview-description {
  margin: 0 0 20px;
  color: var(--text-primary);
  line-height: 1.65;
}

.preview-section {
  margin-bottom: 18px;
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background: rgba(148, 163, 184, 0.08);
}

.preview-section-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 0.98rem;
}

.preview-page-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.preview-page-tabs::-webkit-scrollbar {
  height: 6px;
}

.preview-page-tabs::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.7);
}

.preview-page-tab {
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.85);
  color: #1e293b;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.preview-page-tab.is-active {
  background: #2563eb;
  border-color: #2563eb;
  color: #f8fafc;
}

.preview-list {
  margin: 0;
  padding-left: 18px;
  color: var(--text-primary);
  line-height: 1.7;
}

.preview-note p {
  margin: 0;
  color: var(--text-primary);
  line-height: 1.65;
}

.preview-page {
  border-radius: 18px;
  background: transparent;
}

.preview-page-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.preview-source-link {
  color: #2563eb;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
}

.preview-card-content {
  color: var(--text-primary);
  line-height: 1.7;
}

.preview-card-content ::v-deep p {
  margin: 0 0 12px;
}

.preview-card-content ::v-deep p:last-child {
  margin-bottom: 0;
}

.preview-card-content ::v-deep .preview-card-section-title {
  margin: 18px 0 10px;
  color: var(--text-primary);
  font-size: 0.92rem;
}

.preview-card-content ::v-deep .preview-card-list {
  margin: 0;
  padding-left: 18px;
}

.preview-card-content ::v-deep .preview-card-list li {
  margin-bottom: 8px;
}

:global(:root.dark-mode) .preview-shell,
:global(body.dark-mode) .preview-shell {
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.38);
}

:global(:root.dark-mode) .preview-subtitle,
:global(body.dark-mode) .preview-subtitle,
:global(:root.dark-mode) .preview-description,
:global(body.dark-mode) .preview-description,
:global(:root.dark-mode) .preview-list,
:global(body.dark-mode) .preview-list,
:global(:root.dark-mode) .preview-note p,
:global(body.dark-mode) .preview-note p,
:global(:root.dark-mode) .preview-card-content,
:global(body.dark-mode) .preview-card-content {
  color: rgba(255, 255, 255, 0.86);
}

:global(:root.dark-mode) .preview-section,
:global(body.dark-mode) .preview-section {
  background: rgba(255, 255, 255, 0.03);
}

:global(:root.dark-mode) .preview-close,
:global(body.dark-mode) .preview-close {
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 1024px) {
  .preview-flyout {
    width: 320px;
    min-width: 320px;
  }
}

@media (max-width: 768px) {
  .preview-flyout {
    width: 100%;
    min-width: 100%;
  }

  .preview-shell {
    position: static;
    height: auto;
    min-height: 320px;
    margin-top: 12px;
  }
}
</style>