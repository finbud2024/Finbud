const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const quantSimulatorRoute = express.Router();

// Global variables to manage simulation state
let simulatorProcess = null;
let simulationData = {
    currentTime: 0,
    collectionProgress: {},
    marketMultiplier: 0,
    multiplierHistory: [],
    sideTrades: [],
    userTrades: [],
    isRunning: false
};

// Utility function to start Python simulation
const startSimulation = () => {
    return new Promise((resolve, reject) => {
        // Updated path to the Python script in the Function folder
        const pythonScriptPath = path.join(__dirname, '../functions/tradingsimulator.py');
        
        // Check if the Python script exists
        if (!fs.existsSync(pythonScriptPath)) {
            return reject(new Error('Python simulation script not found'));
        }

        // Spawn the Python process
        simulatorProcess = spawn('python3', [pythonScriptPath]);

        // Capture stdout
        simulatorProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log('Simulator Output:', output);

            // Parse and store relevant simulation data
            try {
                // Example parsing - adjust based on actual Python script output
                if (output.startsWith('Time')) {
                    const timeMatch = output.match(/Time (\d+(\.\d+)?) min:/);
                    if (timeMatch) {
                        simulationData.currentTime = parseFloat(timeMatch[1]);
                    }

                    const multiplierMatch = output.match(/Market Multiplier=(\d+)/);
                    if (multiplierMatch) {
                        const currentMultiplier = parseInt(multiplierMatch[1]);
                        simulationData.marketMultiplier = currentMultiplier;
                        simulationData.multiplierHistory.push(currentMultiplier);
                    }
                }

                // Try to parse JSON output for more structured data
                try {
                    const jsonData = JSON.parse(output);
                    if (jsonData.type === 'side_trade') {
                        simulationData.sideTrades.push(jsonData.trade);
                    }
                } catch (jsonError) {
                    // Not a JSON output, ignore
                }
            } catch (parseError) {
                console.error('Parsing error:', parseError);
            }
        });

        // Capture stderr
        simulatorProcess.stderr.on('data', (data) => {
            console.error(`Simulator Error: ${data}`);
        });

        // Handle process completion
        simulatorProcess.on('close', (code) => {
            console.log(`Simulation process exited with code ${code}`);
            simulationData.isRunning = false;
            resolve();
        });

        // Handle process error
        simulatorProcess.on('error', (err) => {
            console.error('Failed to start simulation process:', err);
            simulationData.isRunning = false;
            reject(err);
        });

        // Set initial state
        simulationData.isRunning = true;
        resolve();
    });
};

// Middleware to ensure simulation is running
const ensureSimulation = async (req, res, next) => {
    if (!simulationData.isRunning) {
        try {
            await startSimulation();
        } catch (error) {
            return res.status(500).json({ 
                error: 'Failed to start simulation',
                details: error.message 
            });
        }
    }
    next();
};

// Start simulation endpoint
quantSimulatorRoute.post('/start-simulation', ensureSimulation, (req, res) => {
    res.json({ 
        message: 'Simulation started', 
        currentTime: simulationData.currentTime,
        isRunning: simulationData.isRunning
    });
});

// Current data endpoint
quantSimulatorRoute.get('/current-data', ensureSimulation, (req, res) => {
    res.json({
        current_time: simulationData.currentTime,
        market_multiplier: simulationData.marketMultiplier,
        multiplier_history: simulationData.multiplierHistory,
        side_trades: simulationData.sideTrades,
        market_trades: simulationData.userTrades,
        collection_progress: simulationData.collectionProgress
    });
});

// Trade submission endpoint
quantSimulatorRoute.post('/submit-trade', ensureSimulation, (req, res) => {
    const { tradeType, action, value } = req.body;

    // Validate trade input
    if (!['m', 's'].includes(tradeType) || !['b', 's'].includes(action)) {
        return res.status(400).json({ error: 'Invalid trade parameters' });
    }

    // Send trade to Python process via stdin
    if (simulatorProcess && simulatorProcess.stdin) {
        // Construct trade input string
        const tradeInput = `${tradeType} ${action}${tradeType === 's' ? ` ${value}` : ''}\n`;
        
        try {
            simulatorProcess.stdin.write(tradeInput);

            // Store trade in local state
            const tradeRecord = {
                type: tradeType,
                action: action,
                value: value,
                time: simulationData.currentTime
            };
            simulationData.userTrades.push(tradeRecord);

            res.json({ 
                message: 'Trade submitted successfully', 
                trade: tradeRecord
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Failed to submit trade', 
                details: error.message 
            });
        }
    } else {
        res.status(500).json({ error: 'Simulation process not available' });
    }
});

// Final results endpoint
quantSimulatorRoute.get('/final-results', (req, res) => {
    if (simulationData.isRunning) {
        return res.status(400).json({ error: 'Simulation still in progress' });
    }

    res.json({
        finalMultiplier: simulationData.multiplierHistory[simulationData.multiplierHistory.length - 1],
        trades: simulationData.userTrades,
        multiplierHistory: simulationData.multiplierHistory,
        sideTrades: simulationData.sideTrades
    });
});

export default quantSimulatorRoute;