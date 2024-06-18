<template>
  <div class="map-container">
    <select v-model="selectedLocation" @change="zoomToLocation" class="location-dropdown">
      <option v-for="location in locations" :key="location.name" :value="location">
        {{ location.name }}
      </option>
    </select>
    <div id="map"></div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, shallowRef } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_KEY = 'fb8014529amshef5d8cf3b76076dp119133jsn509e8cab2c26';
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
    const locations = shallowRef([
      { name: 'Mountain View, CA', lat: 37.3861, lng: -122.0839 },
      { name: 'Cupertino, CA', lat: 37.322, lng: -122.0322 },
      { name: 'New York, NY', lat: 40.7128, lng: -74.006 },
      { name: 'Washington, DC', lat: 38.9072, lng: -77.0369 },
      { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 }
    ]);
    const selectedLocation = shallowRef(locations.value[0]);

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

      const properties = data.props.filter(
        (property) => property.latitude && property.longitude
      );

      properties.forEach((property) => {
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
    };
  },
};
</script>

<style>
.map-container {
  position: relative;
  z-index: 1;
}

#map {
  width: 100%;
  height: 500px;
  display: flex;
  z-index: 1;
}

.location-dropdown {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  z-index: 1000; /* Ensure it appears above the map */
}

.custom-icon img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
