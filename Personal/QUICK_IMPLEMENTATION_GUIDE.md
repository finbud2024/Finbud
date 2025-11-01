# Quick Implementation Guide - Ready-to-Use Code

## 🚀 Step 1: Fix i18n Initialization (CRITICAL - Do This First)

### **Update: `frontend/src/i18n.js`**

**Replace lines 4088-4096 with:**

```javascript
// Get initial locale from localStorage or browser
const getInitialLocale = () => {
  // Try localStorage first (user preference)
  const saved = localStorage.getItem("language");
  if (saved === "en" || saved === "vi") {
    return saved;
  }
  
  // Fallback to browser language
  try {
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "vi") return "vi";
  } catch (e) {
    // Fallback if navigator is not available
  }
  
  // Default to English
  return "en";
};

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),  // ✅ Dynamic initialization
  fallbackLocale: "en",
  messages,
  globalInjection: true,
});

// Auto-sync locale changes to localStorage
if (typeof window !== 'undefined') {
  // Watch for locale changes and save to localStorage
  i18n.global.locale = new Proxy(i18n.global.locale, {
    set(target, property, value) {
      if (property === 'value' && (value === 'en' || value === 'vi')) {
        localStorage.setItem("language", value);
      }
      target[property] = value;
      return true;
    }
  });
}

export default i18n;
```

