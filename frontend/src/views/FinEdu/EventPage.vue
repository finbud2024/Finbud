<template>
    <div class="EventHubContainer">
        <!-- Loading overlay -->
        <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p class="loading-text">{{ $t('eventHub.loadingEvents') }}</p>
        </div>

        <!-- Hero Section - Events.com Style -->
        <div class="hero-section" data-aos="fade-down">
            <div class="hero-content">
                <h1 class="hero-title">{{ $t('eventHub.heroTitle') }}</h1>
                <p class="hero-subtitle">{{ $t('eventHub.heroSubtitle') }}</p>
                
                <!-- Enhanced Search Bar -->
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon" />
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            :placeholder="$t('eventHub.searchPlaceholder')" 
                            class="hero-search-bar"
                        />
                    </div>
                    <div class="location-input-wrapper">
                        <font-awesome-icon icon="fa-solid fa-location-dot" class="location-icon" />
                        <input 
                            type="text" 
                            v-model="locationQuery" 
                            :placeholder="$t('eventHub.locationPlaceholder')" 
                            class="location-search-bar"
                        />
                    </div>
                </div>
                
                <p class="event-count">{{ $t('eventHub.discoverEvents', { count: trendingEvents.length }) }}</p>
            </div>
        </div>
        <!-- Categories Section - Horizontal Scrollable Pills -->
        <div class="categories-section" data-aos="fade-right">
            <div class="categories-scroll">
                <button 
                    v-for="(category, index) in categories" 
                    :key="`category-${index}`" 
                    :class="['category-pill', { active: selectedCategory === category.key }]"
                    @click="filterByCategory(category.key)"
                >
                    <span class="category-icon">{{ category.icon }}</span>
                    <span class="category-name">{{ category.name }}</span>
                </button>
            </div>
        </div>

        <!-- Map Toggle Button -->
        <div class="view-controls" data-aos="fade-up">
            <button @click="toggleMapView" class="map-toggle-btn">
                <font-awesome-icon :icon="showMap ? 'fa-solid fa-list' : 'fa-solid fa-map'" />
                <span>{{ showMap ? $t('eventHub.showList') : $t('eventHub.showMap') }}</span>
            </button>
        </div>

        <!-- Map View (Toggleable, Default Hidden) -->
        <div v-if="!loading && showMap" class="event-map-section" data-aos="fade-in">
            <EventMap 
                v-if="trendingEvents.length > 0" 
                :key="'event-map-' + trendingEvents.length"
                @error="handleMapError"
            />
            <div v-else-if="mapError" class="map-error-fallback">
                <div class="error-content">
                    <h3>🗺️ {{ $t('eventHub.mapUnavailable') }}</h3>
                    <p>{{ mapError }}</p>
                    <p>{{ $t('eventHub.browseBelow') }}</p>
                </div>
            </div>
        </div>
        <!-- Featured Events Grid - Events.com Style -->
        <section class="events-section" data-aos="fade-up">
            <!-- Show error message if no events loaded -->
            <div v-if="!loading && filteredEvents.length === 0" class="no-events-message">
                <div class="error-content">
                    <h3>📰 {{ $t('eventHub.noEventsTitle') }}</h3>
                    <p>{{ $t('eventHub.noEventsDescription') }}</p>
                </div>
            </div>
            
            <!-- Event Cards Grid -->
            <div v-else class="events-grid">
                <div 
                    v-for="(event, index) in filteredEvents" 
                    :key="`event-${index}-${event.title}`" 
                    class="event-card"
                    data-aos="fade-up"
                    :data-aos-delay="index * 50"
                >
                    <a :href="event.url" target="_blank" class="event-card-link">
                        <div class="event-image-container">
                            <img 
                                :src="event.image" 
                                :alt="event.title" 
                                class="event-image"
                                @error="handleImageError($event, index)"
                            />
                            <div class="event-date-badge">
                                {{ formatEventDate(event.publish_date) }}
                            </div>
                        </div>
                        <div class="event-info">
                            <h3 class="event-title">{{ event.title }}</h3>
                            <p class="event-description">{{ cropSummary(event.text || event.summary) }}</p>
                            <div class="event-meta">
                                <span class="event-source">
                                    <font-awesome-icon icon="fa-solid fa-newspaper" />
                                    {{ event.authors?.[0] || event.source_country || 'Financial News' }}
                                </span>
                            </div>
                            <button class="event-learn-more">{{ $t('eventHub.learnMore') }} →</button>
                        </div>
                    </a>
                </div>
            </div>
        </section>
        
        <!-- Trending Cities Section (Replaces Sidebar) -->
        <section class="trending-cities-section" data-aos="fade-up" v-if="trendingEvents.length > 0">
            <h3 class="section-title">{{ $t('eventHub.trendingCities') }}</h3>
            <div class="cities-grid">
                <div 
                    v-for="(city, index) in trendingCities" 
                    :key="`city-${index}`" 
                    class="city-card"
                    @click="filterByCity(city.name)"
                >
                    <span class="city-name">{{ city.name }}</span>
                    <span class="city-count">{{ city.count }} {{ $t('eventHub.events') }}</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
