import GoogleStrategy from "passport-google-oauth2";
import User from "../Database_Schema/core/User.js";

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Prefer explicit override, fallback to Netlify Dev Functions URL for local development
    callbackURL:
      process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:8888/.netlify/functions/server/auth/google/callback",
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
        $or: [{ email: userEmail }, { "accountData.username": userEmail }],
      });

      if (existingUser) {
        console.log("Existing user found");
        
        // Update user profile with Google data only if missing
        if (profile) {
          const updateData = {};
          
          // Only update profile picture if missing or if user wants to sync from Google
          // Always sync profile picture to keep it up-to-date with Google
          if (profile.picture) {
            updateData["identityData.profilePicture"] = profile.picture;
          }
          
          // Only update display name if it's missing (respect user customization)
          if (!existingUser.identityData?.displayName && (profile.displayName || profile.given_name)) {
            updateData["identityData.displayName"] = 
              profile.displayName || profile.given_name || "User";
            console.log("Setting initial display name from Google:", updateData["identityData.displayName"]);
          }
          
          // Only update first/last name if missing (respect user customization)
          if (!existingUser.identityData?.firstName && profile.given_name) {
            updateData["identityData.firstName"] = profile.given_name;
          }
          if (!existingUser.identityData?.lastName && profile.family_name) {
            updateData["identityData.lastName"] = profile.family_name;
          }
          
          if (Object.keys(updateData).length > 0) {
            existingUser = await User.findOneAndUpdate(
              { _id: existingUser._id },
              { $set: updateData },
              { new: true }
            );
            console.log("Updated user with Google profile data (only missing fields):", updateData);
          } else {
            console.log("No updates needed - user profile is complete");
          }
        }
        return done(null, existingUser, { isNewUser: false });
      }

      console.log("Creating new user from Google profile");

      // Create new user with Google profile data
      const newUser = new User({
        email: userEmail,
        accountData: {
          username: userEmail,
          priviledge: "user",
        },
        identityData: {
          firstName: profile.given_name || "",
          lastName: profile.family_name || "",
          displayName: profile.displayName || profile.given_name || "User",
          profilePicture: profile.picture || "",
        },
      });

      try {
        const savedUser = await newUser.save();
        console.log("New user created:", savedUser._id);
        return done(null, savedUser, { isNewUser: true });
      } catch (error) {
        if (error.code === 11000) {
          // In case of race condition, try to find the user one more time
          const user = await User.findOne({
            $or: [{ email: userEmail }, { "accountData.username": userEmail }],
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
