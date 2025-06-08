<template>
    <div class="chatBubble">
        <div class="chatBubbleContainer">
            <div class="chatBubbleHeader">
                <font-awesome-icon icon="fa-solid fa-xmark" class="closeChatBubble" @click="$emit('closeChatBubble')"/>
                <div class="chatBubbleTittle">
                    <a class="link" href="/chat-view">Finbud</a>
                </div>
            </div>
            <ChatComponent  :currentThreadID="chatViewThreadID"/>
        </div>
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
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
.chatBubbleContainer {
    position: fixed;
    height: 455px;
    width: 391px;
    bottom: 0;
    right: 7.5%;
    box-shadow: 0px 2px 4px rgb(0,0,0,0.7);
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
    background-color: #fff;
    box-shadow: 0px 2px 4px rgb(0,0,0,0.2);
    display: flex;
    flex-direction: row-reverse;
    font-size: 20px;
    color: rgb(0,0,0,0.3);
    align-items: center;
    padding-right: 10px;
    margin-bottom: 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.closeChatBubble{
    cursor: pointer;
}

.closeChatBubble:hover{
    color: rgb(0,0,0,0.5);
}

.chatBubbleTittle{
    width: 100%;
    height: 100%;
    color: var(--text-primary);
    padding-left: 10px;
    font-size: 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
}

.link{
    text-decoration: none;
    color: #000;
}

</style>