<template>
    <div class="EventHubContainer">
        <div class="frame1">
            <h1>Hue Nguyen</h1>
        </div>
        <div class="frame2">
            <h1>Hue Nguyen</h1>
        </div>
        <div class="frame3">
            <h1>Hieu Nguyen</h1>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'EventHub',
    data() {
        return {//state declare here

        };
    },
    computed: {

    },
    methods: {

    },
    mounted() {

    },
};
</script>
<style scoped>
.EventHubContainer {
    width: calc(100vw - 17px);
    height: fit-content;
    display: flex;
    flex-direction: column;
}

.frame1 {
    width: 100%;
    height: 100vh;
    border: 2px solid green;
    display: flex;
    justify-content: center;
    align-items: center;
}

.frame2 {
    width: 100%;
    height: 100vh;
    border: 2px solid green;
    display: flex;
    justify-content: center;
    align-items: center;
}

.frame3 {
    width: 100%;
    height: 100vh;
    border: 2px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>