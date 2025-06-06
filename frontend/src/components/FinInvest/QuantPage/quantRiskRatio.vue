<!--This is use to show the Risk Ratio compare for 2 stock comparision--><template>
  <div class="p-6 max-w-xl mx-auto space-y-4">
    <h2 class="text-2xl font-bold mb-2">Quant Risk Metrics</h2>

    <div>
      <label class="block font-medium">Select Stock CSV</label>
      <input type="file" accept=".csv" @change="onFileChange($event, 'stock')" />
    </div>

    <div>
      <label class="block font-medium">Select Benchmark CSV</label>
      <input type="file" accept=".csv" @change="onFileChange($event, 'benchmark')" />
    </div>

    <button
      @click="calculate"
      class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-4"
      :disabled="!stockFile || !benchmarkFile"
    >
      Calculate Risk Metrics
    </button>

    <div v-if="metrics" class="mt-6 bg-gray-100 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Results</h3>
      <ul class="list-disc list-inside">
        <li v-for="(value, key) in metrics" :key="key">
          {{ key }}: {{ value.toFixed(4) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { parseCSVFile, calculateRiskMetrics } from '@/utils/quantRiskRatio.js' // adjust path as needed

const stockFile = ref(null)
const benchmarkFile = ref(null)
const stockData = ref([])
const benchmarkData = ref([])
const metrics = ref(null)

function onFileChange(event, type) {
  const file = event.target.files[0]
  if (!file) return

  if (type === 'stock') {
    stockFile.value = file
  } else {
    benchmarkFile.value = file
  }
}

async function calculate() {
  if (!stockFile.value || !benchmarkFile.value) return

  stockData.value = await parseCSVFile(stockFile.value)
  benchmarkData.value = await parseCSVFile(benchmarkFile.value)

  metrics.value = calculateRiskMetrics(stockData.value, benchmarkData.value)
}
</script>

<style scoped>
input[type='file'] {
  margin-top: 0.25rem;
}
</style>
