<template>
  <div class="border-b border-neutral-200 mb-16 md:mb-32">
    <InspiraAuroraBackground>
      <Motion
        as="div"
        :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
        :while-in-view="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)'
        }"
        :transition="{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut'
        }"
        class="relative flex flex-col items-center justify-center gap-2 md:gap-4 px-4"
      >
        <h1 class="text-center text-3xl font-bold md:text-7xl dark:text-white">
          Empowering smarter finance decisions
        </h1>
        <h2 class="py-4 text-center text-sm font-extralight md:text-3xl dark:text-neutral-200">
          Anytime answers for finance questions with FinBud
        </h2>
        <InspiraVanishingInput v-model="text" :placeholders="placeholders" />
      </Motion>
    </InspiraAuroraBackground>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InspiraAuroraBackground from '@/components//inspira/AuroraBackground.vue'
import InspiraVanishingInput from '@/components/inspira/VanishingInput.vue'
import { MotionComponent as Motion } from '@vueuse/motion'
  // Ensure you have installed @vueuse/motion

const text = ref("")

const placeholders = [
  "Ask FinBud about finance ...",
  "Why is my budget always off?",
  "What does 'compound interest' even mean?",
  "How to invest my finance (for real this time)",
  "Am I smarter than the stock market?",
  "Do savings accounts ever grow fast?",
]
</script>
