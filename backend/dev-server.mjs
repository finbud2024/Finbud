import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import mongoose from "mongoose";
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

dotenv.config();

// const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const app = express();

// CORS configuration for development
const allowedOrigins = [
  "http://localhost:8080", // Vue frontend
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
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  },
  path: '/socket.io' // Added path for deep research client
});

// Pass `io` instance to the request object so routes can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handling for deep research logs
io.on('connection', (socket) => {
  console.log('🔌 A client connected to the WebSocket for logging.');

  socket.on('progress', (data) => {
    // This is for client-to-server, we can just log it
    console.log(`[WS-IN] ${data.message}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected from WebSocket.');
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
// const connectToMongoDB = async () => {
//   if (!mongoURI) {
//     console.error("MONGO_URI is not defined in the environment variables");
//     console.log("Starting server without database connection for testing...");
//     return;
//   }

//   try {
//     await mongoose.connect(mongoURI, {
//       serverSelectionTimeoutMS: 5000,
//     });
//     console.log("✅ MongoDB connected successfully");
//   } catch (err) {
//     console.error("❌ Error connecting to MongoDB:", err.message);
//     console.log("Starting server without database connection...");
//   }
// };

// Initialize Passport with basic configuration
try {
  passportConfig(app);
  console.log("✅ Passport configured.");
} catch (error) {
  console.warn("⚠️ Passport configuration failed:", error.message);
  console.warn("   - Authentication features will not be available.");
}

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    // mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Logo proxy endpoint to avoid CORS issues
app.get('/api/logo/:logoName', async (req, res) => {
  try {
    const { logoName } = req.params;
    
    // Map stock symbols to company domains for Clearbit
    const domainMap = {
      'microsoft': 'microsoft.com',
      'alphabet': 'google.com',
      'goog': 'google.com',
      'googl': 'google.com',
      'apple': 'apple.com',
      'meta-platforms': 'meta.com',
      'nvidia': 'nvidia.com',
      'broadcom': 'broadcom.com',
      'taiwan-semiconductor': 'tsmc.com',
      'amazon': 'amazon.com',
      'tesla': 'tesla.com',
      'netflix': 'netflix.com',
      'salesforce': 'salesforce.com',
      'oracle': 'oracle.com',
      'intel': 'intel.com',
      'cisco': 'cisco.com',
      'adobe': 'adobe.com',
      'paypal': 'paypal.com',
      'uber': 'uber.com',
      'airbnb': 'airbnb.com',
      'spotify': 'spotify.com',
      'twitter': 'twitter.com',
      'linkedin': 'linkedin.com',
      'zoom': 'zoom.us',
      'slack': 'slack.com',
      'shopify': 'shopify.com',
      'square': 'squareup.com',
      'stripe': 'stripe.com',
      'twilio': 'twilio.com',
      'okta': 'okta.com',
      'crowdstrike': 'crowdstrike.com',
      'snowflake': 'snowflake.com',
      'datadog': 'datadoghq.com',
      'mongodb': 'mongodb.com',
      'elastic': 'elastic.co',
      'atlassian': 'atlassian.com',
      'servicenow': 'servicenow.com',
      'workday': 'workday.com',
      'vmware': 'vmware.com',
      'redhat': 'redhat.com',
      'ibm': 'ibm.com',
      'hp': 'hp.com',
      'dell': 'dell.com',
      'lenovo': 'lenovo.com',
      'samsung': 'samsung.com',
      'sony': 'sony.com',
      'nintendo': 'nintendo.com',
      'disney': 'disney.com',
      'netflix': 'netflix.com',
      'comcast': 'comcast.com',
      'verizon': 'verizon.com',
      'att': 'att.com',
      'tmobile': 't-mobile.com',
      'sprint': 'sprint.com',
      'vodafone': 'vodafone.com',
      'bt': 'bt.com',
      'orange': 'orange.com',
      'deutsche-telekom': 'telekom.de',
      'telefonica': 'telefonica.com',
      'vodafone': 'vodafone.com',
      'china-mobile': 'chinamobile.com',
      'china-unicom': 'chinaunicom.com',
      'china-telecom': 'chinatelecom.com',
      'softbank': 'softbank.com',
      'ntt': 'ntt.com',
      'kddi': 'kddi.com',
      'sk-telecom': 'sktelecom.com',
      'kt': 'kt.com',
      'lg': 'lg.com',
      'hyundai': 'hyundai.com',
      'kia': 'kia.com',
      'toyota': 'toyota.com',
      'honda': 'honda.com',
      'nissan': 'nissan.com',
      'mazda': 'mazda.com',
      'subaru': 'subaru.com',
      'mitsubishi': 'mitsubishi.com',
      'suzuki': 'suzuki.com',
      'isuzu': 'isuzu.com',
      'yamaha': 'yamaha.com',
      'kawasaki': 'kawasaki.com',
      'volkswagen': 'volkswagen.com',
      'bmw': 'bmw.com',
      'mercedes-benz': 'mercedes-benz.com',
      'audi': 'audi.com',
      'porsche': 'porsche.com',
      'ferrari': 'ferrari.com',
      'lamborghini': 'lamborghini.com',
      'maserati': 'maserati.com',
      'alfa-romeo': 'alfaromeo.com',
      'fiat': 'fiat.com',
      'peugeot': 'peugeot.com',
      'renault': 'renault.com',
      'citroen': 'citroen.com',
      'volvo': 'volvo.com',
      'saab': 'saab.com',
      'koenigsegg': 'koenigsegg.com',
      'rolls-royce': 'rolls-royce.com',
      'bentley': 'bentley.com',
      'aston-martin': 'astonmartin.com',
      'jaguar': 'jaguar.com',
      'land-rover': 'landrover.com',
      'mini': 'mini.com',
      'smart': 'smart.com',
      'tesla': 'tesla.com',
      'rivian': 'rivian.com',
      'lucid': 'lucidmotors.com',
      'nio': 'nio.com',
      'xpeng': 'xpeng.com',
      'li-auto': 'lixiang.com',
      'byton': 'byton.com',
      'faraday-future': 'faradayfuture.com',
      'fisker': 'fisker.com',
      'nikola': 'nikolamotor.com',
      'lordstown': 'lordstownmotors.com',
      'workhorse': 'workhorse.com',
      'arrival': 'arrival.com',
      'canoo': 'canoo.com',
      'hyliion': 'hyliion.com',
      'proterra': 'proterra.com',
      'chargepoint': 'chargepoint.com',
      'evgo': 'evgo.com',
      'blink-charging': 'blinkcharging.com',
      'volta': 'voltacharging.com',
      'electrify-america': 'electrifyamerica.com',
      'tesla': 'tesla.com',
      'spacex': 'spacex.com',
      'blue-origin': 'blueorigin.com',
      'virgin-galactic': 'virgingalactic.com',
      'boeing': 'boeing.com',
      'airbus': 'airbus.com',
      'lockheed-martin': 'lockheedmartin.com',
      'raytheon': 'raytheon.com',
      'northrop-grumman': 'northropgrumman.com',
      'general-dynamics': 'generaldynamics.com',
      'l3harris': 'l3harris.com',
      'textron': 'textron.com',
      'huntington-ingalls': 'huntingtoningalls.com',
      'spirit-aerosystems': 'spiritaero.com',
      'triumph-group': 'triumphgroup.com',
      'transdigm': 'transdigm.com',
      'hexcel': 'hexcel.com',
      'woodward': 'woodward.com',
      'cae': 'cae.com',
      'bombardier': 'bombardier.com',
      'embraer': 'embraer.com',
      'safran': 'safran.com',
      'thales': 'thalesgroup.com',
      'leonardo': 'leonardocompany.com',
      'saab': 'saab.com',
      'kongsberg': 'kongsberg.com',
      'bae-systems': 'baesystems.com',
      'rolls-royce': 'rolls-royce.com',
      'ge': 'ge.com',
      'honeywell': 'honeywell.com',
      'caterpillar': 'caterpillar.com',
      'deere': 'deere.com',
      'cnh-industrial': 'cnhindustrial.com',
      'agco': 'agcocorp.com',
      'kubota': 'kubota.com',
      'yanmar': 'yanmar.com',
      'mahindra': 'mahindra.com',
      'tata-motors': 'tatamotors.com',
      'maruti-suzuki': 'marutisuzuki.com',
      'hero-motocorp': 'heromotocorp.com',
      'bajaj-auto': 'bajajauto.com',
      'tvs-motor': 'tvsmotor.com',
      'royal-enfield': 'royalenfield.com',
      'ktm': 'ktm.com',
      'husqvarna': 'husqvarna.com',
      'gas-gas': 'gasgas.com',
      'beta': 'betamotor.com',
      'sherco': 'sherco.com',
      'tm-racing': 'tmracing.com',
      'ossa': 'ossa.com',
      'montesa': 'montesa.com',
      'derbi': 'derbi.com',
      'bultaco': 'bultaco.com',
      'sanglas': 'sanglas.com',
      'rieju': 'rieju.com',
      'gas-gas': 'gasgas.com',
      'beta': 'betamotor.com',
      'sherco': 'sherco.com',
      'tm-racing': 'tmracing.com',
      'ossa': 'ossa.com',
      'montesa': 'montesa.com',
      'derbi': 'derbi.com',
      'bultaco': 'bultaco.com',
      'sanglas': 'sanglas.com',
      'rieju': 'rieju.com'
    };
    
    const domain = domainMap[logoName.toLowerCase()];
    if (!domain) {
      return res.status(404).json({ error: 'Company domain not found' });
    }
    
    // Try multiple logo sources with fallbacks
    const logoSources = [
      `https://logo.clearbit.com/${domain}`,
      `https://logo.clearbit.com/${domain}?size=128`,
      `https://logo.clearbit.com/${domain}?size=64`,
      `https://logo.clearbit.com/${domain}?size=32`,
      // Alternative sources for companies not in Clearbit
      `https://logo.clearbit.com/${domain.replace('.com', '')}.com`,
      `https://logo.clearbit.com/www.${domain}`,
      `https://logo.clearbit.com/${domain.replace('www.', '')}`
    ];
    
    let lastError = null;
    for (const logoUrl of logoSources) {
      try {
        console.log(`🔄 Trying logo: ${logoUrl}`);
        const response = await fetch(logoUrl, { 
          method: 'HEAD',
          timeout: 5000 
        });
        
        if (response.ok) {
          // If HEAD request succeeds, fetch the actual image
          const imageResponse = await fetch(logoUrl, { timeout: 10000 });
          if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer();
            res.set({
              'Content-Type': imageResponse.headers.get('content-type') || 'image/png',
              'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
            });
            console.log(`✅ Logo found: ${logoUrl}`);
            return res.send(Buffer.from(imageBuffer));
          }
        }
      } catch (error) {
        lastError = error;
        console.log(`❌ Logo failed: ${logoUrl} - ${error.message}`);
        continue;
      }
    }
    
    // If all sources failed, return 404
    console.log(`❌ All logo sources failed for ${logoName}`);
    return res.status(404).json({ error: 'Logo not found from any source' });
  } catch (error) {
    console.error('Logo proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch logo' });
  }
});

// Test endpoint for Deep Research
app.get("/services/test", (req, res) => {
  res.json({ message: "Deep Research backend is working!" });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    // await connectToMongoDB();
    
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
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 FinBud Backend Development Server running on:`);
      console.log(`   - Local:   http://localhost:${PORT}`);
      console.log(`   - Health:  http://localhost:${PORT}/health`);
      console.log(`   - Deep Research Test: http://localhost:${PORT}/services/test`);
      console.log(`\n🔗 Available endpoints:`);
      console.log(`   - POST /services/deep-research`);
      console.log(`   - POST /services/meta-research`);
      console.log(`   - GET /health`);
      if (process.env.NODE_ENV === 'production') {
        console.log('Server running in production mode.');
        console.log(`Frontend production build served from 'dist' folder`);
        console.log(`Access it at http://localhost:${PORT}`);
      }
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
    // mongoose.connection.close(false, () => {
    //   console.log('✅ MongoDB connection closed');
    //   process.exit(0);
    // });
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    // mongoose.connection.close(false, () => {
    //   console.log('✅ MongoDB connection closed');
    //   process.exit(0);
    // });
    process.exit(0);
  });
});

// Start the server
startServer(); 