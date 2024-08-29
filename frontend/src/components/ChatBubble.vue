<template>
    <div :class="{'chatBubbleContainer': true, 'active': isActive}">
        <div :class="{'chatBubbleHeader':true, 'closeChatBubble':!isActive}" @click="toggleChatBubble()">
            <font-awesome-icon v-if="isActive" icon="fa-solid fa-xmark" class="closeChatBubble"/>
            <div class="chatBubbleTittle">
                
            </div>
        </div>
        <ChatComponent  :currentThreadID="chatViewThreadID"/>
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
    transform: translateY(calc(100% - 8% - 2px));
    transition: transform 500ms ease-in;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.active {
    transform: translateY(0); /* Move up instead of down */
}

@media (max-width: 1230px){
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

.closeChatBubble:hover {
    cursor: pointer;
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
</style>