import { ref } from 'vue'

export function useTypingEffect(text, options = {}) {
  const {
    typingSpeed = 100,
    pauseDuration = 1000,
    reverseEffect = true
  } = options

  const typingText = ref('')
  const typingIndex = ref(0)
  const isTypingForward = ref(true)

  const typeText = () => {
    if (isTypingForward.value) {
      // Type from left to right
      if (typingIndex.value < text.length) {
        typingText.value += text.charAt(typingIndex.value)
        typingIndex.value++
        setTimeout(typeText, typingSpeed)
      } else if (reverseEffect) {
        // When reached the end, wait and start deleting if reverseEffect is enabled
        setTimeout(() => {
          isTypingForward.value = false
          typeText()
        }, pauseDuration)
      }
    } else {
      // Type from right to left (delete)
      if (typingIndex.value > 0) {
        typingIndex.value--
        typingText.value = text.substring(0, typingIndex.value)
        setTimeout(typeText, typingSpeed / 2) // Slightly faster deletion
      } else {
        // When reached the start, wait and start typing again
        setTimeout(() => {
          isTypingForward.value = true
          typeText()
        }, pauseDuration)
      }
    }
  }

  const startTyping = () => {
    typingText.value = ''
    typingIndex.value = 0
    isTypingForward.value = true
    typeText()
  }

  return {
    typingText,
    startTyping
  }
}