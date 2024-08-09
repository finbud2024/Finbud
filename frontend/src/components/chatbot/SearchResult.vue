<template>
  <h3>Sources</h3>
  <div class="sources-container">
    <div class="horizontal-sources">
      <div v-for="(source, idx) in sources.slice(0, 3)" :key="idx" class="source" @click="openSource(source.link)">
        <p class="title">{{ source.title }}</p>
        <div class="host-container">
          <img :src="source.favicon" alt="favicon" class="favicon"/>
          <p>{{ source.host }}</p>
        </div>
      </div>
      <div v-if="remainingSourcesCount > 0" class="source view-more-frame" @click="openAllSources">
        <div class="favicon-container">
          <div class="favicon-row" v-for="(row, rowIndex) in faviconRows" :key="rowIndex">
            <img v-for="(source, idx) in row" :key="idx" :src="source.favicon" alt="favicon" class="favicon"/>
          </div>
        </div>
        <p class="view-more-button">View {{ remainingSourcesCount }} more</p>
      </div>
    </div>
    <SourcesModal v-if="showSourcesModal" :sources="sources" @close="showSourcesModal = false" />
  </div>
</template>



<script>
import SourcesModal from './SourcesModal.vue';

export default {
  components: { SourcesModal },
  data() {
    return {
      showSourcesModal: false,
    };
  },
  props: {
    sources: {
      type: Array,
      required: true,
    },
  },
  computed: {
    remainingSources() {
      return this.sources.slice(3);
    },
    remainingSourcesCount() {
      return this.sources.length - 3;
    },
    faviconRows() {
      const rows = [];
      for (let i = 0; i < this.remainingSources.length; i += 4) {
        rows.push(this.remainingSources.slice(i, i + 4));
      }
      return rows;
    }
  },
  methods: {
    openSource(link) {
      window.open(link, '_blank');
    },
    openAllSources() {
      this.showSourcesModal = true;
    },
  },
};
</script>



<style scoped>
.sources-container {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.horizontal-sources {
  display: flex;
}

.source {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 10px;
  margin-left: 5px;
  flex: 1;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 120px;
  height: 100px; /* Ensure a consistent height for alignment */
}

.source:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.title {
  font-size: 0.7rem;
  font-weight: bold;
  color: #007bff;
  margin: 5px 0;
}

.host-container {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  margin-top: auto; /* Push the host-container to the bottom */
}

.favicon {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

.view-more-frame {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 5px;
  padding: 10px;
}

.favicon-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  margin-bottom: auto; /* Push the container to the top */
  margin: 5px 0;
}

.favicon-row {
  display: flex;
  justify-content: start;
  gap: 5px;
}

.view-more-button {
  padding: 0px;
  background-color: transparent;
  border: none;
  font-size: 0.7rem;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-top: auto; /* Aligns the text to the bottom */
  margin-left: 0px;
}

.view-more-button:hover {
  color: #0056b3;
}
</style>
