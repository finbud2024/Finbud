<template>
	<div class="container risk-analysis-page">
		<!-- Bot Chat Component - Consistently on the right -->
		<div class="bot-chat-container" :class="{ 'bot-hidden': hidingBot }">
			<div class="bot-message" :class="{
				'message-visible': showMessage,
				'message-hidden': hidingMessage,
			}">
				<div v-if="isTyping" class="typing-animation">
					<span class="dot"></span><span class="dot"></span><span class="dot"></span>
				</div>
				<div v-else class="typed-message" v-html="typedContent"></div>
			</div>
			<img class="bot-image" src="@/assets/botrmbg.png" alt="Bot" @click="triggerBotManually" />
		</div>

		<!-- Market Data Section -->
		<section class="market-section">
			<h1 class="page-title">Market Data Center</h1>

			<!-- Sub Navigation Bar -->
			<div class="sub-nav-container">
				<div class="sub-nav">
					<button v-for="tab in ['stock', 'crypto', 'realEstate']" :key="tab"
						:class="['tab-button', { active: activeTab === tab }]" @click="activeTab = tab">
						<font-awesome-icon :icon="getTabIcon(tab)" class="tab-icon" />
						{{ formatTabName(tab) }}
					</button>
				</div>
			</div>

			<div class="market-data-content">
				<!-- Crypto Tab Content -->
				<div v-if="activeTab === 'crypto'" class="tab-content crypto-tab active-tab-content">
					<h2 class="section-title">Cryptocurrency Watch</h2>
					<div class="data-card">
						<CryptoWatch :marketSummary="marketSummary" />
					</div>

					<h2 class="section-title">Crypto Quotes</h2>
					<div class="data-card">
						<div v-if="errorCrypto" class="error-message">
							<font-awesome-icon icon="fa-solid fa-triangle-exclamation" /> {{ errorCrypto }}
						</div>
						<div v-else-if="loadingCrypto" class="loading-spinner">
							<font-awesome-icon icon="fa-solid fa-spinner" spin /> Loading Crypto Data...
						</div>
						<div v-else class="table-responsive-wrapper">
							<table class="custom-table crypto-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Rank</th>
										<th>Tier</th>
										<th>Price</th>
										<th>Symbol</th>
										<th>Change (24h)</th>
									</tr>
								</thead>
								<tbody v-if="paginatedCryptoList.length">
									<tr v-for="crypto in paginatedCryptoList" :key="crypto.uuid" class="table-row-hover">
										<td data-label="Name" class="crypto-name-cell">
											<img :src="crypto.iconUrl" :alt="crypto.name" class="crypto-icon" @error="onImageError" />
											<span>{{ crypto.name }}</span>
										</td>
										<td data-label="Rank">#{{ crypto.rank }}</td>
										<td data-label="Tier">{{ crypto.tier }}</td>
										<td data-label="Price">{{ formatPrice(crypto.price) }}</td>
										<td data-label="Symbol">{{ crypto.symbol }}</td>
										<td data-label="Change" :class="getChangeClass(crypto.change)">{{ crypto.change }}%</td>
									</tr>
								</tbody>
								<tbody v-else>
									<tr><td colspan="6" class="text-center p-4">No cryptocurrency data available.</td></tr>
								</tbody>
							</table>
							<Pagination :currentPage.sync="currentCryptoPage" :totalPages="cryptoTotalPages"
								@update:currentPage="updateCryptoCurrentPage" v-if="cryptoTotalPages > 1" />
						</div>
					</div>
				</div>

				<!-- Stock Tab Content -->
				<div v-if="activeTab === 'stock'" class="tab-content stock-tab active-tab-content">
					<h2 class="section-title">Vietnam Stock Watch</h2>
					<div class="data-card">
						<VietnamStockWatch :marketSummary="marketSummary" />
					</div>
					<h2 class="section-title">US Stock Watch</h2>
					<div class="data-card">
						<StockWatch :marketSummary="marketSummary" />
					</div>

					<h2 class="section-title">Stock Quotes</h2>
					<div class="data-card">
						<div v-if="error" class="error-message">
							<font-awesome-icon icon="fa-solid fa-triangle-exclamation" /> {{ error }}
						</div>
						<div v-else-if="loading" class="loading-spinner">
							<font-awesome-icon icon="fa-solid fa-spinner" spin /> Loading Stock Data...
						</div>
						<div v-else class="table-responsive-wrapper">
							<table class="custom-table stock-table">
								<thead>
									<tr>
										<th>Symbol</th><th>Price</th><th>Volume</th><th>Prev. Close</th><th>Change</th><th>Change %</th>
									</tr>
								</thead>
								<tbody v-if="paginatedStockQuotes.length">
									<tr v-for="stock in paginatedStockQuotes" :key="stock['01. symbol']" class="table-row-hover">
										<td data-label="Symbol">{{ stock["01. symbol"] }}</td>
										<td data-label="Price">{{ formatPrice(stock["05. price"]) }}</td>
										<td data-label="Volume">{{ stock["06. volume"] }}</td>
										<td data-label="Prev. Close">{{ formatPrice(stock["08. previous close"]) }}</td>
										<td data-label="Change" :class="getChangeClass(stock['09. change'])">{{ stock["09. change"] }}</td>
										<td data-label="Change %" :class="getChangeClass(stock['10. change percent'])">{{ stock["10. change percent"] }}</td>
									</tr>
								</tbody>
								<tbody v-else>
									<tr><td colspan="6" class="text-center p-4">No stock data available.</td></tr>
								</tbody>
							</table>
							<Pagination :currentPage.sync="currentStockPage" :totalPages="stockTotalPages"
								@update:currentPage="updateStockCurrentPage" v-if="stockTotalPages > 1"/>
						</div>
					</div>
				</div>

				<!-- Real Estate Tab Content -->
				<div v-if="activeTab === 'realEstate'" class="tab-content realestate-tab active-tab-content">
					<h2 class="section-title">Real Estate Overview</h2>
					<div class="data-card" ref="realEstateSection">
						<RealEstateMap :marketSummary="marketSummary" />
					</div>
					<h2 class="section-title">Property Listings</h2>
					<div class="data-card">
						<div v-if="errorRealEstate" class="error-message">
							<font-awesome-icon icon="fa-solid fa-triangle-exclamation" /> {{ errorRealEstate }}
						</div>
						<div v-else-if="loadingRealEstate" class="loading-spinner">
							<font-awesome-icon icon="fa-solid fa-spinner" spin /> Loading Real Estate Data...
						</div>
						<div v-else class="table-responsive-wrapper">
							<table class="custom-table estate-table">
								<thead>
									<tr>
										<th>Type</th><th>Address</th><th>Price</th><th>Status</th>
									</tr>
								</thead>
								<tbody v-if="paginatedRealEstate.length">
									<tr v-for="estate in paginatedRealEstate" :key="estate.id" class="table-row-hover">
										<td data-label="Type">{{ estate.propertyType || "N/A" }}</td>
										<td data-label="Address">{{ estate.formattedAddress || "N/A" }}</td>
										<td data-label="Price">{{ estate.lastSalePrice ? "$" + estate.lastSalePrice.toLocaleString() : "N/A" }}</td>
										<td data-label="Status">{{ estate.ownerOccupied === true ? "Off Market" : (estate.ownerOccupied === false ? "On Market" : "N/A") }}</td>
									</tr>
								</tbody>
								<tbody v-else>
									<tr><td colspan="4" class="text-center p-4">No real estate data available.</td></tr>
								</tbody>
							</table>
							<Pagination :currentPage.sync="currentRealEstatePage"
								:totalPages="realEstateTotalPages"
								@update:currentPage="updateRealEstateCurrentPage" v-if="realEstateTotalPages > 1" />
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import axios from "axios";
import Pagination from "@/components/Risk&Chat/Pagination.vue";
import RiskChat from "@/components/Risk&Chat/RiskChat.vue";
import CryptoWatch from "@/components/MarketPage/CryptoWatch.vue";
import StockWatch from "@/components/MarketPage/StockWatch.vue";
import VietnamStockWatch from "@/components/MarketPage/VietnamStockWatch.vue";
import RealEstateMap from "@/components/MarketPage/RealEstateMap.vue";
import {
	fetchStockQuote,
	fetchCryptoList,
	fetchRealEstateList
} from "@/services/marketDataService.js";
import { gptServices } from '@/services/gptServices.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
	faChartLine,
	faHouseChimney,
	faQuestionCircle,
	faTriangleExclamation,
	faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import { computed } from 'vue';

