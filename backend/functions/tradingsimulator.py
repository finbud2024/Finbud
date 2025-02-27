import random
import time
import threading
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

class TradingSimulator:
    def __init__(self):
        self.rounds = 20
        self.simulation_time = 60  # in simulator minutes
        self.real_time_multiplier = 1/6 # Speed up x6
        self.teams = {'A': {'oxygen': [], 'lithium': []}, 'B': {'oxygen': [], 'lithium': []}}
        self.market_trades = []
        self.side_trades = [] # list of (expression, price, expiry, id)
        self.current_time = 0
        self.multiplier_values = []
        self.predicted_final_multiplier = 1
        self.user_trades = []
        self.trade_active = False
        self.side_trade_results = {} # side trade id - trade expr, trade price
        
        self.generate_random_samples()
        
    def generate_random_samples(self):
        """Generate initial 20 rounds of team collections with controlled distribution."""
        for resource in ['oxygen', 'lithium']:
            for team in ['A', 'B']: 
                mean_value = random.randint(2, 10)
                deviations = np.random.normal(0, 2, self.rounds)  # Normal distribution with mean 0 and std 2
                samples = [max(0, int(mean_value + round(dev))) for dev in deviations]
                self.teams[team][resource] = samples
                self.teams[team][f'total_{resource}'] = sum(samples)
        
    def display_initial_data(self):
        """Show the collected data from the previous rounds in a structured table format."""
        data = {
            'Round': list(range(1, self.rounds + 1)),
            "A's Oxygen Crystals": self.teams['A']['oxygen'],
            "A's Lithium Shards": self.teams['A']['lithium'],
            "B's Oxygen Crystals": self.teams['B']['oxygen'],
            "B's Lithium Shards": self.teams['B']['lithium']
        }
        df = pd.DataFrame(data)
        df.loc['Total'] = df.sum(numeric_only=True)
        df.loc['Total', 'Round'] = 'Total'
        print(df.to_string(index=False))
        
    def generate_live_collection(self):
        """Simulate real-time resource extraction, ensuring incremental updates."""
        self.trade_active = True
        collection_progress = {'A_oxygen': 0, 'A_lithium': 0, 'B_oxygen': 0, 'B_lithium': 0}
        
        mean_A_oxygen = sum(self.teams['A']['oxygen']) // self.rounds
        mean_A_lithium = sum(self.teams['A']['lithium']) // self.rounds
        mean_B_oxygen = sum(self.teams['B']['oxygen']) // self.rounds
        mean_B_lithium = sum(self.teams['B']['lithium']) // self.rounds

        expected_intervals = {
            'A_oxygen': self.simulation_time / mean_A_oxygen,
            'A_lithium': self.simulation_time / mean_A_lithium,
            'B_oxygen': self.simulation_time / mean_B_oxygen,
            'B_lithium': self.simulation_time / mean_B_lithium,
        }
        
        # save previous prediction and consider the mean of this as next prediction to prevent extreme increase or decrease
        # cause by long wait before a new resource
        expected_resources = {
            'A_oxygen': mean_A_oxygen,
            'A_lithium': mean_A_lithium,
            'B_oxygen': mean_B_oxygen,
            'B_lithium': mean_B_lithium,
        }

        # Threshold to prevent cases of predicted market multiplier = 0
        market_multiplier_threshold = 3
        
        resource_rng = np.random.default_rng(seed=101)
        next_collections = {k: v * resource_rng.uniform(0.25, 1.75) for k, v in expected_intervals.items()} 
        
        for t in range(self.simulation_time * 2):  # Updates every 30 sec
            self.current_time += 0.5
            for resource in expected_intervals:
                # Generate new resource
                if self.current_time >= next_collections[resource]:
                    # add new resource to collection
                    collection_progress[resource] += 1
                    # generate new time between resource
                    next_collections[resource] += expected_intervals[resource] * resource_rng.uniform(0.25, 1.75)
            
            # update new expectation 
            remaining_time = self.simulation_time - self.current_time
            expected_resources[resource] = collection_progress[resource] + remaining_time / self.simulation_time * expected_resources[resource]
            
            # Predict multiplier by calculate expression on expected final number of resource
            self.predicted_final_multiplier = round(
                (expected_resources["A_oxygen"] + expected_resources["B_oxygen"]) * 
                (expected_resources["A_lithium"] + expected_resources["B_lithium"])
            )
            
            # Apply the threshold to prevent case of 0
            if self.predicted_final_multiplier < market_multiplier_threshold:
                # add some noise to threshold by random in the part from 1 centered at threshold
                self.predicted_final_multiplier = max(random.randint(1, 2 * market_multiplier_threshold - 1), self.predicted_final_multiplier)

            # cooling predicted deviation with linear decay from 15% -> 5%
            #predicted_dev = 0.05 + 0.1 * (self.simulation_time * 2 - t) / (self.simulation_time * 2)
            predicted_dev = 0.15
            self.current_multiplier = round(self.predicted_final_multiplier * random.uniform(1 - predicted_dev, 1 + predicted_dev))  # More fluctuation, integer
            self.multiplier_values.append(self.current_multiplier)
            
            num_side_trades = random.randint(0, 2)
            for _ in range(num_side_trades):  # Increased frequency of side trades
                #self.generate_side_trade(mean_A_oxygen, mean_A_lithium, mean_B_oxygen, mean_B_lithium)
                self.generate_side_trade(expected_resources["A_oxygen"], expected_resources["A_lithium"], expected_resources["B_oxygen"], expected_resources["B_lithium"])
            
            for expr, price, expiry, id in self.side_trades:
                if expiry == self.current_time:
                    self.side_trade_results[id] = [expr, price]
            
            # only after we consider expired side trade then we remove then
            self.side_trades = [(expr, price, expiry, id) for expr, price, expiry, id in self.side_trades if expiry > self.current_time]

            print(f"Time {self.current_time} min: {collection_progress}, Market Multiplier={self.current_multiplier}")
            time.sleep(self.real_time_multiplier * 30)
        
        self.trade_active = False
        self.show_results(collection_progress)

    def generate_side_trade(self, mean_A_oxygen, mean_A_lithium, mean_B_oxygen, mean_B_lithium):
        """Generate side trades with expiration and auto-pricing based on expected future value."""
        expressions = [
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
            "A_lithium * B_lithium"
        ]
        trade_expr = random.choice(expressions)
        expiry_time = min(self.current_time + random.randint(5, 15), self.simulation_time)
        # modify the predicted value of the express, 
        # use the value of expected final mean * expiry_time / self.simulation_time as number of resources collected at expiry
        predicted_value = eval(trade_expr.replace("A_oxygen", str(mean_A_oxygen))
                                            .replace("A_lithium", str(mean_A_lithium))
                                            .replace("B_oxygen", str(mean_B_oxygen))
                                            .replace("B_lithium", str(mean_B_lithium)))
        trade_price = int(predicted_value * random.uniform(0.95, 1.05))  # Ensure integer pricing
        trade_id = random.randint(1, 10000) # trade_id to differentiate between trades
        print(f"New Side Trade id {trade_id}: {trade_expr} = {trade_price} (Expires at {expiry_time} min)")
        self.side_trades.append((trade_expr, trade_price, expiry_time, trade_id))
  
    def show_results(self, final_collections):
        """Show final results and profits."""
        final_multiplier = (final_collections['A_oxygen'] + final_collections['B_oxygen']) * \
                           (final_collections['A_lithium'] + final_collections['B_lithium'])
        print(f"Final Multiplier Value: {final_multiplier}")
        
        print("All Trades:")
        net_profit = 0
        for trade_input, trade_value, trade_time in self.user_trades:
            trade_type, action = trade_input[0], trade_input[1].upper()
            if trade_type == 'm':
                actual_value = final_multiplier
            else:
                side_trade_id = trade_input[2]
                trade_expr, trade_value = self.side_trade_results.get(side_trade_id, ["", 0]) # Use the recorded value at expiration
                actual_value = 0 if trade_expr == "" else eval(trade_expr.replace("A_oxygen", str(final_collections['A_oxygen']))
                                                                            .replace("A_lithium", str(final_collections['A_lithium']))
                                                                            .replace("B_oxygen", str(final_collections['B_oxygen']))
                                                                            .replace("B_lithium", str(final_collections['B_lithium'])))
            
            profit = actual_value - trade_value if action == 'B' else trade_value - actual_value
            net_profit += profit
            print(f"{trade_type} {action} at {trade_time} min, Trade Price: {trade_value}, Actual Price: {actual_value}, Profit: {profit}")
        
        print(f"Net Profit/Loss: {net_profit}")
        
        #plt.axhline(y = final_multiplier, color = 'r', linestyle = '-') 
        plt.plot(self.multiplier_values)
        plt.xlabel("Time (Minutes)")
        plt.ylabel("Multiplier Value")
        plt.title("Market Expectation Over Time")
        plt.show()
        
# Run the simulator
simulator = TradingSimulator()
simulator.display_initial_data()
input("Press Enter to Start the Trading Simulation...")
threading.Thread(target=simulator.generate_live_collection).start()

while simulator.trade_active:
    # new input handle: 'm' - ['b', 's'] or 's' - ['b', 's'] - trade_id 
    trade_input = list(map(lambda x: x.replace(" ", ""), input("").split(" ")))
    if len(trade_input) >= 2 and trade_input[0] in ['m', 's'] and trade_input[1] in ['b', 's']:
        if trade_input[0] == "m":
            simulator.user_trades.append((trade_input, simulator.current_multiplier, simulator.current_time))
        if trade_input[0] == "s" and len(trade_input) == 3:
            simulator.user_trades.append((trade_input, simulator.current_multiplier, simulator.current_time))