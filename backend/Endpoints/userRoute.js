import express from 'express';
import {User} from '../Database Schema/User.js';

const userRoute = express.Router();

userRoute.get('/users/:userId', async(req, res) => {
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
});


// get(/users/:userid)----> get from db --- sucess return response ---- faill thi xu ly ntn
// get(/users) -----> get all user from db
// put(/users/:userid) ----> update info
// put(/users) ----> tao user moi ma username exist thi xu ly ntn
// delete(/users/:userid) ---> xoa user given user if
// get(/users) ----> get user with given filter