// Add icons to the library
library.add(
	faChartLine,
	faBitcoin,
	faHouseChimney,
	faQuestionCircle,
	faTriangleExclamation,
	faSpinner
);

const apiKey = process.env.VUE_APP_ALPHA_VANTAGE_KEY;
const apiKeyCrypto = process.env.VUE_APP_COINRANKING_KEY;
const apiKeyRealEstate = process.env.VUE_APP_REAL_ESTATE_KEY;

export default {
	name: "RiskAnalysis",
	components: {
		Pagination,
		CryptoWatch,
		StockWatch,
		VietnamStockWatch,
		RealEstateMap,
		RiskChat,
		FontAwesomeIcon
	},
	data() {
		return {
			activeTab: "crypto",
			showBot: true,
			hidingBot: false,
			showMessage: false,
			hidingMessage: false,
			isTyping: false,
			botMessage: "",
			typedContent: "",
			botObserver: null,
			typingSpeed: 40,
			typingTimer: null,
			botHideTimer: null,
			words: [],
			currentWordIndex: 0,

			loading: true,
			error: null,
			stockQuotes: [],
			loadingCrypto: true,
			errorCrypto: null,
			cryptoList: [],
			realEstateList: [],
			loadingRealEstate: true,
			errorRealEstate: null,
			currentRealEstatePage: 1,
			currentStockPage: 1,
			currentCryptoPage: 1,
			itemsPerPage: 10,
			marketSummary: "Loading overall market summary…",
		};
	},
	provide() {
		return {
			marketSummary: computed(() => this.marketSummary)
		}
	},
	computed: {
		stockTotalPages() {
			return Math.ceil(this.stockQuotes.length / this.itemsPerPage);
		},
		cryptoTotalPages() {
			return Math.ceil(this.cryptoList.length / this.itemsPerPage);
		},
		realEstateTotalPages() {
			return Math.ceil(this.realEstateList.length / this.itemsPerPage);
		},
		paginatedStockQuotes() {
			const start = (this.currentStockPage - 1) * this.itemsPerPage;
			return this.stockQuotes.slice(start, start + this.itemsPerPage);
		},
		paginatedCryptoList() {
			const start = (this.currentCryptoPage - 1) * this.itemsPerPage;
			return this.cryptoList.slice(start, start + this.itemsPerPage);
		},
		paginatedRealEstate() {
			const start = (this.currentRealEstatePage - 1) * this.itemsPerPage;
			return this.realEstateList.slice(start, start + this.itemsPerPage);
		},
	},
	watch: {
		activeTab(newTab, oldTab) {
			if (newTab === 'realEstate' && !this.botObserver) { 
				this.setupBotObserver();
			} else if (newTab !== 'realEstate' && this.botObserver) {
				// Optional: disconnect observer if not on real estate tab to save resources
				// this.botObserver.disconnect();
				// this.botObserver = null;
			} 
		},
	},
	async mounted() {
		const [
			stocks,
			cryptos,
			estates
		] = await Promise.all([
			fetchStockQuote(),
			fetchCryptoList(),
			fetchRealEstateList()
		]);

		this.stockQuotes = stocks;
		this.cryptoList = cryptos;
		this.realEstateList = estates;
		this.loading = false;
		this.loadingCrypto = false;
		this.loadingRealEstate = false;
		this.generateOverallMarketSummary();
		this.setupBotObserver();
	},
	beforeUnmount() {
		if (this.botObserver) {
			this.botObserver.disconnect();
		}
		if (this.typingTimer) {
			clearTimeout(this.typingTimer);
		}
		if (this.botHideTimer) {
			clearTimeout(this.botHideTimer);
		}
	},
	methods: {
		getTabIcon(tab) {
			if (tab === 'stock') return 'fa-solid fa-chart-line';
			if (tab === 'crypto') return 'fa-brands fa-bitcoin';
			if (tab === 'realEstate') return 'fa-solid fa-house-chimney';
			return 'fa-solid fa-question-circle';
		},
		onImageError(event) {
			event.target.src = require('@/assets/default-crypto.png');
		},
		getChangeClass(change) {
			const value = parseFloat(String(change).replace('%',''));
			if (value > 0) return 'text-success';
			if (value < 0) return 'text-danger';
			return 'text-neutral';
		},
		triggerBotManually() {
			if (!this.showMessage || this.hidingBot || this.hidingMessage) {
				this.startBotAnimation();
			}
		},
		setupBotObserver() {
			this.$nextTick(() => {
				if (!this.$refs.realEstateSection) return;

				if (this.botObserver) {
					this.botObserver.disconnect();
				}

				this.botObserver = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting && !this.showMessage && this.activeTab === 'realEstate') {
								this.startBotAnimation();
							}
						});
					},
					{ threshold: 0.1 }
				);
				this.botObserver.observe(this.$refs.realEstateSection);
			});
		},
		async generateOverallMarketSummary() {
			try {
				const stocks = this.stockQuotes
				const cryptos = this.cryptoList
				const estates = this.realEstateList

				const lines = [
					'**Stocks**',
					...stocks.map(s => {
						const price = parseFloat(s['05. price']).toFixed(2)
						const chg = parseFloat(s['09. change']).toFixed(2)
						return `• ${s['01. symbol']}: $${price} (${chg}%)`
					}),
					'**Crypto**',
					...cryptos.map(c => `• ${c.symbol}: $${c.price.toFixed(2)} (${c.change.toFixed(2)}%)`),
					'**Real Estate**',
					...estates.map(e => `• ${e.propertyType} at ${e.formattedAddress}: $${e.lastSalePrice.toLocaleString()}`)
				].join('\n')

				const prompt = `
Here's today's market snapshot:
${lines}

Give me a concise overall summary of these combined markets.
         `.trim()

				const resp = await gptServices([{ role: 'user', content: prompt }])
				this.marketSummary = resp.trim()
			}
			catch (err) {
				console.error(err)
				this.marketSummary = 'Unable to generate market summary right now.'
			}
		},
		formatMarketSummary() {
			let summary = "Hello! Looking for a new home?\n\n";

			if (this.realEstateList && this.realEstateList.length) {
				summary += "🏠 Here are some properties you might like:\n";
				this.realEstateList.slice(0, 3).forEach((estate) => {
					summary += `${estate.propertyType || "Home"} at ${estate.formattedAddress
						}\n`;
					if (estate.lastSalePrice && !isNaN(estate.lastSalePrice)) {
						summary += `Price: $${estate.lastSalePrice.toLocaleString()}\n`;
					}
					summary += `Status: ${estate.ownerOccupied === true ? "Inactive" : "Active"
						}\n\n`;
				});
			}

			summary += "Can I help you find your dream home?";
			return summary;
		},
		startBotAnimation() {
			if (this.typingTimer) {
				clearTimeout(this.typingTimer);
			}
			if (this.botHideTimer) {
				clearTimeout(this.botHideTimer);
			}

			this.hidingBot = false;
			this.hidingMessage = false;
			this.typedContent = "";

			this.showBot = true;

			setTimeout(() => {
				this.showMessage = true;
				this.isTyping = true;

				setTimeout(() => {
					this.isTyping = false;
					this.botMessage = this.formatMarketSummary();
					this.startRealisticTyping();
				}, 500);
			}, 400);

			if (this.botObserver) {
				this.botObserver.disconnect();
			}
		},
		startRealisticTyping() {
			this.typedContent = "";
			let charIndex = 0;

			const typeNextChar = () => {
				if (charIndex < this.botMessage.length) {
					const currentChar = this.botMessage.charAt(charIndex);

					if (currentChar === "\n") {
						this.typedContent += "<br>";
					} else {
						this.typedContent += currentChar;
					}

					charIndex++;

					let delay;

					if ([".", "!", "?"].includes(currentChar)) {
						delay = Math.random() * 100 + 80;
					} else if ([",", ":", ";"].includes(currentChar)) {
						delay = Math.random() * 60 + 40;
					} else if (currentChar === " ") {
						delay = Math.random() * 20 + 10;
					} else if (currentChar === "\n") {
						delay = Math.random() * 120 + 80;
					} else if (!isNaN(parseInt(currentChar))) {
						delay = Math.random() * 25 + 15;
					} else {
						delay =
							Math.random() < 0.3
								? Math.random() * 8 + 5
								: Math.random() * 15 + 10;
					}

					if (Math.random() < 0.02) {
						delay += Math.random() * 150 + 50;
					}

					this.typingTimer = setTimeout(typeNextChar, delay);
				} else {
					this.scheduleHideBot();
				}
			};

			setTimeout(typeNextChar, 300);
		},
		scheduleHideBot() {
			this.botHideTimer = setTimeout(() => {
				this.hideBot();
			}, 30000);
		},
		hideBot() {
			this.hidingMessage = true;

			setTimeout(() => {
				this.hidingBot = true;

				setTimeout(() => {
					this.showBot = false;
					this.showMessage = false;
					this.hidingBot = false;
					this.hidingMessage = false;
					this.typedContent = "";
				}, 500);
			}, 300);
		},
		updateCryptoCurrentPage(newPage) {
			this.currentCryptoPage = newPage;
		},
		updateStockCurrentPage(newPage) {
			this.currentStockPage = newPage;
		},
		updateRealEstateCurrentPage(newPage) {
			this.currentRealEstatePage = newPage;
		},
		formatPrice(price) {
			const num = parseFloat(price);
			if (isNaN(num)) return "N/A";
			return "$" + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		},
		formatTabName(tab) {
			if (tab === "realEstate") return "Real Estate";
			return tab.charAt(0).toUpperCase() + tab.slice(1);
		},
	},
};
</script>

