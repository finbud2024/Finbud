<template>
  <h3>Sources</h3>
  <div class="sources-container">
    <div class="scrollable-sources-frame">
      <div class="scrollable-sources">
        <div v-for="(source, idx) in sources.slice(0, 3)" :key="idx" class="source" @click="openSource(source.link)">
          <p class="title">{{ source.title }}</p>
          <div class="host-container">
            <img :src="source.favicon" alt="favicon" class="favicon"/>
            <p>{{ source.host }}</p>
          </div>
        </div>
        <div v-if="remainingSourcesCount > 0" class="source" @click="openAllSources">
          <div class="favicon-container">
            <div class="favicon-row" v-for="(row, rowIndex) in faviconRows" :key="rowIndex">
              <img v-for="(source, idx) in row" :key="idx" :src="source.favicon" alt="favicon" class="favicon"/>
            </div>
          </div>
          <p class="view-more-button">View {{ remainingSourcesCount }} more</p>
        </div>
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
  width: 100%;
}

.scrollable-sources-frame {
  width: 100%;

}

.scrollable-sources {
  gap: 10px;
  flex-wrap: nowrap;
  align-items: flex-start; /* Ensure items align properly */
  display: flex;
  flex-direction: row;
  height: 12vh;
  margin-bottom: 2vh;
  width: 40vw;
}

.source {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;/* Constrain width to prevent overflow */
  margin-bottom: 10px;
  height: 100%;
  position: relative;
  padding: 10px;
  flex: 1;
}

.source:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.title {
  position: absolute;
  font-size: 0.7rem;
  font-weight: bold;
  color: #007bff;
  width: 80%;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; 
}


.host-container {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  margin-top: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; 
}

.favicon {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}


.favicon-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  margin-bottom: auto;
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
  margin-top: auto;
  margin-left: 0px;
}

.view-more-button:hover {
  color: #0056b3;
}

/* Media Query for Responsive Layout */
@media (max-width: 768px) {
  .scrollable-sources-frame {
    width: 100%;
  }
}
</style>
