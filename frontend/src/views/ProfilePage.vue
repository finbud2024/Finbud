<template>
    <div class="profile-page">
      <div class="header">
        <h1>Hello Jesse</h1>
        <p>This is your profile page. You can see the progress you’ve made with your work and manage your projects or assigned tasks</p>
        <button class="edit-profile-btn">Edit profile</button>
      </div>
      <div class="account-info">
        <div class="user-info">
          <h2>My account</h2>
          <div class="info">
            <div class="field">
              <label>Username</label>
              <input type="text" value="lucky.jesse" disabled>
            </div>
            <div class="field">
              <label>Email address</label>
              <input type="email" value="jesse@example.com" disabled>
            </div>
            <div class="field">
              <label>First name</label>
              <input type="text" value="Jesse" disabled>
            </div>
            <div class="field">
              <label>Last name</label>
              <input type="text" value="Doe" disabled>
            </div>
          </div>
          <button class="settings-btn">Settings</button>
        </div>
        <div class="user-stats">
          <img src="@/assets/advanced-cv.png" alt="User Photo" class="user-photo">
          <div class="stats">
            <div>22 Friends</div>
            <div>10 Photos</div>
            <div>89 Comments</div>
          </div>
          <div class="actions">
            <button class="connect-btn">Connect</button>
            <button class="message-btn">Message</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfilePage'
  }
  </script>
  
  <style scoped>
  .profile-page {
    font-family: 'Arial', sans-serif;
    color: #fff;
    background: url('@/assets/advanced-cv.png') no-repeat center center/cover;
    padding: 20px;
    height: 100vh;
  }
  
  .header {
    text-align: center;
  }
  
  .header h1 {
    font-size: 2em;
    margin: 0;
  }
  
  .header p {
    margin: 10px 0;
  }
  
  .edit-profile-btn {
    background-color: #00BFFF;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .account-info {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  .user-info {
    background: rgba(244, 244, 244, 0.8);
    padding: 20px;
    border-radius: 10px;
    color: #000;
    width: 45%;
  }
  
  .user-info h2 {
    margin: 0 0 10px 0;
  }
  
  .field {
    margin-bottom: 10px;
  }
  
  .field label {
    display: block;
    margin-bottom: 5px;
  }
  
  .field input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .settings-btn {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 10px;
  }
  
  .user-stats {
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 10px;
    color: #000;
    width: 45%;
    text-align: center;
  }
  
  .user-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .stats {
    margin: 10px 0;
  }
  
  .actions {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }
  
  .connect-btn,
  .message-btn {
    background-color: #00BFFF;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
  }
  </style>
  