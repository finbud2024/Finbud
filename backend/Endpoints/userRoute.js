import express from 'express';
import User from '../Database Schema/User.js';
import validateRequest from '../utils/validateRequest.js';

const userRoute = express.Router();

// GET: Retrieve a specific user with given Id
userRoute.get("/users/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log('in /users/:userId Route (GET) user with ID:' + JSON.stringify(userId));
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send(`Cannot find user in db with user ID is: ${userId}`);
        }
        return res.status(200).send(user);
    } catch (err) {
        return res.status(501).send("Internal error: " + err);
    }
});

// PUT: update user with given id
userRoute.put("/users/:userId", validateRequest(User.schema), async (req, res) => {
    const userId = req.params.userId;
    console.log('in /users/:userId Route (PUT) user with ID:' + userId);
    try {
        const filter = { "_id": userId };
        const updatedUser = {};

        if (req.body.accountData) {
            for (const key in req.body.accountData) {
                updatedUser[`accountData.${key}`] = req.body.accountData[key];
            }
        }

        if (req.body.identityData) {
            for (const key in req.body.identityData) {
                updatedUser[`identityData.${key}`] = req.body.identityData[key];
            }
        }

        const user = await User.updateOne(filter, updatedUser, {
            new: true
        });

        if (!user.modifiedCount) {
            return res.status(404).send(`Cannot find user with user ID : ${userId} in database`);
        }

        return res.status(200).send({ message: `User updated successfully`, updatedUser: user });
    } catch (err) {
        return res.status(501).send("Internal error: " + err);
    }
});

// DELETE: delete a user with given id
userRoute.delete("/users/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log('In /users/:userid Route (DELETE) for thread with ID: ' + userId);
    try {
        const user = await User.findOneAndDelete({ _id: userId });
        if (!user) {
            return res.status(404).send(`Cannot find user in db with user ID is: ${userId}`);
        }
        return res.status(200).send('User deleted successfully');
    } catch (err) {
        return res.status(500).send("Internal sever error: " + err);
    }
});

// GET: get all users from database
userRoute.get("/users", async (req, res) => {
    console.log("in /users route (GET) all users");
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(501).send('Internal sever error: ' + err);
    }
});

// POST: save a new user into database
userRoute.post("/users", validateRequest(User.schema), async (req, res) => {
    console.log(req.body);
    if (!req.body.accountData.username) {
        console.log(req.body);
        return res.status(404).send("Unable to save new user to database due to missing username");
    }
    if (!req.body.accountData.password) {
        return res.status(404).send("Unable to save new user to database due to missing password");
    }
    try {
        console.log("in /users route (POST) new user to database");
        let user = await User.findOne({ "accountData.username": req.body.accountData.username });
        if (user) { // checking for user availability ---- user existed
            return res.status(400).send("Username: " + req.body.accountData.username + " already existed in database");
        }
        // user has not been used. Good to add
        let newUserData = {};
        if (req.body.accountData) {
            for (const key in req.body.accountData) {
                newUserData[`accountData.${key}`] = req.body.accountData[key];
            }
        }
        if (req.body.identityData) {
            for (const key in req.body.identityData) {
                newUserData[`identityData.${key}`] = req.body.identityData[key];
            }
        }
        let newUser = await new User(newUserData).save();
        return res.status(200).json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Unexpected error occurred when saving user to database: " + err);
    }
});

export default userRoute;
