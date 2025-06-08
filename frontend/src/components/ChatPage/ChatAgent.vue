<template>
	<div class="agent-workflow">
		<div class="workflow-steps">
			<!-- Step 1 -->
			<div class="workflow-step-card">
				<div class="workflow-step">
					<div class="step-icon">📄</div>
					<div class="step-content">
						<div class="step-header">
							<div class="step-title-row">
								<span
									class="step-indicator"
									:class="{
										active: processingSteps.step1,
										completed: completedSteps.step1,
									}"
									>●</span
								>
								<h3 class="step-title">Doing Step 1</h3>
							</div>
							<button class="agent-action-button">
								<span class="button-icon">🤖</span>
								<span>Agent Action 1</span>
							</button>
						</div>
						<div
							class="step-body"
							v-if="processingSteps.step1 || completedSteps.step1"
						>
							<div class="step-message">
								<span v-if="processingSteps.step1" class="processing-icon"
									>⚙️</span
								>
								<span v-else-if="completedSteps.step1" class="completed-icon"
									>✓</span
								>
								<span class="message-text">{{
									completedSteps.step1
										? completedMessages.step1
										: processingMessages.step1
								}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Step 2 -->
			<div v-if="completedSteps.step1" class="workflow-step-card">
				<div class="workflow-step">
					<div class="step-icon">✂️</div>
					<div class="step-content">
						<div class="step-header">
							<div class="step-title-row">
								<span
									class="step-indicator"
									:class="{
										active: processingSteps.step2,
										completed: completedSteps.step2,
									}"
									>●</span
								>
								<h3 class="step-title">Doing Step 2</h3>
							</div>
							<button class="agent-action-button">
								<span class="button-icon">🤖</span>
								<span>Agent Action 2</span>
							</button>
						</div>
						<div
							class="step-body"
							v-if="processingSteps.step2 || completedSteps.step2"
						>
							<div class="step-message">
								<span v-if="processingSteps.step2" class="processing-icon"
									>⚙️</span
								>
								<span v-else-if="completedSteps.step2" class="completed-icon"
									>✓</span
								>
								<span class="message-text">{{
									completedSteps.step2
										? completedMessages.step2
										: processingMessages.step2
								}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Step 3 -->
			<div v-if="completedSteps.step2" class="workflow-step-card">
				<div class="workflow-step">
					<div class="step-icon">🔍</div>
					<div class="step-content">
						<div class="step-header">
							<div class="step-title-row">
								<span
									class="step-indicator"
									:class="{
										active: processingSteps.step3,
										completed: completedSteps.step3,
									}"
									>●</span
								>
								<h3 class="step-title">Doing Step 3</h3>
							</div>
							<button class="agent-action-button">
								<span class="button-icon">🤖</span>
								<span>Agent Action 3</span>
							</button>
						</div>
						<div
							class="step-body"
							v-if="processingSteps.step3 || completedSteps.step3"
						>
							<div class="step-message">
								<span v-if="processingSteps.step3" class="processing-icon"
									>⚙️</span
								>
								<span v-else-if="completedSteps.step3" class="completed-icon"
									>✓</span
								>
								<span class="message-text">{{
									completedSteps.step3
										? completedMessages.step3
										: processingMessages.step3
								}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Step 4 -->
			<div v-if="completedSteps.step3" class="workflow-step-card">
				<div class="workflow-step">
					<div class="step-icon">📝</div>
					<div class="step-content">
						<div class="step-header">
							<div class="step-title-row">
								<span
									class="step-indicator"
									:class="{
										active: processingSteps.step4,
										completed: completedSteps.step4,
									}"
									>●</span
								>
								<h3 class="step-title">Doing Step 4</h3>
							</div>
							<button class="agent-action-button">
								<span class="button-icon">🤖</span>
								<span>Agent Action 4</span>
							</button>
						</div>
						<div
							class="step-body"
							v-if="processingSteps.step4 || completedSteps.step4"
						>
							<div class="step-message">
								<span v-if="processingSteps.step4" class="processing-icon"
									>⚙️</span
								>
								<span v-else-if="completedSteps.step4" class="completed-icon"
									>✓</span
								>
								<span class="message-text">{{
									completedSteps.step4
										? completedMessages.step4
										: processingMessages.step4
								}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Step 5 -->
			<div v-if="completedSteps.step4" class="workflow-step-card">
				<div class="workflow-step">
					<div class="step-icon">🔗</div>
					<div class="step-content">
						<div class="step-header">
							<div class="step-title-row">
								<span
									class="step-indicator"
									:class="{
										active: processingSteps.step5,
										completed: completedSteps.step5,
									}"
									>●</span
								>
								<h3 class="step-title">Doing Step 5</h3>
							</div>
							<button class="agent-action-button">
								<span class="button-icon">🤖</span>
								<span>Agent Action 5</span>
							</button>
						</div>
						<div
							class="step-body"
							v-if="processingSteps.step5 || completedSteps.step5"
						>
							<div class="step-message">
								<span v-if="processingSteps.step5" class="processing-icon"
									>⚙️</span
								>
								<span v-else-if="completedSteps.step5" class="completed-icon"
									>✓</span
								>
								<span class="message-text">{{
									completedSteps.step5
										? completedMessages.step5
										: processingMessages.step5
								}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "ChatAgent",
    props: {
        scrollToBottom: {
            type: Function,
            required: true
        }
    },
	data() {
		return {
			active: false,
			processingSteps: {
				step1: false,
				step2: false,
				step3: false,
				step4: false,
				step5: false,
			},
			completedSteps: {
				step1: false,
				step2: false,
				step3: false,
				step4: false,
				step5: false,
			},
			processingMessages: {
				step1: "Loading financial data...",
				step2: "Processing financial data...",
				step3: "Extracting key financial indicators...",
				step4: "Generating comprehensive summary...",
				step5: "Finding related financial resources...",
			},
			completedMessages: {
				step1: "Financial data loaded successfully",
				step2: "Financial data processed successfully",
				step3: "Key financial indicators extracted successfully",
				step4: "Comprehensive summary generated successfully",
				step5: "Related financial resources found successfully",
			},
		};
	},
    mounted() {
		this.startWorkflow();
        this.$watch(
            () => [this.processingSteps.step1, this.processingSteps.step2, this.processingSteps.step3, this.processingSteps.step4, this.processingSteps.step5],
            async() => {
                this.$nextTick(() => {
                    this.scrollToBottom();
                })
            }
        )
    },
	methods: {
		async startWorkflow(isComplete = false) {
			// Reset all steps if starting new workflow
			if (!isComplete) {
				this.processingSteps = {
					step1: false,
					step2: false,
					step3: false,
					step4: false,
					step5: false,
				};
				this.completedSteps = {
					step1: false,
					step2: false,
					step3: false,
					step4: false,
					step5: false,
				};
			}

			// Helper function to simulate step completion
			const completeStep = (stepName) => {
				return new Promise((resolve) => {
					setTimeout(() => {
						this.processingSteps[stepName] = false;
						this.completedSteps[stepName] = true;
						resolve();
					}, 5000); // 1 second delay for demo
				});
			};

			// Start the workflow
			try {
				// Step 1: Loading
				this.processingSteps.step1 = true;
				await completeStep("step1");

				// Step 2: Splitting
				this.processingSteps.step2 = true;
				await completeStep("step2");

				// Step 3: Extraction
				this.processingSteps.step3 = true;
				await completeStep("step3");

				// Step 4: Summary
				this.processingSteps.step4 = true;
				await completeStep("step4");

				// Step 5: Recommendations
				this.processingSteps.step5 = true;
				await completeStep("step5");

				// Workflow complete
				console.log("Agent workflow completed");
				this.$emit("workflow-complete");
			} catch (error) {
				console.error("Error in agent workflow:", error);
				// Optionally emit an error event
				// this.$emit('workflow-error', error);
			}

		},
	},
};
</script>

