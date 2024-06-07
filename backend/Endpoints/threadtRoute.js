import express from 'express';
import {Thread} from '../Database Schema/Thread.js';

const chatRoute = express.Router();

//save user prompt and finBot response to database
chatRoute.post('/saveChat', async(req, res) => {
    // console.log(req.body)
    try{
      let newChat = await new Thread({
        prompt: req.body.prompt,
        response: req.body.response,
        createdDate: new Date()
      }).save();
      console.log(newChat)
      return res.status(200).send("Successfully save chat");
    }catch(err){
      return res.status(400)
                .send("Unexpected error occurred when adding user to database. " + err);
    } 
  }
);  

//getting thread based on threadId
chatRoute.get('/thread/:threadID', async(req,res)=>{
    //TO-DO 
})

//getting the all chats from the same user
chatRoute.get('/thread/:threadID', async(req,res)=>{
    //TO-DO
})

//deleting all chats from the same thread
chatRoute.get('/thread/normAns')

export default chatRoute;