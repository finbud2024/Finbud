<template>
    <div class="quiz-container">
        <div class="popup-layout">
            <div class="message">
                <img class="avatar" :src="botAvatar" alt="">
                <div class="message-content" ref="messageContent">
                    <!-- <div>Here are some related topic for you! Choose from the suggestion below, or explore all 15
                        options categorized by <span class="easy">easy</span>, <span class="medium">medium</span>, and
                        <span class="hard">hard</span>
                    </div> -->
                </div>
            </div>
            <div class="topics">
                <div v-for="topic in relatedTopics" :key="topic.difficulty">
                    <ul v-for="question in topic.content" :key="question">
                        <li :class="['btn', 'button-' + topic.difficulty]">{{question}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gsap from 'gsap'
import TextPlugin from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);
export default {
    name: 'Local',
    data() {
        return {
            botAvatar: require('@/assets/CHI/chi.jpg'),
            relatedTopics: [
                {
                    difficulty: 'easy',
                    content: [
                        "Summoner's Rift",
                        "Champion",
                        "Minion",
                        "Turret",
                        "Runes"
                    ]
                },
                {
                    difficulty: 'medium',
                    content: [
                        "Dragon",
                        "Baron Nashor",
                        "Jungle",
                        "ADC",
                        "Support"
                    ]
                },
                {
                    difficulty: 'hard',
                    content: [
                        "Macro Play",
                        "Wave Management",
                        "Kiting",
                        "Split Pushing",
                        "Objective Control"
                    ]
                }
            ]

        }
    },
    methods: {
        animateTyping() {
            const messageText =
                'Here are some related topics for you! Choose from the suggestion below, or explore all 15 options categorized by easy, medium, and hard';
            const messageArray = messageText.split('');
            console.log(messageArray);
            const messageContainer = this.$refs.messageContent;

            const timeline = gsap.timeline();

            messageArray.forEach((char, index) => {
                timeline.add(
                    () => {
                        messageContainer.innerHTML += char;
                    },
                    index * 0.015
                );
            });
        }
    },
    mounted() {
        // gsap.from(".btn", {
        //     duration: 1,
        //     opacity: 0,
        //     y: -200,
        //     ease: "ease"
        // })

        this.animateTyping();

    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.quiz-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(0, 0, 0, 0.4);
    font-family: 'Montserrat', sans-serif;
}

.popup-layout {
    height: 80%;
    width: 80%;
    background-color: rgb(245, 235, 234);

}

.avatar {
    width: 41px;
    aspect-ratio: 1;
    border-radius: 50%;
}

.message {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    overflow: hidden;
    word-wrap: break-word;
    padding: 50px 18% 50px 15%;
}

.message-content {
    font-size: clamp(0.75rem,
            5.6vw,
            1rem);
    /*12px, x/3.2 vw, 20px ___ 1vw = 3.2px*/
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 16px;
    background-color: #007bff;
    color: white;
    /* background-color: papayawhip;
          color: black; */
    text-align: left;
    white-space: pre-wrap;
    line-height: 1.3;
}

.easy {
    color: green;
}

.medium {
    color: rgb(242, 179, 43);
}

.hard {
    color: red;
}

.topics {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.topics div {
    display: flex;
    flex-direction: row;
    align-items: space-between;
    max-width: 80%;
    gap: 15px;
}

.topics ul {
    list-style-type: none;
    padding: 0;
}

.topics ul li {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.3;
}

/* Button */
/* CASE 1 */
.btn {
    overflow: hidden;
    background: transparent;
    position: relative;
    padding: 8px 20px;
    width: 100px;
    height: 40px;
    border-radius: 16px;
    cursor: pointer;
    transition: 0.2s ease;
    z-index: 1;
    color: black;
    position: relative;
    font-weight: bolder;
}

.btn:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 0%;
    height: 100%;
    z-index: -1;
    transition: 0.2s ease;
}

.btn:hover:before {
    width: 100%;
}

.button-easy {
    background-color: rgb(0, 100, 0, 0.5);
    border-bottom: 4px solid rgb(0, 100, 0);
    /*border: 4px solid #2ccf6dab;*/
}

.button-medium {
    background-color: rgb(209, 77, 0, 0.5);
    border-bottom: 4px solid rgb(209, 77, 0);
    /*border: 4px solid hwb(41 17% 5%); */
}

.button-hard {
    background-color: rgb(199, 92, 110, 0.5);
    border-bottom: 4px solid rgb(199, 92, 110);
    /*border: 4px solid rgb(199, 92, 110);*/
}

.button-easy:before {
    background: rgb(0, 100, 0);
}

.button-medium:before {
    background: rgb(209, 77, 0);
}

.button-hard:before {
    background: rgb(199, 92, 110);
}

.button-easy:hover {
    color: #fff;
    background: rgb(0, 100, 0);
}

.button-medium:hover {
    color: #fff;
    background: rgb(209, 77, 0);
}

.button-hard:hover {
    color: #fff;
    background: #f23b3b;
}
</style>