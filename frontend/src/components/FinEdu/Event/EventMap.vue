<template>
  <div class="event-map-container">
    <div class="event-list">
      <div class="search-container">
        <h2>{{ $t('eventHub.eventMap.upcomingEvents') }}</h2>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('eventHub.searchPlaceholder')"
          class="search-input"
          @input="handleSearch"
        />
      </div>

      <div v-for="event in filteredEvents"
           :key="event._id" 
           :ref="el => eventRefs[event._id] = el"
           class="event-card"
           :class="{ highlighted: highlightedEventId === event._id }"
           @click="goToEvent(event.url)">
        <img :src="event.image" alt="Event Image" class="event-image" />
        <div class="event-details">
          <h3>{{ event.name }}</h3>
          <p><strong>{{ $t('eventHub.eventMap.date') }}:</strong> {{ formatDate(event.date) }}</p>
          <p><strong>{{ $t('eventHub.eventMap.host') }}:</strong> {{ event.host }}</p>
          <p><strong>{{ $t('eventHub.eventMap.location') }}:</strong> {{ event.location }}</p>
        </div>
      </div>

      <div v-if="filteredEvents.length === 0" class="no-results">
        {{ $t('eventHub.eventMap.noResults') }}
      </div>
    </div>
    
    <div class="map-container">
      <!-- Native Google Maps implementation -->
      <div v-if="mapsApiLoaded && filteredEvents.length > 0" class="google-map-wrapper">
        <div ref="mapDiv" id="google-map" :style="{ width: '100%', height: mapHeight }"></div>
      </div>
      
      <!-- Fallback content when Maps API is not available -->
      <div v-else-if="mapError" class="map-fallback">
        <div class="fallback-content">
          <div class="fallback-icon">🗺️</div>
          <h3>Map Temporarily Unavailable</h3>
          <p>{{ mapError }}</p>
          <button @click="retryMapLoad" class="retry-button">Try Again</button>
        </div>
      </div>
      
      <!-- Loading state for map -->
      <div v-else class="map-loading">
        <div class="loading-spinner"></div>
        <p>Loading map...</p>
      </div>
    </div>
    
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, nextTick, watch } from "vue";
import axios from "axios";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import { useI18n } from "vue-i18n";

// Dynamically import Google Maps components with error handling
let Map, Marker;
try {
  const googleMapsModule = require('@fawmi/vue-google-maps');
  Map = googleMapsModule.Map;
  Marker = googleMapsModule.Marker;
} catch (error) {
  console.warn('Google Maps components not available:', error);
}

