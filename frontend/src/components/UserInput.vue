<template>
  <div class="user-input-container">
    <div class="user-input">
      <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;" />
      <div @click="triggerFileInput" class="upload-btn">
        <font-awesome-icon icon="fa-solid fa-paperclip" />
      </div>
      <input 
        type="text" 
        v-model="messageText" 
        @keyup.enter="send" 
        placeholder="Type your message here..."
      />
      <div @click="send" class="send-btn">
        <font-awesome-icon icon="fa-solid fa-chevron-up" />
      </div>
    </div>
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
      this.messageText = "";
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

/* .user-input:hover {
  background-color: #f1f3f5;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
} */

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

.user-input input[type="text"]::placeholder {
  color: var(--text-primary);
  opacity: 0.6;
}

.upload-btn {
  position: absolute;
  left: 30px;
  cursor: pointer;
  color: var(--link-color);
}

.send-btn {
  position: absolute;
  right: 40px;
  cursor: pointer;
  color: var(--link-color);
}

.upload-btn:hover {
  color: var(--link-color);
  transform: scale(1.1);
}

.upload-btn:focus, .send-btn:focus {
  outline: none;
  box-shadow: 0 0 5px var(--shadow-color);
}

/* Media queries */
@media (max-width: 768px) {
  .user-input {
    width: 100%;
  }
}

@container userInputComponent (max-width: 401px){
  .user-input {
    width: 100%;
  }
}
</style>
