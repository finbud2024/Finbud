import express, { request } from 'express';
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
            const filter = {"_id": userId};
            const updatedUser = {};
            
            if(req.body.accountData){
                for(const key in req.body.accountData){
                    updatedUser[`accountData.${key}`] = req.body.accountData[key];
                }
            }

            if(req.body.identityData){
                for(const key in req.body.identityData){
                    updatedUser[`identityData.${key}`] = req.body.identityData[key];
                }
            }

            const user = await User.updateOne(filter, updatedUser, {
                new: true
            }) 

            if(!user.modifiedCount){
                return res.status(404).send(`Cannot find user with user ID : ${userId} in database`);
            }

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
    //GET: get all user from database if not specified query
    .get(async(req, res) => {
        const data = req.query;
        const {username, password} = data;
        console.log("in /users route (GET) all user if not specified query")
        try{
            //without query
            if(!data){
                const users = await User.find();
                return res.status(200).json(users);
            }

            //with query
            if(!username){
                return res.status(404).send(`Please provide username!`);
            }
            if(!password){
                return res.status(404).send('Please provide password!');
            }

            const user = await User.findOne({"accountData.username": username});
 
            if(!user){
                return res.status(404).send('User does not exist in db, please sign in!');
            }

            if(user.accountData.password !== password){
                return res.status(401).send("Authorize error!");
            }
            return res.status(200).json(user);

        }catch(err){
            return res.status(501).send('Internal sever error', err);
        }
    })
    //POST: saving a new user into database
    .post(async(req,res)=>{
        console.log(req.body);
        if(!req.body.accountData.username){
            console.log(req.body);
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
            console.log(err);
            return res.status(500).send("Unexpected error occured when saving user to database: "+ err);
        }
    })
    //GET: get user with given username and password
    .get(async(req, res) => {
        const data = req.query;
        const {username, password} = data;
        console.log('in /users Route (GET) user with username and password:' + JSON.stringify(data));
        try{
            const user = await User.find({username: username, password: password});
            if(!user){
                return res.status(404).send('Wrong username or password, please..!');
            }

            return res.status(200).send("Login successful!");

        }catch(err){
            return res.status(501).send('Internal sever error' + err);
        }
    })

export default userRoute;
