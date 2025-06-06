<template>
  <div class="container">
    <div class="team-section">
      <h1 class="title">{{ $t('aboutUsTitle') }}</h1>
      <p class="description">
        {{ $t('aboutUsDescription') }}
      </p>
    </div>
    <div class="team-section">
      <h2 class="title">{{ $t('meetOurTeamTitle') }}</h2>
      <swiper
        :slidesPerView="slidesPerView"
        :spaceBetween="30"
        :speed="3000" 
        :autoplay="{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: false
        }"
        :loop="true"
        :loopAdditionalSlides="2" 
        :freeMode="false"
        :modules="modules"
        class="mySwiper-linear"
        :breakpoints="{
          0: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1200: { slidesPerView: 4, spaceBetween: 30 }
        }"
        :direction="'horizontal'"
        :allowTouchMove="true"
        :centeredSlides="false"
        @swiper="onSwiper"
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
                class="social-link"
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
      <h2 class="title">{{ $t('testimonialsTitle') }}</h2>
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

    <section id="contact-page" class="contact-section animate fade-in">
      <div class="contact-header animate slide-in-up">
        <h1>{{ $t('contactHeader') }}</h1>
        <p>{{ $t('contactSubheader') }}</p>
      </div>

      <div class="contact-container">
      <form class="contact-form animate slide-in-up">
          <div class="form-row">
        <div class="input-group">
              <label for="full-name" class="form-label">{{ $t('fullNameLabel') }}</label>
          <input
            type="text"
            id="full-name"
            :placeholder="$t('fullNamePlaceholder')"
                class="form-input"
            required
          />
        </div>

        <div class="input-group">
              <label for="email" class="form-label">{{ $t('emailLabel') }}</label>
          <input
            type="email"
            id="email"
            placeholder="abc@gmail.com"
                class="form-input"
            required
          />
            </div>
        </div>

          <div class="form-row">
        <div class="input-group">
              <label for="company-name" class="form-label">{{ $t('companyNameLabel') }}</label>
          <input 
            type="text" 
            id="company-name" 
            :placeholder="$t('companyNamePlaceholder')" 
                class="form-input"
          />
        </div>

        <div class="input-group">
              <label for="mobile-number" class="form-label">{{ $t('mobileNumberLabel') }}</label>
          <input 
            type="tel" 
            id="mobile-number" 
            :placeholder="$t('mobileNumberPlaceholder')" 
                class="form-input"
          />
            </div>
        </div>

          <div class="input-group full-width">
            <label for="message" class="form-label">{{ $t('messageLabel') }}</label>
          <textarea
            id="message"
            :placeholder="$t('messagePlaceholder')"
              class="form-input form-textarea"
            required
          ></textarea>
        </div>

          <button type="submit" class="submit-btn">
            <span>{{ $t('sendMessageButton') }}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
      </form>
        
      <div class="contact-info animate fade-in">
        <div class="info-block">
            <div class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>{{ $t('messageUsLabel') }}</h3>
          <a href="mailto:contact@detectauto.com">contact@detectauto.com</a>
        </div>
          </div>
          
        <div class="info-block">
            <div class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22 20.52 21.39 21 20.92 21C9.36 21 0 11.64 0 0.08C0 -0.39 0.48 -1 1.08 -1H4.08C4.68 -1 5.08 -0.39 5.08 0.08C5.08 2.25 5.42 4.35 6.05 6.31C6.18 6.75 6.05 7.22 5.69 7.49L4.19 8.99C6.05 12.64 9.36 15.95 13.01 17.81L14.51 16.31C14.78 15.95 15.25 15.82 15.69 15.95C17.65 16.58 19.75 16.92 21.92 16.92C22.39 16.92 23 17.32 23 17.92V20.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>{{ $t('callUsLabel') }}</h3>
          <a href="tel:+17632679917">+1 763-267-9917</a>
            </div>
          </div>
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

import { Keyboard, Pagination, Navigation, Autoplay, FreeMode } from "swiper/modules";

export default {
  name: "AboutUsPage",
  components: {
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      modules: [Keyboard, Pagination, Navigation, Autoplay, FreeMode],
      swiperInstance: null,
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
  computed: {
    slidesPerView() {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        if (window.innerWidth < 1200) return 3;
        return 4;
      }
      return 3;
    }
  },
  methods: {
    onSwiper(swiper) {
      this.swiperInstance = swiper;
      // Ensure autoplay starts properly
      if (swiper.autoplay) {
        swiper.autoplay.start();
      }
    },
    handleResize() {
      if (this.swiperInstance) {
        this.swiperInstance.update();
      }
    }
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
    
    // Add resize listener
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Clean up event listener
    window.removeEventListener('resize', this.handleResize);
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
  padding: 2rem;
  overflow: hidden;
  list-style: none;
}

/* Remove any list styling */
ul, ol, li {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Team Section */
.team-section {
  padding: 4rem 2rem;
  margin: -2rem;
  overflow: hidden;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(45deg, #000, #333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  list-style: none;
}

.description {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #666;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  position: relative;
  z-index: 1;
}

/* Team Members Slider */
.mySwiper-linear {
  padding: 20px 0;
  overflow: visible !important;
  margin: 0 -20px;
}

.team-member {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  max-width: 100%;
  word-wrap: break-word;
}

.team-member::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #000, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.team-member:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.team-member:hover::before {
  transform: scaleX(1);
}

.image-container {
  width: 160px;
  height: 160px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #000;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-member h3 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #000, #333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-member p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.team-member h2 {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
  max-height: 4.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.social-icons a {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #000;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.social-icons a::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.social-icons a:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.social-icons a:hover::before {
  transform: translateY(0);
}

/* Testimonials Section */
.testimonials-section {
  padding: 6rem 2rem;
  background: linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary));
  border-radius: 30px;
  margin: 4rem 0;
  position: relative;
  overflow: hidden;
}

.testimonials-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(0,0,0,0.02) 0%, transparent 100%);
  pointer-events: none;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  max-width: 100%;
  word-wrap: break-word;
}

