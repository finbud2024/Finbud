import express from 'express';
import {Thread} from '../Database Schema/Thread.js';

const threadRoute = express.Router();

//CRUD operation to route "/threads/:threadId"
threadRoute.route('/threads/:threadId')
	//GET thread request with a given thread ID
	.get(async(req,res)=>{
		const threadId = req.params.threadId
		console.log('in /threads/:threadId Route (GET) thread with ID:' + JSON.stringify(threadId));
		try{
			let thread = await Thread.findOne({"_id": threadId});
			if(!thread){
				return res.status(404).send("No thread with id: " + JSON.stringify(threadId) + "existed in database");
			}
			return res.status(200).json(thread);
		}catch(err){
			return res.status(404).send("Unexpected error occured when looking for thread with id: "+ threadId + "in database: "+ err);
		}
	})
	//PUT thread: update a Thread with a given ID --- NEED DISCUSSION
	.put(async (req, res) => {
		// const threadId = req.params.threadId;
		// console.log('In /threads Route (PUT) for thread with ID: ' + threadId);
		// const { prompt, response, createdDate, userId } = req.body;
	
		// try {
		// 	let thread = await Thread.findOneAndUpdate(
		// 		{ _id: threadId },
		// 		{ prompt, response, createdDate, userId },
		// 		{ new: true }
		// 	);
	
		// 	if (!thread) {
		// 		return res.status(404).send("No thread with ID: " + threadId + " exists in the database.");
		// 	}
	
		// 	return res.status(200).json({ message: "Thread updated successfully.", updatedThread: thread });
		// } catch (err) {
		// 	return res.status(500).send("Unexpected error occurred while updating thread with ID: " + threadId + " in the database: " + err);
		// }
	})
	//DELETE: removing a thread with a given id
	.delete(async (req, res) => {
		const threadId = req.params.threadId;
		console.log('In /threads Route (DELETE) for thread with ID: ' + threadId);
		try {
			let thread = await Thread.findOneAndDelete({ _id: threadId });
			if (!thread) {
				return res.status(404).send("No thread with ID: " + threadId + " exists in the database.");
			}
			return res.status(200).send("Deleted successfully thread with Id: " + threadId);
		} catch (err) {
			return res.status(500).send("Unexpected error occurred while deleting thread with ID: " + threadId + " from the database: " + err);
		}
	});


threadRoute.route('/threads')
	//GET: finding all Threads based on query. If not define, return all threads
	.get(async(req,res)=>{
		const {userid} = req.query;
		try{
			// Get all threads with specifies userId
			if(userid){//checking to see if the request contains userid
				console.log("in /theads route (GET) threads that belongto user with Id: " + userid);
				let threads = await Thread.find({"_id": userid});
				if(threads){
					return res.status(200).json(threads).send("Successfully return all threads from user with id: "+ userid);
				}else{
					return res.status(404).send("No thread from user with id: " + JSON.stringify(userid) + "is found in database");
				}
			}else{//get all threads regardless
				console.log("in /theads route (GET) ALL threads from database");
				let threads = await Thread.find();
				return res.status(200).json(threads);
			}
		}catch(err){
			return res.status(500).send("Unexpected error occured when getting thread in database: "+ err);
		}
	})
	//POST: saving a new thread into database
	.post(async(req,res)=>{
		console.log(console.log('in /threads Route (POST) new thread to database'))
		if(!req.body.userId){
			return res.status(500).send("Unable to save thread to database due to missing userId");
		}
		try{
			let thread = await new Thread({
				prompt: req.body.prompt,
				response: req.body.response,
				userId: req.body.userId,
				createdDate: new Date()
			}).save();
			return res.status(200).json(thread).send("Successfully save thread to DB. Thread Id: "+ thread._id);
		}catch(err){
			return res.status(500).send("Unexpected error occured when saving thread to database: "+ err);
		}
	})

export default threadRoute;