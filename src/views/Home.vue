<template>
  <section id="main-content">
    <div class="container">
      <div class="intro-text">
        <li class="title animate fade-in">Making the most informed choices</li>
        <li class="description animate fade-in">With FinBud, you can ask for the best financial advice anytime, anywhere</li>
        <div class="small-description">
          <div class="sdesitem animate slide-in-left">
            <li class="sdesimg">
              <img src='@/assets/bot.png' alt="placeholder">
            </li>
            <li class="sdestext">
              Fine-tuned model specializing in finance and investing
            </li>
          </div>
          <div class="sdesitem animate slide-in-right">
            <li class="sdesimg">
              <img src='@/assets/bot.png' alt="placeholder">
            </li>
            <li class="sdestext">
              Accessible and up-to-date on the latest information
            </li>
          </div>
        </div>
      </div>
      <div class="photo animate fade-in">
        <img src='@/assets/bot.png' alt="placeholder">
      </div>
    </div>
    <header>
      <h1 class="animate fade-in">Enhance Your Financial Awareness by 25%</h1>
      <p class="animate fade-in">FinBud is an AI-driven financial analytics platform that makes managing your finances more efficient.</p>
      <button @click="learnMore" class="animate slide-in-up">Learn More</button>
    </header>

    <div id="efficiency-chart" class="animate fade-in"></div>

    <div class="feature-icons">
      <div class="animate slide-in-left">Compatible with any personal finance management software</div>
      <div class="animate slide-in-right">Data-driven insights provide actionable steps to manage and improve your financial health</div>
    </div>

    <!-- Statistics Section -->
    <section id="statistics" class="stats-section">
      <div class="stats-header">
        <h2 class="animate fade-in">Experience the Impact</h2>
        <p class="animate fade-in">Gain actionable insights into your finances automatically. It’s financial management at its best.</p>
      </div>
      <div class="stats-container">
        <div class="stat-item animate slide-in-left">
          <h3>20% Savings Increase</h3>
          <p>Average increase in savings per user</p>
        </div>
        <div class="stat-item animate slide-in-up">
          <h3>30% Debt Reduction</h3>
          <p>Average reduction in debt after one year</p>
        </div>
        <div class="stat-item animate slide-in-right">
          <h3>Improved Credit Score</h3>
          <p>Enhance your credit score within six months</p>
        </div>
      </div>
    </section>

    <!-- Feature Highlights Section -->
    <section id="features" class="container">
      <img src="@/assets/performance-overview.png" alt="Performance Overview" class="animate slide-in-left" />
      <div class="text-content animate slide-in-right">
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
      <h2 class="animate fade-in">Understand Your Financial Landscape</h2>
      <p class="animate fade-in">Delve deeper into your financial habits with our powerful AI insights.</p>
      <div class="dashboard-content">
        <div class="info-cards">
          <div class="info-card animate slide-in-left">
            <h3>Comprehensive Budget Analysis</h3>
            <p>Get detailed reports breaking down your spending and savings.</p>
          </div>
          <div class="info-card animate slide-in-up">
            <h3>Future Expense Projections</h3>
            <p>Our AI predicts upcoming expenses to help you plan ahead.</p>
          </div>
          <div class="info-card animate slide-in-right">
            <h3>Investment Performance Tracker</h3>
            <p>Track how your investments are performing in real-time.</p>
          </div>
        </div>
        <div class="dashboard-visual animate fade-in">
          <img src="@/assets/car.png" alt="Financial Dashboard">
        </div>
      </div>
    </section>

    <!-- Real-time Insights Section -->
    <section id="real-time-insights">
      <div class="content-with-image">
        <div class="text-content animate slide-in-left">
          <h2>Real-Time Financial Insights</h2>
          <p>Stay ahead with up-to-the-minute data on your financial status.</p>
          <div class="insight-cards">
            <div class="insight-card animate slide-in-up">
              <h3>Auto-generated Financial Reports</h3>
              <p>Instantly receive comprehensive financial summaries tailored to your needs.</p>
            </div>
            <div class="insight-card animate slide-in-up">
              <h3>Spending Habit Analysis</h3>
              <p>Understand your spending patterns and receive tips for better budget management.</p>
            </div>
          </div>
          <button @click="learnMore" class="animate slide-in-up">Learn more</button>
        </div>
        <div class="image-container animate slide-in-right">
          <img src="@/assets/real.png" alt="Detailed Financial Analysis">
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
  },
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
  },
};
</script>

<style scoped>
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

.slide-in-up {
  transform: translateY(20px);
}

.slide-in-up.animate-visible {
  transform: translateY(0);
}

/* General Styling */
.container {
  gap: 0.1rem;
  padding-left: 3rem;
  padding-right: 3rem;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: row;
}

.title {
  font-weight: bold;
  color: #007bff;
  display: flex;
  text-align: left;
  flex-direction: column;
  font-size: 5rem;
  width: 30rem;
  flex-wrap: wrap;
}

