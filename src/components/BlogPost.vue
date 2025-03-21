<template>
  <section class="blog-post">
    <div class="card main-post">
      <img
        :src="require(`@/assets/${mainPost.image}`)"
        :alt="mainPost.title"
        class="card-image"
      />
      <div class="card-content">
        <h2>{{ $t("blogPost.mainPost.title") }}</h2>
        <p>
          {{
            isExpanded
              ? $t("blogPost.mainPost.fullText")
              : $t("blogPost.mainPost.excerpt")
          }}
        </p>
        <br />
        <br />
        <button class="read-more" @click="toggleReadMore">
          {{ isExpanded ? $t("blogPost.readLess") : $t("blogPost.readMore") }}
        </button>
      </div>
    </div>
    <div class="sidebar">
      <h3>{{ $t("blogPost.morePosts") }}</h3>
      <div
        class="card sidebar-post"
        v-for="(post, index) in sidebarPosts"
        :key="index"
      >
        <img
          :src="require(`@/assets/${post.image}`)"
          :alt="post.title"
          class="card-image"
        />
        <div class="card-content">
          <h4>{{ post.title }}</h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "BlogPost",
  data() {
    return {
      isExpanded: false,
      mainPost: {
        image: "image1.jpg",
        title: "ECO TOUCH - A NEW JOURNEY OF VIET STRAW TO GO GLOBAL",
        excerpt:
          "Joining forces with EcoSmart Solutions, ECO Touch embarks on an exhilarating journey alongside VietStraw...",
        fullText:
          "Joining forces with EcoSmart Solutions, ECO Touch embarks on an exhilarating journey alongside VietStraw. As we embark on this exhilarating journey, ECO Touch and EcoSmart Solutions are poised to revolutionize the landscape of sustainable practices. Our partnership is built on a foundation of mutual respect and a commitment to advancing environmental solutions. With EcoSmart Solutions' expertise in cutting-edge green technologies and ECO Touch’s pioneering approach to eco-friendly products, we are set to make a significant impact.",
      },
      sidebarPosts: [
        {
          image: "image1.jpg",
          title: "Check Your Mail!",
        },
        {
          image: "image2.jpg",
          title: "Exciting news!",
        },
        {
          image: "image1.jpg",
          title: "1 Day Left for Registration",
        },
      ],
    };
  },
  methods: {
    toggleReadMore() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

.blog-post {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 2rem 1rem;
  background: #f0f2f5;
  font-family: "Poppins", sans-serif;
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 10px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.main-post {
  flex: 2;
  display: flex;
  flex-direction: row;
  max-width: 100%;
  animation: fadeInUp 1s ease-in-out;
}

.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.sidebar-post {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  animation: fadeInUp 0.8s ease-in-out;
}

.card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.read-more {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.read-more:hover {
  background: #0056b3;
}

.main-post .card-image {
  width: 40%;
  height: auto;
}

.main-post .card-content {
  width: 60%;
}

.sidebar-post .card-image {
  width: 40%;
  height: auto;
}

.sidebar-post .card-content {
  width: 60%;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .main-post {
    flex-direction: column;
  }

  .main-post .card-image,
  .main-post .card-content {
    width: 100%;
  }

  .sidebar-post {
    flex-direction: column;
  }

  .sidebar-post .card-image,
  .sidebar-post .card-content {
    width: 100%;
  }

  /* Adjust font size for bold text on mobile */
  .card-content h2, .card-content h3, .read-more {
    font-size: 1.2rem; /* Adjust as needed */
  }

  .blog-post {
    padding: 1rem 0.5rem; /* Reduce padding on mobile */
  }

  .card {
    margin: 5px; /* Reduce margin for mobile */
  }

  .card-content {
    padding: 15px; /* Reduce padding for mobile */
  }

  .read-more {
    padding: 8px 15px; /* Adjust button padding for mobile */
  }
}
</style>