<style scoped>

.agent-workflow {
	background: var(--bg-secondary);
	padding: 5px;
	max-width: 100%;
}

.workflow-steps {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.workflow-step-card {
	border-radius: 10px;
	transition: all 0.3s ease;
	opacity: 0;
	transform: translateY(10px);
	animation: fadeInStep 0.5s ease forwards;
}

.workflow-step-card:hover {
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

@keyframes fadeInStep {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Add transition for v-if/v-show */
.workflow-steps > * {
	transition: all 0.3s ease;
}

/* Step body styling with fade animation */
.step-body {
	padding-top: 8px;
	opacity: 0;
	animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.workflow-step {
	display: flex;
	gap: 16px;
	align-items: flex-start;
}

.step-icon {
	font-size: 22px;
	min-width: 24px;
	margin-top: 2px;
	color: var(--text-secondary);
}

.step-content {
	flex: 1;
}

.step-header {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	margin-bottom: 10px;
}

.step-title-row {
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
}

.step-indicator {
	color: var(--text-tertiary);
	font-size: 10px;
	transition: color 0.3s ease;
}

.step-indicator.active {
	color: var(--link-color);
	animation: pulse 1.5s infinite;
}

.step-indicator.completed {
	color: #34c759;
}

h3.step-title {
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: var(--text-primary);
	flex-grow: 1;
}

.agent-action-button {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background-color: var(--black-in-light-mode);
	color: var(--white-in-light-mode);
	border: none;
	padding: 4px 12px;
	border-radius: 9999px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s ease;
	white-space: nowrap;
}

.agent-action-button:hover {
	background-color: var(--agent-button-bg-active-color);
}

.agent-action-button .button-icon {
	font-size: 16px;
}

.step-message {
	display: flex;
	align-items: center;
	gap: 8px;
	color: var(--text-secondary);
	font-size: 14px;
	padding-left: 10px;
	min-height: 20px;
}

.processing-icon {
	animation: spin 2s linear infinite;
	display: inline-block;
}

.completed-icon {
	color: #34c759;
	font-weight: bold;
}

@keyframes pulse {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.2);
		opacity: 0.7;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* Remove the old bot-thinking-container styles since we're using the new icons */
.bot-thinking-container {
	display: none;
}
</style>
