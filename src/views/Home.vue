<template>
  <section id="main-content">
    <div class='intro-container'>
      <div class="intro-text">
        <div>
          <li class="title">Making the most informed choices</li>
          <li class="description">With FinBud, you can ask for the best financial advice anytime, anywhere</li>
        </div>
        <div class="photo">
          <img src='@/assets/bot.png' alt="placeholder">
        </div>
      </div>
      <div class="small-description">
        <div class="sdesitem">
          <li class="sdesimg">
            <img src='@/assets/bot.png' alt="placeholder">
          </li>
          <li class="sdestext">
            Fine-tuned model specializing in finance and investing
          </li>
        </div>
        <div class="sdesitem">
          <li class="sdesimg">
            <img src='@/assets/bot.png' alt="placeholder">
          </li>
          <li class="sdestext">
            Accessible and up-to-date on the latest information
          </li>
        </div>
      </div>
    </div>
    <header>
      <h1>Enhance Your Financial Awareness by 25%</h1>
      <p>FinBud is an AI-driven financial analytics platform that makes managing your finances more efficient.</p>
      <button @click="learnMore">Learn More</button>
    </header>

    <div id="efficiency-chart"></div>

    <div class="feature-icons">
      <div>Compatible with any personal finance management software</div>
      <div>Data-driven insights provide actionable steps to manage and improve your financial health</div>
    </div>

    <!-- Statistics Section -->
    <section id="statistics" class="stats-section">
      <div class="stats-header">
        <h2>Experience the Impact</h2>
        <p>Gain actionable insights into your finances automatically. It’s financial management at its best.</p>
      </div>
      <div class="stats-container">
        <div class="stat-item">
          <h3>20% Savings Increase</h3>
          <p>Average increase in savings per user</p>
        </div>
        <div class="stat-item">
          <h3>30% Debt Reduction</h3>
          <p>Average reduction in debt after one year</p>
        </div>
        <div class="stat-item">
          <h3>Improved Credit Score</h3>
          <p>Enhance your credit score within six months</p>
        </div>
      </div>
    </section>

    <!-- Feature Highlights Section -->
    <section id="features" class="container">
      <img src="@/assets/performance-overview.png" alt="Performance Overview" />
      <div class="text-content">
        <h2>Optimize Your Financial Operations</h2>
        <p>FinBud is tailored for individual financial needs, helping to optimize your economic potential.</p>
        <ul>
          <li>Expense Tracking: Automatically categorize and track expenses.</li>
          <li>Investment Guidance: Personalized insights to help you invest wisely.</li>
        </ul>
      </div>
    </section>

    <!-- Analytics Dashboard Section -->
    <section id="analytics-dashboard">
      <div class="dashboard-title">
        <h2>Understand Your Financial Landscape</h2>
        <p>Delve deeper into your financial habits with our powerful AI insights.</p>
      </div>
      <div class="dashboard-content">
        <div class="info-cards">
          <div class="info-card">
            <h3>Comprehensive Budget Analysis</h3>
            <p>Get detailed reports breaking down your spending and savings.</p>
          </div>
          <div class="info-card">
            <h3>Future Expense Projections</h3>
            <p>Our AI predicts upcoming expenses to help you plan ahead.</p>
          </div>
          <div class="info-card">
            <h3>Investment Performance Tracker</h3>
            <p>Track how your investments are performing in real-time.</p>
          </div>
        </div>
        <div class="dashboard-visual">
          <img src="@/assets/car.png" alt="Financial Dashboard">
        </div>
      </div>
    </section>

    <!-- Real-time Insights Section -->
    <section id="real-time-insights">
      <div class="content-with-image">
        <div class="text-content">
          <h2>Real-Time Financial Insights</h2>
          <p>Stay ahead with up-to-the-minute data on your financial status.</p>
          <div class="insight-cards">
            <div class="insight-card">
              <h3>Auto-generated Financial Reports</h3>
              <p>Instantly receive comprehensive financial summaries tailored to your needs.</p>
            </div>
            <div class="insight-card">
              <h3>Spending Habit Analysis</h3>
              <p>Understand your spending patterns and receive tips for better budget management.</p>
            </div>
          </div>
          <button @click="learnMore">Learn more</button>
        </div>
        <!-- Image on the right -->
        <div class="image-container">
          <img src="/assets/real-data.png" alt="Detailed Financial Analysis">
        </div>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  name: 'MainContent',
  methods: {
    learnMore() {
      this.$router.push('/learn-more');
    },
    addAnimation() {
      const elements = document.querySelectorAll('.intro-container, .intro-text, .title, .description, .photo, .small-description, .sdesitem, header, .feature-icons div, .stats-section, .stats-header, .stats-container, .stat-item, .container, .text-content, .dashboard-visual, .info-cards, .info-card, .dashboard-title, #real-time-insights .content-with-image, #real-time-insights .text-content, #real-time-insights .image-container, .insight-cards, .insight-card');

      elements.forEach((element, index) => {
        requestAnimationFrame(() => {
          element.style.opacity = '0';
          element.style.animation = `slide-in 0.5s ease-in-out ${index * 0.1}s forwards`;
        });
      });
    },
    mounted() {
      this.addAnimation();
    },
  }
}
</script>

