<template>
  <div class="py-12 sm:py-24 max-w-7xl mx-auto px-4 md:px-8">
    <div class="divide-y divide-border border-y lg:border-x border-border">
      <div
        v-for="item in list"
        :key="item.title"
        class="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:items-stretch divide-border"
      >
        <div class="flex flex-col gap-12 lg:gap-36 justify-between py-12 p-4 lg:p-12 w-full">
          <h2 class="text-balance text-2xl sm:text-3xl lg:text-4xl">
            <span>{{ item.title }}</span>
            <br />
            <span class="text-primary-700">{{ item.feature }}</span>
          </h2>
          <div class="space-y-8">
            <p class="max-w-md">{{ item.description }}</p>
            <UButton color="white" size="xl" icon="i-heroicons:arrow-up-right" trailing>
              {{ item.cta }}
            </UButton>
          </div>
        </div>
        <div class="flex justify-center items-center py-12 sm:p-12 relative bg-background lg:h-auto">
          <NuxtImg class="w-[300px] h-[300px]" :src="item.image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NuxtImg from '@/components/NuxtImg.vue'   // Adjust this path as needed
import UButton from '@/components/UButton.vue'     // Adjust this path as needed

export const HomeDemo = defineComponent({
  name: 'HomeDemo',
  components: {
    NuxtImg,
    UButton,
  },
  data() {
    return {
      list: [
        {
          title: "Solve Financial Worries with",
          feature: "AI Chatbot,",
          description:
            "With just simple commands and access to a vast source of accurate and reliable information, all your financial queries can be answered instantly.",
          image: "/longest-logo.svg",
          cta: "Chat now",
          link: "/chat",
        },
        {
          title: "Master Your Investments with",
          feature: "FinBud Simulator,",
          description:
            "Track how your investments are performing in real-time, provide actionable insights from your investment and the market to make better investment decisions.",
          image: "/longest-logo.svg",
          cta: "Simulator now",
          link: "/simulator",
        },
        {
          title: "Predict Your Costs with",
          feature: "FinBud Goal,",
          description:
            "Our AI predicts upcoming expenses to help you plan ahead, understand your spending patterns and receive tips for better budget management.",
          image: "/longest-logo.svg",
          cta: "Set Goal now",
          link: "/goal",
        },
        {
          title: "Boost Your Finance Skills with",
          feature: "FinBud Quiz,",
          description:
            "Financial Quiz with different topics related to different keywords help you practice and learn financial knowledge in a smart and interactive way.",
          image: "/longest-logo.svg",
          cta: "Try Quiz now",
          link: "/quiz",
        },
      ],
    }
  },
})
</script>

<style scoped>
/* Add any HomeDemo-specific styles here if needed */
</style>
