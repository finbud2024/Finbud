<template>
  <div class="container">
    <div class="team-section">
      <li class="title">About us</li>
      <li class="description">
        We are a Vietnam-based tech team working on AI integrations. FinBud is
        our first project with an aim to aid people with their financial
        decisions, from investing, accruing savings, to smart expenditures. Our
        team consists of experienced professionals with diverse backgrounds in
        technology, finance, and business. We are passionate about leveraging
        technology to make financial management accessible and straightforward
        for everyone.
      </li>
    </div>
    <div class="team-section">
      <li class="title">Meet Our Team</li>
      <swiper
        :slidesPerView="slidesPerView"
        :spaceBetween="30"
        :keyboard="{
          enabled: true,
        }"
        :pagination="{
          clickable: true,
        }"
        :navigation="true"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false
        }"
        :speed="3000"
        :modules="modules"
        class="mySwiper"
        :breakpoints="{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }"
      >
        <swiper-slide v-for="member in teamMembers" :key="member.name">
          <div class="team-member">
            <div class="image-container">
              <img :src="member.img" :alt="member.name" class="fade-in" />
            </div>
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
            <h2>{{ member.intro }}</h2>
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
      <li class="title">What our users say about FinBud</li>
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
          <p>{{ testimonial.feedback }}</p>
        </div>
      </div>
    </div>

    <section id="contact-page" class="animate fade-in">
      <div class="contact-header animate slide-in-up">
        <h1>We'd love to talk about how we can work together.</h1>
        <p>Let us know how we can help (or if we can't, tell us)!</p>
      </div>

      <form class="contact-form animate slide-in-up">
        <div class="input-group">
          <label for="full-name">Full name</label>
          <input
            type="text"
            id="full-name"
            placeholder="Frank Castle"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">Your email</label>
          <input
            type="email"
            id="email"
            placeholder="franklyfrank@example.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="company-name">Company name</label>
          <input type="text" id="company-name" placeholder="The P-Corp." />
        </div>

        <div class="input-group">
          <label for="mobile-number">Mobile number</label>
          <input type="tel" id="mobile-number" placeholder="+1 012 345 6789" />
        </div>

        <div class="input-group">
          <label for="message">Your message</label>
          <textarea
            id="message"
            placeholder="How can we help you?"
            required
          ></textarea>
        </div>

        <button type="submit">Send message</button>
      </form>
      <div class="contact-info animate fade-in">
        <div class="info-block">
          <div class="icon">&#x2709;</div>
          <!-- Mail icon -->
          <p>Message us</p>
          <a href="mailto:contact@detectauto.com">contact@detectauto.com</a>
        </div>
        <div class="info-block">
          <div class="icon">&#x260E;</div>
          <!-- Phone icon -->
          <p>Call us</p>
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
          role: "Founder & CEO",
          intro:
            "Bachelor of Quantitative Economics and Computer Science from Macslester College with passion creating a startup that merges Finance, Technology, and Business to benefit Vietnam community",
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
          role: "Project Manager",
          intro:
            "Full Stack Software Developer with 2 years of experience at F5 Networks and SVB, holding a Bachelor of Science degree in Computer Science from Washington State University",
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
          role: "Chief Technology Officer (CTO)",
          intro:
            "Master Degree in Computer Science and Economics from University of Iowa with an addition of Bachelor os Science in Statistics at Grinell College. Passionate about AI/ML, software engineering, and the intersection of technology and economics.",
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
          role: "Data Division Lead",
          intro:
            "Honours Bachelor of Business & Marketing from IBD@NEU, focused on applying advanced analysis techniques and strategies in FinTech.",
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
          role: "Front-end Engineer/Back-end Lead",
          intro:
            "Computer Scienctist and Mathematics from DePauw University. Dedicated full stack developer passionate about new technologies and solving complex problems, driven to innovate and create impactful solutions.",
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
          role: "Fullstack Engineer",
          intro:
            "Computer Science student from University of South Florida, specializing in full-stack software development with a focus on scalability. Deeply passionate about software engineering and exploring its potential applications in AI.",
          img: require("@/assets/profile/linh.jpg"),
          socialIcons: [
            { name: "LinkedIn", link: "https://www.linkedin.com/in/liam-ha/" },
            { name: "GitHub", link: "https://github.com/dlinh31" },
          ],
        },
        {
          name: "Dung Pham",
          role: "Fullstack Engineer",
          intro:
            "Computer Science student at University of South Florida, skilled in fullstack web development and wanting to dive into the fields of AI/ML, Fintech and Cloud Computing",
          img: require("@/assets/profile/dungpham.jpg"),
          socialIcons: [
            { name: "LinkedIn", link: "https://www.linkedin.com/in/dungap25/" },
            { name: "GitHub", link: "https://github.com/dungpham2502" },
          ],
        },
        {
          name: "Khoi Anh Tran",
          role: "FullStack Engineer",
          intro:
            "Pursuing a Bachelor of Computer Science at the New Jersey Institute of Technology. Enthusiastic about applying my skills to innovative projects and exploring new opportunities in the tech industry",
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
          role: "Front-end Engineer",
          intro:
            "Bachelor of  Computer Science from VinUniversity with passion everage mathematics and technology such AI and Machine Learning, to augment medical treatment and mental health therapy",
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
          role: "Data Analysis Engineer",
          intro:
            "Business Management at Foreign Trade University and participated in an Exchange Program in Statistics and Econometrics at Uppsala University",
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
          role: "Artificial Inteligence(AI) Engineer",
          intro:
            "Applied LLM Developer with a Bachelor's degree in Data Science from the University of Rochester. Passionate about information retrieval and recommendation systems",
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
          role: "Fullstack Engineer",
          intro:
            "Pursuing a major in Computer Science at the University of Science, actively developing features for Finbud, a financial management project. Passionate about AI/ML and software engineering.",
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
          role: "Data Analytics/Data Scientist",
          intro:
            "Bachelor of Data Science student at Deakin University, dedicated to transforming data into impactful solutions. Passionate about addressing real-world challenges through data-driven approaches, always striving to make a meaningful difference.",
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
          role: "Front-end Engineer",
          intro: "Pursuing Computer Science Degree at VinUniversity",
          img: require("@/assets/profile/bach.jpg"),
          socialIcons: [
            { name: "LinkedIn", link: "https://www.linkedin.com" },
            { name: "GitHub", link: "https://www.github.com" },
          ],
        },
      ],
      testimonials: [
        {
          name: "John Doe",
          feedback:
            "FinBud has completely transformed my financial management. The AI chatbot provides spot-on advice and helps me stay on top of my investments and expenses.",
        },
        {
          name: "Jane Smith",
          feedback:
            "I love using FinBud! It's like having a personal financial advisor available 24/7. The insights and tips are incredibly useful and easy to understand.",
        },
        {
          name: "Michael Johnson",
          feedback:
            "The best financial tool I have ever used. FinBud's AI is amazing at predicting market trends and giving personalized advice.",
        },
        {
          name: "Emily Davis",
          feedback:
            "FinBud has helped me save so much money. The budgeting tools and financial insights are top-notch.",
        },
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

body {
  background: #f4f4f4;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.container {
  list-style-type: none;
  padding: 20px;
}

.team-section {
  background-color: white;
  margin-bottom: 2rem;
  padding: 2rem;
}

.title {
  text-align: center;
  color: #007bff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: fadeInDown 1s ease-in-out;
  font-weight: 700;
}

.description {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-in-out;
  font-weight: 300;
}

.team-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.team-member {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeIn 1s ease-in-out;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%; /* Make all team-member divs take full height of their container */
}

.image-container {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
  animation: zoomIn 1s ease-in-out;
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.team-member h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #333;
}

.team-member p {
  font-size: 1rem;
  color: #777;
  margin: 0.5rem 0 1rem;
}

.team-member h2 {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}

.social-icons {
  margin-top: 5px;
}

.social-icons a {
  font-size: 1rem;
  color: #007bff;
  margin: 0 5px;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #0056b3;
}

.testimonials-section {
  background-color: white;
  margin: 2rem 0;
  padding: 2rem;
}

.testimonials-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeIn 1s ease-in-out;
}

