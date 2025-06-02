import express from "express";

// Create a router
const multiplierSimulatorRoute = express.Router();

// In-memory storage for simulations
const sessions = {};

// Helper function for random normal distribution
function randomNormal(mean = 0, std = 1) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * std + mean;
}

class TradingSimulator {
  constructor(sessionId) {
    // Store session ID for API
    this.sessionId = sessionId;

    // Parameters
    this.rounds = 20;
    this.simulation_time = 60; // minutes
    this.simulation_steps = this.simulation_time * 2; // 30-second steps
    this.real_time_multiplier = 1 / 6; // Speed up x6
    this.teams = {
      A: {
        oxygen: new Array(this.rounds).fill(0),
        lithium: new Array(this.rounds).fill(0),
      },
      B: {
        oxygen: new Array(this.rounds).fill(0),
        lithium: new Array(this.rounds).fill(0),
      },
    };

    // Generate random values for past collection rounds
    this.generate_random_samples();

    // Initialize simulation variables
    this.multiplier_values = [];
    this.time_values = [];
    this.market_trades = [];
    this.user_trades = [];
    this.side_trades = [];
    this.side_trade_results = {};
    this.current_time = 0;
    this.predicted_final_multiplier = 1;
    this.current_multiplier = 1;
    this.trade_active = false;

    this.resource_means = this.calculate_resource_means();
    this.wallet_balance = 1000;

    // Status variables
    this.collection_progress = {
      A_oxygen: 0,
      A_lithium: 0,
      B_oxygen: 0,
      B_lithium: 0,
      next_A_oxygen: this.generate_next_time(this.resource_means.A_oxygen),
      next_A_lithium: this.generate_next_time(this.resource_means.A_lithium),
      next_B_oxygen: this.generate_next_time(this.resource_means.B_oxygen),
      next_B_lithium: this.generate_next_time(this.resource_means.B_lithium),
    };

    // For API compatibility
    this.active = false;
    this.paused = false;
    this.displayed_time_index = 0; // Track which timestep is currently being displayed

    // Storage for pre-generated simulation data
    this.simulation_data = [];
    this.historical_collections = [];

    // Initial data
    this.initial_data = this.display_initial_data();
  }

  generate_random_samples() {
    for (const resource of ["oxygen", "lithium"]) {
      for (const team of ["A", "B"]) {
        const mean_value = Math.floor(Math.random() * 9) + 2; // random integer between 2 and 10
        const deviations = Array.from({ length: this.rounds }, () =>
          randomNormal(0, 2)
        );
        const samples = deviations.map((dev) =>
          Math.max(0, Math.round(mean_value + dev))
        );
        this.teams[team][resource] = samples;
        this.teams[team][`total_${resource}`] = samples.reduce(
          (a, b) => a + b,
          0
        );
      }
    }
  }

  display_initial_data() {
    // Show the collected data from the previous rounds in a structured table format
    console.log("Historical Collection Data\n");

    // Create header
    let table = "Historical Collection Data\n\n";
    table +=
      "Round  A's Oxygen Crystals  A's Lithium Shards  B's Oxygen Crystals  B's Lithium Shards\n";

    // Add data rows
    for (let i = 0; i < this.rounds; i++) {
      table += `${i + 1}`.padEnd(7);
      table += `${this.teams["A"]["oxygen"][i]}`.padEnd(21);
      table += `${this.teams["A"]["lithium"][i]}`.padEnd(20);
      table += `${this.teams["B"]["oxygen"][i]}`.padEnd(21);
      table += `${this.teams["B"]["lithium"][i]}\n`;
    }

    // Add totals
    const a_oxygen_total = this.teams["A"]["oxygen"].reduce((a, b) => a + b, 0);
    const a_lithium_total = this.teams["A"]["lithium"].reduce(
      (a, b) => a + b,
      0
    );
    const b_oxygen_total = this.teams["B"]["oxygen"].reduce((a, b) => a + b, 0);
    const b_lithium_total = this.teams["B"]["lithium"].reduce(
      (a, b) => a + b,
      0
    );

    table += "Total".padEnd(7);
    table += `${a_oxygen_total}`.padEnd(21);
    table += `${a_lithium_total}`.padEnd(20);
    table += `${b_oxygen_total}`.padEnd(21);
    table += `${b_lithium_total}`;

    return table;
  }

