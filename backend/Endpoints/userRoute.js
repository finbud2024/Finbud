import express from 'express';
import User from '../Database Schema/User.js';

const userRoute = express.Router();

userRoute.route('/users/:userId')
    //GET: Retrieve a specific user with given Id
    .get(async(req,res)=>{
        const userId = req.params.userId;
        console.log('in /users/:userId Route (GET) user with ID:' + JSON.stringify(userId));
        try{
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).send(`Cannot find user in db with user ID is: ${userId}`);
            }
            return res.status(200).send(user);
        }catch(err){
            return res.status(501).send("Internal error e" + err);
        }
    })
    //PUT: update user with given id
    .put(async(req, res) => {
        const userId = req.params.userId;
        console.log('in /users/:userId Route (PUT) user with ID:' + userId);
        try{
            const user = await User.findById(userId)
            if(!user){
                return res.status(404).send(`Cannot find user with user ID : ${userId} in database`);
            }

            const {accountData, identityData} = req.body;
            const {username, password, priviledge, securityQuestion, securityAnswer} = accountData;
            const {firstName, lastName, displayName} = identityData;

            //accountData update
            if(username){ user.accountData.username = username; }
            if(password){ user.accountData.password = password; }
            if(priviledge === "admin" || priviledge === "user"){
                user.accountData.priviledge = priviledge;
            } // NEED DISCUSSION
            if(securityQuestion) { user.accountData.securityQuestion = securityQuestion; }
            if(securityAnswer) { user.accountData.securityAnswer = securityAnswer; }

            //identityData update
            if(firstName) { user.identityData.firstName = firstName; }
            if(lastName) { user.identityData.lastName = lastName; }
            if(displayName) { user.identityData.displayName = displayName; } 
            
            await user.save();

            return res.status(200).send({message: `User updated successfully`, updatedUser: user});
        }catch(err){
            return res.status(501).send("Internal error e" + err);
        }
    })
    //DELETE: delete a user with given id
    .delete(async(req, res) => {
        const userId = req.params.userId;
		console.log('In /users/:userid Route (DELETE) for thread with ID: ' + userId);
        try{
            const user = await User.findOneAndDelete({_id: userId});
            if(!user){
                return res.status(404).send(`Cannot find user in db with user ID is: ${userId}`);
            }
            return res.status(200).send('User deleted successfully');
        }catch(err){
            return res.status(500).send("Internal sever error"+ err);
        }
    })

userRoute.route('/users')
    //GET: get all user from database 
    .get(async(req, res) => {
        console.log("in /users route (GET) all user")
        try{
            const users = await User.find();
            return res.status(200).json(users);
        }catch(err){
            return res.status(501).send('Internal sever error', err);
        }
    })
    //POST: saving a new user into database
    .post(async(req,res)=>{
        if(!req.body.accountData.username){
            return res.status(404).send("Unable to save new user to database due to missing username");
        }
        if(!req.body.accountData.password){
            return res.status(404).send("Unable to save new user to database due to missing password");
        }
        try{
            console.log("in /users route (POST) new user to database")
            let user = await User.findOne({"accountData.username": req.body.accountData.username});
            if(user){//checking for user availability ---- user existed
                return res.status(400).send("Username: "+ req.body.accountData.username + " already existed in databsae");
            }
            //user has not been used. Good to add
            let newUser = await new User({
                accountData:{
                    username: req.body.accountData.username,
                    password: req.body.accountData.password,
                    priviledge: req.body.accountData.priviledge,
                    securityQuestion: req.body.accountData.securityQuestion,
                    securityAnswer: req.body.accountData.securityAnswer
                },
                identityData:{
                    firstName: req.body.identityData.firstName,
                    lastName: req.body.identityData.lastName,
                    displayName:req.body.identityData.displayName,
                }
            }).save();
            return res.status(200).json(newUser);
        }catch(err){
            return res.status(500).send("Unexpected error occured when saving user to database: "+ err);
        }
    })

export default userRoute;
