.risk-analysis {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.risk-header {
  text-align: center;
  margin-bottom: 4rem;
}

.risk-title {
  font-size: 2.8rem;
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

.risk-title::before {
  content: '⚠️';
  font-size: 2.4rem;
  -webkit-text-fill-color: initial;
}

.risk-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.risk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.risk-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.risk-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #ef4444, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.risk-card:hover::before {
  transform: scaleX(1);
}

.risk-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.risk-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.risk-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
}

.risk-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.risk-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
}

.risk-badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.risk-badge.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.risk-badge.low {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.risk-details {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.risk-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-item {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.9rem;
  color: #666;
}

.risk-actions {
  display: flex;
  gap: 1rem;
}

.risk-btn {
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

.risk-btn.primary {
  background: black;
  color: white;
}

.risk-btn.secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #000;
}

.risk-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.risk-chart {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
}

.chart-controls {
  display: flex;
  gap: 1rem;
}

.chart-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.05);
  color: #000;
}

.chart-btn.active {
  background: black;
  color: white;
}

.chart-container {
  height: 400px;
  position: relative;
}

/* Dark mode support */
:root.dark-mode .risk-analysis {
  background: rgba(255, 255, 255, 0.02);
}

:root.dark-mode .risk-title {
  background: linear-gradient(135deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
}

:root.dark-mode .risk-description {
  color: rgba(255, 255, 255, 0.7);
}

:root.dark-mode .risk-card,
:root.dark-mode .risk-chart {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark-mode .risk-icon {
  background: rgba(239, 68, 68, 0.2);
}

:root.dark-mode .risk-name,
:root.dark-mode .metric-value,
:root.dark-mode .chart-title {
  color: white;
}

:root.dark-mode .risk-details,
:root.dark-mode .metric-label {
  color: rgba(255, 255, 255, 0.7);
}

:root.dark-mode .metric-item {
  background: rgba(255, 255, 255, 0.05);
}

:root.dark-mode .risk-btn.secondary,
:root.dark-mode .chart-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .risk-analysis {
    padding: 1rem;
  }

  .risk-title {
    font-size: 2rem;
  }

  .risk-description {
    font-size: 1rem;
  }

  .risk-grid {
    grid-template-columns: 1fr;
  }

  .risk-card,
  .risk-chart {
    padding: 1.5rem;
  }

  .risk-metrics {
    grid-template-columns: 1fr;
  }

  .risk-actions {
    flex-direction: column;
  }

  .risk-btn {
    width: 100%;
  }

  .chart-header {
    flex-direction: column;
    gap: 1rem;
  }

  .chart-controls {
    width: 100%;
    justify-content: center;
  }

  .chart-container {
    height: 300px;
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

.risk-card {
  animation: fadeIn 0.5s ease backwards;
}

.risk-card:nth-child(1) { animation-delay: 0.1s; }
.risk-card:nth-child(2) { animation-delay: 0.2s; }
.risk-card:nth-child(3) { animation-delay: 0.3s; }
.risk-card:nth-child(4) { animation-delay: 0.4s; }
</rewritten_file> 