<template>
  <div id="app">
    <NavBar />
    <div class="content">
      <SideBar :threads="threads" 
               @add-thread="handleAddThread"
               @edit-thread="handleEditThread"
               @save-thread-name="handleSaveThreadName"
               @cancel-edit="handleCancelEdit" />
      <ChatView />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import SideBar from './components/SideBar.vue';
import ChatView from './views/ChatView.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    SideBar,
    ChatView,
  },
  data() {
    return {
      threads: []
    };
  },
  methods: {
    handleAddThread(newThread) {
      this.threads.push(newThread);
    },
    handleEditThread(index) {
      this.$set(this.threads[index], 'editing', true);
    },
    handleSaveThreadName(data) {
      this.$set(this.threads[data.index], 'name', data.newName);
      this.$set(this.threads[data.index], 'editing', false);
    },
    handleCancelEdit(index) {
      this.$set(this.threads[index], 'editing', false);
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100vw; /* Full viewport width */
  margin: 0; /* Remove any default margin */
  padding: 0; /* Remove any default padding */
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Stretches children to the full width */
}

.content {
  display: flex;
  width: 100%;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%; /* This makes sure your app fills the entire height of the viewport */
}

* {
  box-sizing: border-box; /* Includes padding and border in the width and height */
}


</style>
