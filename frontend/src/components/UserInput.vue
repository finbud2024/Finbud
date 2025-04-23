<template>
  <div class="user-input-container">
    <!-- File label -->
    <div v-if="selectedFile" class="file-label">
      <span>{{ selectedFile.name }}</span>
      <button @click="removeFile">×</button>
    </div>

    <div class="user-input">
      <!-- File Upload Button -->
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
      <div @click="triggerFileInput" class="upload-btn">
        <font-awesome-icon icon="fa-solid fa-paperclip" />
      </div>

      <!-- Drop File -->
      <div v-if="isDragging" class="drag-overlay">
      </div>

      <!-- Text Input Field -->
      <input type="text" v-model="messageText" @input="handleInput" @keyup.enter="send"
        :placeholder="typingPlaceholder" />

      <!-- Voice Recording Button or Send Button -->
      <div v-if="!isTyping" @mousedown="startRecording" @mouseup="stopRecording" @mouseleave="stopRecording"
        class="mic-btn" :class="{ recording: isRecording }">
        <i class="fa-solid fa-microphone-lines"></i>
      </div>

      <div v-else @click="send" class="send-btn">
        <font-awesome-icon icon="fa-solid fa-chevron-up" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OpenAI from 'openai';

export default {
  name: "UserInput",
  props: {
    newMessage: String,
    redirectOnSend: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      messageText: "",
      isRecording: false,
      isTyping: false,
      mediaRecorder: null,
      audioChunks: [],
      selectedFile: null,
      isDragging: false,
      typingPlaceholder: "",
      placeholderTexts: [
        "Hỏi giá cổ phiếu AAPL",
        "Tìm hiểu về lạm phát",
        "Mua 5 cổ phiếu của TSLA",
        "Theo dõi chi tiêu hôm nay",
        "Thêm giao dịch: ăn trưa 50k",
        "Tìm bất động sản ở TP. HCM",
        "Xem top 5 đồng tiền ảo",
        "Định nghĩa thuật ngữ IPO",
        "Xem xu hướng thị trường tuần này",
        "Gợi ý danh mục đầu tư ngắn hạn",
        "Tạo kế hoạch tiết kiệm 6 tháng",
        "Tính toán lợi nhuận đầu tư cổ phiếu",
        "Hỏi giá vàng hôm nay",
        "Tìm công ty có ROE cao nhất",
        "Giải thích chỉ số P/E",
        "So sánh ETF và cổ phiếu",
        "Có nên đầu tư vào Bitcoin lúc này?",
        "Lên danh sách cổ phiếu tăng trưởng",
        "Đề xuất chia tỷ lệ đầu tư 60/30/10",
      ],
      typingIndex: 0,
      charIndex: 0,
      isDeleting: false,
    };
  },

  mounted() {
    window.addEventListener('dragover', this.onDragOver);
    window.addEventListener('dragleave', this.onDragLeave);
    window.addEventListener('drop', this.onFileDrop);
    this.startTypingPlaceholder();
  },

  beforeUnmount() {
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('dragleave', this.onDragLeave);
    window.removeEventListener('drop', this.onFileDrop);
  },


  methods: {
    send() {
      if (!this.messageText.trim() && !this.selectedFile) return;

      if (this.redirectOnSend) {
        // Emit to parent to handle redirect + send
        this.$emit("send-message", this.messageText.trim());
      } else {
        // Normal mode: just send directly
        this.$emit("send-message", {
          message: this.messageText.trim(),
          file: this.selectedFile
        });
      }

      this.messageText = "";
      this.isTyping = false;
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },
    startTypingPlaceholder() {
      const currentText = this.placeholderTexts[this.typingIndex];
      const typingSpeed = this.isDeleting ? 15 : 15;

      if (!this.isDeleting) {
        this.typingPlaceholder = currentText.substring(0, this.charIndex + 1);
        this.charIndex++;
      } else {
        this.typingPlaceholder = currentText.substring(0, this.charIndex - 1);
        this.charIndex--;
      }

      if (!this.isDeleting && this.charIndex === currentText.length) {
        setTimeout(() => {
          this.isDeleting = true;
          this.startTypingPlaceholder();
        }, 1000); // pause before deleting
        return;
      }

      if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.typingIndex = (this.typingIndex + 1) % this.placeholderTexts.length;
      }

      setTimeout(this.startTypingPlaceholder, typingSpeed);
    },
    clearInput() {
      this.inputText = "";
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileChange(event) {
      this.selectedFile = event.target.files[0] || null;
      if (!file) return;
    },

    async handleFileUpload(event) {
      this.selectedFile = event.target.files[0] || null;

    },

    handleInput() {
      this.isTyping = this.messageText.length > 0;
    },

    onDragOver(event) {
      event.preventDefault();
      this.isDragging = true;
    },
    onDragLeave(event) {
      event.preventDefault();
      this.isDragging = false;
    },
    onFileDrop(event) {
      event.preventDefault();
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },

    removeFile() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },

    // Start Recording
    async startRecording() {
      this.isRecording = true;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    },

    // Stop Recording & Convert Speech to Text
    async stopRecording() {
      if (!this.isRecording) return;
      this.isRecording = false;
      this.mediaRecorder.stop();

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob);
        formData.append("model", "whisper-1");

        try {
          const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            formData,
            { headers: { Authorization: `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}` } }
          );

          this.messageText = response.data.text; // Insert transcribed text into input box
          this.isTyping = true; // Show send button if text appears
        } catch (error) {
          console.error("Speech-to-text failed:", error);
        }
      };
    }
  }
};
</script>

<style scoped>
.drag-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(100, 100, 100, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-primary);
  font-size: 1.5rem;
  z-index: 9999;
  pointer-events: none;
  /* Allows clicks to pass through */
}

.user-input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: var(--bg-primary);
  padding-bottom: 15px;
}

.file-label {
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 6px 12px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-label span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px;
}

.file-label button {
  background: none;
  border: none;
  margin-left: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: var(--link-color);
}

.user-input {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.user-input {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 15px 15px 15px;
  position: relative;
}

.user-input input[type="text"] {
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px 10px 10px 40px;
  border: 2px solid var(--border-color);
  border-radius: 20px;
  background-color: var(--card-bg);
  color: var(--text-primary);
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.user-input input[type="text"]:focus {
  border-color: var(--link-color);
  outline: none;
  box-shadow: 0 0 5px var(--shadow-color);
}

.upload-btn,
.mic-btn,
.send-btn {
  position: absolute;
  cursor: pointer;
  color: var(--link-color);
  transition: color 0.3s, transform 0.2s;
}

.upload-btn {
  left: 30px;
}

.send-btn {
  right: 40px;
}


/* Voice Recording Button */
.mic-btn {
  right: 40px;
}

.mic-btn.recording {
  color: red;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.upload-btn:hover,
.mic-btn:hover,
.send-btn:hover {
  color: var(--link-color);
  transform: scale(1.1);
}

.upload-btn:focus,
.send-btn:focus {
  outline: none;
  box-shadow: 0 0 5px var(--shadow-color);
}

/* Hiệu ứng nháy cho placeholder giống như con trỏ */
input::placeholder {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .user-input {
    width: 100%;
  }
}

@container userInputComponent (max-width: 401px) {
  .user-input {
    width: 100%;
  }
}
</style>
