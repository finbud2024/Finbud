<template>
  <div class="py-12 sm:py-24 max-w-7xl mx-auto px-4 md:px-8">
    <h2 class="text-center text-2xl sm:text-4xl mb-8 sm:mb-16 font-semibold">
      Easily notice the impact
      </h2>
    <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        
      <HomeNumberItem v-for="item in number" :key="item.title" :number="item"/>
    </div>
  </div>
</template>
<script setup lang="ts">
const number = [
    {
        title: "Savings Increase",
        value: "20%",
        description: "average per user"
    },
    {
        title: "Financial Awareness",
        value: "25%",
        description: "increase"
    },
    {
        title: "Debt Reduction",
        value: "30%",
        description: "after 1 year"
    },
    {
        title: "Improved Credit Score",
        value: "6",
        description: "months within"
    }
];
</script>