<style scoped>
.risk-analysis-page {
	background-color: var(--bg-secondary, #f8fafc);
	min-height: 100vh;
	padding-top: 1rem;
}

.container {
	width: 100%;
	max-width: 100%;
	padding: 0;
	margin: 0;
	overflow-x: hidden;
	box-sizing: border-box;
}

.page-title {
	font-size: 2.5rem;
	font-weight: 700;
	text-align: center;
	margin: 1rem 0 2rem 0;
	color: var(--text-primary, #1a1a1a);
	letter-spacing: -0.5px;
}

.market-section {
	width: 100%;
	padding: 0 1rem;
	box-sizing: border-box;
}

.sub-nav-container {
	display: flex;
	justify-content: center;
	margin-bottom: 2.5rem;
	padding: 0 1rem;
}

.sub-nav {
	display: flex;
	justify-content: center;
	gap: 0.75rem;
	background-color: var(--card-bg, #ffffff);
	padding: 0.5rem;
	border-radius: 12px;
	box-shadow: var(--shadow-md, 0 4px 15px rgba(0, 0, 0, 0.08));
}

.tab-button {
	padding: 0.6rem 1.2rem;
	border: none;
	border-radius: 8px;
	font-size: 0.95rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.25s ease-out;
	background-color: transparent;
	color: var(--text-secondary, #64748b);
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.tab-button .tab-icon {
	font-size: 1.1em;
}

.tab-button:hover {
	background-color: var(--hover-bg-light, #e2e8f0);
	color: var(--text-primary, #333);
	transform: translateY(-2px);
}

.tab-button.active {
	background-color: var(--primary-color, #000000);
	color: var(--secondary-color, white);
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.market-data-content {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	background-color: transparent;
	margin: 0 auto;
	width: 100%;
	max-width: 1300px;
	padding: 0 1rem;
	box-sizing: border-box;
}

.tab-content {
	animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}

.section-title {
	font-size: 1.75rem;
	font-weight: 600;
	color: var(--text-primary, #1a1a1a);
	margin: 2rem 0 1.25rem 0;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid var(--border-color-light, #e2e8f0);
}

.data-card {
	background-color: var(--card-bg, white);
	border-radius: 16px;
	box-shadow: var(--shadow-md, 0 4px 15px rgba(0,0,0,0.08));
	padding: 1.5rem;
	margin-bottom: 2rem;
	transition: all 0.3s ease;
}

.data-card:hover {
	transform: translateY(-4px);
	box-shadow: var(--shadow-lg, 0 8px 25px rgba(0,0,0,0.12));
}

.table-responsive-wrapper {
	overflow-x: auto;
	width: 100%;
}

.custom-table {
	width: 100%;
	border-collapse: collapse;
	margin: 0;
}

.custom-table th,
.custom-table td {
	padding: 0.9rem 1rem;
	text-align: left;
	border-bottom: 1px solid var(--border-color, #e2e8f0);
	white-space: nowrap;
}

.custom-table th {
	background-color: var(--bg-secondary, #f8fafc);
	color: var(--text-primary, #1e293b);
	font-weight: 600;
	font-size: 0.9rem;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.custom-table tr:last-child td {
	border-bottom: none;
}

.table-row-hover:hover td {
	background-color: var(--hover-bg-table, #f1f5f9);
}

.crypto-icon {
	width: 28px;
	height: 28px;
	margin-right: 0.75rem;
	vertical-align: middle;
	border-radius: 50%;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.crypto-name-cell {
	display: flex;
	align-items: center;
}

.crypto-name-cell span {
	font-weight: 500;
}

.text-success {
	color: #10b981;
	font-weight: 500;
}

.text-danger {
	color: #ef4444;
	font-weight: 500;
}

.text-neutral {
	color: var(--text-secondary, #64748b);
}

.loading-spinner,
.error-message {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	color: var(--text-secondary, #64748b);
	font-size: 1.1rem;
	border-radius: 8px;
	min-height: 150px;
}

.error-message {
	color: var(--danger-text, #ef4444);
	background-color: var(--danger-bg, #fef2f2);
}

.error-message svg {
	margin-right: 0.5rem;
}

.bot-chat-container {
	position: fixed;
	bottom: 2.5rem;
	right: 2.5rem;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.75rem;
	z-index: 1050;
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.bot-chat-container.bot-hidden {
	opacity: 0;
	transform: scale(0.9);
	pointer-events: none;
}

.bot-image {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	cursor: pointer;
	transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
	box-shadow: 0 4px 12px rgba(0,0,0,0.15);
	order: 2;
}

.bot-image:hover {
	transform: scale(1.1);
	box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.bot-message {
	background-color: var(--card-bg, white);
	color: var(--text-primary);
	padding: 1rem 1.25rem;
	border-radius: 18px 18px 4px 18px;
	box-shadow: 0 5px 20px rgba(0,0,0,0.12);
	max-width: 320px;
	opacity: 0;
	transform: translateY(15px) scale(0.95);
	transition: opacity 0.25s ease-out, transform 0.25s ease-out;
	order: 1;
	position: relative;
}

.bot-message::after {
	content: '';
	position: absolute;
	bottom: 0px;
	right: 18px;
	width: 0;
	height: 0;
	border: 10px solid transparent;
	border-top-color: var(--card-bg, white);
	border-bottom: 0;
	border-right: 0;
	margin-left: -5px;
	margin-bottom: -10px;
	filter: drop-shadow(0 2px 1px rgba(0,0,0,0.05));
}

.bot-message.message-visible {
	opacity: 1;
	transform: translateY(0) scale(1);
}

.bot-message.message-hidden {
	opacity: 0;
	transform: translateY(15px) scale(0.95);
	pointer-events: none;
}

.typed-message {
	font-size: 0.95rem;
	line-height: 1.6;
}

.typing-animation {
	display: flex;
	align-items: center;
	gap: 5px;
	padding: 8px 0;
	height: 20px;
}

.dot {
	width: 7px;
	height: 7px;
	background-color: var(--text-primary, #000000);
	border-radius: 50%;
	animation: bounceDots 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounceDots {
	0%, 80%, 100% { transform: scale(0); }
	40% { transform: scale(1.0); }
}

@media (max-width: 768px) {
	.page-title { font-size: 2rem; }
	.market-section { padding: 0 0.75rem; }
	.sub-nav-container { margin-bottom: 1.5rem; padding: 0 0.5rem;}
	.sub-nav { gap: 0.5rem; padding: 0.4rem; }
	.tab-button { padding: 0.5rem 0.8rem; font-size: 0.85rem; }
	.market-data-content { padding: 0 0.5rem; }
	.section-title { font-size: 1.4rem; margin: 1.5rem 0 1rem 0; }
	.data-card { padding: 1rem; border-radius: 12px;}
	
	.custom-table th, .custom-table td { padding: 0.7rem 0.8rem; font-size: 0.85rem; }
	.crypto-icon { width: 22px; height: 22px; margin-right: 0.5rem; }

	.bot-chat-container {
		bottom: 1.5rem;
		right: 1.5rem;
		gap: 0.5rem;
	}
	.bot-image { width: 48px; height: 48px; }
	.bot-message { max-width: calc(100vw - 4rem); font-size: 0.9rem; padding: 0.8rem 1rem; }
	.bot-message::after { right: 15px; }
}

@media (max-width: 480px) {
	.page-title { font-size: 1.75rem; }
	.tab-button { gap: 0.25rem; }
	.tab-button .tab-icon { display: none; }
	.custom-table th, .custom-table td { font-size: 0.8rem; padding: 0.6rem 0.7rem; }
	.crypto-icon { width: 20px; height: 20px; }
}
</style>