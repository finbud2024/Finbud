<template>
  <div class="container">
    <div class="team-section">
      <li class="title">{{ $t('aboutUsTitle') }}</li>
      <li class="description">
        {{ $t('aboutUsDescription') }}
      </li>
    </div>
    <div class="team-section">
      <li class="title">{{ $t('meetOurTeamTitle') }}</li>
      <swiper
        :slidesPerView="slidesPerView"
        :spaceBetween="30"
        :speed="8000" 
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }"
        :loop="true"
        :loopAdditionalSlides="10" 
        :freeMode="{
          enabled: true,
          momentum: false
        }"
        :modules="modules"
        class="mySwiper-linear"
        :breakpoints="{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }"
      >
     
        <swiper-slide v-for="member in teamMembers" :key="member.name">
          <div class="team-member">
            <div class="image-container">
              <img :src="member.img" :alt="member.name" class="fade-in" />
            </div>
            <h3>{{ member.name }}</h3>
            <p>{{ $t(member.roleKey) }}</p>
            <h2>{{ $t(member.introKey) }}</h2>
            <div class="social-icons">
              <a
                v-for="icon in member.socialIcons"
                :key="icon.name"
                :href="icon.link"
                target="_blank"
              >
                {{ icon.name }}
              </a>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- Testimonials Section -->
    <div class="testimonials-section">
      <li class="title">{{ $t('testimonialsTitle') }}</li>
      <div class="testimonials-container">
        <div
          class="testimonial-card"
          v-for="testimonial in testimonials"
          :key="testimonial.name"
        >
          <h3>{{ testimonial.name }}</h3>
          <div class="stars">
            <span v-for="star in 5" :key="star" class="star">&#9733;</span>
          </div>
          <p>{{ $t(testimonial.feedbackKey) }}</p>
        </div>
      </div>
    </div>

    <section id="contact-page" class="animate fade-in">
      <div class="contact-header animate slide-in-up">
        <h1>{{ $t('contactHeader') }}</h1>
        <p>{{ $t('contactSubheader') }}</p>
      </div>

      <form class="contact-form animate slide-in-up">
        <div class="input-group">
          <label for="full-name">{{ $t('fullNameLabel') }}</label>
          <input
            type="text"
            id="full-name"
            :placeholder="$t('fullNamePlaceholder')"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">{{ $t('emailLabel') }}</label>
          <input
            type="email"
            id="email"
            placeholder="abc@gmail.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="company-name">{{ $t('companyNameLabel') }}</label>
          <input 
            type="text" 
            id="company-name" 
            :placeholder="$t('companyNamePlaceholder')" 
          />
        </div>

        <div class="input-group">
          <label for="mobile-number">{{ $t('mobileNumberLabel') }}</label>
          <input 
            type="tel" 
            id="mobile-number" 
            :placeholder="$t('mobileNumberPlaceholder')" 
          />
        </div>

        <div class="input-group">
          <label for="message">{{ $t('messageLabel') }}</label>
          <textarea
            id="message"
            :placeholder="$t('messagePlaceholder')"
            required
          ></textarea>
        </div>

        <button type="submit">{{ $t('sendMessageButton') }}</button>
      </form>
      <div class="contact-info animate fade-in">
        <div class="info-block">
          <div class="icon">&#x2709;</div>
          <p>{{ $t('messageUsLabel') }}</p>
          <a href="mailto:contact@detectauto.com">contact@detectauto.com</a>
        </div>
        <div class="info-block">
          <div class="icon">&#x260E;</div>
          <p>{{ $t('callUsLabel') }}</p>
          <a href="tel:+17632679917">+1 763-267-9917</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";


import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/navigation";

import { Keyboard, Pagination, Navigation, Autoplay } from "swiper/modules";

