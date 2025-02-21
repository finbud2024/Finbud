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
        <div class="trending-event">
            <swiper :slidesPerView="4" :spaceBetween="0" :keyboard="{ enabled: true, }" :pagination="false"
                :navigation="true" :modules="modules" class="event-swiper" :breakpoints="{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        paceBetween: 30,
                    },
                }">
                <swiper-slide v-for="event in trendingEvents" :key="event.title" class="swiper-slide">
                    <div class="event-infor">
                        <div class="image-container">
                            <img v-if="event.urlToImage" :src="event.urlToImage" alt="event.title" class="fade-in" />
                        </div>
                        <h3>{{ event.title }}</h3>
                        <p>{{ new Date(event.publishedAt).toLocaleString() }}</p>
                        <button @click="openEventUrl(event.url, '_blank')" class="event-button">
                            View Event
                        </button>
                    </div>
                </swiper-slide>
            </swiper>
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
    </div>
</template>

<script>
import axios from 'axios';

import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";

import "swiper/css/pagination";

import { Keyboard, Pagination, Navigation, Autoplay } from "swiper/modules";

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
        };
    },
    computed: {

    },
    methods: {
        fetchHeadlines() {
          const apiKey = process.env.VUE_APP_NEWS_API_KEY; 
          axios.get(`https://newsapi.org/v2/top-headlines?category=business&q=AI&apiKey=${apiKey}`)
              .then(response => {
                  if (response.data.status === "ok") {
                      this.trendingEvents = response.data.articles.filter(article => article.urlToImage);
                  } else {
                      console.error('Error fetching articles:', response.data.message);
                  }
              })
              .catch(error => {
                  console.error('Fetch error:', error);
              });
        },
        fetchAllEvents () {
            const apiKey = process.env.VUE_APP_NEWS_API_KEY; 
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1); // Set to yesterday
            const formattedYesterday = yesterday.toISOString().split('T')[0];
            const formattedToday = today.toISOString().split('T')[0];
            
            axios.get(`https://newsapi.org/v2/everything?q=finance&from=${formattedYesterday}&to=${formattedToday}&sortBy=popularity&apiKey=${apiKey}`)
            .then(response => {
                console.log(response.data);
                if (response.data.status === "ok") {
                    this.allEvents = response.data.articles.filter(article => article.urlToImage);
                } else {
                    console.error('Error fetching articles:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        },
        openEventUrl(url) {
            window.open(url, '_blank');
        }
    },
    mounted() {
        this.fetchHeadlines();
        this.fetchAllEvents();
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
    padding: 16px;
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

</style>