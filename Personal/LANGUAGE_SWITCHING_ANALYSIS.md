# Language Switching Analysis - Complete Walkthrough

## 📋 Table of Contents
1. [How Language Switching Works (Flow Diagram)](#how-language-switching-works)
2. [File-by-File Logic Walkthrough](#file-by-file-logic-walkthrough)
3. [Problematic Files Identified](#problematic-files-identified)
4. [Categories of Problems](#categories-of-problems)

---

## 🔄 How Language Switching Works

### **Current Flow:**

```
1. App Starts
   ↓
2. main.js loads i18n.js
   ↓
3. i18n.js creates i18n instance with locale: "en" (HARDCODED)
   ↓
4. App.vue mounts → NavBar mounts
   ↓
5. NavBar.mounted() reads localStorage.getItem("language")
   ↓
6. If found, sets this.$i18n.locale = savedLang
   ↓
7. User clicks language switcher → switchLanguage(lang)
   ↓
8. Updates this.$i18n.locale AND saves to localStorage
   ↓
9. Components using $t() reactively update
   ↓
10. Components with hardcoded text DON'T update ❌
```

---

## 📁 File-by-File Logic Walkthrough

### **1. Language Configuration & Initialization**

#### `frontend/src/i18n.js` (Lines 4088-4096)
```javascript
const i18n = createI18n({
  legacy: false,
  locale: "en",           // ⚠️ PROBLEM: Hardcoded, not from localStorage
  fallbackLocale: "vi",
  messages,               // Contains en: {...} and vi: {...} translations
  globalInjection: true,  // Makes $t() available globally
});

export default i18n;
```

**Issue:** The locale starts as "en" regardless of what's saved in localStorage. The language is only restored when NavBar mounts (later in the lifecycle).

---

#### `frontend/src/main.js` (Line 41, 130)
```javascript
import i18n from "./i18n";  // Import the i18n instance
// ...
app.use(i18n);             // Register i18n plugin globally
```

**Logic:** Vue-i18n is registered globally, making `$t()` available in all components via `this.$t()` or `{{ $t() }}` in templates.

---

### **2. Language Restoration on App Start**

#### `frontend/src/App.vue`
**Location:** Main app component, wraps everything

**Issue Found:** ❌ **App.vue does NOT restore language from localStorage**
- Dark mode is restored (lines 42-48, 133-146)
- Language is NOT restored here

**Impact:** Language only gets restored when NavBar mounts, which may be after some pages have already rendered.

---

#### `frontend/src/components/Basic/NavBar.vue`

**Line 463-464 (mounted hook):**
```javascript
mounted() {
  // ... other code ...
  
  const savedLang = localStorage.getItem("language");
  if (savedLang) this.$i18n.locale = savedLang;  // ✅ Restores language
  
  // ... rest of code ...
}
```

**Line 348-351 (switchLanguage method):**
```javascript
switchLanguage(lang) {
  this.$i18n.locale = lang;                    // Update current locale
  localStorage.setItem("language", lang);      // Save for future sessions
}
```

**Lines 192-197 (UI buttons):**
```vue
<div class="language-switcher">
  <button @click="switchLanguage('en')">
    <img src="@/assets/us.png" alt="English" />
  </button>
  <button @click="switchLanguage('vi')">
    <img src="@/assets/vn.png" alt="Tiếng Việt" />
  </button>
</div>
```

**Logic:** 
- ✅ Language switcher works correctly
- ⚠️ Language restoration happens too late (only when NavBar mounts)

---

### **3. How Components Use Translations**

#### **Correct Usage:**
```vue
<template>
  <div>{{ $t("login") }}</div>          <!-- Template syntax -->
</template>

<script>
export default {
  methods: {
    someMethod() {
      const text = this.$t("login");     // Component syntax
    }
  }
}
</script>
```

#### **Incorrect Usage (Hardcoded Text):**
```vue
<template>
  <div>Ngành</div>                      <!-- ❌ Hardcoded Vietnamese -->
  <div>Login</div>                       <!-- ❌ Hardcoded English -->
</template>
```

---

## 🚨 Problematic Files Identified

### **Category 1: Hardcoded Vietnamese Text (No Translations)**

#### **1. `frontend/src/views/FinAgent/PestlePage.vue`**
**Problems:**
- **Line 30:** `<label>Ngành<span>*</span></label>` ← Hardcoded Vietnamese
- **Line 31:** `placeholder="Nhập ngành bạn muốn phân tích"` ← Hardcoded Vietnamese
- **Line 37:** `Phân tích →` ← Hardcoded Vietnamese button text
- **Line 47:** `Quay lại` ← Hardcoded Vietnamese button text
- **Also:** All English text (lines 4, 8-24) is hardcoded, no `$t()`

**Impact:** This entire page doesn't switch languages at all.

---

#### **2. `frontend/src/components/PestlePage/Pestle.vue`**
**Problems:**
- **Line 18:** `<h2>Đầu vào từ người dùng</h2>` ← Hardcoded Vietnamese
- **Line 25:** `Ngành đã chọn` ← Hardcoded Vietnamese label
- **Line 35:** `Đang phân tích ngành {{ industry }}...` ← Hardcoded Vietnamese loading text
- **Line 43:** `'Phân tích ' + getTranslatedTitle(category)` ← Partially translated

**Impact:** Major component used by PestlePage.vue has mixed hardcoded text.

---

#### **3. `frontend/src/views/FinXpert/AccountantPage.vue`**
**Problems:**
- **Lines 1369-1401:** Notification data with hardcoded Vietnamese:
  - `'Hạn Nộp Thuế'`, `'Phân tích Q4 đã sẵn sàng để xem'`, etc.
- **Lines 1405-1417:** Chat messages hardcoded in Vietnamese:
  - `'Xin chào! Tôi là trợ lý AI FinXpert...'`
- **Lines 1420-1426:** Quick suggestions array all in Vietnamese:
  - `'Phân tích báo cáo thu nhập'`, `'Tối ưu hóa thuế cho Q4'`, etc.
- **Lines 1430-1433:** Processing steps in Vietnamese:
  - `'Tải lên tài liệu'`, `'Trích xuất dữ liệu'`, `'Phân tích AI'`, etc.

**Impact:** All UI notifications, chatbot messages, and suggestions are hardcoded Vietnamese.

---

#### **4. `frontend/src/views/FinInvest/StockSimulatorCodeSaved.vue`**
**Problems:**
- **Line 789:** `"Tôi không thấy cổ phiếu nào..."` ← Hardcoded Vietnamese message
- **Line 796:** `"Đang phân tích danh mục đầu tư..."` ← Hardcoded Vietnamese loading text
- **Line 817:** System prompt partially in Vietnamese
- **Line 864:** Error message in Vietnamese HTML: `"Không thể tạo thông tin chi tiết..."`
- **Line 818:** User prompt in Vietnamese

**Impact:** Portfolio bot messages don't switch languages.

**Note:** This file also checks `this.$i18n.locale` (lines 788, 795, 811, 863) but uses hardcoded strings instead of `$t()`.

---

#### **5. `frontend/src/views/FinInvest/MacroEconomicData.vue`**
**Problems:**
- **Line 25:** `selectedTable !== 'Tổng quan'` ← Hardcoded Vietnamese table name
- **Line 204:** Table names array: `['Tổng quan', 'GDP', 'FDI', 'CPI', 'Xuất-Nhập khẩu']`
- **Line 210:** Mapping `'Xuất-Nhập khẩu': 'importExport'` ← Vietnamese key in code

**Impact:** Table selection and filtering use hardcoded Vietnamese strings.

**Mixed Usage:** Some parts use `$t()` (lines 31-33) but table names are hardcoded.

---

#### **6. `frontend/src/views/FinManage/MortgageCalculatorPage.vue`**
**Problems:**
- **Line 323:** System prompt contains Vietnamese text when locale is Vietnamese
- **Lines 318-369:** Conditional logic based on `this.$i18n.locale` but hardcoded strings in prompts

**Impact:** AI prompts switch but should use translation keys.

**Note:** This file uses `$t()` for UI but hardcodes prompt text.

---

#### **7. `frontend/src/views/FinEdu/EventPage.vue`**
**Problems:**
- **Line 370:** Comment in Vietnamese: `// Thêm beforeDestroy cho Vue 2 compatibility`
- **Grep results:** Contains Vietnamese text patterns but need to verify template usage

**Impact:** Needs verification - may have hardcoded text in template.

---

#### **8. `frontend/src/components/FinXpert/RealEstate/*.vue` (Multiple files)**
**Files:**
- `RentBuyCalculator.vue`
- `InvestmentCalculator.vue`
- `AssetMap.vue`
- `NotesSection.vue`

**Impact:** Real estate components have hardcoded Vietnamese text (from grep results).

---

### **Category 2: Files Checking Locale But Not Using Translations**

These files check `this.$i18n.locale` but use conditional hardcoded strings instead of `$t()`:

1. **`frontend/src/views/FinInvest/StockSimulatorCodeSaved.vue`**
   - Checks locale (lines 788, 795, 811, 863, 1908)
   - Uses ternary operators with hardcoded strings instead of `$t()`

2. **`frontend/src/views/FinManage/MortgageCalculatorPage.vue`**
   - Checks locale (lines 318, 369, 598)
   - Uses conditional prompts instead of translation keys

3. **`frontend/src/components/ChatPage/ChatComponent.vue`**
   - Line 75: Passes locale as prop: `:lan="this.$i18n.locale"`
   - Line 1549: Checks locale but uses conditional logic

4. **`frontend/src/components/DraggableChatBubble.vue`**
   - Line 405: `responses[this.$i18n.locale]` ← Uses locale to index object
   - Line 424: Similar pattern

**Issue:** These patterns work but are fragile - better to use `$t()` for consistency.

---

### **Category 3: Timing Issues**

**Problem:** Language is restored too late in the component lifecycle.

**Files affected:**
- Any component that mounts before `NavBar.vue`
- Components that don't include NavBar

**Current order:**
1. `App.vue` mounts
2. `i18n` initializes with `locale: "en"` (hardcoded)
3. Child components render (may use wrong language)
4. `NavBar.vue` mounts and restores language
5. Components that use `$t()` reactively update ✅
6. Components with hardcoded text stay in English ❌

---

## 📊 Summary Statistics

- **Total Vue files:** ~224 files
- **Files using `$t()`:** 33 files (15% of Vue files)
- **Files with hardcoded Vietnamese:** 17+ files identified
- **Files checking locale manually:** 9 files
- **Main translation file:** `frontend/src/i18n.js` (4097 lines)

---

## 🎯 Root Causes

1. **Late Language Restoration:** Language only restored in NavBar.mounted(), not in i18n initialization
2. **Hardcoded Text:** Many components have Vietnamese/English text directly in templates/data
3. **Conditional Logic:** Some files check locale but use ternaries instead of translation keys
4. **Missing Translation Keys:** Some text may not have corresponding keys in i18n.js

---

## 🔍 Next Steps for Verification

To identify ALL problematic files, you can:

1. **Search for Vietnamese characters in Vue files:**
   ```bash
   grep -r "[À-ỹ]" frontend/src/views frontend/src/components --include="*.vue"
   ```

2. **Search for common Vietnamese words:**
   ```bash
   grep -r "Ngành\|Nhập\|Phân tích\|Quay lại\|Xóa\|Thêm\|Lưu" frontend/src --include="*.vue"
   ```

3. **Check files NOT using $t():**
   ```bash
   # Find Vue files
   find frontend/src -name "*.vue" -type f > vue_files.txt
   
   # Find files using $t()
   grep -l "\$t(" frontend/src --include="*.vue" > using_translations.txt
   
   # Compare to find files NOT using translations
   ```

---

## 📝 Notes

- Files that use `$t()` correctly will automatically switch when `$i18n.locale` changes (reactive)
- Files with hardcoded text need to be manually updated to use `$t()`
- Some files mix both approaches (partially translated)

