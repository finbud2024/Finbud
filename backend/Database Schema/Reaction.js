// const mongoose = require("mongoose");
import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["like", "upvote"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  targetType: { type: String, enum: ["Post", "Comment"], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Reaction", ReactionSchema);