**Or simpler approach (if Proxy doesn't work):**

```javascript
const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: "en",
  messages,
  globalInjection: true,
});

// Sync changes to localStorage (Vue 3 reactive)
import { watch } from 'vue';
if (typeof window !== 'undefined') {
  watch(() => i18n.global.locale.value, (newLocale) => {
    if (newLocale === 'en' || newLocale === 'vi') {
      localStorage.setItem("language", newLocale);
    }
  });
}

export default i18n;
```

---

## 🔧 Step 2: Create Language Composable

### **Create: `frontend/src/composables/useLanguage.js`**

```javascript
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Composable for language management
 * Use this instead of directly accessing $i18n
 */
export function useLanguage() {
  const { locale, t, tm } = useI18n();
  
  /**
   * Switch language and persist to localStorage
   */
  const switchLanguage = (lang) => {
    if (lang === 'en' || lang === 'vi') {
      locale.value = lang;
      // localStorage is now handled by i18n.js watcher
    }
  };
  
  /**
   * Current language (reactive)
   */
  const currentLanguage = computed(() => locale.value);
  
  /**
   * Check if current language is Vietnamese
   */
  const isVietnamese = computed(() => locale.value === 'vi');
  
  /**
   * Check if current language is English
   */
  const isEnglish = computed(() => locale.value === 'en');
  
  /**
   * Safe translation with fallback
   */
  const translate = (key, params = {}) => {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
  };
  
  return {
    // Reactive state
    currentLanguage,
    isVietnamese,
    isEnglish,
    
    // Methods
    switchLanguage,
    translate,
    
    // Direct access (for advanced use)
    t,
    tm,
    locale
  };
}
```

---

## 📝 Step 3: Update NavBar to Use Composable

### **Update: `frontend/src/components/Basic/NavBar.vue`**

**In the script section, replace the switchLanguage method:**

```javascript
// Add import at top
import { useLanguage } from '@/composables/useLanguage';

export default {
  name: "NavBar",
  // ... existing code ...
  
  setup() {
    // Use composable
    const { switchLanguage, currentLanguage } = useLanguage();
    
    return {
      switchLanguage,
      currentLanguage
    };
  },
  
  // OR if using Options API (your current setup):
  methods: {
    switchLanguage(lang) {
      // Use composable in Options API
      const { switchLanguage: switchLang } = useLanguage();
      switchLang(lang);
      
      // Remove this line - now handled by i18n.js:
      // localStorage.setItem("language", lang);
    },
    // ... rest of methods
  },
  
  mounted() {
    // Remove this - now handled in i18n.js:
    // const savedLang = localStorage.getItem("language");
    // if (savedLang) this.$i18n.locale = savedLang;
    
    // Keep rest of mounted logic...
    this.checkMobile();
    // ... etc
  }
}
```

---

## 🎨 Step 4: Example - Migrate PestlePage.vue

### **Before (Hardcoded):**
```vue
<template>
  <label>Ngành<span>*</span></label>
  <input placeholder="Nhập ngành bạn muốn phân tích" />
  <button>Phân tích →</button>
  <button>Quay lại</button>
</template>
```

### **After (Using Translations):**

**1. First, add keys to `i18n.js`:**

```javascript
// In i18n.js messages.en:
en: {
  // ... existing ...
  pestle: {
    title: "PESTLE Analysis",
    industry: "Industry",
    industryPlaceholder: "Enter the industry you want to analyze",
    analyze: "Analyze",
    back: "Back",
    loading: "Analyzing industry...",
    // ... more keys
  }
}

// In i18n.js messages.vi:
vi: {
  // ... existing ...
  pestle: {
    title: "Phân tích PESTLE",
    industry: "Ngành",
    industryPlaceholder: "Nhập ngành bạn muốn phân tích",
    analyze: "Phân tích",
    back: "Quay lại",
    loading: "Đang phân tích ngành...",
    // ... more keys
  }
}
```

**2. Update PestlePage.vue:**

```vue
<template>
  <div class="pestle-page">
    <h1 class="title">{{ $t('pestle.title') }}</h1>
    
    <div class="industry-input">
      <label for="industry" class="label">
        {{ $t('pestle.industry') }}<span class="required">*</span>
      </label>
      <input 
        id="industry" 
        v-model="industry" 
        type="text" 
        :placeholder="$t('pestle.industryPlaceholder')"
        class="input" 
      />
    </div>
    
    <button @click="startWorkflow" class="start-button">
      {{ $t('pestle.analyze') }} →
    </button>
    
    <button @click="resetWorkflow" class="back-button">
      {{ $t('pestle.back') }}
    </button>
  </div>
</template>

<script>
export default {
  // No changes needed - $t() is globally available
  // ... existing code ...
}
</script>
```

---

## 🛠️ Step 5: Install i18n Ally (VS Code Extension)

### **Manual Installation:**
1. Open VS Code
2. Go to Extensions (Cmd+Shift+X)
3. Search for "i18n Ally"
4. Install by Lokalise

### **Or via command line:**
```bash
code --install-extension lokalise.i18n-ally
```

### **Configure: `frontend/.vscode/settings.json`**

```json
{
  "i18n-ally.localesPaths": ["frontend/src/i18n.js"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.enabledFrameworks": ["vue", "vue-i18n"],
  "i18n-ally.sourceLanguage": "en",
  "i18n-ally.displayLanguage": "en",
  "i18n-ally.enabled": true,
  "i18n-ally.namespace": false,
  "i18n-ally.pathMatcher": "{locale}.{ext}",
  "i18n-ally.extract.autoDetect": true
}
```

**Benefits:**
- See translations inline in code
- Detect missing translations
- Quick edit translations
- See translation progress

---

## 📋 Step 6: Test It Works

### **Test Script:**

1. **Set language to Vietnamese:**
   ```javascript
   // In browser console
   localStorage.setItem('language', 'vi');
   location.reload();
   ```
   ✅ Should show Vietnamese immediately (no flash of English)

2. **Switch language:**
   - Click language switcher
   - ✅ Should change immediately
   - Reload page
   - ✅ Should persist

3. **First-time visitor:**
   ```javascript
   // Clear localStorage
   localStorage.clear();
   location.reload();
   ```
   - ✅ Should use browser language or default to English

---

## 🎯 Quick Wins Checklist

### **Today (1 hour):**
- [ ] Fix `i18n.js` initialization (Step 1)
- [ ] Test language persists across reloads
- [ ] Verify no flash of wrong language

### **This Week:**
- [ ] Create `useLanguage` composable (Step 2)
- [ ] Update NavBar (Step 3)
- [ ] Install i18n Ally extension (Step 5)
- [ ] Migrate PestlePage.vue (Step 4)

### **Next Week:**
- [ ] Migrate 2-3 more high-priority pages
- [ ] Set up ESLint rules
- [ ] Document translation key naming

---

## 💡 Pro Tips

1. **Use i18n Ally while coding:**
   - Hover over `$t('key')` to see translation
   - Missing keys are highlighted in red
   - Click to add new translations

2. **Use search in i18n.js:**
   - When adding new keys, search first to avoid duplicates
   - Use consistent naming patterns

3. **Test both languages:**
   - Always test switching between languages
   - Check for layout breaks (Vietnamese text is longer)

4. **Use translation keys in data():**
   ```javascript
   // ❌ Bad
   data() {
     return {
       buttonText: 'Save'  // Hardcoded
     }
   }
   
   // ✅ Good
   computed: {
     buttonText() {
       return this.$t('button.save')  // Reactive to language changes
     }
   }
   ```

---

## 🚨 Common Pitfalls to Avoid

1. **Don't check locale manually:**
   ```javascript
   // ❌ Bad
   const text = this.$i18n.locale === 'vi' ? 'Xin chào' : 'Hello';
   
   // ✅ Good
   const text = this.$t('common.greeting');
   ```

2. **Don't forget dynamic values:**
   ```vue
   <!-- ✅ Good -->
   {{ $t('message.loading', { industry: industry }) }}
   
   <!-- Translation key: -->
   <!-- en: "Analyzing {{industry}}..." -->
   <!-- vi: "Đang phân tích {{industry}}..." -->
   ```

3. **Don't hardcode in computed properties:**
   ```javascript
   // ❌ Bad
   computed: {
     title() {
       return this.$i18n.locale === 'vi' ? 'Tiêu đề' : 'Title';
     }
   }
   
   // ✅ Good
   computed: {
     title() {
       return this.$t('page.title');
     }
   }
   ```

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console for errors
2. Verify `i18n.js` exports correctly
3. Make sure `main.js` imports i18n
4. Check localStorage has 'language' key
5. Use Vue DevTools to inspect `$i18n.locale`