  // New method to pre-generate all simulation data
  generate_simulation_data() {
    console.log("Pre-generating all simulation data");

    // Reset simulation variables
    this.multiplier_values = [];
    this.time_values = [];
    this.history = [];
    this.historical_collections = [];
    this.simulation_data = [];

    // Initialize collection progress
    let collection_progress = {
      A_oxygen: 0,
      A_lithium: 0,
      B_oxygen: 0,
      B_lithium: 0,
    };

    // Store side trades separately for each time step
    let all_side_trades = [];

    // Calculate mean resources from historical data
    const mean_A_oxygen = Math.floor(
      this.teams["A"]["oxygen"].reduce((a, b) => a + b, 0) / this.rounds
    );
    const mean_A_lithium = Math.floor(
      this.teams["A"]["lithium"].reduce((a, b) => a + b, 0) / this.rounds
    );
    const mean_B_oxygen = Math.floor(
      this.teams["B"]["oxygen"].reduce((a, b) => a + b, 0) / this.rounds
    );
    const mean_B_lithium = Math.floor(
      this.teams["B"]["lithium"].reduce((a, b) => a + b, 0) / this.rounds
    );

    // Calculate expected intervals between resource collection
    const expected_intervals = {
      A_oxygen: this.simulation_time / mean_A_oxygen,
      A_lithium: this.simulation_time / mean_A_lithium,
      B_oxygen: this.simulation_time / mean_B_oxygen,
      B_lithium: this.simulation_time / mean_B_lithium,
    };

    // Store expected resources (used for predictions)
    const expected_resources = {
      A_oxygen: mean_A_oxygen,
      A_lithium: mean_A_lithium,
      B_oxygen: mean_B_oxygen,
      B_lithium: mean_B_lithium,
    };

    // Threshold to prevent cases of predicted market multiplier = 0
    const market_multiplier_threshold = 3;

    // Generate random collection times
    const next_collections = {};
    for (const [key, value] of Object.entries(expected_intervals)) {
      next_collections[key] = value * (Math.random() * 1.5 + 0.25); // uniform between 0.25 and 1.75
    }

    // Keep track of side trades that will expire
    let side_trades = [];

    // Generate data for each time step
    for (let t = 0; t < this.simulation_steps; t++) {
      const current_time = (t + 1) * 0.5; // 30 second increments

      // Check for resource collection
      for (const resource in expected_intervals) {
        if (current_time >= next_collections[resource]) {
          // Add new resource to collection
          collection_progress[resource] += 1;

          // Generate new time for next resource
          next_collections[resource] +=
            expected_intervals[resource] * (Math.random() * 1.5 + 0.25);
        }

        // Update expectation for this resource
        const remaining_time = this.simulation_time - current_time;
        expected_resources[resource] =
          collection_progress[resource] +
          (remaining_time / this.simulation_time) *
            expected_resources[resource];
      }

      // Calculate predicted final multiplier - using original code's exact structure
      this.predicted_final_multiplier = Math.round(
        (expected_resources["A_oxygen"] + expected_resources["B_oxygen"]) *
          (expected_resources["A_lithium"] + expected_resources["B_lithium"])
      );

      // Apply threshold to prevent case of very low multiplier - exact original code
      if (this.predicted_final_multiplier < market_multiplier_threshold) {
        this.predicted_final_multiplier = Math.max(
          Math.floor(Math.random() * (2 * market_multiplier_threshold - 1)) + 1,
          this.predicted_final_multiplier
        );
      }

      // Calculate current multiplier with deviation - exact original code
      const predicted_dev = 0.15;
      this.current_multiplier = Math.round(
        this.predicted_final_multiplier *
          (Math.random() * (predicted_dev * 2) + (1 - predicted_dev))
      );

      // Create collections data for display
      const collections = {
        A_oranges: collection_progress.A_oxygen,
        A_lemons: collection_progress.A_lithium,
        B_oranges: collection_progress.B_oxygen,
        B_lemons: collection_progress.B_lithium,
      };

      // Process expired side trades
      side_trades = side_trades.filter((trade) => {
        if (trade.expiry <= current_time) {
          // Store the result and remove from active trades
          this.side_trade_results[trade.id] = [
            trade.expression || trade.expr || trade.item,
            trade.price,
          ];
          return false;
        }
        return true;
      });

      // Generate new side trades (0-2 per update)
      const num_side_trades = Math.floor(Math.random() * 3);
      for (let i = 0; i < num_side_trades; i++) {
        const trade = this.generate_side_trade(
          expected_resources["A_oxygen"],
          expected_resources["A_lithium"],
          expected_resources["B_oxygen"],
          expected_resources["B_lithium"],
          current_time
        );
        side_trades.push(trade);
      }

      // Store a deep copy of the current side trades
      const current_side_trades = JSON.parse(JSON.stringify(side_trades));

      // Store data for this time step - using the class variables for consistency
      this.simulation_data.push({
        time: current_time,
        multiplier: this.current_multiplier,
        predicted_multiplier: this.predicted_final_multiplier,
        collections: { ...collections },
        side_trades: current_side_trades,
      });

      this.multiplier_values.push(this.current_multiplier);
      this.time_values.push(current_time);

      // Add to history array for API
      this.history.push({
        time: current_time,
        multiplier: this.current_multiplier,
      });

      // Add to historical collections for API
      this.historical_collections.push({
        time: current_time,
        collections: { ...collections },
      });

      console.log(
        `Generated data for time ${current_time.toFixed(
          1
        )} min: ${JSON.stringify(
          collections
        )}, Market Multiplier=${current_multiplier}`
      );
    }

    // Store final collection values
    this.final_collection_progress = { ...collection_progress };

    // Calculate final multiplier based on final collection
    this.finalMultiplier =
      (collection_progress.A_oxygen + collection_progress.B_oxygen) *
      (collection_progress.A_lithium + collection_progress.B_lithium);

    console.log(
      `Pre-generated all simulation data. Final multiplier: ${this.finalMultiplier}`
    );
    return true;
  }

