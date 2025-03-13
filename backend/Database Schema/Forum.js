import mongoose from "mongoose";

const ForumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }] 
});

export default mongoose.model("Forum", ForumSchema);
  