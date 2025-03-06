\<template>
  <div class="event-map-container">
    <div class="map-container">
      <GMapMap
        :center="mapCenter"
        :zoom="mapZoom"
        map-type-id="roadmap"
        :style="{ width: '100%', height: mapHeight }"
        :options="{ disableDefaultUI: false }"
      >
        <GMapMarker
          v-for="event in events"
          :key="event._id"
          :position="{ lat: event.lat, lng: event.lng }"
          :title="event.name"
          @click="highlightEvent(event._id)"
        />
      </GMapMap>
    </div>

    <div class="event-list">
      <h2>Upcoming Events</h2>

      <div v-for="event in events" 
           :key="event._id" 
           :ref="el => eventRefs[event._id] = el"
           class="event-card"
           :class="{ highlighted: highlightedEventId === event._id }"
           @click="goToEvent(event.url)">
        <img :src="event.image" alt="Event Image" class="event-image" />
        <div class="event-details">
          <h3>{{ event.name }}</h3>
          <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
          <p><strong>Host:</strong> {{ event.host }}</p>
          <p><strong>Location:</strong> {{ event.location }}</p>
          <!-- <p><strong>Price:</strong> {{ event.price }}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from "vue";
import { GMapMap, GMapMarker } from "@fawmi/vue-google-maps";
import axios from "axios";

export default defineComponent({
  name: "EventMap",
  components: { GMapMap, GMapMarker },
  setup() {
    const events = ref([]);
    const mapHeight = ref("580px");
    const mapCenter = ref({ lat: 20.0, lng: 0.0 });
    const mapZoom = ref(2);
    const highlightedEventId = ref(null);
    const eventRefs = ref({});

    const fetchEvents = async () => {
      try {
        const response = await axios.get("/.netlify/functions/server/events");
        events.value = response.data;
        events.value.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (events.value.length > 0) {
          adjustMapToFitMarkers();
        }
      } catch (error) {
        console.error("❌ Error fetching events:", error);
      }
    };

    const adjustMapToFitMarkers = () => {
      if (events.value.length === 0) return;

      let latSum = 0, lngSum = 0;
      let latMin = 90, latMax = -90, lngMin = 180, lngMax = -180;

      events.value.forEach((event) => {
        if (event.lat && event.lng) {
          latSum += event.lat;
          lngSum += event.lng;
          latMin = Math.min(latMin, event.lat);
          latMax = Math.max(latMax, event.lat);
          lngMin = Math.min(lngMin, event.lng);
          lngMax = Math.max(lngMax, event.lng);
        }
      });

      const numEvents = events.value.length;
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

    const goToEvent = (url) => {
      if (url && url.startsWith("http")) {
        window.open(url, "_blank");
      }
    };

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : "TBA";
    };

    onMounted(fetchEvents);

    return { 
      events, 
      mapHeight, 
      mapCenter, 
      mapZoom, 
      highlightEvent, 
      goToEvent, 
      formatDate, 
      highlightedEventId, 
      eventRefs 
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
