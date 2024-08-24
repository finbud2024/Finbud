<template>
  <div class="nav-actions">
    <NavBar ref="headerBar" />
    <div class="content">
      <!-- Use router-link to navigate to the login page -->
    </div>
  </div>
  <!-- router-view will render the component associated with the current route -->
  <router-view />
  <QuizzPage2 />
  <FooterBar ref="footerBar" />
</template>

<script>
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import FetchData from "./views/FetchData.vue";
import QuizzPage2 from "./views/QuizzPage2.vue";

export default {
  name: "App",
  components: {
    NavBar,
    FooterBar,
    FetchData,
    QuizzPage2,
  },
  mounted() {
    // this.updateFooterVisibility(this.$route.path);
    // this.updateHeaderVisibility(this.$route.path);
    this.$router.afterEach((to, from) => {
      this.updateFooterVisibility(to.fullPath);
      this.updateHeaderVisibility(to.fullPath);
    });
  },
  methods: {
    updateFooterVisibility(path) {
      const footer = this.$refs.footerBar.$el;
      if (path === "/chat-view" || path.includes("/stock-simulator?")) {
        footer.style.display = "none";
      } else {
        footer.style.display = "flex";
      }
    },
    updateHeaderVisibility(path) {
      const header = this.$refs.headerBar.$el;
      if (path.includes("/stock-simulator?")) {
        header.style.display = "none";
      } else {
        header.style.display = "flex";
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap");
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  font-family: Noto sans, sans-serif;
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
