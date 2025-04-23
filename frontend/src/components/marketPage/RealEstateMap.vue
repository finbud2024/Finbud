<template>
  <div class="map-container">
    <div class="controls">
      <select v-model="selectedLocation" @change="zoomToLocation" class="location-dropdown">
        <option v-for="location in locations" :key="location.name" :value="location">
          {{ location.name }}
        </option>
      </select>
    </div>
    <div id="map"></div>
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
      <button v-if="displayedProperties.length >= properties.length && properties.length > 10" @click="showLess" class="show-less-button">
        Show Less
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, shallowRef, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

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
  setup() {
    const map = shallowRef(null);
    const markers = shallowRef([]);
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

    onMounted(async () => {
      map.value = L.map('map').setView([selectedLocation.value.lat, selectedLocation.value.lng], 10);

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
  background-color: #0056b3;
}

.property-table {
  width: 100%;
  margin-bottom: 1rem;
  border-collapse: collapse;
  overflow-x: auto;
}

.property-table th, .property-table td {
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
}

.show-more-button:hover,
.show-less-button:hover {
  background-color: #0056b3;
}

/* Responsive Design */
@media (max-width: 768px) {
  .property-table {
    font-size: 12px;
  }

  .property-table th, .property-table td {
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
