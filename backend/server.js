const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Import the functions
const analyzeStock = require('./functions/analyzeStock').handler;
const defineTerm = require('./functions/defineTerm').handler;
const generateQuiz = require('./functions/generateQuiz').handler;
const normAns = require('./functions/normAns').handler;

// Helper to handle async route handlers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Define routes
app.post('/analyzeStock', asyncHandler(async (req, res) => {
    const response = await analyzeStock({ body: req.body }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.post('/defineTerm', asyncHandler(async (req, res) => {
    const response = await defineTerm({ body: req.body }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.post('/generateQuiz', asyncHandler(async (req, res) => {
    const response = await generateQuiz({ body: req.body }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.post('/normAns', asyncHandler(async (req, res) => {
    const response = await normAns({ body: req.body }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
