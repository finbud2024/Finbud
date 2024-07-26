import passportLocal from 'passport-local'; 
import User from '../Database Schema/User.js';
// import bcrypt from 'bcrypt';

const localStrategy = new passportLocal.Strategy({passReqToCallback: true},
    async (req, username, password, done) => {
      console.log("Inside local strategy authenticating by passport");
      try {
        const thisUser = await User.findOne({"accountData.username": username});
        if (thisUser) {
          const match = await thisUser.comparePassword(password);
          if (match) {
            return done(null, thisUser);
          } else {
            console.log(`provided password is incorrect`)
            req.authError = "The password is incorrect. Please try again" + 
                             " or reset your password.";
            return done(null, false)
          }
        } else { //username not found in DB
            console.log(`user with username: ${username} not found in Database`)
          req.authError = "There is no account with email " + username + 
                          ". Please try again.";
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    }
  );
  
  export default localStrategy;