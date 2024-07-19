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
        console.log(profile);
        const existingUser = await User.findOne({"accountData.username": userId});
        if (existingUser) {
            return done(null, existingUser);
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
        const currentUser = await User.findOneAndUpdate({"accountData.username": userId}, update, {
            new: true,
            upsert: true,
        });
        return done(null,currentUser);
    }
);

export default googleStrategy;