<template>
  <div class="quizPageContainer">
    <div class="container">
      <quizComponent @messageToBot="$emit('finbudBotResponse',$event)"/>
    </div>
  </div>
</template>

<script>
import quizComponent from '../components/quizComponent.vue'


//moving quiz into a component in case need to add more later on to Quiz Page
export default {  
  name: 'QuizzPage',
  components:{quizComponent},
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
    width: 40vw;
    height: 100%;
    box-shadow: 0 4px 8px rgba(0,0,0,.1);
    container-name: quizComponent;
    container-type: inline-size;
  }

  @media screen and (max-width: 768px){
    .container{
      width: 100%;
    }
  }

</style>
