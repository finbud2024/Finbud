<template>
    <div>
      <section class="sources" v-if="sources.length > 0">
        <SearchResult :sources="sources" />
      </section>
      <section class="videos">
        <button v-if="showSearchVideosButton" @click="toggleVideos" class="search-videos-btn">
          Search Videos
        </button>
        <div class="videos-container" v-if="showVideos">
          <Video :videos="videos" />
        </div>
      </section>
      <section class="relevant-questions" v-if="relevantQuestions.length > 0">
        <h3>Follow-up Questions</h3>
        <ul>
          <li v-for="(question, i) in relevantQuestions" :key="i" @click="handleQuestionClick(question)">
            {{ question }}
          </li>
        </ul>
      </section>
    </div>
  </template>
  
  <script>
  import SearchResult from './SearchResult.vue';
  import Video from './Video.vue';
  import { getSources, getVideos, getRelevantQuestions } from '@/services/serperService.js';
  import { gptServices } from '../../services/gptServices.js';
  
  export default {
    name: 'SearchResponse',
    props: {
      query: {
        type: String,
        required: true,
      },
    },
    components: {
      SearchResult,
      Video,
    },
    data() {
      return {
        sources: [],
        videos: [],
        showVideos: false,
        showSearchVideosButton: false,
        relevantQuestions: [],
        gptResponse: '',
      };
    },
    watch: {
      query: {
        immediate: true,
        handler(newQuery) {
          if (newQuery && newQuery.toLowerCase().startsWith('#search')) {
            this.performSearch(newQuery);
          }
        },
      },
    },
    methods: {
      async performSearch(userQuery) {
        console.log("In SearchResponse");
        console.log(userQuery);
        try {
          // Fetch search results from Serper API
          this.sources = await getSources(userQuery);
  
          // Fetch videos
          this.videos = await getVideos(userQuery);
  
          // Get relevant questions
          this.relevantQuestions = await getRelevantQuestions(this.sources);
  
          // Get GPT response
          this.gptResponse = await gptServices(userQuery);
  
          // Show the search videos button
          this.showSearchVideosButton = true;
  
          // Combine the responses
          const combinedResponse = {
            gptResponse: this.gptResponse,
            sources: this.sources,
            videos: this.videos,
            relevantQuestions: this.relevantQuestions,
          };
  
          // Emit the combined response back to ChatView
          this.$emit('combinedResponse', combinedResponse);
  
          // Reset the search query state
          this.$emit('resetSearchQuery');
        } catch (error) {
          console.error('Error performing search:', error);
        }
      },
      toggleVideos() {
        this.showVideos = !this.showVideos;
        this.showSearchVideosButton = false;
      },
      handleQuestionClick(question) {
        const searchQuery = `#search ${question}`;
        this.$emit('sendMessage', searchQuery);
      },
    },
  };
  </script>
  
  <style scoped>
  .search-videos-btn {
    background-color: #333;
    color: white;
    border: none;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .search-videos-btn:hover {
    background-color: #444;
  }
  
  .relevant-questions {
    margin-top: 20px;
  }
  
  .relevant-questions h3 {
    margin-bottom: 10px;
    color: #007bff;
  }
  
  .relevant-questions ul {
    list-style-type: none;
    padding: 0;
  }
  
  .relevant-questions li {
    padding: 10px;
    background-color: #f8f9fa;
    margin-bottom: 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .relevant-questions li:hover {
    background-color: #e9ecef;
    transform: translateX(5px);
  }
  
  .relevant-questions li:active {
    background-color: #dee2e6;
  }
  </style>
  