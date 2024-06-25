//configurations
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from '../Endpoints/authRoute.js';
import threadRoute from '../Endpoints/threadRoute.js';
import userRoute from '../Endpoints/userRoute.js';
import newsRoute from '../Endpoints/newsRoute.js';
import displayCrypto from '../Endpoints/displayCrypto.js';
import serverless from 'serverless-http';
import passportConfig from '../Passport/config.js';
// Load environment variables from .env
dotenv.config();
const mongoURI = process.env.MONGO_URI;
const app = express();

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

passportConfig(app)

const corsOptions = {
	origin: '*', // Ensure this environment variable is set
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN', 'Accept', 'Origin'],
	credentials: true,
	optionsSuccessStatus: 200 // Some legacy browsers choke on a 204 status
};


app.options('*', cors(corsOptions)); 

// Set up Express middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors(corsOptions));

app.use('/.netlify/functions/server', threadRoute)
app.use('/.netlify/functions/server', userRoute);
app.use('/.netlify/functions/server', newsRoute);
app.use('/.netlify/functions/server', authRoute);
app.use('/.netlify/functions/server', displayCrypto);

const handler = serverless(app);
export { handler };