.testimonial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #000, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.testimonial-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.testimonial-card:hover::before {
  transform: scaleX(1);
}

.testimonial-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 1.5rem;
}

.star {
  color: #fbbf24;
  font-size: 1.3rem;
  filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.2));
}

.testimonial-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
  max-height: 9.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

.testimonial-author {
    display: flex;
    align-items: center;
  gap: 1rem;
}

.author-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  }

.author-image img {
    width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  flex-grow: 1;
}

.author-name {
  font-weight: 600;
  color: #000;
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: 0.9rem;
  color: #666;
  }

.contact-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  margin: 4rem -2rem 0;
}

.contact-header {
  text-align: center;
  margin-bottom: 4rem;
}

.contact-header h1 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(45deg, #000, #333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  }

.contact-header p {
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.contact-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-form {
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.875rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafbfc;
  color: #374151;
}

.form-input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  background: white;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  }

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  }

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #333 0%, #555 100%);
}

.submit-btn svg {
  transition: transform 0.3s ease;
}

.submit-btn:hover svg {
  transform: translateX(4px);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-block {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.info-block:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.info-block .icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.info-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.info-content a {
  color: #000;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.info-content a:hover {
  color: #333;
}

/* Social Links */
.social-icons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.social-link {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #333 0%, #555 100%);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 1rem;
    margin: 2rem -2rem 0;
  }

  .contact-header h1 {
    font-size: 2.5rem;
  }

  .contact-form {
    padding: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .info-block {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .social-icons {
    flex-wrap: wrap;
  }

  .team-section {
    padding: 3rem 1rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .team-member {
    padding: 1.5rem;
  }
}

/* Animations */
@keyframes slideUpFade {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes floatUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes popIn {
  from {
    transform: translateY(20px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Staggered animations for team cards */
.team-card:nth-child(1) { animation-delay: 0.1s; }
.team-card:nth-child(2) { animation-delay: 0.2s; }
.team-card:nth-child(3) { animation-delay: 0.3s; }
.team-card:nth-child(4) { animation-delay: 0.4s; }

/* Staggered animations for social links */
.social-link:nth-child(1) { animation-delay: 0.6s; }
.social-link:nth-child(2) { animation-delay: 0.7s; }
.social-link:nth-child(3) { animation-delay: 0.8s; }

/* Staggered animations for testimonial cards */
.testimonial-card:nth-child(1) { animation-delay: 0.2s; }
.testimonial-card:nth-child(2) { animation-delay: 0.3s; }
.testimonial-card:nth-child(3) { animation-delay: 0.4s; }

/* Dark mode support */
:root.dark-mode .about-us {
  background: rgba(0, 0, 0, 0.8);
}

:root.dark-mode .hero-title,
:root.dark-mode .section-title {
  background: linear-gradient(135deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
}

:root.dark-mode .hero-description {
  color: rgba(255, 255, 255, 0.7);
}

:root.dark-mode .team-card,
:root.dark-mode .testimonial-card,
:root.dark-mode .contact-form {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark-mode .member-name,
:root.dark-mode .author-name {
  color: white;
}

:root.dark-mode .member-role,
:root.dark-mode .member-bio,
:root.dark-mode .author-role {
  color: rgba(255, 255, 255, 0.7);
}

:root.dark-mode .testimonial-content {
  color: rgba(255, 255, 255, 0.9);
}

:root.dark-mode .form-label {
  color: rgba(255, 255, 255, 0.9);
}

:root.dark-mode .form-input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

:root.dark-mode .form-input:focus {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

:root.dark-mode .social-link {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

:root.dark-mode .social-link:hover {
  background: white;
  color: black;
}

/* Responsive design */
@media (max-width: 768px) {
  .about-us {
    padding: 1rem;
}

  .hero-title {
    font-size: 2.5rem;
}

  .section-title {
    font-size: 2rem;
  }

  .team-grid,
  .testimonial-grid {
    grid-template-columns: 1fr;
}

  .team-card,
  .testimonial-card {
    padding: 1.5rem;
  }

  .member-image {
    width: 120px;
    height: 120px;
}

  .contact-form {
    padding: 1.5rem;
  }
}

/* Hover effects */
.team-card::before,
.testimonial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05), transparent);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-card:hover::before,
.testimonial-card:hover::before {
  opacity: 1;
}

/* Floating animation */
@keyframes float {
  0%, 100% {
  transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.team-card {
  animation: float 6s ease-in-out infinite;
}

.team-card:nth-child(1) { animation-delay: 0s; }
.team-card:nth-child(2) { animation-delay: -1.5s; }
.team-card:nth-child(3) { animation-delay: -3s; }
.team-card:nth-child(4) { animation-delay: -4.5s; }
</style>
