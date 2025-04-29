<template>
    <component :is="tag" class="typewriter">{{ displayText }}</component>
</template>

<script>
export default {
    name: 'TypeWriter',
    props: {
        text: {
            type: String,
            required: true
        },
        speed: {
            type: Number,
            default: 100
        },
        delay: {
            type: Number,
            default: 0
        },
        tag: {
            type: String,
            default: 'span'
        }
    },
    data() {
        return {
            displayText: '',
            interval: null,
            charIndex: 0,
            isComplete: false
        };
    },
    watch: {
        text() {
            this.reset();
            this.startTyping();
        }
    },
    mounted() {
        setTimeout(() => {
            this.startTyping();
        }, this.delay);
    },
    beforeUnmount() {
        this.stopTyping();
    },
    methods: {
        startTyping() {
            this.stopTyping();

            const typeSpeed = 1000 / this.speed; // Convert speed to milliseconds

            this.interval = setInterval(() => {
                if (this.charIndex < this.text.length) {
                    this.displayText += this.text.charAt(this.charIndex);
                    this.charIndex++;
                } else {
                    this.isComplete = true;
                    this.stopTyping();
                    this.$emit('complete');
                }
            }, typeSpeed);
        },
        stopTyping() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        },
        reset() {
            this.displayText = '';
            this.charIndex = 0;
            this.isComplete = false;
        }
    }
};
</script>

<style scoped>
.typewriter {
    display: inline-block;
}
</style>