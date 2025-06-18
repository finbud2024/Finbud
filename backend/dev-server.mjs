import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passportConfig from "./Passport/config.js";
import { createServer } from "http";
import { Server } from "socket.io";

//routes for processing users request
import authRoute from "./Endpoints/auth/authRoute.js";
import threadRoute from "./Endpoints/social/threadRoute.js";
import userRoute from "./Endpoints/auth/userRoute.js";
import newsRoute from "./Endpoints/data/newsRoute.js";
import chatRoute from "./Endpoints/services/chatRoute.js";
import cryptoRoute from "./Endpoints/trading/cryptoRoute.js";
import stockRoute from "./Endpoints/finance/stockRoute.js";
import stockTransactionRoute from "./Endpoints/finance/stockTransactionRoute.js";
import goalRoute from "./Endpoints/finance/goalRoute.js";
import transactionRoute from "./Endpoints/finance/transactionRoute.js";
import proxyRoute from "./Endpoints/services/proxyRoute.js";
import eventRoute from "./Endpoints/social/eventRoute.js";
import chatStockRoute from "./Endpoints/services/subChat/chatStockRoute.js";
import multiplierSimulatorRoute from "./Endpoints/trading/quantSimulator/multiplierSimulatorEndpoints.js";
import forumRoute from "./Endpoints/social/forumRoute.js";
import postRoute from "./Endpoints/social/postRoute.js";
import superInvestorsRoute from "./Endpoints/data/superInvestorsRoute.js";
import finCoinRouter from "./Endpoints/finance/finCoinRouter.js";
import portfolioRoute from "./Endpoints/finance/portfolioRoute.js";
import plaidRoute from "./Endpoints/external/PlaidService.js";
import filingsRoute from "./Endpoints/data/finData/filingsRoute.js";
import articleRoute from "./Endpoints/data/articleRoute.js";
import insiderTransactionRoute from "./Endpoints/data/finData/transactionRoute.js";
import notiRoute from "./Endpoints/auth/notiRoute.js";
import courseRoute from "./Endpoints/social/courseRoute.js";
import vietStock from "./Endpoints/data/vietStock.js";
import finCompareRoute from "./Endpoints/finance/finCompareRoute.js";
import peAnalysisRoute from './Endpoints/services/peAnalysisService.js';
import aiWorkflowRoute from './Endpoints/services/aiWorkflowService.js';
import dailynewsRoute from './Endpoints/data/dailynewsRoute.js'

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const app = express();

// CORS configuration for development
const allowedOrigins = [
  "http://localhost:8081", // Vue frontend
  "http://localhost:8080", 
  "http://localhost:3000",
  "https://finbud.pro"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-simulation", (simulationId) => {
    socket.join(`simulation:${simulationId}`);
    console.log(`Client ${socket.id} joined simulation: ${simulationId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const simulatorIo = io.of("/multiplier-simulator");
simulatorIo.on("connection", (socket) => {
  console.log("Client connected to multiplier simulator namespace:", socket.id);

  socket.on("join-simulation", (simulationId) => {
    socket.join(`simulation:${simulationId}`);
    console.log(`Client ${socket.id} joined simulation: ${simulationId} in simulator namespace`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected from multiplier simulator namespace:", socket.id);
  });
});

app.set("simulatorIo", simulatorIo);

// Connect to MongoDB
const connectToMongoDB = async () => {
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the environment variables");
    console.log("Starting server without database connection for testing...");
    return;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    console.log("Starting server without database connection...");
  }
};

// Initialize Passport
passportConfig(app);

// Body parser middleware
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Register all routes
app.use("/", authRoute);
app.use("/", userRoute);
app.use("/", threadRoute);
app.use("/", newsRoute);
app.use("/services", chatRoute); // ✅ Deep Research endpoint available at /services/
app.use("/", cryptoRoute);
app.use("/", stockRoute);
app.use("/", stockTransactionRoute);
app.use("/", goalRoute);
app.use("/", transactionRoute);
app.use("/", proxyRoute);
app.use("/events", eventRoute);
app.use("/", chatStockRoute);
app.use("/multiplier-simulator", multiplierSimulatorRoute);
app.use("/", portfolioRoute);
app.use("/api/investors", superInvestorsRoute);
app.use("/api/forums", forumRoute);
app.use("/api/articles", articleRoute);
app.use("/api/posts", postRoute);
app.use("/", finCoinRouter);
app.use("/api/plaid", plaidRoute);
app.use("/", filingsRoute);
app.use("/", insiderTransactionRoute);
app.use("/", notiRoute);
app.use("/api/courses", courseRoute);
app.use("/api/vietstock", vietStock);
app.use("/", finCompareRoute);
app.use("/api/pe-analysis", peAnalysisRoute);
app.use("/api/ai-workflows", aiWorkflowRoute);
app.use('/dailyNews', newsRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Test endpoint for Deep Research
app.get("/services/test", (req, res) => {
  res.json({ message: "Deep Research backend is working!" });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectToMongoDB();
    
    // Load companies if filingsRoute needs it
    try {
      if (filingsRoute.loadCompanies && typeof filingsRoute.loadCompanies === 'function') {
        await filingsRoute.loadCompanies();
        console.log("✅ Companies loaded successfully");
      }
    } catch (err) {
      console.log("⚠️  Could not load companies:", err.message);
    }

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 FinBud Backend Development Server running on:`);
      console.log(`   - Local:   http://localhost:${PORT}`);
      console.log(`   - Health:  http://localhost:${PORT}/health`);
      console.log(`   - Deep Research Test: http://localhost:${PORT}/services/test`);
      console.log(`\n🔗 Available endpoints:`);
      console.log(`   - POST /services/deep-research`);
      console.log(`   - POST /services/meta-research`);
      console.log(`   - GET /health`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Start the server
startServer(); 