<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.intro-container {
  gap: 0.1rem;
  padding-left: 3rem;
  padding-right: 3rem;
  padding-top: 1.5rem;
  flex-direction: column;
  display: flex;
  opacity: 1;
  animation: none;
}

.intro-text {
  display: flex;
  width: auto;
  opacity: 1;
  animation: none;
}

.title {
  font-weight: bold;
  color: black;
  display: flex;
  text-align: left;
  flex-direction: column;
  font-size: 4rem;
  max-width: 30rem;
  flex-wrap: wrap;
  opacity: 1;
  animation: none;
}

.description {
  color: dark gray;
  display: flex;
  text-align: left;
  font-size: 1.2rem;
  padding-top: 20px;
  flex-wrap: wrap;
  opacity: 1;
  animation: none;
}

.small-description {
  padding-top: 90px;
  flex-direction: row;
  gap: 80px;
  display: flex;
  flex-direction: row;
  opacity: 1;
  animation: none;
}

.sdesitem {
  max-width: 150px;
  opacity: 1;
  animation: none;
}

.sdestext {
  list-style-type: none;
  color: dark gray;
  font-size: 18px;
  text-align: left;
  flex-direction: column;
  font-weight: normal;
  opacity: 1;
  animation: none;
}

.sdesimg img {
  list-style-type: none;
  width: 30%;
  border-radius: 20%;
  opacity: 1;
  animation: none;
}

.sdesimg {
  list-style-type: none;
  opacity: 1;
  animation: none;
}

.photo img {
  width: 50%;
  border-radius: 20%;
  opacity: 1;
  animation: none;
}

.photo {
  text-align: right;
  margin: auto;
  opacity: 1;
  animation: none;
}
/* Global settings and the main content area */
#main-content {
  display: flex;
  flex-direction: column;
  background-color: white; /* Dark blue background */
  color: black; /* White text for better contrast */
  font-family: 'Segoe UI', Arial, sans-serif; /* Modern font */
  margin-top: 0;
  opacity: 1;
  animation: none;
}

header {
  text-align: center;
  padding: 50px 20px;
  background: none; /* Removing the light background */
  opacity: 1;
  animation: none;
}

h1, h2, h3 {
  color: #007bff;
  opacity: 1;
  animation: none;
}

p {
  color: black; /* Lighter grey for paragraphs */
  opacity: 1;
  animation: none;
}

button {
  background-color: #4a90e2; /* Blue that stands out */
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold; /* Make the text a bit bolder */
  transition: background-color 0.3s ease;
  opacity: 1;
  animation: none;
}

button:hover {
  background-color: #357ab8; /* Darker shade on hover */
  opacity: 1;
  animation: none;
}