export default {
  name: "AboutUsPage",
  components: {
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      modules: [Keyboard, Pagination, Navigation, Autoplay],
      teamMembers: [
        {
          name: "Tri Dinh Bui",
          roleKey: "roles.ceo",
          introKey: "team.intros.tri",
          img: require("@/assets/profile/tri.jpeg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/tribuidinh/",
            },
            { name: "GitHub", link: "https://github.com/tridinhbui" },
          ],
        },
        {
          name: "Dung Hoang Le",
          roleKey: "roles.pm",
          introKey: "team.intros.dung",
          img: require("@/assets/profile/Dung.jpg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/lehoangdung2911/",
            },
            { name: "GitHub", link: "https://github.com/DungLe2911" },
          ],
        },
        {
          name: "Minh Nguyen",
          roleKey: "roles.cto",
          introKey: "team.intros.minh",
          img: require("@/assets/profile/MinhNguyen.jpg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/minh~nguyen/",
            },
            { name: "GitHub", link: "https://github.com/minh-nguyen-mqn" },
          ],
        },
        {
          name: "Phu Tien",
          roleKey: "roles.dataLead",
          introKey: "team.intros.phu",
          img: require("@/assets/profile/tien.jpg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/nguyen-tien-8482141ba/",
            },
            { name: "GitHub", link: "https://github.com/tienfadepzai" },
          ],
        },
        {
          name: "Huy Phung",
          roleKey: "roles.fullstack",
          introKey: "team.intros.huy",
          img: require("@/assets/profile/HuyPhung.jpg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/huyphung2025/",
            },
            { name: "GitHub", link: "https://github.com/hphng" },
          ],
        },
        {
          name: "Linh Ha",
          roleKey: "roles.fullstack",
          introKey: "team.intros.linh",
          img: require("@/assets/profile/linh.jpg"),
          socialIcons: [
            { name: "LinkedIn", link: "https://www.linkedin.com/in/liam-ha/" },
            { name: "GitHub", link: "https://github.com/dlinh31" },
          ],
        },
        {
          name: "Dung Pham",
          roleKey: "roles.fullstack",
          introKey: "team.intros.dungpham",
          img: require("@/assets/profile/dungpham.jpg"),
          socialIcons: [
            { name: "LinkedIn", link: "https://www.linkedin.com/in/dungap25/" },
            { name: "GitHub", link: "https://github.com/dungpham2502" },
          ],
        },
        {
          name: "Khoi Anh Tran",
          roleKey: "roles.fullstack",
          introKey: "team.intros.khoi",
          img: require("@/assets/profile/khoi.jpg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/khoi-tran310/",
            },
            { name: "GitHub", link: "https://github.com/AnhKhoi0310" },
          ],
        },
        {
          name: "Minh Binh Tran",
          roleKey: "roles.frontend",
          introKey: "team.intros.binh",
          img: require("@/assets/profile/BinhMinh.png"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/tr%E1%BA%A7n-b%C3%ACnh-minh-9b8b9a240/",
            },
            { name: "GitHub", link: "https://github.com/tranbinhminh100105" },
          ],
        },
        {
          name: "Huy Quang Dao",
          roleKey: "roles.dataScientist",
          introKey: "team.intros.quang",
          img: require("@/assets/profile/QuangHuy.jpg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/quang-huy-dao-4bb0a4237",
            },
            { name: "GitHub", link: "https://github.com/HuyQuangOP" },
          ],
        },
        {
          name: "Khoa Dang Nguyen",
          roleKey: "roles.aiEngineer",
          introKey: "team.intros.khoa",
          img: require("@/assets/profile/DangKhoa.png"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/don-nguyen-854106228/",
            },
            { name: "GitHub", link: "https://github.com/donkhoanguyen" },
          ],
        },
        {
          name: "Anh Tuan Nguyen",
          roleKey: "roles.fullstack",
          introKey: "team.intros.tuan",
          img: require("@/assets/profile/TuanAnh.png"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/nguyen-tuan-anh-81a463242/",
            },
            { name: "GitHub", link: "https://github.com/Anhnguyenk835" },
          ],
        },
        {
          name: "Krystal Nguyen",
          roleKey: "roles.dataScientist",
          introKey: "team.intros.krystal",
          img: require("@/assets/profile/thu.jpg"),
          socialIcons: [
            {
              name: "LinkedIn",
              link: "https://www.linkedin.com/in/krystal-nguyen-63014b283",
            },
            { name: "GitHub", link: "https://github.com/krystalcodess" },
          ],
        },
        {
          name: "Bach Hoang Truong",
          roleKey: "roles.frontend",
          introKey: "team.intros.bach",
          img: require("@/assets/profile/bach.jpg"),
          socialIcons: [
            { name: "LinkedIn", link: "https://www.linkedin.com" },
            { name: "GitHub", link: "https://www.github.com" },
          ],
        },
      ],
      testimonials: [
      {
        name: "Daniel Doe",
        feedbackKey: "testimonials.daniel"
      },
      {
        name: "Jane Patel",
        feedbackKey: "testimonials.jane"
      },
      {
        name: "Julian Davis",
        feedbackKey: "testimonials.julian"
      },
      {
        name: "Amelia Nguyen",
        feedbackKey: "testimonials.amelia"
      },
      {
        name: "Marcus Lee",
        feedbackKey: "testimonials.marcus"
      },
      {
        name: "Sophie Chen",
        feedbackKey: "testimonials.sophie"
      },
      {
        name: "Tyler Brooks",
        feedbackKey: "testimonials.tyler"
      },
      {
        name: "Rachel Johnson",
        feedbackKey: "testimonials.rachel"
      },
      {
        name: "Ben Carter",
        feedbackKey: "testimonials.ben"
      },
      {
        name: "Claire Thompson",
        feedbackKey: "testimonials.claire"
      }
    ],
    };
  },
  mounted() {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".animate");
    elements.forEach((el) => observer.observe(el));
  },
};
</script>

