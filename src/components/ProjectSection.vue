<template>
  <section class="feats-section">
    <h2>{{ $t("feats.sectionTitle") }}</h2>
    <h1>{{ $t("feats.mainTitle") }}</h1>
    <div class="feats-container">
      <div class="feat-item" v-for="(feat, index) in features" :key="index">
        <div class="feat-icon">
          <i :class="feat.icon"></i>
        </div>
        <p>{{ $t(`feats.items.${index}`) }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FeatsSection",
  computed: {
    features() {
      // The titles are managed via the translation keys directly
      return [
        { icon: "fas fa-cogs" }, // Titles now managed via translations
        { icon: "fas fa-shopping-cart" },
        { icon: "fas fa-globe" },
        { icon: "fas fa-video" },
        { icon: "fas fa-paint-brush" },
      ];
    },
  },
};
</script>

<style scoped>
.feats-section {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f8f9fa;
}

.feats-section h2 {
  font-size: 1rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.feats-section h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.feats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.feat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  max-width: 150px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.feat-icon {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.feat-icon i {
  font-size: 2.5rem;
  color: #333;
}

.feat-item p {
  font-size: 1rem;
  color: #333;
  margin: 0;
}

.feat-item:hover .feat-icon {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 24px rgba(0, 0, 0, 0.2);
}
</style>
``` In this example, I've replaced the image tags with Font Awesome icons using
the `i` tag and the class names provided by Font Awesome. I've also adjusted the
CSS to style the icons and add a 3D float effect on hover. You can customize the
icon classes and styles as needed for your project. -->
