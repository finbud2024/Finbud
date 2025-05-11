import express from "express";
import User from "../../Database Schema/User.js";
import mongoose from "mongoose";
import FinCoinTransaction from "../../Database Schema/FinCoinTransaction.js";
import { isAuthenticated } from "../../middleware/auth.js";

const finCoinRouter = express.Router();

// Get user's current FinCoin balance
finCoinRouter.get("/balance", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fincoin_balance");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ balance: user.fincoin_balance });
  } catch (error) {
    console.error("Error fetching FinCoin balance:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add FinCoins to user's balance
finCoinRouter.post("/earn", isAuthenticated, async (req, res) => {
  const { amount, source, source_id, description } = req.body;

  if (!amount || !source) {
    return res.status(400).json({ message: "Amount and source are required" });
  }

  try {
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create transaction record
      const transaction = new FinCoinTransaction({
        user_id: req.user.id,
        amount,
        transaction_type: "earn",
        source,
        source_id: source_id || null,
        description: description || "",
      });

      await transaction.save({ session });

      // Update user's balance
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { fincoin_balance: amount } },
        { new: true, session }
      ).select("fincoin_balance");

      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "User not found" });
      }

      await session.commitTransaction();
      session.endSession();

      return res.json({
        transaction: transaction,
        new_balance: user.fincoin_balance,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error adding FinCoins:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Spend FinCoins from user's balance
finCoinRouter.post("/spend", isAuthenticated, async (req, res) => {
  const { amount, source, source_id, description } = req.body;

  if (!amount || !source) {
    return res.status(400).json({ message: "Amount and source are required" });
  }

  try {
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if user has enough balance
      const user = await User.findById(req.user.id).select("fincoin_balance");

      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "User not found" });
      }

      if (user.fincoin_balance < amount) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "Insufficient FinCoin balance" });
      }

      // Create transaction record
      const transaction = new FinCoinTransaction({
        user_id: req.user.id,
        amount,
        transaction_type: "spend",
        source,
        source_id: source_id || null,
        description: description || "",
      });

      await transaction.save({ session });

      // Update user's balance
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { fincoin_balance: -amount } },
        { new: true, session }
      ).select("fincoin_balance");

      await session.commitTransaction();
      session.endSession();

      return res.json({
        transaction: transaction,
        new_balance: updatedUser.fincoin_balance,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error spending FinCoins:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get user's transaction history
finCoinRouter.get("/transactions", isAuthenticated, async (req, res) => {
  try {
    const transactions = await FinCoinTransaction.find({
      user_id: req.user.id,
    }).sort({ timestamp: -1 });

    return res.json(transactions);
  } catch (error) {
    console.error("Error fetching FinCoin transactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get FinCoin leaderboard
finCoinRouter.get("/leaderboard", async (req, res) => {
  try {
    const timeFrame = req.query.timeFrame || "all-time";
    const userId = req.user ? req.user.id : null; // Get current user if authenticated
    let dateFilter = {};

    // Set date filter based on timeFrame
    if (timeFrame === "daily") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { timestamp: { $gte: today } };
    } else if (timeFrame === "weekly") {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      dateFilter = { timestamp: { $gte: weekStart } };
    }

    let leaderboard;
    let currentUserRank = null;

    // For all-time, simply get top users by balance
    if (timeFrame === "all-time") {
      leaderboard = await User.find()
        .select(
          "_id identityData.displayName identityData.profilePicture fincoin_balance"
        )
        .sort({ fincoin_balance: -1 })
        .limit(10);

      // Map the response to the format expected by frontend
      leaderboard = leaderboard.map((user) => ({
        _id: user._id,
        displayName:
          user.identityData.displayName ||
          `User ${user._id.toString().slice(-4)}`,
        profilePicture: user.identityData.profilePicture || null,
        fincoin_balance: user.fincoin_balance || 0,
        // Add these fields with default values since we don't track them yet
        quizzesCompleted: 0,
        tradesExecuted: 0,
      }));

      // If user is authenticated and not in top 10, get their rank
      if (userId) {
        const userInTop10 = leaderboard.some(
          (user) => user._id.toString() === userId.toString()
        );

        if (!userInTop10) {
          const user = await User.findById(userId).select(
            "identityData.displayName identityData.profilePicture fincoin_balance"
          );

          if (user) {
            // Count users with higher balance
            const higherRanked = await User.countDocuments({
              fincoin_balance: { $gt: user.fincoin_balance },
            });

            currentUserRank = {
              rank: higherRanked + 1,
              _id: user._id,
              displayName:
                user.identityData.displayName ||
                `User ${user._id.toString().slice(-4)}`,
              profilePicture: user.identityData.profilePicture || null,
              fincoin_balance: user.fincoin_balance || 0,
              quizzesCompleted: 0,
              tradesExecuted: 0,
            };
          }
        }
      }
    } else {
      // For daily/weekly, aggregate transactions
      leaderboard = await FinCoinTransaction.aggregate([
        { $match: { ...dateFilter, transaction_type: "earn" } },
        {
          $group: {
            _id: "$user_id",
            total_earned: { $sum: "$amount" },
            transaction_count: { $sum: 1 },
          },
        },
        { $sort: { total_earned: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user_info",
          },
        },
        { $unwind: "$user_info" },
        {
          $project: {
            _id: 1,
            displayName: "$user_info.identityData.displayName",
            profilePicture: "$user_info.identityData.profilePicture",
            total_earned: 1,
            transaction_count: 1,
          },
        },
      ]);

      // Map the response to match expected format
      leaderboard = leaderboard.map((entry) => ({
        _id: entry._id,
        displayName:
          entry.displayName || `User ${entry._id.toString().slice(-4)}`,
        profilePicture: entry.profilePicture || null,
        fincoin_balance: entry.total_earned || 0,
        quizzesCompleted: 0,
        tradesExecuted: 0,
      }));

      // If user is authenticated, get their rank for this time period
      if (userId) {
        const userInTop10 = leaderboard.some(
          (entry) => entry._id.toString() === userId.toString()
        );

        if (!userInTop10) {
          // Get user's transactions for this time period
          const userTransactions = await FinCoinTransaction.aggregate([
            {
              $match: {
                ...dateFilter,
                transaction_type: "earn",
                user_id: mongoose.Types.ObjectId(userId),
              },
            },
            {
              $group: {
                _id: "$user_id",
                total_earned: { $sum: "$amount" },
                transaction_count: { $sum: 1 },
              },
            },
          ]);

          if (userTransactions.length > 0) {
            const userTotal = userTransactions[0].total_earned;

            // Count users with higher earnings in this period
            const higherRanked = await FinCoinTransaction.aggregate([
              { $match: { ...dateFilter, transaction_type: "earn" } },
              {
                $group: {
                  _id: "$user_id",
                  total: { $sum: "$amount" },
                },
              },
              { $match: { total: { $gt: userTotal } } },
              { $count: "count" },
            ]);

            const user = await User.findById(userId).select(
              "identityData.displayName identityData.profilePicture"
            );

            currentUserRank = {
              rank: higherRanked.length > 0 ? higherRanked[0].count + 1 : 1,
              _id: userId,
              displayName:
                user.identityData.displayName ||
                `User ${userId.toString().slice(-4)}`,
              profilePicture: user.identityData.profilePicture || null,
              fincoin_balance: userTotal,
              quizzesCompleted: 0,
              tradesExecuted: 0,
            };
          }
        }
      }
    }

    return res.json({
      topUsers: leaderboard,
      currentUserRank,
    });
  } catch (error) {
    console.error("Error fetching FinCoin leaderboard:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default finCoinRouter;
