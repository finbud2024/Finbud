<template>
  <div class="about-technology-page">
    <nav class="about-tech-subnav" aria-label="Sections">
      <a
        href="#about"
        class="about-tech-subnav__link"
        :class="{ active: activeSection === 'about' }"
        @click.prevent="goSection('about')"
      >{{ $t("aboutSectionLabel") }}</a>
      <a
        href="#technology"
        class="about-tech-subnav__link"
        :class="{ active: activeSection === 'technology' }"
        @click.prevent="goSection('technology')"
      >{{ $t("technology") }}</a>
    </nav>

    <section id="about" ref="aboutSection" class="about-technology-page__section">
      <AboutUsPage />
    </section>
    <section id="technology" ref="technologySection" class="about-technology-page__section">
      <TechnologyPage />
    </section>
  </div>
</template>

<script>
import TechnologyPage from "./TechnologyPage.vue";
import AboutUsPage from "./AboutUsPage.vue";

export default {
  name: "AboutTechnologyPage",
  components: { TechnologyPage, AboutUsPage },
  data() {
    return { activeSection: "about" };
  },
  watch: {
    "$route.hash": {
      immediate: true,
      handler() {
        this.$nextTick(() => this.scrollHashIntoView());
      },
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.$nextTick(() => {
      this.scrollHashIntoView();
      this.onScroll();
    });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    goSection(id) {
      const el = id === "technology" ? this.$refs.technologySection : this.$refs.aboutSection;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      this.activeSection = id;
      if (this.$route.hash !== `#${id}`) {
        this.$router.replace({ path: "/about", hash: `#${id}` });
      }
    },
    scrollHashIntoView() {
      const raw = this.$route.hash?.replace(/^#/, "");
      if (raw === "technology" || raw === "about") {
        const el = document.getElementById(raw);
        el?.scrollIntoView({ behavior: "auto", block: "start" });
        this.activeSection = raw;
      }
    },
    onScroll() {
      const tech = this.$refs.technologySection;
      const ab = this.$refs.aboutSection;
      if (!tech || !ab) return;
      const mid = window.scrollY + window.innerHeight * 0.25;
      const aboutEnd = ab.offsetTop + ab.offsetHeight;
      this.activeSection = mid < aboutEnd ? "about" : "technology";
    },
  },
};
</script>

<style scoped>
.about-technology-page {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}

.about-tech-subnav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-primary, #fff);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.about-tech-subnav__link {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  text-decoration: none;
  border: 1px solid transparent;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.about-tech-subnav__link:hover {
  color: var(--text-primary, #000);
  background: var(--bg-secondary, #f8fafc);
}

.about-tech-subnav__link.active {
  color: var(--secondary-color, #fff);
  background: var(--primary-color, #000);
  border-color: var(--primary-color, #000);
}

.about-technology-page__section {
  scroll-margin-top: 3.5rem;
}

:deep(.features-container) {
  padding-top: 0;
}

.about-technology-page__section:first-of-type :deep(.container) {
  padding-top: 1rem;
}
</style>