.stars {
  color: gold;
  margin: 0.5rem 0;
}

.star {
  font-size: 1.2rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .testimonial-card {
    width: 100%;
  }
  .team-section {
    align-items: center;
  }
  .team-member {
    margin-bottom: 20px;
  }

  .team-container,
  .testimonials-container {
    padding: 0 10px;
  }

  .contact-form {
    padding: 20px;
  }
}

#contact-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.contact-header {
  margin-bottom: 40px;
}

.contact-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
}

.contact-header p {
  font-size: 18px;
  color: #666;
}

.contact-form {
  background: #f9f9f9;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.contact-header h1,
.contact-header p {
  margin-bottom: 20px;
}

.contact-form .input-group {
  margin-bottom: 20px;
  text-align: left;
}

.mySwiper {
  height: 550px; /* Set your custom height here */
}
.team-member {
  height: 85%;
}

.swiper-slide {
  display: flex;
  align-items: stretch;
  height: auto; /* Ensure slides take the height of their content */
}

.contact-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.contact-form input[type="text"],
.contact-form input[type="email"],
.contact-form input[type="tel"],
.contact-form textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  transition: border-color 0.3s ease;
}

.contact-form input[type="text"]:focus,
.contact-form input[type="email"]:focus,
.contact-form input[type="tel"]:focus,
.contact-form textarea:focus {
  border-color: #007bff;
  outline: none;
}

.contact-form button {
  padding: 15px 30px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.contact-form button:hover {
  background-color: #003975;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-block {
  text-align: center;
  margin: 10px 0;
}

.info-block .icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.info-block p {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
}

.info-block a {
  font-size: 16px;
  color: #0056b3;
  text-decoration: none;
}

.info-block a:hover {
  text-decoration: underline;
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

.slide-in-up {
  transform: translateY(20px);
}

.slide-in-up.animate-visible {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .testimonials-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .testimonial-card {
    width: 100%; /* Ensure the testimonial card takes the full width */
    height: 100%; /* Ensure the testimonial card takes the full height */
    margin: 10px 0; /* Adjust as needed */
    align-items: center;
    text-align: center;
    justify-content: center;
  }
}
</style>
