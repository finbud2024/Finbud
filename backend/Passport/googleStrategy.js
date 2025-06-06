<<<<<<< Updated upstream
import GoogleStrategy from 'passport-google-oauth2'; 
import User from '../Database Schema/User.js';
=======
import GoogleStrategy from "passport-google-oauth2";
import User from "../database-schema/core/User.js";
>>>>>>> Stashed changes

const googleStrategy = new GoogleStrategy.Strategy ({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.VUE_APP_DEPLOY_URL + "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("User authenticated through Google. In Google Strategy.");
        //Our convention is to build userId from displayName and provider
        const userId = profile.email;
        console.log("Checking if user exists:", userId);
        
        const existingUser = await User.findOne({"accountData.username": userId});
        if (existingUser) {
            console.log("Existing user found, not a new user");
            return done(null, existingUser, { isNewUser: false });
        } else {
            console.log("User not found in database. Creating new user.");
        }
        
        const update = {
            accountData: {
                username: userId
            },
            identityData: {
                firstName: profile.given_name,
                lastName: profile.family_name,
                displayName: profile.displayName,
                profilePicture: profile.picture
            }
        };
        
        try {
            const currentUser = await User.findOneAndUpdate({"accountData.username": userId}, update, {
                new: true,
                upsert: true,
            });
            console.log("New user created:", currentUser._id);
            console.log("Setting isNewUser flag to true");
            return done(null, currentUser, { isNewUser: true });
        } catch (error) {
            console.error("Error creating new user:", error);
            return done(error);
        }
    }
);

export default googleStrategy;