import { gptNewsService } from '@/services/gptServices';
import EventMap from '@/components/FinEdu/Event/EventMap.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
    name: 'EventHub',
    components: {
        EventMap,
    },
    data() {
        return {
            trendingEvents: [],
            loading: false,
            searchQuery: '',
            locationQuery: '',
            selectedCategory: null,
            showMap: false,
            mapError: null,
            fallbackImages: [
                'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop'
            ],
        };
    },
    computed: {
        filteredEvents() {
            let events = this.trendingEvents;
            
            // Filter by selected category
            if (this.selectedCategory) {
                const categoryKeywords = {
                    'Business': ['business', 'company', 'corporate', 'enterprise'],
                    'Conference': ['conference', 'summit', 'event', 'meeting'],
                    'Technology': ['tech', 'technology', 'digital', 'software', 'ai', 'artificial intelligence'],
                    'Finance': ['finance', 'financial', 'money', 'banking', 'investment'],
                    'Workshop': ['workshop', 'training', 'seminar', 'course'],
                    'Webinars': ['webinar', 'online', 'virtual', 'livestream'],
                    'Networking': ['networking', 'connect', 'meetup', 'community'],
                    'Crypto': ['crypto', 'cryptocurrency', 'bitcoin', 'blockchain', 'ethereum']
                };
                
                const keywords = categoryKeywords[this.selectedCategory] || [];
                if (keywords.length > 0) {
                    events = events.filter(event => {
                        const text = `${event.title} ${event.text || ''}`.toLowerCase();
                        return keywords.some(keyword => text.includes(keyword));
                    });
                }
            }
            
            // Filter by search query
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase().trim();
                events = events.filter(event =>
                    event.title?.toLowerCase().includes(query) ||
                    event.text?.toLowerCase().includes(query) ||
                    event.summary?.toLowerCase().includes(query)
                );
            }
            
            // Filter by location
            if (this.locationQuery.trim()) {
                const location = this.locationQuery.toLowerCase().trim();
                events = events.filter(event =>
                    event.source_country?.toLowerCase().includes(location) ||
                    event.authors?.[0]?.toLowerCase().includes(location)
                );
            }
            
            return events;
        },
        categories() {
            return [
                { name: this.$t('eventHub.categories.business'), icon: '💼', key: 'Business' },
                { name: this.$t('eventHub.categories.conference'), icon: '🎤', key: 'Conference' },
                { name: this.$t('eventHub.categories.technology'), icon: '💻', key: 'Technology' },
                { name: this.$t('eventHub.categories.finance'), icon: '📊', key: 'Finance' },
                { name: this.$t('eventHub.categories.workshop'), icon: '🛠️', key: 'Workshop' },
                { name: this.$t('eventHub.categories.webinars'), icon: '📹', key: 'Webinars' },
                { name: this.$t('eventHub.categories.networking'), icon: '🤝', key: 'Networking' },
                { name: this.$t('eventHub.categories.crypto'), icon: '₿', key: 'Crypto' }
            ];
        },
        trendingCities() {
            // Country code to full name mapping
            const countryNames = {
                'us': 'United States',
                'gb': 'United Kingdom',
                'in': 'India',
                'ca': 'Canada',
                'au': 'Australia',
                'de': 'Germany',
                'fr': 'France',
                'jp': 'Japan',
                'cn': 'China',
                'br': 'Brazil',
                'mx': 'Mexico',
                'es': 'Spain',
                'it': 'Italy',
                'nl': 'Netherlands',
                'se': 'Sweden',
                'ch': 'Switzerland',
                'sg': 'Singapore',
                'hk': 'Hong Kong',
                'ae': 'UAE',
                'za': 'South Africa',
                'ng': 'Nigeria',
                'gh': 'Ghana',
                'ke': 'Kenya',
                'eg': 'Egypt'
            };
            
            // Extract unique cities from events
            const cityMap = {};
            this.trendingEvents.forEach(event => {
                const countryCode = (event.source_country || 'us').toLowerCase();
                const countryName = countryNames[countryCode] || countryCode.toUpperCase();
                cityMap[countryName] = (cityMap[countryName] || 0) + 1;
            });
            
            return Object.entries(cityMap)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6);
        }
    },
    methods: {
        toggleMapView() {
            this.showMap = !this.showMap;
        },
        filterByCategory(categoryKey) {
            // Toggle category selection (click again to deselect)
            this.selectedCategory = this.selectedCategory === categoryKey ? null : categoryKey;
        },
        filterByCity(cityName) {
            // Map full country names back to codes for filtering
            const countryNameToCode = {
                'United States': 'us',
                'United Kingdom': 'gb',
                'India': 'in',
                'Canada': 'ca',
                'Australia': 'au',
                'Germany': 'de',
                'France': 'fr',
                'Japan': 'jp',
                'China': 'cn',
                'Brazil': 'br',
                'Mexico': 'mx',
                'Spain': 'es',
                'Italy': 'it',
                'Netherlands': 'nl',
                'Sweden': 'se',
                'Switzerland': 'ch',
                'Singapore': 'sg',
                'Hong Kong': 'hk',
                'UAE': 'ae',
                'South Africa': 'za',
                'Nigeria': 'ng',
                'Ghana': 'gh',
                'Kenya': 'ke',
                'Egypt': 'eg'
            };
            
            // Try to find the country code, otherwise use the name as-is
            const countryCode = countryNameToCode[cityName] || cityName.toLowerCase();
            this.locationQuery = countryCode;
        },
        containsChinese(text) {
            // Check if text contains Chinese, Japanese, or Korean characters
            const cjkRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/;
            return cjkRegex.test(text);
        },
        handleImageError(event, index) {
            // Replace broken image with a fallback image
            event.target.src = this.fallbackImages[index % this.fallbackImages.length];
            // Prevent infinite loop if fallback also fails
            event.target.onerror = null;
        },
        formatDate(date) {
            if (!date) return '';
            try {
                return new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                return date;
            }
        },
        formatEventDate(date) {
            if (!date) return '';
            try {
                const d = new Date(date);
                const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const day = d.getDate();
                return `${month} ${day}`;
            } catch (error) {
                return '';
            }
        },
        async fetchHeadlines() {
            // Kiểm tra cache để tránh gọi API liên tục
            const cachedData = sessionStorage.getItem('eventHeadlines');
            const cacheTime = sessionStorage.getItem('eventHeadlinesTime');
            const now = Date.now();
            
            // Cache 30 seconds (30000ms) for testing - change back to 300000 for production
            if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 30000) {
                try {
                    this.trendingEvents = JSON.parse(cachedData);
                    this.loading = false;
                    return;
                } catch (error) {
                    console.warn('⚠️ Failed to parse cached data, fetching fresh data', error);
                    // Clear corrupted cache
                    sessionStorage.removeItem('eventHeadlines');
                    sessionStorage.removeItem('eventHeadlinesTime');
                }
            }

            this.loading = true;
            try {
                const apiKey = process.env.VUE_APP_NEWS_API_KEY;
                
                // Calculate date 30 days ago because freeAPI does not allow us to get news furthur than 30 days ago
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const dateString = thirtyDaysAgo.toISOString().split('T')[0];
                
                // Get finance and technology news
                const response = await axios.get(
                    `https://api.worldnewsapi.com/search-news?text=finance&language=en&earliest-publish-date=${dateString}&number=20&api-key=${apiKey}`
                );
                if (response.data.news) {
                    // Fallback images for events without images (finance/business themed)
                    const fallbackImages = [
                        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop', // Stock market charts
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Business data analysis
                        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop', // Cryptocurrency coins
                        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop', // Trading desk
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', // Data charts on laptop
                        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop', // Math and finance
                        'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop', // Stock exchange board
                        'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&h=600&fit=crop', // Office building finance
                        'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?w=800&h=600&fit=crop', // Business meeting
                        'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop'  // Investment planning
                    ];
                    
                    // Filter for English language only
                    const filteredArticles = response.data.news
                        .filter(article => 
                            article.language === 'en' &&
                            article.title && 
                            !this.containsChinese(article.title)
                        );
                    
                    // Track used images to detect duplicates
                    const usedImages = new Set();
                    let fallbackIndex = 0;
                    let duplicatesReplaced = 0;
                    
                    // Map articles and replace duplicate/missing images
                    this.trendingEvents = filteredArticles.map((article, index) => {
                        let imageUrl = article.image;
                        const originalUrl = imageUrl;
                        
                        // If no image or duplicate image detected, use fallback
                        if (!imageUrl || usedImages.has(imageUrl)) {
                            imageUrl = fallbackImages[fallbackIndex % fallbackImages.length];
                            fallbackIndex++;
                            duplicatesReplaced++;
                            console.log(`🔄 Duplicate detected for "${article.title.substring(0, 50)}..." - replaced with fallback`);
                        } else {
                            usedImages.add(imageUrl);
                        }
                        
                        return {
                            ...article,
                            image: imageUrl
                        };
                    });
                    
                    console.log(`✅ Event images processed: ${this.trendingEvents.length} total, ${duplicatesReplaced} duplicates replaced`);
                    
                    // Cache data
                    sessionStorage.setItem('eventHeadlines', JSON.stringify(this.trendingEvents));
                    sessionStorage.setItem('eventHeadlinesTime', now.toString());
                    
                    // Không gọi GPT service ngay để tránh lag
                    this.$nextTick(() => {
                        this.generateBotMessage(this.trendingEvents);
                    });
                }
            } catch (error) {
                console.error('❌ WorldNewsAPI Fetch Error:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    apiKeyPresent: !!process.env.VUE_APP_NEWS_API_KEY,
                    apiKeyLength: process.env.VUE_APP_NEWS_API_KEY?.length
                });
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
        cropSummary(summary) {
            if (!summary) return "";
            const maxLength = 150;
            return summary.length > maxLength ? summary.substring(0, maxLength) + "..." : summary;
        },
        handleMapError(error) {
            this.mapError = error;
        }
    },
    mounted() {
        // Initialize AOS
        this.$nextTick(() => {
            AOS.init({ duration: 1000, easing: "ease-out" });
        });
        
        // Fetch data
        setTimeout(() => {
            this.fetchHeadlines();
        }, 100);
    },
    beforeUnmount() {
        // Reset data
        this.trendingEvents = [];
        
        // Clear cache if leaving page
        if (this.$route.name !== 'EventHub') {
            sessionStorage.removeItem('eventHeadlines');
            sessionStorage.removeItem('eventHeadlinesTime');
        }
    },
    beforeDestroy() {
        this.beforeUnmount();
    }
};
</script>