<style scoped>
@import "swiper/swiper-bundle.css";

/* Base Styles */
:root {
  --primary-color: #000000;
  --secondary-color: #ffffff;
  --text-primary: #000000;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border-color: #e5e7eb;
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 15px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: var(--bg-primary);
}

/* Team Section */
.team-section {
  margin-bottom: 60px;
  animation: fadeIn 0.8s ease;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 1.5rem;
  animation: slideInDown 0.8s ease;
}

.description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  animation: slideInUp 0.8s ease;
}

/* Team Members Slider */
.mySwiper-linear {
  padding: 20px 0;
  overflow: visible !important;
}

.team-member {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
}

.image-container {
  width: 160px;
  height: 160px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  border: 3px solid var(--primary-color);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.team-member:hover .image-container img {
  transform: scale(1.1);
}

.team-member h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.team-member p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.team-member h2 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.social-icons a {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.social-icons a:hover {
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* Testimonials Section */
.testimonials-section {
  padding: 60px 0;
  background: var(--bg-secondary);
  border-radius: 20px;
  margin: 40px 0;
  animation: fadeIn 1s ease;
}

.testimonials-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 0 40px;
}

.testimonial-card {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.testimonial-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
}

.star {
  color: #fbbf24;
  font-size: 1.2rem;
}

.testimonial-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  flex-grow: 1;
}

/* Contact Form Section */
#contact-page {
  max-width: 800px;
  margin: 60px auto;
  animation: fadeIn 1s ease;
}

.contact-header {
  text-align: center;
  margin-bottom: 40px;
}

.contact-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.contact-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.contact-form {
  background: var(--bg-secondary);
  padding: 40px;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.contact-form button {
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-form button:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.info-block {
  text-align: center;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.info-block:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.info-block .icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.info-block p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.info-block a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.info-block a:hover {
  opacity: 0.8;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .title {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }

  .testimonials-container {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .contact-form {
    padding: 20px;
  }

  .info-block {
    padding: 1.5rem;
  }
}

/* Loading States */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
