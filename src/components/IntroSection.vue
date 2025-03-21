<template>
  <section class="hero">
    <header class="header">
      <nav>
        <!-- Navigation links can go here -->
      </nav>
    </header>
    <div class="hero-content animate-slideIn">
      <div class="text-content">
        <h1>{{ $t("hero.title") }}</h1>
        <p>{{ $t("hero.description") }}</p>
        <div class="buttons">
          <button class="styled-button">{{ $t("hero.buttons.join") }}</button>
          <button class="styled-button">
            {{ $t("hero.buttons.contact") }}
          </button>
        </div>
      </div>
      <img src="@/assets/logo.png" alt="ESmart Logo" class="logo" />
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes background-fade {
  from {
    opacity: 0.2;
  }

  to {
    opacity: 0.5;
  }
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

.styled-button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: inline-block;
}

.styled-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.hero {
  background: linear-gradient(135deg, #07076c, #71bae2);
  color: white;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
}

.hero:after {
  content: "";
  background-image: url("@/assets/bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.2;
  filter: blur(5px);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  animation: background-fade 10s ease-in-out infinite;
}

.header {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.header nav ul {
  display: flex;
  justify-content: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.header nav ul li {
  color: white;
  cursor: pointer;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  padding: 0 2rem;
  box-sizing: border-box;
  animation: slideIn 1.5s ease-in-out;
}

.text-content {
  max-width: 600px;
  text-align: left;
}

.text-content h1 {
  font-size: 2.5rem;
  /* Slightly increased font size */
  margin-bottom: 1rem;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 3s steps(30, end) forwards;
}

.text-content p {
  font-size: 1.125rem;
  /* Slightly increased font size */
  line-height: 1.5;
  margin-bottom: 2rem;
}

.logo {
  max-width: 350px;
  /* Increased max width */
  animation: logo-spin 3s ease-in-out infinite;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.buttons button {
  margin-right: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 769px) {
  .hero-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .text-content {
    text-align: left;
    max-width: 600px;
  }

  .text-content h1 {
    font-size: 2.5rem;
    animation: typing 3s steps(30, end) forwards;
  }

  .text-content p {
    font-size: 1.125rem;
  }

  .logo {
    max-width: 350px;
    margin-top: 0;
  }

  .buttons {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .text-content {
    max-width: 100%;
    margin-bottom: 2rem;
  }

  .text-content h1 {
    font-size: 2rem;
    /* Adjusted size for medium screens */
    animation: none;
    /* Remove typing animation on smaller screens */
  }

  .text-content p {
    font-size: 1rem;
    /* Adjusted size for medium screens */
  }

  .logo {
    max-width: 60vw;
    /* Increased size for medium screens */
    margin-bottom: 2rem;
  }

  .buttons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero .hero-content {
    margin-top: 5.5rem;
    padding-bottom: 1rem;
  }
  .text-content h1 {
    font-size: 1.4rem;
    /* Further reduced size for small screens */
  }

  .text-content p {
    font-size: 0.9rem;
    /* Adjusted size for small screens */
  }

  .logo {
    max-width: 70vw;
    /* Further increased size for small screens */
  }
}
</style>
