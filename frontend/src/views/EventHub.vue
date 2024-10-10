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
                        <p>Explore near you</p>
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
                <swiper-slide v-for="event in trendingEvents" :key="event.name" class="swiper-slide">
                    <div class="event-infor">
                        <div class="image-container">
                            <img :src="event.img" :alt="event.name" class="fade-in" />
                        </div>
                        <h3>{{ event.name }}</h3>
                        <p>{{ event.date }} &#x2022; {{ event.time }}</p>
                        <p>{{ event.location }}</p>
                        <p>{{ event.fee }}</p>
                        <p>{{ event.company }}</p>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="frame3">
            <h1>Hieu Nguyen</h1>

        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { result } from 'lodash';

import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/navigation";

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
            trendingEvents: [
                {
                    name: "National Industrial Real Estate Forum 2024",
                    img: require("@/assets/trendingEvent.png"),
                    date: "Thursday",
                    time: "2: OO PM",
                    location: "Intercontinental Hanoi Landmark Hotel",
                    fee: "Free",
                    company: "VNIC - VIETNAM INVESTMENT CONSULTING"
                },
                {
                    name: "National Industrial Real Estate Forum 2024",
                    img: require("@/assets/trendingEvent.png"),
                    date: "Thursday",
                    time: "2: OO PM",
                    location: "Intercontinental Hanoi Landmark Hotel",
                    fee: "Free",
                    company: "VNIC - VIETNAM INVESTMENT CONSULTING"
                },
                {
                    name: "National Industrial Real Estate Forum 2024",
                    img: require("@/assets/trendingEvent.png"),
                    date: "Thursday",
                    time: "2: OO PM",
                    location: "Intercontinental Hanoi Landmark Hotel",
                    fee: "Free",
                    company: "VNIC - VIETNAM INVESTMENT CONSULTING"
                },
                {
                    name: "National Industrial Real Estate Forum 2024",
                    img: require("@/assets/trendingEvent.png"),
                    date: "Thursday",
                    time: "2: OO PM",
                    location: "Intercontinental Hanoi Landmark Hotel",
                    fee: "Free",
                    company: "VNIC - VIETNAM INVESTMENT CONSULTING"
                },
                {
                    name: "National Industrial Real Estate Forum 2024",
                    img: require("@/assets/trendingEvent.png"),
                    date: "Thursday",
                    time: "2: OO PM",
                    location: "Intercontinental Hanoi Landmark Hotel",
                    fee: "Free",
                    company: "VNIC - VIETNAM INVESTMENT CONSULTING"
                },
                {
                    name: "National Industrial Real Estate Forum 2024",
                    img: require("@/assets/trendingEvent.png"),
                    date: "Thursday",
                    time: "2: OO PM",
                    location: "Intercontinental Hanoi Landmark Hotel",
                    fee: "Free",
                    company: "VNIC - VIETNAM INVESTMENT CONSULTING"
                },
            ],
        };
    },
    computed: {

    },
    methods: {
    },
    mounted() {

    },
};
</script>
<style scoped>
@import "swiper/swiper-bundle.css";

.EventHubContainer {
    width: calc(100vw - 17px);
    height: fit-content;
    display: flex;
    flex-direction: column;
}

.frame1 {
    width: 100%;
    height: 100vh;
}

.event-navbar-container {
    display: flex;
    flex-direction: row;
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
    background-color: rgb(233, 233, 236);
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

.round {
    background-color: #c5d7ea;
    border-radius: 30px;
    width: 60%;
    margin-left: 20px;
}

.event-banner {
    background-color: #007bff;
    width: 100%;
    height: 60vh;
}

.banner-img {
    width: 100%;
}

.event-category h3 {
    text-align: center;
    font-size: 25px;
}

.event-category-bg {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
}

.trending-event {
    width: 100%;
    height: 100vh;
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
/* width: doesn't apply*/

.event-infor {
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    height: 100%;
    border: 2px solid black;
}

.frame3 {
    width: 100%;
    height: 100vh;
    border: 2px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>