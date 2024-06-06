import express from 'express';
import Chat from '../Database Schema/Chat.js';

const chatRoute = express.Router();

//save user prompt and finBot response to database
chatRoute.post('/saveChat', async(req, res) => {
    console.log(req.body)
    try{
      let newChat = await new Chat({
        threadID: req.body.threadID,
        userID: req.body.userID,
        prompt: req.body.prompt,
        response: req.body.response
      }).save();
      return res.status(200).send("Successfully save chat");
    }catch(err){
      return res.status(400)
          .send("Unexpected error occurred when adding user to database. " + err);
    } 
  }
);  

//getting the all chats in the same thread
chatRoute.get('/thread/:threadID', async()=>{
    //TO-DO 
})

//getting the all chats from the same user
chatRoute.get('/thread/:threadID', async()=>{
    //TO-DO
})

//deleting all chats from the same thread

export default chatRoute;