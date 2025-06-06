<template>
    <div class="EventHubContainer">
        <!-- Loading overlay -->
        <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p class="loading-text">Đang tải dữ liệu sự kiện...</p>
        </div>

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
        <!-- Lazy load EventMap sau khi data đã sẵn sàng -->
        <div v-if="!loading" class="event-map-section">
            <EventMap 
                v-if="trendingEvents.length > 0" 
                :key="'event-map-' + trendingEvents.length"
                @error="handleMapError"
            />
            <div v-else-if="mapError" class="map-error-fallback">
                <div class="error-content">
                    <h3>🗺️ Map Service Unavailable</h3>
                    <p>{{ mapError }}</p>
                    <p>You can still browse events below.</p>
                </div>
            </div>
        </div>
        <div class="event-category" data-aos="fade-right">
            <h3 class="text-2xl md:text-3xl text-center">{{ $t('eventHub.eventCategories') }}</h3>
            <div class="event-category-bg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div v-for="(category, index) in categories" :key="`category-${index}`" class="category-btn">
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
                        <div v-for="(event, index) in topTrendingEvents" :key="`trending-${index}-${event.title}`" class="event-item">
                            <a :href="event.url" class="event-link">
                                <span class="event-number">{{ index + 1 }}. {{ event.title }}</span>
                            </a>
                            <p class="event-description">{{ cropSummary(event.summary) }}</p>
                        </div>
                    </div>

                    <div class="right-div w-full md:w-3/4">
                        <div class="swiper-container">
                            <swiper 
                                :key="`swiper-${remainingEvents.length}`"
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
                                <swiper-slide v-for="(event, index) in remainingEvents" :key="`slide-${index}-${event.title}`" class="swiper-slide">
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
                            <div v-for="(event, index) in remainingEvents.slice(0, 3)" :key="`article-${index}-${event.title}`" class="article-card">
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
        <div class="articles-section" data-aos="fade-up" v-if="articles && articles.length > 0">
            <h3 class="text-2xl md:text-3xl mb-6 articles-title">{{ $t('eventHub.latestArticles') }}</h3>
            <div class="articles-grid">
                <div v-for="(article, index) in articles" :key="`news-article-${index}-${article.title}`" class="article-card" data-aos="fade-up">
                    <div class="article-image-container">
                        <img :src="article.image" :alt="article.title" class="article-image" />
        </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-date">{{ formatDate(article.date) }}</span>
                            <span class="article-category">{{ article.category }}</span>
                        </div>
                        <h4 class="article-title">{{ article.title }}</h4>
                        <p class="article-excerpt">{{ article.excerpt }}</p>
                        <a :href="article.url" target="_blank" class="read-more-link">{{ $t('eventHub.readMore') }} →</a>
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
            mapError: null,
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
        }
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth <= 768;
        },
        formatDate(date) {
            if (!date) return '';
            try {
                return new Date(date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                return date;
            }
        },
        async fetchHeadlines() {
            // Kiểm tra cache để tránh gọi API liên tục
            const cachedData = sessionStorage.getItem('eventHeadlines');
            const cacheTime = sessionStorage.getItem('eventHeadlinesTime');
            const now = Date.now();
            
            // Cache 5 phút (300000ms)
            if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 300000) {
                this.trendingEvents = JSON.parse(cachedData);
                this.loading = false;
                return;
            }

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
                    
                    // Cache data
                    sessionStorage.setItem('eventHeadlines', JSON.stringify(this.trendingEvents));
                    sessionStorage.setItem('eventHeadlinesTime', now.toString());
                    
                    // Không gọi GPT service ngay để tránh lag
                    this.$nextTick(() => {
                        this.generateBotMessage(this.trendingEvents);
                    });
                }
            } catch (error) {
                console.error('Fetch error:', error.response ? error.response.data : error.message);
                // Fallback với empty data để tránh crash
                this.trendingEvents = [];
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
        },
        handleMapError(error) {
            this.mapError = error;
        }
    },
    mounted() {
        // Khởi tạo mobile check trước
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        
        // Delay AOS init để không block UI
        this.$nextTick(() => {
            AOS.init({ duration: 1000, easing: "ease-out" });
        });
        
        // Fetch data với timeout để tránh lag
        setTimeout(() => {
            this.fetchHeadlines();
        }, 100);
    },
    beforeUnmount() {
        // Cải thiện cleanup để tránh lỗi vnode
        window.removeEventListener('resize', this.checkMobile);
        
        // Reset data để tránh reference issues
        this.trendingEvents = [];
        this.allEvents = [];
        this.articles = [];
        
        // Clear cache nếu cần
        if (this.$route.name !== 'EventHub') {
            sessionStorage.removeItem('eventHeadlines');
            sessionStorage.removeItem('eventHeadlinesTime');
        }
    },
    // Thêm beforeDestroy cho Vue 2 compatibility
    beforeDestroy() {
        this.beforeUnmount();
    }
};
</script>

<style scoped>
@import "swiper/swiper-bundle.css";

.EventHubContainer {
    min-height: 100vh;
    background: var(--bg-primary);
    padding-bottom: 48px;
    position: relative;
    max-width: 100%;
    overflow-x: hidden;
}

/* Loading overlay styles */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: loading-spin 1s ease-in-out infinite;
}

.loading-text {
    color: white;
    font-size: 16px;
    margin-top: 20px;
    font-weight: 500;
}

@keyframes loading-spin {
    to { transform: rotate(360deg); }
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
    margin: 4rem 0;
    padding: 2rem;
    background: var(--background-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
}

.articles-title {
    font-size: 2rem;
    color: var(--text-primary);
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.article-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
}

.article-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
}

.article-image-container {
    position: relative;
    padding-top: 60%;
    overflow: hidden;
}

.article-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.article-card:hover .article-image {
    transform: scale(1.05);
}

.article-content {
    padding: 1.5rem;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.article-date, .article-category {
    padding: 0.25rem 0.75rem;
    background: var(--surface-color);
    border-radius: var(--radius-sm);
}

.article-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    line-height: 1.4;
}

.article-excerpt {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.read-more-link {
    display: inline-block;
    color: var(--link-color);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
    }
    
.read-more-link:hover {
    color: var(--hover-bg);
}

@media (max-width: 768px) {
    .banner {
        height: 300px;
        margin: 16px 0;
    }

    .banner-content {
        left: 24px;
        padding-right: 24px;
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
        margin: 24px 0;
    }

    .nav-button {
        width: 40px;
        height: 40px;
    }

    .articles-section {
        padding: 1rem;
        margin: 2rem 0;
    }

    .articles-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .article-title {
        font-size: 1.125rem;
    }

    /* Fix layout break khi sidebar collapse */
    .EventHubContainer {
        width: 100%;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }
}

/* Responsive cho desktop khi sidebar collapse */
@media (min-width: 769px) {
    .EventHubContainer {
        padding-left: 1rem;
        padding-right: 1rem;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }
    
    .banner, 
    .event-category, 
    .events-section, 
    .articles-section {
        margin-left: auto;
        margin-right: auto;
        max-width: calc(100vw - 2rem);
        box-sizing: border-box;
    }
}

/* Map error fallback styles */
.event-map-section {
    margin: 2rem 0;
}

.map-error-fallback {
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    margin: 2rem 0;
}

.error-content h3 {
    color: #495057;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.error-content p {
    color: #6c757d;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}
</style>