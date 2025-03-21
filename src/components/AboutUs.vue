<template>
  <section class="about">
    <h2>{{ $t("AboutUs.title") }}</h2>
    <p>{{ $t("AboutUs.description1") }}</p>
    <p>{{ $t("AboutUs.description2") }}</p>
    <p>{{ $t("AboutUs.description3") }}</p>

    <div class="slideshow-container">
      <div class="slideshow">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="image.src"
          :alt="image.alt"
          class="about-image"
          :class="{ active: currentIndex === index }"
        />
      </div>
      <button class="arrow left-arrow" @click="prevSlide" aria-label="Previous Slide">
        ❮
      </button>
      <button class="arrow right-arrow" @click="nextSlide" aria-label="Next Slide">
        ❯
      </button>
    </div>

  </section>
</template>

<script>
export default {
  name: "AboutUs",
  data() {
    return {
      currentIndex: 0,
      images: [
        { src: require("@/assets/esmart_end.jpg"), alt: this.$t("AboutUs.imageAlt") },
        { src: require("@/assets/esmart_start.jpg"), alt: this.$t("AboutUs.imageAlt1") },
        { src: require("@/assets/logo.png"), alt: this.$t("AboutUs.imageAlt2") },
      ],
    };
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
  },
};
</script>

<style scoped>
.about {
  background-color: #1c1c4c;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  position: relative;
}

.about::after {
  content: "";
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  opacity: 0.2;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.slideshow-container {
  position: relative;
  max-width: 80%;
  margin: 2rem auto;
  overflow: hidden;
}

.slideshow {
  position: relative;
  width: 100%;
  height: 1000px; /* Adjust height as needed */
}

.about-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image fills the container while maintaining aspect ratio */
  border-radius: 100px;
  transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
  filter: brightness(1.2); /* Makes the image brighter */
  opacity: 0; /* Hide all images by default */
}

.about-image.active {
  opacity: 1; /* Show only the active image */
}

.about-image:hover {
  transform: scale(0.9) translateZ(-10px); /* Makes the image smaller and moves it away */
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #000; /* Match the screenshot's black background */
  color: white;
  border: none;
  padding: 0.5rem 1rem; /* Adjust padding to match the screenshot */
  cursor: pointer;
  font-size: 1.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.arrow:hover {
  background-color: #333; /* Slightly lighter black on hover */
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
}
</style>
