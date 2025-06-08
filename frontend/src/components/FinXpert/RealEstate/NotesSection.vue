<template>
  <div class="notes-storage-container">
    <!-- Header -->
    <div class="section-header">
      <div class="header-left">
        <h2>
          <i class="fas fa-sticky-note"></i>
          Ghi Chú & Lưu Trữ Tài Liệu
        </h2>
        <p class="subtitle">Quản lý ghi chú và tài liệu cho từng bất động sản</p>
      </div>
      <div class="header-actions">
        <select v-model="selectedProperty" class="property-selector">
          <option value="">Chọn bất động sản</option>
          <option v-for="property in properties" :key="property.id" :value="property.id">
            {{ property.name }}
          </option>
        </select>
        <button @click="addNewProperty" class="add-property-btn">
          <i class="fas fa-plus"></i>
          Thêm BĐS
        </button>
      </div>
    </div>

    <!-- Property Tabs -->
    <div class="property-tabs" v-if="properties.length > 0">
      <button 
        v-for="property in properties" 
        :key="property.id"
        @click="selectProperty(property.id)"
        class="property-tab"
        :class="{ active: selectedProperty === property.id }"
      >
        <i class="fas fa-home"></i>
        {{ property.name }}
        <span class="note-count">{{ property.notes.length }}</span>
      </button>
    </div>

    <!-- Main Content -->
    <div class="main-content" v-if="currentProperty">
      <div class="content-grid">
        <!-- Notes Section -->
        <div class="notes-section">
          <div class="section-title">
            <h3>
              <i class="fas fa-edit"></i>
              Ghi chú
            </h3>
            <button @click="addNote" class="add-note-btn">
              <i class="fas fa-plus"></i>
              Thêm ghi chú
            </button>
          </div>

          <!-- Notes List -->
          <div class="notes-list">
            <div 
              v-for="note in currentProperty.notes" 
              :key="note.id"
              class="note-item"
              :class="{ editing: editingNote === note.id }"
            >
              <div class="note-header">
                <div class="note-meta">
                  <span class="note-category" :class="note.category">
                    <i :class="getCategoryIcon(note.category)"></i>
                    {{ getCategoryName(note.category) }}
                  </span>
                  <span class="note-date">{{ formatDate(note.createdAt) }}</span>
                </div>
                <div class="note-actions">
                  <button @click="togglePin(note)" class="pin-btn" :class="{ pinned: note.pinned }">
                    <i class="fas fa-thumbtack"></i>
                  </button>
                  <button @click="editNote(note)" class="edit-btn">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteNote(note.id)" class="delete-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div v-if="editingNote === note.id" class="note-editor">
                <input v-model="editForm.title" class="edit-title" placeholder="Tiêu đề..." />
                <textarea v-model="editForm.content" class="edit-content" placeholder="Nội dung..." rows="4"></textarea>
                <select v-model="editForm.category" class="edit-category">
                  <option value="general">Chung</option>
                  <option value="financial">Tài chính</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="legal">Pháp lý</option>
                  <option value="inspection">Kiểm tra</option>
                </select>
                <div class="edit-actions">
                  <button @click="saveNote" class="save-btn">Lưu</button>
                  <button @click="cancelEdit" class="cancel-btn">Hủy</button>
                </div>
              </div>
              
              <div v-else class="note-content">
                <h4 class="note-title">{{ note.title }}</h4>
                <p class="note-text">{{ note.content }}</p>
                <div class="note-tags" v-if="note.tags && note.tags.length">
                  <span v-for="tag in note.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="currentProperty.notes.length === 0" class="empty-state">
              <i class="fas fa-sticky-note"></i>
              <p>Chưa có ghi chú nào. Thêm ghi chú đầu tiên!</p>
            </div>
          </div>
        </div>

        <!-- Files Section -->
        <div class="files-section">
          <div class="section-title">
            <h3>
              <i class="fas fa-folder"></i>
              Tài liệu & File
            </h3>
            <div class="file-actions">
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileUpload" 
                multiple 
                style="display: none"
              />
              <button @click="$refs.fileInput.click()" class="upload-btn">
                <i class="fas fa-upload"></i>
                Tải lên
              </button>
            </div>
          </div>

          <!-- File Categories -->
          <div class="file-categories">
            <button 
              v-for="category in fileCategories" 
              :key="category.id"
              @click="selectedFileCategory = category.id"
              class="category-btn"
              :class="{ active: selectedFileCategory === category.id }"
            >
              <i :class="category.icon"></i>
              {{ category.name }}
              <span class="file-count">{{ getFileCount(category.id) }}</span>
            </button>
          </div>

          <!-- Files Grid -->
          <div class="files-grid">
            <div 
              v-for="file in filteredFiles" 
              :key="file.id"
              class="file-item"
              @click="viewFile(file)"
            >
              <div class="file-icon" :class="getFileType(file.name)">
                <i :class="getFileIcon(file.name)"></i>
              </div>
              <div class="file-info">
                <h5 class="file-name">{{ file.name }}</h5>
                <p class="file-meta">
                  {{ formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt) }}
                </p>
                <div class="file-category">
                  <span class="category-tag" :class="file.category">
                    {{ getCategoryName(file.category) }}
                  </span>
                </div>
              </div>
              <div class="file-actions">
                <button @click.stop="downloadFile(file)" class="download-btn">
                  <i class="fas fa-download"></i>
                </button>
                <button @click.stop="deleteFile(file.id)" class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div v-if="filteredFiles.length === 0" class="empty-files">
              <i class="fas fa-folder-open"></i>
              <p>Chưa có tài liệu nào trong danh mục này</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Thao tác nhanh</h3>
        <div class="action-buttons">
          <button @click="exportNotes" class="action-btn export">
            <i class="fas fa-file-export"></i>
            Xuất ghi chú
          </button>
          <button @click="createBackup" class="action-btn backup">
            <i class="fas fa-save"></i>
            Sao lưu dữ liệu
          </button>
          <button @click="shareProperty" class="action-btn share">
            <i class="fas fa-share-alt"></i>
            Chia sẻ
          </button>
          <button @click="generateReport" class="action-btn report">
            <i class="fas fa-chart-bar"></i>
            Báo cáo
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state-main">
      <div class="empty-content">
        <i class="fas fa-home"></i>
        <h3>Chưa có bất động sản nào</h3>
        <p>Thêm bất động sản đầu tiên để bắt đầu quản lý ghi chú và tài liệu</p>
        <button @click="addNewProperty" class="add-first-property">
          <i class="fas fa-plus"></i>
          Thêm bất động sản đầu tiên
        </button>
      </div>
    </div>

    <!-- File Viewer Modal -->
    <div v-if="viewingFile" class="file-viewer-modal" @click="closeFileViewer">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ viewingFile.name }}</h3>
          <button @click="closeFileViewer" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="file-preview">
            <div v-if="isImage(viewingFile.name)" class="image-preview">
              <img :src="viewingFile.url" :alt="viewingFile.name" />
            </div>
            <div v-else-if="isPDF(viewingFile.name)" class="pdf-preview">
              <embed :src="viewingFile.url" type="application/pdf" width="100%" height="500px" />
            </div>
            <div v-else class="file-info-preview">
              <div class="large-file-icon">
                <i :class="getFileIcon(viewingFile.name)"></i>
              </div>
              <h4>{{ viewingFile.name }}</h4>
              <p>{{ formatFileSize(viewingFile.size) }}</p>
              <button @click="downloadFile(viewingFile)" class="download-large-btn">
                <i class="fas fa-download"></i>
                Tải xuống
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotesSection',
  data() {
    return {
      selectedProperty: '',
      editingNote: null,
      selectedFileCategory: 'all',
      viewingFile: null,
      editForm: {
        title: '',
        content: '',
        category: 'general'
      },
      
      properties: [
        {
          id: 1,
          name: 'Căn hộ Vinhomes Central Park',
          notes: [
            {
              id: 1,
              title: 'Ghi chú về giá thuê',
              content: 'Giá thuê hiện tại là 35 triệu/tháng. Có thể tăng lên 38 triệu từ tháng 8.',
              category: 'financial',
              createdAt: new Date('2024-01-15'),
              pinned: true,
              tags: ['giá thuê', 'tài chính']
            },
            {
              id: 2,
              title: 'Bảo trì điều khoà',
              content: 'Cần vệ sinh và bảo trì điều hòa vào cuối tháng 3. Liên hệ thầy Nam: 0901234567.',
              category: 'maintenance',
              createdAt: new Date('2024-01-20'),
              pinned: false,
              tags: ['bảo trì', 'điều hòa']
            }
          ],
          files: [
            {
              id: 1,
              name: 'hop-dong-thue.pdf',
              size: 2458000,
              category: 'legal',
              uploadedAt: new Date('2024-01-10'),
              url: '#'
            },
            {
              id: 2,
              name: 'hinh-anh-can-ho.jpg',
              size: 1024000,
              category: 'photos',
              uploadedAt: new Date('2024-01-12'),
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
            }
          ]
        },
        {
          id: 2,
          name: 'Nhà phố Thảo Điền',
          notes: [
            {
              id: 3,
              title: 'Thông tin khách thuê',
              content: 'Khách thuê mới: Anh Minh - 0987654321. Hợp đồng 2 năm từ 15/2/2024.',
              category: 'general',
              createdAt: new Date('2024-02-01'),
              pinned: false,
              tags: ['khách thuê', 'hợp đồng']
            }
          ],
          files: []
        }
      ],
      
      fileCategories: [
        { id: 'all', name: 'Tất cả', icon: 'fas fa-folder' },
        { id: 'legal', name: 'Pháp lý', icon: 'fas fa-gavel' },
        { id: 'financial', name: 'Tài chính', icon: 'fas fa-dollar-sign' },
        { id: 'photos', name: 'Hình ảnh', icon: 'fas fa-camera' },
        { id: 'maintenance', name: 'Bảo trì', icon: 'fas fa-tools' },
        { id: 'inspection', name: 'Kiểm tra', icon: 'fas fa-search' }
      ]
    }
  },
  
  computed: {
    currentProperty() {
      return this.properties.find(p => p.id === this.selectedProperty)
    },
    
    filteredFiles() {
      if (!this.currentProperty) return []
      
      const files = this.currentProperty.files || []
      if (this.selectedFileCategory === 'all') {
        return files
      }
      return files.filter(file => file.category === this.selectedFileCategory)
    }
  },
  
  mounted() {
    if (this.properties.length > 0) {
      this.selectedProperty = this.properties[0].id
    }
  },
  
  methods: {
    selectProperty(propertyId) {
      this.selectedProperty = propertyId
      this.editingNote = null
    },
    
    addNote() {
      if (!this.currentProperty) return
      
      const newNote = {
        id: Date.now(),
        title: 'Ghi chú mới',
        content: '',
        category: 'general',
        createdAt: new Date(),
        pinned: false,
        tags: []
      }
      
      this.currentProperty.notes.unshift(newNote)
      this.editNote(newNote)
    },
    
    editNote(note) {
      this.editingNote = note.id
      this.editForm = {
        title: note.title,
        content: note.content,
        category: note.category
      }
    },
    
    saveNote() {
      const note = this.currentProperty.notes.find(n => n.id === this.editingNote)
      if (note) {
        note.title = this.editForm.title
        note.content = this.editForm.content
        note.category = this.editForm.category
        note.updatedAt = new Date()
      }
      this.cancelEdit()
    },
    
    cancelEdit() {
      this.editingNote = null
      this.editForm = { title: '', content: '', category: 'general' }
    },
    
    deleteNote(noteId) {
      if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
        const index = this.currentProperty.notes.findIndex(n => n.id === noteId)
        if (index > -1) {
          this.currentProperty.notes.splice(index, 1)
        }
      }
    },
    
    togglePin(note) {
      note.pinned = !note.pinned
      // Sort notes to show pinned ones first
      this.currentProperty.notes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },
    
    handleFileUpload(event) {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          category: this.detectFileCategory(file.name),
          uploadedAt: new Date(),
          url: URL.createObjectURL(file)
        }
        
        if (!this.currentProperty.files) {
          this.currentProperty.files = []
        }
        this.currentProperty.files.push(newFile)
      })
      
      // Reset input
      event.target.value = ''
    },
    
    detectFileCategory(filename) {
      const ext = filename.toLowerCase().split('.').pop()
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'photos'
      if (['pdf'].includes(ext)) return 'legal'
      if (['xls', 'xlsx', 'csv'].includes(ext)) return 'financial'
      return 'general'
    },
    
    viewFile(file) {
      this.viewingFile = file
    },
    
    closeFileViewer() {
      this.viewingFile = null
    },
    
    downloadFile(file) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    },
    
    deleteFile(fileId) {
      if (confirm('Bạn có chắc muốn xóa file này?')) {
        const index = this.currentProperty.files.findIndex(f => f.id === fileId)
        if (index > -1) {
          this.currentProperty.files.splice(index, 1)
        }
      }
    },
    
    addNewProperty() {
      const name = prompt('Nhập tên bất động sản:')
      if (name) {
        const newProperty = {
          id: Date.now(),
          name: name,
          notes: [],
          files: []
        }
        this.properties.push(newProperty)
        this.selectedProperty = newProperty.id
      }
    },
    
    getFileCount(categoryId) {
      if (!this.currentProperty) return 0
      const files = this.currentProperty.files || []
      if (categoryId === 'all') return files.length
      return files.filter(f => f.category === categoryId).length
    },
    
    getCategoryIcon(category) {
      const icons = {
        general: 'fas fa-sticky-note',
        financial: 'fas fa-dollar-sign',
        maintenance: 'fas fa-tools',
        legal: 'fas fa-gavel',
        inspection: 'fas fa-search'
      }
      return icons[category] || 'fas fa-sticky-note'
    },
    
    getCategoryName(category) {
      const names = {
        general: 'Chung',
        financial: 'Tài chính',
        maintenance: 'Bảo trì',
        legal: 'Pháp lý',
        inspection: 'Kiểm tra',
        photos: 'Hình ảnh'
      }
      return names[category] || 'Chung'
    },
    
    getFileType(filename) {
      const ext = filename.toLowerCase().split('.').pop()
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image'
      if (['pdf'].includes(ext)) return 'pdf'
      if (['doc', 'docx'].includes(ext)) return 'word'
      if (['xls', 'xlsx'].includes(ext)) return 'excel'
      return 'file'
    },
    
    getFileIcon(filename) {
      const ext = filename.toLowerCase().split('.').pop()
      const icons = {
        pdf: 'fas fa-file-pdf',
        doc: 'fas fa-file-word',
        docx: 'fas fa-file-word',
        xls: 'fas fa-file-excel',
        xlsx: 'fas fa-file-excel',
        jpg: 'fas fa-file-image',
        jpeg: 'fas fa-file-image',
        png: 'fas fa-file-image',
        gif: 'fas fa-file-image'
      }
      return icons[ext] || 'fas fa-file'
    },
    
    isImage(filename) {
      const ext = filename.toLowerCase().split('.').pop()
      return ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
    },
    
    isPDF(filename) {
      return filename.toLowerCase().endsWith('.pdf')
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(date))
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    exportNotes() {
      console.log('Exporting notes...')
    },
    
    createBackup() {
      console.log('Creating backup...')
    },
    
    shareProperty() {
      console.log('Sharing property...')
    },
    
    generateReport() {
      console.log('Generating report...')
    }
  }
}
</script>

