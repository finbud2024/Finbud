# Scalable & Dynamic i18n Solution

## 🎯 Goals
1. **Early Initialization** - Load language before any component renders
2. **Independent** - Works without depending on specific components
3. **Scalable** - Easy to add new languages/pages in the future
4. **Developer-Friendly** - Catch hardcoded text automatically
5. **Maintainable** - Organized translation structure

---

## 📋 Solution Architecture

### **1. Fix Initialization (Critical - Do First)**

#### **Current Problem:**
```javascript
// i18n.js - Line 4090
locale: "en"  // ❌ Hardcoded
```

#### **Solution:**
```javascript
// frontend/src/i18n.js
import { createI18n } from "vue-i18n";

// ✅ Load language BEFORE creating i18n instance
const getInitialLocale = () => {
  // Try localStorage first
  const saved = localStorage.getItem("language");
  if (saved && (saved === "en" || saved === "vi")) {
    return saved;
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.split("-")[0];
  if (browserLang === "vi") return "vi";
  
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

// ✅ Sync localStorage on locale change
i18n.global.locale.onChange = (locale) => {
  localStorage.setItem("language", locale);
};

export default i18n;
```

**Benefits:**
- ✅ Language loaded before any component renders
- ✅ Works independently of NavBar
- ✅ Respects browser language on first visit
- ✅ Auto-syncs to localStorage

---

### **2. Create Language Management Composable**

#### **File: `frontend/src/composables/useLanguage.js`**

```javascript
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Composable for language management
 * Provides reactive language utilities
 */
export function useLanguage() {
  const { locale, t, tm } = useI18n();
  
  /**
   * Switch language and persist
   */
  const switchLanguage = (lang) => {
    if (lang === 'en' || lang === 'vi') {
      locale.value = lang;
      localStorage.setItem('language', lang);
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
   * Get translation with fallback
   */
  const translate = (key, params = {}) => {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`);
      return key; // Return key as fallback
    }
  };
  
  /**
   * Get multiple translations at once
   */
  const translateMany = (keys) => {
    return keys.reduce((acc, key) => {
      acc[key] = translate(key);
      return acc;
    }, {});
  };
  
  return {
    // Current state
    currentLanguage,
    isVietnamese,
    isEnglish,
    
    // Methods
    switchLanguage,
    translate,
    translateMany,
    
    // Direct access to vue-i18n
    t,
    tm,
    locale
  };
}
```

**Usage in Components:**
```vue
<script setup>
import { useLanguage } from '@/composables/useLanguage';

const { currentLanguage, switchLanguage, translate, isVietnamese } = useLanguage();

// Reactive to language changes
const buttonText = computed(() => translate('button.save'));
</script>
```

---

### **3. Create Translation Helper Utilities**

#### **File: `frontend/src/utils/translations.js`**

```javascript
/**
 * Translation utilities for dynamic content
 */

/**
 * Get translation by key with type safety
 */
export const getTranslation = (key, params = {}) => {
  // This will be used with $t() or useI18n().t()
  return { key, params };
};

/**
 * Translation key constants (prevents typos)
 */
export const TranslationKeys = {
  // Common
  COMMON: {
    SAVE: 'common.save',
    CANCEL: 'common.cancel',
    DELETE: 'common.delete',
    EDIT: 'common.edit',
    ADD: 'common.add',
    BACK: 'common.back',
    NEXT: 'common.next',
    SEARCH: 'common.search',
  },
  
  // PESTLE Page
  PESTLE: {
    TITLE: 'pestle.title',
    INDUSTRY: 'pestle.industry',
    INDUSTRY_PLACEHOLDER: 'pestle.industryPlaceholder',
    ANALYZE: 'pestle.analyze',
    BACK: 'pestle.back',
    LOADING: 'pestle.loading',
  },
  
  // Add more sections as needed...
};

/**
 * Helper for conditional translations (instead of if/else)
 */
