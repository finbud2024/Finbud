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
authRoute.get('/auth/google/callback', 
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      console.log("in google authenticate callback")
      if (err) { console.error(err); return next(err); }
      if (!user) { console.log('No user found'); return res.redirect('/login'); }
      req.logIn(user, (err) => {
        if (err) { console.error(err); return next(err); }
        console.log('User logged in');
        return res.redirect('/');
      });
    })(req, res, next); 
  }
);


//lOGIN ROUTE FOR LOCAL USER
authRoute.post('/auth/login', passport.authenticate('local', { failWithError: true }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    //Redirect to app's main page; the /auth/test route should return true
    res.status(200).send(req.user);
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

export default authRoute;