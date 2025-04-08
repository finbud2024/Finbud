<template>
  <div
    class="flex flex-1 flex-col border-l border-border pl-5 py-4"
  >
    <div class="flex-1">
      <h3 class="text-xs md:text-base text-slate-600 mb-8 md:mb-16">
        {{ number.title }}
      </h3>
    </div>
    <div class="flex lg:items-end gap-2 flex-col lg:flex-row">
      <p class="text-5xl xl:text-6xl">{{ number.value }}</p>
      <p class="opacity-90 leading-7">{{ number.description }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
type NumberOpimize = {
  title: string;
  value: string;
  description: string;
};
type Props = {
  number: NumberOpimize;
};
defineProps<Props>();
</script>
