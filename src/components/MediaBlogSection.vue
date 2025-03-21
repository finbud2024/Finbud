<template>
  <section class="media-blog-section">
    <h2>Ấn phẩm truyền thông</h2>
    <div class="carousel">
      <button class="carousel-nav left" @click="scrollLeft">❮</button>
      <div class="carousel-content" ref="carouselContent">
        <div class="carousel-item" v-for="(item, index) in items" :key="index">
          <img :src="require(`@/assets/${item.image}`)" :alt="item.title">
          <div class="item-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-nav right" @click="scrollRight">❯</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MediaBlogSection',
  data() {
    return {
      items: [
        { image: 'image1.jpg', title: 'Có thực sự đáng sống?', description: 'Khám phá các yếu tố tạo nên một cuộc sống đáng sống.' },
        { image: 'image2.jpg', title: 'Tình trạng hiện nay', description: 'Phân tích và đánh giá tình hình hiện tại của xã hội.' },
        { image: 'image3.jpg', title: 'Thông điệp vũ trụ', description: 'Những thông điệp sâu sắc từ vũ trụ và những bài học cuộc sống.' },
        { image: 'image4.jpg', title: 'Chăm sóc sức khỏe', description: 'Những bí quyết chăm sóc sức khỏe cho cuộc sống hiện đại.' },
        { image: 'image5.jpg', title: 'Kinh nghiệm sống', description: 'Những kinh nghiệm quý báu để sống hạnh phúc và thành công.' },
        { image: 'image6.jpg', title: 'Công nghệ và cuộc sống', description: 'Cách công nghệ đang thay đổi cuộc sống hàng ngày của chúng ta.' }
      ]
    }
  },
  methods: {
    scrollLeft() {
      const carousel = this.$refs.carouselContent;
      carousel.scrollBy({ left: -300, behavior: 'smooth' });
    },
    scrollRight() {
      const carousel = this.$refs.carouselContent;
      carousel.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

.media-blog-section {
  background-color: #1c1c4c;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-in-out;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.carousel-content::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, and Opera */
}

.carousel-item {
  flex: 0 0 auto;
  width: 250px;
  margin: 0 1rem;
  background: white;
  color: #1c1c4c;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: slideIn 0.5s ease-in-out;
}

.carousel-item img {
  width: 100%;
  border-radius: 8px 8px 0 0;
}

.item-content {
  padding: 1rem;
}

.item-content h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.item-content p {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.carousel-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1;
  transition: transform 0.3s ease;
}

.carousel-nav:hover {
  transform: scale(1.2);
}

.carousel-nav.left {
  left: 0;
}

.carousel-nav.right {
  right: 0;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .carousel-item {
    width: 200px;
  }

  .carousel-nav {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    width: 150px;
  }

  .carousel-nav {
    font-size: 1.2rem;
  }
}
</style>
