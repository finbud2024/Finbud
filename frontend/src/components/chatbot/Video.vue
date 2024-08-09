<template>
  <h3>Videos</h3>
  <div class="videos-container">
    <div class="video" v-for="(video, index) in videos" :key="index" @click="openVideo(video.link)">
      <img :src="video.imageUrl" alt="Video thumbnail" />
      <div class="watch-label">
        <span class="watch-text">Watch <i class="play-icon">▶</i></span>
      </div>
      <div class="overlay">
        <div class="title">{{ video.title }}</div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    videos: {
      type: Array,
      required: true
    }
  },
  methods: {
    openVideo(link) {
      window.open(link, '_blank');
    }
  }
};
</script>

<style scoped>
.videos-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 10px; /* Space between items */
}

.video {
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  border: 2px solid transparent; /* Initial transparent border for transition */
  border-radius: 8px; /* Optional: Rounded corners */
}

.video img {
  width: 100%;
  height: auto;
  display: block; /* Ensures no extra space around the image */
  border-radius: 6px; /* Optional: Rounded corners matching the container */
}

.video:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #3498db; /* Border color on hover */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 6px; /* Match the image rounded corners */
}

.watch-label {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  border-radius: 20px;
}

.play-icon {
  margin-left: 5px;
}

.video:hover .overlay {
  opacity: 1;
}

.title {
  margin-top: 10px;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  padding: 10px;
}
</style>
