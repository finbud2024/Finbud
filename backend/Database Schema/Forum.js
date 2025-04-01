import mongoose from "mongoose";

const ForumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  logo: { type: String, default: "Globe" }, 
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
});

const Forum = mongoose.model('Forum', ForumSchema);
export default Forum;
  