  // Modified method to start simulation
  async generate_live_collection() {
    // Set trade active status
    this.trade_active = true;
    this.active = true;
    this.paused = false;
    this.current_time = 0;
    this.displayed_time_index = 0;

    // Pre-generate all simulation data
    this.generate_simulation_data();

    // Start the timer to advance the displayed time (still maintaining real-time progression)
    this.timer_id = setInterval(() => {
      if (this.paused || !this.active) {
        return;
      }

      // Advance to next timestep
      this.displayed_time_index++;

      // Get current time from pre-generated data
      if (this.displayed_time_index < this.simulation_data.length) {
        const timeStep = this.simulation_data[this.displayed_time_index];
        this.current_time = timeStep.time;
        this.current_multiplier = timeStep.multiplier;
        this.side_trades = [...timeStep.side_trades];

        // Update collection progress from pre-generated data
        this.collection_progress = {
          A_oxygen: timeStep.collections.A_oranges,
          A_lithium: timeStep.collections.A_lemons,
          B_oxygen: timeStep.collections.B_oranges,
          B_lithium: timeStep.collections.B_lemons,
        };

        // console.log(`Displaying time ${this.current_time.toFixed(1)} min: ${JSON.stringify(this.collection_progress)}, Market Multiplier=${this.current_multiplier}`);
      } else {
        // Simulation complete
        this.finish();
      }
    }, this.real_time_multiplier * 30 * 1000); // Still respecting the real-time multiplier

    return true;
  }

