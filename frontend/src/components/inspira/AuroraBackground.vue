<template>
  <main>
    <div
      :class="[
        'relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg',
        props.class
      ]"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div
          :class="[
            'filter blur-[10px] invert dark:invert-0 pointer-events-none absolute -inset-[10px] opacity-50 will-change-transform',
            '[--white-gradient:repeating-linear-gradient(100deg,#ffffff_0%,#ffffff_7%,transparent_10%,transparent_12%,#ffffff_16%)]',
            '[--dark-gradient:repeating-linear-gradient(100deg,#000000_0%,#000000_7%,transparent_10%,transparent_12%,#000000_16%)]',
            '[--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)]',
            '[background-image:var(--white-gradient),var(--aurora)] dark:[background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%]',
            'aurora-background-gradient-after',
            'aurora-gradient-animation',
            props.radialGradient
              ? '[mask-image:radial-gradient(ellipse_at_100%_0%,#000000_10%,transparent_70%)]'
              : ''
          ]"
        ></div>
      </div>
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
interface AuroraBackgroundProps {
  radialGradient?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<AuroraBackgroundProps>(), {
  radialGradient: true,
});
</script>

<style scoped>
/* Replace @apply with standard CSS for the pseudo-element */
.aurora-background-gradient-after::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: var(--white-gradient), var(--aurora);
  background-size: 200%, 100%;
  background-attachment: fixed;
  mix-blend-mode: difference;
}

/* Dark mode override for the pseudo-element */
.dark .aurora-background-gradient-after::after {
  background-image: var(--dark-gradient), var(--aurora);
}

/* Retain the aurora animation */
.aurora-gradient-animation::after {
  animation: animate-aurora 60s linear infinite;
}

@keyframes animate-aurora {
  0% {
    background-position: 50% 50%, 50% 50%;
  }
  100% {
    background-position: 350% 50%, 350% 50%;
  }
}
</style>