<style scoped>
.EventHubContainer {
    min-height: 100vh;
    background: #f8f9fa;
    padding-bottom: 48px;
    position: relative;
    max-width: 100%;
    overflow-x: hidden;
}

/* Loading overlay */
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

/* Hero Section - Events.com Style */
.hero-section {
    background: white;
    padding: 80px 24px 60px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 48px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 16px;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 20px;
    color: #666;
    margin-bottom: 40px;
}

.search-container {
    display: flex;
    gap: 16px;
    max-width: 700px;
    margin: 0 auto 24px;
    flex-wrap: wrap;
}

.search-input-wrapper,
.location-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 250px;
}

.hero-search-bar,
.location-search-bar {
    width: 100%;
    padding: 16px 16px 16px 48px;
    border: 2px solid #ddd;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.hero-search-bar:focus,
.location-search-bar:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
}

.search-icon,
.location-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 18px;
}

.event-count {
    font-size: 16px;
    color: #888;
}

/* Categories Section - Horizontal Pills */
.categories-section {
    background: white;
    padding: 24px;
    border-bottom: 1px solid #e0e0e0;
    overflow-x: auto;
}

.categories-scroll {
    display: flex;
    gap: 12px;
    max-width: 1200px;
    margin: 0 auto;
    overflow-x: auto;
    padding-bottom: 8px;
}

