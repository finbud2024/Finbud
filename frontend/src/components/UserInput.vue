<template>
	<div class="user-input-container">

		<div class="user-input">
			<!-- File label -->
			<div v-if="selectedFile" class="file-label left-align">
				<span>{{ selectedFile.name }}</span>
				<button @click="removeFile">×</button>
			</div>
			<div class="input-container">
				
				<!-- Text Input Field -->
				<input
					type="text"
					v-model="messageText"
					@input="handleInput"
					@keyup.enter="send"
					:placeholder="typingPlaceholder"
				/>
			</div>
			<div class="buttons-container">
				<!-- Left side buttons -->
				<div class="left-buttons">
					<!-- File Upload Button -->
					<input
						type="file"
						ref="fileInput"
						@change="handleFileUpload"
						style="display: none"
					/>
					<div @click="triggerFileInput" class="upload-btn">
						<font-awesome-icon icon="fa-solid fa-paperclip" />
					</div>
					<!-- <div class="agent-btn">
						<button
							class="chat-mode-button"
							:class="{ active: chatMode === 'deep-research' }"
							@click="toggleDeepResearchMode"
						>
							Deep Research
						</button>
					</div>
					<div class="agent-btn">
						<button
							class="chat-mode-button"
							:class="{ active: chatMode === 'think' }"
							@click="toggleThinkMode"
						>
							Think
						</button>
					</div>
					<div class="agent-btn">
						<button
							class="chat-mode-button"
							:class="{ active: chatMode === 'rag' }"
							@click="toggleRAGMode"
						>
							RAG
						</button>
					</div> -->
				</div>

				<!-- Drop File -->
				<div v-if="isDragging" class="drag-overlay"></div>

				<div class="flex-spacer"></div>

				<!-- Right side buttons -->
				<div class="right-buttons">
					<!-- Voice Recording Button or Send Button -->
					<div
						v-if="!isTyping"
						@mousedown="startRecording"
						@mouseup="stopRecording"
						@mouseleave="stopRecording"
						class="mic-btn"
						:class="{ recording: isRecording }"
					>
						<i class="fa-solid fa-microphone-lines"></i>
					</div>

					<div v-else @click="send" class="send-btn">
						<font-awesome-icon icon="fa-solid fa-chevron-up" />
					</div>
				</div>
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
		this.startTypingPlaceholder();
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
			// Only run the animation if the input is not focused
			if (document.activeElement === this.$el.querySelector("input")) {
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
	align-items: center;
	padding: 10px 15px;
	position: relative;
	height: fit-content;
	background-color: var(--card-bg);
	border: 2px solid var(--border-color);
	border-radius: 30px;
}

.input-container {
	width: 100%;
	position: relative;
	margin-bottom: 0;
	align-items: flex-start;
}

.left-align {
  align-self: flex-start; /* Force left alignment */
  margin-left: 0; /* Remove any default margin */
  margin-right: auto; /* Push to left */
}

.user-input input[type="text"] {
	width: 100%;
	flex-grow: 1;
	padding: 10px 20px;
	border: none;
	border-radius: 0;
	background-color: transparent;
	color: var(--text-primary);
	transition: none;
	box-sizing: border-box;
	outline: none;
	box-shadow: none;
	font-size: 16px;
}

.user-input input[type="text"]:focus {
	border-color: transparent;
	outline: none;
	box-shadow: none;
}

.buttons-container {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 0 10px;
	width: 100%;
	margin-top: 10px;
}

.left-buttons,
.right-buttons {
	display: flex;
	align-items: center;
	gap: 10px;
	width: fit-content;
}

.flex-spacer {
	flex: 1;
	min-width: 20px;
}

.upload-btn,
.chat-mode-button,
.mic-btn,
.send-btn {
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

.upload-btn:hover,
.mic-btn:hover,
.send-btn:hover {
	color: var(--link-color);
	transform: scale(1.1);
}

.upload-btn:focus,
.send-btn:focus {
	outline: none;
	box-shadow: 0 0 5px var(--shadow-color);
}

/* Hiệu ứng nháy cho placeholder giống như con trỏ */
input::placeholder {
	animation: blink 1s step-end infinite;
}

@keyframes blink {
	50% {
		opacity: 0.5;
	}
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
