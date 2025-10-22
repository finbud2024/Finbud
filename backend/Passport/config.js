import passport from "passport";
import session from "express-session";
// import googleStrategy from "./googleStrategy.js"; // Do not import unconditionally
import localStrategy from "./localStrategy.js";
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
