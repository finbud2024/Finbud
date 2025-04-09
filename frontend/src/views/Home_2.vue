<template>
    <div>
      <HomeBanner />
      <HomeFeature />
      <HomeNumber />
      <HomeDemo />
      <HomeFaq />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import HomeBanner from '@/components/home/banner.vue'
  import { HomeFeature } from '@/components/home/feature/homefeature.vue'
  import {HomeNumber} from '@/components/home/number/homenumber.vue'
  import {HomeDemo} from '@/components/home/demo/index.vue'
  import HomeFaq from '@/components/home/faq.vue'
  
  useHead({
    title: 'Welcome | FinBud',
    meta: [
      {
        name: 'description',
        content: `Empowering smarter finance decisions.
  Anytime answers for your finance questions with FinBud`,
      },
    ],
  })
  </script>
  