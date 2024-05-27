<template>
  <div class="company-card" :style="{ width: `${width}px` }">
    <h2>{{ companyName }}</h2>
    <!-- Add more company details here -->
  </div>
</template>

<script>
export default {
  name: 'CompanyCard',
  props: {
    companyName: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 800
    }
  }
};
</script>

<style scoped>
.company-card {
  border: 1px solid #3aafa9;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
  text-align: center;
}
</style>