<style scoped>
.notes-storage-container {
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-left h2 i {
  color: #2563eb;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.property-selector {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  min-width: 200px;
}

.add-property-btn {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.add-property-btn:hover {
  background: #1d4ed8;
}

.property-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.property-tab {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.property-tab:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.property-tab.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.note-count {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.property-tab.active .note-count {
  background: rgba(255,255,255,0.3);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.notes-section, .files-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title h3 i {
  color: #2563eb;
}

.add-note-btn, .upload-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-note-btn:hover, .upload-btn:hover {
  background: #e5e7eb;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.note-item:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.note-item.editing {
  border-color: #2563eb;
  background: #eff6ff;
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
  gap: 1rem;
}

.note-category {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.note-category.general {
  background: #f3f4f6;
  color: #374151;
}

.note-category.financial {
  background: #fef3c7;
  color: #d97706;
}

.note-category.maintenance {
  background: #fecaca;
  color: #dc2626;
}

.note-category.legal {
  background: #e0e7ff;
  color: #3730a3;
}

.note-category.inspection {
  background: #dcfce7;
  color: #166534;
}

.note-date {
  color: #6b7280;
  font-size: 0.8rem;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}

.pin-btn, .edit-btn, .delete-btn {
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.3s ease;
}

.pin-btn:hover, .edit-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.pin-btn.pinned {
  color: #d97706;
  background: #fef3c7;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.note-editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-title, .edit-content, .edit-category {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
}

.edit-title {
  font-weight: 600;
}

.edit-content {
  resize: vertical;
  font-family: inherit;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.save-btn, .cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-btn {
  background: #2563eb;
  color: white;
}

.save-btn:hover {
  background: #1d4ed8;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.note-content {
  margin-top: 0.75rem;
}

.note-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.note-text {
  margin: 0 0 0.75rem 0;
  color: #374151;
  line-height: 1.5;
}

.note-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.5rem;
  background: #e5e7eb;
  color: #374151;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.file-categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.category-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.file-count {
  background: rgba(107, 114, 128, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-btn.active .file-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.file-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-item:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.file-icon.image {
  background: #fef3c7;
  color: #d97706;
}

.file-icon.pdf {
  background: #fee2e2;
  color: #dc2626;
}

.file-icon.word {
  background: #dbeafe;
  color: #2563eb;
}

.file-icon.excel {
  background: #dcfce7;
  color: #059669;
}

.file-icon.file {
  background: #f3f4f6;
  color: #6b7280;
}

.file-info {
  flex: 1;
}

.file-name {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
}

.file-meta {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.8rem;
}

.category-tag {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-tag.legal {
  background: #e0e7ff;
  color: #3730a3;
}

.category-tag.photos {
  background: #fef3c7;
  color: #d97706;
}

.category-tag.financial {
  background: #dcfce7;
  color: #059669;
}

.file-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.download-btn, .delete-btn {
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.empty-state, .empty-files {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state i, .empty-files i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.empty-state-main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-content i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-content h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-content p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.add-first-property {
  padding: 1rem 2rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.add-first-property:hover {
  background: #1d4ed8;
}

.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.quick-actions h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.action-btn i {
  font-size: 1.1rem;
}

/* File Viewer Modal */
.file-viewer-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  color: #6b7280;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 2rem;
}

.image-preview img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.file-info-preview {
  text-align: center;
  padding: 2rem;
}

.large-file-icon {
  font-size: 4rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.download-large-btn {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto 0;
  transition: all 0.3s ease;
}

.download-large-btn:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .files-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .notes-storage-container {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .property-tabs {
    flex-wrap: wrap;
  }
  
  .notes-section, .files-section {
    padding: 1.5rem;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .file-categories {
    justify-content: center;
  }
  
  .modal-content {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
  }
}
</style> 