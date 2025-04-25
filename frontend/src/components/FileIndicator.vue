<template>
    <div class="file-indicator-wrapper">
        <div class="file-indicator">
      <!-- Show image preview if file is an image -->
      <div v-if="isImage" class="image-preview">
        <img :src="fileUrl" alt="Uploaded image" />
      </div>
  
      <!-- Otherwise show file info and download link -->
      <div v-else class="file-info">
        <img src="./assets/pdfIcon.png">📄 {{ file.name }}</img>
        <a :href="fileUrl" target="_blank" download>Download</a>
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
    
    computed: {
      fileUrl() {
        // If your backend returns a path, adjust accordingly
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
  justify-content: flex-end; /* Force right alignment */
  margin-bottom: 8px;
  width: 100%;
  /* position: fixed;
	z-index: 99999; */
	right: calc(3.125vw + 60px);
}

.file-indicator {
  max-width: 80%; /* Prevent too wide files */
  padding: 8px 12px;
  background-color: #e6f0ff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #d0e3ff;
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
  color: #007bff;
}
  </style>
  