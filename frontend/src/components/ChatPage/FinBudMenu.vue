<template>
  <div class="finbud-menu">
    <p class="menu-title">FinBud Menu</p>

    <div class="menu-section">
      <div class="section-title">{{$t("overview")}}</div>
      <router-link class="menu-btn" to="/about">{{ $t("about") }}</router-link>
      <router-link class="menu-btn" to= "/tech">{{ $t("technology") }}</router-link>
    </div>

    <div class="menu-section">
      <div class="section-title">{{$t("finManage")}}</div>
      <router-link class="menu-btn" to="/goal">{{ $t("goal") }}</router-link>
      <router-link class="menu-btn" to="/market-data-center">{{ $t("riskAnalysis") }}</router-link>
      <router-link class="menu-btn" to="/investment-calculator">{{ $t("investmentCalculator") }}</router-link>
      <router-link class="menu-btn" to="/mortgage-calc">{{ $t("mortgageCalculator") }}</router-link>
      <router-link class="menu-btn" to="/super-investors">{{ $t("superInvestors") }}</router-link>
      <router-link class="menu-btn" to="/fin-compare">{{ $t("ProductComparison") }}</router-link>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ $t("finInvest") }}</div>
      <router-link class="menu-btn" to="/stock-simulator">{{ $t("simulator") }}</router-link>
      <router-link class="menu-btn" to="/predictive-calculator">{{ $t("predictiveCalc") }}</router-link>
      <router-link class="menu-btn" to="/autotrade-ai">AutoTrade AI</router-link>
      <router-link class="menu-btn" to="/quant-analysis">{{ $t("quant") }}</router-link>
      <router-link class="menu-btn" to="/quant-simulator">{{ $t("quantSimulator") }}</router-link>
      <router-link class="menu-btn" to="/fund-letter">{{ $t("fundLetters") }}</router-link>
      <router-link class="menu-btn" to="/docs/:ticker">{{ $t("finData") }}</router-link>
      <router-link class="menu-btn" to="/macro-economic">{{ $t("macroEconomic") }}</router-link>
      <router-link class="menu-btn" to="/market-analysis">{{ $t("marketAnalysis") }}</router-link>
      <router-link class="menu-btn" to="/blog">Blog</router-link>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ $t("finEdu") }}</div>
      <router-link class="menu-btn" to="/quizz">{{ $t("quiz") }}</router-link>
      <router-link class="menu-btn" to="/event">{{ $t("event") }}</router-link>
      <router-link class="menu-btn" to="/create-roadmap">{{ $t("generateButton") }}</router-link>
      <router-link class="menu-btn" to="/course">{{ $t("course") }}</router-link>

    </div>

    <div class="menu-section">
      <div class="section-title">{{ $t("finAgent") }}</div>
      <router-link class="menu-btn" to="/agent/">{{ $t("agent") }}</router-link>
      <router-link class="menu-btn" to="/pestle/">{{ $t("pestle") }}</router-link>
      <router-link class="menu-btn" to="/ai-workflows">AI Workflows</router-link>
      <router-link class="menu-btn" to="/ai-breakthrough-workflows">AI Breakthrough Workflows</router-link>
    </div>

    <div class="menu-section">
      <div class="section-title">AI Hedge Fund Laboratory</div>
      <router-link class="menu-btn" to="/ai-hedge-fund-lab">AI Hedge Fund Laboratory</router-link>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ $t("finXpert") }}</div>
      <router-link class="menu-btn" to="/finxpert-real-estate">Real Estate Analysist</router-link>
      <router-link class="menu-btn" to="/finxpert-equity">Equity Researcher</router-link>
      <router-link class="menu-btn" to="/finxpert-accountant">AI Accountant</router-link>
      <router-link class="menu-btn" to="/ai-finance-workflows">AI Finance Workflows</router-link>
      <router-link class="menu-btn" to="/private-equity-deal-scout">Private Equity Deal Scout</router-link>
    </div>

    <div class="menu-section">
      <div class="section-title">FinVerse</div>
      <router-link class="menu-btn" to="/forum">FinVerse</router-link>
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