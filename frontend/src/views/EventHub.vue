<template>
    <div class="EventHubContainer">
        <div class="frame1">
            <div class="event-navbar-container">
                <div class="event-navbar">
                    <input type="text" v-model="searchQuery" placeholder="Search" class="search-bar" />
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon" />
                </div>

                <div class="event-navbar nav-btn">
                    <div class="event-btn">
                        <div class="round">
                            <font-awesome-icon icon="fa-solid fa-location-dot" class="btn-icon" />
                        </div>
                        <p>Explore Near You</p>
                    </div>
                    <div class="event-btn">
                        <div class="round-star">
                            <font-awesome-icon icon="fa-regular fa-star" class="btn-icon" />
                        </div>
                        <p>Saved</p>
                    </div>
                    <div class="event-btn">
                        <font-awesome-icon icon="fa-regular fa-bell" class="btn-icon" />
                        <p>All Events</p>
                    </div>
                </div>
            </div>
            <div class="event-banner">
                <img :src="require('@/assets/Banner.png')" alt="Banner" class="banner-img" />
            </div>
            <div class="event-category">
                <h3>Event Category that You May Interest</h3>
                <div class="event-category-bg">
                    <div class="category-btn">
                        <img :src="require('@/assets/career fair.png')" alt="Conference" class="category-img" />
                        <p>Conference & Submmit</p>
                    </div>
                    <div class="category-btn">
                        <img :src="require('@/assets/workshop.png')" alt="Conference" class="category-img" />
                        <p>Workshop & Training</p>
                    </div>
                    <div class="category-btn">
                        <img :src="require('@/assets/career fair.png')" alt="Conference" class="category-img" />
                        <p>Webinars</p>
                    </div>
                    <div class="category-btn">
                        <img :src="require('@/assets/workshop.png')" alt="Conference" class="category-img" />
                        <p>Networking</p>
                    </div>
                    <div class="category-btn">
                        <img :src="require('@/assets/career fair.png')" alt="Conference" class="category-img" />
                        <p>Career Fairs & Recruitement</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="rounded-xl md:bg-white md:p-4">
            <section class="events-section">
                <div class="content-wrapper">
                    <!-- Left Div for Top 5 Trending Events -->
                    <div class="left-div">
                        <h2 class="trending-title">Trending</h2>
                        <div v-for="(event, index) in topTrendingEvents" :key="index" class="event-item">
                            <a :href="event.url" class="event-link">
                                <span class="event-number">{{ index + 1 }}. {{ event.title }}</span>
                            </a>
                            <p class="event-description">{{ event.description }}</p>
                        </div>
                    </div>

                    <!-- Right Div for Remaining Events -->
                    <div class="right-div">
                        <!-- Top Part: Swiper Slider -->
                        <div class="swiper-container">
                            <swiper 
                                :slidesPerView="1" 
                                :spaceBetween="0" 
                                :pagination="false" 
                                :navigation="{
                                    nextEl: '.next-button',
                                    prevEl: '.prev-button'
                                }" 
                                :modules="modules"
                                :autoplay="{
                                    delay: 3000,
                                    disableOnInteraction: false
                                }"
                                class="swiper"
                            >
                                <swiper-slide v-for="(event, index) in remainingEvents" :key="index" class="swiper-slide">
                                    <a :href="event.url" target="_blank" class="slider-link">
                                        <div class="slider-content">
                                            <div class="slider-image-container">
                                                <img :src="event.urlToImage" alt="Event image" class="slider-image" />
                                            </div>
                                            <div class="slider-info">
                                                <h3 class="slider-title">{{ event.title }}</h3>
                                                <p class="slider-meta">{{ event.source.name }} | {{ event.author }}</p>
                                            </div>
                                        </div>
                                    </a>
                                </swiper-slide>
                            </swiper>
                            <div class="swiper-nav-buttons">
                                <button class="nav-button prev-button">
                                    <i class="fas fa-angle-left nav-icon icon-size"></i>
                                </button>
                                <button class="nav-button next-button">
                                    <i class="fas fa-angle-right nav-icon icon-size"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Bottom Part: Nine Articles -->
                        <div class="bottom-articles">
                            <div v-for="(event, index) in remainingEvents.slice(0, 9)" :key="index" class="article-card">
                                <a :href="event.url" class="article-link">
                                    <img :src="event.urlToImage" alt="Event image" class="article-image" />
                                    <p class="article-title">{{ event.title }}</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div class="frame3">
            <div class="events-container">
                <h3>All events</h3>
                <div class="grid-container">
                    <div v-for="(event, index) in allEvents" :key="index" class="event-card">
                        <img v-if="event.urlToImage" :src="event.urlToImage" alt="Event image" class="event-image" />
                        <div class="event-details">
                            <h2>{{ event.title }}</h2>
                            <p>{{ new Date(event.publishedAt).toLocaleString()  }}</p>
                        </div>
                        <div class="event-actions">
                            <button class="star-button">⭐</button>
                            <button class="read-more-button" @click="openEventUrl(event.url, '_blank')">
                                Read more
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" class="loading-spinner">Loading...</div>
    </div>
