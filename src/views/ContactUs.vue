<template>
  <section id="contact-page" class="animate fade-in">
    <div class="contact-header animate slide-in-up">
      <h1>We'd love to talk about how we can work together.</h1>
      <p>Let us know how we can help (or if we can't, tell us)!</p>
    </div>

    <form class="contact-form animate slide-in-up">
      <div class="input-group">
        <label for="full-name">Full name</label>
        <input type="text" id="full-name" placeholder="Frank Castle" required>
      </div>

      <div class="input-group">
        <label for="email">Your email</label>
        <input type="email" id="email" placeholder="franklyfrank@example.com" required>
      </div>

      <div class="input-group">
        <label for="company-name">Company name</label>
        <input type="text" id="company-name" placeholder="The P-Corp.">
      </div>    

      <div class="input-group">
        <label for="mobile-number">Mobile number</label>
        <input type="tel" id="mobile-number" placeholder="+1 012 345 6789">
      </div>

      <div class="input-group">
        <label for="message">Your message</label>
        <textarea id="message" placeholder="How can we help you?" required></textarea>
      </div>

      <button type="submit">Send message</button>
    </form>

    <div class="contact-info animate fade-in">
      <div class="info-block">
        <div class="icon">&#x2709;</div> <!-- Mail icon -->
        <p>Message us</p>
        <a href="mailto:contact@detectauto.com">contact@detectauto.com</a>
      </div>
      <div class="info-block">
        <div class="icon">&#x260E;</div> <!-- Phone icon -->
        <p>Call us</p>
        <a href="tel:+17632679917">+1 763-267-9917</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactUs',
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

#contact-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Space Grotesk', sans-serif;
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 40px;
}

.contact-form .input-group {
  margin-bottom: 20px;
  text-align: left;
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
  font-family: 'Space Grotesk', sans-serif;
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
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.contact-form button:hover {
  background-color: #003975;
}

.contact-info {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-block {
  text-align: center;
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
</style>
