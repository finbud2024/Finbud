<template>
  <div class="team-section">
      <li class="title">About us</li>
      <li class="description">We are a Vietnam-based tech team working on AI integrations. FinBud is our first project with an aim to aid people with their financial decisions, from investing, accruing savings, to smart expenditures.</li>
  </div>
  <div class="team-section">
      <li class="title">Meet Our Team</li>
      <div class="team-container">
          <div class="team-member">
              <img src='@/assets/tri.jpeg' alt="Alex Smith">
              <h3>Alex Smith</h3>
              <p>Creative Leader</p>
              <h2>(Introduction) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</h2>
              <div class="social-icons">
                  <a href="#"><img src="facebook_icon.png" alt="Facebook"></a>
                  <a href="#"><img src="instagram_icon.png" alt="Instagram"></a>
              </div>
          </div>
          <div class="team-member">
              <img src='@/assets/tri.jpeg' alt="May Brown">
              <h3>May Brown</h3>
              <p>Sales Manager</p>
              <h2>(Introduction) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</h2>
              <div class="social-icons">
                  <a href="#"><img src="facebook_icon.png" alt="Facebook"></a>
                  <a href="#"><img src="instagram_icon.png" alt="Instagram"></a>
              </div>
          </div>
          <div class="team-member">
              <img src='@/assets/tri.jpeg' alt="Ann Richmond">
              <h3>Ann Richmond</h3>
              <p>Web Developer</p>
              <h2>(Introduction) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</h2>
              <div class="social-icons">
                  <a href="#"><img src="facebook_icon.png" alt="Facebook"></a>
                  <a href="#"><img src="instagram_icon.png" alt="Instagram"></a>
              </div>
          </div>
      </div>
  </div>

</template>

<script>
export default {
  name: 'AboutUsPage',
}
</script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.about_us {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-weight: bold;
  color: #007bff;
  display: flex;
  text-align: center;
  flex-direction: column;
  font-size: 2.5rem;
}

.description {
  color: black;
  display: flex;
  text-align: center;
  align-self: center;
  font-size: 1.5rem;
  flex-direction: column;
  padding-top: 1.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.team-section {
  margin: 0 auto;
  background: white;
  padding: 0.8rem;
  padding-top: 0.9rem;
  align-content: center;
  text-align: center;
}

.team-container {
  justify-content: center;
  display: flex;
  gap: 0.2rem;
  flex-wrap: wrap;
}

.team-member {
  max-width: 18rem;
  background: #fff;
  margin: 10px;
  padding: 20px;
  text-align: center;
  width: calc(25% - 20px);
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.team-member img {
  width: 60%;
  border-radius: 50%;
}

h2 {
  color: black;
  font-size: 15px;
  text-align: center;
  flex-direction: column;
  font-weight: normal;
}

h3 {
  color: black;
  font-size: 20px;
  font-weight: bold;
}

p {
  color: black;
  font-size: 18px;
}

.social-icons {
  margin-top: 10px;
}

.social-icons img {
  width: 20px;
  margin: 0 5px;
}

@media (max-width: 1024px) {
  .title {
      font-size: 30px;
  }
  .description {
      font-size: 15px
  }
}
</style>