.description {
  color: white;
  display: flex;
  text-align: left;
  font-size: 20px;
  flex-direction: column;
  padding-top: 20px;
  width: 600px;
  flex-wrap: wrap;
}

.small-description {
  padding-top: 90px;
  flex-direction: row;
  gap: 80px;
  display: flex;
}

.sdesitem {
  max-width: 150px;
}

.sdestext {
  list-style-type: none;
  color: white;
  font-size: 18px;
  text-align: left;
  flex-direction: column;
  font-weight: normal;
}

.sdesimg img {
  list-style-type: none;
  width: 30%;
}

.sdesimg {
  list-style-type: none;
}

.photo img {
  width: 80%;
}

.photo {
  text-align: right;
}
/* Global settings and the main content area */
#main-content {
  display: flex;
  flex-direction: column;
  background-color: #1e2d47; /* Dark blue background */
  color: #ffffff; /* White text for better contrast */
  font-family: 'Segoe UI', Arial, sans-serif; /* Modern font */
  margin-top: 0;
}

header {
  text-align: center;
  padding: 50px 20px;
  background: none; /* Removing the light background */
}

h1, h2, h3 {
  color: #ffffff;
}

p {
  color: #cccccc; /* Lighter grey for paragraphs */
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
}

button:hover {
  background-color: #357ab8; /* Darker shade on hover */
}

/* Feature icons and stats section styling */
.feature-icons div, .stat-item, #features li {
  background: #2a3f5f; /* Slightly lighter blue background for items */
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Subtle shadows for depth */
  font-size: 1rem;
}

.stats-section {
  text-align: center;
  padding: 40px;
  background: #23344e; /* Even darker background for the section */
}

.stats-header h2 {
  font-size: 1.8rem; /* Slightly larger for better visibility */
  margin-bottom: 20px;
}

.stats-header p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.stat-item {
  width: 30%; /* Ensuring even spacing */
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Align items vertically */
  margin-top: 20px;
}

.text-content, .dashboard-visual {
  flex: 1;
  padding: 20px;
}

.text-content {
  align-self: start; /* Align text content to the top */
}

/* Dashboard section specific */
#analytics-dashboard .dashboard-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Aligns children at the top */
}

.info-cards {
  width: 40%; /* Allocate width for the info cards */
}

.info-card {
  background: #2a3f5f; /* Card background */
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.dashboard-visual {
  width: 58%; /* Allocate width for the visual */
  background-color: #202938; /* Slightly different background for emphasis */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* More prominent shadow */
}

ul {
  list-style-type: none; /* Removing bullet points */
  padding-left: 0; /* Align list items */
}
#real-time-insights .content-with-image {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

#real-time-insights .text-content {
  width: 60%;
}

#real-time-insights .image-container {
  width: 35%;
  padding-left: 20px;
}

#real-time-insights .image-container img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container, .dashboard-content, #real-time-insights .content-with-image {
    flex-direction: row;
    justify-content: space-between; /* Distributes space between items */
  }

  .stats-container {
    flex-direction: row;
    justify-content: space-around; /* Evenly spaces stat items */
  }

  .feature-icons div, .stat-item, .info-card {
    flex: 1 1 auto; /* Allows flex items to grow and shrink as needed */
  }

  .text-content, .dashboard-visual, #real-time-insights .text-content, #real-time-insights .image-container {
    flex: 1 1 50%; /* Takes up half of the container width */
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container, .stats-container, .dashboard-content, #real-time-insights .content-with-image {
    max-width: 1140px; /* Bootstrap's default container max-width for large screens */
    margin: auto; /* Centers the container */
  }

  .stat-item, .info-card {
    flex: 1 1 33%; /* Allows three items per row */
  }

  .text-content, .dashboard-visual {
    flex: 1 1 50%; /* Ensures text and visuals are balanced */
  }

  #real-time-insights .text-content, #real-time-insights .image-container {
    width: 60%; /* Text takes slightly more space */
    width: 35%; /* Image takes less space */
  }
}

/* Ensuring padding and gap responsiveness */
.container, .stats-container, .dashboard-content, #real-time-insights .content-with-image {
  padding: 20px;
  gap: 20px;
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container, .dashboard-content, .real-time-insights .content-with-image {
    flex-direction: row;
    justify-content: space-between; /* Distributes space between items */
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
    flex: 1 1 50%; /* Takes up half of the container width */
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container, .stats-container, .dashboard-content, #real-time-insights .content-with-image {
    max-width: 1140px; /* Bootstrap's default container max-width for large screens */
    margin: auto;
  }

  .stat-item, .info-card {
    flex: 1 1 33%; /* Allows three items per row */
  }

  .text-content, .dashboard-visual {
    flex: 1 1 50%;
  }

  #real-time-insights .text-content, #real-time-insights .image-container {
    width: 60%; /* Text takes slightly more space */
    width: 35%; /* Image takes less space */
  }
}
</style>
