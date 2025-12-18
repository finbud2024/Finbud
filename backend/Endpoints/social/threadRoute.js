import express from 'express';
import Thread from '../../Database_Schema/social/Thread.js';
import validateRequest from '../../utils/validation/validateRequest.js';
import { isAuthenticated, isAdmin, isOwnerOrAdmin, softAuth } from '../../middleware/auth.js';

const threadRoute = express.Router();

// CRUD operation to route "/threads/:threadId"
threadRoute.route('/threads/:threadId')
  // GET thread request with a given thread ID
  .get(isAuthenticated, async (req, res) => {
    const threadId = req.params.threadId;
    console.log('in /threads/:threadId Route (GET) thread with ID:' + JSON.stringify(threadId));
    try {
      let thread = await Thread.findOne({ "_id": threadId });
      if (!thread) {
        return res.status(404).send("No thread with id: " + JSON.stringify(threadId) + "existed in database");
      }
      
      // Check if user is authorized to access this thread
      if (req.user.accountData.priviledge !== 'admin' && thread.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only access your own threads' });
      }
      
      return res.status(200).json(thread);
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when looking for thread with id: " + threadId + " in database: " + err);
    }
  })

  // PUT thread: update a Thread with a given ID
  .put(isAuthenticated, validateRequest(Thread.schema), async (req, res) => {
    const threadId = req.params.threadId;
    console.log('In /threads Route (PUT) for thread with ID: ' + threadId);
    if (req.body.userId) {
      return res.status(501).send("Cannot update User associate with Thread");
    }
    try {
      // First check if the thread belongs to the user
      const thread = await Thread.findOne({ "_id": threadId });
      if (!thread) {
        return res.status(404).send(`Cannot find thread with thread ID: ${threadId} in database`);
      }
      
      // Check if user is authorized to update this thread
      if (req.user.accountData.priviledge !== 'admin' && thread.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own threads' });
      }
      
      const filter = { "_id": threadId };
      const updatedThread = {};

      for (const key in req.body) {
        updatedThread[`${key}`] = req.body[key];
      }

      const result = await Thread.updateOne(filter, updatedThread, {
        new: true
      });

      return res.status(200).send({ message: `Thread updated successfully`, updatedThread: result });
    } catch (err) {
      return res.status(501).send("Error while updating thread" + err);
    }
  })

  // DELETE: removing a thread with a given id
  .delete(isAuthenticated, async (req, res) => {
    const threadId = req.params.threadId;
    console.log('In /threads Route (DELETE) for thread with ID: ' + threadId);
    try {
      // First check if the thread belongs to the user
      const thread = await Thread.findOne({ "_id": threadId });
      if (!thread) {
        return res.status(404).send("No thread with ID: " + threadId + " exists in the database.");
      }
      
      // Check if user is authorized to delete this thread
      if (req.user.accountData.priviledge !== 'admin' && thread.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own threads' });
      }
      
      await Thread.findOneAndDelete({ _id: threadId });
      return res.status(200).send("Deleted successfully thread with Id: " + threadId);
    } catch (err) {
      return res.status(501).send("Unexpected error occurred while deleting thread with ID: " + threadId + " from the database: " + err);
    }
  });

threadRoute.route('/threads')
  // GET: finding all Threads in database
  .get(isAdmin, async (req, res) => {
    const { userid } = req.query;
    try {
      console.log("in /threads route (GET) ALL threads from database");
      let threads = await Thread.find();
      return res.status(200).json(threads);
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when getting thread in database: " + err);
    }
  })

  // POST: saving a new thread into database
  .post(softAuth, validateRequest(Thread.schema), async (req, res) => {
    console.log('in /threads Route (POST) new thread to database');
    
    // For authenticated users, ensure they can only create threads for themselves unless they're an admin
    if (req.user && req.user.accountData && req.user.accountData.priviledge !== 'admin' && req.body.userId && req.body.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only create threads for yourself' });
    }
    
    try {
      const threadBody = {};

      // If the user is authenticated, use their ID
      if (req.user) {
        threadBody.userId = req.body.userId || req.user._id;
      } else if (req.body.anonymousToken) {
        // For unauthenticated users, use the anonymous token
        threadBody.userId = null;
      }

      if (req.body.title) {
        threadBody.title = req.body.title;
      }
      
      const thread = new Thread(threadBody);
      await thread.save();
      return res.status(200).json(thread);
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when saving thread to database: " + err);
    }
  })

  // DELETE: delete all threads
  .delete(isAdmin, async (req, res) => {
    console.log('In /threads Route (DELETE) for all threads');
    try {
      let threads = await Thread.deleteMany();
      if (!threads) {
        return res.status(404).send("No threads existed in database");
      }
      return res.status(200).send("All threads deleted successfully");
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when deleting all threads from database: " + err);
    }
  });

threadRoute.route('/threads/u/:userId')
  // GET: get all threads with given userId
  .get(isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    console.log('in /threads/u/:userId Route (GET) thread with userId:' + JSON.stringify(userId));
    try {
      let threads = await Thread.find({ "userId": userId });
      if (!threads) {
        return res.status(404).send("No thread with userId: " + JSON.stringify(userId) + "existed in database");
      }
      return res.status(200).json(threads);
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when looking for thread with userId: " + userId + " in database: " + err);
    }
  })

  // DELETE: delete all threads with given userId
  .delete(isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(404).send("Unable to delete thread with userId: " + userId + " due to missing userId");
    }
    console.log('In /threads/u/:userId Route (DELETE) for thread with userId: ' + userId);
    try {
      let threads = await Thread.deleteMany({ "userId": userId });
      if (!threads) {
        return res.status(404).send("No thread with userId: " + JSON.stringify(userId) + " existed in database");
      }
      return res.status(200).send("All threads with userId: " + userId + " deleted successfully");
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when deleting thread with userId: " + userId + " in database: " + err);
    }
  });

export default threadRoute;
