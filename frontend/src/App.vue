<template>
  <div class="nav-actions">
    <NavBar v-if="showHeader" ref="headerBar"/>
    <div class="content">
    </div>
  </div>
  <router-view @chatviewSelectingThread='loadThread'/>
  <FooterBar v-if="showFooter" ref="footerBar"/>
  <ChatBubble v-if="showChatBubble" :chatViewThreadID='threadId'/>
</template>

<script>
import NavBar from     './components/NavBar.vue';
import FooterBar from  './components/FooterBar.vue';
import ChatBubble from './components/ChatBubble.vue'
export default {
  name: 'App',
  components: {
    NavBar,
    FooterBar,
    ChatBubble
  },
  data(){
    return{
      threadId:'',
    }
  },
  mounted() {
    
  },
  computed: {
    showChatBubble() {
      // Check if the current route is NOT 'chat-view'
      return this.$route.path !== '/chat-view';
    },
    showFooter(){
      return this.$route.path !== '/chat-view' && !this.$route.fullPath.includes('/stock-simulator?')
    },
    showHeader(){
      return !this.$route.fullPath.includes('/stock-simulator?')
    }
  },
  methods: {
    loadThread(chatviewThreadID){
      this.threadId = chatviewThreadID;
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
body {
  min-height: 100%;
  margin:0;
  padding:0;
  font-family: Noto sans, sans-serif;
}

html { 
  height: 100%;
  scrollbar-gutter: auto;
}
</style>

<style scoped>
.nav-actions {
  display: flex;
  flex-direction: column;
  margin: 0px;
}

.content {
  padding-top: 80px;
  flex: 1;
}
a {
  text-decoration: none;
  color: blue;
  border: 1px solid blue;
}

a:hover {
  background-color: #e7f3ff;
}

</style>
