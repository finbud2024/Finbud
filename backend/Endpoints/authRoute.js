//////////////////////////////////////////////////////////////////////////
//ROUTES FOR AUTHENTICATING USERS WITH PASSPORT
//////////////////////////////////////////////////////////////////////////

import passport from 'passport';
import express from 'express';
import {setupUserDocuments} from '../utils/setupUserDocuments.js';
const authRoute = express.Router();

//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Log In page.
authRoute.get('/auth/google', passport.authenticate('google', { 
  scope: [ 'email', 'profile' ],     
  prompt: "select_account",
  state: true, 
}));

//CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.
authRoute.get('/auth/google/callback', 
   (req, res, next) => {
    passport.authenticate('google',async (err, user, info) => {
      console.log("in google authenticate callback");
      console.log("Auth info received:", info);
      
      if (err) { 
        console.error("Authentication error:", err); 
        return next(err); 
      }
      
      if (!user) { 
        console.log("No user found"); 
        return res.redirect('/login'); 
      }

      await setupUserDocuments(user._id);
      
      // Check if this is a new user
      const isNewUser = info && info.isNewUser;
      console.log("Is new user flag:", isNewUser);
      
      req.logIn(user, (err) => {
        if (err) { 
          console.error("Login error:", err); 
          return next(err); 
        }
        
        console.log('User logged in successfully');
        
        if (isNewUser) {
          console.log("Redirecting new user to tutorial");
          // Set isNewUser flag in session
          req.session.isNewUser = true;
          return res.redirect('/?showTutorial=true');
        } else {
          console.log("Redirecting existing user to home");
          return res.redirect('/');
        }
      });
    })(req, res, next); 
  }
);


//lOGIN ROUTE FOR LOCAL USER
authRoute.post('/auth/login', passport.authenticate('local', { failWithError: true }),
  async (req, res) => {
    console.log("/login route reached: successful authentication.");
    
    // Check if this is a new user (for local login)
    // We can determine this by checking if this is their first login
    // or by checking a specific field in the user document
    const isNewUser = req.user.isNew || false;
    
    // Set isNewUser flag in session if user is new
    if (isNewUser) {
      req.session.isNewUser = true;
    }
    
    await setupUserDocuments(user._id);
    // Send the user data along with the isNewUser flag
    res.status(200).json({
      user: req.user,
      isNewUser: isNewUser
    });
  },
  (err, req, res, next) => {
    console.log("/login route reached: unsuccessful authentication");
    if (req.authError) {
      console.log("req.authError: " + req.authError); 
      res.status(401).send(req.authError);
    } else {
      res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
    }
  }
);

//LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.
authRoute.get('/auth/logout', (req, res, next) => {
    console.log('/auth/logout reached. Logging out');
    req.logout((err) => {
      if (err) { 
        return next(err); 
      }
      req.session.destroy((err) => {
        if (err) { 
          return next(err); 
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
        res.status(200);
      });
    });
  });

//TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.
authRoute.get('/auth/test', (req, res) => {
    console.log("auth/test reached.");
    const isAuth = req.isAuthenticated();
    if (isAuth) {
        console.log("User is authenticated");
        console.log("User record tied to session: " + JSON.stringify(req.user));
    } else {
        //User is not authenticated
        console.log("User is not authenticated");
    }
    //Return JSON object to client with results.
    res.json({isAuthenticated: isAuth, user: req.user});
});

// NEW ENDPOINT: Get current user data
// This endpoint will be used by the frontend to get the current user data
// without relying on localStorage
authRoute.get('/auth/current-user', (req, res) => {
  console.log("/auth/current-user reached.");
  if (req.isAuthenticated()) {
    console.log("User is authenticated, returning user data");
    return res.status(200).json({ 
      isAuthenticated: true, 
      user: req.user 
    });
  } else {
    console.log("User is not authenticated");
    return res.status(401).json({ 
      isAuthenticated: false, 
      message: "User is not authenticated" 
    });
  }
});

// NEW ENDPOINT: Check if user is new
authRoute.get('/auth/is-new-user', (req, res) => {
  console.log("/auth/is-new-user reached.");
  if (req.isAuthenticated()) {
    const isNewUser = req.session.isNewUser || false;
    console.log("Is new user:", isNewUser);
    
    // Clear the flag after checking it
    if (isNewUser) {
      req.session.isNewUser = false;
    }
    
    return res.status(200).json({ 
      isNewUser: isNewUser
    });
  } else {
    console.log("User is not authenticated");
    return res.status(401).json({ 
      isAuthenticated: false, 
      message: "User is not authenticated" 
    });
  }
});

export default authRoute;