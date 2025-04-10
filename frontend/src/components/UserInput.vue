<template>
  <div class="user-input-container">
    <div class="user-input">
      <!-- File Upload Button -->
      <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;" />
      <div @click="triggerFileInput" class="upload-btn">
        <font-awesome-icon icon="fa-solid fa-paperclip" />
      </div>

      <!-- Text Input Field -->
      <input 
        type="text" 
        v-model="messageText" 
        @input="handleInput"
        @keyup.enter="send" 
        placeholder="Type your message here..."
      />

      <!-- Voice Recording Button OR Send Button -->
      <div v-if="!isTyping" 
        @mousedown="startRecording" 
        @mouseup="stopRecording" 
        @mouseleave="stopRecording"
        class="mic-btn"
        :class="{ recording: isRecording }" 
      >
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
  },
  data() {
    return {
      messageText: "",
      isRecording: false,
      isTyping: false,
      mediaRecorder: null,
      audioChunks: []
    };
  },
  methods: {
    send() {
      if (!this.messageText.trim()) return;
      this.$emit("send-message", this.messageText);
      this.messageText = "";
      this.isTyping = false; // Reset to show mic button again
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.$emit("send-message", null, file);
      }
      this.$refs.fileInput.value = "";
    },

    handleInput() {
      this.isTyping = this.messageText.length > 0;
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
.user-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: var(--bg-primary);
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

.upload-btn, .mic-btn, .send-btn {
  position: absolute;
  cursor: pointer;
  color: var(--link-color);
  transition: color 0.3s, transform 0.2s;
}

.upload-btn { left: 30px; }
.send-btn { right: 40px; }

/* Voice Recording Button */
.mic-btn {
  right: 40px;
}

.mic-btn.recording {
  color: red;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.upload-btn:hover, .mic-btn:hover, .send-btn:hover {
  color: var(--link-color);
  transform: scale(1.1);
}

.upload-btn:focus, .send-btn:focus {
  outline: none;
  box-shadow: 0 0 5px var(--shadow-color);
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
