import passport from 'passport';
import session from 'express-session';
import googleStrategy from './googleStrategy.js';
import localStrategy from  './localStrategy.js';
import User from '../Database Schema/User.js'
import MongoStore from 'connect-mongo';

const passportConfig = (app) => {
    passport.use(localStrategy);
    passport.use(googleStrategy);

    passport.serializeUser((user, done) => {
        console.log("In serializeUser.");
        done(null,user._id);
    });
        
    passport.deserializeUser(async (userId, done) => {
        console.log("In deserializeUser.");
        let thisUser;
        try {
          thisUser = await User.findOne({"_id": userId});
          console.log("User with id " + userId + 
            " found in DB. User object will be available in server routes as req.user.")
          done(null,thisUser);
        } catch (err) {
          console.log(err)
          done(err);
        }
      });
      
      const isProduction = process.env.NODE_ENV === "production";
      const isNetlifyDev = process.env.NETLIFY_DEV === "true";
      console.log("NODE_ENV:", process.env.NODE_ENV);
      
      app.use(
        session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
          store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // MongoDB connection string
            ttl: 24 * 60 * 60, // Session expiration time in seconds (e.g., 1 day)
          }),
          cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            path: "/",
            sameSite: "none",
            secure: true
            // sameSite: isProduction || isNetlifyDev ? "none" : "lax",
            // secure: isProduction || isNetlifyDev
          }
        })
      )
  
        .use(passport.initialize())
        .use(passport.session());
}

  export default passportConfig;