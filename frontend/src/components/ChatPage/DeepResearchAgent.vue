<template>
	<div class="deep-research-agent">
		<div class="workflow-step-card">
			<div class="workflow-step">
				<div class="step-icon">🔬</div>
				<div class="step-content">
					<div class="step-header">
						<div class="step-title-row">
							<span class="step-indicator active">●</span>
							<h3 class="step-title">Deep Research Mode</h3>
						</div>
						<div class="step-description">
							Initializing advanced financial research pipeline...
						</div>
					</div>
					
					<div class="step-body">
						<div class="step-message">
							<span class="processing-icon">⚙️</span>
							<span class="message-text">Analyzing your request and preparing deep research...</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "DeepResearchAgent",
	props: {
		scrollToBottom: {
			type: Function,
			required: true
		},
		userPrompt: {
			type: String,
			required: true
		}
	},
	mounted() {
		// Auto-complete after a short delay to simulate processing
		setTimeout(() => {
			this.$emit('workflow-complete')
		}, 2000)
		
		this.$watch(
			() => true,
			async() => {
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			}
		)
	}
}
</script>

<style scoped>
.deep-research-agent {
	background: var(--bg-secondary);
	padding: 5px;
	max-width: 100%;
}

.workflow-step-card {
	background: var(--bg-primary);
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 10px;
	border: 1px solid var(--border-color);
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
	margin-bottom: 16px;
}

.step-title-row {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 8px;
}

.step-indicator {
	color: var(--link-color);
	font-size: 10px;
	animation: pulse 1.5s infinite;
}

.step-title {
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: var(--text-primary);
}

.step-description {
	color: var(--text-secondary);
	font-size: 14px;
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

@keyframes pulse {
	0% { transform: scale(1); opacity: 1; }
	50% { transform: scale(1.2); opacity: 0.7; }
	100% { transform: scale(1); opacity: 1; }
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
</style>
