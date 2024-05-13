<template>
  <div class="features-container">
    <!-- Vehicle & Employee Tracking Section -->
    <div class="tracking-section blue-background">
      <h2>Vehicle & Employee Tracking</h2>
      <p class="installation-fee">*Installation Fee of $100/bay is assessed at install.</p>
      <div class="service-details">
        <div class="price-detail">$50 per bay</div>
        <div class="services-grid">
          <div class="left-column">
            <ul class="service-highlights">
              <li>Detect Auto Dashboard</li>
              <li>Vehicle Repair Tracking</li>
              <li>Bay Utilization</li>
              <li>Vehicle Repair Efficiency</li>
            </ul>
          </div>
          <div class="right-column">
            <ul class="service-highlights">
              <li>Employee Repair Efficiency</li>
              <li>Dynamic Labor Pricing</li>
              <li>Enterprise support and uptime</li>
              <li>Custom API Development</li>
            </ul>
          </div>
        </div>
        <button>Start your 30-day free trial</button>
      </div>
    </div>

    <!-- Enterprise Plan Section -->
    <div class="tracking-section white-background">
      <h2>Enterprise Plan</h2>
      <p class="installation-fee">*Installation Fee of $100/bay is assessed at install.</p>
      <div class="service-details">
        <ul class="service-highlights">
          <li>Detect Auto Dashboard</li>
          <li>Vehicle Repair Tracking</li>
          <li>Bay Utilization</li>
          <li>Vehicle Repair Efficiency</li>
          <li>Employee Repair Efficiency</li>
          <li>Dynamic Labor Pricing</li>
          <li>Enterprise support and uptime</li>
          <li>Custom API Development</li>
        </ul>
        <button>Start your 30-day free trial</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracking-section {
  background-color: #007bff;
  color: white;
  padding: 40px;
  border-radius: 8px;
  width: 80%; /* Adjust width to not span the full screen */
  margin: 20px auto; /* Center the section */
  text-align: left; /* Align text to the left */
}

.installation-fee {
  font-size: 14px;
  margin-bottom: 20px;
}

.service-details {
  display: flex;
  flex-direction: column;
}

.price-detail {
  font-size: 28px;
  margin-bottom: 20px;
}

.services-grid {
  display: flex;
  justify-content: space-between;
}

.left-column, .right-column {
  width: 48%; /* Nearly half the container width */
}

.service-highlights {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.service-highlights li {
  margin: 10px 0;
  font-size: 16px;
}

button {
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  align-self: flex-start; /* Align button to the left */
}

button:hover {
  background-color: #004080;
}

</style>