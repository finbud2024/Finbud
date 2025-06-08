<template>
  <div class="sources-section">
    <h3>Related Articles</h3>
    <ul>
      <li v-for="(source, index) in sources" :key="index">
        <a :href="source.link" target="_blank">{{ source.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SourceComponent",
  props: {
    sources: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.sources-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width: 70%;
}
.sources-section h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  font-weight: 600;
}
.sources-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sources-section li {
  margin-bottom: 10px;
}
.sources-section a {
  color: #000000;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}
.sources-section a:hover {
  color: #333333;
}
</style>