  generate_side_trade(
    mean_A_oxygen,
    mean_A_lithium,
    mean_B_oxygen,
    mean_B_lithium,
    current_time
  ) {
    // Generate side trades with diverse expressions and pricing based on expected values

    // Match expressions from second implementation
    const expressions = [
      "A_oxygen",
      "A_lithium",
      "B_oxygen",
      "B_lithium",
      "A_oxygen + B_oxygen",
      "A_oxygen + B_lithium",
      "A_lithium + B_oxygen",
      "A_lithium + B_lithium",
      "A_oxygen + 2 * B_oxygen",
      "A_oxygen + 2 * B_lithium",
      "A_lithium + 2 * B_oxygen",
      "A_lithium + 2 * B_lithium",
      "A_oxygen + 3 * B_oxygen",
      "A_oxygen + 3 * B_lithium",
      "A_lithium + 3 * B_oxygen",
      "A_lithium + 3 * B_lithium",
      "2 * A_oxygen + B_oxygen",
      "2 * A_oxygen + B_lithium",
      "2 * A_lithium + B_oxygen",
      "2 * A_lithium + B_lithium",
      "2 * A_oxygen + 2 * B_oxygen",
      "2 * A_oxygen + 2 * B_lithium",
      "2 * A_lithium + 2 * B_oxygen",
      "2 * A_lithium + 2 * B_lithium",
      "2 * A_oxygen + 3 * B_oxygen",
      "2 * A_oxygen + 3 * B_lithium",
      "2 * A_lithium + 3 * B_oxygen",
      "2 * A_lithium + 3 * B_lithium",
      "3 * A_oxygen + B_oxygen",
      "3 * A_oxygen + B_lithium",
      "3 * A_lithium + B_oxygen",
      "3 * A_lithium + B_lithium",
      "3 * A_oxygen + 2 * B_oxygen",
      "3 * A_oxygen + 2 * B_lithium",
      "3 * A_lithium + 2 * B_oxygen",
      "3 * A_lithium + 2 * B_lithium",
      "3 * A_oxygen + 3 * B_oxygen",
      "3 * A_oxygen + 3 * B_lithium",
      "3 * A_lithium + 3 * B_oxygen",
      "3 * A_lithium + 3 * B_lithium",
      "A_oxygen**2 + B_oxygen**2",
      "A_oxygen**2 + B_lithium**2",
      "A_lithium**2 + B_oxygen**2",
      "A_lithium**2 + B_lithium**2",
      "A_oxygen * B_oxygen",
      "A_oxygen * B_lithium",
      "A_lithium * B_oxygen",
      "A_lithium * B_lithium",
    ];

    // Select a random expression
    const expression =
      expressions[Math.floor(Math.random() * expressions.length)];

    // Calculate expiry time (5-15 minute range)
    const expiry_time = Math.min(
      current_time + Math.floor(Math.random() * 11) + 5,
      this.simulation_time
    );

    // Calculate predicted value by evaluating expression with expected resources
    let predicted_value;
    try {
      // Use the safeEval method to evaluate the expression with expected values
      predicted_value = this.safeEval(expression, {
        A_oxygen: mean_A_oxygen,
        A_lithium: mean_A_lithium,
        B_oxygen: mean_B_oxygen,
        B_lithium: mean_B_lithium,
      });
    } catch (error) {
      console.error("Error evaluating side trade expression:", error);
      predicted_value = 20; // Fallback value
    }

    // Set price with small random variation (5% range)
    const trade_price = Math.round(
      predicted_value * (Math.random() * 0.1 + 0.95)
    );

    // Generate a unique trade ID (1-10000)
    const trade_id = Math.floor(Math.random() * 10000) + 1;

    console.log(
      `Generated Side Trade id ${trade_id}: ${expression} = ${trade_price} (Expires at ${expiry_time} min)`
    );

    // Create and return the side trade object
    return {
      id: trade_id,
      expression: expression,
      expr: expression,
      item: expression,
      price: trade_price,
      expiry: expiry_time,
    };
  }

  // Safe evaluation of expressions
  safeEval(expr, vars) {
    // Replace ** with Math.pow for exponentiation
    let jsExpr = expr.replace(/(\w+)\s*\*\*\s*(\d+)/g, "Math.pow($1, $2)");

    // Replace variable names with their values
    for (const [key, value] of Object.entries(vars)) {
      // Use a regex with word boundaries to ensure complete variable names are replaced
      const regex = new RegExp(`\\b${key}\\b`, "g");
      jsExpr = jsExpr.replace(regex, value);
    }

    // Evaluate the expression safely using eval
    try {
      return eval(jsExpr);
    } catch (error) {
      console.error(`Error evaluating expression: ${jsExpr}`, error);
      return 0;
    }
  }

  // Handle user input asynchronously
  async handleUserInput(input) {
    if (!this.trade_active) {
      return { error: "Simulation not active" };
    }

    try {
      const trade_input = input.split(" ").map((x) => x.replace(/\s+/g, ""));

      if (
        trade_input.length >= 2 &&
        ["m", "s"].includes(trade_input[0]) &&
        ["b", "s"].includes(trade_input[1])
      ) {
        if (trade_input[0] === "m") {
          this.user_trades.push([
            trade_input,
            this.current_multiplier,
            this.current_time,
          ]);
          return {
            success: true,
            message: `Market ${trade_input[1] === "b" ? "buy" : "sell"} at ${
              this.current_multiplier
            }`,
          };
        }

        if (trade_input[0] === "s" && trade_input.length === 3) {
          const id = parseInt(trade_input[2]);
          const trade = this.side_trades.find((t) => t.id === id);

          if (!trade) {
            return { error: `Side trade with ID ${id} not found or expired` };
          }

          this.user_trades.push([trade_input, trade.price, this.current_time]);
          this.side_trades = this.side_trades.filter((t) => t.id !== id);

          return {
            success: true,
            message: `Side trade ${
              trade_input[1] === "b" ? "buy" : "sell"
            } for trade ID ${id}`,
          };
        }
      }

      return {
        error:
          'Invalid trade format. Use "m b" for market buy or "s b 123" for side trade buy with ID 123',
      };
    } catch (error) {
      console.error("Input error:", error);
      return { error: error.message };
    }
  }

