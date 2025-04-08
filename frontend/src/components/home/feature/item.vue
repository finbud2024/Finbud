<template>
  <div class="rounded-2xl relative h-full border p-4 md:rounded-3xl md:p-8">
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
</template>

<script setup lang="ts">
import InspiraGlowingEffect from '@/components/inspira/GlowingEffect.vue'
import UIcon from '@/components/UIcon.vue'

interface Feature {
  icon: string;
  title: string;
  description: string;
}
interface Props {
  item: Feature;
}
defineProps<Props>();
</script>