export const getConditionalTranslation = (key, condition) => {
  const conditionalKey = condition 
    ? `${key}.true` 
    : `${key}.false`;
  return conditionalKey;
};
```

**Usage:**
```javascript
import { TranslationKeys, getTranslation } from '@/utils/translations';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Type-safe translation keys
const label = t(TranslationKeys.PESTLE.INDUSTRY);
```

---

### **4. Modularize Translation Files**

Instead of one massive `i18n.js`, split into modules:

#### **Structure:**
```
frontend/src/i18n/
├── index.js              # Main i18n setup
├── locales/
│   ├── en/
│   │   ├── common.js     # Common translations
│   │   ├── pestle.js     # PESTLE page
│   │   ├── account.js    # Accountant page
│   │   ├── realEstate.js # Real estate
│   │   └── ...          # More modules
│   └── vi/
│       ├── common.js
│       ├── pestle.js
│       └── ...
└── utils.js              # Translation utilities
```

#### **Example: `frontend/src/i18n/locales/en/pestle.js`**
```javascript
export default {
  pestle: {
    title: "PESTLE Analysis",
    industry: "Industry",
    industryPlaceholder: "Enter the industry you want to analyze",
    analyze: "Analyze",
    back: "Back",
    loading: "Analyzing industry {{industry}}...",
    // ...
  }
};
```

#### **Example: `frontend/src/i18n/index.js`**
```javascript
import { createI18n } from 'vue-i18n';

// Lazy load translations
const messages = {
  en: {
    ...require('./locales/en/common'),
    ...require('./locales/en/pestle'),
    ...require('./locales/en/account'),
    // ... more imports
  },
  vi: {
    ...require('./locales/vi/common'),
    ...require('./locales/vi/pestle'),
    ...require('./locales/vi/account'),
    // ... more imports
  }
};

// Get initial locale (from localStorage or browser)
const getInitialLocale = () => {
  const saved = localStorage.getItem('language');
  if (saved && ['en', 'vi'].includes(saved)) return saved;
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'vi' ? 'vi' : 'en';
};

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
});

// Auto-sync to localStorage
i18n.global.locale.onChange = (locale) => {
  localStorage.setItem('language', locale);
};

export default i18n;
```

**Benefits:**
- ✅ Easier to find translations
- ✅ Team members can work on different files
- ✅ Smaller bundle size (code splitting possible)
- ✅ Better organization as project grows

---

### **5. ESLint Plugin for Hardcoded Text Detection**

#### **Install:**
```bash
npm install --save-dev eslint-plugin-i18n-ally
# OR use vue/no-v-text-v-html-on-component (built-in)
```

#### **Create: `frontend/.eslintrc.js` (or extend existing)**
```javascript
module.exports = {
  rules: {
    // Warn about Vietnamese characters in strings
    'no-hardcoded-vi': 'warn',
    
    // Or use regex in custom rule
    'no-literal-string': ['warn', {
      ignore: ['className', 'aria-label'], // Allow in specific props
    }],
  },
  plugins: ['vue'],
};
```

#### **Custom ESLint Rule: `frontend/eslint-rules/no-hardcoded-vi.js`**
```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded Vietnamese text',
    },
  },
  create(context) {
    return {
      Literal(node) {
        const value = node.value;
        if (typeof value === 'string' && /[À-ỹ]/.test(value)) {
          context.report({
            node,
            message: 'Hardcoded Vietnamese text detected. Use $t() instead.',
          });
        }
      },
    };
  },
};
```

---

### **6. Translation Management Services (Optional but Recommended)**

#### **Option A: Crowdin** (Recommended for teams)
- **Free tier:** Up to 15,000 strings
- **Features:**
  - Automatic extraction from code
  - Team collaboration
  - Translation memory
  - Integration with GitHub/GitLab
- **Setup:** `npm install @crowdin/cli`

#### **Option B: Lokalise**
- **Free tier:** 2,000 strings
- Similar features to Crowdin

#### **Option C: i18next (with i18n-ally)**
- **Free, open-source**
- VS Code extension: `i18n Ally`
- Auto-detects translation keys
- Shows missing translations

#### **Recommended: i18n Ally (VS Code Extension)**
```bash
# Install VS Code extension: "i18n Ally"
# No npm package needed - works with vue-i18n automatically
```

**Features:**
- ✅ Detects hardcoded strings
- ✅ Shows missing translations
- ✅ Inline translation editor
- ✅ Translation progress per file
- ✅ Auto-complete for translation keys

---

### **7. Create Migration Script**

#### **File: `frontend/scripts/migrate-to-translations.js`**

```javascript
/**
 * Script to help migrate hardcoded text to translations
 * Scans files and suggests translation keys
 */

const fs = require('fs');
const path = require('path');

