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
      <p class="section-description">
        <template v-for="(part, index) in $tm('technologyPage.partners.descriptionParts', { returnObjects: true })" :key="index">
          <template v-if="typeof part === 'string'">
            {{ part }}
          </template>
          <template v-else-if="part.type === 'link'">
            <a :href="part.href">{{ part.text }}</a>
          </template>
        </template>
      </p>
      <div class="partners">
        <div class="partner animate slide-in-left" v-for="partner in partners" :key="partner.id">
          <img :src="partner.img" :alt="partner.alt" />
          <p>
            {{ $t(partner.text) }}
            <a :href="$t(partner.linkHref)">{{ $t(partner.linkText) }}</a>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import shopImage from "@/assets/shop.png";
import tekImage from "@/assets/tek.png";

export default {
  name: 'FeaturesAndTechnologySection',
  data() {
    return {
      partners: [
        {
          id: 1,
          img: shopImage,
          alt: "Shop-Ware Logo",
          text: "technologyPage.partners.left.text",
          linkText: "technologyPage.partners.left.linkText",
          linkHref: "technologyPage.partners.left.linkHref"
        },
        {
          id: 2,
          img: tekImage,
          alt: "Tekmetric Logo",
          text: "technologyPage.partners.right.text",
          linkText: "technologyPage.partners.right.linkText",
          linkHref: "technologyPage.partners.right.linkHref"
        }
      ],
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
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-visible {
  opacity: 1;
}

.fade-in {
  transform: translateY(30px);
}

.fade-in.animate-visible {
  transform: translateY(0);
}

.slide-in-left {
  transform: translateX(-40px);
}

.slide-in-left.animate-visible {
  transform: translateX(0);
}

.slide-in-right {
  transform: translateX(40px);
}

.slide-in-right.animate-visible {
  transform: translateX(0);
}

.slide-in-up {
  transform: translateY(30px);
}

.slide-in-up.animate-visible {
  transform: translateY(0);
}

/* General Styling */
.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
}

.features-title {
  font-size: 2.5rem;
  color: #000000;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
}

.description {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 20px;
}

.feature {
  padding: 30px;
  border: 2px solid #000000;
  border-radius: 12px;
  background: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.tick-icon {
  width: 24px;
  height: 24px;
  margin-right: 15px;
}

.feature-title {
  font-size: 1.4rem;
  color: #000000;
  font-weight: 600;
  text-align: left;
}

.feature-description {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  text-align: left;
}

/* Insights Section */
.insights-section {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  margin: 60px 0;
  gap: 40px;
}

.image {
  flex: 1;
  max-width: 50%;
}

.image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.content {
  flex: 1;
  padding: 40px;
  max-width: 50%;
  background: #ffffff;
  border: 2px solid #000000;
  border-radius: 12px;
  text-align: left;
}

.content h2 {
  font-size: 2rem;
  color: #000000;
  margin-bottom: 1rem;
  font-weight: 700;
}

.content h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.content p {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.list-item img {
  width: 20px;
  height: 20px;
  margin-right: 15px;
}

.list-item span {
  font-size: 1rem;
  color: #333;
}

button {
  padding: 12px 24px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Computer Vision Section */
.computer-vision-section {
  text-align: center;
  margin: 80px 0;
  padding: 40px;
}

.computer-vision-section h2 {
  font-size: 2rem;
  color: #000000;
  margin-bottom: 1rem;
  font-weight: 700;
}

.computer-vision-section p {
  font-size: 1.1rem;
  color: #333;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.tracking-features {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 40px 0;
}

.tracking-feature {
  flex: 1;
  padding: 30px;
  border: 2px solid #000000;
  border-radius: 12px;
  background: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 350px;
}

.tracking-feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.tracking-feature img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.tracking-feature h3 {
  font-size: 1.3rem;
  color: #000000;
  margin-bottom: 15px;
  font-weight: 600;
}

.tracking-feature p {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

/* Partners Section */
.partners-section {
  text-align: center;
  padding: 60px 0;
  background-color: #ffffff;
  border-top: 2px solid #000000;
  border-bottom: 2px solid #000000;
}

.partners-section h2 {
  font-size: 2rem;
  color: #000000;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.partners {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 40px;
}

.partner {
  width: 300px;
  padding: 20px;
  border: 2px solid #000000;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.partner:hover {
  transform: translateY(-5px);
}

.partner img {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}

.partner p {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

.partner a {
  color: #000000;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.partner a:hover {
  color: #333;
}

/* Feature Sections (Consulting & Education) */
.feature-section {
  background-color: #000000;
  color: white;
  padding: 40px;
  border-radius: 12px;
  width: 80%;
  margin: 40px auto;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-section h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.feature-section .note {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.service-details {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 8px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 30px;
}

.service-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
}

.service-highlights li {
  margin-bottom: 15px;
  padding-left: 25px;
  position: relative;
  font-size: 1rem;
  line-height: 1.6;
}

.service-highlights li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .feature-grid {
    gap: 20px;
  }
  
  .tracking-features {
    flex-wrap: wrap;
  }
  
  .tracking-feature {
    min-width: 280px;
  }
  
  .feature-section {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .features-title {
    font-size: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .insights-section {
    flex-direction: column;
  }
  
  .image,
  .content {
    max-width: 100%;
  }
  
  .tracking-features {
    flex-direction: column;
    align-items: center;
  }
  
  .tracking-feature {
    width: 100%;
    max-width: 400px;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .partners {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  
  .partner {
    width: 100%;
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .features-title {
    font-size: 1.8rem;
  }
  
  .description {
    font-size: 1rem;
  }
  
  .feature-section {
    width: 100%;
    padding: 30px 20px;
  }
  
  .content {
    padding: 30px 20px;
  }
}
</style>