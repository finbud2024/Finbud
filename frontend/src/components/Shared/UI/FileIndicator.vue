<template>
  <div class="file-indicator-wrapper">
    <div class="file-indicator">
      <!-- Show image preview if file is an image -->
      <div v-if="isImage" class="image-preview">
        <img :src="fileUrl" alt="Uploaded image" />
      </div>
  
      <!-- Otherwise show file info and download link -->
      <div v-else class="file-info pdf-display" @click="downloadFile(file)">
        <div class="pdf-preview">
          <img src="@/assets/PDF_file_icon.png" alt="PDF Icon" class="pdf-icon">
          <span class="pdf-name">{{ file.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileIndicator',
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  methods: {
    downloadFile(file) {
      const link = document.createElement('a');
      link.href = this.fileUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  computed: {
    fileUrl() {
      return typeof this.file === 'string' ? this.file : URL.createObjectURL(this.file);
    },
    isImage() {
      const name = this.file.name || this.file;
      return /\.(png|jpe?g|gif|bmp|webp)$/i.test(name);
    }
  }
};
</script>

<style scoped>
.file-indicator-wrapper {
  display: flex;
  margin-right: 100px;
  justify-content: flex-end;
  margin-bottom: 8px;
  width: 100%;
  right: calc(3.125vw + 60px);
}

.file-indicator {
  max-width: 80%;
  padding: 8px 12px;
  background-color: #f8f4f4;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.image-preview img {
  border-radius: 8px;
  max-width: 100%;
  max-height: 200px;
}

.file-info p {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
}

.file-info a {
  font-size: 0.8rem;
  text-decoration: underline;
  color: #f8f4f4;
}

.pdf-display {
  cursor: pointer;
  transition: all 0.2s ease;
}

.pdf-display:hover {
  background-color: #fffcfc;
}

/* Modified styles for inline icon and filename */
.pdf-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}

.pdf-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.pdf-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  text-align: left;
}
</style>