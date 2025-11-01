import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Composable for language management
 * Provides reactive language utilities and helper functions
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useLanguage } from '@/composables/useLanguage';
 * 
 * const { currentLanguage, switchLanguage, translate, isVietnamese } = useLanguage();
 * 
 * // Reactive computed
 * const buttonText = computed(() => translate('button.save'));
 * </script>
 * ```
 */
export function useLanguage() {
  const { locale, t, tm } = useI18n();
  
  /**
   * Switch language and persist to localStorage
   * Note: localStorage sync is handled automatically in main.js
   * 
   * @param {string} lang - Language code ('en' or 'vi')
   */
  const switchLanguage = (lang) => {
    if (lang === 'en' || lang === 'vi') {
      locale.value = lang;
      // localStorage is automatically synced by the watcher in main.js
    } else {
      console.warn(`Invalid language code: ${lang}. Expected 'en' or 'vi'.`);
    }
  };
  
  /**
   * Current language (reactive)
   * @returns {ComputedRef<string>} Current locale value
   */
  const currentLanguage = computed(() => locale.value);
  
  /**
   * Check if current language is Vietnamese
   * @returns {ComputedRef<boolean>} True if locale is 'vi'
   */
  const isVietnamese = computed(() => locale.value === 'vi');
  
  /**
   * Check if current language is English
   * @returns {ComputedRef<boolean>} True if locale is 'en'
   */
  const isEnglish = computed(() => locale.value === 'en');
  
  /**
   * Safe translation with fallback
   * Returns the translation key if translation is missing (instead of throwing)
   * 
   * @param {string} key - Translation key
   * @param {object} params - Optional parameters for interpolation
   * @returns {string} Translated string or key if missing
   * 
   * @example
   * translate('button.save') // Returns translated "Save" or "Lưu"
   * translate('message.welcome', { name: 'John' }) // With parameters
   */
  const translate = (key, params = {}) => {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`, error);
      return key; // Return key as fallback instead of crashing
    }
  };
  
  /**
   * Get multiple translations at once
   * Useful for bulk translation needs
   * 
   * @param {string[]} keys - Array of translation keys
   * @returns {object} Object with keys as properties and translations as values
   * 
   * @example
   * translateMany(['button.save', 'button.cancel'])
   * // Returns: { 'button.save': 'Save', 'button.cancel': 'Cancel' }
   */
  const translateMany = (keys) => {
    return keys.reduce((acc, key) => {
      acc[key] = translate(key);
      return acc;
    }, {});
  };
  
  return {
    // Reactive state
    currentLanguage,
    isVietnamese,
    isEnglish,
    
    // Methods
    switchLanguage,
    translate,
    translateMany,
    
    // Direct access to vue-i18n (for advanced use cases)
    t,      // Original translation function
    tm,     // Translation messages function
    locale  // Direct access to locale ref (use with caution)
  };
}

