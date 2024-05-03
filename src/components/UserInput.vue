<template>
    <div class="user-input">
      <input
        type="file"
        ref="fileInput"
        @change="handleImageUpload"
        style="display: none;"
      />
      <button @click="triggerFileInput" class="upload-btn">
        📷
      </button>
      <input
        type="text"
        :value="newMessage"
        @input="$emit('update:newMessage', $event.target.value)"
        @keyup.enter="sendMessage"
        placeholder="Type your message here..."
      />
      <button @click="sendMessage">Send</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserInput',
    props: {
      newMessage: String,
    },
    methods: {
      sendMessage() {
        this.$emit('send-message', this.newMessage, null);
        this.newMessage = ''; // Clear the message input after sending
      },
      triggerFileInput() {
        this.$refs.fileInput.click(); // Simulate click on hidden file input
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          // Emit an event with the selected file
          this.$emit('send-message', null, file);
        }
        // Clear the file input after the file is selected
        this.$refs.fileInput.value = null;
      },
    },
  };
  </script>
  
  <style scoped>
  /* ... include your existing styles here ... */
  
  /* Styles for the upload button */
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
  