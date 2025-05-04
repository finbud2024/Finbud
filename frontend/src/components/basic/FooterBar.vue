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

.footer-bar {
  background-color: #0F1F3D;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  flex-wrap: wrap;
  height: auto;
  font-size: 0.875rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.footer-brand {
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
}

.description {
  font-size: 0.875rem;
  color: gray;
  text-align: center;
}

.subscribe {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.subscribe-box {
  margin-top: 5px;
  display: flex;
  height: 40px;
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

.footer-items li a {
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.footer-items li a:hover {
  background-color: #0056b3;
  border-radius: 5px;
}

.footer-text-field {
  color: white;
  background-color: rgba(255, 255, 255, .2);
  border: 1px solid #000;
  border-radius: 5px;
  padding: 10px 24px;
  font-size: 0.875rem;
  margin-right: 0.5rem;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-bar {
    padding: 20px;
    flex-direction: column;
    text-align: center;
  }

  .footer-content, .subscribe, .footer-items {
    flex: 1 1 auto;
    text-align: center;
    margin-bottom: 1rem;
  }

  .footer-text-field, .button.footer-form-button {
    margin-right: 0;
    margin-bottom: 0.5rem;
    padding: 0;
  }


  .footer-items {
    justify-content: center;
    gap: 2rem;
  }

  .footer-items2 {
    justify-content: center;
    text-align: center;
    padding-inline-start: 0;
  }
}

@media (max-width: 480px) {
  .footer-brand {
    font-size: 1.5rem;
  }

  .description {
    font-size: 0.75rem;
  }

  .footer-text-field, .button.footer-form-button {
    font-size: 0.75rem;
    padding: 8px 16px;
  }
}
</style>
