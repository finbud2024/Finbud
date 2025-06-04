.agent-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.agent-header {
  text-align: center;
  margin-bottom: 4rem;
}

.agent-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #000000, #333333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.agent-title::before {
  content: '🤖';
  font-size: 2.6rem;
  -webkit-text-fill-color: initial;
}

.agent-description {
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.agent-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.agent-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.agent-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.agent-card:hover::before {
  opacity: 1;
}

.agent-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.agent-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
}

.agent-role {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.agent-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.agent-actions {
  display: flex;
  gap: 1rem;
}

.agent-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.agent-btn.primary {
  background: black;
  color: white;
}

.agent-btn.secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #000;
}

.agent-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.agent-chat {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.chat-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 1rem;
}

.message {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.message-content {
  background: rgba(0, 0, 0, 0.02);
  padding: 1rem;
  border-radius: 16px;
  max-width: 70%;
}

.message.user .message-content {
  background: black;
  color: white;
}

.message-text {
  font-size: 1rem;
  line-height: 1.5;
}

.message-time {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
}

.chat-input {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.input-field {
  flex-grow: 1;
  padding: 1rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  resize: none;
  min-height: 60px;
  max-height: 150px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.send-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Dark mode support */
:root.dark-mode .agent-container {
  background: rgba(255, 255, 255, 0.02);
}

:root.dark-mode .agent-title {
  background: linear-gradient(135deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
}

:root.dark-mode .agent-description {
  color: rgba(255, 255, 255, 0.7);
}

:root.dark-mode .agent-card,
:root.dark-mode .agent-chat {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark-mode .agent-icon,
:root.dark-mode .message-avatar {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-mode .agent-name,
:root.dark-mode .stat-value,
:root.dark-mode .chat-title {
  color: white;
}

:root.dark-mode .agent-role,
:root.dark-mode .stat-label {
  color: rgba(255, 255, 255, 0.7);
}

:root.dark-mode .stat-item,
:root.dark-mode .message-content {
  background: rgba(255, 255, 255, 0.05);
}

:root.dark-mode .agent-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

:root.dark-mode .input-field {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

:root.dark-mode .input-field:focus {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

:root.dark-mode .message.user .message-content {
  background: white;
  color: black;
}

:root.dark-mode .message-time {
  color: rgba(255, 255, 255, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .agent-container {
    padding: 1rem;
  }

  .agent-title {
    font-size: 2rem;
  }

  .agent-description {
    font-size: 1rem;
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }

  .agent-card {
    padding: 1.5rem;
  }

  .agent-chat {
    padding: 1.5rem;
  }

  .chat-messages {
    max-height: 400px;
  }

  .message-content {
    max-width: 85%;
  }

  .chat-input {
    flex-direction: column;
    gap: 0.5rem;
  }

  .send-btn {
    width: 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.agent-card {
  animation: fadeIn 0.5s ease backwards;
}

.agent-card:nth-child(1) { animation-delay: 0.1s; }
.agent-card:nth-child(2) { animation-delay: 0.2s; }
.agent-card:nth-child(3) { animation-delay: 0.3s; }
.agent-card:nth-child(4) { animation-delay: 0.4s; }

.message {
  animation: fadeIn 0.3s ease backwards;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
} 