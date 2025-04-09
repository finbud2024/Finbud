<template>
    <div class="py-12 sm:py-24 max-w-7xl mx-auto px-4 md:px-8">
      <h2 class="text-center text-2xl sm:text-4xl mb-8 sm:mb-16 font-semibold">
        Easily notice the impact
      </h2>
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div
          v-for="item in numbers"
          :key="item.title"
          class="flex flex-col border-l border-border pl-5 py-4"
        >
          <div class="flex-1">
            <h3 class="text-xs md:text-base text-slate-600 mb-8 md:mb-16">
              {{ item.title }}
            </h3>
          </div>
          <div class="flex lg:items-end gap-2 flex-col lg:flex-row">
            <p class="text-5xl xl:text-6xl">{{ item.value }}</p>
            <p class="opacity-90 leading-7">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export const HomeNumber = defineComponent({
    name: 'HomeNumber',
    data() {
      return {
        numbers: [
          {
            title: "Savings Increase",
            value: "20%",
            description: "average per user",
          },
          {
            title: "Financial Awareness",
            value: "25%",
            description: "increase",
          },
          {
            title: "Debt Reduction",
            value: "30%",
            description: "after 1 year",
          },
          {
            title: "Improved Credit Score",
            value: "6",
            description: "months within",
          },
        ],
      };
    },
  });
  </script>
  
  <style scoped>
  /* You can add component-specific styles here if needed */
  </style>
  