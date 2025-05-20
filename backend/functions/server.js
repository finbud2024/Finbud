import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Source from "../Database Schema/Source.js";  
import Article from "../Database Schema/FinEdu/Article.js";
import serverless from "serverless-http";
import dotenv from "dotenv";
import passportConfig from "../Passport/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
//routes for processing users request
import authRoute from "../Endpoints/Authentication/authRoute.js";
import threadRoute from "../Endpoints/FinEdu/threadRoute.js";
import userRoute from "../Endpoints/utils/userRoute.js";
import newsRoute from "../Endpoints/utils/newsRoute.js";
import chatRoute from "../Endpoints/Chat/chatRoute.js";
import cryptoRoute from "../Endpoints/FinManage/cryptoRoute.js";
import stockRoute from "../Endpoints/FinInvest/stockRoute.js";
import stockTransactionRoute from "../Endpoints/FinInvest/stockTransactionRoute.js";
import goalRoute from "../Endpoints/FinManage/goalRoute.js";
import transactionRoute from "../Endpoints/FinInvest/finData/transactionRoute.js";
import proxyRoute from "../Endpoints/utils/proxyRoute.js";
import eventRoute from "../Endpoints/FinEdu/eventRoute.js";
import chatStockRoute from "../Endpoints/FinInvest/chatStockRoute.js";
// Import the multiplier simulator route
import multiplierSimulatorRoute from "../Endpoints/FinInvest/multiplierSimulatorEndpoints.js";
import forumRoute from "../Endpoints/FinEdu/forumRoute.js";
import postRoute from "../Endpoints/FinEdu/postRoute.js";
import superInvestorsRoute from "../Endpoints/FinManage/superInvestorsRoute.js";
import finCoinRouter from "../Endpoints/FinInvest/finCoinRouter.js";
import portfolioRoute from "../Endpoints/FinInvest/portfolioRoute.js";
import plaidRoute from "../Endpoints/FinManage/PlaidService.js";
import filingsRoute, { loadCompanies } from "../Endpoints/FinInvest/finData/filingsRoute.js";
import articleRoute from "../Endpoints/FinEdu/articleRoute.js";
import insiderTransactionRoute from "../Endpoints/FinInvest/finData/transactionRoute.js";
import notiRoute from "../Endpoints/Home/notiRoute.js";
import courseRoute from "../Endpoints/FinEdu/courseRoute.js";

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
router.use("/", insiderTransactionRoute)
router.use("/", notiRoute);
router.use("/api/courses", courseRoute)

app.use("/.netlify/functions/server", router);
// Also use routes without Netlify prefix for local development
app.use("/", router);

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!mongoose.connection.readyState) {
    try {
      await connectToMongoDB();
      await loadCompanies()
    } catch (error) {
      console.log("Error starting the server")
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
  .then(() => loadCompanies())
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
