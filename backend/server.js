import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//----- import the Routes/Endpoints -----------
import chatRoute from './Endpoints/threadtRoute.js';

//load environment variable from .env
dotenv.config();

const app = express();
const port = 3000;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
      console.log('MongoDB connected');
    }
  ).catch(err => {
  console.error(err.message);
  process.exit(1);
});

app
//setting up app as middleware
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors())
//define endpoints
  .use('/',chatRoute)
  .listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Import the functions
// const analyzeStock = require('./functions/analyzeStock').handler;
// const defineTerm = require('./functions/defineTerm').handler;
// const generateQuiz = require('./functions/generateQuiz').handler;
// const normAns = require('./functions/normAns').handler;

// Helper to handle async route handlers
// const asyncHandler = fn => (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
// };

// Define routes
// app.post('/analyzeStock', asyncHandler(async (req, res) => {
//     const response = await analyzeStock({ body: JSON.stringify(req.body) }, null);
//     res.status(response.statusCode).json(JSON.parse(response.body));
// }));

// app.post('/defineTerm', asyncHandler(async (req, res) => {
//     const response = await defineTerm({ body: JSON.stringify(req.body) }, null);
//     res.status(response.statusCode).json(JSON.parse(response.body));
// }));

// app.post('/generateQuiz', asyncHandler(async (req, res) => {
//     const response = await generateQuiz({ body: JSON.stringify(req.body) }, null);
//     res.status(response.statusCode).json(JSON.parse(response.body));
// }));

// app.post('/normAns', asyncHandler(async (req, res) => {
//     const response = await normAns({ body: JSON.stringify(req.body) }, null);
//     res.status(response.statusCode).json(JSON.parse(response.body));
// }));

// app.post('/signup', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
  
//       user = new User({
//         email,
//         password,
//       });
  
//       await user.save();
  
//       const payload = {
//         user: {
//           id: user.id,
//         },
//       };
  
//       jwt.sign(
//         payload,
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' },
//         (err, token) => {
//           if (err) throw err;
//           res.status(201).json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   });

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' },
//       (err, token) => {
//         if (err) {
//           console.error('JWT Sign Error:', err.message);
//           throw err;
//         }
//         res.status(200).json({ token });
//       }
//     );
//   } catch (err) {
//     console.error('Server Error:', err.message);
//     res.status(500).send('Server error');
//   }
// });
