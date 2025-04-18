
<template>
    <div class="tax-calculator">
      <!-- Header -->
      <header class="header">
        <h1>Federal Income Tax Calculator - Estimator for Taxes</h1>
      </header>
  
      <main class="container">
        <!-- Overview Section -->
        <section class="overview-section">
          <div class="overview-text">
            <h2>Overview of Federal Income Taxes</h2>
            <p>
              Income in America is taxed by the federal government, most state
              governments and many local governments. The federal income tax
              system is progressive, so the rate of taxation increases as
              income increases. Marginal tax rates range from 10% to 37%.
            </p>
          </div>
          <div class="overview-map">
            <img :src="require('@/assets/us_map.webp')" alt="US Map" />
          </div>
        </section>
  
      <main class="container">
        <!-- Calculator Form Section -->
        <section class="calculator-form">
          <h3>Enter your financial details to calculate your taxes:</h3>
          <form @submit.prevent="calculateTaxes">
            <!-- First row: Main fields -->
            <div class="row">
              <div class="col">
                <label for="income">
                  Household Income: ${{ income.toLocaleString() }}
                </label>
                <input
                  type="range"
                  id="income"
                  v-model="income"
                  :min="0"
                  :max="500000"
                  :step="1000"
                />
              </div>
              <div class="col">
                <label for="location">Location</label>
                <select id="location" v-model="location">
                  <option value="Alabama">Alabama</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Arkansas">Arkansas</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Delaware">Delaware</option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Idaho">Idaho</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Iowa">Iowa</option>
                  <option value="Kansas">Kansas</option>
                  <option value="Kentucky">Kentucky</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Maine">Maine</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Missouri">Missouri</option>
                  <option value="Montana">Montana</option>
                  <option value="Nebraska">Nebraska</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New Hampshire">New Hampshire</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="New York">New York</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="North Dakota">North Dakota</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Oklahoma">Oklahoma</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="South Carolina">South Carolina</option>
                  <option value="South Dakota">South Dakota</option>
                  <option value="Tennessee">Tennessee</option>
                  <option value="Texas">Texas</option>
                  <option value="Utah">Utah</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Washington">Washington</option>
                  <option value="West Virginia">West Virginia</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="Wyoming">Wyoming</option>
                </select>
              </div>
              <div class="col">
                <label for="filing-status">Filing Status</label>
                <select id="filing-status" v-model="filingStatus">
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Head of Household">Head of Household</option>
                </select>
              </div>
            </div>
  
            <!-- Advanced Toggle -->
            <div class="advanced-toggle-container">
              <div class="advanced-toggle" @click="toggleAdvanced">
                {{ showAdvanced ? 'Advanced ▲' : 'Advanced ▼' }}
              </div>
            </div>
  
            <!-- Second row: Advanced fields -->
            <transition name="fade">
              <div class="row advanced-section" v-if="showAdvanced">
                <div class="col">
                  <label for="contribution-401k">401(k) Contribution</label>
                  <input
                    type="number"
                    id="contribution-401k"
                    v-model="contribution401k"
                    placeholder="$0"
                  />
                </div>
                <div class="col">
                  <label for="contribution-ira">IRA Contribution</label>
                  <input
                    type="number"
                    id="contribution-ira"
                    v-model="contributionIra"
                    placeholder="$0"
                  />
                </div>
                <div class="col">
                  <label for="itemized-deductions">Itemized Deductions</label>
                  <input
                    type="number"
                    id="itemized-deductions"
                    v-model="itemizedDeductions"
                    placeholder="$0"
                  />
                </div>
                <div class="col">
                  <label for="state-exemptions">Number of State Personal Exemptions</label>
                  <input
                    type="number"
                    id="state-exemptions"
                    v-model="stateExemptions"
                    placeholder="2"
                  />
                </div>
              </div>
            </transition>
  
            <!-- Button Row -->
            <div class="button-row">
              <button type="button" class="calculate-button" @click="calculateTaxes">
                Calculate
              </button>
            </div>
          </form>
  
          <!-- Result Section -->
          <div class="result-container" v-if="taxResult !== null">
            <p class="result-text">
              Your 2024 Federal Income Tax Plus FICA:
              <span class="result-amount">
                ${{ taxResult.toLocaleString() }}
              </span>
            </p>
  
            <!-- Breakdown Table -->
            <div class="breakdown-table-container" v-if="taxBreakdownDetails.length">
              <h4>Your Income Taxes Breakdown</h4>
              <table class="breakdown-table">
                <thead>
                  <tr>
                    <th>Tax Type</th>
                    <th>Marginal Tax Rate</th>
                    <th>Effective Tax Rate</th>
                    <th>2024 Taxes*</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in taxBreakdownDetails"
                    :key="index"
                    :class="{ 'total-row': row.type === 'Total Income Taxes' }"
                  >
                    <td>{{ row.type }}</td>
                    <td>{{ row.marginalRate }}</td>
                    <td>{{ row.effectiveRate }}</td>
                    <td>{{ row.yearTaxes }}</td>
                  </tr>
                </tbody>
              </table>
              <p class="footnote">
                * These are the taxes owed for the 2024 - 2025 filing season.
              </p>
            </div>
          </div>
        </section>
      </main>
  
        <!-- Dashboards -->
        <section class="dashboard-container" v-if="taxResult !== null">
          <!-- 1) Bar Chart + Dynamic Description Side by Side -->
          <div class="bar-chart-comparison">
            <!-- Left Column: Bar Chart -->
            <div class="bar-chart-col">
              <h4>Your 2024 Federal Income Tax Comparison</h4>
              <canvas ref="barChartCanvas"></canvas>
            </div>
            <!-- Right Column: Dynamic Text Description -->
            <div class="bar-chart-desc-col">
              <p>
                Your marginal federal income tax rate changed from 
                <strong>{{ lastYearMarginalRate }}%</strong> in 2023 to 
                <strong>{{ thisYearMarginalRate }}%</strong> in 2024.
              </p>
              <p>
                Your effective federal income tax rate changed from 
                <strong>{{ lastYearEffectiveRate }}%</strong> to 
                <strong>{{ thisYearEffectiveRate }}%</strong>.
              </p>
              <p>
                Your federal income taxes changed from 
                <strong>\${{ lastYearTaxes.toLocaleString() }}</strong> to 
                <strong>\${{ thisYearTaxes.toLocaleString() }}</strong>.
              </p>
            </div>
          </div>
  
          <!-- 2) Pie Chart + Tax Burden Breakdown -->
          <div class="tax-burden-comparison">
            <!-- Left Column: Tax Breakdown -->
            <div class="tax-burden-left-col">
              <h4>Total Estimated 2024 Tax Burden</h4>
              <div class="tax-item">
                <span class="label">Income Tax</span>
                <span class="value">${{ incomeTax.toLocaleString() }}</span>
              </div>
              <div class="tax-item">
                <span class="label">Sales Tax</span>
                <span class="value">${{ salesTax.toLocaleString() }}</span>
              </div>
              <div class="tax-item">
                <span class="label">Fuel Tax</span>
                <span class="value">${{ fuelTax.toLocaleString() }}</span>
              </div>
              <div class="tax-item">
                <span class="label">Property Tax</span>
                <span class="value">${{ propertyTax.toLocaleString() }}</span>
              </div>
              <hr class="divider" />
              <div class="tax-item total">
                <span class="label">Total Estimated Tax Burden</span>
                <span class="value">${{ totalTaxBurden.toLocaleString() }}</span>
              </div>
              <p class="tax-percentage">
                Percent of income to taxes =
                <span class="highlight">{{ taxPercentage }}%</span>
              </p>
            </div>
            <!-- Right Column: Pie Chart -->
            <div class="tax-burden-chart-col">
              <canvas ref="pieChartCanvas"></canvas>
            </div>
          </div>
        </section>
  
        <!-- ===== New Content Section: Post-Graphs ===== -->
        <section class="post-graphs-content">
          <h2 v-slide-in:left>The Federal Income Tax: How Are You Taxed?</h2>
          
          <!-- Paragraph Section -->
          <div class="tax-paragraph" v-slide-in:right style="margin-top: 1rem;">
            <p>
              The U.S. federal personal income tax, administered by the IRS, is the largest source of government revenue, with tax rates ranging from 10% to 37%. Taxpayers can reduce their tax liability through deductions and credits, and most people pay taxes through payroll withholding.
            </p>
          </div>
          
          <!-- Federal Income Tax: W-2 Employees -->
          <div v-slide-in:left style="margin-top: 1rem;">
            <h3>Federal Income Tax: W-2 Employees</h3>
            <div class="tax-paragraph1">
              <p>
                W-2 employees receive tax forms from their employers that report their salary and the withheld payroll taxes, including Social Security, Medicare, and income taxes. The FICA tax, which funds Social Security and Medicare, is 15.3% of wages and is split equally between the employer and employee.
              </p>
            </div>
          </div>
          
          <!-- Federal Income Tax: 1099 Employees -->
          <div v-slide-in:right style="margin-top: 1rem;">
            <h3>Federal Income Tax: 1099 Employees</h3>
              <div v-slide-in:left style="margin-top: 1rem;">
                <p>
                  Independent contractors (1099 workers) are responsible for their own federal payroll taxes, including the full 15.3% FICA tax, unlike W-2 employees who split this tax with their employers. Employers must send 1099 forms to contractors paid over $600 in a tax year. A financial advisor can assist with understanding taxes and financial goals, and SmartAsset offers a free tool to match individuals with advisors.
                </p>
            </div>
          </div>
  
          <div v-slide-in:right style="margin-top: 1rem;">
            <h3>Calculating the Federal Income Tax Rate</h3>
              <div v-slide-in:left style="margin-top: 1rem;">
                <p>
                  The United States has a progressive income tax system. This means there are higher tax rates for higher income levels. These are called “marginal tax rates," meaning they do not apply to total income, but only to the income within a specific range. These ranges are referred to as brackets.              </p>
            </div>
          </div>
          
          
          <!-- Continue with remaining content as needed -->
        </section>
        <div class="bubble-chat">
          <BubbleChat />
        </div>
      </main>
  
  
      <!-- Footer -->
      <footer class="footer">
        <p>© 2025 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <!-- Normal script block for directive registration -->
  <script>
  
  import ChatHeader from './ChatHeader.vue';
  import MessageComponent from './MessageComponent.vue';
  import ChatFrame from './ChatFrame.vue';
  import UserInput from './UserInput.vue';
  import BubbleChat from './chatbox.vue';
  
  
  export default {
    name: 'TaxCalculator',
    components: {
      ChatHeader,
      MessageComponent,
      ChatFrame,
      UserInput,
      BubbleChat, // If needed, add the full tax chat functionality here
    },
    data() {
      return {
        userName: 'John Doe', // Example user name, can be dynamic
        taxSummary: {
          amount: 2500, // Example tax amount
          income: 60000, // Example income
        },
        filingStatus: 'Married', // Example filing status
        suggestions: [
          'Consider contributing to a 401(k) to reduce your taxable income.',
          'Look into tax deductions for education-related expenses.',
        ],
        taxBreakdownDetails: [
          { type: 'Federal Income Tax', yearTaxes: 1500 },
          { type: 'State Tax', yearTaxes: 500 },
          { type: 'FICA', yearTaxes: 300 },
        ],
        messages: [],
        botAvatar: require('@/assets/bot.png'),
        profileImage: 'path_to_profile_image', // This can be fetched from user data or default
        profileName: 'User',
        currentThread: {},
        newMessage: '',
      };
    },
    created() {
      this.loadStateTaxCalculators();
    },
    methods: {
      loadStateTaxCalculators() {
        fetch('/state_tax_calculators.json')
          .then(response => response.json())
          .then(data => {
            this.stateTaxCalculators = data;
          })
          .catch(error => {
            console.error('Error loading state tax calculators:', error);
          });
      },
  
      toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
      },
  
      calculateTaxes() {
        // Fetch the tax brackets based on the state and filing status
        const taxBracketData = this.getTaxBracketsForStateAndFilingStatus();
  
        // Calculate tax based on income, filing status, and brackets
        let taxableIncome = this.income - (this.contribution401k + this.contributionIra + this.itemizedDeductions);
        let totalTax = 0;
  
        // Apply the tax brackets
        for (let i = 0; i < taxBracketData.length; i++) {
          if (taxableIncome > taxBracketData[i].income) {
            const taxableAtRate = taxableIncome - taxBracketData[i].income;
            totalTax += taxableAtRate * taxBracketData[i].rate;
            taxableIncome = taxBracketData[i].income;
          }
        }
  
        this.taxResult = totalTax; // Save the result
  
        // Build the tax breakdown for the table
        this.taxBreakdownDetails = [
          { type: 'Federal Income Tax', marginalRate: '25%', effectiveRate: '20%', yearTaxes: `$${totalTax.toLocaleString()}` },
          { type: 'Total Taxes', marginalRate: '', effectiveRate: '', yearTaxes: `$${totalTax.toLocaleString()}` },
        ];
      },
  
      // Example of how to retrieve the tax brackets for a state and filing status
      getTaxBracketsForStateAndFilingStatus() {
        // This should be dynamically fetched based on the selected state and filing status
        // For example, using the scraped data
  
        if (this.location === 'California') {
          return [
            { income: 0, rate: 0.01 },
            { income: 10000, rate: 0.02 },
            { income: 25000, rate: 0.04 },
            { income: 50000, rate: 0.06 },
            { income: 100000, rate: 0.09 },
            { income: Infinity, rate: 0.10 },
          ];
        }
        if (this.location === 'Texas') {
          return [
            { income: 0, rate: 0.00 } // No state income tax in Texas
          ];
        }
  
        if (this.location === 'Florida') {
          return [
            { income: 0, rate: 0.00 } // No state income tax in Florida
          ];
        }
  
        if (this.location === 'Nevada') {
          return [
            { income: 0, rate: 0.00 } // No state income tax in Nevada
          ];
        }
  
        if (this.location === 'South Dakota') {
          return [
            { income: 0, rate: 0.00 } // No state income tax in South Dakota
          ];
        }
        if (this.location === 'Washington') {
          return [
            { income: 0, rate: 0.00 } // No state income tax
          ];
        }
        if (this.location === 'Alaska') {
          return [
            { income: 0, rate: 0.00 } // No state income tax
          ];
        }
        if (this.location === 'North Dakota') {
          return [
            { income: 0, rate: 0.01 },
            { income: 40000, rate: 0.02 },
            { income: 100000, rate: 0.03 },
            { income: 200000, rate: 0.04 },
            { income: Infinity, rate: 0.05 },
          ];
        }
        if (this.location === 'Minnesota') {
          return [
            { income: 0, rate: 0.05 },
            { income: 25000, rate: 0.07 },
            { income: 70000, rate: 0.09 },
            { income: 150000, rate: 0.10 },
            { income: Infinity, rate: 0.11 },
          ];
        }
        if (this.location === 'Illinois') {
          return [
            { income: 0, rate: 0.04 },
            { income: Infinity, rate: 0.05 },
          ];
        }
        if (this.location === 'Ohio') {
          return [
            { income: 0, rate: 0.01 },
            { income: 22000, rate: 0.02 },
            { income: 44000, rate: 0.03 },
            { income: 88000, rate: 0.04 },
            { income: 110000, rate: 0.05 },
            { income: 150000, rate: 0.06 },
            { income: Infinity, rate: 0.07 },
          ];
        }
        if (this.location === 'Pennsylvania') {
          return [
            { income: 0, rate: 0.03 }  // Flat rate tax
          ];
        }
  
        if (this.location === 'Michigan') {
          return [
            { income: 0, rate: 0.0425 }  // Flat rate tax
          ];
        }
        if (this.location === 'Oregon') {
          return [
            { income: 0, rate: 0.05 },
            { income: 20000, rate: 0.07 },
            { income: 50000, rate: 0.09 },
            { income: 100000, rate: 0.10 },
            { income: 200000, rate: 0.12 },
            { income: Infinity, rate: 0.15 },
          ];
        }
  
        if (this.location === 'Colorado') {
          return [
            { income: 0, rate: 0.04 }  // Flat rate tax
          ];
        }
  
        if (this.location === 'Arizona') {
          return [
            { income: 0, rate: 0.02 },
            { income: 25000, rate: 0.03 },
            { income: 50000, rate: 0.04 },
            { income: 100000, rate: 0.05 },
            { income: 150000, rate: 0.06 },
            { income: 200000, rate: 0.07 },
            { income: Infinity, rate: 0.08 },
          ];
        }
  
        if (this.location === 'Kansas') {
          return [
            { income: 0, rate: 0.03 },
            { income: 30000, rate: 0.05 },
            { income: 100000, rate: 0.07 },
            { income: 250000, rate: 0.09 },
            { income: Infinity, rate: 0.11 },
          ];
        }
  
        if (this.location === 'Kentucky') {
          return [
            { income: 0, rate: 0.05 }  // Flat rate tax
          ];
        }
  
        if (this.location === 'Tennessee') {
          return [
            { income: 0, rate: 0.00 }  // No state income tax in Tennessee
          ];
        }
  
        if (this.location === 'Missouri') {
          return [
            { income: 0, rate: 0.01 },
            { income: 10000, rate: 0.02 },
            { income: 30000, rate: 0.03 },
            { income: 75000, rate: 0.04 },
            { income: 150000, rate: 0.05 },
            { income: 200000, rate: 0.06 },
            { income: Infinity, rate: 0.07 },
          ];
        }
  
        if (this.location === 'Montana') {
          return [
            { income: 0, rate: 0.01 },
            { income: 5000, rate: 0.02 },
            { income: 12000, rate: 0.03 },
            { income: 25000, rate: 0.04 },
            { income: 50000, rate: 0.05 },
            { income: 100000, rate: 0.06 },
            { income: 200000, rate: 0.07 },
            { income: Infinity, rate: 0.08 },
          ];
        }
  
        if (this.location === 'Idaho') {
          return [
            { income: 0, rate: 0.01 },
            { income: 10000, rate: 0.02 },
            { income: 25000, rate: 0.03 },
            { income: 50000, rate: 0.04 },
            { income: 100000, rate: 0.05 },
            { income: 200000, rate: 0.06 },
            { income: Infinity, rate: 0.07 },
          ];
        }
  
        if (this.location === 'Maine') {
          return [
            { income: 0, rate: 0.05 },
            { income: 50000, rate: 0.07 },
            { income: 100000, rate: 0.09 },
            { income: Infinity, rate: 0.10 },
          ];
        }
  
        if (this.location === 'Vermont') {
          return [
            { income: 0, rate: 0.03 },
            { income: 40000, rate: 0.05 },
            { income: 80000, rate: 0.06 },
            { income: 200000, rate: 0.07 },
            { income: Infinity, rate: 0.08 },
          ];
        }
  
        if (this.location === 'Maryland') {
          return [
            { income: 0, rate: 0.02 },
            { income: 20000, rate: 0.04 },
            { income: 80000, rate: 0.06 },
            { income: 150000, rate: 0.08 },
            { income: 300000, rate: 0.09 },
            { income: Infinity, rate: 0.10 },
          ];
        }
  
        if (this.location === 'Rhode Island') {
          return [
            { income: 0, rate: 0.04 },
            { income: 20000, rate: 0.06 },
            { income: 50000, rate: 0.08 },
            { income: Infinity, rate: 0.10 },
          ];
        }
  
        if (this.location === 'Delaware') {
          return [
            { income: 0, rate: 0.02 },
            { income: 20000, rate: 0.04 },
            { income: 40000, rate: 0.06 },
            { income: 60000, rate: 0.08 },
            { income: Infinity, rate: 0.09 },
          ];
        }
  
        if (this.location === 'Connecticut') {
          return [
            { income: 0, rate: 0.03 },
            { income: 10000, rate: 0.05 },
            { income: 50000, rate: 0.07 },
            { income: 100000, rate: 0.09 },
            { income: Infinity, rate: 0.11 },
          ];
        }
  
        if (this.location === 'New Jersey') {
          return [
            { income: 0, rate: 0.01 },
            { income: 20000, rate: 0.02 },
            { income: 50000, rate: 0.04 },
            { income: 100000, rate: 0.06 },
            { income: 200000, rate: 0.08 },
            { income: Infinity, rate: 0.10 },
          ];
        }
  
        if (this.location === 'Massachusetts') {
          return [
            { income: 0, rate: 0.05 }  // Flat rate tax
          ];
        }
  
        if (this.location === 'Hawaii') {
          return [
            { income: 0, rate: 0.01 },
            { income: 40000, rate: 0.02 },
            { income: 80000, rate: 0.03 },
            { income: 200000, rate: 0.05 },
            { income: Infinity, rate: 0.06 },
          ];
        }
  
        if (this.location === 'New Hampshire') {
          return [
            { income: 0, rate: 0.00 }  // No state income tax
          ];
        }
        return [
          { income: 5000, rate: 0.03 },
          { income: 15000, rate: 0.05 },
          { income: 40000, rate: 0.07 },
        ];
      },
    },
  };
  </script>
  
  <!-- Script setup block for component logic -->
  <script setup>
  import { ref, onMounted, nextTick, markRaw, computed } from 'vue';
  import Chart from 'chart.js/auto';
  
  /* ========= DATA & REFS ========= */
  const income = ref(210000);
  const location = ref('Pennsylvannia');
  const filingStatus = ref('Married');
  const showAdvanced = ref(false);
  const contribution401k = ref(0);
  const contributionIra = ref(0);
  const itemizedDeductions = ref(0);
  const stateExemptions = ref(2);
  
  // Main tax result (federal + FICA approximation)
  const taxResult = ref(null);
  const taxBreakdownDetails = ref([]);
  
  // Variables for the second pie chart breakdown
  const incomeTax = ref(0);
  const salesTax = ref(0);
  const fuelTax = ref(0);
  const propertyTax = ref(0);
  
  // Compute total tax burden & percentage
  const totalTaxBurden = computed(() =>
    incomeTax.value + salesTax.value + fuelTax.value + propertyTax.value
  );
  const taxPercentage = computed(() => {
    if (!income.value) return 0;
    return Math.round((totalTaxBurden.value / income.value) * 100);
  });
  
  // Dynamic variables for the bar chart description
  const lastYearMarginalRate = ref(26.5);
  const thisYearMarginalRate = ref(28.1);
  const lastYearEffectiveRate = ref(3.84);
  const thisYearEffectiveRate = ref(3.51);
  const lastYearTaxes = ref(1730);
  const thisYearTaxes = ref(1580);
  
  // Chart instances & canvas refs
  const barChartInstance = ref(null);
  const pieChartInstance = ref(null);
  const barChartCanvas = ref(null);
  const pieChartCanvas = ref(null);
  
  /* ========= METHODS ========= */
  function toggleAdvanced() {
    showAdvanced.value = !showAdvanced.value;
  }
  
  function calculateTaxes() {
    // 1) Calculate adjusted income after deductions
    const totalIncome =
      income.value -
      (contribution401k.value || 0) -
      (contributionIra.value || 0) -
      (itemizedDeductions.value || 0);
  
    // 2) Placeholder: 30% of adjusted income as combined tax
    const approximateTax = Math.round(totalIncome * 0.3);
    taxResult.value = approximateTax;
  
    // 3) Distribute the approximateTax among Federal, FICA, State, Local
    const federalRatio = 0.70;
    const ficaRatio = 0.20;
    const stateRatio = 0.07;
    const localRatio = 0.03;
    const fedTax = Math.round(approximateTax * federalRatio);
    const ficaTax = Math.round(approximateTax * ficaRatio);
    const stateTax = Math.round(approximateTax * stateRatio);
    const localTax = Math.round(approximateTax * localRatio);
    const totalIncomeTaxes = fedTax + ficaTax + stateTax + localTax;
  
    // 4) Build the "Your Income Taxes Breakdown" table
    taxBreakdownDetails.value = [
      { type: 'Federal', marginalRate: '37.00%', effectiveRate: '26.41%', yearTaxes: `$${fedTax.toLocaleString()}` },
      { type: 'FICA', marginalRate: '2.35%', effectiveRate: '3.38%', yearTaxes: `$${ficaTax.toLocaleString()}` },
      { type: 'State', marginalRate: '3.07%', effectiveRate: '3.07%', yearTaxes: `$${stateTax.toLocaleString()}` },
      { type: 'Local', marginalRate: '3.75%', effectiveRate: '3.75%', yearTaxes: `$${localTax.toLocaleString()}` },
      { type: 'Total Income Taxes', marginalRate: '', effectiveRate: '', yearTaxes: `$${totalIncomeTaxes.toLocaleString()}` }
    ];
  
    // 5) For the "Total Estimated 2024 Tax Burden" pie chart
    incomeTax.value = Math.round(approximateTax * 0.50);
    salesTax.value = Math.round(approximateTax * 0.20);
    fuelTax.value = Math.round(approximateTax * 0.10);
    propertyTax.value = Math.round(approximateTax * 0.20);
  
    // 6) Update the dynamic description for the bar chart
    lastYearTaxes.value = Math.round(fedTax * 0.9);
    thisYearTaxes.value = fedTax;
    lastYearMarginalRate.value = 26.5;
    thisYearMarginalRate.value = 28.1;
    lastYearEffectiveRate.value = 3.84;
    thisYearEffectiveRate.value = 3.51;
  
    // 7) Update the charts
    updateCharts({
      federalTax: fedTax,
      ficaTax: ficaTax,
      stateTax: stateTax,
      localTax: localTax,
      totalTax: approximateTax
    });
  }
  
  async function updateCharts(data) {
    // Wait for DOM to update so canvas elements exist
    await nextTick();
    if (!barChartCanvas.value || !pieChartCanvas.value) {
      console.warn('Chart canvases not available');
      return;
    }
  
    // 1) Bar Chart: 2023 vs 2024 Federal Tax Comparison
    const { federalTax } = data;
    const lastYearFederalTax = Math.round(federalTax * 0.9);
    const barData = {
      labels: ['2023', '2024'],
      datasets: [
        {
          label: 'Federal Tax',
          backgroundColor: ['#3e95cd', '#8e5ea2'],
          data: [lastYearFederalTax, federalTax]
        }
      ]
    };
  
    if (barChartInstance.value) {
      barChartInstance.value.data = barData;
      barChartInstance.value.update();
    } else {
      barChartInstance.value = markRaw(new Chart(barChartCanvas.value, {
        type: 'bar',
        data: barData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Tax Amount (USD)' }
            }
          }
        }
      }));
    }
  
    // 2) Pie Chart: Total Estimated 2024 Tax Burden
    const pieData = {
      labels: ['Income Tax', 'Sales Tax', 'Fuel Tax', 'Property Tax'],
      datasets: [
        {
          label: 'Tax Burden',
          data: [
            incomeTax.value,
            salesTax.value,
            fuelTax.value,
            propertyTax.value
          ],
          backgroundColor: ['#3cba9f', '#c45850', '#e8c3b9', '#8e5ea2'],
          hoverOffset: 4
        }
      ]
    };
  
    if (pieChartInstance.value) {
      pieChartInstance.value.data = pieData;
      pieChartInstance.value.update();
    } else {
      pieChartInstance.value = markRaw(new Chart(pieChartCanvas.value, {
        type: 'pie',
        data: pieData,
        options: { responsive: true }
      }));
    }
  }
  
  onMounted(() => {
    // Optionally, initialize charts with default data if needed.
  });
  </script>
  
  <style scoped>
  /* Basic Reset & Fonts */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .tax-calculator {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }
  
  /* Header */
  .header {
    background-color: #ffffff;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }
  .header h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  /* Container */
  .container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  /* Overview Section */
  .overview-section {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    background-color: #ffffff;
    padding: 1.5rem;
    border-radius: 5px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .overview-text {
    flex: 1;
    margin-right: 1rem;
  }
  .overview-text h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  .overview-text p {
    line-height: 1.4;
  }
  .overview-map img {
    max-width: 300px;
    width: 100%;
    height: auto;
  }
  
  /* Calculator Form Section */
  .calculator-form {
    background-color: #ffffff;
    padding: 1.5rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .calculator-form h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .col {
    flex: 1;
    min-width: 200px;
    padding: 0 0.5rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  .col label {
    margin-bottom: 0.25rem;
    font-weight: 600;
    font-size: 0.9rem;
  }
  .col input,
  .col select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  /* Advanced Toggle */
  .advanced-toggle-container {
    text-align: center;
    margin: 0.25rem 0;
  }
  .advanced-toggle {
    display: inline-block;
    font-size: 0.95rem;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    margin: 0.5rem 0;
  }
  
  /* Fade transition for advanced section */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Button Row */
  .button-row {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  .calculate-button {
    background: #007bff;
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  .calculate-button:hover {
    background: #0056b3;
  }
  
  /* Result Section */
  .result-container {
    margin-top: 1.5rem;
    text-align: center;
  }
  .result-text {
    font-size: 1.1rem;
    color: #333;
  }
  .result-amount {
    color: #007bff;
    font-weight: 600;
  }
  
  /* Breakdown Table */
  .breakdown-table-container {
    margin-top: 1rem;
    text-align: left;
  }
  .breakdown-table {
    width: 100%;
    border-collapse: collapse;
  }
  .breakdown-table th,
  .breakdown-table td {
    padding: 0.5rem;
    border: 1px solid #ddd;
  }
  .breakdown-table th {
    background-color: #f0f0f0;
    font-weight: 600;
  }
  .footnote {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #666;
  }
  .total-row {
    color: green;
  }
  
  /* Dashboard Container */
  .dashboard-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: space-around;
  }
  
  /* Bar Chart + Description Layout */
  .bar-chart-comparison {
    display: flex;
    gap: 1rem;
    flex: 1 1 100%;
    align-items: center;  
    background-color: #fff;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .bar-chart-col {
    flex: 1;
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
  }
  .bar-chart-col canvas {
    width: 100%;
    height: auto;
  }
  .bar-chart-desc-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #555;
    line-height: 1.4;
  }
  .bar-chart-desc-col p {
    margin: 0;
  }
  .bar-chart-col h4 {
    margin-bottom: 0.5rem;
  }
  
  /* Tax Burden: Pie Chart + Breakdown Layout */
  .tax-burden-comparison {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: space-around;
    flex: 1 1 100%;
  }
  .tax-burden-left-col {
    flex: 1;
    background: #fff;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .tax-burden-left-col h4 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
  }
  .tax-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .tax-item .label {
    color: #555;
  }
  .tax-item .value {
    font-weight: 600;
    color: #333;
  }
  .tax-item.total .value {
    color: green;
  }
  .divider {
    border: none;
    border-top: 1px solid #ccc;
    margin: 0.75rem 0;
  }
  .tax-percentage {
    margin-top: 1rem;
    font-size: 0.95rem;
  }
  .tax-percentage .highlight {
    font-weight: 600;
    color: #007bff;
  }
  .tax-burden-chart-col {
    flex: 1;
    max-width: 300px; /* Make the pie chart narrower */
    background: #fff;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
  }
  .tax-burden-chart-col canvas {
    width: 100% !important;
    height: auto !important;
  }
  
  /* New Content Section (Post-Graphs) */
  .post-graphs-content {
    background: #fff;
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    line-height: 1.5;
  }
  .post-graphs-content h2,
  .post-graphs-content h3 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  .post-graphs-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }
  .post-graphs-content table,
  .post-graphs-content th,
  .post-graphs-content td {
    border: 1px solid #ddd;
    padding: 0.5rem;
  }
  .post-graphs-content th {
    background-color: #f0f0f0;
    font-weight: 600;
  }
  
  /* Flex layout for tax image and paragraph */
  .tax-info-layout {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .tax-info-layout .tax-image {
    flex: 0 0 auto;
    max-width: 300px;
  }
  .tax-info-layout .tax-image img {
    width: 100%;
    height: auto;
    display: block;
  }
  .tax-info-layout .tax-paragraph {
    flex: 1;
    min-width: 200px;
  }
  
  .tax-paragraph p {
    margin-bottom: 1.0rem !important;
  }
  
  .tax-paragraph1 p {
    margin-bottom: 1.0rem !important;
  }
  
  /* Chatbox Styles */
  .chatbox {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 5px;
    margin: 2rem auto;
    max-width: 600px;
  }
  .chat-header {
    text-align: center;
    margin-bottom: 1rem;
  }
  .chat-messages {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #eee;
  }
  .chat-message {
    margin-bottom: 0.5rem;
  }
  .chat-sender {
    font-weight: bold;
    margin-right: 0.5rem;
  }
  .chat-input {
    display: flex;
    gap: 0.5rem;
  }
  .chat-input input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .chat-input button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  .chat-input button:hover {
    background-color: #0056b3;
  }
  
  /* Footer */
  .footer {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    margin: 2rem 0;
  }
  
  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .overview-section {
      flex-direction: column;
    }
    .overview-text {
      margin-right: 0;
      margin-bottom: 1rem;
    }
    .row {
      flex-direction: column;
    }
    .col {
      margin-bottom: 1rem;
    }
    .advanced-section {
      flex-wrap: nowrap;
    }
    .dashboard-container {
      flex-direction: column;
      align-items: center;
    }
    .bar-chart-comparison {
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }
    .bar-chart-col,
    .bar-chart-desc-col {
      flex: 1 1 100%;
    }
    .tax-burden-comparison {
      flex-direction: column;
      align-items: flex-start;
    }
    .tax-burden-chart-col {
      max-width: 100%;
      margin-top: 1rem;
    }
    .post-graphs-content {
      margin-top: 1rem;
    }
  }
  
  </style>