<template>
  <div class="EventHubContainer">
    <div class="frame1">
      <h1>Hue Nguyen</h1>
    </div>
    <div class="frame2">
      <h1>Hue Nguyen</h1>
    </div>
    <div class="frame3">
      <div class="events-container">
        <h2>All events</h2>
        <div class="grid-container">
          <div v-for="(event, index) in events" :key="index" class="event-card">
            <img
              class="event-image"
              src="../assets/stockTri.png"
              alt="Event image"
            />
            <div class="event-details">
              <h3>{{ event.title }}</h3>
              <p>{{ event.date }}</p>
              <p>{{ event.location }}</p>
              <p>{{ event.organizer }}</p>
              <p>{{ event.price }}</p>
            </div>
            <div class="event-actions">
              <button class="star-button">⭐</button>
              <button class="read-more-button" @click="openModal(event)">
                Read more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="EventHubContainer">
    <!-- Other event content -->

    <!-- Modal Section -->
    <div v-if="isModalOpen" class="modal-overlay modal-wrapper" @click="closeModal">
      <div class="modal-content">
        <img
          class="modal-image"
          src="../assets/stockTri.png"
          alt="Event image"
        />

        <div class="modal-body">
          <p class="modal-date">{{ selectedEvent.date }}</p>
          <div class="modal-secondline">
            <h3 class="modal-title">{{ selectedEvent.title }}</h3>
            <button class="register-button">Register</button>
          </div>

          <p class="modal-subtitle">
            {{
              selectedEvent.description ||
              "#1 Commercial Real Estate & Networking Community - Ready to Find Your Next Investment Partner?"
            }}
          </p>

          <h4 class="modal-section-title">Pick a time</h4>
          <!-- Time picking content (if needed) -->

          <h4 class="modal-section-title">Agenda</h4>
          <!-- Agenda content -->

          <h4 class="modal-section-title">About this event</h4>
          <p class="modal-description">
            {{ selectedEvent.details || "Details about the event go here..." }}
          </p>
        </div>

        <button class="close-button" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "EventHub",
  data() {
    return {
      events: [
        {
          title: "National Industrial Real Estate Forum 2024",
          date: "Thursday • 2:00 PM",
          location: "Intercontinental Hanoi Landmark Hotel",
          price: "Free",
          organizer: "VNIC - VIETNAM INVESTMENT CONSULTING",
        },
        {
          title: "National Real Estate Forum 2024",
          date: "Thursday • 2:00 PM",
          location: "Intercontinental Hanoi Landmark Hotel",
          price: "Free",
          organizer: "VNIC - VIETNAM INVESTMENT CONSULTING",
        },
        {
          title: "National Real Estate Forum 2024",
          date: "Thursday • 2:00 PM",
          location: "Intercontinental Hanoi Landmark Hotel",
          price: "Free",
          organizer: "VNIC - VIETNAM INVESTMENT CONSULTING",
        },
        {
          title: "National Real Estate Forum 2024",
          date: "Thursday • 2:00 PM",
          location: "Intercontinental Hanoi Landmark Hotel",
          price: "Free",
          organizer: "VNIC - VIETNAM INVESTMENT CONSULTING",
        },
        {
          title: "National Real Estate Forum 2024",
          date: "Thursday • 2:00 PM",
          location: "Intercontinental Hanoi Landmark Hotel",
          price: "Free",
          organizer: "VNIC - VIETNAM INVESTMENT CONSULTING",
        },
        {
          title: "National Real Estate Forum 2024",
          date: "Thursday • 2:00 PM",
          location: "Intercontinental Hanoi Landmark Hotel",
          price: "Free",
          organizer: "VNIC - VIETNAM INVESTMENT CONSULTING",
        },
      ],
      isModalOpen: false,
      selectedEvent: {},
    };
  },
  computed: {},
  methods: {
    openModal(event) {
      this.selectedEvent = event;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedEvent = {};
    },
  },
  mounted() {},
};
</script>
<style scoped>
.EventHubContainer {
  width: calc(100vw - 17px);
  height: fit-content;
  display: flex;
  flex-direction: column;
}

.frame1 {
  width: 100%;
  height: 100vh;
  border: 2px solid green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame2 {
  width: 100%;
  height: 100vh;
  border: 2px solid green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame3 {
  width: 100%;
  height: auto;
  border: 2px solid red;
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  justify-content: center;
  align-items: center;
}

.events-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%; /* Ensure full height */
  padding: 20px; /* Add some padding for spacing */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns of equal width */
  grid-template-rows: repeat(2, auto); /* 2 rows */
  gap: 20px; /* Spacing between cards */
  width: 80%;
  height: 100%; /* Ensure the grid takes full height */
}

.event-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.event-image {
  width: 100%;
  height: 150px;
  background-color: #f0f0f0; /* Placeholder for image */
  object-fit: cover;
  margin-bottom: 10px;
}

.event-details {
  flex: 1;
}

.event-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.read-more-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.read-more-button:hover {
  background-color: #005bb5;
}

.star-button {
  padding: 10px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.star-button:hover {
  background-color: #f0f0f0; /* Optional: Add a hover effect */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  max-width: 1000px;
  align-items:center;
}

.modal-content img {
    max-height: 350px;
    height: 100%;
}

.modal-secondline h3 {
    width: fit-content;
    padding: 0;
    margin: 0;
}

.modal-secondline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: fit-content;
}

.register-button {
    background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #0056b3;
}

.modal-image {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.close-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #0056b3;
}
</style>
