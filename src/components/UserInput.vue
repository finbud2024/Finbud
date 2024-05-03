<template>
  <div class="user-input">
    <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;" />
    <button @click="triggerFileInput" class="upload-btn">📷</button>
    <input type="text" v-model="messageText" @keyup.enter="send" placeholder="Type your message here..." />
    <button @click="send">Send</button>
  </div>
</template>

<script>
export default {
  name: 'UserInput',
  props: {
    newMessage: String,
  },
  data() {
    return {
      messageText: ''
    };
  },
  methods: {
    send() {
      this.$emit('send-message', this.messageText);
      console.log("UserInput message - textMessage: ", this.messageText)
      this.messageText = ""
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.$emit('send-message', null, file);
      }
      this.$refs.fileInput.value = '';  // Reset file input
    },
  },
};
</script>


<style scoped>
.user-input {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 10px;
  border-top: 2px solid #dee2e6;
}

.user-input input[type="text"] {
  flex-grow: 1;
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.user-input button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-input button:hover {
  background-color: #0056b3;
}

/* Additional styles for the upload button are already provided */
.upload-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 10px;
  color: #007bff;
}

.upload-btn:hover {
  color: #0056b3;
}
</style>