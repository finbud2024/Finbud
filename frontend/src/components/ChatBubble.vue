<template>
    <div class="chatBubble">
        <div v-if="isActive" class="chatBubbleContainer">
            <div class="chatBubbleHeader">
                <font-awesome-icon icon="fa-solid fa-xmark" class="closeChatBubble"/>
                <div class="chatBubbleTittle">
                    
                </div>
            </div>
            <ChatComponent  :currentThreadID="chatViewThreadID"/>
        </div>
        <img class="finbudBot" src="../assets/botrmbg.png" alt="Finbud" @click="toggleChatBubble"/>
    </div>
</template>
<script>
import ChatComponent from './ChatComponent.vue';
export default{
    name: 'ChatBubble',
    components:{ChatComponent},
    props: {
		chatViewThreadID:String,
	},
    data(){
        return{
            isActive: false
        }
    },
    methods:{
        toggleChatBubble(){
            this.isActive = !this.isActive;
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
.chatBubbleContainer {
    position: fixed;
    height: 455px;
    width: 390px;
    bottom: 0;
    right: 10%;
    box-shadow: 0px 2px 4px rgb(0,0,0,0.9);
    background-color: white;
    z-index: 100;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

@media (max-width: 786px){
    .chatBubbleContainer {
        left: 0;
        right: 0;
        margin: 0 auto;
    }
}

.chatBubbleHeader {
    height: 8%;
    background-color: #007bff;
    box-shadow: 0px 2px 4px rgb(0,0,0,0.2);
    display: flex;
    flex-direction: row-reverse;
    font-size: 20px;
    color: #fff;
    align-items: center;
    font-family: 'Space Grotesk, sans-serif';
    padding-right: 10px;
    margin-bottom: 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.chatBubbleTittle{
    width: 100%;
    height: 100%;
    color: #fff;
    padding-left: 10px;
    font-size: 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 900;
}
.finbudBot{
    position: fixed;
    width: 60px;
    aspect-ratio: 1;
    right: 20px;
    bottom: 20px;
}
.finbudBot:hover{
    cursor: pointer
}

</style>