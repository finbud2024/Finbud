<template>
  <div class="features-container">
    <h2 class="features-title">Analytics that drive your business.</h2>
    <p class="description">Review your performance and drive change with our actionable insights provided via our intuitive web app.</p>
    <div class="feature-grid">
      <div class="feature" v-for="feature in features" :key="feature.id">
        <img :src="feature.icon" :alt="feature.title" class="feature-icon"/>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
      </div>
    </div>
    <div class="insights-section">
      <div class="image">
        <img src="@/assets/car.png" alt="Car in garage">
      </div>
      <div class="content">
        <h2>ARTIFICIAL INTELLIGENCE</h2>
        <h3>Get real-time insights on your performance.</h3>
        <p>Know what works and leverage your data to constantly improve.</p>
        <div class="list-item">
          <img src= "@/assets/tick.png" alt="Check">
          <span>Auto-generated reports: Get accurate insights on your performance with auto-generated reports that help you optimize your operations.</span>
        </div>
        <div class="list-item">
          <img src="@/assets/tick.png"  alt="Check">
          <span>Customer analysis: Get a complete view of your customer's repair data so you can understand how to price your services.</span>
        </div>
        <button @click="learnMore">Learn more</button>
      </div>
    </div>
    <div class="computer-vision-section">
      <h2 class="section-title">See the technology that’s driving the change.</h2>
      <p class="section-description">Our advanced computer vision system records all the work your technicians do on your customer’s vehicles. This allows us to show you exactly how efficient each and every repair is.</p>

      <div class="tracking-features">
        <div class="tracking-feature">
          <img src="@/assets/vehicle-tracking.png" alt="Vehicle Tracking">
          <h3>Vehicle Tracking</h3>
          <p>Tired of asking technicians how much progress they’ve made on a repair? Our vehicle tracking system provides detailed tracking from the moment a vehicle first enters a bay through its exit when a job is completed.</p>
        </div>
        <div class="tracking-feature">
          <img src="@/assets/employee-tracking.png" alt="Employee Tracking">
          <h3>Employee Tracking</h3>
          <p>Curious how your technicians are doing? We collect repair efficiency statistics for each job, allowing managers to see what aspects need improvement and what techs deserve praise.</p>
        </div>
        <div class="tracking-feature">
          <img src="@/assets/advanced-cv.png" alt="Advanced Computer Vision">
          <h3>Advanced Computer Vision</h3>
          <p>Our proprietary system utilizes neural networks to identify the information that matters most. Think of it like the way your brain works, only it never gets tired (or needs 3 cups of coffee to get through the day).</p>
        </div>
      </div>
    </div>
    <div class="partners-section">
      <h2 class="section-title">Integrate with the best tools in the market</h2>
      <p class="section-description">Check out our connected partners. Don’t see your software on the list of partners? <a href="mailto:contact@yourdomain.com">Drop us a note</a> and we’ll get them added.</p>
      <div class="partners">
        <div class="partner">
          <img src = "@/assets/shop.png"  alt="Shop-Ware Logo">
          <p>Shop-Ware enables users to take advantage of their lightning-fast workflows to repair more cars every month. <a href="#">Learn more</a></p>
        </div>
        <div class="partner">
          <img src="@/assets/tek.png" alt="Tekmetric Logo">
          <p>Tekmetric lets you unleash your shop’s potential with their streamlined workflow settings. <a href="#">Learn more</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TechnologySection',
  data() {
    return {
      features: [
        {
          id: 1,
          title: 'Dynamic Labor Rates',
          description: 'Update labor rates to reflect your shop’s strengths and weaknesses. Never get burned by an RO again.',
          imageUrl: "@/assets/logo1.png",
        },
        {
          id: 2,
          title: 'Identify Outliers',
          description: 'Learn from the best repairs and make changes to the worst to keep your shop running at its peak.',
          icon: 'path/to/your-icon2.svg'
        },
        {
          id: 3,
          title: 'Data-Driven Insights',
          description: 'Auto-extract details about your shop performance from data collected through our camera system.',
          icon: 'path/to/your-icon3.svg'
        },
        {
          id: 4,
          title: 'Repair Order Mapping',
          description: 'Prioritize what work to complete and when to complete it.',
          icon: 'path/to/your-icon4.svg'
        }
      ]
    };
  },
  methods: {
    learnMore() {
      // Implementation for the Learn More button
    }
  }
}
</script>

<style scoped>
.features-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features-title {
  font-size: 24px;
  color: #333;
}

.description {
  margin-bottom: 20px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

.feature {
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  background: #fff;
}

.feature-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.feature-title {
  font-size: 18px;
  color: #333;
}

.feature-description {
  font-size: 14px;
  color: #666;
}

.insights-section {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}

.image {
  flex: 1;
  max-width: 50%;
}

.image img {
  width: 100%;
  height: auto;
  display: block;
}

.content {
  flex: 1;
  padding: 20px;
  max-width: 50%;
  background: #f7f7f7; /* light gray background */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* subtle shadow */
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
}

.list-item img {
  margin-right: 10px;
}

.list-item span {
  font-size: 16px;
  color: #666;
}

button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3; /* darker blue on hover */
}

.computer-vision-section {
    text-align: center;
    margin-top: 40px;
  }

  .section-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }

  .section-description {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
  }

 .tracking-features {
  display: flex;
  justify-content: space-between; /* This will ensure the items are spread evenly */
  align-items: start; /* Aligns items to the top */
  flex-wrap: nowrap; /* Prevents wrapping into multiple lines */
  margin: 20px 0; /* Adds some vertical spacing */
}

.tracking-feature {
  flex: 1; /* Allows each feature to grow and take up equal space */
  margin: 0 10px; /* Adds horizontal spacing between the features */
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  border-radius: 8px;
  background: #fff; /* Gives a white background to each feature block */
  display: flex; /* Makes the internal content use flexbox for layout */
  flex-direction: column; /* Stacks the content vertically */
}

.tracking-feature img {
  width: 100%; /* Ensures the image takes the full width of the container */
  height: auto; /* Keeps the image aspect ratio */
  margin-bottom: 15px; /* Adds space between the image and the text */
}

.tracking-feature h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px; /* Adds space below the heading */
}

.tracking-feature p {
  font-size: 14px;
  color: #666;
  text-align: left; /* Aligns the text to the left */
}
 .partners-section {
    text-align: center;
    padding: 40px 0;
    background-color: #f7f7f7; /* Slightly different background for visual separation */
  }

  .section-title {
    font-size: 24px;
    color: #333;
  }

  .section-description {
    font-size: 16px;
    color: #666;
    margin: 20px 0;
  }

  .partners {
    display: flex;
    justify-content: center;
    gap: 50px; /* Space between partner entries */
  }

  .partner {
    width: 300px; /* Fixed width for each partner block */
    text-align: left;
  }

  .partner img {
    width: 100%; /* Makes the logo responsive within the container width */
    height: auto;
    margin-bottom: 10px;
  }

  .partner p {
    font-size: 14px;
    color: #666;
  }

</style>
