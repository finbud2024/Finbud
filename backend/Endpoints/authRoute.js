//////////////////////////////////////////////////////////////////////////
//ROUTES FOR AUTHENTICATING USERS WITH PASSPORT
//////////////////////////////////////////////////////////////////////////

import passport from 'passport';
import express from 'express';
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
authRoute.get('/auth/google/callback', passport.authenticate( 'google', { failureRedirect: '/' }),
  (req, res) => {
    console.log("auth/google/callback reached.");
    res.redirect('/'); //sends user back to login screen; 
                      //req.isAuthenticated() indicates status
  }
);

//LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.
authRoute.get('/auth/logout', (req, res, next) => {
    console.log('/auth/logout reached. Logging out');
    req.logout(err => {
      if (err) { return next(err); }
      res.redirect('/');
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

export default authRoute;