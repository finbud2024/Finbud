<template>
  <nav-bar></nav-bar>
  <SideBar>
  </SideBar>
  <HomeView></HomeView>
</template>

<script>
import NavBar from './components/NavBar.vue';
import SideBar from './components/SideBar.vue';
import HomeView from './views/HomeView.vue';

export default {
  name: 'App',
  components: {
    HomeView,
    NavBar,
    SideBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
