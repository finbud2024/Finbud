// FinBud Server - CommonJS version for universal compatibility
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Async imports for ES modules (routes)
let Source, Article, passportConfig;
let authRoute, threadRoute, userRoute, newsRoute, chatRoute, cryptoRoute;
let stockRoute, stockTransactionRoute, goalRoute, transactionRoute, proxyRoute;
let eventRoute, chatStockRoute, multiplierSimulatorRoute, forumRoute, postRoute;
let superInvestorsRoute, finCoinRouter, portfolioRoute, plaidRoute;
let filingsRoute, loadCompanies, articleRoute, insiderTransactionRoute;
let notiRoute, courseRoute, vietStock, finCompareRoute;

// Environment detection
const isNetlify = !!(process.env.NETLIFY || process.env.NETLIFY_DEV || process.env.AWS_LAMBDA_FUNCTION_NAME);
const isDev = process.env.NODE_ENV !== 'production';

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const app = express();

const allowedOrigins = ["http://localhost:8888", "https://finbud.pro"];

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

// Function to load all ES module routes dynamically
const loadRoutes = async () => {
  try {
    console.log("Loading ES module dependencies...");
    
    // Load ES modules dynamically
    Source = (await import("../Database_Schema/core/Source.js")).default;
    Article = (await import("../Database_Schema/social/Article.js")).default;
    passportConfig = (await import("../Passport/config.js")).default;
    
    // Load all route modules
    authRoute = (await import("../Endpoints/auth/authRoute.js")).default;
    threadRoute = (await import("../Endpoints/social/threadRoute.js")).default;
    userRoute = (await import("../Endpoints/auth/userRoute.js")).default;
    newsRoute = (await import("../Endpoints/data/newsRoute.js")).default;
    chatRoute = (await import("../Endpoints/services/chatRoute.js")).default;
    cryptoRoute = (await import("../Endpoints/trading/cryptoRoute.js")).default;
    stockRoute = (await import("../Endpoints/finance/stockRoute.js")).default;
    stockTransactionRoute = (await import("../Endpoints/finance/stockTransactionRoute.js")).default;
    goalRoute = (await import("../Endpoints/finance/goalRoute.js")).default;
    transactionRoute = (await import("../Endpoints/finance/transactionRoute.js")).default;
    proxyRoute = (await import("../Endpoints/services/proxyRoute.js")).default;
    eventRoute = (await import("../Endpoints/social/eventRoute.js")).default;
    chatStockRoute = (await import("../Endpoints/services/subChat/chatStockRoute.js")).default;
    multiplierSimulatorRoute = (await import("../Endpoints/trading/quantSimulator/multiplierSimulatorEndpoints.js")).default;
    forumRoute = (await import("../Endpoints/social/forumRoute.js")).default;
    postRoute = (await import("../Endpoints/social/postRoute.js")).default;
    superInvestorsRoute = (await import("../Endpoints/data/superInvestorsRoute.js")).default;
    finCoinRouter = (await import("../Endpoints/finance/finCoinRouter.js")).default;
    portfolioRoute = (await import("../Endpoints/finance/portfolioRoute.js")).default;
    plaidRoute = (await import("../Endpoints/external/PlaidService.js")).default;
    
    const filingsModule = await import("../Endpoints/data/finData/filingsRoute.js");
    filingsRoute = filingsModule.default;
    loadCompanies = filingsModule.loadCompanies;
    
    articleRoute = (await import("../Endpoints/data/articleRoute.js")).default;
    insiderTransactionRoute = (await import("../Endpoints/data/finData/transactionRoute.js")).default;
    notiRoute = (await import("../Endpoints/auth/notiRoute.js")).default;
    courseRoute = (await import("../Endpoints/social/courseRoute.js")).default;
    vietStock = (await import("../Endpoints/data/vietStock.js")).default;
    finCompareRoute = (await import("../Endpoints/finance/finCompareRoute.js")).default;
    
    console.log("All ES modules loaded successfully");
    
    // Configure passport after loading
    passportConfig(app);
    
    return true;
  } catch (error) {
    console.error("Error loading ES modules:", error);
    throw error;
  }
};

// Initialize server
const initializeServer = async () => {
  try {
    // Load all routes
    await loadRoutes();
    
    app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
    app.use(bodyParser.json({ limit: "10mb" }));

    const router = express.Router();

    // Register all routes
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
    router.use("/multiplier-simulator", multiplierSimulatorRoute);
    router.use("/", portfolioRoute);
    router.use("/api/investors", superInvestorsRoute);
    router.use("/api/forums", forumRoute);
    router.use("/api/articles", articleRoute);
    router.use("/api/posts", postRoute);
    router.use("/", finCoinRouter);
    router.use("/api/plaid", plaidRoute);
    router.use("/", filingsRoute);
    router.use("/", insiderTransactionRoute);
    router.use("/", notiRoute);
    router.use("/api/courses", courseRoute);
    router.use("/api/vietstock", vietStock);
    router.use("/", finCompareRoute);

    app.use("/.netlify/functions/server", router);
    app.use("/", router);
    
    console.log("Server initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing server:", error);
    throw error;
  }
};

// Netlify handler
const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!mongoose.connection.readyState) {
      await connectToMongoDB();
      await loadCompanies();
    }

    // Initialize server if not already done
    if (!authRoute) {
      await initializeServer();
    }

    return serverless(app)(event, context);
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: isDev ? error.stack : undefined
      })
    };
  }
};

// Local development server
if (!isNetlify) {
  const PORT = process.env.PORT || 8889;
  
  connectToMongoDB()
    .then(() => initializeServer())
    .then(() => loadCompanies())
    .then(() => {
      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Socket.io server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
}

// Export handler for Netlify
module.exports = { handler };
module.exports.handler = handler; 