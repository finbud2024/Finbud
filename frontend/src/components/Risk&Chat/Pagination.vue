<!-- Pagination.vue -->
<template>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true,
      },
      totalPages: {
        type: Number,
        required: true,
      },
    },
    methods: {
      previousPage() {
        if (this.currentPage > 1) {
          this.$emit('update:currentPage', this.currentPage - 1);
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.$emit('update:currentPage', this.currentPage + 1);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    width: 100%;
    box-sizing: border-box;
  }

  .pagination span {
    flex: 1 1 auto;
    text-align: center;
    font-size: 0.9rem;
    min-width: 0;
    word-break: break-word;
  }

  button {
    padding: 10px 16px;
    border: none;
    background-color: #000000;
    color: white;
    cursor: pointer;
    border-radius: 8px;
    font-size: 0.9rem;
    flex-shrink: 0;
    min-height: 44px;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    .pagination {
      flex-direction: column;
      align-items: stretch;
    }

    .pagination span {
      order: -1;
      width: 100%;
    }

    button {
      width: 100%;
    }
  }
  </style>
  