</template>

<script>
import axios from 'axios';

import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";

import "swiper/css/pagination";

import "swiper/css/navigation";

import { Keyboard, Pagination, Navigation, Autoplay } from "swiper/modules";
import { gptNewsService } from '@/services/gptServices';

export default {
    name: 'EventHub',
    components: {
        Swiper,
        SwiperSlide,
    },

    data() {
        return {//state declare here
            modules: [Keyboard, Pagination, Navigation, Autoplay],
            trendingEvents: [],
            allEvents: [],
            loading: false,
            botMessage: "Hello World", // Set the bot message
            displayedMessage: "",
            isTyping: false,
            typingSpeed: 100, // Adjust typing speed if needed
        };
    },
    computed: {
        topTrendingEvents() {
            return this.trendingEvents.slice(0, 5); // Get top 5 events
        },
        remainingEvents() {
            return this.trendingEvents.slice(5); // Get remaining events
        },
    },
    methods: {
        fetchHeadlines() {
          const apiKey = process.env.VUE_APP_NEWS_API_KEY; 
          axios.get(`https://newsapi.org/v2/top-headlines?category=business&q=AI&apiKey=${apiKey}`)
              .then(response => {
                  if (response.data.status === "ok") {
                      this.trendingEvents = response.data.articles.filter(article => article.urlToImage);
                      this.generateBotMessage(this.trendingEvents);
                  } else {
                      console.error('Error fetching articles:', response.data.message);
                  }
              })
              .catch(error => {
                  console.error('Fetch error:', error);
              });
        },

        async generateBotMessage(articles) {
            if (!articles.length) return;
            let message = "";

            const additionalMessages = [
                {
                    role: "user",
                    content: "Please sort these articles based on the defined priorities."
                }
            ];

            try {
                message = await gptNewsService(additionalMessages, this.trendingEvents);
                this.$emit('finbudBotResponse', message);
            } catch (error) {
                console.error("GPT Service Error:", error);
            }
        },

        openEventUrl(url) {
            window.open(url, '_blank');
        }
    },
    mounted() {
        this.fetchHeadlines();
    },
};
</script>
<style scoped>
@import "swiper/swiper-bundle.css";

.EventHubContainer {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
}

.frame1 {
    width: 100%;
    height: fit-content;
}


.event-navbar-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
}

.event-navbar {
    position: relative;
    width: 50%;
    margin: 10px;
}

.search-bar {
    width: 70%;
    font-size: 18px;
    padding: 10px;
    margin: 20px;
    box-sizing: border-box;
    z-index: 100;
    border-radius: 28px;
    border: 4px solid #007bff;
}

.search-bar:focus {
    outline: none;
    border: 4px solid #007bff;
}

.search-icon {
    position: absolute;
    right: 30%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    cursor: pointer;
}

.nav-btn {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    margin-right: 50px;
    margin-left: 50px;
}

.nav-btn p {
    font-size: 14px;
}

.event-btn {
    margin-top: 10px;
    cursor: pointer;
}

.event-btn:hover {
    color: #007bff;
}

.btn-icon {
    font-size: 18px;
    padding: 5px;
}

.event-banner {
    background-color: #007bff;
    justify-content: center;
    align-items: center;
    height: auto;
}

.banner-img {
    width: 100%;
    height: auto;
}

.event-category h3 {
    text-align: center;
    font-size: 3rem;
}

.event-category-bg {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    margin: 0 50px 50px 50px;
    background-color: #007bff;
}

.category-btn {
    color: #fff;
    cursor: pointer;
    padding: 15px 40px 5px 40px;
}

.category-btn p {
    font-size: 15px;
}

.category-img {
    width: 25%;
    filter: brightness(0) invert(1); 

}

.trending-event {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(25%-30px);
}

.event-infor {
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 16px;
}

.frame3 {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.events-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px;
}

.events-container h3 {
    font-size: 3rem;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: 90%;
    margin: 0 auto;
}

.event-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;
    margin: 20px;
}

.event-image {
    width: 100%;
    height: 150px;
    background-color: #f0f0f0;
    object-fit: cover;
    margin-bottom: 10px;
}

.event-details {
    flex: 1;
}

.event-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.read-more-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.read-more-button, .event-button:hover {
    background-color: #005bb5;
}

.star-button {
    width: 42px; 
    height: 42px; 
    border-radius: 50%; 
    background-color: #007bff;
    color: white;
    border: none;
    display: flex; 
    align-items: center; 
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    padding: 0; 
}

.star-button:hover {
    background-color: #005bb5;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 1000px;
    height: 80%;
    align-items: center;
    overflow-y: auto;
}

