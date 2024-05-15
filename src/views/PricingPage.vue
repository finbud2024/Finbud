<template>
  <div class="features-container">
    <!-- Financial Consulting Section -->
    <div class="consulting-section blue-background">
      <h2>Financial Consulting</h2>
      <p class="note">Personalized plans to secure your financial future.</p>
      <div class="service-details">
        <div class="services-grid">
          <div class="left-column">
            <ul class="service-highlights">
              <li>Debt Management</li>
              <li>Savings Strategies</li>
              <li>Investment Advice</li>
            </ul>
          </div>
          <div class="right-column">
            <ul class="service-highlights">
              <li>Custom Financial Planning</li>
              <li>Goal-Oriented Guidance</li>
              <li>Personal Wealth Management</li>
            </ul>
          </div>
        </div>
        <button>Start your 30-day free trial</button>
      </div>
    </div>

    <!-- Financial Education Section -->
    <div class="education-section white-background">
      <h2>Financial Education</h2>
      <p class="note">Empower yourself with knowledge to make better financial decisions.</p>
      <div class="service-details">
        <ul class="service-highlights">
          <li>Basic to Advanced Financial Concepts</li>
          <li>Interactive Lessons and Quizzes</li>
          <li>Real-time Financial Trend Analysis</li>
          <li>AI-Driven Insights</li>
        </ul>
        <button>Start your 30-day free trial</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature-section {
  background-color: #007bff; /* Blue background for consulting */
  color: white;
  padding: 40px;
  border-radius: 8px;
  width: 80%;
  margin: 20px auto;
  text-align: left;
}

.feature-section.white-background {
  background-color: white;
  color: black; /* Text color for better readability on white */
}

.installation-fee {
  font-size: 14px;
  margin-bottom: 20px;
  color: inherit; /* Ensures the text color matches the section's color */
}

.service-details {
  display: flex;
  flex-direction: column;
}

.price-detail {
  font-size: 28px;
  margin-bottom: 20px;
  color: inherit; /* Price detail inherits section color */
}

.services-grid {
  display: flex;
  justify-content: space-between;
}

.left-column, .right-column {
  width: 48%; /* Close to half the container width to fit all items nicely */
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
  background-color: #0056b3; /* Darker blue for buttons */
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  align-self: flex-start; /* Left align the button */
}

button:hover {
  background-color: #004080; /* Even darker on hover */
}
</style>
