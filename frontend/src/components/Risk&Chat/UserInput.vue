<template>
    <div class="user-input">
      <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;" />
      <button @click="triggerFileInput" class="upload-btn">📷</button>
      <input type="text" v-model="messageText" @keyup.enter="send" placeholder="Type your message here..." />
      <button @click="send" class="send-btn">Send</button>
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
        console.log("UserInput message - textMessage: ", this.messageText);
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
  .user-input {
    display: flex;
    align-items: center;
    /* background-color: #ffffff; */
    padding: 15px;
    /* border-top: 2px solid #dee2e6; */
    /* box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); */
    /* transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out; */
  }
  
  /* .user-input:hover {
    background-color: #f1f3f5;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  }
   */
  .user-input input[type="text"] {
    flex-grow: 1;
    margin-right: 10px;
    padding: 10px;
    color: #816765;
    border: 1px solid #ced4da;
    border-radius: 20px;
    transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  
  .user-input input[type="text"]:focus {
    border-color: #816765;
    outline: none;
    box-shadow: 0 0 5px rgba(128, 189, 255, 0.5);
  }
  
  .user-input button {
    padding: 10px 20px;
    background-color: #816765;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .user-input button:hover {
    background-color: #86807f;
    transform: translateY(-2px);
  }
  
  .upload-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    margin-right: 10px;
    color: #31473A;
    transition: color 0.3s, transform 0.2s;
  }
  
  .upload-btn:hover {
    color: #0056b3;
    transform: scale(1.1);
  }
  
  .upload-btn:focus, .send-btn:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(128, 189, 255, 0.5);
  }
  </style>
  