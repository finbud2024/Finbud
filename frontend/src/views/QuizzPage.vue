<template>
  <div class ="quizPageContainer">
    <div class="container">
      <quizComponent @messageToBot="messageToBot"/>
    </div>
  </div>
</template>

<script>
import quizComponent from '../components/quizComponent.vue'


//moving quiz into a component in case need to add more later on to Quiz Page
export default {  
  name: 'QuizzPage',
  components:{quizComponent},
  methods:{
    messageToBot(message){
      this.$emit('finbudBotResponse',message);
    }
  }
};
</script>

<style scoped>
  .quizPageContainer{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .container{
    width: 600px;
    height: 100%;
    box-shadow: 0 4px 8px rgba(0,0,0,.1);
  }
</style>
