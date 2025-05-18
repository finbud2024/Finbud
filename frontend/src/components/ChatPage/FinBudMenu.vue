<template>
  <div class="finbud-menu">
    <p class="menu-title">FinBud Menu</p>

    <div class="menu-section">
      <button class="menu-btn" @click="$emit('navigate', '/about')">{{ $t("about") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/tech')">{{ $t("technology") }}</button>
    </div>

    <div class="menu-section">
      <div class="section-title">{{$t("finManage")}}</div>
      <button class="menu-btn" @click="$emit('navigate', '/goal')">{{ $t("goal") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/riskanalysis')">{{ $t("riskAnalysis") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/investment-calculator')">{{ $t("investmentCalculator") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/mortgage-calc')">{{ $t("mortgageCalculator") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/super-investors')">{{ $t("superInvestors") }}</button>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ $t("finInvest") }}</div>
      <button class="menu-btn" @click="$emit('navigate', '/stock-simulator')">{{ $t("simulator") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/autotrade-ai')">AutoTrade AI</button>
      <button class="menu-btn" @click="$emit('navigate', '/quant-analysis')">{{ $t("quant") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/quant-simulator')">{{ $t("quantSimulator") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/docs')">{{ $t("finData") }}</button>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ $t("finEdu") }}</div>
      <button class="menu-btn" @click="$emit('navigate', '/quizz')">{{ $t("quiz") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/event')">{{ $t("event") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/forum')">{{ $t("forum") }}</button>
      <button class="menu-btn" @click="$emit('navigate', '/course')">{{ $t("course") }}</button>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ $t("finAgent") }}</div>
      <button class="menu-btn" @click="$emit('navigate', '/agent')">{{ $t("agent") }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinBudMenu"
};
</script>

<style scoped>
.finbud-menu {
  padding: 24px 18px;
  max-width: 250px;
  width: 100%;
}

.menu-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-primary, #222);
}

.menu-section {
  margin-bottom: 18px;
}

.section-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--accent-color, #737475);
  margin-bottom: 6px;
  margin-top: 10px;
  font-style: bold;
}

.menu-btn {
  display: block;
  width: 100%;
  margin: 4px 0;
  margin-left: 10px;
  padding: 10px 0 10px 10px;
  background: var(--bg-secondary, #f5f7fa);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-primary, #222);
  text-align: left;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}

.menu-btn:hover {
  background: var(--accent-color, #808181);
  color: #fff;
}
</style>