<template>
  <nav class="footer-bar">
    <div class="footer-content">
      <div class="footer-brand">{{ $t("footer.brand") }}</div>
      <div class="description">{{ $t("footer.description") }}</div>
    </div>
    <div class="subscribe">
      <label for="Email-4" class="subscribetous">{{
        $t("footer.subscribe.label")
      }}</label>
      <div class="subscribe-box">
        <input
          class="footer-text-field w-input"
          maxlength="256"
          name="Email-4"
          data-name="Email 4"
          :placeholder="$t('footer.subscribe.placeholder')"
          type="email"
          id="Email-4"
          required=""
        />
        <input
          type="submit"
          data-wait="Please wait..."
          class="button footer-form-button w-button"
          :value="$t('footer.subscribe.submit')"
        />
      </div>
    </div>
    <div class="footer-items">
      <ul class="footer-items2">
        <li>
          <a href="#intro">{{ $t("footer.links.home") }}</a>
        </li>
        <li>
          <a href="#about-us">{{ $t("footer.links.aboutUs") }}</a>
        </li>
        <li>
          <a href="#process">{{ $t("footer.links.process") }}</a>
        </li>
      </ul>
      <ul class="footer-items2">
        <li>
          <a href="#contact">{{ $t("footer.links.contact") }}</a>
        </li>
        <li>
          <a href="#social-proof">{{ $t("footer.links.socialProof") }}</a>
        </li>
        <li>
          <a href="#blog">{{ $t("footer.links.blog") }}</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "FooterBar",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap");

.footer-bar {
  background-color: #0f1f3d;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  flex-wrap: wrap;
  font-family: "Space Grotesk", sans-serif;
}

.footer-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.footer-brand {
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
}

.description {
  font-size: 1rem;
  color: gray;
}

.subscribe {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.subscribetous {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.subscribe-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.footer-text-field {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin-right: 0.5rem;
}

.footer-form-button {
  background-color: #145aff;
  color: white;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.footer-form-button:hover {
  background-color: #0a47c3;
}

.footer-items {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.footer-items2 {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-inline-start: 0;
}

.footer-items2 li {
  padding: 0.5rem 0;
}

.footer-items2 li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-items2 li a:hover {
  color: #145aff;
}

@media (max-width: 985px) {
  .footer-bar {
    flex-direction: column;
    align-items: center;
  }

  .footer-content,
  .subscribe,
  .footer-items {
    width: 100%;
  }

  .subscribe-box {
    flex-direction: column;
    align-items: center;
  }

  .footer-text-field,
  .footer-form-button {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 768px) {
  .footer-bar {
    padding: 1rem;
  }

  .footer-brand {
    font-size: 1.5rem;
  }

  .description {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .footer-bar {
    padding: 1rem;
  }

  .footer-brand {
    font-size: 1.25rem;
  }

  .description {
    font-size: 0.75rem;
  }
}
</style>
