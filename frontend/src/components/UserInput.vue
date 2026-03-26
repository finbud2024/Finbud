<template>
	<div class="user-input-container">
		<div class="user-input">
			<div v-if="selectedFile" class="file-label left-align">
				<span>{{ selectedFile.name }}</span>
				<button type="button" @click="removeFile">×</button>
			</div>

			<div v-if="isDragging" class="drag-overlay"></div>

			<input
				type="file"
				ref="fileInput"
				@change="handleFileUpload"
				style="display: none"
			/>

			<div class="pill-row">
				<button
					type="button"
					class="pill-btn pill-btn--circle pill-btn--muted"
					@click="triggerFileInput"
					aria-label="Attach file"
				>
					<font-awesome-icon icon="fa-solid fa-plus" />
				</button>

				<input
					ref="textInput"
					type="text"
					class="pill-input"
					v-model="messageText"
					@input="handleInput"
					@keyup.enter="send"
					:placeholder="typingPlaceholder"
				/>

				<template v-if="!isTyping">
					<button
						type="button"
						class="pill-btn pill-btn--circle pill-btn--muted"
						:class="{ recording: isRecording }"
						@mousedown="startRecording"
						@mouseup="stopRecording"
						@mouseleave="stopRecording"
						@touchstart.prevent="startRecording"
						@touchend.prevent="stopRecording"
						@touchcancel.prevent="stopRecording"
						aria-label="Hold to record"
					>
						<font-awesome-icon icon="fa-solid fa-microphone" />
					</button>
					<button
						type="button"
						class="pill-btn pill-btn--circle pill-btn--primary"
						aria-label="Voice input"
						@click="onVoicePrimaryClick"
					>
						<svg
							class="waveform-icon"
							viewBox="0 0 22 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<rect x="1" y="12" width="3" height="6" rx="1.5" fill="currentColor" />
							<rect x="6.5" y="8" width="3" height="14" rx="1.5" fill="currentColor" />
							<rect x="12" y="10" width="3" height="10" rx="1.5" fill="currentColor" />
							<rect x="17.5" y="14" width="3" height="2" rx="1" fill="currentColor" />
						</svg>
					</button>
				</template>

				<button
					v-else
					type="button"
					class="pill-btn pill-btn--circle pill-btn--primary"
					@click="send"
					aria-label="Send"
				>
					<font-awesome-icon icon="fa-solid fa-arrow-up" />
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "UserInput",
	props: {
		newMessage: String,
		redirectOnSend: {
			type: Boolean,
			default: false,
		},
		/** When set, disables animated placeholder rotation (FinBud chat). */
		staticPlaceholder: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			messageText: "",
			isRecording: false,
			isTyping: false,
			mediaRecorder: null,
			audioChunks: [],
			selectedFile: null,
			isDragging: false,
			typingPlaceholder: "",
			placeholderTexts: [
				"Ask for AAPL stock price",
				"Learn about inflation",
				"Buy 5 shares of TSLA",
				"Track today's spending",
				"Add transaction: lunch 50k",
				"Find real estate in Ho Chi Minh City",
				"See top 5 cryptocurrencies",
				"Define the term IPO",
				"See this week's market trends",
				"Suggest a short-term investment portfolio",
				"Create a 6-month savings plan",
				"Calculate stock investment profit",
				"Ask for today's gold price",
				"Find company with the highest ROE",
				"Explain the P/E ratio",
				"Compare ETF and stocks",
				"Should I invest in Bitcoin right now?",
				"List growth stocks",
				"Propose a 60/30/10 investment allocation",
			],
			typingIndex: 0,
			charIndex: 0,
			isDeleting: false,
			chatMode: "",
			inputDebounceTimer: null,
		};
	},

	mounted() {
		window.addEventListener("dragover", this.onDragOver);
		window.addEventListener("dragleave", this.onDragLeave);
		window.addEventListener("drop", this.onFileDrop);
		if (this.staticPlaceholder) {
			this.typingPlaceholder = this.staticPlaceholder;
		} else {
			this.startTypingPlaceholder();
		}
	},

	beforeUnmount() {
		window.removeEventListener("dragover", this.onDragOver);
		window.removeEventListener("dragleave", this.onDragLeave);
		window.removeEventListener("drop", this.onFileDrop);
	},

	methods: {
		send() {
			if (!this.messageText.trim() && !this.selectedFile) return;

			if (this.redirectOnSend) {
				// Emit to parent to handle redirect + send
				this.$emit("chat-mode", this.chatMode);
				this.$emit("send-message", this.messageText.trim());
			} else {
				// Normal mode: just send directly
				this.$emit("chat-mode", this.chatMode);
				this.$emit("send-message", {
					message: this.messageText.trim(),
					file: this.selectedFile,
				});
			}

			console.log(`chat mode after sent from user input: ${this.chatMode}`);

			this.messageText = "";
			this.isTyping = false;
			this.selectedFile = null;
			this.$refs.fileInput.value = "";
		},
		startTypingPlaceholder() {
			if (this.staticPlaceholder) {
				this.typingPlaceholder = this.staticPlaceholder;
				return;
			}
			// Only run the animation if the input is not focused
			const textEl = this.$refs.textInput;
			if (textEl && document.activeElement === textEl) {
				return;
			}

			const currentText = this.placeholderTexts[this.typingIndex];
			const typingSpeed = this.isDeleting ? 50 : 50; // Increased from 15 to 50ms

			if (!this.isDeleting) {
				this.typingPlaceholder = currentText.substring(0, this.charIndex + 1);
				this.charIndex++;
			} else {
				this.typingPlaceholder = currentText.substring(0, this.charIndex - 1);
				this.charIndex--;
			}

			if (!this.isDeleting && this.charIndex === currentText.length) {
				setTimeout(() => {
					this.isDeleting = true;
					this.startTypingPlaceholder();
				}, 1000);
				return;
			}

			if (this.isDeleting && this.charIndex === 0) {
				this.isDeleting = false;
				this.typingIndex =
					(this.typingIndex + 1) % this.placeholderTexts.length;
			}

			setTimeout(this.startTypingPlaceholder, typingSpeed);
		},
		clearInput() {
			this.inputText = "";
		},
		triggerFileInput() {
			this.$refs.fileInput.click();
		},

		onVoicePrimaryClick() {
			if (this.isRecording) {
				this.stopRecording();
			} else {
				this.startRecording();
			}
		},

		async handleFileChange(event) {
			this.selectedFile = event.target.files[0] || null;
			if (!file) return;
		},

		async handleFileUpload(event) {
			this.selectedFile = event.target.files[0] || null;
		},

		toggleDeepResearchMode() {
			if (this.chatMode) {
				this.chatMode = "";
			} else {
				this.chatMode = "deep-research";
			}
		},

		toggleThinkMode() {
			if (this.chatMode) {
				this.chatMode = "";
			} else {
				this.chatMode = "think";
			}
		},

		toggleRAGMode() {
			if (this.chatMode) {
				this.chatMode = "";
			} else {
				this.chatMode = "rag";
			}
		},

		checkChatMode() {
			if (this.messageText.includes("#deep-research") || this.messageText.includes("#deepresearch")) {
				this.chatMode = "deep-research";
				this.messageText = this.messageText.replace("#deep-research", "").replace("#deepresearch", "");
			} else if (this.messageText.includes("#think")) {
				this.chatMode = "think";
				this.messageText = this.messageText.replace("#think", "");
			} else if (this.messageText.includes("#rag")) {
				this.chatMode = "rag";
				this.messageText = this.messageText.replace("#rag", "");
			}
		},

		handleInput() {
			// Clear any existing timer
			if (this.inputDebounceTimer) {
				clearTimeout(this.inputDebounceTimer);
			}

			// Set a new timer
			this.inputDebounceTimer = setTimeout(() => {
				this.isTyping = this.messageText.length > 0;

				// Check for agent mode triggers
				this.checkChatMode();

			}, 50); // Debounce time of 50ms
		},

		onDragOver(event) {
			event.preventDefault();
			this.isDragging = true;
		},
		onDragLeave(event) {
			event.preventDefault();
			this.isDragging = false;
		},
		onFileDrop(event) {
			event.preventDefault();
			this.isDragging = false;
			const file = event.dataTransfer.files[0];
			if (file) {
				this.selectedFile = file;
			}
		},

		removeFile() {
			this.selectedFile = null;
			this.$refs.fileInput.value = "";
		},

		// Start Recording
		async startRecording() {
			this.isRecording = true;
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			this.mediaRecorder = new MediaRecorder(stream);
			this.audioChunks = [];

			this.mediaRecorder.ondataavailable = (event) => {
				this.audioChunks.push(event.data);
			};

			this.mediaRecorder.start();
		},

		// Stop Recording & Convert Speech to Text
		async stopRecording() {
			if (!this.isRecording) return;
			this.isRecording = false;
			this.mediaRecorder.stop();

			this.mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
				const formData = new FormData();
				formData.append("file", audioBlob);
				formData.append("model", "whisper-1");

				try {
					const response = await axios.post(
						"https://api.openai.com/v1/audio/transcriptions",
						formData,
						{
							headers: {
								Authorization: `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
							},
						}
					);

					this.messageText = response.data.text; // Insert transcribed text into input box
					this.isTyping = true; // Show send button if text appears
				} catch (error) {
					console.error("Speech-to-text failed:", error);
				}
			};
		},
	},
};
</script>

<style scoped>
.drag-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(100, 100, 100, 0.3);
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--text-primary);
	font-size: 1.5rem;
	z-index: 9999;
	pointer-events: none;
	/* Allows clicks to pass through */
}

.user-input-container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	max-width: var(--content-max-width);
	margin: 0 auto;
	padding: 0 var(--content-padding-horizontal);
	box-sizing: border-box;
	background: transparent;
	height: fit-content;
	margin-bottom: 10px;
	margin-top: 10px;
}

.user-input-container::before {
	display: none;
}

.file-label {
	display: flex;
	align-items: center;
	background-color: var(--card-bg);
	color: var(--text-primary);
	border: 1px solid var(--border-color);
	border-radius: 20px;
	padding: 6px 12px;
	margin-bottom: 8px;
	font-size: 0.9rem;
	max-width: 100%; /* Allow full width */
}

.file-label span {
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: calc(100% - 30px);
}

.file-label button {
	background: none;
	border: none;
	margin-left: 8px;
	cursor: pointer;
	font-size: 1rem;
	color: var(--link-color);
}

.user-input {
	width: 100%;
	max-width: none;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
	padding: 0;
	position: relative;
	height: fit-content;
	background: transparent;
	border: none;
	box-shadow: none;
}

.left-align {
	align-self: flex-start;
	margin-left: 0;
	margin-right: auto;
}

.pill-row {
	display: flex;
	align-items: center;
	gap: 6px;
	width: 100%;
	padding: 6px 8px 6px 10px;
	box-sizing: border-box;
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 9999px;
	box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
}

.pill-input {
	flex: 1;
	min-width: 0;
	padding: 8px 6px;
	border: none;
	border-radius: 0;
	background-color: transparent;
	color: var(--text-primary);
	box-sizing: border-box;
	outline: none;
	box-shadow: none;
	font-size: 16px;
	font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
}

.pill-input:focus {
	outline: none;
	box-shadow: none;
}

.pill-btn {
	border: none;
	background: none;
	padding: 0;
	font: inherit;
}

.pill-btn--circle {
	width: 40px;
	height: 40px;
	min-width: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	cursor: pointer;
	transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.pill-btn--circle:active {
	transform: scale(0.96);
}

.pill-btn--muted {
	background-color: #f3f4f6;
	color: #111827;
}

.pill-btn--muted:hover {
	background-color: #e5e7eb;
}

.pill-btn--muted.recording {
	background-color: #fecaca;
	color: #b91c1c;
}

.pill-btn--primary {
	background-color: #111827;
	color: #ffffff;
}

.pill-btn--primary:hover {
	background-color: #000000;
}

.waveform-icon {
	width: 20px;
	height: 20px;
	display: block;
}

.chat-mode-button {
	position: relative;
	cursor: pointer;
	color: var(--link-color);
	transition: color 0.3s, transform 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
}

.agent-btn button {
	background-color: transparent;
	color: var(--black-in-light-mode);
	cursor: pointer;
	padding: 5px 10px;
	border-radius: 15px;
	transition: all 0.2s ease;
	white-space: nowrap;
	border: 2px solid var(--border-color);
}

.agent-btn button.active {
	background-color: var(--agent-button-bg-active-color);
	color: var(--white-in-light-mode);
	transform: scale(1.1);
	border: 1px solid white;
}

.agent-btn button:hover {
	color: var(--white-in-light-mode);
	background-color: var(--agent-button-bg-active-color);
	transform: scale(1.1);
}

.pill-input::placeholder {
	color: #9ca3af;
	opacity: 1;
}

:global(html.dark-mode) .pill-row {
	background-color: var(--card-bg, #1f2937);
	border-color: var(--border-color, #374151);
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

:global(html.dark-mode) .pill-btn--muted {
	background-color: #374151;
	color: #f9fafb;
}

:global(html.dark-mode) .pill-btn--muted:hover {
	background-color: #4b5563;
}

:global(html.dark-mode) .pill-btn--muted.recording {
	background-color: #7f1d1d;
	color: #fecaca;
}

:global(html.dark-mode) .pill-btn--primary {
	background-color: #f9fafb;
	color: #111827;
}

:global(html.dark-mode) .pill-btn--primary:hover {
	background-color: #e5e7eb;
}

:global(html.dark-mode) .pill-input::placeholder {
	color: #9ca3af;
}

/* Remove or comment out the container query if not needed */
/*
@container userInputComponent (max-width: 401px) {
	.user-input {
		width: 100%;
	}
}
*/
</style>
