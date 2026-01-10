import passport from "passport";
import session from "express-session";
// import googleStrategy from "./googleStrategy.js"; // Do not import unconditionally
import localStrategy from "./localStrategy.js";
import User from "../Database_Schema/core/User.js";
// MongoStore is imported dynamically in passportConfig() when needed

const passportConfig = (app) => {
  passport.use(localStrategy);

  // Conditionally import and use Google Strategy only if credentials exist
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    import("./googleStrategy.js")
      .then((googleStrategyModule) => {
        passport.use(googleStrategyModule.default);
        console.log("✅ Google OAuth strategy configured.");
      })
      .catch((err) => {
        console.error("❌ Failed to load Google OAuth strategy:", err);
      });
  } else {
    console.warn(
      "⚠️ Google OAuth credentials not found. Skipping Google strategy setup."
    );
  }

  // Use MongoStore for persistent sessions (required for serverless functions)
  const sessionConfig = {
    secret: process.env.SESSION_SECRET || "some secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'lax',
      httpOnly: true, // Prevent XSS attacks
      path: '/', // Ensure cookie is sent for all paths
    },
  };

  // Use MongoDB for session storage if available (required for Netlify Functions)
  // Skip MongoDB for local development to avoid connection timeouts
  if (process.env.MONGO_URI && process.env.NETLIFY_DEV !== "true") {
    try {
      const MongoStore = require('connect-mongo');
      sessionConfig.store = MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60, // 24 hours
        touchAfter: 3600, // Only update session every hour (reduces writes)
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ Using MongoDB for session storage");
    } catch (err) {
      console.warn("⚠️ Failed to connect to MongoDB for sessions:", err.message);
      console.warn("⚠️ Using memory store (sessions will be lost on restart!)");
    }
  } else {
    if (process.env.NETLIFY_DEV === "true") {
      console.log("🔧 Local development mode - using memory store for sessions");
    } else {
      console.warn("⚠️ No MONGO_URI found - using memory store (sessions will be lost on restart!)");
    }
  }

  app.use(session(sessionConfig));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    console.log("In serializeUser, saving user id in session: " + user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    console.log("========================================");
    console.log("In deserializeUser for userId:", userId);
    console.log("userId type:", typeof userId);
    
    if (!userId) {
      console.log("⚠️ No userId provided to deserializeUser");
      return done(null, null);
    }
    
    try {
      console.log("Attempting to find user in database...");
      const thisUser = await User.findById(userId);
      
      if (!thisUser) {
        console.log("⚠️ User with id " + userId + " not found in DB");
        console.log("This might be due to an old session. User needs to log in again.");
        return done(null, null);
      }
      
      console.log("✅ User found in DB:", {
        _id: thisUser._id,
        email: thisUser.email,
        accountData: thisUser.accountData,
        hasIdentityData: !!thisUser.identityData,
        displayName: thisUser.identityData?.displayName,
        profilePicture: thisUser.identityData?.profilePicture ? "YES" : "NO"
      });
      console.log("========================================");
      
      done(null, thisUser);
    } catch (err) {
      console.log("❌ Error in deserializeUser:", err.message);
      console.log("Error stack:", err.stack);
      console.log("========================================");
      // Don't throw error, return null to prevent auth breaking
      done(null, null);
    }
  });
};

export default passportConfig;
