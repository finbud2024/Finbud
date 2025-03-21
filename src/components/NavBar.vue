<template>
  <header class="navbar">
    <div class="navbar-content">
      <img src="@/assets/logo.png" alt="ESmart Logo" class="logo" />
      <nav>
        <ul :class="{ open: isOpen }">
          <li>
            <div class="language-switcher">
              <button @click="switchLanguage('vi')">
                <img src="@/assets/vietnamese-flag.png" alt="Vietnamese" />
              </button>
              <button @click="switchLanguage('en')">
                <img src="@/assets/english-flag.png" alt="English" />
              </button>
            </div>
          </li>
          <!-- <li><router-link to="#intro">Trang chủ</router-link></li> -->
          <li>
            <router-link to="#intro">{{ $t("home") }}</router-link>
          </li>
          <li>
            <router-link to="#social-proof">{{
              $t("achievements")
            }}</router-link>
          </li>
          <li class="dropdown">
            <router-link to="#blog">{{ $t("blog") }}</router-link>
            <ul class="dropdown-menu">
              <li>
                <a
                  href="/detailed-blog-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button>{{ $t("blogPage1") }}</button>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <router-link to="#project">{{ $t("products") }}</router-link>
          </li>
          <li class="dropdown">
            <router-link to="#about-us">{{ $t("About Us") }}</router-link>
            <ul class="dropdown-menu">
              <li>
                <router-link to="#intro">{{ $t("home") }}</router-link>
              </li>
              <li>
                <router-link to="#social-proof">{{
                  $t("achievements")
                }}</router-link>
              </li>
              <li>
                <router-link to="#process">{{ $t("process") }}</router-link>
              </li>
              <li>
                <router-link to="#blog">{{ $t("blog") }}</router-link>
              </li>
              <li>
                <router-link to="#project">{{ $t("products") }}</router-link>
              </li>
            </ul>
          </li>
          <li><router-link to="#service"></router-link></li>
        </ul>
      </nav>
      <div class="burger" @click="toggleMenu">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </header>
</template>

<script>
// import { useI18n } from "vue-i18n";

export default {
  name: "NavBar",
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    switchLanguage(language) {
      this.$i18n.locale = language;
    },
    goToBlog() {
      this.$router.push({ name: "DetailedBlog1" });
    },
  },
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.language-switcher button {
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
}

.language-switcher img {
  width: 30px; /* Adjust size as needed */
  height: auto;
}

.language-switcher button:hover {
  opacity: 0.8;
}

.navbar {
  background-color: white;
  padding-right: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  max-width: 6%;
  margin-left: 3rem;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav ul li {
  margin: 0 1rem;
  cursor: pointer;
  color: #333;
  font-weight: bold;
  position: relative;
}

nav ul li a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

nav ul li:hover {
  color: #0077b6;
}

.burger {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.burger div {
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 4px;
  transition: all 0.3s ease;
}

nav ul.open {
  animation: slide-in 0.3s ease-in-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateX(-80%);
  }

  to {
    transform: translateX(0);
  }
}

nav ul.open .burger div:nth-child(1) {
  transform: rotate(45deg) translateX(8px);
}

nav ul.open .burger div:nth-child(2) {
  opacity: 0;
}

nav ul.open .burger div:nth-child(3) {
  transform: rotate(-45deg) translateX(-8px);
}

@media (max-width: 768px) {
  nav ul {
    display: none;
    flex-direction: column;
    width: 100%;
    background-color: white;
    position: absolute;
    top: 60px;
    left: 0;
    transition: transform 0.3s ease;
  }

  nav ul.open {
    display: flex;
    transform: translateX(0);
  }

  nav ul li {
    margin: 1rem 0;
    text-align: center;
  }

  .burger {
    display: flex;
  }
}

/* Dropdown Menu Styles */
.dropdown {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 150px;
}

.dropdown-menu li {
  padding: 8px 16px;
  text-align: center;
}

.dropdown-menu li a {
  text-decoration: none;
  color: #333;
  display: block;
  font-size: 16px;
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
