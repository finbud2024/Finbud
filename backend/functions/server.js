import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Source from "../Database Schema/Source.js";  
import Article from "../Database Schema/Article.js";
import serverless from "serverless-http";
import dotenv from "dotenv";
import passportConfig from "../Passport/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
//routes for processing users request
import authRoute from "../Endpoints/authRoute.js";
import threadRoute from "../Endpoints/threadRoute.js";
import userRoute from "../Endpoints/userRoute.js";
import newsRoute from "../Endpoints/newsRoute.js";
import chatRoute from "../Endpoints/chatRoute.js";
import cryptoRoute from "../Endpoints/cryptoRoute.js";
import stockRoute from "../Endpoints/stockRoute.js";
import transactionRoute from "../Endpoints/transactionRoute.js";
import stockTransactionRoute from "../Endpoints/stockTransactionRoute.js";
import goalRoute from "../Endpoints/goalRoute.js";
import proxyRoute from "../Endpoints/proxyRoute.js";
import eventRoute from "../Endpoints/eventRoute.js";
import chatStockRoute from "../Endpoints/subChat/chatStockRoute.js";
// Import the multiplier simulator route
import multiplierSimulatorRoute from "../Endpoints/quantSimulator/multiplierSimulatorEndpoints.js";
import forumRoute from "../Endpoints/forumRoute.js";
import postRoute from "../Endpoints/postRoute.js";
import superInvestorsRoute from "../Endpoints/superInvestorsRoute.js";
import finCoinRouter from "../Endpoints/finCoinRouter.js";
import portfolioRoute from "../Endpoints/portfolioRoute.js";
import plaidRoute from "../Endpoints/PlaidService.js";
import articleRoute from "../Endpoints/articleRoute.js";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const app = express();

const allowedOrigins = ["http://localhost:8888", "https://finbud.pro"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const httpServer = createServer(app);
// Create Socket.io instance with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"],
  },
});

// Make io available globally
app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join simulation-specific room
  socket.on("join-simulation", (simulationId) => {
    socket.join(`simulation:${simulationId}`);
    console.log(`Client ${socket.id} joined simulation: ${simulationId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Socket.io namespace for multiplier simulator
const simulatorIo = io.of("/multiplier-simulator");
simulatorIo.on("connection", (socket) => {
  console.log("Client connected to multiplier simulator namespace:", socket.id);

  socket.on("join-simulation", (simulationId) => {
    socket.join(`simulation:${simulationId}`);
    console.log(
      `Client ${socket.id} joined simulation: ${simulationId} in simulator namespace`
    );
  });

  socket.on("disconnect", () => {
    console.log(
      "Client disconnected from multiplier simulator namespace:",
      socket.id
    );
  });
});

// Make simulatorIo available for the multiplier simulator route
app.set("simulatorIo", simulatorIo);

if (!mongoURI) {
  console.error("MONGO_URI is not defined in the environment variables");
  process.exit(1);
}

const connectToMongoDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      })
      .then(() => {
        console.log("MongoDB connected");
        resolve();
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
        reject(err);
      });
  });
};

passportConfig(app);

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

// app.use((req, res, next) => {
//   console.log(req.body);
//   next();
// });

const router = express.Router();

router.use("/", authRoute);
router.use("/", userRoute);
router.use("/", threadRoute);
router.use("/", newsRoute);
router.use("/", chatRoute);
router.use("/", cryptoRoute);
router.use("/", stockRoute);
router.use("/", transactionRoute);
router.use("/", stockTransactionRoute);
router.use("/", goalRoute);
router.use("/", proxyRoute);
router.use("/events", eventRoute);
router.use("/", chatStockRoute);
// Register the multiplier simulator route
router.use("/multiplier-simulator", multiplierSimulatorRoute);
// router.use('/', quantSimulatorRoute); // Commenting out undefined route
// router.use('/', chatStockRoute); // Duplicate route - already registered above
router.use("/", portfolioRoute);
router.use("/api/investors", superInvestorsRoute);
router.use("/api/forums", forumRoute);
router.use("/api/articles", articleRoute);
router.use("/api/posts", postRoute);
router.use("/", portfolioRoute);
router.use("/", finCoinRouter);
router.use("/api/plaid", plaidRoute);

app.use("/.netlify/functions/server", router);
// Also use routes without Netlify prefix for local development
app.use("/", router);

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!mongoose.connection.readyState) {
    try {
      await connectToMongoDB();
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to connect to database" }),
      };
    }
  }

  return serverless(app)(event, context);
};

// Start the server for local development if not in production
if (
  process.env.NODE_ENV !== "production" &&
  process.env.NETLIFY_DEV !== "true"
) {
  const PORT = process.env.PORT || 8889;
  connectToMongoDB()
    .then(() => {
      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Socket.io server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
    });
}

export { handler };
