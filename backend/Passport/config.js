import passport from "passport";
import session from "express-session";
// import googleStrategy from "./googleStrategy.js"; // Do not import unconditionally
import localStrategy from "./localStrategy.js";
// MongoStore is imported dynamically in passportConfig() when needed

const passportConfig = async (app) => {
  passport.use(localStrategy);

  // Conditionally import and use Google Strategy only if credentials exist
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    try {
      const googleStrategyModule = await import("./googleStrategy.js");
      const googleStrategy = googleStrategyModule.default;
      // Register strategy - passport-google-oauth2 automatically uses name "google"
      passport.use(googleStrategy);
      console.log("✅ Google OAuth strategy configured.");
      
      // Verify strategy is registered
      const registeredStrategies = Object.keys(passport._strategies || {});
      console.log("📋 Registered Passport strategies:", registeredStrategies);
      if (!registeredStrategies.includes("google")) {
        throw new Error("Google strategy was not registered successfully");
      }
    } catch (err) {
      console.error("❌ Failed to load Google OAuth strategy:", err);
      console.error("   Error details:", err.stack);
      // Don't throw - allow server to start but warn about auth issues
      console.warn("   - Server will continue, but Google login will not work");
    }
  } else {
    console.warn(
      "⚠️ Google OAuth credentials not found. Skipping Google strategy setup."
    );
    console.warn("   - GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing");
    console.warn("   - GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing");
    console.warn("   - Google login routes will return an error if accessed");
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
    },
  };

  // Use MongoDB for session storage if available (required for Netlify Functions)
  if (process.env.MONGO_URI) {
    const MongoStore = require('connect-mongo');
    sessionConfig.store = MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 24 hours
      touchAfter: 3600, // Only update session every hour (reduces writes)
    });
    console.log("✅ Using MongoDB for session storage");
  } else {
    console.warn("⚠️ No MONGO_URI found - using memory store (sessions will be lost on restart!)");
  }

  app.use(session(sessionConfig));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    console.log("In serializeUser, saving user id in session: " + user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    console.log("In deserializeUser.");
    // Bypassing database call for testing without DB
    // let thisUser;
    // try {
    //   thisUser = await User.findOne({ _id: userId });
    //   console.log(
    //     "User with id " +
    //       userId +
    //       " found in DB. User object will be available in server routes as req.user."
    //   );
    //   done(null, thisUser);
    // } catch (err) {
    //   console.log("Error finding user in DB.");
    //   done(err);
    // }
    // For testing, just create a dummy user object with expected structure
    done(null, {
      _id: userId,
      id: userId,
      name: "Test User",
      accountData: {
        priviledge: "user", // Default to regular user, not admin
      },
    });
  });
};

export default passportConfig;
