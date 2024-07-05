<template>
  <div class="user-profile">
    <h1>User Profile</h1>
    <div v-if="user" class="profile-details">
      <p><strong>Username:</strong> {{ user.accountData.username }}</p>
      <p><strong>Password:</strong> {{ user.accountData.password }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
    };
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axios.get(`/.netlify/functions/server/profile/${this.$route.params.username}`);
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
  },
  created() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.user-profile {
  font-family: 'Space Grotesk', sans-serif;
  color: #333;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #007bff;
  margin-bottom: 2rem;
}

.profile-details {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-details p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.profile-details strong {
  color: #555;
}
</style>
