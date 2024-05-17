<template>
  <div class="features-container">
    <!-- Financial Consulting Section -->
    <div class="feature-section consulting-section animate slide-in-left">
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
    <div class="feature-section education-section animate slide-in-right">
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

<script>
export default {
  name: 'FeaturesSection',
  mounted() {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate');
    elements.forEach(el => observer.observe(el));
  }
}
</script>

<style scoped>
.features-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin: 40px auto;
  max-width: 1200px;
}

.feature-section {
  background-color: #007bff; /* Blue background for consulting */
  color: white;
  padding: 40px;
  border-radius: 8px;
  width: 80%;
  margin: 20px auto;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-section.white-background {
  background-color: white;
  color: black; /* Text color for better readability on white */
}

.feature-section:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.note {
  font-size: 18px;
  margin-bottom: 20px;
  color: inherit; /* Ensures the text color matches the section's color */
}

.service-details {
  display: flex;
  flex-direction: column;
}

.services-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px;
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
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #004080; /* Even darker on hover */
  transform: scale(1.05);
}

/* Add animations */
.animate {
  opacity: 0;
  transition: opacity 1s ease, transform 1s ease;
}

.animate-visible {
  opacity: 1;
}

.fade-in {
  transform: translateY(20px);
}

.fade-in.animate-visible {
  transform: translateY(0);
}

.slide-in-left {
  transform: translateX(-20px);
}

.slide-in-left.animate-visible {
  transform: translateX(0);
}

.slide-in-right {
  transform: translateX(20px);
}

.slide-in-right.animate-visible {
  transform: translateX(0);
}
</style>
