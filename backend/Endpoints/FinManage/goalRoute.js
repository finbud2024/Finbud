import express from 'express';
import Goal from '../../Database Schema/Goal.js';
import validateRequest from '../../utils/validateRequest.js';
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from '../../middleware/auth.js';

const goalRoute = express.Router();

// CRUD operations on /goals/:goalId
goalRoute.route('/goals/:goalId')
  // GET a goal by ID
  .get(isAuthenticated, async (req, res) => {
    const goalId = req.params.goalId;
    console.log('in /goals/:goalId Route (GET) goal with ID: ' + goalId);
    try {
      let goal = await Goal.findById(goalId).populate('userId', 'accountData.username identityData.displayName');
      if (!goal) {
        return res.status(404).send(`No goal with ID: ${goalId} exists in the database.`);
      }
      
      // Check if the user is authorized to access this goal
      if (req.user.accountData.priviledge !== 'admin' && goal.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).send('Forbidden: You can only access your own goals');
      }
      
      return res.status(200).json(goal);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when looking for goal with ID: ${goalId} in database: ${err}`);
    }
  })

  // PUT: update a goal with a given ID
  .put(isAuthenticated, validateRequest(Goal.schema), async (req, res) => {
    const { userId, title, description, targetAmount, currentAmount, startDate, endDate, isAchieved, category } = req.body;
    const goalId = req.params.goalId;

    if (!userId || !title || targetAmount === undefined || startDate === undefined || endDate === undefined || !category) {
      return res.status(400).send("User ID, title, targetAmount, startDate, endDate, and category are required");
    }
    
    // Check if the user is authorized to update this goal
    if (req.user.accountData.priviledge !== 'admin' && userId !== req.user._id.toString()) {
      return res.status(403).send('Forbidden: You can only update your own goals');
    }

    console.log('in /goals/:goalId Route (PUT) goal with ID: ' + goalId);

    try {
      const updatedGoal = await Goal.findByIdAndUpdate(
        goalId,
        { userId, title, description, targetAmount, currentAmount, startDate, endDate, isAchieved, category },
        { new: true }
      );

      if (!updatedGoal) {
        return res.status(404).send(`Cannot find goal with ID: ${goalId}`);
      }

      console.log("Goal updated: ", updatedGoal);
      return res.status(200).json({ message: 'Goal updated successfully', updatedGoal });
    } catch (error) {
      return res.status(501).send(`Unexpected error occurred when updating goal with ID: ${goalId} in database: ${error}`);
    }
  })

  // DELETE a goal by ID
  .delete(isAuthenticated, async (req, res) => {
    const goalId = req.params.goalId;
    console.log('In /goals/:goalId Route (DELETE) goal with ID: ' + goalId);

    try {
      // First find the goal to check ownership
      const goal = await Goal.findById(goalId);
      if (!goal) {
        return res.status(404).send(`No goal with ID: ${goalId} exists in the database.`);
      }
      
      // Check if the user is authorized to delete this goal
      if (req.user.accountData.priviledge !== 'admin' && goal.userId.toString() !== req.user._id.toString()) {
        return res.status(403).send('Forbidden: You can only delete your own goals');
      }
      
      // Now delete the goal
      await Goal.findByIdAndDelete(goalId);
      console.log('Goal deleted: ', goal);
      return res.status(204).send('Goal deleted successfully');
    } catch (error) {
      return res.status(501).send(`Unexpected error occurred when deleting goal with ID: ${goalId} in database: ${error}`);
    }
  });

// CRUD operations on /goals, all goals in database
goalRoute.route('/goals')
  // GET all goals - Admin only
  .get(isAdmin, async (req, res) => {
    console.log("in /goals route (GET) all goals");
    try {
      const goals = await Goal.find().populate('userId', 'accountData.username identityData.displayName');
      return res.status(200).json(goals);
    } catch (error) {
      return res.status(500).send("Internal server error: " + error);
    }
  })

  // POST a new goal
  .post(isAuthenticated, validateRequest(Goal.schema), async (req, res) => {
    console.log('in /goals Route (POST) new goal to database');
    const { userId, title, description, targetAmount, currentAmount, startDate, endDate, isAchieved, category } = req.body;
    console.log(req.body);

    if (!userId || !title || targetAmount === undefined || startDate === undefined || endDate === undefined || !category) {
      return res.status(400).send("User ID, title, targetAmount, startDate, endDate, and category are required");
    }
    
    // Check if the user is authorized to create a goal for this userId
    if (req.user.accountData.priviledge !== 'admin' && userId !== req.user._id.toString()) {
      return res.status(403).send('Forbidden: You can only create goals for yourself');
    }

    const goal = new Goal({
      userId,
      title,
      description,
      targetAmount,
      currentAmount,
      startDate,
      endDate,
      isAchieved,
      category
    });

    try {
      const savedGoal = await goal.save();
      console.log("Goal saved: ", savedGoal);
      return res.status(201).json(savedGoal);
    } catch (error) {
      return res.status(500).send("Unexpected error occurred when saving goal to database: " + error);
    }
  });
// CRUD operations on /goals/u/:userId, all goals for a specific user
goalRoute.route('/goals/u/:userId')
  // GET all goals for a specific userId
  .get(isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    console.log('in /goals/u/:userId Route (GET) goals with userId:' + userId);
    try {
      let goals = await Goal.find({ userId });
      // if (!goals.length) {
      //   return res.status(404).send(`No goals with userId: ${userId} existed in database`);
      // }
      return res.status(200).json(goals);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when looking for goals with userId: ${userId} in database: ${err}`);
    }
  })

  // DELETE all goals for a specific userId
  .delete(isOwnerOrAdmin, async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).send("Missing userId in request parameters");
    }
    console.log('In /goals/u/:userId Route (DELETE) for goals with userId: ' + userId);
    try {
      let goals = await Goal.deleteMany({ userId });
      if (!goals.deletedCount) {
        return res.status(404).send(`No goals with userId: ${userId} existed in database`);
      }
      return res.status(200).send(`All goals with userId: ${userId} deleted successfully`);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when deleting goals with userId: ${userId} from database: ${err}`);
    }
  });

export default goalRoute;