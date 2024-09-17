<template>
  <div class="GoalDashBoardContainer">
      <div class="leftPanel">
        <!-- TO DO: Update this image based on user profile picture -->
        <div class="leftPanelHeader">
          <img class="profilePic" src="../assets/botrmbg.png" alt="profilePic" />
          <div class="headerText">
            <>{{new Date().getHours < 12? "Good Morning ": "Good Afternoon "}}{{displayName}}<>
            <div></div>
          </div>
        </div>
      </div>
      <div class="rightPanel">

      </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GoalPage',
  components: {
    
  },
  data() {
    return {
      userId: localStorage.getItem('token'),
      firstName: JSON.parse(localStorage.getItem('user')).identityData.firstName,
      displayName: JSON.parse(localStorage.getItem('user')).identityData.displayName,
      
    };
  },
  computed: {
    isAuthenticated(){
      return this.$store.getters["users/isAuthenticated"];
    },
  },
  methods: {
   
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push('/');
    }
    const navbarHeight = document.querySelector(".nav-actions").offsetHeight;
    document.querySelector(".GoalDashBoardContainer").style.height = `calc(100vh - ${navbarHeight}px)`;
  },
};
</script>
<style scoped>
  .GoalDashBoardContainer{
    width: calc(100vw - 17px);
    display: flex;
    flex-direction: row;
  } 
  .leftPanel{
    width: 70%;
    height: 100%;
    padding: 20px;
  }
  .rightPanel{
    width: 30%;
    height: 100%;
    border: 2px solid green;
  }
  .leftPanelHeader{
    width: 100%;
    height: 10%;
    background-color: green;
    display: flex;
    flex-direction: row;
  }
  .profilePic{
    width: 60px;
    aspect-ratio: 1;
  }
</style>