// Quick test for symbol validator changes
import { validateAndFormatSymbol } from "./src/utils/symbolValidator.js";

console.log("Testing symbol validator without automatic mapping:");
console.log("AAPL (autoMap=false):", validateAndFormatSymbol("AAPL", false));
console.log("AAPL (autoMap=true):", validateAndFormatSymbol("AAPL", true));
console.log(
  "NASDAQ:AAPL (autoMap=false):",
  validateAndFormatSymbol("NASDAQ:AAPL", false)
);
console.log(
  "UNKNOWNSTOCK (autoMap=false):",
  validateAndFormatSymbol("UNKNOWNSTOCK", false)
);
console.log(
  "UNKNOWNSTOCK (autoMap=true):",
  validateAndFormatSymbol("UNKNOWNSTOCK", true)
);

console.log("\nDefault behavior (autoMap defaults to false):");
console.log("AAPL (default):", validateAndFormatSymbol("AAPL"));
console.log("TSLA (default):", validateAndFormatSymbol("TSLA"));
