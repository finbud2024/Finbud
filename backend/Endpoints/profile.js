import express from 'express';
import User from '../Database Schema/User.js';

const profileRoute = express.Router();

// GET: Retrieve a specific user profile with given username
profileRoute.get('/profile/:username', async (req, res) => {
  const username = req.params.username;
  console.log('in /profile/:username Route (GET) user with username:' + JSON.stringify(username));
  try {
    const user = await User.findOne({ "accountData.username": username }, "accountData.username accountData.password");
    if (!user) {
      return res.status(404).send(`Cannot find user in db with username: ${username}`);
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(501).send("Internal error: " + err);
  }
});

export default profileRoute;
