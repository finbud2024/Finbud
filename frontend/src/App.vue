<template>
  <div class="nav-actions">
    <NavBar />
    <div class="content">
      <!-- Use router-link to navigate to the login page -->
    </div>
  </div>
  <!-- router-view will render the component associated with the current route -->
  <router-view />
  <FooterBar />
</template>

<script>
import NavBar from './components/NavBar.vue';
import FooterBar from './components/FooterBar.vue';


export default {
  name: 'App',
  components: {
    NavBar,
    FooterBar,
  },
};
</script>

<style>
body {
  min-height: 100%;
  margin:0;
  padding:0;
}

html { 
  height: 100%;
  scrollbar-gutter: auto;
}
</style>

<style scoped>
.nav-actions {
  display: flex;
  flex-direction: column;
  margin: 0px;
}

.content {
  padding-top: 80px;
}
a {
  text-decoration: none;
  color: blue;
  border: 1px solid blue;
}

a:hover {
  background-color: #e7f3ff;
}

</style>
