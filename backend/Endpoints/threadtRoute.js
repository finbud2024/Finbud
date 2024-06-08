import express from 'express';
import {Thread} from '../Database Schema/Thread.js';

const threadRoute = express.Router();

//save user prompt and finBot response to database
threadRoute.post('/saveChat', async(req, res) => {
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


//CRUD operation to route "/thread/:threadId"
threadRoute.route('/thread/:threadId')
	.get(async(req,res)=>{
		const threadId = req.params.threadId
		console.log('in /thread Route (GET) thread with ID:' + JSON.stringify(threadId));
		try{
			let thread = await Thread.findOne({"_id": threadId});
			if(!thread){
				return res.status(404).send("No thread with id: " + JSON.stringify(threadId) + "existed in database");
			}
			return res.status(200).json(thread);
		}catch(err){
			return res.status(404).send("Unexpected error occured when looking user thread with id: "+ threadId + "in database: "+ err);
		}
	})
  	.post()
  	.put()
  	.delete()

//getting thread based on threadId
threadRoute.get('/thread/:threadID', async(req,res)=>{
    //TO-DO 
})

//getting the all chats from the same user
threadRoute.get('/thread/:threadID', async(req,res)=>{
    //TO-DO
})

//deleting all chats from the same thread

export default threadRoute;