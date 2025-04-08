<template>
  <!-- Outer border glow element -->
  <div
    :class="cn(
      'pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity',
      glow && 'opacity-100',
      variant === 'white' && 'border-white',
      disabled && '!block'
    )"
  />
  
  <!-- Main container for the dynamic glow effect -->
  <div
    ref="containerRef"
    :style="containerStyles"
    :class="cn(
      'pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity',
      glow && 'opacity-100',
      blur > 0 && `blur-[var(--blur)]`,
      props.class,
      disabled && '!hidden'
    )"
  >
    <!-- The inner glow element with pseudo-element styles -->
    <div
      :class="cn(
        'glow',
        'rounded-[inherit]',
        `after:content-[''] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]`,
        'after:[border:var(--glowingeffect-border-width)_solid_transparent]',
        'after:[background:var(--gradient)] after:[background-attachment:fixed]',
        'after:opacity-[var(--active)] after:transition-opacity after:duration-300',
        'after:[mask-clip:padding-box,border-box]',
        'after:[mask-composite:intersect]',
        'after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]'
      )"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/components/lib/utils'
import { animate } from 'motion-v'
import type { HTMLAttributes } from 'vue'

// Define the props interface
interface Props {
  blur?: number
  inactiveZone?: number
  proximity?: number
  spread?: number
  variant?: 'default' | 'white'
  glow?: boolean
  class?: HTMLAttributes["class"]
  disabled?: boolean
  movementDuration?: number
  borderWidth?: number
}

// Use withDefaults to set default prop values
const props = withDefaults(defineProps<Props>(), {
  blur: 0,
  inactiveZone: 0.7,
  proximity: 0,
  spread: 20,
  variant: 'default',
  glow: false,
  movementDuration: 2,
  borderWidth: 2,
  disabled: true,
})

// Standard Vue 3 refs instead of templateRef
const containerRef = ref<HTMLElement | null>(null)
const lastPosition = ref({ x: 0, y: 0 })
const animationFrame = ref<number | null>(null)

// Compute container styles with CSS variables
const containerStyles = computed(() => {
  return {
    '--blur': `${props.blur}px`,
    '--spread': props.spread,
    '--start': '0',
    '--active': '0',
    '--glowingeffect-border-width': `${props.borderWidth}px`,
    '--repeating-conic-gradient-times': '5',
    '--gradient': props.variant === 'white'
      ? `repeating-conic-gradient(
          from 236.84deg at 50% 50%,
          var(--black),
          var(--black) calc(25% / var(--repeating-conic-gradient-times))
        )`
      : `radial-gradient(circle, #3B82F6 10%, #3B82F6 20%),
         radial-gradient(circle at 40% 40%, #3B82F6 5%, #3B82F6 15%),
         radial-gradient(circle at 60% 60%, #3B82F6 10%, #3B82F6 20%),
         radial-gradient(circle at 40% 60%, #3B82F6 10%, #3B82F6 20%),
         repeating-conic-gradient(
           from 236.84deg at 50% 50%,
           #3B82F6 0%,
           #3B82F6 calc(25% / var(--repeating-conic-gradient-times)),
           #3B82F6 calc(50% / var(--repeating-conic-gradient-times)),
           #3B82F6 calc(75% / var(--repeating-conic-gradient-times)),
           #3B82F6 calc(100% / var(--repeating-conic-gradient-times))
         )`,
  }
})

// Event listeners for scroll and pointermove
onMounted(() => {
  if (props.disabled) return

  window.addEventListener('scroll', handleScroll, { passive: true })
  document.body.addEventListener('pointermove', handlePointerMove, { passive: true })
})

onUnmounted(() => {
  if (animationFrame.value !== null) cancelAnimationFrame(animationFrame.value)
  window.removeEventListener('scroll', handleScroll)
  document.body.removeEventListener('pointermove', handlePointerMove)
})

// Handler to update motion on pointer move
function handlePointerMove(e: PointerEvent) {
  handleMove(e)
}

// Handler for scroll events
function handleScroll() {
  handleMove()
}

// Main function to handle movement and animate CSS variables
function handleMove(e?: MouseEvent | PointerEvent | { x: number; y: number }) {
  if (!containerRef.value) return

  if (animationFrame.value !== null) {
    cancelAnimationFrame(animationFrame.value)
  }

  animationFrame.value = requestAnimationFrame(() => {
    const element = containerRef.value
    if (!element) return

    const { left, top, width, height } = element.getBoundingClientRect()
    const mouseX = e?.x ?? lastPosition.value.x
    const mouseY = e?.y ?? lastPosition.value.y

    if (e) {
      lastPosition.value = { x: mouseX, y: mouseY }
    }

    const center = [left + width / 2, top + height / 2]
    const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1])
    const inactiveRadius = 0.5 * Math.min(width, height) * props.inactiveZone

    if (distanceFromCenter < inactiveRadius) {
      element.style.setProperty('--active', '0')
      return
    }

    const isActive =
      mouseX > left - props.proximity &&
      mouseX < left + width + props.proximity &&
      mouseY > top - props.proximity &&
      mouseY < top + height + props.proximity

    element.style.setProperty('--active', isActive ? '1' : '0')
    if (!isActive) return

    const currentAngle = parseFloat(element.style.getPropertyValue('--start')) || 0
    let targetAngle =
      (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90

    const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180
    const newAngle = currentAngle + angleDiff

    animate(currentAngle, newAngle, {
      duration: props.movementDuration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        element.style.setProperty('--start', String(value))
      },
    })
  })
}
</script>
