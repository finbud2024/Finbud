const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use the cors middleware
app.use(cors());
app.use(bodyParser.json());

// Import the functions
const analyzeStock = require('./functions/analyzeStock').handler;
const defineTerm = require('./functions/defineTerm').handler;
const generateQuiz = require('./functions/generateQuiz').handler;
const normAns = require('./functions/normAns').handler;
const generateNews = require('./functions/generateNews').handler;

// Helper to handle async route handlers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Define routes
app.post('/analyzeStock', asyncHandler(async (req, res) => {
    const response = await analyzeStock({ body: JSON.stringify(req.body) }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.post('/defineTerm', asyncHandler(async (req, res) => {
    const response = await defineTerm({ body: JSON.stringify(req.body) }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.post('/generateQuiz', asyncHandler(async (req, res) => {
    const response = await generateQuiz({ body: JSON.stringify(req.body) }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.post('/normAns', asyncHandler(async (req, res) => {
    const response = await normAns({ body: JSON.stringify(req.body) }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.post('/generateNews', asyncHandler(async (req, res) => {
    const response = await generateNews({ body: JSON.stringify(req.body) }, null);
    res.status(response.statusCode).json(JSON.parse(response.body));
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
