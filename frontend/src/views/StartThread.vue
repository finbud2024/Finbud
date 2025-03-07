<template>
  <div class="forum-layout">
    <!-- Sidebar -->
    <ForumSidebar class="sidebar" />

    <!-- Main Content -->
    <div class="content">
      <h1 class="page-title">Start new thread</h1>

      <!-- Select Forum Dropdown -->
      <div class="selected-forum">
        <select v-model="selectedForum" class="forum-dropdown">
          <option disabled value="">Select a forum</option>
          <option v-for="forum in forums" :key="forum.id" :value="forum.id">
            {{ forum.name }}
          </option>
        </select>
      </div>

      <!-- Thread Form -->
      <form @submit.prevent="submitThread" class="thread-form">
        <input v-model="title" type="text" placeholder="Title*" class="title-input" required />
        <textarea v-model="body" ref="bodyInput" placeholder="Body" class="body-input" required></textarea>
        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import ForumSidebar from "@/components/ForumSidebar.vue";

export default {
  components: { ForumSidebar },
  data() {
    return {
      title: "",
      body: "",
      selectedForum: "",
      forums: [
        { id: "p/general", name: "General", logo: "/assets/icons/general.svg" },
        { id: "p/tech", name: "Technology", logo: "/assets/icons/tech.svg" },
        { id: "p/finance", name: "Finance", logo: "/assets/icons/finance.svg" },
        { id: "p/startups", name: "Startups", logo: "/assets/icons/startups.svg" },
        { id: "p/crypto", name: "Crypto", logo: "/assets/icons/crypto.svg" }
      ],
    };
  },
  methods: {
    submitThread() {
      if (!this.title.trim() || !this.body.trim() || !this.selectedForum) {
        alert("Please select a forum and fill in both the title and body.");
        return;
      }

      console.log("New Thread:", {
        forum: this.selectedForum,
        title: this.title,
        body: this.body,
      });

      this.title = "";
      this.body = "";
      this.selectedForum = "";
      alert("Thread submitted successfully!");
    },
    enforceBodyStyles() {
      const bodyInput = this.$refs.bodyInput;
      if (bodyInput) {
        bodyInput.style.height = "200px";
        bodyInput.style.overflowWrap = "break-word";
        bodyInput.style.wordWrap = "break-word";
        bodyInput.style.whiteSpace = "pre-wrap";
        bodyInput.style.verticalAlign = "top";
        bodyInput.style.textAlign = "left";
        bodyInput.style.padding = "12px";
        bodyInput.style.fontSize = "16px";
        bodyInput.style.border = "1px solid var(--border-color)";
        bodyInput.style.borderRadius = "6px";
        bodyInput.style.resize = "vertical";
        bodyInput.style.boxSizing = "border-box";
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.enforceBodyStyles();
    });
  }
};
</script>

<style scoped>

/* Layout */
.forum-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 64px;
}

/* Sidebar */
.sidebar {
  background: var(--background-primary);
  padding: 20px;
  border-right: 1px solid var(--background-tertiary);
}

/* Main Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Page Title */
.page-title {
  font-size: 24px;
  font-weight: bold;
}

/* Forum Dropdown */
.selected-forum {
  display: flex;
  align-items: center;
}

.forum-dropdown {
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  font-size: 16px;
  border: 1px solid var(--border-color);
}

/* Form */
.thread-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start; 
}

.title-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-sizing: border-box;
}

.body-input {
  width: 100%;
  min-height: 200px; 
  padding: 12px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  resize: vertical;
  box-sizing: border-box;
  vertical-align: top;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-y: auto;
}

/* Submit Button */
.submit-button {
  background: var(--primary-color) !important;
  color: var(--primary-color) !important;
  border: 2px solid #dddddd !important;
  align-self: flex-end;
  width: 90px;
  height: 44px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
}

.submit-button:hover {
  background: #0F1F3D;
}

</style>
