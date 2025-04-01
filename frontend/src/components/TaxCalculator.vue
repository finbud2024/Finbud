<template>
    <div class="tax-calculator-container">
      <h3>2024 Federal Income Tax Calculator</h3>
  
      <!-- Row with three columns for Income, Location, Filing Status -->
      <div class="row three-columns">
        <!-- Household Income -->
        <div class="column">
          <label for="income">
            Household Income: ${{ income }}
          </label>
          <input
            type="range"
            id="income"
            v-model.number="income"
            :min="minIncome"
            :max="maxIncome"
            step="1000"
          />
        </div>
  
        <!-- Location -->
        <div class="column">
          <label for="location">Location:</label>
          <input
            type="text"
            id="location"
            v-model="location"
            placeholder="City, State"
          />
        </div>
  
        <!-- Filing Status -->
        <div class="column">
          <label for="filingStatus">Filing Status:</label>
          <select id="filingStatus" v-model="filingStatus">
            <option value="single">Single</option>
            <option value="married_joint">Married Filing Jointly</option>
            <option value="head_household">Head of Household</option>
          </select>
        </div>
      </div>
  
      <!-- Advanced Toggle Link -->
      <div class="advanced-toggle" @click="toggleAdvanced">
        <a href="javascript:void(0)">Advanced</a>
      </div>
  
      <!-- Advanced Section (collapsible) -->
      <transition name="fade">
        <div v-if="showAdvanced" class="advanced-section">
          <div class="row four-columns">
            <div class="column">
              <label for="four01k">401(k) Contribution</label>
              <input
                type="number"
                id="four01k"
                v-model.number="four01kContribution"
                placeholder="0"
              />
            </div>
            <div class="column">
              <label for="ira">IRA Contribution</label>
              <input
                type="number"
                id="ira"
                v-model.number="iraContribution"
                placeholder="0"
              />
            </div>
            <div class="column">
              <label for="deductions">Itemized Deductions</label>
              <input
                type="number"
                id="deductions"
                v-model.number="itemizedDeductions"
                placeholder="0"
              />
            </div>
            <div class="column">
              <label for="stateExemptions">Number of State Personal Exemptions</label>
              <input
                type="number"
                id="stateExemptions"
                v-model.number="stateExemptions"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      </transition>
  
      <!-- Calculate Button -->
      <button @click="calculateTax">Calculate Tax</button>
  
      <!-- Results Section -->
      <div class="results">
        <h4>Income Breakdown</h4>
        <div v-if="breakdown.length">
          <div
            v-for="(item, idx) in breakdown"
            :key="idx"
            class="bracket-breakdown"
          >
            Income Range: {{ item.range }},
            Rate: {{ item.rate }},
            Tax: {{ item.amount }}
          </div>
        </div>
        <div v-else>
          <p>No breakdown yet.</p>
        </div>
  
        <h4>2024 Federal Income Tax Comparison</h4>
        <p>{{ comparison }}</p>
  
        <h4>Total Estimated 2024 Tax Burden</h4>
        <p>{{ totalTax }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TaxCalculator",
    data() {
      return {
        // Show/Hide Advanced Section
        showAdvanced: false,
  
        // Basic Inputs
        income: 50000,
        minIncome: 0,
        maxIncome: 200000,
        location: "",
        filingStatus: "single",
  
        // Advanced Inputs
        four01kContribution: 0,
        iraContribution: 0,
        itemizedDeductions: 0,
        stateExemptions: 1,
  
        // Results
        breakdown: [],
        comparison: "",
        totalTax: ""
      };
    },
    methods: {
      toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
      },
      calculateTax() {
        // Convert the 'income' string to a float
        const parsedIncome = parseFloat(this.income) || 0;
  
        // Example bracket data (replace with official 2024 IRS figures)
        const taxBrackets = {
          single: [
            { rate: 0.10, cap: 11000 },
            { rate: 0.12, cap: 44725 },
            { rate: 0.22, cap: 95375 },
            { rate: 0.24, cap: 182100 },
            { rate: 0.32, cap: 231250 },
            { rate: 0.35, cap: 578125 },
            { rate: 0.37, cap: Infinity }
          ],
          married_joint: [
            { rate: 0.10, cap: 22000 },
            { rate: 0.12, cap: 89450 },
            { rate: 0.22, cap: 190750 },
            { rate: 0.24, cap: 364200 },
            { rate: 0.32, cap: 462500 },
            { rate: 0.35, cap: 693750 },
            { rate: 0.37, cap: Infinity }
          ],
          head_household: [
            { rate: 0.10, cap: 15700 },
            { rate: 0.12, cap: 59850 },
            { rate: 0.22, cap: 95350 },
            { rate: 0.24, cap: 182100 },
            { rate: 0.32, cap: 231250 },
            { rate: 0.35, cap: 578100 },
            { rate: 0.37, cap: Infinity }
          ]
        };
  
        // Example standard deductions
        const standardDeductions = {
          single: 13850,
          married_joint: 27700,
          head_household: 20800
        };
  
        // Compute taxable income
        const deduction = standardDeductions[this.filingStatus] || 0;
        let taxableIncome = Math.max(0, parsedIncome - deduction);
  
        // Subtract advanced fields from taxable income if needed
        // e.g., if 401(k) contributions reduce taxable wages:
        // (In actual tax law, 401(k) contributions typically reduce W-2 wages.)
        // This is a simplification for demonstration.
        taxableIncome -= (this.four01kContribution + this.iraContribution);
        taxableIncome -= this.itemizedDeductions;
  
        // Enforce non-negative
        taxableIncome = Math.max(0, taxableIncome);
  
        let tax = 0;
        let previousCap = 0;
        let incomeLeft = taxableIncome;
        const bracketBreakdown = [];
        const brackets = taxBrackets[this.filingStatus] || [];
  
        // Calculate tax by bracket
        for (let i = 0; i < brackets.length; i++) {
          const bracket = brackets[i];
          if (incomeLeft <= 0) break;
  
          let bracketIncome = Math.min(incomeLeft, bracket.cap - previousCap);
          if (bracket.cap === Infinity) {
            bracketIncome = incomeLeft;
          }
  
          const taxForBracket = bracketIncome * bracket.rate;
          tax += taxForBracket;
  
          bracketBreakdown.push({
            range: `$${previousCap.toLocaleString()} - ${
              bracket.cap === Infinity ? "∞" : "$" + bracket.cap.toLocaleString()
            }`,
            rate: `${(bracket.rate * 100).toFixed(0)}%`,
            amount: `$${taxForBracket.toFixed(2)}`
          });
  
          incomeLeft -= bracketIncome;
          previousCap = bracket.cap;
        }
  
        // Update data properties
        this.breakdown = bracketBreakdown;
        this.comparison = `With a taxable income of $${taxableIncome.toLocaleString()}, the tax is computed progressively according to the 2024 brackets for ${this.filingStatus.replace("_", " ")} filers.`;
        this.totalTax = `$${tax.toFixed(2)}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .tax-calculator-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
  }
  
  /* Generic row with flex layout */
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  
  /* Three columns layout */
  .three-columns .column {
    flex: 1;
    min-width: 0;
    margin-right: 10px;
  }
  .three-columns .column:last-child {
    margin-right: 0;
  }
  
  /* Four columns layout for advanced inputs */
  .four-columns .column {
    flex: 1;
    min-width: 0;
    margin-right: 10px;
  }
  .four-columns .column:last-child {
    margin-right: 0;
  }
  
  /* Input fields styling */
  .column label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .column input,
  .column select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  /* Advanced toggle link */
  .advanced-toggle a {
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
  }
  
  /* Fade transition for advanced section */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  /* Results & button styling */
  button {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #007bff;
    border: none;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  .results {
    margin-top: 20px;
  }
  .bracket-breakdown {
    background: #f1f1f1;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 4px;
  }
  </style>
  