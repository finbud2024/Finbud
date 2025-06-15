import passport from "passport";
import session from "express-session";
// import googleStrategy from "./googleStrategy.js"; // Do not import unconditionally
import localStrategy from "./localStrategy.js";
// import User from "../Database_Schema/core/User.js"; // No DB connection needed for this test
// import MongoStore from "connect-mongo"; // No DB connection needed for this test

const passportConfig = (app) => {
  passport.use(localStrategy);

  // Conditionally import and use Google Strategy only if credentials exist
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    import("./googleStrategy.js").then(googleStrategyModule => {
      passport.use(googleStrategyModule.default);
      console.log("✅ Google OAuth strategy configured.");
    }).catch(err => {
        console.error("❌ Failed to load Google OAuth strategy:", err);
    });
  } else {
    console.warn('⚠️ Google OAuth credentials not found. Skipping Google strategy setup.');
  }

  app.use(
    session({
      secret: "some secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false, // Set to true if using HTTPS
      },
      // Using in-memory store instead of MongoStore for testing without a DB
      // store: MongoStore.create({
      //   mongoUrl: process.env.MONGO_URI,
      //   ttl: 24 * 60 * 60,
      // }),
    })
  );

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
    // For testing, just create a dummy user object
    done(null, { id: userId, name: "Test User" });
  });
};

export default passportConfig;
