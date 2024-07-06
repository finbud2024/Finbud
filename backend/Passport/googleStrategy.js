import GoogleStrategy from 'passport-google-oauth2'; 
import User from '../Database Schema/User.js';

const googleStrategy = new GoogleStrategy.Strategy ({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.VUE_APP_DEPLOY_URL + "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
            console.log("User authenticated through Google. In Google Strategy.");
            //Our convention is to build userId from displayName and provider
            const userId = profile.email;
            let currentUser = await User.findOne({"accountData.username": userId});
            if (!currentUser) { //Add this user to the database
                currentUser = await new User({
                accountData: {username: userId},
                identityData: {displayName: profile.displayName}
            }).save();
        }
        return done(null,currentUser);
    }
);

export default googleStrategy;