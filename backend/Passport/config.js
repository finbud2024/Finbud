import passport from 'passport';
import session from 'express-session';
import googleStrategy from './googleStrategy.js';
import localStrategy from  './localStrategy.js';
import User from '../Database Schema/User.js'

const passportConfig = (app) => {
    passport.use(localStrategy);
    passport.use(googleStrategy);

    passport.serializeUser((user, done) => {
        console.log("In serializeUser.");
        // console.log("Contents of user param: " + JSON.stringify(user));
        console.log("[abc]: ", user._id);
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
      

    app.use(session({
                secret: process.env.SESSION_SECRET, 
                resave: false,
                saveUninitialized: false,
                cookie: {maxAge: 1000 * 60}}))
  
        .use(passport.initialize())
        .use(passport.session());
}

  export default passportConfig;