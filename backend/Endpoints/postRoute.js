import express from "express";
import Post from "../Database Schema/Post.js";
import Forum from "../Database Schema/Forum.js";

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("forumId").populate("authorId");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

postRouter.get("/forum/:forumSlug(*)", async (req, res) => {
    try {
      const forumSlug = decodeURIComponent(req.params.forumSlug); 
      console.log(`🔍 Searching forum with slug: ${forumSlug}`);
  
      const forum = await Forum.findOne({ slug: forumSlug });
  
      if (!forum) {
        console.log(`❌ Forum "${forumSlug}" NOT FOUND`);
        return res.status(404).json({ error: "Forum not found" });
      }
  
      console.log(`✅ Found forum:`, forum);
  
      const posts = await Post.find({ forumId: forum._id })
        .populate("forumId")
        .populate("authorId");
  
      console.log(`✅ Found ${posts.length} posts for forum: ${forumSlug}`);
  
      res.json(posts);
    } catch (err) {
      console.error(`❌ Error fetching posts:`, err.message);
      res.status(500).json({ error: err.message });
    }
});
  

export default postRouter;