  // Show results and calculate profits
  show_results() {
    // Use the pre-calculated final multiplier
    const final_multiplier = this.finalMultiplier;
    console.log(`Final Multiplier Value: ${final_multiplier}`);

    console.log("All Trades:");
    let net_profit = 0;

    // Process all user trades to calculate profits
    for (const [trade_input, trade_value, trade_time] of this.user_trades) {
      const trade_type = trade_input[0];
      const action = trade_input[1].toUpperCase();
      let actual_value;

      if (trade_type === "m") {
        // Market trade - use final multiplier as actual value
        actual_value = final_multiplier;
      } else {
        // Side trade - use recorded value or calculate from expression
        const side_trade_id = trade_input[2];
        const [trade_expr, price] = this.side_trade_results[side_trade_id] || [
          "",
          0,
        ];

        if (trade_expr === "") {
          actual_value = 0;
        } else {
          try {
            // Evaluate the side trade expression with final collection values
            actual_value = this.safeEval(trade_expr, {
              A_oxygen: this.final_collection_progress.A_oxygen,
              A_lithium: this.final_collection_progress.A_lithium,
              B_oxygen: this.final_collection_progress.B_oxygen,
              B_lithium: this.final_collection_progress.B_lithium,
            });
          } catch (error) {
            console.error("Error evaluating trade expression:", error);
            actual_value = price; // Fallback to recorded price
          }
        }
      }

      // Calculate profit based on buy/sell action
      const profit =
        action === "B"
          ? actual_value - trade_value
          : trade_value - actual_value;
      net_profit += profit;

      // Display trade details
      console.log(
        `${trade_type} ${action} at ${trade_time} min, Trade Price: ${trade_value}, Actual Price: ${actual_value}, Profit: ${profit}`
      );
    }

    // Display net profit/loss
    console.log(`Net Profit/Loss: ${net_profit}`);

    // Store final values for API
    this.netProfit = net_profit;
  }

  calculate_resource_means() {
    // Calculate mean collection rates based on historical data
    const means = {
      A_oxygen: this.calculateMean(this.teams["A"]["oxygen"]),
      A_lithium: this.calculateMean(this.teams["A"]["lithium"]),
      B_oxygen: this.calculateMean(this.teams["B"]["oxygen"]),
      B_lithium: this.calculateMean(this.teams["B"]["lithium"]),
    };
    return means;
  }

  calculateMean(array) {
    const sum = array.reduce((acc, val) => acc + val, 0);
    return sum / array.length;
  }

  generate_next_time(mean) {
    // Generate random collection time
    const std_dev = mean * 0.3; // 30% of mean as standard deviation

    // Box-Muller transform to get normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Apply the standard deviation and mean
    let next_time = mean + z0 * std_dev;

    // Ensure time is positive and reasonable
    return Math.max(0.5, next_time);
  }

  // API COMPATIBILITY METHODS

  start() {
    console.log(`Starting simulation for ${this.sessionId}`);
    this.generate_live_collection();
    return true;
  }

  finish() {
    this.active = false;
    this.trade_active = false;
    this.paused = false;

    // Clear the timer if it exists
    if (this.timer_id) {
      clearInterval(this.timer_id);
      this.timer_id = null;
    }

    // Call show_results to calculate profits
    this.show_results();

    console.log(`Simulation completed.`);
    return true;
  }

  pause() {
    this.paused = true;
    console.log(`Simulation paused at time ${this.current_time}`);
    return true;
  }

  resume() {
    this.paused = false;
    console.log(`Simulation resumed at time ${this.current_time}`);
    return true;
  }

  terminate() {
    this.active = false;
    this.trade_active = false;
    this.paused = false;

    // Clear the timer if it exists
    if (this.timer_id) {
      clearInterval(this.timer_id);
      this.timer_id = null;
    }

    console.log(`Simulation terminated at time ${this.current_time}`);
    return true;
  }

