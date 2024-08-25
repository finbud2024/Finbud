<template>
    <div class="chatBubbleContainer">
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
}
</script>

<style scoped>
.chatBubbleContainer{
    position: fixed;
    height: 455px;
    width: 390px;
    bottom: 0;
    right: 10%;
    border: 2px solid red;
    background-color: white;
    z-index: 100;
}
</style>