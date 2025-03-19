<template>
    <div class="EventHubContainer">
        <nav class="w-full p-4 bg-white shadow-sm" data-aos="fade-left">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="event-navbar relative w-full md:w-1/2">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        :placeholder="isMobile ? '' : 'Search events...'" 
                        class="search-bar w-full"
                        @focus="searchExpanded = true"
                        @blur="searchExpanded = false"
                    />
                    <font-awesome-icon 
                        icon="fa-solid fa-magnifying-glass" 
                        class="search-icon"
                    />
                </div>

                <div class="event-navbar nav-btn">
                    <div class="event-btn">
                        <div class="round">
                            <font-awesome-icon icon="fa-solid fa-location-dot" class="btn-icon" />
                        </div>
                        <p v-if="!isMobile">Explore Near You</p>
                    </div>
                    <div class="event-btn">
                        <div class="round-star">
                            <font-awesome-icon icon="fa-regular fa-star" class="btn-icon" />
                        </div>
                        <p v-if="!isMobile">Saved</p>
                    </div>
                    <div class="event-btn">
                        <font-awesome-icon icon="fa-regular fa-bell" class="btn-icon" />
                        <p v-if="!isMobile">All Events</p>
                    </div>
                </div>
            </div>
        </nav>
        <div class="event-banner" data-aos="flip-left">
            <img :src="require('@/assets/Banner.png')" alt="Banner" class="banner-img" />
        </div>
        <div class="event-category" data-aos="fade-right">
            <h3 class="text-2xl md:text-3xl text-center">Event Categories You May Like</h3>
            <div class="event-category-bg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div v-for="(category, index) in categories" :key="index" class="category-btn">
                    <img :src="category.image" :alt="category.name" class="category-img" />
                    <p>{{ category.name }}</p>
                </div>
            </div>
        </div>
        <div class="rounded-xl md:bg-white md:p-4" data-aos="fade-right">
            <section class="events-section">
                <div class="content-wrapper flex flex-col md:flex-row">
                    <div class="left-div w-full md:w-1/4 mb-6 md:mb-0">
                        <h2 class="trending-title">Trending</h2>
                        <div v-for="(event, index) in topTrendingEvents" :key="index" class="event-item">
                            <a :href="event.url" class="event-link">
                                <span class="event-number">{{ index + 1 }}. {{ event.title }}</span>
                            </a>
                            <p class="event-description">{{ cropSummary(event.summary) }}</p>
                        </div>
                    </div>

                    <div class="right-div w-full md:w-3/4">
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
                                            <div class="slider-image-container h-48 md:h-96">
                                                <img :src="event.image" alt="Event image" class="slider-image" />
                                            </div>
                                            <div class="slider-info">
                                                <h3 class="slider-title text-lg md:text-xl">{{ event.title }}</h3>
                                                <p class="slider-meta">{{ event.author }}</p>
                                            </div>
                                        </div>
                                    </a>
                                </swiper-slide>
                            </swiper>
                            <div class="swiper-nav-buttons">
                                <button class="nav-button prev-button">
                                    <i class="fas fa-angle-left nav-icon"></i>
                                </button>
                                <button class="nav-button next-button">
                                    <i class="fas fa-angle-right nav-icon"></i>
                                </button>
                            </div>
                        </div>

                        <div class="bottom-articles grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="(event, index) in remainingEvents.slice(0, 3)" :key="index" class="article-card">
                                <a :href="event.url" class="article-link">
                                    <img :src="event.image" alt="Event image" class="article-image" />
                                    <p class="article-title">{{ event.title }}</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div class="frame3" data-aos="flip-left">
            <div class="events-container">
                <h3 class="text-2xl md:text-3xl mb-6">All Events</h3>
                <div class="grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(event, index) in allEvents.slice(0, 3)" :key="index" class="event-card" data-aos="fade-left">
                        <img v-if="event.image" :src="event.image" alt="Event image" class="event-image"/>
                        <div class="event-details">
                            <h2>{{ event.title }}</h2>
                            <p>{{ new Date(event.publish_date).toLocaleString() }}</p>
                        </div>
                        <div class="event-actions">
                            <button class="star-button">⭐</button>
                            <button class="read-more-button" @click="openEventUrl(event.url)">
                                Read more
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="loading" class="loading-spinner">Loading...</div> -->
        <EventMap />
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
import EventMap from '@/components/EventMap.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
    name: 'EventHub',
    components: {
        Swiper,
        SwiperSlide,
        EventMap,
    },
    data() {
        return {
            modules: [Keyboard, Pagination, Navigation, Autoplay],
            trendingEvents: [],
            allEvents: [],
            loading: false,
            searchQuery: '',
            searchExpanded: false,
            isMobile: false,
            categories: [
                { name: 'Conference & Summit', image: require('@/assets/career fair.png') },
                { name: 'Workshop & Training', image: require('@/assets/workshop.png') },
                { name: 'Webinars', image: require('@/assets/career fair.png') },
                { name: 'Networking', image: require('@/assets/workshop.png') },
                { name: 'Career Fairs', image: require('@/assets/career fair.png') }
            ]
        };
    },
    computed: {
        topTrendingEvents() {
            return this.trendingEvents.slice(0, 3);
        },
        remainingEvents() {
            return this.trendingEvents.slice(3, 6);
        }
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth <= 768;
        },
        async fetchHeadlines() {
            this.loading = true;
            try {
                const apiKey = process.env.VUE_APP_NEWS_API_KEY;
                const response = await axios.get(
                    `https://api.worldnewsapi.com/search-news?country=us&language=en&categories=business,technology&earliest-publish-date=2025-02-24&number=8&api-key=${apiKey}`
                );
                if (response.data.news) {
                    this.trendingEvents = response.data.news.filter(article => article.image);
                    await this.generateBotMessage(this.trendingEvents);
                }
            } catch (error) {
                console.error('Fetch error:', error.response ? error.response.data : error.message);
            } finally {
                this.loading = false;
            }
        },
        async generateBotMessage(articles) {
            if (!articles.length) return;
            try {
                const message = await gptNewsService(
                    [{ role: "user", content: "Please sort these articles based on the defined priorities." }],
                    this.trendingEvents
                );
                this.$emit('finbudBotResponse', message);
            } catch (error) {
                console.error("GPT Service Error:", error);
            }
        },
        openEventUrl(url) {
            window.open(url, '_blank');
        },
        cropSummary(summary) {
            if (!summary) return "";
            const maxLength = 106; // Length of the reference summary
            return summary.length > maxLength ? summary.substring(0, maxLength) + "..." : summary;
        }
    },
    mounted() {
        this.fetchHeadlines();
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        AOS.init({ duration: 1000, easing: "ease-out" });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkMobile);
    }
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
    margin: 10px
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
    padding: 10px;
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

@media (max-width: 768px) {
    .search-bar {
        width: 100%;
        font-size: 14px;
        padding: 8px 16px;
    }

    .event-navbar-container {
        flex-direction: column;
    }

    .event-navbar {
        width: 100%;
        margin: 5px;
    }

    .nav-btn {
        margin: 10px 0;
        width: 100%;
        justify-content: space-around;
    }

    .event-category h3,
    .events-container h3 {
        font-size: 1.5rem;
    }

    .event-category-bg {
        margin: 0 20px 20px 20px;
    }

    .category-btn {
        padding: 10px 20px;
    }

    .category-img {
        width: 40%;
    }

    .grid-container {
        grid-template-columns: 1fr;
        width: 95%;
    }

    .event-card {
        margin: 10px;
    }

    .slider-image-container {
        height: 200px;
    }

    .slider-title {
        font-size: 1.2rem;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .grid-container {
        grid-template-columns: repeat(2, 1fr);
    }

    .event-category-bg {
        grid-template-columns: repeat(3, 1fr);
    }

    .slider-image-container {
        height: 400px;
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