  // Process user trade actions for API compatibility
  processTrade(type, action, id = null) {
    if (!this.active || !this.trade_active) {
      console.log("Cannot process trade - simulation not active");
      return false;
    }

    // Create trade input array to match expected format
    const trade_input = id ? [type, action, id.toString()] : [type, action];

    if (type === "m") {
      this.user_trades.push([
        trade_input,
        this.current_multiplier,
        this.current_time,
      ]);
      console.log(
        `Market ${action === "b" ? "buy" : "sell"} at ${
          this.current_multiplier
        }`
      );
      return true;
    } else if (type === "s" && id) {
      // Find the side trade
      const trade = this.side_trades.find((t) => t.id === parseInt(id));
      if (!trade) {
        console.log(`Side trade with ID ${id} not found or expired`);
        return false;
      }

      this.user_trades.push([trade_input, trade.price, this.current_time]);
      console.log(
        `Side trade ${action === "b" ? "buy" : "sell"} for ID ${id} at price ${
          trade.price
        }`
      );

      // Remove the trade from the list
      this.side_trades = this.side_trades.filter((t) => t.id !== parseInt(id));

      return true;
    }

    return false;
  }

  // Get current data formatted for API response
  getCurrentData() {
    // If no data has been displayed yet, return initial state
    if (this.displayed_time_index === 0 && this.simulation_data.length > 0) {
      // Get the first data point
      const initialData = this.simulation_data[0];

      return {
        current_time: initialData.time,
        current_multiplier: initialData.multiplier,
        wallet: this.wallet_balance,
        paused: this.paused ? 1 : 0,
        side_trades: initialData.side_trades,
        collections: initialData.collections,
        history: [
          { time: initialData.time, multiplier: initialData.multiplier },
        ],
        historical_collections: [
          { time: initialData.time, collections: initialData.collections },
        ],
        initial_data: this.initial_data,
      };
    }

    // If simulation has been pre-generated but display hasn't started
    if (this.displayed_time_index === 0 && this.current_time === 0) {
      return {
        current_time: 0,
        current_multiplier: 1,
        wallet: this.wallet_balance,
        paused: this.paused ? 1 : 0,
        side_trades: [],
        collections: {
          A_oranges: 0,
          A_lemons: 0,
          B_oranges: 0,
          B_lemons: 0,
        },
        history: [],
        historical_collections: [],
        initial_data: this.initial_data,
      };
    }

    // Create mapped collections for frontend
    const collections = {
      A_oranges: this.collection_progress.A_oxygen,
      A_lemons: this.collection_progress.A_lithium,
      B_oranges: this.collection_progress.B_oxygen,
      B_lemons: this.collection_progress.B_lithium,
    };

    // Return data up to current displayed time index
    return {
      current_time: this.current_time,
      current_multiplier: this.current_multiplier,
      wallet: this.wallet_balance,
      paused: this.paused ? 1 : 0,
      side_trades: this.side_trades,
      collections: collections,
      history: this.history.slice(0, this.displayed_time_index + 1),
      historical_collections: this.historical_collections.slice(
        0,
        this.displayed_time_index + 1
      ),
      initial_data: this.initial_data,
    };
  }

  // Get final results
  getFinalResults() {
    return {
      wallet: this.wallet_balance,
      net_profit: this.netProfit || 0,
      final_wallet: this.wallet_balance + (this.netProfit || 0),
      final_multiplier: this.finalMultiplier || 0,
    };
  }

  // Update wallet balance
  updateWallet(action, value) {
    if (action === "b") {
      this.wallet_balance -= value;
    } else {
      this.wallet_balance += value;
    }
    return this.wallet_balance;
  }

  // New method to manually set the displayed time index (for testing or admin purposes)
  setDisplayedTimeIndex(index) {
    if (index >= 0 && index < this.simulation_data.length) {
      this.displayed_time_index = index;
      const timeStep = this.simulation_data[index];
      this.current_time = timeStep.time;
      this.current_multiplier = timeStep.multiplier;
      this.side_trades = [...timeStep.side_trades];

      // Update collection progress
      this.collection_progress = {
        A_oxygen: timeStep.collections.A_oranges,
        A_lithium: timeStep.collections.A_lemons,
        B_oxygen: timeStep.collections.B_oranges,
        B_lithium: timeStep.collections.B_lemons,
      };

      return true;
    }
    return false;
  }
}

