<template>
	<div class="thinking-process">
		<img :src="botAvatar" class="bot-avatar" />
		<div class="thinking-content">
			<div class="thinking-accent"></div>
			<div style="flex: 1">
				<div class="thinking-header">
					<div class="thinking-icon">
						<div class="thinking-dot"></div>
						<div class="thinking-dot"></div>
						<div class="thinking-dot"></div>
					</div>
					<span class="thinking-text">Thinking...</span>
				</div>

				<TypeWriter
					v-if="showTypewriter"
					:text="thinkingText"
					:speed="200"
					@complete="handleTypingComplete"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import TypeWriter from "./TypeWriter.vue";

export default defineComponent({
	name: "ThinkingProcess",
	components: {
		TypeWriter,
	},
	props: {
		scrollToBottom: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			showTypewriter: false,
			thinkingText: "",
			elapsed: 0,
			timer: null,
			showBadge: false,
			botAvatar: require("@/assets/botrmbg.png"),
		};
	},
	mounted() {
		this.thinkingText =
			"Okay, the user asked about recent inflation in the U.S. Let me recall what I know. The last data I remember is from around mid-2023. Inflation had been high in 2022, peaking at around 9% for CPI. The Federal Reserve raised interest rates several times to combat it. By mid-2023, inflation started to decrease but was still above the Fed's 2% target. Wait, the user might be asking for the very latest numbers. But since my knowledge cutoff is July 2024, I should check what's available up to that point. Let me think. In 2023, inflation was cooling down. For example, the CPI for June 2023 was 3% year-over-year, down from previous months. The core CPI, excluding food and energy, was higher, maybe around 4.8%. The user might want to know the current rate, but since I can't access real-time data, I should mention the latest available data up to July 2024. Also, possible reasons for the recent trends: supply chain improvements, lower energy prices, Fed's rate hikes. However, core inflation remains sticky due to services and housing costs. They might also be interested in how this affects everyday life, like consumer prices, wages, or the Fed's future actions. Maybe they're concerned about their expenses or investments. It's important to explain the factors driving inflation and the Fed's response. Also, mention that while overall inflation is down, some areas are still problematic. Highlight the difference between headline and core inflation. Suggest checking the latest reports from BLS or Fed for the most current data.";
		this.showTypewriter = true;
		this.startTimer();
	},
	watch: {
		showTypewriter(newVal) {
			if (newVal) {
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			}
		},
	},
	methods: {
		handleTypingComplete() {
			this.$emit("thinking-complete");
			this.stopTimer();
			this.showBadge = true;
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},
		startTimer() {
			this.stopTimer();
			this.elapsed = 0;
			this.showBadge = false;
			this.timer = setInterval(() => {
				this.elapsed += 1;
			}, 1000);
		},
		stopTimer() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
	},
});
</script>

<style scoped>
.thinking-process {
	display: flex;
	color: var(--black-in-light-mode);
	margin: 8px 0;
	position: relative;
	align-items: flex-start;
	gap: 10px;
}

.bot-avatar {
	position: relative;
	bottom: 0;
	width: 41px;
	aspect-ratio: 1;
	border-radius: 50%;
	margin-left: 1%;
}

.thinking-content {
	display: flex;
	flex: 1;
	opacity: 0.7;
}

.thinking-accent {
	width: 6px;
	border-radius: 8px 0 0 8px;
	background-color: var(--black-in-light-mode);
	margin-right: 16px;
	flex-shrink: 0;
}

.thinking-header {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
}

.thinking-icon {
	display: flex;
	gap: 4px;
	margin-right: 8px;
}

.thinking-dot {
	width: 8px;
	height: 8px;
	background-color: var(--text-color);
	border-radius: 50%;
	animation: thinking 1.4s infinite ease-in-out;
}

.thinking-dot:nth-child(1) {
	animation-delay: -0.32s;
}
.thinking-dot:nth-child(2) {
	animation-delay: -0.16s;
}

@keyframes thinking {
	0%,
	80%,
	100% {
		transform: scale(0);
	}
	40% {
		transform: scale(1);
	}
}

.thinking-text {
	font-weight: 500;
	color: var(--text-color);
}

.thinking-steps {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.thinking-step {
	background-color: var(--bg-color);
	border-radius: 6px;
	padding: 12px;
}

.step-header {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.step-number {
	background-color: var(--primary-color);
	color: white;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 8px;
	font-size: 12px;
}

.step-title {
	font-weight: 500;
	color: var(--text-color);
}

.step-content {
	color: var(--text-color);
	line-height: 1.5;
}
</style>
