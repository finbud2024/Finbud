import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  forumId: { type: mongoose.Schema.Types.ObjectId, ref: "Forum", required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  title: { type: String, required: true },
  body: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], 
  reactions: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", PostSchema);
