<template>
    <div class="py-12 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <h2 class="text-center text-2xl sm:text-4xl mb-8 sm:mb-16 font-semibold">
          Partnering to Achieve Financial Goals
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 md:mb-16">
          <div
            v-for="item in content"
            :key="item.icon"
            class="rounded-2xl relative h-full border p-4 md:rounded-3xl md:p-8"
          >
            <InspiraGlowingEffect
              :spread="40"
              :glow="true"
              :disabled="false"
              :proximity="64"
              :inactive-zone="0.01"
            />
            <UIcon :name="item.icon" class="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4" />
            <h3 class="text-base sm:text-2xl font-medium mb-2 sm:mb-4">
              {{ item.title }}
            </h3>
            <p class="text-xs sm:text-base">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import InspiraGlowingEffect from '@/components/inspira/GlowingEffect.vue'
  import UIcon from '@/components/UIcon.vue'
  
  interface Feature {
    icon: string
    title: string
    description: string
  }
  
  export const HomeFeature = defineComponent({
    name: 'HomeFeature',
    components: {
      InspiraGlowingEffect,
      UIcon,
    },
    setup() {
      const content: Feature[] = [
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
      ]
      return { content }
    },
  })
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  