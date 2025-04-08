<template>
  <div>
    <!-- SVG icon rendering -->
    <svg
      v-if="mode === 'svg'"
      :width="computedSize"
      :height="computedSize"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="icon-svg"
    >
      <title>{{ name }}</title>
      <!-- In a real scenario, map 'name' to proper SVG paths -->
      <rect width="24" height="24" fill="transparent" />
      <!-- Optionally, insert custom HTML from the customize prop -->
      <template v-if="customIcon" v-html="customIcon"></template>
    </svg>

    <!-- CSS mode: simple text-based icon -->
    <span
      v-else
      :style="{ fontSize: computedSize }"
      class="icon-css"
    >
      {{ name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Define the component props using defineProps and withDefaults
const props = withDefaults(
  defineProps<{
    /** The icon name (used as a title and for mapping to an icon if desired) */
    name: string
    /** The display mode, either 'svg' for an SVG icon or 'css' for a CSS-rendered icon */
    mode?: 'svg' | 'css'
    /** The size of the icon (as a string or number) */
    size?: string | number
    /** A customize function that returns custom HTML based on the icon name */
    customize?: (name: string) => string
  }>(),
  {
    mode: 'svg',
    size: '24px',
    customize: () => '',
  }
)

// Computed size: if a number is passed, append 'px'
const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})

// Evaluate the custom icon markup if provided
const customIcon = computed(() => {
  if (typeof props.customize === 'function') {
    return props.customize(props.name)
  }
  return ''
})
</script>

<style scoped>
.icon-svg {
  display: inline-block;
  vertical-align: middle;
}

.icon-css {
  display: inline-block;
  vertical-align: middle;
  color: currentColor;
}
</style>