/* Feature icons and stats section styling */
.feature-icons div, .stat-item, #features li {
  background: #2a3f5f; /* Slightly lighter blue background for items */
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Subtle shadows for depth */
  font-size: 1rem;
  color: white;
  opacity: 1;
  animation: none;
  text-align: center;
}

.feature-icons {
  align-self: center;
}

.stats-section {
  text-align: center;
  padding: 40px;
  background: white; /* Even darker background for the section */
  opacity: 1;
  animation: none;
}

.stats-header h2 {
  font-size: 1.8rem; /* Slightly larger for better visibility */
  margin-bottom: 20px;
  opacity: 1;
  animation: none;
}

.stats-header p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 1;
  animation: none;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  opacity: 1;
  animation: none;
  flex-wrap: wrap;
}

.stat-item {
  width: 30%; /* Ensuring even spacing */
  opacity: 1;
  animation: none;
}

.stat-item p {
  color: white;
  opacity: 1;
  animation: none;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Align items vertically */
  margin-top: 20px;
  opacity: 1;
  animation: none;
}

.text-content, .dashboard-visual {
  flex: 1;
  padding: 20px;
  opacity: 1;
  animation: none;
}

.text-content {
  align-self: start; /* Align text content to the top */
  opacity: 1;
  animation: none;
}

/* Dashboard section specific */
#analytics-dashboard .dashboard-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Aligns children at the top */
  opacity: 1;
  animation: none;
}

.dashboard-title {
  align-content: center;
  text-align: center;
  opacity: 1;
  animation: none;
}

.info-cards {
  width: 40%; /* Allocate width for the info cards */
  opacity: 1;
  animation: none;
}

.info-cards p{
  color: white;
  opacity: 1;
  animation: none;
}

.inf-cards h2{
  color: #45BAF6;
  opacity: 1;
  animation: none;
}

.info-card {
  background: #2a3f5f; /* Card background */
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  opacity: 1;
  animation: none;
}

.dashboard-visual {
  width: 58%; /* Allocate width for the visual */
  background-color: #202938; /* Slightly different background for emphasis */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* More prominent shadow */
  opacity: 1;
  animation: none;
}

ul {
  list-style-type: none; /* Removing bullet points */
  padding-left: 0; /* Align list items */
  opacity: 1;
  animation: none;
}
#real-time-insights .content-with-image {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  opacity: 1;
  animation: none;
}

#real-time-insights .text-content {
  width: 60%;
  opacity: 1;
  animation: none;
}

#real-time-insights .image-container {
  width: 35%;
  padding-left: 20px;
  opacity: 1;
  animation: none;
}

#real-time-insights .image-container img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  opacity: 1;
  animation: none;
}

/* Responsive images styling */
img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  opacity: 1;
  animation: none;
}

/* Medium devices (tablets, 768px and up) */
@media (max-width: 768px) {
  .container, .dashboard-content, .real-time-insights .content-with-image {
    flex-direction: column;
  }

  .stats-container {
    flex-direction: column;
    align-items: center;
  }

  .feature-icons div, .stat-item, .info-card {
    width: 80%;
    margin-bottom: 20px;
  }

  .text-content, .dashboard-visual, .real-time-insights .text-content, .real-time-insights .image-container {
    width: 100%;
  }

  .intro-text {
    flex-direction: column;
    align-items: center;
  }

  .photo {
    text-align: center;
    margin: 20px 0;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container, .stats-container, .dashboard-content, .real-time-insights .content-with-image {
    max-width: 1140px; /* Bootstrap's default container max-width for large screens */
    margin: auto;
  }

  .stat-item, .info-card {
    flex: 1 1 33%; /* Allows three items per row */
  }

  .text-content, .dashboard-visual {
    flex: 1 1 50%;
  }

  .real-time-insights .text-content, .real-time-insights .image-container {
    width: 60%; /* Text takes slightly more space */
    width: 35%; /* Image takes less space */
  }
}

/* Ensuring padding and gap responsiveness */
.container, .stats-container, .dashboard-content, .real-time-insights .content-with-image {
  padding: 20px;
  gap: 20px;
  opacity: 1;
  animation: none;
}
</style>
