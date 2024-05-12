<template>
  <section id="contact-page">
    <div class="contact-header">
      <h1>We'd love to talk about how we can work together.</h1>
      <p>Let us know how we can help (or if we can't, tell us)!</p>
    </div>

    <form class="contact-form">
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
  </section>
</template>

<script>
export default {
  name: 'ContactUs'
}
</script>

<style scoped>
#contact-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.contact-header h1,
.contact-header p {
  margin-bottom: 20px;
}

.contact-form .input-group {
  margin-bottom: 20px;
}

.contact-form label {
  display: block;
  margin-bottom: 5px;
}

.contact-form input[type="text"],
.contact-form input[type="email"],
.contact-form input[type="tel"],
.contact-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.contact-form button {
  padding: 10px 20px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.contact-form button:hover {
  background-color: #003975;
}
</style>

