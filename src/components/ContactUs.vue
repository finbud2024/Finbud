<template>
  <section class="contact-us">
    <h2>{{ $t("contactUs.title") }}</h2>
    <div class="contact-container">
      <div class="contact-card">
        <h3>{{ $t("contactUs.general.title") }}</h3>
        <p>{{ $t("contactUs.general.description") }}</p>
        <form>
          <input type="text" :placeholder="$t('contactUs.general.form.name')" />
          <input type="email" :placeholder="$t('contactUs.general.form.email')" />
          <select>
            <option>{{ $t("contactUs.general.form.option") }}</option>
          </select>
          <button type="submit">{{ $t("contactUs.general.form.submit") }}</button>
        </form>
      </div>
      <div class="contact-card">
        <h3>{{ $t("contactUs.support.title") }}</h3>
        <p>{{ $t("contactUs.support.description") }}</p>
        <button class="chat-button">
          {{ $t("contactUs.support.button") }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ContactUs",
};
</script>

<style>
.contact-us {
  background: linear-gradient(135deg, #f3f4f6, #fff);
  color: #1c1c4c;
  padding: 2rem 1rem;
  text-align: center;
  animation: background-pulse 5s infinite ease-in-out; /* Slower animation for background */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); /* Add a subtle box-shadow */
}

@keyframes background-pulse {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.contact-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-card {
  background: white;
  border-radius: 12px; /* Increased border-radius for a smoother look */
  padding: 1.5rem; /* Increased padding for better spacing */
  margin: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Slightly adjusted box-shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 45%;
  max-width: 45%;
  text-align: left;
  animation: card-pop-in 0.5s ease-in-out forwards;
}

@keyframes card-pop-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.contact-card:hover {
  transform: translateY(-8px); /* Increased vertical translation on hover */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Increased box-shadow on hover */
}

.contact-card form {
  display: flex;
  flex-direction: column;
}

.contact-card input,
.contact-card select {
  margin-bottom: 1rem;
  padding: 0.7rem; /* Increased padding for better spacing */
  border-radius: 6px; /* Increased border-radius for a smoother look */
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) inset; /* Added inner box-shadow for depth */
  transition: box-shadow 0.3s ease; /* Added transition for smoother hover effect */
}

.contact-card input:hover,
.contact-card select:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) inset; /* Increased inner box-shadow on hover */
}

.contact-card button {
  background-color: #0077b6;
  border: none;
  border-radius: 6px; /* Increased border-radius for a smoother look */
  padding: 0.7rem 1.2rem; /* Increased padding for better spacing */
  color: white;
  cursor: pointer;
  animation: button-bounce 1s infinite ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Added box-shadow for depth */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Added transition for smoother hover effect */
}

@keyframes button-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(
      -8px
    ); /* Increased vertical translation for a more pronounced bounce */
  }
}

.contact-card button:hover {
  background-color: #005f9e;
  transform: translateY(-4px); /* Added vertical translation on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Increased box-shadow on hover */
}

.chat-button {
  background-color: #00c853;
  border: none;
  border-radius: 6px; /* Increased border-radius for a smoother look */
  padding: 0.7rem 1.2rem; /* Increased padding for better spacing */
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Added box-shadow for depth */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Added transition for smoother hover effect */
}

.chat-button:hover {
  transform: translateY(-4px); /* Added vertical translation on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Increased box-shadow on hover */
}

.contact-card {
  flex: 1 1 100%; /* Thay đổi width của card khi màn hình nhỏ hơn 768px */
  max-width: 100%; /* Chỉ định width tối đa cho card */
}

.contact-card form {
  max-width: 100%; /* Chỉ định width tối đa cho form */
}

@media (min-width: 768px) {
  .contact-card {
    flex: 1 1 45%; /* Giữ nguyên width của card khi màn hình lớn hơn hoặc bằng 768px */
    max-width: 45%; /* Giữ nguyên width của card */
  }

  .contact-card form {
    max-width: 100%; /* Giữ nguyên width của form */
  }
}
</style>
