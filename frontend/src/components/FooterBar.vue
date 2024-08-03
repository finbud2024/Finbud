<template>
  <nav class="footer-bar">
    <div class="footer-content">
      <div class="footer-brand">FINBUD</div>
      <div class="description">The companion for all your financial needs</div>
    </div>
    <div class="subscribe">
      <label for="Name" class="subscribetous">Subscribe to us here</label>
      <div class="gap"></div>
      <div class="subscribe-box">
        <input class="footer-text-field w-input" maxlength="256" name="Email-4" data-name="Email 4" placeholder="Enter your email" type="email" id="Email-4" required="">
        <input type="submit" data-wait="Please wait..." class="button footer-form-button w-button" value="Subscribe">
      </div>
    </div>
    <div class="footer-items">
      <ul class="footer-items2">  <!-- First column -->
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Technology</a></li>
      </ul>
      <ul class="footer-items2">  <!-- Second column -->
        <li><a href="#">Contact</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">ChatView</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'FooterBar',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
/* Existing styles */
.gap {
  gap: 10px;
}

.footer-bar {
  background-color: #0F1F3D;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  flex-wrap: wrap; /* Allows items to wrap as needed on smaller screens */
  font-family: 'Space Grotesk', sans-serif;
  height: auto;
  font-size: 0.875rem;
}

.subscribe {
  display: flex;
  flex-direction: column;
}

.subscribe-box {
  margin-top: 5px;
  display: flex;
  height: 40px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
}

.description {
  font-size: 0.875rem;
  color: gray;
}

.footer-items {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  list-style: none;
  align-items: flex-start;
}

.footer-items2 {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-items2 li {
  padding: 0.5rem 0;
}

.footer-text-field {
    color: white;
    background-color: rgba(255, 255, 255, .2);
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px 24px;
    font-size: 0.875rem;
}

.button.footer-form-button {
    background-color: #145aff;
    color: white;
    border-radius: 5px;
    padding: 10px 20px;
    font-weight: 700;
    line-height: 120%;
    cursor: pointer;
    border: none;
}

.footer-items li a {
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.footer-items li a:hover {
  background-color: #0056b3;
  border-radius: 5px;
}

/* Responsive adjustments */
@media (max-width: 985px) {
  .footer-content, .subscribe, .footer-items {
    flex: 1 1 auto; /* Make each section full width */
    text-align: center;
  }

  .footer-brand, .description {
    font-size: 24px; /* Slightly reduce the font size */
  }

  .subscribe-box {
    flex-direction: column; /* Stack input and button vertically */
  }

  .footer-items {
    justify-content: center;
    gap: 2rem;
  }

  .footer-items2 {
    justify-content: center;
    text-align: center;
    padding-inline-start: 0px;
  }
}

@media (max-width: 768px) {
  .footer-bar {
    padding: 20px; /* Increase padding slightly for smaller devices */
  }

  .footer-text-field, .button.footer-form-button {
    width: auto; /* Full width for input and button */
    margin-right: 0.2rem; /* Remove margin to fit full width */
  }
}

@media (max-width: 480px) {
  .footer-brand {
    font-size: 20px; /* Further reduce the font size for small devices */
  }

  .description {
    font-size: 14px; /* Reduce description font size for readability */
  }
}
</style>


