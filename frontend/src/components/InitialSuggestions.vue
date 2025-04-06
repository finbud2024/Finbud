<template>
    <span v-if="!isFinished" class="typing-text">{{ typingText }}</span>
</template>

<script>
import { onMounted } from 'vue';
import { useTypingEffect } from '@/composables/useTypingEffect';

export default {
    name: 'InitialSuggestions',
    setup() {
        const phrases = [
            "#search stock market",
            "TSLA",
            "#buy TSLA 10",
            "#sell TSLA 10",
            "#define IPO",
            "#crypto",
            "#realestate new york",
            "#add Shopping 125",
            "#spend Shopping 125",
            "#spend Shopping 125",
            "#create goal"
        ];

        const { typingText, isFinished, startTyping } = useTypingEffect(phrases, {
            typingSpeed: 100,
            pauseDuration: 1500,
            reverseEffect: true
        });

        onMounted(() => {
            startTyping();
        });

        return {
            typingText,
            isFinished
        };
    },
};
</script>

<style scoped>
.typing-text {
    white-space: nowrap;
    overflow: hidden;
    animation: blink-cursor-initial-suggestions 0.7s step-end infinite;
}

@keyframes blink-cursor-initial-suggestions {

    from,
    to {
        border-color: transparent;
    }

    50% {
        border-color: #333;
    }
}
</style>