.categories-scroll::-webkit-scrollbar {
    height: 6px;
}

.categories-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.categories-scroll::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.category-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #f8f9fa;
    border: 2px solid transparent;
    border-radius: 24px;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.category-pill:hover {
    background: #e9ecef;
    transform: translateY(-2px);
}

.category-pill.active {
    background: #007bff;
    color: white;
    border-color: #0056b3;
}

.category-icon {
    font-size: 18px;
}

.category-name {
    font-weight: 500;
}

/* View Controls */
.view-controls {
    max-width: 1200px;
    margin: 24px auto;
    padding: 0 24px;
    display: flex;
    justify-content: flex-end;
}

.map-toggle-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: white;
    border: 2px solid #007bff;
    border-radius: 12px;
    color: #007bff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.map-toggle-btn:hover {
    background: #007bff;
    color: white;
}

/* Events Section */
.events-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px;
}

.events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.event-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.event-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.event-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.event-image-container {
    position: relative;
    padding-top: 60%;
    overflow: hidden;
}

.event-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.event-card:hover .event-image {
    transform: scale(1.05);
}

.event-date-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 12px;
    color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-info {
    padding: 20px;
}

.event-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.event-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.event-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #888;
}

.event-source {
    display: flex;
    align-items: center;
    gap: 6px;
}

