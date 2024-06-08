import express from 'express';
import User from '../Database Schema/User.js';

const userRoute = express.Router();

userRoute.route('/users/:userId')
    //GET: Retrieve a specific user with given Id
    .get(async(req,res)=>{
        const userId = req.params.userId;
        console.log(`[User ID]: ${userId}`);
        
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
    //update user with given id
    .put()
    //delete a user with given id
    .delete()

userRoute.route('/users')
    //get all user from database if query is not specified
    .get()
    //POST: saving a new user into database
    .post(async(req,res)=>{
        if(!req.body.accountData.username){
            return res.status(404).send("Unable to save new user to database due to missing username");
        }
        if(!req.body.accountData.password){
            return res.status(404).send("Unable to save new user to database due to missing password");
        }
        try{
            console.log("in /user route (POST) new user to database")
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
