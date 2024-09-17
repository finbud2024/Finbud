<template>
  <div class="GoalDashBoardContainer">
      <div class="leftPanel">
        <div class="leftPanelHeader">
          <img class="profilePic" :src="profilePic" alt="profilePic" />
          <div class="headerText">
            <div class="greeting">{{new Date().getHours < 12? "Good Morning ": "Good Afternoon "}}{{displayName}}</div>
            <div class="slogan">Manage your wallet wisely to reach your goals with ease.</div>
          </div>
        </div>
        <div class="panelOverview">
          2 cards as shown in figma goes here
        </div>
        <div class="graphContainer">
          Graph goes here. Use LineChar component. DO NOT MAKE A SEPARATE FOLER UNDER COMPONENT FOLDER FOR THIS PAGE
        </div>
        <div class="transactionContainer">
          Transaction table goes here
        </div>
      </div>
      <div class="rightPanel">
        No need to put the graph as in figma no more. Add a more goals here.
        <br>
        Display corresponding message/ picture if there is no goal for  created by the user
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
      profilePic: JSON.parse(localStorage.getItem('user')).identityData.profilePicture,
    };
  },
  computed: {
    isAuthenticated() {
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
    max-height: 100%;
    border: 2px solid red;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: space-between;
  }
  .rightPanel{
    width: 30%;
    max-height: 100%;
    border: 2px solid green;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .leftPanelHeader{
    max-width: 100%;
    height: 5%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .profilePic{
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
  }
  .headerText{
    margin-left: 10px;
  }
  .greeting{
    font-weight: 600;
    font-size: 22px;
  }
  .slogan{
    font-size: 14px;
    color: #aaa;
  }
  .panelOverview{
    width: 100%;
    height: 15%;
    background-color: blue;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .graphContainer{
    width:100%;
    height: 45%;
    display: flex;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(31, 126, 53);
  }
  .transactionContainer{
    width:100%;
    height: 30%;
    display: flex;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(126, 104, 31);
  }
</style>