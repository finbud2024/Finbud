import express from "express";
import ChatSimulator from "../../../Database_Schema/trading/ChatStockSimulator.js";
import { isAuthenticated } from "../../../middleware/auth.js";
const chatStockRoute = express.Router();

chatStockRoute.post("/update-response", isAuthenticated, async (req, res) => {
  const { userId, newMessage } = req.body;

  // Ensure user can only update their own responses
  if (req.user?._id?.toString() !== userId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only update your own responses" });
  }

  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const updateResponse = await ChatSimulator.findOneAndUpdate(
      { userId, createdAt: { $gte: start, $lte: end } },
      { response: newMessage },
      { upsert: true, new: true }
    );
    return res.status(200).json({ updateResponse });
  } catch (error) {
    return res.status(500).json({ message: "Error updating", error });
  }
});

chatStockRoute.get(
  "/all-responses/:userId",
  isAuthenticated,
  async (req, res) => {
    const { userId } = req.params;

    // Ensure user can only access their own responses
    if (req.user?._id?.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only access your own responses" });
    }

    try {
      const recentResponse = await ChatSimulator.find({ userId });
      if (!recentResponse) {
        return res.status(404).json({ message: "No response found" });
      }
      return res.json(recentResponse);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error getting the most recent", error });
    }
  }
);
export default chatStockRoute;