// Create a new simulation
function createSimulation(sessionId) {
  // Terminate existing simulation if any
  if (sessions[sessionId]) {
    sessions[sessionId].terminate();
  }

  // Create a new simulation
  sessions[sessionId] = new TradingSimulator(sessionId);
  return sessions[sessionId];
}

// Get existing simulation or create if it doesn't exist
function getOrCreateSimulation(sessionId) {
  if (!sessions[sessionId]) {
    return createSimulation(sessionId);
  }

  return sessions[sessionId];
}

// ======================================================
// API ENDPOINTS
// ======================================================

// Endpoint to start a new simulation
multiplierSimulatorRoute.post("/start_simulation", (req, res) => {
  const userId = req.body.user_id || "default_user";
  const sessionId = `session:${userId}`;

  try {
    console.log(`Creating new simulation for ${sessionId}`);
    const simulation = createSimulation(sessionId);
    simulation.start();

    res.json({
      message: "Simulation started!",
      session_id: sessionId,
    });
  } catch (error) {
    console.error(`Failed to start simulation: ${error.message}`);
    res.status(500).json({
      error: "Failed to start simulation",
      details: error.message,
    });
  }
});

// Endpoint to stop (pause) the simulation
multiplierSimulatorRoute.post("/stop_simulation/:sessionId", (req, res) => {
  const fullSessionId = `session:${req.params.sessionId}`;

  try {
    const simulation = getOrCreateSimulation(fullSessionId);
    simulation.pause();

    res.json({ message: "Simulation paused" });
  } catch (error) {
    console.error(`Failed to pause simulation: ${error.message}`);
    res.status(500).json({
      error: "Failed to pause simulation",
      details: error.message,
    });
  }
});

// Endpoint to resume the simulation
multiplierSimulatorRoute.post("/resume_simulation/:sessionId", (req, res) => {
  const fullSessionId = `session:${req.params.sessionId}`;

  try {
    const simulation = getOrCreateSimulation(fullSessionId);
    simulation.resume();

    res.json({ message: "Simulation resumed" });
  } catch (error) {
    console.error(`Failed to resume simulation: ${error.message}`);
    res.status(500).json({
      error: "Failed to resume simulation",
      details: error.message,
    });
  }
});

// Endpoint to restart the simulation
multiplierSimulatorRoute.post("/restart_simulation/:sessionId", (req, res) => {
  const fullSessionId = `session:${req.params.sessionId}`;

  try {
    const simulation = createSimulation(fullSessionId);
    simulation.start();

    res.json({ message: "Simulation restarted" });
  } catch (error) {
    console.error(`Failed to restart simulation: ${error.message}`);
    res.status(500).json({
      error: "Failed to restart simulation",
      details: error.message,
    });
  }
});

// Endpoint to terminate the simulation
multiplierSimulatorRoute.post(
  "/terminate_simulation/:sessionId",
  (req, res) => {
    const fullSessionId = `session:${req.params.sessionId}`;

    try {
      if (sessions[fullSessionId]) {
        sessions[fullSessionId].terminate();
        delete sessions[fullSessionId];
      }

      res.json({ message: "Simulation terminated" });
    } catch (error) {
      console.error(`Failed to terminate simulation: ${error.message}`);
      res.status(500).json({
        error: "Failed to terminate simulation",
        details: error.message,
      });
    }
  }
);

// Endpoint to get current simulation data
multiplierSimulatorRoute.get("/current_data/:sessionId", (req, res) => {
  try {
    const fullSessionId = `session:${req.params.sessionId}`;
    const fields = req.query.fields ? req.query.fields.split(",") : null;

    // Get or create simulation
    const simulation = getOrCreateSimulation(fullSessionId);

    if (!simulation.active) {
      console.log(`Simulation ${fullSessionId} not active - starting it`);
      simulation.start();
    }

    // Get full data
    const fullData = simulation.getCurrentData();

    // Create response based on requested fields
    const responseData = {};

    if (fields) {
      // Return only specified fields
      for (const field of fields) {
        if (field in fullData) {
          responseData[field] = fullData[field];
        } else if (
          field === "current_" &&
          "current_time" in fullData &&
          "current_multiplier" in fullData
        ) {
          responseData.current_time = fullData.current_time;
          responseData.current_multiplier = fullData.current_multiplier;
        }
      }
    } else {
      // Return all data
      Object.assign(responseData, fullData);
    }

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching simulation data:", error);

    // Return fallback data on error
    res.json({
      current_time: 30,
      current_multiplier: 25,
      wallet: 1000,
      paused: 0,
      collections: {
        A_oranges: 10,
        A_lemons: 8,
        B_oranges: 12,
        B_lemons: 7,
      },
      side_trades: [],
      history: [],
      error: error.message,
    });
  }
});

