<template>
  <div class="research-notes">
    <div class="notes-header">
      <div class="header-left">
        <h3>Research Notes</h3>
        <p v-if="ticker">{{ ticker }} Analysis Notes</p>
      </div>
      <div class="header-actions">
        <button class="add-note-btn" @click="addNewNote">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Add Note
        </button>
        <button class="generate-report-btn" @click="$emit('generate-report')">
          <font-awesome-icon icon="fa-solid fa-file-alt" />
          Generate Report
        </button>
      </div>
    </div>

    <!-- Notes List -->
    <div class="notes-container">
      <div v-if="notes.length === 0" class="empty-state">
        <div class="empty-icon">
          <font-awesome-icon icon="fa-solid fa-sticky-note" />
        </div>
        <h4>No research notes yet</h4>
        <p>Start documenting your analysis by adding your first note.</p>
        <button class="add-first-note-btn" @click="addNewNote">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Add Your First Note
        </button>
      </div>

      <div v-else class="notes-list">
        <div 
          v-for="note in notes" 
          :key="note.id" 
          class="note-card"
          :class="{ 'editing': note.id === editingNoteId }"
        >
          <div class="note-header">
            <div class="note-meta">
              <span class="note-category" :class="note.category">{{ note.category }}</span>
              <span class="note-date">{{ formatDate(note.createdAt) }}</span>
            </div>
            <div class="note-actions">
              <button 
                class="edit-btn" 
                @click="editNote(note.id)"
                v-if="note.id !== editingNoteId"
              >
                <font-awesome-icon icon="fa-solid fa-edit" />
              </button>
              <button 
                class="save-btn" 
                @click="saveNote(note.id)"
                v-if="note.id === editingNoteId"
              >
                <font-awesome-icon icon="fa-solid fa-check" />
              </button>
              <button 
                class="cancel-btn" 
                @click="cancelEdit"
                v-if="note.id === editingNoteId"
              >
                <font-awesome-icon icon="fa-solid fa-times" />
              </button>
              <button class="delete-btn" @click="deleteNote(note.id)">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </button>
            </div>
          </div>
          
          <div class="note-content">
            <input 
              v-if="note.id === editingNoteId"
              v-model="editingTitle"
              class="note-title-input"
              placeholder="Note title..."
            />
            <h4 v-else class="note-title">{{ note.title }}</h4>
            
            <textarea 
              v-if="note.id === editingNoteId"
              v-model="editingContent"
              class="note-content-input"
              placeholder="Write your analysis notes here..."
              rows="4"
            ></textarea>
            <p v-else class="note-text">{{ note.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Analysis Tools -->
    <div class="analysis-tools">
      <h4>Quick Analysis Tools</h4>
      <div class="tools-grid">
        <button class="tool-btn" @click="addTemplateNote('bullish')">
          <font-awesome-icon icon="fa-solid fa-arrow-up" />
          Bullish Points
        </button>
        <button class="tool-btn" @click="addTemplateNote('bearish')">
          <font-awesome-icon icon="fa-solid fa-arrow-down" />
          Bearish Points
        </button>
        <button class="tool-btn" @click="addTemplateNote('risks')">
          <font-awesome-icon icon="fa-solid fa-exclamation-triangle" />
          Risk Factors
        </button>
        <button class="tool-btn" @click="addTemplateNote('catalysts')">
          <font-awesome-icon icon="fa-solid fa-rocket" />
          Catalysts
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faPlus, faFileAlt, faStickyNote, faEdit, faCheck, 
  faTimes, faTrash, faArrowUp, faArrowDown, 
  faExclamationTriangle, faRocket 
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faPlus, faFileAlt, faStickyNote, faEdit, faCheck, 
  faTimes, faTrash, faArrowUp, faArrowDown, 
  faExclamationTriangle, faRocket
);

export default {
  name: 'ResearchNotes',
  components: { FontAwesomeIcon },
  props: {
    ticker: {
      type: String,
      default: 'AAPL'
    }
  },
  emits: ['generate-report'],
  data() {
    return {
      notes: [],
      editingNoteId: null,
      editingTitle: '',
      editingContent: '',
      nextId: 1
    };
  },
  methods: {
    addNewNote() {
      const newNote = {
        id: this.nextId++,
        title: '',
        content: '',
        category: 'general',
        createdAt: new Date(),
        ticker: this.ticker
      };
      
      this.notes.unshift(newNote);
      this.editNote(newNote.id);
    },

    addTemplateNote(type) {
      const templates = {
        bullish: {
          title: 'Bullish Investment Thesis',
          content: '• Strong fundamentals\n• Market leadership position\n• Growth opportunities\n• Competitive advantages',
          category: 'bullish'
        },
        bearish: {
          title: 'Bearish Concerns',
          content: '• Market headwinds\n• Competitive threats\n• Regulatory risks\n• Valuation concerns',
          category: 'bearish'
        },
        risks: {
          title: 'Risk Assessment',
          content: '• Market risks\n• Company-specific risks\n• Industry risks\n• Regulatory risks',
          category: 'risk'
        },
        catalysts: {
          title: 'Potential Catalysts',
          content: '• Upcoming earnings\n• Product launches\n• Market expansion\n• Strategic initiatives',
          category: 'catalyst'
        }
      };

      const template = templates[type];
      const newNote = {
        id: this.nextId++,
        title: template.title,
        content: template.content,
        category: template.category,
        createdAt: new Date(),
        ticker: this.ticker
      };
      
      this.notes.unshift(newNote);
      this.saveNotesToStorage();
    },

    editNote(noteId) {
      const note = this.notes.find(n => n.id === noteId);
      if (note) {
        this.editingNoteId = noteId;
        this.editingTitle = note.title;
        this.editingContent = note.content;
      }
    },

    saveNote(noteId) {
      const note = this.notes.find(n => n.id === noteId);
      if (note) {
        note.title = this.editingTitle || 'Untitled Note';
        note.content = this.editingContent;
        note.updatedAt = new Date();
      }
      this.cancelEdit();
      this.saveNotesToStorage();
    },

    cancelEdit() {
      // If it's a new note with no content, remove it
      if (this.editingNoteId && !this.editingTitle && !this.editingContent) {
        this.deleteNote(this.editingNoteId);
      }
      
      this.editingNoteId = null;
      this.editingTitle = '';
      this.editingContent = '';
    },

    deleteNote(noteId) {
      this.notes = this.notes.filter(n => n.id !== noteId);
      if (this.editingNoteId === noteId) {
        this.cancelEdit();
      }
      this.saveNotesToStorage();
    },

    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },

    saveNotesToStorage() {
      const storageKey = `research_notes_${this.ticker}`;
      localStorage.setItem(storageKey, JSON.stringify(this.notes));
    },

    loadNotesFromStorage() {
      const storageKey = `research_notes_${this.ticker}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsedNotes = JSON.parse(saved);
          this.notes = parsedNotes.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: note.updatedAt ? new Date(note.updatedAt) : null
          }));
          this.nextId = Math.max(...this.notes.map(n => n.id), 0) + 1;
        } catch (error) {
          console.error('Error loading notes:', error);
        }
      }
    }
  },
  watch: {
    ticker: {
      handler() {
        this.loadNotesFromStorage();
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.research-notes {
  background: white;
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.header-left h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.header-left p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.add-note-btn, .generate-report-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.add-note-btn {
  background: #3b82f6;
  color: white;
}
.add-note-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.generate-report-btn {
  background: #10b981;
  color: white;
}
.generate-report-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.notes-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h4 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.add-first-note-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}
.add-first-note-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-card {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.note-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.note-card.editing {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.note-category {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.note-category.general { background: #e5e7eb; color: #374151; }
.note-category.bullish { background: #d1fae5; color: #065f46; }
.note-category.bearish { background: #fee2e2; color: #991b1b; }
.note-category.risk { background: #fef3c7; color: #92400e; }
.note-category.catalyst { background: #ddd6fe; color: #5b21b6; }

.note-date {
  color: #6b7280;
  font-size: 0.8rem;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .save-btn, .cancel-btn, .delete-btn {
  background: none;
  border: none;
  padding: 0.375rem;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.edit-btn:hover { background: #f3f4f6; color: #3b82f6; }
.save-btn:hover { background: #f3f4f6; color: #10b981; }
.cancel-btn:hover { background: #f3f4f6; color: #6b7280; }
.delete-btn:hover { background: #f3f4f6; color: #ef4444; }

.note-content {
  margin-top: 0.75rem;
}

.note-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.note-title-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.note-text {
  margin: 0;
  color: #374151;
  line-height: 1.5;
  white-space: pre-wrap;
}

.note-content-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
}

.analysis-tools {
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.analysis-tools h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.tool-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  color: #374151;
}

.tool-btn:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
  color: #3b82f6;
  transform: translateY(-1px);
}

/* Dark mode styles */
.dark-mode .research-notes {
  background: #1f2937;
  border-color: #374151;
}

.dark-mode .notes-header {
  background: #111827;
  border-bottom-color: #374151;
}

.dark-mode .header-left h3 {
  color: #f8f9fa;
}

.dark-mode .header-left p {
  color: #9ca3af;
}

.dark-mode .note-card {
  background: #374151;
  border-color: #4b5563;
}

.dark-mode .note-card:hover {
  border-color: #6b7280;
}

.dark-mode .note-title {
  color: #f8f9fa;
}

.dark-mode .note-text {
  color: #e5e7eb;
}

.dark-mode .note-title-input,
.dark-mode .note-content-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #f8f9fa;
}

.dark-mode .analysis-tools {
  background: #111827;
  border-top-color: #374151;
}

.dark-mode .analysis-tools h4 {
  color: #f8f9fa;
}

.dark-mode .tool-btn {
  background: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

.dark-mode .tool-btn:hover {
  border-color: #60a5fa;
  background: #1e3a8a;
  color: #60a5fa;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .notes-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .add-note-btn, .generate-report-btn {
    flex: 1;
    justify-content: center;
  }
  
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .note-actions {
    flex-wrap: wrap;
  }
}
</style> 