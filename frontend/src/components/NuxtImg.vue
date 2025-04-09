<template>
    <!-- If not using custom rendering, render a standard <img> -->
    <img
      v-if="!custom"
      ref="imgEl"
      :class="placeholder && !placeholderLoaded ? placeholderClass : undefined"
      v-bind="{ ...attrs, ...imgAttrs }"
      :src="src"
    />
    <!-- Otherwise, allow a slot to control the rendered output -->
    <slot
      v-else
      v-bind="{
        imgAttrs: { ...attrs, ...imgAttrs },
        isLoaded: placeholderLoaded,
        src: src
      }"
    />
  </template>
  
  <script lang="ts">
  import { defineComponent, computed, onMounted, ref, useAttrs } from 'vue'
  import { useImage } from '@/composables/useImage'
  import { parseSize } from '@/utils/parseSize'
  import { imgProps } from '@/utils/imgProps'
  import { useBaseImage, baseImageProps } from '@/utils/useBaseImage'

  
  export const NuxtImg = defineComponent({
    name: 'NuxtImg',
    props: imgProps, // Ensure imgProps is defined in your ./_base file
    emits: ['load', 'error'],
    setup(props, { emit, attrs }) {
      const $img = useImage()
      const _base = useBaseImage(props)
      const placeholderLoaded = ref(false)
      const imgEl = ref<HTMLImageElement | null>(null)
      
      // Calculate sizes using the helper function
      const sizes = computed(() =>
        $img.getSizes(props.src, {
          ..._base.options.value,
          sizes: props.sizes,
          densities: props.densities,
          modifiers: {
            ..._base.modifiers.value,
            width: parseSize(props.width),
            height: parseSize(props.height),
          },
        })
      )
      
      // Build the attributes to be bound to the image
      const imgAttrs = computed(() => {
        // Start with the base attributes plus a marker attribute
        const a: Record<string, any> = { ..._base.attrs.value, 'data-nuxt-img': '' }
        if (!props.placeholder || placeholderLoaded.value) {
          a.sizes = sizes.value.sizes
          a.srcset = sizes.value.srcset
        }
        return a
      })
      
      // Determine if a placeholder should be used
      const placeholder = computed(() => {
        let ph = props.placeholder
        if (ph === '') {
          ph = true
        }
        if (!ph || placeholderLoaded.value) {
          return false
        }
        if (typeof ph === 'string') {
          return ph
        }
        // Determine size: if placeholder is a number or an array, use defaults
        const size = Array.isArray(ph)
          ? ph
          : (typeof ph === 'number' ? [ph, ph] : [10, 10])
        return $img(
          props.src,
          {
            ..._base.modifiers.value,
            width: size[0],
            height: size[1],
            quality: size[2] || 50,
            blur: size[3] || 3,
          },
          _base.options.value
        )
      })
      
      // Determine the main src
      const mainSrc = computed(() =>
        props.sizes
          ? sizes.value.src
          : $img(props.src, _base.modifiers.value, _base.options.value)
      )
      
      // Final src is either the placeholder (if available) or the main src
      const src = computed(() => (placeholder.value ? placeholder.value : mainSrc.value))
      
      // Define a placeholder CSS class (adjust as needed)
      const placeholderClass = 'placeholder-class'
      
      onMounted(() => {
        // If using a placeholder or a custom render, pre-load the image in JavaScript
        if (placeholder.value || props.custom) {
          const img = new Image()
          if (mainSrc.value) {
            img.src = mainSrc.value
          }
          if (props.sizes) {
            img.sizes = sizes.value.sizes || ''
            img.srcset = sizes.value.srcset
          }
          img.onload = (event) => {
            placeholderLoaded.value = true
            emit('load', event)
          }
          img.onerror = (event) => {
            emit('error', event)
          }
          return
        }
        // If not using a pre-loaded placeholder, attach event handlers to the image element
        if (!imgEl.value) return
        if (imgEl.value.complete) {
          if (imgEl.value.getAttribute('data-error')) {
            emit('error', new Event('error'))
          } else {
            emit('load', new Event('load'))
          }
        }
        imgEl.value.onload = (event) => {
          emit('load', event)
        }
        imgEl.value.onerror = (event) => {
          emit('error', event)
        }
      })
      
      return {
        attrs,
        placeholderLoaded,
        imgEl,
        sizes,
        imgAttrs,
        placeholder,
        mainSrc,
        src,
        placeholderClass,
        custom: props.custom,
      }
    },
  })
  </script>
  
  <style scoped>
  /* You can add any component-specific styles here */
  </style>
  