.modal-secondline h3 {
    width: fit-content;
    padding: 0;
    margin: 0;
}

.modal-secondline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: fit-content;
}

.register-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.register-button:hover {
    background-color: #0056b3;
}

.modal-image {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
}

.close-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.close-button:hover {
    background-color: #0056b3;
}

@media (max-width: 600px) {

    .search-bar {
        height: 40px;
        padding: 5px;
        font-size: 0;
        text-align: center; 
        overflow: hidden; 
        transition: width 0.3s ease;
    }
    
    .event-category h3 {
        font-size: 2rem; 
    }

    .events-container h3 {
        font-size: 2rem; 
    }

    .grid-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .nav-btn p {
        font-size: 0;
    }
}

.image-container {
    width: 100%; 
    height: 250px; 
    overflow: hidden; 
    display: flex; 
    justify-content: center; 
    align-items: center;
}

.image-container img {
    width: 100%; 
    height: 100%;
    object-fit: cover; 
}

.event-button {
    background-color: #007bff; 
    color: white; 
    border: none; 
    border-radius: 5px; 
    padding: 10px 20px; 
    cursor: pointer; 
    transition: background-color 0.3s ease; 
}

.image-container {
    width: 100%; 
    height: 250px; 
    overflow: hidden; 
    display: flex; 
    justify-content: center; 
    align-items: center;
}

.image-container img {
    width: 100%; 
    height: 100%;
    object-fit: cover; 
}

.event-button {
    background-color: #007bff; 
    color: white; 
    border: none; 
    border-radius: 5px; 
    padding: 10px 20px; 
    cursor: pointer; 
    transition: background-color 0.3s ease; 
}

.left-div {
    border-right: 1px solid #e0e0e0; /* Optional: Add a border to separate the two sections */
}

.swiper-container {
    width: 100%;
    height: 600px;
    position: relative;
    margin-bottom: 24px;
}

.bottom-article img {
    height: 300px; /* Set height for bottom articles */
}

.events-section {
    width: 100%;
    padding: 20px;
}

.content-wrapper {
    display: flex;
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.left-div {
    width: 25%;
    padding: 20px;
    border-right: 1px solid #e0e0e0;
    min-height: 600px;
}

.right-div {
    width: 75%;
    padding: 20px;
    position: relative;
}

.trending-title {
    color: #007bff;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
}

.event-item {
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.event-link {
    text-decoration: none;
    color: #333;
}

.event-link:hover {
    text-decoration: underline;
    color: #0056b3; /* Change to a darker shade */
}

.event-number {
    font-weight: bold;
    font-size: 1.1rem;
}

.event-description {
    color: #666;
    margin-top: 8px;
    font-size: 0.95rem; /* Slightly larger for readability */
}

.slider-content {
    position: relative;
    width: 100%;
    height: 100%;
}

.slider-image-container {
    width: 100%;
    height: 600px; /* Fixed height */
    overflow: hidden;
    position: relative;
}

.slider-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
}

.slider-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
}

.slider-title {
    font-size: 1.8rem; /* Increase size for emphasis */
    font-weight: 600; /* Use a bolder weight */
    margin-bottom: 8px;
}

.slider-meta {
    font-size: 0.9rem;
    opacity: 0.8;
}

.swiper-nav-buttons {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 12px;
    z-index: 10;
}

.nav-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: black;  /* Black background */
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.nav-button:hover {
    background-color: white;  /* White background on hover */
    transform: scale(1.1); /* Slightly enlarge the button */
}

.nav-icon {
    color: white;  /* White arrow color */
    transition: all 0.3s ease;
}

.nav-button:hover .nav-icon {
    color: #007bff;  /* Blue arrow on hover */
}

.bottom-articles {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
    gap: 20px;
    margin-top: 24px;
}

.article-card {
    height: auto;
    margin-bottom: 20px;
}

.article-link {
    text-decoration: none;
    color: #333;
}

.article-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
}

.article-title {
    margin-top: 12px;
    font-size: 1.1rem;
    line-height: 1.4;
    text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .content-wrapper {
        flex-direction: column;
    }

    .left-div, .right-div {
        width: 100%;
        border-right: none;
    }

    .left-div {
        border-bottom: 1px solid #e0e0e0;
        min-height: auto;
        padding-bottom: 20px;
    }

    .swiper-container {
        height: 400px;
    }

    .slider-image-container {
        height: 350px;
    }
    
    .bottom-articles {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    }
}

@media (max-width: 768px) {
    .bottom-articles {
        grid-template-columns: 1fr; /* 1 column on small screens */
    }

    .slider-image-container {
        height: 250px;
    }
}

.icon-size {
    font-size: 24px; /* Set the font size to 24px */
}

.slider-link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: relative;
}

.slider-link:hover .slider-image {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

.slider-link:hover .slider-title {
    text-decoration: underline;
}

.slider-image {
    transition: transform 0.3s ease;
}
</style>