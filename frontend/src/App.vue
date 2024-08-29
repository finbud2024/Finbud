<template>
  <div class="nav-actions">
    <NavBar v-if="showHeader" ref="headerBar"/>
    <div class="content">
    </div>
  </div>
  <router-view @chatviewSelectingThread='loadThread' :chatBubbleThreadID='threadId'/>
  <FooterBar v-if="showFooter" ref="footerBar"/>
  <ChatBubble v-if="showChatBubble" :chatViewThreadID='threadId'/>
</template>

<script>
import NavBar from     './components/NavBar.vue';
import FooterBar from  './components/FooterBar.vue';
import ChatBubble from './components/ChatBubble.vue'
import authStore from "@/authStore";
import axios from "axios";
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
  async mounted() {
    if(authStore.isAuthenticated){
      const userId = localStorage.getItem("token");
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (historyThreadsData.length === 0) {
        //if new user with no thread, create a new one
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const userId = localStorage.getItem("token");
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        this.threadId = thread._id;
      } else {
        this.threadId = historyThreadsData[0]._id;
      }
    }
  },
  computed: {
    authStore() {
			return authStore;
		},
    showChatBubble() {
      return this.$route.path !== '/chat-view' && this.$route.path !== '/login' && this.$route.path !== '/signup' ;
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
  overflow-x: none;
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
