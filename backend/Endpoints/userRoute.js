<<<<<<< Updated upstream:backend/Endpoints/userRoute.js
import express from 'express';
import User from '../Database Schema/User.js';
import validateRequest from '../utils/validateRequest.js';
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from '../middleware/auth.js';

const userRoute = express.Router();

// GET: Retrieve a specific user with given Id
userRoute.get("/users/:userId", isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    console.log('in /users/:userId Route (GET) user with ID:' + JSON.stringify(userId));
    try {
        //const user = await User.findById(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send(`Cannot find user in db with user ID is: ${userId}`);
        }
        return res.status(200).send(user);
    } catch (err) {
        return res.status(501).send("Internal error: " + err);
    }
});

// Update user settings
userRoute.put("/users/:userId/settings", isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    console.log('in /users/:userId/settings Route (PUT) user with ID:', userId);
    console.log('Request body:', req.body);
    
    try {
        // First verify the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            console.log('User not found in database');
            return res.status(404).send(`Cannot find user with user ID : ${userId} in database`);
        }

        const filter = { "_id": userId };
        const update = { $set: { 'settings.darkMode': req.body.settings.darkMode } };
        
        console.log('Attempting update with filter:', filter);
        console.log('Update operation:', update);

        const user = await User.updateOne(filter, update, { new: true });
        console.log('Update result:', user);

        return res.status(200).send({ 
            message: `User settings updated successfully`,
            darkMode: req.body.settings.darkMode
        });
    } catch (err) {
        console.error('Error in settings update:', err);
        return res.status(501).send("Internal error: " + err);
    }
});

// PUT: update user with given id
userRoute.put("/users/:userId", isOwnerOrAdmin, validateRequest(User.schema), async (req, res) => {
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
userRoute.delete("/users/:userId", isOwnerOrAdmin, async (req, res) => {
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

// GET: get all users from database - Admin only
userRoute.get("/users", isAdmin, async (req, res) => {
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
=======
import express from 'express';
import User from '../../database-schema/core/User.js';
import validateRequest from '../../utils/validation/validateRequest.js';
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from '../../middleware/auth.js';

const userRoute = express.Router();

// GET: Retrieve a specific user with given Id
userRoute.get("/users/:userId", isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    console.log('in /users/:userId Route (GET) user with ID:' + JSON.stringify(userId));
    try {
        //const user = await User.findById(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send(`Cannot find user in db with user ID is: ${userId}`);
        }
        return res.status(200).send(user);
    } catch (err) {
        return res.status(501).send("Internal error: " + err);
    }
});

// Update user settings
userRoute.put("/users/:userId/settings", isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    console.log('in /users/:userId/settings Route (PUT) user with ID:', userId);
    console.log('Request body:', req.body);
    
    try {
        // First verify the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            console.log('User not found in database');
            return res.status(404).send(`Cannot find user with user ID : ${userId} in database`);
        }

        const filter = { "_id": userId };
        const update = { $set: { 'settings.darkMode': req.body.settings.darkMode } };
        
        console.log('Attempting update with filter:', filter);
        console.log('Update operation:', update);

        const user = await User.updateOne(filter, update, { new: true });
        console.log('Update result:', user);

        return res.status(200).send({ 
            message: `User settings updated successfully`,
            darkMode: req.body.settings.darkMode
        });
    } catch (err) {
        console.error('Error in settings update:', err);
        return res.status(501).send("Internal error: " + err);
    }
});

// PUT: update user with given id
userRoute.put("/users/:userId", isOwnerOrAdmin, validateRequest(User.schema), async (req, res) => {
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

        if (req.body.bank_accounts) {
            console.log('Adding bank account:', req.body.bank_accounts);
            const user = await User.findById(userId);
            const hashedBankAccount = Buffer.from(req.body.bank_accounts).toString('base64');
            if (user.bank_accounts){
                const userBanksAccounts = user.bank_accounts;
                updatedUser.bank_accounts = userBanksAccounts.concat(hashedBankAccount);
            }
            else {
                updatedUser.bank_accounts = [hashedBankAccount];
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
userRoute.delete("/users/:userId", isOwnerOrAdmin, async (req, res) => {
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

// GET: get all users from database - Admin only
userRoute.get("/users", isAdmin, async (req, res) => {
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
    console.log("Received registration request:", req.body);
    
    // Validate required fields
    if (!req.body.accountData?.username) {
        return res.status(400).send("Username is required");
    }
    if (!req.body.accountData?.password) {
        return res.status(400).send("Password is required");
    }
    if (!req.body.accountData?.username.includes('@')) {
        return res.status(400).send("Invalid email format");
    }

    try {
        console.log("Processing new user registration");
        
        // Check if user already exists by email
        const existingUser = await User.findOne({ email: req.body.accountData.username });
        if (existingUser) {
            return res.status(400).send("Email already registered");
        }

        // Prepare user data
        const newUserData = {
            email: req.body.accountData.username, // Store email in top-level field
            accountData: {
                username: req.body.accountData.username,
                password: req.body.accountData.password,
                priviledge: "user"
            }
        };

        // Add identity data if provided
        if (req.body.identityData) {
            newUserData.identityData = req.body.identityData;
        }

        // Create and save new user
        const newUser = await new User(newUserData).save();
        
        // Remove sensitive data before sending response
        const userResponse = newUser.toObject();
        delete userResponse.accountData.password;
        
        return res.status(200).json(userResponse);
    } catch (err) {
        console.error("Registration error:", err);
        if (err.code === 11000) {
            return res.status(400).send("Email already registered");
        }
        return res.status(500).send("An error occurred during registration");
    }
});

export default userRoute;
>>>>>>> Stashed changes:backend/Endpoints/auth/userRoute.js
