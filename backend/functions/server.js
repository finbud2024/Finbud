import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import passportConfig from '../Passport/config.js';
//routes for processing users request
import authRoute from '../Endpoints/authRoute.js';
import threadRoute from '../Endpoints/threadRoute.js';
import userRoute from '../Endpoints/userRoute.js';
import newsRoute from '../Endpoints/newsRoute.js';
import chatRoute from '../Endpoints/chatRoute.js';
import cryptoRoute from '../Endpoints/cryptoRoute.js';
import stockRoute from '../Endpoints/stockRoute.js';
import transactionRoute from '../Endpoints/transactionRoute.js';
import stockTransactionRoute from '../Endpoints/stockTransactionRoute.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const app = express();

if (!mongoURI) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

const connectToMongoDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoURI, { 
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    })
    .then(() => {
      console.log('MongoDB connected');
      resolve();
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
      reject(err);
    });
  });
};

passportConfig(app)

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({limit: '10mb'}));
app.use(cors());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

const router = express.Router();

router.use('/', authRoute);
router.use('/', userRoute);
router.use('/', threadRoute);
router.use('/', newsRoute);
router.use('/', chatRoute);
router.use('/', cryptoRoute);
router.use('/', stockRoute);
router.use('/', transactionRoute);
router.use('/', stockTransactionRoute);

app.use('/.netlify/functions/server', router);

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (!mongoose.connection.readyState) {
    try {
      await connectToMongoDB();
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to connect to database' })
      };
    }
  }
  
  return serverless(app)(event, context);
};

export { handler };