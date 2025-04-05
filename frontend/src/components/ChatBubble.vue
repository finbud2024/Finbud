<template>
    <div class="chatBubbleLeft">
        <div class="chatBubbleContainer">
            <div class="chatBubbleHeader">
                <font-awesome-icon 
                    icon="fa-solid fa-xmark" 
                    class="closeChatBubble" 
                    @click="$emit('closeChatBubble')" />
                <div class="chatBubbleTittle">
                    <a class="link" href="/tax-calculator">Tax Summary</a>
                </div>
            </div>
            <div class="chatBubbleContent">
                <p><strong>Hey {{ userName }}! 😊 Here's a summary of your tax details:</strong></p>

                <!-- Tax Summary -->
                <p v-if="taxSummary">
                    Your estimated federal income tax for the year 2024 is:
                    <strong>${{ taxSummary.amount.toLocaleString() }}</strong>, based on an income of
                    <strong>${{ taxSummary.income.toLocaleString() }}</strong>.
                </p>

                <!-- Filing Status -->
                <p v-if="filingStatus">
                    Filing status: <strong>{{ filingStatus }}</strong>
                </p>

                <!-- Suggestions -->
                <p v-if="suggestions.length">
                    <strong>Suggestions to reduce your tax burden:</strong>
                    <ul>
                        <li v-for="(suggestion, index) in suggestions" :key="index">{{ suggestion }}</li>
                    </ul>
                </p>

                <!-- Breakdown Information -->
                <p v-if="taxBreakdownDetails.length">
                    <strong>Your Tax Breakdown:</strong>
                    <ul>
                        <li v-for="(row, index) in taxBreakdownDetails" :key="index">
                            <strong>{{ row.type }}:</strong> ${{ row.yearTaxes }}
                        </li>
                    </ul>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TaxSummaryBubble',
    props: {
        userName: {
            type: String,
            required: true,
        },
        taxSummary: {
            type: Object,
            required: true,
        },
        filingStatus: {
            type: String,
            required: true,
        },
        suggestions: {
            type: Array,
            default: () => [],
        },
        taxBreakdownDetails: {
            type: Array,
            default: () => [],
        },
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.chatBubbleLeft {
    position: fixed;
    left: 10px;  /* Position the bubble on the left */
    bottom: 10%;  /* Adjust bottom position */
    box-shadow: 0px 2px 4px rgba(0,0,0,0.7);
    background-color: white;
    z-index: 100;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    width: 400px;
    font-family: 'Space Grotesk', sans-serif;
}

@media (max-width: 786px) {
    .chatBubbleLeft {
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 100%;
        height: auto;
    }
}

.chatBubbleContainer {
    padding: 1rem;
    width: 100%;
}

.chatBubbleHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    background-color: #F1F1F1;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.closeChatBubble {
    cursor: pointer;
}

.closeChatBubble:hover {
    color: rgba(0, 0, 0, 0.5);
}

.chatBubbleTittle {
    font-size: 16px;
    font-weight: bold;
}

.chatBubbleContent {
    margin-top: 1rem;
    padding: 10px;
    font-size: 14px;
    color: #333;
}

.link {
    text-decoration: none;
    color: #007bff;
}
</style>
