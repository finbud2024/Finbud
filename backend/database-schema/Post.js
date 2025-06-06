import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reactions: {
    likes: { type: Number, default: 0 },
    likedUsers: { type: [mongoose.Schema.Types.ObjectId], default: [] }  
  }
});

const PostSchema = new mongoose.Schema({
  forumId: { type: mongoose.Schema.Types.ObjectId, ref: "Forum", required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  comments: [CommentSchema], 
  reactions: {
    likes: { type: Number, default: 0 },
    likedUsers: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);
export default Post;