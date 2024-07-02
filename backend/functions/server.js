import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import passportConfig from '../Passport/config.js';
import session from 'express-session';
//routes for processing users request
import dotenv from 'dotenv';
import threadRoute from '../Endpoints/threadRoute.js';
import userRoute from '../Endpoints/userRoute.js';
import newsRoute from '../Endpoints/newsRoute.js';
import chatRoute from '../Endpoints/chatRoute.js';
import authRoute from '../Endpoints/authRoute.js';
import cryptoRoute from '../Endpoints/cryptoRoute.js';
import stockRoute from '../Endpoints/stockRoute.js';
import transactionRoute from '../Endpoints/transactionRoute.js';


// Load environment variables from .env
const mongoURI = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;
const app = express();



if (!mongoURI) {
 console.error('MONGO_URI is not defined in the environment variables');
 process.exit(1);
}


if (!sessionSecret) {
 console.error('SESSION_SECRET is not defined in the environment variables');
 process.exit(1);
}


// Connect to MongoDB
mongoose.connect(mongoURI)
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


// Add express-session middleware
app.use(session({
 secret: sessionSecret, // Use sessionSecret from environment variables
 resave: false,
 saveUninitialized: true,
 cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));


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
app.use('/.netlify/functions/server', transactionRoute);




const handler = serverless(app);
export {handler};




