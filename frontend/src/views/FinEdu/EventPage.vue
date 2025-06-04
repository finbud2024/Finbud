<template>
    <div class="EventHubContainer">
        <nav class="w-full p-4 bg-white shadow-sm" data-aos="fade-left">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div class="event-navbar relative w-full md:w-1/2">
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            :placeholder="isMobile ? '' : $t('eventHub.searchPlaceholder')" 
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
                        <p v-if="!isMobile">{{ $t('eventHub.exploreNearby') }}</p>
                    </div>
                    <div class="event-btn">
                        <div class="round-star">
                            <font-awesome-icon icon="fa-regular fa-star" class="btn-icon" />
                        </div>
                        <p v-if="!isMobile">{{ $t('eventHub.saved') }}</p>
                    </div>
                    <div class="event-btn">
                        <font-awesome-icon icon="fa-regular fa-bell" class="btn-icon" />
                        <p v-if="!isMobile">{{ $t('eventHub.allEvents') }}</p>
                    </div>
                </div>
            </div>
        </nav>
        <div class="banner">
            <div>
                <div class="banner-content">
                    <h1 class="main-heading">{{ $t('eventHub.dontMiss') }}</h1>
                    <h2 class="sub-heading">{{ $t('eventHub.finDiscover') }}</h2>
                </div>
            </div>
            <img src="https://media.istockphoto.com/id/1529811813/photo/team-building-asian-workshop-participants-in-small-group-discussion-brainstorming-during.jpg?s=612x612&w=0&k=20&c=20R95Z0NkiQJO2EwWGKivBUEwtdAYJrtclReELgoVsw=" alt="">
        </div>
        <EventMap />
        <div class="event-category" data-aos="fade-right">
            <h3 class="text-2xl md:text-3xl text-center">{{ $t('eventHub.eventCategories') }}</h3>
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
                        <h2 class="trending-title">{{ $t('eventHub.trending') }}</h2>
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
        <div class="articles-section">
            <h3 class="text-2xl md:text-3xl mb-6 articles-title">Latest Articles</h3>
            <Articles :articles="articles" /> <!-- Pass articles to the Articles component -->
        </div>
        <div class="frame3" data-aos="flip-left">
            <div class="events-container">
                <h3 class="text-2xl md:text-3xl mb-6 all-events-title">{{ $t('eventHub.allEvents') }}</h3>
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
                                {{ $t('eventHub.readMore') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="loading" class="loading-spinner">Loading...</div> -->
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
import EventMap from '@/components/FinEdu/Event/EventMap.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Articles from '@/components/Articles.vue'; // Adjust the path if necessary
// import api from "@/utils/api";

export default {
    name: 'EventHub',
    components: {
        Swiper,
        SwiperSlide,
        EventMap,
        Articles,
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
            
        };
    },
    computed: {
        topTrendingEvents() {
            return this.trendingEvents.slice(0, 3);
        },
        remainingEvents() {
            return this.trendingEvents.slice(3, 6);
        },
        categories() {
            return [
                { name: this.$t('eventHub.categories.conference'), image: require('@/assets/career fair.png') },
                { name: this.$t('eventHub.categories.workshop'), image: require('@/assets/workshop.png') },
                { name: this.$t('eventHub.categories.webinars'), image: require('@/assets/career fair.png') },
                { name: this.$t('eventHub.categories.networking'), image: require('@/assets/workshop.png') },
                { name: this.$t('eventHub.categories.careerFairs'), image: require('@/assets/career fair.png') }
            ];
            articles: []
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
                
                // Calculate date 30 days ago because freeAPI does not allow us to get news furthur than 30 days ago
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const dateString = thirtyDaysAgo.toISOString().split('T')[0];
                
                const response = await axios.get(
                    `https://api.worldnewsapi.com/search-news?country=us&language=en&categories=business,technology&earliest-publish-date=${dateString}&number=8&api-key=${apiKey}`
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
        },
        switchLanguage(lang) {
        this.$i18n.locale = lang;
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
    min-height: 100vh;
    background: var(--bg-primary);
    padding-bottom: 48px;
}

.event-navbar {
    display: flex;
    align-items: center;
    gap: 24px;
}

.search-bar {
    padding: 14px 18px 14px 48px;
    border-radius: 16px;
    border: 2px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 15px;
    transition: all 0.3s ease;
}

.search-bar:focus {
    border-color: var(--link-color);
    box-shadow: 0 0 0 4px rgba(0,123,255,0.1);
    outline: none;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-size: 18px;
}

.nav-btn {
    display: flex;
    gap: 24px;
}

.event-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.event-btn:hover {
    background: var(--border-color);
}

.round, .round-star {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.round {
    background: linear-gradient(45deg, #FF6B6B, #FF8E8E);
}

.round-star {
    background: linear-gradient(45deg, #FFD93D, #FFE869);
}

.btn-icon {
    font-size: 16px;
    color: white;
}

.banner {
    position: relative;
    height: 400px;
    margin: 32px 0;
    border-radius: 24px;
    overflow: hidden;
}

.banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7);
}

.banner-content {
    position: absolute;
    top: 50%;
    left: 48px;
    transform: translateY(-50%);
    color: white;
    z-index: 1;
}

.main-heading {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 16px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.sub-heading {
    font-size: 24px;
    font-weight: 500;
    opacity: 0.9;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.event-category {
    margin: 48px 0;
}

.event-category h3 {
    margin-bottom: 32px;
    font-weight: 600;
    color: var(--text-primary);
}

.event-category-bg {
    padding: 32px;
    background: var(--card-bg);
    border-radius: 24px;
    border: 1px solid var(--border-color);
}

.category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-btn:hover {
    transform: translateY(-4px);
    background: var(--border-color);
}

.category-img {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    object-fit: cover;
}

.events-section {
    margin: 48px 0;
    padding: 32px;
    background: var(--card-bg);
    border-radius: 24px;
    border: 1px solid var(--border-color);
}

.trending-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: var(--text-primary);
}

.event-item {
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 16px;
    transition: all 0.2s ease;
}

.event-item:hover {
    background: var(--border-color);
}

.event-number {
    font-weight: 500;
    color: var(--text-primary);
}

.event-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 8px;
}

.slider-content {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
}

.slider-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.slider-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
}

.slider-title {
    font-weight: 600;
    margin-bottom: 8px;
}

.slider-meta {
    font-size: 14px;
    opacity: 0.8;
}

.nav-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
}

.nav-button:hover {
    transform: scale(1.1);
}

.nav-icon {
    font-size: 24px;
    color: var(--text-primary);
}

.bottom-articles {
    margin-top: 32px;
}

.article-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.article-card:hover {
    transform: translateY(-4px);
}

.article-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.article-title {
    padding: 16px;
    font-weight: 500;
    color: var(--text-primary);
}

.articles-section {
    margin: 48px 0;
}

.articles-title {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 32px;
}

.frame3 {
    padding: 32px;
    background: var(--card-bg);
    border-radius: 24px;
    border: 1px solid var(--border-color);
}

.all-events-title {
    font-weight: 600;
    color: var(--text-primary);
}

.event-card {
    background: var(--bg-primary);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
}

.event-card:hover {
    transform: translateY(-4px);
    border-color: var(--link-color);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.event-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.event-details {
    padding: 20px;
}

.event-details h2 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
}

.event-details p {
    font-size: 14px;
    color: var(--text-secondary);
}

.event-actions {
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid var(--border-color);
}

.star-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    transition: transform 0.2s ease;
}

.star-button:hover {
    transform: scale(1.2);
}

.read-more-button {
    padding: 8px 16px;
    background: var(--link-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.read-more-button:hover {
    background: var(--hover-bg);
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .banner {
        height: 300px;
    }

    .banner-content {
        left: 24px;
    }

    .main-heading {
        font-size: 32px;
    }

    .sub-heading {
        font-size: 18px;
    }

    .event-category-bg {
        padding: 16px;
    }

    .category-btn {
        padding: 16px;
    }

    .category-img {
        width: 48px;
        height: 48px;
    }

    .events-section {
        padding: 20px;
    }

    .nav-button {
        width: 40px;
        height: 40px;
    }
}
</style>