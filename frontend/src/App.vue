<template>
  <div class="nav-actions">
    <NavBar />
    <div class="content">
      <!-- Use router-link to navigate to the login page -->
    </div>
  </div>
  <!-- router-view will render the component associated with the current route -->
  <router-view />
  <FooterBar ref="footerBar"/>
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
  mounted() {
    this.updateFooterVisibility(this.$route.path);

    this.$router.afterEach((to, from) => {
      this.updateFooterVisibility(to.path);
    });
  },
  methods: {
    updateFooterVisibility(path) {
      const footer = this.$refs.footerBar.$el;
      if (path === '/chat-view') {
        footer.style.display = 'none';
      } else {
        footer.style.display = 'flex';
      }
    }
  }
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
  flex: 1;
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
