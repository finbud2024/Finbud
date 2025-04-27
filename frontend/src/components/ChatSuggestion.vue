<template>
    <div class="suggestion-bar">
      <div class="suggestion-scroll">
        <div
          class="suggestion-item"
          v-for="(suggestion, index) in localizedSuggestions"
          :key="index"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { string } from 'mathjs';

  export default {
    props: {
      lan: string
    },
    computed: {
      localizedSuggestions() {
        if (this.lan === 'vi') {
          return [
            'Mua cổ phiếu',
            'Giao dịch giá chứng khoán',
            'REALESTATE',
            'Phân tích ngân sách của tôi',
        
          ]
        } else {
          return [
            'Buy stock',
            'Stock price transactions',
            'REALESTATE',
            'Analyze my budget'
          ]
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .suggestion-bar {
    align-items: center; /* horizontally center all children */
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    /* background-color: #f4f4f4; */
    padding: 10px 5px;
    /* border-top: 1px solid #ccc; */
  }
  
  .suggestion-scroll {
    display: flex;
    gap: 12px;
    padding: 5px;
  }
  
  .suggestion-item {
    padding: 8px 14px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 20px;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 14px;
    white-space: nowrap;
    transition: background-color 0.2s;
  }
  
  .suggestion-item:hover {
    background-color: #e0e0e0;
  }
  </style>
  