.investment-row {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease;
}

.stock-info-container {
  flex: 2;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.stock-info-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.action-container {
  flex: 1;
  animation: fadeInRight 0.5s ease;
}

.action-form {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.action-form h3 {
  color: #000000;
  font-size: 1.25rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.action-form input,
.action-form select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #000000;
}

.action-form input:focus,
.action-form select:focus {
  border-color: #000000;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.clear-btn,
.preview-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.clear-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #000000;
}

.clear-btn:hover {
  background: #f9fafb;
  border-color: #000000;
}

.preview-btn {
  background: #000000;
  border: 1px solid #000000;
  color: #ffffff;
}

.preview-btn:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
}

/* Loading Effects */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.loading {
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Transaction History Section */
.transactions {
  margin-top: 30px;
  animation: fadeInUp 0.6s ease;
}

.transaction-form {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.transaction-form:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Account Performance Section */
.account-performance {
  margin-top: 30px;
  animation: fadeInUp 0.7s ease;
}

.account-info-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.account-info-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat {
  padding: 15px;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.stat:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.stat .label {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 5px;
  display: block;
}

.stat .value {
  color: #000000;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Loading States */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Loading dots animation */
.loading-dots span {
  animation: loadingDots 1.4s infinite;
  opacity: 0;
  display: inline-block;
}

.loading-dots span:nth-child(1) { animation-delay: 0s; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes loadingDots {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
} 