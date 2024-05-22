<template>
  <div class="container">
    <div class="team-section">
      <li class="title">About us</li>
      <li class="description">
        We are a Vietnam-based tech team working on AI integrations. FinBud is our first project with an aim to aid people with their financial decisions, from investing, accruing savings, to smart expenditures.
      </li>
    </div>
    <div class="team-section">
      <li class="title">Meet Our Team</li>
      <div class="team-container">
        <div class="team-member" v-for="member in teamMembers" :key="member.name">
          <img :src="member.img" :alt="member.name" class="fade-in" />
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
          <h2>{{ member.intro }}</h2>
          <div class="social-icons">
            <a v-for="icon in member.socialIcons" :key="icon.name" :href="icon.link" target="_blank">
              {{ icon.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUsPage',
  data() {
    return {
      teamMembers: [
        {
          name: 'Alex Smith',
          role: 'Creative Leader',
          intro: '(Introduction) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          img: require('@/assets/tri.jpeg'),
          socialIcons: [
            { name: 'Facebook', link: 'https://www.facebook.com' },
            { name: 'Instagram', link: 'https://www.instagram.com' },
          ],
        },
        {
          name: 'May Brown',
          role: 'Sales Manager',
          intro: '(Introduction) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          img: require('@/assets/tri.jpeg'),
          socialIcons: [
            { name: 'Facebook', link: 'https://www.facebook.com' },
            { name: 'Instagram', link: 'https://www.instagram.com' },
          ],
        },
        {
          name: 'Ann Richmond',
          role: 'Web Developer',
          intro: '(Introduction) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
          img: require('@/assets/tri.jpeg'),
          socialIcons: [
            { name: 'Facebook', link: 'https://www.facebook.com' },
            { name: 'Instagram', link: 'https://www.instagram.com' },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
body {
  background: #f4f4f4;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.container {
  font-family: 'Space Grotesk', sans-serif;
  list-style-type: none;
}

.team-section {
  text-align: center;
  background-color: white;
  margin-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.title {
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.team-member {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: calc(25% - 2rem);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeIn 1s ease-in-out;
  font-weight: 300;
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.team-member img {
  width: 60%;
  border-radius: 50%;
  margin-bottom: 1rem;
  animation: zoomIn 1s ease-in-out;
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

.social-icons a {
  font-size: 1rem;
  color: #007bff;
  margin: 0 5px;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #0056b3;
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

@media (max-width: 1024px) {
  .title {
    font-size: 30px;
  }
  .description {
    font-size: 15px;
  }
  .team-member {
    width: calc(50% - 2rem);
  }
}

@media (max-width: 768px) {
  .team-member {
    width: calc(100% - 2rem);
  }
}
</style>
