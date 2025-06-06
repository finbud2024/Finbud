<template>
  <div class="market-summary">
    <h3>Market Summary</h3>
    <!-- only render the HTML when we actually have markdown -->
    <div v-if="marketSummary" v-html="renderedSummary"></div>

    <!-- otherwise show your fallback -->
    <p v-else>Loading summary…</p>
  </div>
  <div class="map-container">
    <div class="controls">
      <select v-model="selectedLocation" @change="zoomToLocation" class="location-dropdown">
        <option v-for="location in locations" :key="location.name" :value="location">
          {{ location.name }}
        </option>
      </select>
    </div>
    <div ref="mapContainer" class="leaflet-map" style="height:500px;"></div>
    <table v-if="displayedProperties.length" class="property-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Type</th>
          <th>Address</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="property in displayedProperties" :key="property.zpid">
          <td><img :src="property.imgSrc" alt="Property Image" class="property-table-img"></td>
          <td>{{ property.propertyType }}</td>
          <td>{{ property.address }}</td>
          <td>${{ property.price }}</td>
          <td>{{ property.listingStatus }}</td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button v-if="displayedProperties.length < properties.length" @click="showMore" class="show-more-button">
        Show More
      </button>
      <button v-if="displayedProperties.length >= properties.length && properties.length > 10" @click="showLess"
        class="show-less-button">
        Show Less
      </button>
    </div>
  </div>
</template>

<script>
import { inject, onMounted, onBeforeUnmount, shallowRef, ref, nextTick, computed } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,        // allow inline HTML
  linkify: true,        // autolink URLs
  typographer: true,
})

const API_KEY = process.env.VUE_APP_REAL_ESTATE_KEY;
const BASE_URL = 'https://zillow-com1.p.rapidapi.com/propertyExtendedSearch';

const getPropertyData = async (location) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { location: location.name },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching property data:', error);
    throw error;
  }
};

export default {
  name: 'RealEstateMap',
  props: {
    marketSummary: {
      type: String,
      default: ''       // or "Loading summary…" if you like
    }
  },
  setup(props) {
    // const map = shallowRef(null);
    // const markers = shallowRef([]);
    const mapContainer = ref(null)
    const map = ref(null)
    const markers = ref([])
    const clearMarkers = () => {
      markers.value.forEach(m => m.remove())
      markers.value = []
    }
    const popupOpen = shallowRef(false);
    const properties = ref([]);
    const displayedProperties = ref([]);
    const locations = ref([
      { name: 'Mountain View, CA', lat: 37.3861, lng: -122.0839 },
      { name: 'Cupertino, CA', lat: 37.322, lng: -122.0322 },
      { name: 'New York, NY', lat: 40.7128, lng: -74.006 },
      { name: 'Washington, DC', lat: 38.9072, lng: -77.0369 },
      { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 }
    ]);
    const selectedLocation = ref(locations.value[0]);
    const propertiesToShow = ref(10);
    const renderedSummary = computed(() => {
      return props.marketSummary
        ? md.render(props.marketSummary)
        : ''
    })

    onMounted(async () => {
      await nextTick();
      const el = mapContainer.value
      if (!el) {
        console.error('⚠️ mapContainer ref is still null!')
        return
      }
      // now we know it's non-null
      map.value = L.map(el).setView(
        [selectedLocation.value.lat, selectedLocation.value.lng],
        10
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map.value);

      try {
        await loadProperties(selectedLocation.value);
      } catch (error) {
        console.error('Error initializing map:', error);
      }

      map.value.on('zoomstart', () => {
        if (popupOpen.value) {
          closeAllPopups();
        }
      });

    });

    const loadProperties = async (location) => {
      const data = await getPropertyData(location);
      if (!data || !data.props) {
        console.error(`No properties found for ${location.name}`);
        return;
      }

      properties.value = data.props.filter(
        (property) => property.latitude && property.longitude
      );

      updateDisplayedProperties();

      properties.value.forEach((property) => {
        const { latitude, longitude, price, propertyType, address, listingStatus, imgSrc } = property;

        const icon = L.divIcon({
          html: `<img src="${imgSrc}" alt="Property Image" class="property-icon">`,
          iconSize: [40, 40],
          className: 'custom-icon'
        });

        const marker = L.marker([latitude, longitude], { icon })
          .addTo(map.value)
          .bindPopup(`
            <b>${propertyType}</b> <br>
            ${address} <br>
            Price: $${price} <br>
            Status: ${listingStatus}
          `);

        marker.on('popupopen', () => {
          popupOpen.value = true;
          console.log('Popup opened for:', address);
        });

        marker.on('popupclose', () => {
          popupOpen.value = false;
          console.log('Popup closed for:', address);
        });

        markers.value.push(marker);
      });
    };

    const updateDisplayedProperties = () => {
      displayedProperties.value = properties.value.slice(0, propertiesToShow.value);
    };

    const showMore = () => {
      propertiesToShow.value += 10;
      updateDisplayedProperties();
    };

    const showLess = () => {
      propertiesToShow.value = 10;
      updateDisplayedProperties();
    };

    const zoomToLocation = async () => {
      closeAllPopups();
      markers.value.forEach(marker => map.value.removeLayer(marker));
      markers.value = [];

      const location = selectedLocation.value;
      map.value.setView([location.lat, location.lng], 10);
      await loadProperties(location);
    };

    const closeAllPopups = () => {
      markers.value.forEach(marker => {
        if (marker.getPopup() && marker.getPopup().isOpen()) {
          marker.closePopup();
        }
      });
    };

    onBeforeUnmount(() => {
      if (map.value) {
        closeAllPopups();
        markers.value.forEach(marker => {
          marker.off();
        });
        map.value.off();
        map.value.remove();
      }
    });

    return {
      marketSummary: props.marketSummary,
      renderedSummary,
      mapContainer,
      map,
      locations,
      selectedLocation,
      zoomToLocation,
      properties,
      displayedProperties,
      showMore,
      showLess,
      propertiesToShow,
    };
  },
};
</script>

<style>
.market-summary {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.map-container {
  position: relative;
  z-index: 1;
  padding: 10px;
}

#map {
  width: 100%;
  height: 500px;
  display: flex;
  z-index: 1;
}

.controls {
  display: flex;

  margin-bottom: 1rem;
}

.location-dropdown {
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.location-dropdown:hover {
  background-color: #333333;
}

.property-table {
  width: 100%;
  margin-bottom: 1rem;
  border-collapse: collapse;
  overflow-x: auto;
}

.property-table th,
.property-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.property-table-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.custom-icon img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.show-more-button,
.show-less-button {
  padding: 10px 20px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
}

.show-more-button:hover,
.show-less-button:hover {
  background-color: #333333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .property-table {
    font-size: 12px;
  }

  .property-table th,
  .property-table td {
    padding: 6px;
  }

  .property-table-img {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 576px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
  }

}
</style>