// New endpoint to manually set the displayed time (useful for testing or admin)
multiplierSimulatorRoute.post("/set_display_time/:sessionId", (req, res) => {
  const fullSessionId = `session:${req.params.sessionId}`;
  const { time_index } = req.body;

  if (time_index === undefined) {
    return res.status(400).json({ error: "time_index parameter required" });
  }

  try {
    const simulation = getOrCreateSimulation(fullSessionId);

    if (simulation.setDisplayedTimeIndex(parseInt(time_index))) {
      res.json({
        message: "Display time updated",
        current_time: simulation.current_time,
      });
    } else {
      res.status(400).json({ error: "Invalid time index" });
    }
  } catch (error) {
    console.error("Error setting display time:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to submit a user trade
multiplierSimulatorRoute.post("/action/:sessionId", (req, res) => {
  const fullSessionId = `session:${req.params.sessionId}`;
  const { type, action, id } = req.body;

  if ((type !== "m" && type !== "s") || (action !== "b" && action !== "s")) {
    return res.status(400).json({ error: "Invalid trade type or action" });
  }

  try {
    // Get simulation
    const simulation = getOrCreateSimulation(fullSessionId);

    if (!simulation.active) {
      return res.status(400).json({ error: "Simulation not running" });
    }

    // Process the trade
    let tradeValue;

    if (type === "m") {
      tradeValue = simulation.current_multiplier;
      if (simulation.processTrade(type, action)) {
        // Update wallet
        const newWallet = simulation.updateWallet(action, tradeValue);

        res.json({
          message: "Trade submitted",
          wallet: newWallet,
        });
      } else {
        res.status(400).json({ error: "Failed to process market trade" });
      }
    } else {
      if (!id) {
        return res.status(400).json({ error: "Side trade ID required" });
      }

      // Find the side trade
      const trade = simulation.side_trades.find((t) => t.id === parseInt(id));
      if (!trade) {
        return res
          .status(404)
          .json({ error: "Side trade not found or expired" });
      }

      tradeValue = trade.price;

      if (simulation.processTrade(type, action, id)) {
        // Update wallet
        const newWallet = simulation.updateWallet(action, tradeValue);

        res.json({
          message: "Trade submitted",
          wallet: newWallet,
        });
      } else {
        res.status(400).json({ error: "Failed to process side trade" });
      }
    }
  } catch (error) {
    console.error("Error processing trade:", error);
    res.status(500).json({ error: error.message });
  }
});

// Added endpoint to handle user input in text format
multiplierSimulatorRoute.post("/handle_input/:sessionId", (req, res) => {
  const fullSessionId = `session:${req.params.sessionId}`;
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input required" });
  }

  try {
    const simulation = getOrCreateSimulation(fullSessionId);
    simulation.handleUserInput(input).then((result) => {
      res.json(result);
    });
  } catch (error) {
    console.error("Error handling input:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get final results
multiplierSimulatorRoute.get("/results/:sessionId", (req, res) => {
  const fullSessionId = `session:${req.params.sessionId}`;

  try {
    if (!sessions[fullSessionId]) {
      return res.status(404).json({ error: "Session not found" });
    }

    const simulation = sessions[fullSessionId];

    if (
      simulation.active &&
      simulation.current_time < simulation.simulation_time
    ) {
      return res.status(400).json({ error: "Simulation still in progress" });
    }

    // Get final results
    const results = simulation.getFinalResults();

    res.json(results);
  } catch (error) {
    console.error("Error getting results:", error);
    res.status(500).json({ error: error.message });
  }
});

// Root endpoint
multiplierSimulatorRoute.get("/", (req, res) => {
  console.log("Root endpoint accessed");
  res.json({
    status: "online",
    message: "Multiplier Simulation API is running",
    api_version: "1.0",
    active_sessions: Object.keys(sessions).length,
  });
});

export default multiplierSimulatorRoute;