.event-learn-more {
    display: inline-block;
    color: #007bff;
    font-weight: 600;
    font-size: 14px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;
}

.event-learn-more:hover {
    color: #0056b3;
}

/* Trending Cities Section */
.trending-cities-section {
    max-width: 1200px;
    margin: 48px auto;
    padding: 0 24px;
}

.section-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 24px;
}

.cities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
}

.city-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.city-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    background: #f8f9fa;
}

.city-name {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
}

.city-count {
    font-size: 14px;
    color: #007bff;
    font-weight: 500;
}

/* No Events Message */
.no-events-message {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    margin: 2rem 0;
}

.no-events-message .error-content {
    max-width: 600px;
    text-align: center;
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

/* Map Section */
.event-map-section {
    margin: 2rem 0;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 24px;
}

.map-error-fallback {
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    margin: 2rem 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .hero-section {
        padding: 48px 16px 40px;
    }

    .hero-title {
        font-size: 32px;
    }

    .hero-subtitle {
        font-size: 16px;
    }

    .search-container {
        flex-direction: column;
        gap: 12px;
    }

    .search-input-wrapper,
    .location-input-wrapper {
        min-width: 100%;
    }

    .categories-section {
        padding: 16px;
    }

    .category-pill {
        padding: 8px 16px;
        font-size: 14px;
    }

    .view-controls {
        padding: 0 16px;
    }

    .events-section {
        padding: 32px 16px;
    }

    .events-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .trending-cities-section {
        padding: 0 16px;
    }

    .section-title {
        font-size: 24px;
    }

    .cities-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .city-card {
        padding: 16px;
    }

    .city-name {
        font-size: 16px;
    }

    .EventHubContainer {
        width: 100%;
        box-sizing: border-box;
    }
}

/* Tablet Responsive */
@media (min-width: 769px) and (max-width: 1024px) {
    .events-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .cities-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Desktop */
@media (min-width: 1025px) {
    .events-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>