function findHardcodedVietnamese(dir) {
  const files = [];
  
  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Match Vietnamese characters
      if (/[À-ỹ]/.test(line)) {
        files.push({
          file: filePath,
          line: index + 1,
          content: line.trim(),
        });
      }
    });
  }
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.vue')) {
        scanFile(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return files;
}

// Run scan
const problematic = findHardcodedVietnamese('./src');
console.log(`Found ${problematic.length} files with hardcoded Vietnamese:`);
problematic.forEach(item => {
  console.log(`  ${item.file}:${item.line} - ${item.content.substring(0, 50)}...`);
});
```

---

## 🚀 Implementation Plan (Phased Approach)

### **Phase 1: Critical Fixes (Week 1)**
1. ✅ Fix `i18n.js` initialization (load from localStorage)
2. ✅ Create `useLanguage` composable
3. ✅ Update NavBar to use composable
4. ✅ Test language persistence

### **Phase 2: Migration Tools (Week 2)**
1. ✅ Install i18n Ally VS Code extension
2. ✅ Set up ESLint rules
3. ✅ Create migration script
4. ✅ Document translation key naming convention

### **Phase 3: Modularize (Week 3-4)**
1. ✅ Split `i18n.js` into modules
2. ✅ Migrate one page at a time
3. ✅ Start with high-priority pages (PestlePage, AccountantPage)

### **Phase 4: Long-term (Ongoing)**
1. ✅ Enforce translation usage in code reviews
2. ✅ Consider Crowdin/Lokalise if team grows
3. ✅ Add translation tests

---

## 📝 Translation Key Naming Convention

### **Structure:** `feature.section.item`

**Examples:**
```javascript
// Good ✅
'pestle.form.industry'
'pestle.form.analyzeButton'
'accountant.chat.welcome'
'accountant.notifications.taxDue'

// Bad ❌
'industry'  // Too generic
'btn1'     // Not descriptive
'text'     // Not specific
```

### **Naming Rules:**
1. Use lowercase with dots as separators
2. Start with feature name (pestle, accountant, goal)
3. Group related items (form, button, message)
4. Be descriptive but concise

---

## 🔧 Quick Setup Checklist

### **Immediate (30 minutes):**
- [ ] Fix `i18n.js` initialization
- [ ] Create `useLanguage` composable
- [ ] Test language switching persists across page reloads

### **Short-term (2-3 days):**
- [ ] Install i18n Ally VS Code extension
- [ ] Set up ESLint rules
- [ ] Create translation utility file
- [ ] Migrate 1-2 high-priority pages

### **Long-term (ongoing):**
- [ ] Migrate remaining pages incrementally
- [ ] Set up translation management service (if team grows)
- [ ] Add translation coverage tests

---

## 💡 Best Practices

### **1. Always Use Translation Keys**
```vue
<!-- ✅ Good -->
<button>{{ $t('button.save') }}</button>

<!-- ❌ Bad -->
<button>Save</button>
<button>Lưu</button>
```

### **2. Use Composable in Setup**
```vue
<script setup>
import { useLanguage } from '@/composables/useLanguage';

const { translate, currentLanguage } = useLanguage();

// ✅ Reactive
const title = computed(() => translate('page.title'));
</script>
```

### **3. Avoid Conditional Logic**
```javascript
// ❌ Bad
const message = this.$i18n.locale === 'vi' ? 'Xin chào' : 'Hello';

// ✅ Good
const message = this.$t('common.greeting');
```

### **4. Use Translation Keys Constants**
```javascript
// ✅ Type-safe
import { TranslationKeys } from '@/utils/translations';
const label = t(TranslationKeys.PESTLE.INDUSTRY);
```

---

## 🎯 Expected Outcomes

After implementation:

1. **Language loads immediately** - No flash of wrong language
2. **Works independently** - No dependency on NavBar mounting
3. **Easy to maintain** - Organized, modular structure
4. **Catches errors early** - ESLint prevents hardcoded text
5. **Scalable** - Easy to add new languages/pages
6. **Developer experience** - i18n Ally makes translations visible

---

## 📚 Additional Resources

- **Vue I18n Docs:** https://vue-i18n.intlify.dev/
- **i18n Ally Extension:** https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally
- **Crowdin:** https://crowdin.com/
- **Translation Best Practices:** https://phrase.com/blog/posts/15-best-practices-for-i18n/

