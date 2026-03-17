import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Source from "../models/core/Source.js";
import Article from "../models/social/Article.js";
import serverless from "serverless-http";
import dotenv from "dotenv";
import passportConfig from "../Passport/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
//routes for processing users request
import authRoute from "../routes/auth/authRoute.js";
import threadRoute from "../routes/social/threadRoute.js";
import userRoute from "../routes/auth/userRoute.js";
import newsRoute from "../routes/data/newsRoute.js";
import chatRoute from "../routes/services/chatRoute.js";
import cryptoRoute from "../routes/trading/cryptoRoute.js";
import stockRoute from "../routes/finance/stockRoute.js";
import stockTransactionRoute from "../routes/finance/stockTransactionRoute.js";
import goalRoute from "../routes/finance/goalRoute.js";
import transactionRoute from "../routes/finance/transactionRoute.js";
import proxyRoute from "../routes/services/proxyRoute.js";
import eventRoute from "../routes/social/eventRoute.js";
import chatStockRoute from "../routes/services/subChat/chatStockRoute.js";
// Import the multiplier simulator route
import multiplierSimulatorRoute from "../routes/trading/quantSimulator/multiplierSimulatorEndpoints.js";
import forumRoute from "../routes/social/forumRoute.js";
import postRoute from "../routes/social/postRoute.js";
import superInvestorsRoute from "../routes/data/superInvestorsRoute.js";
import finCoinRouter from "../routes/finance/finCoinRouter.js";
import portfolioRoute from "../routes/finance/portfolioRoute.js";
import plaidRoute from "../routes/external/PlaidService.js";
import filingsRoute, { loadCompanies } from "../routes/data/finData/filingsRoute.js";
import articleRoute from "../routes/data/articleRoute.js";
import insiderTransactionRoute from "../routes/data/finData/transactionRoute.js";
import notiRoute from "../routes/auth/notiRoute.js";
import courseRoute from "../routes/social/courseRoute.js";
import vietStock from "../routes/data/vietStock.js";
import finCompareRoute from "../routes/finance/finCompareRoute.js";
// Import new services
import peAnalysisRoute from '../routes/services/peAnalysisService.js';


dotenv.config();

const mongoURI = process.env.MONGO_URI;
const app = express();

const allowedOrigins = [
  "http://localhost:8888",
  "https://finbud.pro",
  "http://localhost:8080",
  process.env.VUE_APP_DEPLOY_URL,
  "https://finbud-ai.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // ✅ Allow undefined origins (like Postman, curl, or internal requests)
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

// Deep Research Service Socket.io namespace for real-time logging
const deepResearchIo = io.of("/deep-research");
deepResearchIo.on("connection", (socket) => {
  console.log("Client connected to deep research namespace:", socket.id);

  // Handle progress logging events from the deep research service
  socket.on("progress", (data) => {
    console.log(`Deep Research Progress: ${data.message}`);
    // Broadcast progress to all clients in the same research session
    socket.broadcast.emit("progress", data);
  });

  socket.on("join-research", (researchId) => {
    socket.join(`research:${researchId}`);
    console.log(`Client ${socket.id} joined research: ${researchId} in deep research namespace`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected from deep research namespace:", socket.id);
  });
});

app.set("deepResearchIo", deepResearchIo);


if (!mongoURI) {
  console.warn("⚠️ MONGO_URI is not defined - MongoDB features will be disabled");
}

const connectToMongoDB = async () => {
  if (!mongoURI) {
    console.log("⚠️ Skipping MongoDB connection (no MONGO_URI configured)");
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      })
      .then(() => {
        console.log("✅ MongoDB connected");
        resolve();
      })
      .catch((err) => {
        console.warn("⚠️ MongoDB connection failed:", err.message);
        console.log("⚠️ Continuing without MongoDB - some features may be limited");
        resolve(); // Resolve anyway to allow server to start
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
router.use("/", stockTransactionRoute);
router.use("/", goalRoute);
router.use("/", transactionRoute);
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
router.use("/", filingsRoute);
router.use("/", insiderTransactionRoute);
router.use("/", notiRoute);
router.use("/api/courses", courseRoute);
router.use("/api/vietstock", vietStock);
router.use("/", finCompareRoute);
// Register new routes
router.use("/api/pe-analysis", peAnalysisRoute);


app.use("/.netlify/functions/server", router);
// Also use routes without Netlify prefix for local development
app.use("/", router);

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!mongoose.connection.readyState) {
    try {
      await connectToMongoDB();
      await loadCompanies();
    } catch (error) {
      console.log("Error starting the server");
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
  console.log("🚀 Starting backend server...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("NETLIFY_DEV:", process.env.NETLIFY_DEV);
  const PORT = process.env.PORT || 8889;
  console.log("Connecting to MongoDB...");
  connectToMongoDB()
    .then(async () => {
      console.log("✅ MongoDB connected successfully");
      console.log("Loading companies...");
      try {
        await loadCompanies();
        console.log("✅ Companies loaded");
      } catch (err) {
        console.warn("⚠️ Failed to load companies:", err.message);
        console.log("⚠️ Continuing without companies data");
      }
    })
    .then(() => {
      httpServer.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`✅ Socket.io server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to start server:", err);
      console.error("❌ Error stack:", err.stack);
      process.exit(1);
    });
} else {
  console.log("⚠️ Server not starting - Environment check failed:");
  console.log("   NODE_ENV:", process.env.NODE_ENV);
  console.log("   NETLIFY_DEV:", process.env.NETLIFY_DEV);
  console.log("   Condition:", process.env.NODE_ENV !== "production", "&&", process.env.NETLIFY_DEV !== "true");
}

export { handler };