export default defineComponent({
  name: "EventMap",
  components: { 
    ...(Map && Marker ? { Map, Marker } : {})
  },
  setup() {
    const events = ref([]);
    const mapHeight = ref("580px");
    const mapCenter = ref({ lat: 20.0, lng: 0.0 });
    const mapZoom = ref(2);
    const highlightedEventId = ref(null);
    const eventRefs = ref({});
    const searchQuery = ref("");
    const { t, locale } = useI18n();
    const loading = ref(false);
    const error = ref(null);
    const mapsApiLoaded = ref(false);
    const mapError = ref(null);
    const mapDiv = ref(null);
    let googleMap = null;

    // Initialize native Google Maps
    const initializeMap = () => {
      if (!mapDiv.value || !window.google || !window.google.maps) {
        console.warn('⚠️ Cannot initialize map - missing mapDiv or Google Maps');
        return;
      }

      try {
        console.log('🗺️ Initializing native Google Maps...');
        
        // Create map
        googleMap = new window.google.maps.Map(mapDiv.value, {
          center: mapCenter.value,
          zoom: mapZoom.value,
          mapTypeId: 'roadmap',
        });

        // Add markers for each event
        filteredEvents.value.forEach(event => {
          if (event.lat && event.lng) {
            const marker = new window.google.maps.Marker({
              position: { lat: event.lat, lng: event.lng },
              map: googleMap,
              title: event.name,
            });

            // Add click listener
            marker.addListener('click', () => {
              highlightEvent(event._id);
              // Open info window
              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div style="padding: 10px;">
                  <h3 style="margin: 0 0 5px 0;">${event.name}</h3>
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(event.date)}</p>
                  <p style="margin: 5px 0;"><strong>Location:</strong> ${event.location}</p>
                  <p style="margin: 5px 0;"><strong>Host:</strong> ${event.host}</p>
                  ${event.url ? `<a href="${event.url}" target="_blank" style="color: #007bff;">View Event</a>` : ''}
                </div>`
              });
              infoWindow.open(googleMap, marker);
            });
          }
        });

        console.log('✅ Map initialized with', filteredEvents.value.length, 'markers');
      } catch (err) {
        console.error('❌ Error initializing map:', err);
        mapError.value = "Failed to initialize map";
      }
    };

    // Manually load Google Maps script if not already loaded
    const loadGoogleMapsScript = (apiKey) => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        // Check if script tag already exists
        const existing = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existing) {
          // Wait for it to load
          existing.addEventListener('load', resolve);
          existing.addEventListener('error', reject);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
        console.log('🗺️ Manually loading Google Maps script');
      });
    };

    // Check if Google Maps API is available
    const checkMapsApi = () => {
      try {
        console.log('🗺️ checkMapsApi called');
        
        // Check if Google Maps API key is configured
        const apiKey = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
        console.log('🗺️ API Key check:', apiKey ? 'Present' : 'Missing');
        if (!apiKey) {
          mapError.value = "Google Maps API key not configured";
          return false;
        }

        // Try to load the script manually if window.google is missing
        if (!window.google || !window.google.maps) {
          console.log('🗺️ Google Maps not loaded, attempting manual load...');
          loadGoogleMapsScript(apiKey)
            .then(() => {
              console.log('✅ Google Maps script loaded manually!');
              mapsApiLoaded.value = true;
              // Initialize map after script loads
              nextTick(() => initializeMap());
            })
            .catch(err => {
              console.error('❌ Failed to load Google Maps script:', err);
              mapError.value = "Failed to load Google Maps";
            });
          return false;
        }
        
        // If already loaded, mark as ready
        console.log('✅ Google Maps already loaded!');
        mapsApiLoaded.value = true;

        // Check if Google Maps components are available
        console.log('🗺️ Map component:', Map ? 'Available' : 'Not available');
        console.log('🗺️ Marker component:', Marker ? 'Available' : 'Not available');
        if (!Map || !Marker) {
          console.warn('🗺️ Google Maps components not loaded yet');
          mapError.value = "Google Maps components not available";
          return false;
        }

        // Check if window.google is available (API loaded)
        console.log('🗺️ window.google check:', typeof window !== 'undefined' && window.google ? 'Present' : 'Missing');
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          console.log('✅ Google Maps API loaded successfully!');
          mapsApiLoaded.value = true;
          return true;
        }

        // Wait for API to load
        console.log('🗺️ Waiting for Maps API to load, will retry in 1s...');
        setTimeout(checkMapsApi, 1000);
        return false;
      } catch (err) {
        console.error('❌ Maps API check error:', err);
        mapError.value = "Failed to load Google Maps";
        return false;
      }
    };

    const handleMapError = (error) => {
      console.error('Map error:', error);
      mapError.value = "Map failed to load. Please try again.";
      mapsApiLoaded.value = false;
    };

    const retryMapLoad = () => {
      mapError.value = null;
      mapsApiLoaded.value = false;
      checkMapsApi();
    };

    // Debounced search function to prevent excessive calls
    const debouncedSearch = debounce((query) => {
      if (mapsApiLoaded.value) {
        adjustMapToFitMarkers();
      }
    }, 300);

    // Fuzzy search options
    const fuseOptions = {
      includeScore: true,
      threshold: 0.3,
      distance: 100,
      keys: [
        { name: "name", weight: 0.6 },
        { name: "host", weight: 0.2 },
        { name: "location", weight: 0.1 },
        { name: "date", weight: 0.1 }
      ],
    };

    // Computed property for filtered events
    const filteredEvents = computed(() => {
      if (!searchQuery.value) return events.value;

      const fuse = new Fuse(events.value, fuseOptions);
      return fuse.search(searchQuery.value).map((result) => result.item);
    });

    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        loading.value = true;
        const response = await axios.get("/.netlify/functions/server/events");
        events.value = response.data;
        
        // Check if we actually got events
        if (!events.value || events.value.length === 0) {
          console.warn("⚠️ No events found in database");
          mapError.value = "No events are currently available. The event database may be empty or under maintenance.";
          loading.value = false;
          return;
        }
        
        events.value.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (events.value.length > 0 && mapsApiLoaded.value) {
          adjustMapToFitMarkers();
        }
      } catch (err) {
        console.error("❌ Error fetching events:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data
        });
        
        // Set user-friendly error message based on error type
        if (err.response?.status === 500) {
          mapError.value = "Database connection error. Unable to load events at this time.";
        } else if (err.response?.status === 404) {
          mapError.value = "Event service not found. Please contact support.";
        } else {
          mapError.value = err.message || "An error occurred while fetching events.";
        }
        
        error.value = mapError.value;
      } finally {
        loading.value = false;
      }
    };

    // Adjust map zoom and center based on the filtered events
    const adjustMapToFitMarkers = () => {
      if (!mapsApiLoaded.value || filteredEvents.value.length === 0) return;

      let latSum = 0, lngSum = 0;
      let latMin = 90, latMax = -90, lngMin = 180, lngMax = -180;

      filteredEvents.value.forEach((event) => {
        if (event.lat && event.lng) {
          latSum += event.lat;
          lngSum += event.lng;
          latMin = Math.min(latMin, event.lat);
          latMax = Math.max(latMax, event.lat);
          lngMin = Math.min(lngMin, event.lng);
          lngMax = Math.max(lngMax, event.lng);
        }
      });

      const numEvents = filteredEvents.value.length;
      mapCenter.value = {
        lat: latSum / numEvents,
        lng: lngSum / numEvents,
      };

      const latDiff = latMax - latMin;
      const lngDiff = lngMax - lngMin;
      if (latDiff > 50 || lngDiff > 100) {
        mapZoom.value = 2;
      } else if (latDiff > 10 || lngDiff > 20) {
        mapZoom.value = 5;
      } else {
        mapZoom.value = 8;
      }
    };

    // Highlight an event in the list
    const highlightEvent = async (eventId) => {
      highlightedEventId.value = eventId;
      await nextTick();

      // Safety check to prevent null reference errors
      if (eventRefs.value && eventId && eventRefs.value[eventId]) {
        const eventElement = eventRefs.value[eventId];
        eventElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setTimeout(() => {
        highlightedEventId.value = null;
      }, 3000);
    };

    // Go to the event URL
    const goToEvent = (url) => {
      if (url && url.startsWith("http")) {
        window.open(url, "_blank");
      }
    };

    // Format date
    const formatDate = (date) => {
      if (!date) return t("eventHub.eventMap.tba");

      const options = {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      };

      return new Date(date).toLocaleDateString(locale.value, options);
    };

    // Handle search query input
    const handleSearch = () => {
      debouncedSearch(searchQuery.value);
    };

    // Watch for changes to initialize map
    watch([mapsApiLoaded, () => filteredEvents.value.length], () => {
      if (mapsApiLoaded.value && filteredEvents.value.length > 0) {
        nextTick(() => {
          initializeMap();
        });
      }
    });

    onMounted(() => {
      console.log('🗺️ EventMap mounted - starting initialization');
      // Check Maps API first, then fetch events
      checkMapsApi();
      fetchEvents();
      
      // Debug logging after 2 seconds
      setTimeout(() => {
        console.log('🗺️ mapsApiLoaded:', mapsApiLoaded.value);
        console.log('🗺️ eventsCount:', events.value.length);
        console.log('🗺️ filteredEventsCount:', filteredEvents.value.length);
        console.log('🗺️ mapError:', mapError.value);
        console.log('🗺️ loading:', loading.value);
        console.log('🗺️ apiKey:', process.env.VUE_APP_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
        console.log('🗺️ First event:', events.value[0]);
      }, 2000);
    });

    return {
      events,
      filteredEvents,
      mapHeight,
      mapCenter,
      mapZoom,
      highlightEvent,
      goToEvent,
      formatDate,
      highlightedEventId,
      eventRefs,
      searchQuery,
      handleSearch,
      loading,
      error,
      mapsApiLoaded,
      mapDiv,
      mapError,
      handleMapError,
      retryMapLoad,
    };
  },
});
</script>

<style scoped>
.event-map-container {
  display: flex;
  width: 100%;
  height: 600px;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background: #fee2e2;
  border-radius: 12px;
  margin: 1rem;
  animation: shake 0.5s ease;
}

.map-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.fallback-content {
  text-align: center;
  padding: 2rem;
}

.fallback-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.fallback-content h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.fallback-content p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.retry-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background: #0056b3;
}

.map-loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.map-loading p {
  margin-top: 1rem;
  color: #6c757d;
}

.google-map-wrapper {
  width: 100%;
  height: 100%;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.event-list {
  width: 40%;
  padding: 20px;
  overflow-y: auto;
  max-height: 600px;
}

.event-list h2 {
  color: var(--text-primary);
  margin-bottom: 15px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid black;
  width: 94%;
  border-radius: 28px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px black;
}

.map-container {
  width: 60%;
  height: 100%;
}

.event-card {
  display: flex;
  background: white;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, background 0.3s;
}

.event-card:hover {
  transform: scale(1.02);
  background: #f9f9f9;
}

.event-card.highlighted {
  background: #E4F6F8;
  transition: background 0.5s ease-in-out;
}

.event-image {
  width: 180px;
  height: 135px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 20px;
  margin-top: 20px;
}

.event-details {
  flex: 1;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* Mobile Styling */
@media (max-width: 768px) {
  .event-map-container {
    flex-direction: column;
    height: auto;
  }

  .map-container {
    width: 100%;
    order: 1;
  }

  .event-list {
    width: 100%;
    padding: 10px;
    order: 2;
  }

  .event-card {
    flex-direction: column;
  }

  .event-image {
    width: 100%;
    height: auto;
    margin: 0 0 10px 0;
  }
}
</style>