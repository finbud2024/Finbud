<template>
  <StockPrice />
  <Indicators />
  <IndicatorComparison />
  <CorrelationMatrix />
</template>

<script>
import { ref, onMounted, computed } from "vue";
import csvData from "./assets/economic_indicators.csv";
import IndicatorComparison from "@/components/IndicatorComparison.vue";
import StockPrice from "@/components/StockPrice.vue";
import Indicators from "@/components/Indicators.vue";
import CorrelationMatrix from "@/components/CorrelationMatrix.vue";

export default {
  components: {
    StockPrice,
    Indicators,
    IndicatorComparison,
    CorrelationMatrix,
  },
};
</script>
