<template>
    <div class="EventHubContainer">
        <div class="frame1">
            <div class="event-navbar-container">
                <div class="event-navbar">
                    <input type="text" v-model="searchQuery" placeholder="Search" @input="filteredResults" class="search-bar"/>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon"/>
                </div>
               
                <div class="event-navbar nav-btn">
                    <div class="event-btn">
                        <font-awesome-icon icon="fa-solid fa-location-dot" class="btn-icon"/>
                        <p>Explore near you</p>
                    </div>
                    <div class="event-btn">
                        <div class="round-star">
                            <font-awesome-icon icon="fa-regular fa-star" class="btn-icon"/>
                        </div>
                        <p>Saved</p>
                    </div>
                    <div class="event-btn">
                        <font-awesome-icon icon="fa-regular fa-bell" class="btn-icon"/>
                        <p>All Events</p>
                    </div>
                </div>
            </div>
            <div class="event-banner">Banner</div>
            <div class="event-category">Category</div>
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
import { result } from 'lodash';

export default {
    name: 'EventHub',
    data() {
        return {//state declare here
            searchQuery:'',
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
}

.event-navbar-container {
    display: flex;
    flex-direction: row;
}

.event-navbar {
    position: relative;
    width: 50%;
    margin: 10px;
}

.search-bar {
    width: 70%;
    font-size: 18px;
    padding: 10px;
    margin: 20px;
    box-sizing: border-box;
    z-index: 100;
    border-radius: 20px;
}

.search-icon {
    position: absolute;
    right: 230px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    cursor: pointer;
}

.nav-btn {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    background-color: rgb(225, 225, 226);
}

.event-btn {
    margin-top: 10px;
}

.event-btn:hover {
    color: #007bff;
}

.btn-icon {
    font-size: 20px;
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