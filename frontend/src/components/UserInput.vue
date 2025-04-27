<template>
	<div class="user-input-container">

		<div class="user-input">
			<!-- File label -->
			<div v-if="selectedFile" class="file-label">
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
					<div class="agent-btn">
						<button
							class="agent-button"
							:class="{ active: agentMode }"
							@click="toggleAgentMode"
						>
							Agent
						</button>
					</div>
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
import OpenAI from "openai";

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
				"Hỏi giá cổ phiếu AAPL",
				"Tìm hiểu về lạm phát",
				"Mua 5 cổ phiếu của TSLA",
				"Theo dõi chi tiêu hôm nay",
				"Thêm giao dịch: ăn trưa 50k",
				"Tìm bất động sản ở TP. HCM",
				"Xem top 5 đồng tiền ảo",
				"Định nghĩa thuật ngữ IPO",
				"Xem xu hướng thị trường tuần này",
				"Gợi ý danh mục đầu tư ngắn hạn",
				"Tạo kế hoạch tiết kiệm 6 tháng",
				"Tính toán lợi nhuận đầu tư cổ phiếu",
				"Hỏi giá vàng hôm nay",
				"Tìm công ty có ROE cao nhất",
				"Giải thích chỉ số P/E",
				"So sánh ETF và cổ phiếu",
				"Có nên đầu tư vào Bitcoin lúc này?",
				"Lên danh sách cổ phiếu tăng trưởng",
				"Đề xuất chia tỷ lệ đầu tư 60/30/10",
			],
			typingIndex: 0,
			charIndex: 0,
			isDeleting: false,
			agentMode: false,
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
				this.$emit("send-message", this.messageText.trim());
			} else {
				// Normal mode: just send directly
				this.$emit("send-message", {
					message: this.messageText.trim(),
					file: this.selectedFile,
				});
			}

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

		toggleAgentMode() {
			this.agentMode = !this.agentMode;
			console.log(
				"[UserInput] Toggling agent mode. New value:",
				this.agentMode
			);
			this.$emit("agent-mode", this.agentMode);
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
				if (
					(this.messageText.includes("#10") ||
						this.messageText.includes("#agent")) &&
					!this.agentMode // Only emit if not already active
				) {
					this.agentMode = true;
					this.messageText = this.messageText.replace("#10", "");
					this.messageText = this.messageText.replace("#agent", "");
					console.log(
						"[UserInput] Agent mode triggered by input. Emitting true."
					);
					this.$emit("agent-mode", true);
				}
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
	background-color: var(--card-bg);
	color: var(--text-primary);
	border: 1px solid var(--border-color);
	border-radius: 20px;
	padding: 6px 12px;
	margin-bottom: 8px;
	font-size: 0.9rem;
	max-width: 60%;
	overflow: hidden;
	text-overflow: ellipsis;
}

.file-label span {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	max-width: 200px;
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
.agent-btn,
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
