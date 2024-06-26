import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import passportConfig from '../Passport/config.js';
//routes for processing users request
import dotenv from 'dotenv';
import threadRoute from '../Endpoints/threadRoute.js';
import userRoute from '../Endpoints/userRoute.js';
import newsRoute from '../Endpoints/newsRoute.js';
import chatRoute from '../Endpoints/chatRoute.js';
import authRoute from '../Endpoints/authRoute.js';
import cryptoRoute from '../Endpoints/cryptoRoute.js';
import stockRoute from '../Endpoints/stockRoute.js';

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1);
});

passportConfig(app)


// Set up Express middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.post('/analyzeRisk', async (req, res) => {
  console.log("Request from server.js:", req.body);

  try {
    const response = await analyzeRisk(req);
    console.log("Response from analyzeRisk:", response);
    console.log("Type of response.body:", typeof response.body);

    // Assuming response.body is a JSON string
    const responseBody = JSON.parse(response.body);
    res.status(response.statusCode).json(responseBody);
  } catch (error) {
    console.error('Error in /analyzeRisk endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.use('/.netlify/functions/server', userRoute);
app.use('/.netlify/functions/server', threadRoute)
app.use('/.netlify/functions/server', newsRoute);
app.use('/.netlify/functions/server', chatRoute);
app.use('/.netlify/functions/server', authRoute);
app.use('/.netlify/functions/server', cryptoRoute);
app.use('/.netlify/functions/server', stockRoute);


const handler = serverless(app);
export { handler };
