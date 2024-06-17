import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import threadRoute from '../Endpoints/threadtRoute.js';
import userRoute from '../Endpoints/userRoute.js';
import serverless from 'serverless-http';
import{ handler as analyzeRisk }  from './analyzeRisk.js';

// Load environment variables from .env
dotenv.config();
const mongoURI = process.env.MONGO_URI;
const app = express();
const router = express.Router();

if (!mongoURI) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1);
});

router.get('/test',(req,res)=>{
   return res.json({
    "a":"aaaaaa",
    "b":"bbbbbb"
   })
});

app.use("/.netlify/functions/server", router);

// Set up Express middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.post('/analyzeRisk', async(req, res) => {
  console.log("request from server.js :", req.body);
  try{
  const response = await analyzeRisk(req);
  console.log("Response from server.js",response)
  console.log("Type of response.body:", typeof(response.body));}
  catch (error){
    console.log("Error in Step 2:" , error);
  }
  try {
    const response = await analyzeRisk(req);
    console.log("Response from analyzeRisk:", response);
    console.log("Type of response.body:", typeof response.body);

    // Attempt to parse response.body as JSON
    const responseBody = JSON.parse(response.body); // Assuming response.body is JSON stringified
    res.status(response.statusCode).json(responseBody);
  } catch (error) {
    console.error('Error in /analyzeRisk endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
});
// app.use('/.netlify/functions/server/', threadRoute)
app.use('/.netlify/functions/server/', userRoute);

const handler = serverless(app);
export {handler};
