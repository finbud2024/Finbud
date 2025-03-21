To enhance the CSS and animation and ensure responsiveness for phones, you can make the following adjustments:

1. **Header Styles**: Increase the font size for better readability on smaller screens.

2. **Content Styles**: Adjust the flex direction and alignment for smaller screens. Increase the width of the cards to occupy more space.

3. **Button Styles**: Increase the button size and adjust the padding for better touch interaction.

4. **Media Query**: Use a media query to apply specific styles for screens with a minimum width of 768px (tablets and larger screens).

Here's the updated code:

```vue
<template>
  <div>
    <header class="header">
      <h1>See How Your Business Stacks Up</h1>
      <p>
        Gain insights into your Facebook performance and elevate it with NexGen's social media check-up. Assess your call center's operations and receive tailored recommendations and statistics through a brief questionnaire for an operational analysis.
      </p>
    </header>
    
    <div class="content">
      <div class="card">
        <h2>Social Media Check-Up</h2>
        <p>
          How is your business’ Facebook performing? <strong>Click the button</strong> to see how you stack up and learn how NexGen can take you to the next level!
        </p>
        <button @click="goToSocialMediaCheckup">Click Here</button>
      </div>
      
      <div class="card">
        <h2>Call Center Operational Check-Up and Analysis</h2>
        <p>
          How is your business’ Facebook performing? <strong>Fill out your brief questionnaire</strong> to receive recommendations and statistics on the current state of your contact center!
        </p>
        <button @click="goToCallCenterCheckup">Click Here</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessCheckup',
  methods: {
    goToSocialMediaCheckup() {
      // Logic to navigate to the Social Media Check-Up page
      this.$router.push('/social-media-checkup');
    },
    goToCallCenterCheckup() {
      // Logic to navigate to the Call Center Check-Up page
      this.$router.push('/call-center-checkup');
    }
  }
};
</script>

<style scoped>
.header {
  background-color: #1a23d1;
  color: white;
  padding: 2rem;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.header p {
  font-size: 1.2rem;
  margin: 0 auto;
  max-width: 600px;
}

.content {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  padding: 2rem;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  width: 45%;
}

.card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.card p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.card button {
  background-color: #460de2;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 0.8rem 1.2rem; /* Increase padding for better touch interaction */
  cursor: pointer;
  font-size: 1.1rem; /* Increase font size for better readability */
}

.card button:hover {
  background-color: #252aca;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 90%; /* Use 90% of the screen width */
    margin-bottom: 2rem;
  }

  .card button {
    width: 100%;
    padding: 1rem 1.5rem; /* Adjust padding for smaller screens */
  }
}
</style>
```

These adjustments should make the layout more responsive and improve the overall user experience on mobile devices.