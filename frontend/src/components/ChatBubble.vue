<template>
    <div :class="{'chatBubbleContainer': true, 'active': isActive}">
        <div :class="{'chatBubbleHeader':true, 'closeChatBubble':!isActive}" @click="toggleChatBubble()">
            <font-awesome-icon v-if="isActive" icon="fa-solid fa-xmark" class="closeChatBubble"/>
            <div class="chatBubbleTittle">
                FinBud Bot
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
.chatBubbleContainer {
    position: fixed;
    height: 455px;
    width: 390px;
    bottom: 0;
    right: 10%;
    border: 2px solid black;
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

.chatBubbleHeader {
    height: 8%;
    background-color: rgba(0, 123, 255, 0.7);
    display: flex;
    flex-direction: row-reverse;
    font-size: 30px;
    align-items: center;
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
    color: white;
    padding-left: 10px;
    font-size: 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>