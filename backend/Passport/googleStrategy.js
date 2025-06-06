import GoogleStrategy from "passport-google-oauth2";
import User from "../Database_Schema/core/User.js";

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.VUE_APP_DEPLOY_URL + "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("User authenticated through Google");
      const userEmail = profile.email;

      if (!userEmail) {
        return done(new Error("No email provided from Google"));
      }

      console.log("Checking if user exists:", userEmail);

      // Check for existing user by either email or username
      let existingUser = await User.findOne({
        $or: [
          { email: userEmail },
          { "accountData.username": userEmail }
        ]
      });
      
      if (existingUser) {
        console.log("Existing user found");
        // Update user profile if needed
        if (!existingUser.identityData.profilePicture && profile.picture) {
          existingUser = await User.findOneAndUpdate(
            { _id: existingUser._id },
            {
              $set: {
                "identityData.profilePicture": profile.picture,
                "identityData.firstName": profile.given_name || existingUser.identityData.firstName,
                "identityData.lastName": profile.family_name || existingUser.identityData.lastName,
                "identityData.displayName": profile.displayName || existingUser.identityData.displayName
              }
            },
            { new: true }
          );
        }
        return done(null, existingUser, { isNewUser: false });
      }

      console.log("Creating new user from Google profile");
      
      // Create new user with Google profile data
      const newUser = new User({
        email: userEmail,
        accountData: {
          username: userEmail,
          priviledge: "user"
        },
        identityData: {
          firstName: profile.given_name,
          lastName: profile.family_name,
          displayName: profile.displayName,
          profilePicture: profile.picture
        }
      });

      try {
        const savedUser = await newUser.save();
        console.log("New user created:", savedUser._id);
        return done(null, savedUser, { isNewUser: true });
      } catch (error) {
        if (error.code === 11000) {
          // In case of race condition, try to find the user one more time
          const user = await User.findOne({
            $or: [
              { email: userEmail },
              { "accountData.username": userEmail }
            ]
          });
          if (user) {
            return done(null, user, { isNewUser: false });
          }
        }
        throw error;
      }
    } catch (error) {
      console.error("Error in Google authentication:", error);
      return done(error);
    }
  }
);

export default googleStrategy;
