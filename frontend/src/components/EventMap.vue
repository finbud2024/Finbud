<template>
    <div class="event-map-container">
      <div class="map-container">
        <GMapMap
          :center="{ lat: 37.7749, lng: -122.4194 }"
          :zoom="12"
          map-type-id="roadmap"
          :style="{ width: '100%', height: mapHeight }"
        >
          <GMapMarker
            v-for="event in events"
            :key="event.id"
            :position="{ lat: event.lat, lng: event.lng }"
            :title="event.name"
          />
        </GMapMap>
      </div>
  
      <div class="event-list">
        <h2>Upcoming Events Near You</h2>
  
        <div class="event-cards-container" v-if="isMobile">
          <div v-for="event in events" :key="event.id" class="event-card">
            <img :src="event.image" alt="Event Image" class="event-image" />
            <div class="event-details">
              <h3>{{ event.name }}</h3>
              <p><strong>Date:</strong> {{ event.date }}</p>
              <p><strong>Host:</strong> {{ event.host }}</p>
              <p><strong>Location:</strong> {{ event.location }}</p>
              <p><strong>Price:</strong> {{ event.price }}</p>
            </div>
          </div>
        </div>
  
        <div v-else>
          <div v-for="event in events" :key="event.id" class="event-card">
            <img :src="event.image" alt="Event Image" class="event-image" />
            <div class="event-details">
              <h3>{{ event.name }}</h3>
              <p><strong>Date:</strong> {{ event.date }}</p>
              <p><strong>Host:</strong> {{ event.host }}</p>
              <p><strong>Location:</strong> {{ event.location }}</p>
              <p><strong>Price:</strong> {{ event.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from "vue";
  import { GMapMap, GMapMarker } from "@fawmi/vue-google-maps";
  
  export default defineComponent({
    name: "EventMap",
    components: { GMapMap, GMapMarker },
    setup() {
      const events = ref([
        {
            "id": 1,
            "name": "San Francisco FinTech Summit 2025",
            "date": "Mon, March 10 • 9:00 AM",
            "host": "Silicon Valley FinTech Association",
            "location": "Moscone Center, San Francisco, CA",
            "price": "Free",
            "image": "https://media.istockphoto.com/id/1136437406/photo/san-francisco-skyline-with-oakland-bay-bridge-at-sunset-california-usa.jpg?s=612x612&w=0&k=20&c=JVBBZT2uquZbfY0njYHv8vkLfatoM4COJc-lX5QKYpE=",
            "lat": 37.7841,
            "lng": -122.4039
        },
        {
            "id": 2,
            "name": "Wealth & Investment Strategies Forum",
            "date": "Sat, April 15 • 12:00 PM",
            "host": "Global Wealth Management",
            "location": "The Ritz-Carlton, San Francisco, CA",
            "price": "$50.00",
            "image": "https://media.istockphoto.com/id/476881195/photo/bay-bridge-and-san-francisco-skyline-at-sunset.jpg?s=612x612&w=0&k=20&c=dBeGdmYS8eOufXGT_YdRkuvKfLKUHFYwVaL9gHbkSXo=",
            "lat": 37.7915,
            "lng": -122.4022
        },
        {
            "id": 3,
            "name": "AI-Powered Trading & Blockchain Conference",
            "date": "Fri, May 5 • 10:00 AM",
            "host": "Future Finance Innovators",
            "location": "Palace of Fine Arts, San Francisco, CA",
            "price": "$99.99",
            "image": "https://t3.ftcdn.net/jpg/02/64/88/04/360_F_264880447_47EBgqWIUP1qlfyOSo1Gi79eWR9YzQBu.jpg",
            "lat": 37.8024,
            "lng": -122.4482
        },
        {
            "id": 4,
            "name": "Crypto & Decentralized Finance (DeFi) Expo",
            "date": "Wed, June 20 • 2:00 PM",
            "host": "Bay Area Crypto Network",
            "location": "San Francisco Blockchain Hub, CA",
            "price": "$75.00",
            "image": "https://media.istockphoto.com/id/2024885320/photo/market-street-san-francisco.jpg?s=612x612&w=0&k=20&c=Ow4o85ebMazJdqIUaenLPNWi91tE2a-pzNSsGAwVADY=",
            "lat": 37.7955,
            "lng": -122.3937
        },
        {
            "id": 5,
            "name": "Women in Finance Leadership Conference",
            "date": "Fri, July 8 • 8:30 AM",
            "host": "Women in Wall Street Network",
            "location": "Marriott Marquis, San Francisco, CA",
            "price": "$120.00",
            "image": "https://www.sftravel.com/sites/default/files/styles/horizontal_3_2/public/2022-10/cable-cars-downtown-san-francisco.jpg.webp?itok=GiWB7QY4",
            "lat": 37.7850,
            "lng": -122.4090
        }
      ]);
  
      const isMobile = ref(false);
      const mapHeight = ref("580px");
  
      const checkScreenSize = () => {
        if (window.innerWidth <= 768) {
          isMobile.value = true;
          mapHeight.value = "300px"; 
        } else {
          isMobile.value = false;
          mapHeight.value = "580px"; 
        }
      };
  
      onMounted(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
      });
  
      return { events, isMobile, mapHeight };
    }
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
  
    .event-cards-container {
      display: flex;
      overflow-x: auto;  
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      gap: 10px;
      padding-bottom: 10px;
      white-space: nowrap;
    }
  
    .event-card {
      flex: 0 0 auto;
      scroll-snap-align: start;
      width: 80%;
      margin-right: 10px;
      flex-direction: column;
    }
  
    .event-image {
      width: 100%;
      height: auto;
      margin: 0 0 10px 0;
    }
  
    .event-cards-container::-webkit-scrollbar {
      height: 8px;
    }
  
    .event-cards-container::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }
  
    .event-cards-container::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  </style>
  