<template>
  <div class="py-12 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <h2 class="text-center text-2xl sm:text-4xl mb-8 sm:mb-16 font-semibold">
        Partnering to Achieve Financial Goals
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 md:mb-16">
        <HomeFeatureItem
          v-for="item in content"
          :key="item.icon"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeFeatureItem from './item.vue'

const content = [
  {
    title: "Enhance Your Financial Awareness",
    description:
      "Finbud's advanced AI chatbot will help you review, explore financial topics, and answer all your questions.",
    icon: "i-heroicons:light-bulb",
  },
  {
    title: "Optimize Your Financial Planning",
    description:
      "Finbud helps you track and manage expenses, record income and spending, and tailor financial management to your specific goals.",
    icon: "i-heroicons:chart-bar",
  },
  {
    title: "Maximize Your Investment Efficiency",
    description:
      "Finbud provides a comprehensive overview of the financial market, guiding you to optimize your capital confidently.",
    icon: "i-heroicons:arrow-up-circle",
  },
];
</script>
