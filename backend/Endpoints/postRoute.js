import express from "express";
import Post from "../Database Schema/Post.js";
import Forum from "../Database Schema/Forum.js";

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "forumId",
        select: "name logo slug"
      })
      .populate({
        path: "authorId",
        select: "identityData.displayName identityData.profilePicture"
      });

    const formattedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
      reactions: post.reactions,
      forumId: {
        name: post.forumId.name || "Unknown Forum",
        logo: post.forumId.logo || null,
        slug: post.forumId.slug || ""
      },
      authorId: {
        displayName: post.authorId.identityData?.displayName || "Anonymous",
        profilePicture: post.authorId.identityData?.profilePicture || "/default-avatar.png"
      }
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: err.message });
  }
});

postRouter.get("/forum/:forumSlug(*)", async (req, res) => {
  try {
    const forumSlug = decodeURIComponent(req.params.forumSlug);
    console.log(`🔍 Searching forum with slug: ${forumSlug}`);

    const forum = await Forum.findOne({ slug: forumSlug });

    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    const posts = await Post.find({ forumId: forum._id })
      .populate({
        path: "forumId",
        select: "name logo slug"
      })
      .populate({
        path: "authorId",
        select: "identityData.displayName identityData.profilePicture"
      });

    const formattedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
      reactions: post.reactions,
      forumId: {
        name: post.forumId.name || "Unknown Forum",
        logo: post.forumId.logo || null,
        slug: post.forumId.slug || ""
      },
      authorId: {
        displayName: post.authorId.identityData?.displayName || "Anonymous",
        profilePicture: post.authorId.identityData?.profilePicture || "/default-avatar.png"
      }
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("❌ Error fetching forum posts:", err);
    res.status(500).json({ error: err.message });
  }
});

export default postRouter;
