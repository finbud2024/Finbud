<template>
  <div class="user-input">
    <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;" />
    <button @click="triggerFileInput" class="upload-btn">
      📷
    </button>
    <input type="text" :value="newMessage" @input="$emit('update:newMessage', $event.target.value)"
      @keyup.enter="sendMessage" placeholder="Type your message here..." />
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
      // Emit the message content for the parent component to handle
      this.$emit('send-message', this.newMessage, null);

      // Emit an event for clearing the message input
      this.$emit('clear-message');
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
.user-input {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  /* Light grey background */
  padding: 10px;
  border-top: 2px solid #dee2e6;
  /* Light grey border */
}

.user-input input[type="text"] {
  flex-grow: 1;
  /* Allows the text input to grow and fill available space */
  margin-right: 10px;
  /* Space between the text input and the send button */
  padding: 8px;
  border: 1px solid #ced4da;
  /* Light grey border */
  border-radius: 5px;
  /* Rounded corners */
}

.user-input button {
  padding: 8px 16px;
  background-color: #007bff;
  /* Bootstrap primary blue */
  color: white;
  border: none;
  border-radius: 5px;
  /* Rounded corners */
  cursor: pointer;
  /* Cursor indicates button */
  transition: background-color 0.3s;
  /* Smooth transition for hover effect */
}

.user-input button:hover {
  background-color: #0056b3;
  /* Darker blue on hover */
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