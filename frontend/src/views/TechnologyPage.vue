<template>
  <div class="features-container">
    <h2 class="features-title animate fade-in">{{ $t('technologyPage.title') }}</h2>
    <p class="description animate fade-in">{{ $t('technologyPage.description') }}</p>
    <div class="feature-grid">
      <div class="feature animate slide-in-left" v-for="feature in features" :key="feature.id">
        <div class="feature-icon-title">
          <img src="@/assets/tick.png" alt="Tick" class="tick-icon" />
          <h3 class="feature-title">{{ $t(feature.title) }}</h3>
        </div>
        <p class="feature-description">{{ $t(feature.description) }}</p>
      </div>
    </div>
    <!-- Financial Consulting Section -->
    <div class="feature-section consulting-section animate slide-in-left">
      <h2>{{ $t('technologyPage.financialConsulting.title') }}</h2>
      <p class="note">{{ $t('technologyPage.financialConsulting.note') }}</p>
      <div class="service-details">
        <div class="services-grid">
          <div class="left-column">
            <ul class="service-highlights">    
              <li v-for="(item, index) in $tm('technologyPage.financialConsulting.highlightsLeft', { returnObjects: true })" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="right-column">
            <ul class="service-highlights">
              <li v-for="(item, index) in $tm('technologyPage.financialConsulting.highlightsRight', { returnObjects: true })" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <button>{{ $t('technologyPage.financialConsulting.button') }}</button>
      </div>
    </div>

   <!-- Financial Education Section -->
    <div class="feature-section education-section animate slide-in-right">
      <h2>{{ $t('technologyPage.financialEducation.title')}}</h2>
      <p class="note">{{ $t('technologyPage.financialEducation.note')}}</p>
      <div class="service-details">
        <ul class="service-highlights">
          <li v-for="(item, index) in $tm('technologyPage.financialEducation.highlights', { returnObjects: true })" :key="index">
            {{ item }}
          </li>
        </ul>
        <button>{{ $t('technologyPage.financialEducation.button') }}</button>
      </div>
    </div>
  
    <div class="insights-section">
      <div class="image animate slide-in-right">
        <img src="@/assets/stock.png" alt="Car in garage">
      </div>
      <div class="content animate slide-in-left">
        <h2>{{ $t('technologyPage.insights.title') }}</h2>
        <h3>{{ $t('technologyPage.insights.subtitle') }}</h3>
        <p>{{ $t('technologyPage.insights.description') }}</p>
        <div class="list-item" v-for="(item, index) in $tm('technologyPage.insights.points', { returnObjects: true})" :key="index">
          <img src= "@/assets/tick.png" alt="Check">
          <span>{{ item }}</span>
        </div>
        <button @click="learnMore" class="animate slide-in-up">{{ $t('technologyPage.insights.button') }}</button>
      </div>
    </div>
  
    <div class="computer-vision-section animate fade-in">
      <h2>{{ $t('technologyPage.computerVision.title') }}</h2>
      <p>{{ $t('technologyPage.computerVision.subtitle') }}</p>
      <div class="tracking-features">
        <div class="tracking-feature animate slide-in-left">
          <img src="@/assets/forecast.png" alt="Vehicle Tracking">
          <h3>{{ $t('technologyPage.computerVision.featuresTitle.analyze') }}</h3>
          <p>{{ $t('technologyPage.computerVision.featuresDescription.analyze') }}</p>
        </div>
        <div class="tracking-feature animate slide-in-up">
          <img src="@/assets/sales.png" alt="Employee Tracking">
          <h3>{{ $t('technologyPage.computerVision.featuresTitle.plan') }}</h3>
          <p>{{ $t('technologyPage.computerVision.featuresDescription.plan') }}</p>
        </div>
        <div class="tracking-feature animate slide-in-right">
          <img src="@/assets/dashboard.png" alt="Advanced Computer Vision">
          <h3>{{ $t('technologyPage.computerVision.featuresTitle.secure') }}</h3>
          <p>{{ $t('technologyPage.computerVision.featuresDescription.secure') }}</p>
        </div>
      </div>
    </div>

    <div class="partners-section animate fade-in">
      <h2 class="section-title">{{ $t('technologyPage.partners.title') }}</h2>
      <p class="section-description" v-html="$t('technologyPage.partners.description')"></p>
      <div class="partners">
        <div class="partner animate slide-in-left">
          <img src = "@/assets/shop.png"  alt="Shop-Ware Logo">
          <p v-html="$t('technologyPage.partners.left')"></p>
        </div>
        <div class="partner animate slide-in-right">
          <img src="@/assets/tek.png" alt="Tekmetric Logo">
          <p v-html="$t('technologyPage.partners.right')"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeaturesAndTechnologySection',
  data() {
    return {
      features: [
        {
          id: 1,
          title: "technologyPage.features.title.plan",
          description: "technologyPage.features.description.plan",
          icon: "@/assets/tick.png"
        },
        {
          id: 2,
          title: "technologyPage.features.title.manage",
          description: "technologyPage.features.description.manage",
          icon: "@/assets/tick.png"
        },
        {
          id: 3,
          title: "technologyPage.features.title.edu",
          description: "technologyPage.features.description.edu",
          icon: "@/assets/tick.png"
        },
        {
          id: 4,
          title: "technologyPage.features.title.analyze",
          description: "technologyPage.features.description.analyze",
          icon: "@/assets/tick.png"
        }
      ]
    };
  },
  methods: {
    learnMore() {
      // Implementation for the Learn More button
    }
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
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

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

.feature-icon-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.tick-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
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

@media (max-width: 767px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .insights-section,
  .computer-vision-section,
  .partners-section {
    flex-direction: column;
  }

  .image,
  .content,
  .tracking-feature,
  .partner {
    max-width: 100%;
  }

  .insights-section {
    flex-direction: column;
    text-align: center;
  }

  .content {
    order: 1;
  }

  .image {
    order: 2;
    margin-top: 20px;
  }

  .tracking-features {
    flex-direction: column;
  }

  .tracking-feature {
    margin-bottom: 20px;
  }
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
  border-radius: 8px;
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
}

.section-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.tracking-features {
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-wrap: nowrap;
  margin: 20px 0;
}

.tracking-feature {
  flex: 1;
  margin: 0 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.tracking-feature img {
  width: 100%;
  height: auto;
  margin-bottom: 15px;
}

.tracking-feature h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.tracking-feature p {
  font-size: 14px;
  color: #666;
  text-align: left;
}

.partners-section {
  text-align: center;
  padding: 40px 0;
  background-color: #f7f7f7;
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
  gap: 50px;
}

.partner {
  width: 300px;
  text-align: left;
}

.partner img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.partner p {
  font-size: 14px;
  color: #666;
}

.feature-section {
  background-color: #000000; /* Blue background for consulting */
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
  background-color: #323537;
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
  background-color: #151719; /* Even darker on hover */
  transform: scale(1.05);
}
</style>