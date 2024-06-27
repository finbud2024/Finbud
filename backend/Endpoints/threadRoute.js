import express from 'express';
import Thread from '../Database Schema/Thread.js';

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
			return res.status(501).send("Unexpected error occured when looking for thread with id: "+ threadId + "in database: "+ err);
		}
	})

	//PUT thread: update a Thread with a given ID --- NEED DISCUSSION
	.put(async (req, res) => {
		return res.status(200).send("This operation is not supported yet");
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
			return res.status(501).send("Unexpected error occurred while deleting thread with ID: " + threadId + " from the database: " + err);
		}
	});

threadRoute.route('/threads')
	//GET: finding all Threads in database
	.get(async(req,res)=>{
		const {userid} = req.query;
		try{
			console.log("in /theads route (GET) ALL threads from database");
			let threads = await Thread.find();
			return res.status(200).json(threads);
		}catch(err){
			return res.status(501).send("Unexpected error occured when getting thread in database: "+ err);
		}
	})

	//POST: saving a new thread into database
	.post(async(req,res)=>{
		console.log('in /threads Route (POST) new thread to database')
		if(!req.body.userId){
			return res.status(501).send("Unable to save thread to database due to missing userId");
		}
		try{
			const threadBody = {
				userId: req.body.userId
			};

			if(req.body.title){
				threadBody.title = req.body.title;
			}
			const thread = new Thread(threadBody);
			await thread.save();
			return res.status(200).json(thread);
		}catch(err){
			return res.status(501).send("Unexpected error occured when saving thread to database: "+ err);
		}
	})

	//DELETE: delete all threads
	.delete(async(req,res)=>{
		console.log('In /threads Route (DELETE) for all threads');
		try{
			let threads = await Thread.deleteMany();
			if(!threads){
				return res.status(404).send("No threads existed in database");
			}
			return res.status(200).send("All threads deleted successfully");
		}catch(err){
			return res.status(501).send("Unexpected error occured when deleting all threads from database: "+ err);
		}
	});

threadRoute.route('/threads/u/:userId')
	//GET: get all threads with given userId
	.get(async(req, res) => {
		const userId = req.params.userId;
		console.log('in /threads/u/:userId Route (GET) thread with userId:' + JSON.stringify(userId));
		try{
			let threads = await Thread.find({"userId": userId});
			if(!threads){
				return res.status(404).send("No thread with userId: " + JSON.stringify(userId) + "existed in database");
			}
			return res.status(200).json(threads);
		}catch(err){
			return res.status(501).send("Unexpected error occured when looking for thread with userId: "+ userId + "in database: "+ err);
		}
	})

	//DELETE: delete all threads with given userId
	.delete(async(req,res) => {
		const userId = req.params.userId;
		if(!userId){
			return res.status(404).send("Unable to delete thread with userId: "+ userId + "due to missing userId");
		}
		console.log('In /threads/u/:userId Route (DELETE) for thread with userId: ' + userId);
		try{
			let threads = await Thread.deleteMany({"userId": userId});
			if(!threads){
				return res.status(404).send("No thread with userId: " + JSON.stringify(userId) + "existed in database");
			}
			return res.status(200).send("All threads with userId: "+ userId + " deleted successfully");
		}catch(err){
			return res.status(501).send("Unexpected error occured when deleting thread with userId: "+ userId + "in database: "+ err);
		}
	});


export default threadRoute;