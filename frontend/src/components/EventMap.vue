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
      <Map
        :center="mapCenter"
        :zoom="mapZoom"
        map-type-id="roadmap"
        :style="{ width: '100%', height: mapHeight }"
        :options="{ disableDefaultUI: false }"
      >
        <Marker
          v-for="event in filteredEvents"
          :key="event._id"
          :position="{ lat: event.lat, lng: event.lng }"
          :title="event.name"
          @click="highlightEvent(event._id)"
        />
      </Map>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";
import { Map, Marker } from '@fawmi/vue-google-maps';
import axios from "axios";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "EventMap",
  components: { Map, Marker },
  setup() {
    const events = ref([]);
    const mapHeight = ref("580px");
    const mapCenter = ref({ lat: 20.0, lng: 0.0 });
    const mapZoom = ref(2);
    const highlightedEventId = ref(null);
    const eventRefs = ref({});
    const searchQuery = ref("");
    const { t, locale } = useI18n();

    // Debounced search function to prevent excessive calls
    const debouncedSearch = debounce((query) => {
      adjustMapToFitMarkers();
    }, 300); // 300ms debounce time

    // Fuzzy search options
    const fuseOptions = {
      includeScore: true,
      threshold: 0.3,  // Allow for fuzzy matches
      distance: 100,   // Limit the distance for matches, allowing partial word matching
      keys: [
        { name: "name", weight: 0.6 },    // Prioritize name field
        { name: "host", weight: 0.2 },    // Secondary priority on host
        { name: "location", weight: 0.1 },  // Location is less important
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
        const response = await axios.get("/.netlify/functions/server/events");
        events.value = response.data;
        events.value.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (events.value.length > 0) {
          adjustMapToFitMarkers();
        }
      } catch (error) {
        console.error("❌ Error fetching events:", error);
      }
    };

    // Adjust map zoom and center based on the filtered events
    const adjustMapToFitMarkers = () => {
      if (filteredEvents.value.length === 0) return;

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

      const eventElement = eventRefs.value[eventId];
      if (eventElement) {
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

    onMounted(fetchEvents);

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
    };
  },
});
</script>


<style scoped>
.event-map-container {
  display: flex;
  width: 100%;
  height: 600px;
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