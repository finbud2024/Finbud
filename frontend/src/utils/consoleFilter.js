/**
 * Console filter utility to suppress known TradingView console messages
 * that don't affect functionality but create noise during development
 */

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Patterns of messages to suppress
const suppressPatterns = [
  /telemetry\.tradingview\.com.*ERR_BLOCKED_BY_CLIENT/,
  /telemetry\.tradingview\.com.*Failed to fetch/,
  /Quote snapshot error: Quotes snapshot is not received/,
  /Chart\.LegendWidget:Quote snapshot error/,
  /TradingView.*telemetry/i,
];

/**
 * Check if a message should be suppressed
 * @param {string} message - Console message to check
 * @returns {boolean} - True if message should be suppressed
 */
function shouldSuppress(message) {
  if (typeof message !== "string") return false;

  return suppressPatterns.some((pattern) => pattern.test(message));
}

/**
 * Enable console filtering for TradingView messages
 */
export function enableConsoleFilter() {
  console.error = function (...args) {
    const message = args.join(" ");
    if (!shouldSuppress(message)) {
      originalConsoleError.apply(console, args);
    }
  };

  console.warn = function (...args) {
    const message = args.join(" ");
    if (!shouldSuppress(message)) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Keep log messages for debugging but filter TradingView telemetry
  console.log = function (...args) {
    const message = args.join(" ");
    if (!shouldSuppress(message)) {
      originalConsoleLog.apply(console, args);
    }
  };
}

/**
 * Disable console filtering and restore original methods
 */
export function disableConsoleFilter() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
}

/**
 * Enable filtering only in development mode
 */
export function enableDevConsoleFilter() {
  if (process.env.NODE_ENV === "development") {
    enableConsoleFilter();
    console.log("📢 TradingView console filter enabled for development");
  }
}
