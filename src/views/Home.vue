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
        <div class=sdesitem>
            <li class="sdesimg">
                <img src='@/assets/bot.png' alt="placeholder">
            </li>
            <li class="sdestext">
                Fine-tuned model specializing in finance and investing
            </li>
        </div>
        <div class=sdesitem>
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
      <h1>Improve your repair efficiency by 25%</h1>
      <p>Detect Auto is an AI-driven analytics platform that makes your shop more profitable.</p>
      <button @click="learnMore">Learn More</button>
    </header>

    <div id="efficiency-chart"></div>

    <div class="feature-icons">
      <div>Compatible with any shop or dealer management software</div>
      <div>Data-driven insights provide actionable steps to improve efficiency</div>
    </div>

    <!-- Statistics Section -->
    <section id="statistics" class="stats-section">
      <div class="stats-header">
        <h2>Don't take our word for it.</h2>
        <p>Receive actionable insights on your repairs without ever pressing a button. It’s automation at its finest.</p>
      </div>
      <div class="stats-container">
        <div class="stat-item">
          <h3>$1,500+</h3>
          <p>Increase in monthly earnings per bay</p>
        </div>
        <div class="stat-item">
          <h3>25%</h3>
          <p>Improvement in technician repair efficiency</p>
        </div>
        <div class="stat-item">
          <h3>5+ Hours</h3>
          <p>Monthly increase in billable time per bay</p>
        </div>
      </div>
    </section>

    <!-- Feature Highlights Section -->
    <section id="features" class="container">
      <img src="@/assets/performance-overview.png" alt="Performance Overview" />
      <div class="text-content">
        <h2>Highlight Your Performance</h2>
        <p>Designed with auto shops in mind, Detect Auto helps optimize every aspect of your operations.</p>
        <ul>
          <li>Repair Analytics: Pinpoint issues automatically and suggest actions.</li>
          <li>Continuous Improvement: Track and improve process efficiencies.</li>
        </ul>
      </div>
    </section>

    <!-- Analytics Dashboard Section -->
    <section id="analytics-dashboard">
      <h2>View your repairs like you never have before</h2>
      <p>Gain insights into your repair process through the power of AI</p>
      <div class="dashboard-content">
        <div class="info-cards">
          <div class="info-card">
            <h3>Precise Labor Rates</h3>
            <p>Understand your shop's strengths and weaknesses for every repair completed.</p>
          </div>
          <div class="info-card">
            <h3>Identify Outliers</h3>
            <p>See which vehicles and technicians are performing the best (and more importantly, the worst) for your shop.</p>
          </div>
          <div class="info-card">
            <h3>Track Your Growth</h3>
            <p>View breakdowns of Gross Profit percentage by vehicle and employee. Watch your profits soar as we make dynamic changes to the way your shop runs.</p>
          </div>
        </div>
        <div class="dashboard-visual">
          <img src="@/assets/car.png" alt="Analytics Dashboard">
        </div>
      </div>
    </section>

    <!-- Real-time Insights Section -->
    <section id="real-time-insights">
      <div class="content-with-image">
        <div class="text-content">
          <h2>Get real-time insights on your performance.</h2>
          <p>Know what works and leverage your data to constantly improve.</p>
          <div class="insight-cards">
            <div class="insight-card">
              <h3>Auto-generated reports</h3>
              <p>Get accurate insights on your performance with auto-generated reports that help provide actionable summaries from the past week.</p>
            </div>
            <div class="insight-card">
              <h3>Customer analysis</h3>
              <p>Get a complete view of your customer's repair history and understand how to service them better the next time they roll through.</p>
            </div>
          </div>
          <button @click="learnMore">Learn more</button>
        </div>
        <!-- Image on the right -->
        <div class="image-container">
          <img src="@/assets/real-data.png" alt="Insightful Data Visualization">
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
    }
  }
}
</script>


<style scoped>

.intro-container {
  gap: 0.1rem;
  padding-left: 3rem;
  padding-right: 3rem;
  padding-top: 1.5rem;
  flex-direction: column;
  display: flex;
}

.intro-text {
  display: flex;
  width: auto;
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
}

.description {
  color: dark gray;
  display: flex;
  text-align: left;
  font-size: 1.2rem;
  padding-top: 20px;
  flex-wrap: wrap;
}

.small-description {
  padding-top: 90px;
  flex-direction: row;
  gap: 80px;
  display: flex;
  flex-direction: row;
}

.sdesitem {
  max-width: 150px;
}

.sdestext {
  list-style-type: none;
  color: dark gray;
  font-size: 18px;
  text-align: left;
  flex-direction: column;
  font-weight: normal;
}

.sdesimg img {
  list-style-type: none;
  width: 30%;
  border-radius: 20%;
}

.sdesimg {
  list-style-type: none;
}

.photo img {
  width: 50%;
  border-radius: 20%;
}

.photo {
  text-align: right;
  margin: auto;
}
/* Global settings and the main content area */
#main-content {
  display: flex;
  flex-direction: column;
  background-color: white; /* Dark blue background */
  color: black; /* White text for better contrast */
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
@media (max-width: 768px) {
  .container, .dashboard-content, .real-time-insights .content-with-image {
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

  .text-content, .dashboard-visual, .real-time-insights .text-content, .real-time-insights .image-container {
    flex: 1 1 50%; /* Takes up half of the container width */
  }

  .intro-text {
    flex-direction: column;
  }

  .photo {
    padding: 1rem;
  }

  .photo img{
    width: 80%;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container, .stats-container, .dashboard-content, .real-time-insights .content-with-image {
    max-width: 1140px; /* Bootstrap's default container max-width for large screens */
    margin: auto; /* Centers the container */
  }

  .stat-item, .info-card {
    flex: 1 1 33%; /* Allows three items per row */
  }

  .text-content, .dashboard-visual {
    flex: 1 1 50%; /* Ensures text and visuals are balanced */
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
}


</style>
