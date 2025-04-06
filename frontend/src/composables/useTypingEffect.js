import { ref } from 'vue'

export function useTypingEffect(phrases = [], options = {}) {
  const {
    typingSpeed = 100,
    pauseDuration = 1000,
    reverseEffect = true
  } = options

  const typingText = ref('')
  const currentPhraseIndex = ref(0);
  const currentCharIndex = ref(0);
  const typingIndex = ref(0);
  const isTypingForward = ref(true);
  const isFinished = ref(false);

  const typeText  = () => {
    const currentPhrase = phrases[currentPhraseIndex.value];
    if (!currentPhrase) {
      isFinished.value = true;
      return;
    }

    if (isTypingForward.value) {
      // Type from left to right
      if (currentCharIndex.value < currentPhrase.length) {
        typingText.value += currentPhrase.charAt(currentCharIndex.value)
        currentCharIndex.value++
        setTimeout(typeText , typingSpeed)
      } else if (reverseEffect) {
        // When reached the end, wait and start deleting if reverseEffect is enabled
        setTimeout(() => {
          isTypingForward.value = false
          typeText()
        }, pauseDuration) 
      } else {
        setTimeout(() => {
          goToNextPhrase();
        }, pauseDuration);
      }
    } else {
      // Type from right to left (delete)
      if (currentCharIndex.value > 0) {
        currentCharIndex.value--
        typingText.value = currentPhrase.substring(0, currentCharIndex.value)
        setTimeout(typeText, typingSpeed / 2) // Slightly faster deletion
      } else {
        // When reached the start, wait and start typing again
        goToNextPhrase()
      }
    }
  }

  const goToNextPhrase = () => {
    currentPhraseIndex.value++;
    currentCharIndex.value = 0;
    typingText.value = '';
    isTypingForward.value = true;

    if (currentPhraseIndex.value < phrases.length) {
      typeText();
    } else {
      isFinished.value = true;
    }
  };

  const startTyping = () => {
    typingText.value = '';
    currentPhraseIndex.value = 0;
    currentCharIndex.value = 0;
    isTypingForward.value = true;
    isFinished.value = false;
    typeText();
  }

  return {
    typingText,
    isFinished,
    startTyping,
  }
}