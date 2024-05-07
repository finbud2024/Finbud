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
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <ul class="footer-items2">  <!-- Second column -->
        <li><a href="#">Product</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Careers</a></li>
      </ul>
      <ul class="footer-items2">  <!-- Second column -->
        <li><a href="#">Product</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Careers</a></li>
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
.gap {
  gap: 10px;
}

.footer-bar {
  height: 250px;  /* Adjusted height for additional content */
  background-color: #0F1F3D;
  color: white;
  display: flex;
  justify-content: space-between;  /* This creates space between sections */
  align-items: center;
  padding: 1rem 3rem;  /* Additional padding for breathing room */
}

.subscribe {
  display: flex;
  flex-direction: column;
}

.subscribe-box {
  margin-top: 5px;
}

.footer-content {
  display: flex;
  flex-direction: column;  /* Vertical alignment */
  justify-content: space-between;  /* This creates even spacing within the section */
  align-items: center;
}

.footer-brand {
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
}

.description {
  font-size: 15px;
  color: gray;  /* Corrected from double quotes to proper syntax */
}

.footer-items {
  list-style: none;
  display: flex;
  flex-direction: row;  /* Horizontal alignment */
  gap: 2rem;  /* Space between the two columns */
  align-items: flex-start;
}

.footer-items2 {
  list-style: none;
  flex-direction: column;  /* Vertical alignment within each column */
  gap: 0.5rem;  /* Space between items in a column */
}

.footer-items2 li {
  padding: 0.5rem 0;  /* Additional padding for spacing */
}

.footer-text-field {
    color: white;
    background-color: rgba(255, 255, 255, .2);
    border: 1px #000;
    border-radius: 5px;
    margin-bottom: 0;
    margin-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 24px;
    font-size: 16px;
    overflow: hidden;
}

.button.footer-form-button {
    background-color: #145aff;
    color: white;
    border-radius: 5px;
    padding: 10px 20px;
    font-weight: 700;
    line-height: 120%;
    cursor: pointer;
    border: 0;
    text-decoration: none;
    display: inline-block;
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
</style>

