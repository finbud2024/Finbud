<template>
  <div class="category-pie-chart">
    <div class="chart-container">
      <svg viewBox="0 0 200 200" class="pie-chart">
        <g class="pie-slices">
          <path
            v-for="(slice, index) in pieSlices"
            :key="slice.category"
            :d="slice.path"
            :fill="slice.color"
            :stroke="'white'"
            :stroke-width="2"
            class="pie-slice"
            @mouseover="hoveredSlice = index"
            @mouseleave="hoveredSlice = -1"
            :class="{ 'slice-hovered': hoveredSlice === index }"
          />
        </g>
        
        <!-- Center text -->
        <text x="100" y="95" text-anchor="middle" class="center-text-title">
          Total Goals
        </text>
        <text x="100" y="115" text-anchor="middle" class="center-text-value">
          {{ goals.length }}
        </text>
      </svg>
    </div>
    
    <div class="legend">
      <div
        v-for="(item, index) in categoryData"
        :key="item.category"
        class="legend-item"
        @mouseover="hoveredSlice = index"
        @mouseleave="hoveredSlice = -1"
        :class="{ 'legend-hovered': hoveredSlice === index }"
      >
        <div class="legend-color" :style="{ backgroundColor: colors[index % colors.length] }"></div>
        <div class="legend-info">
          <span class="legend-label">{{ item.category }}</span>
          <span class="legend-value">{{ item.count }} goal{{ item.count !== 1 ? 's' : '' }}</span>
        </div>
        <div class="legend-percentage">{{ item.percentage }}%</div>
      </div>
    </div>
    
    <div v-if="goals.length === 0" class="empty-chart">
      <font-awesome-icon icon="fa-solid fa-chart-pie" />
      <p>No goals to display</p>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'

library.add(faChartPie)

export default {
  name: 'CategoryPieChart',
  components: {
    FontAwesomeIcon
  },
  props: {
    goals: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hoveredSlice: -1,
      colors: [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
      ]
    }
  },
  computed: {
    categoryData() {
      if (this.goals.length === 0) return []
      
      const categoryCounts = {}
      this.goals.forEach(goal => {
        categoryCounts[goal.category] = (categoryCounts[goal.category] || 0) + 1
      })
      
      return Object.entries(categoryCounts)
        .map(([category, count]) => ({
          category,
          count,
          percentage: Math.round((count / this.goals.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
    },
    pieSlices() {
      if (this.categoryData.length === 0) return []
      
      let currentAngle = -90 // Start from top
      return this.categoryData.map((item, index) => {
        const percentage = item.count / this.goals.length
        const angle = percentage * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        
        const path = this.createArcPath(100, 100, 80, startAngle, endAngle)
        currentAngle += angle
        
        return {
          category: item.category,
          path,
          color: this.colors[index % this.colors.length],
          percentage: item.percentage
        }
      })
    }
  },
  methods: {
    createArcPath(centerX, centerY, radius, startAngle, endAngle) {
      const start = this.polarToCartesian(centerX, centerY, radius, endAngle)
      const end = this.polarToCartesian(centerX, centerY, radius, startAngle)
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
      
      return [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ")
    },
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      }
    }
  }
}
</script>

<style scoped>
.category-pie-chart {
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pie-chart {
  width: 200px;
  height: 200px;
}

.pie-slice {
  transition: all 0.2s ease;
  cursor: pointer;
}

.pie-slice:hover,
.slice-hovered {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.center-text-title {
  font-size: 12px;
  fill: #64748b;
  font-weight: 500;
}

.center-text-value {
  font-size: 20px;
  fill: #1a1a1a;
  font-weight: 700;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.legend-item:hover,
.legend-hovered {
  background: #f8fafc;
  transform: translateX(4px);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.legend-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
}

.legend-value {
  font-size: 0.8rem;
  color: #64748b;
}

.legend-percentage {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3b82f6;
}

.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  gap: 1rem;
}

.empty-chart .fa-icon {
  font-size: 3rem;
}

.empty-chart p {
  margin: 0;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .pie-chart {
    width: 150px;
    height: 150px;
  }
  
  .center-text-title {
    font-size: 10px;
  }
  
  .center-text-value {
    font-size: 16px;
  }
}
</style> 