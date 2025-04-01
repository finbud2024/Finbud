import express from "express";
import mongoose from "mongoose";
import Post from "../Database Schema/Post.js";
import Forum from "../Database Schema/Forum.js";
import User from "../Database Schema/User.js";
import ScrapedUser from "../Database Schema/ScrapedUser.js";
import { isAuthenticated } from '../middleware/auth.js';

const postRouter = express.Router();

const getAuthorData = async (authorId) => {
  if (!mongoose.Types.ObjectId.isValid(authorId)) return null;

  let author = await User.findById(authorId).select("identityData.displayName identityData.profilePicture");
  if (author) return {
    displayName: author.identityData?.displayName || "Anonymous",
    profilePicture: author.identityData?.profilePicture || "/default-avatar.png"
  };

  author = await ScrapedUser.findById(authorId).select("username avatar");
  if (author) return {
    displayName: author.username || "Anonymous",
    profilePicture: author.avatar || "/default-avatar.png"
  };

  return { displayName: "Anonymous", profilePicture: "/default-avatar.png" };
};

// Get all posts in a forum
postRouter.get("/forum/:forumSlug(*)", isAuthenticated, async (req, res) => {
  try {
    const forumSlug = decodeURIComponent(req.params.forumSlug);
    const forum = await Forum.findOne({ slug: forumSlug });
    if (!forum) return res.status(404).json({ error: "Forum not found" });

    const posts = await Post.find({ forumId: forum._id })
      .sort({ createdAt: -1 })
      .populate("forumId", "name logo slug description")
      .populate({
        path: "authorId",
        select: "identityData.displayName identityData.profilePicture username avatar",
        options: { strictPopulate: false }
      });

    const formattedPosts = await Promise.all(posts.map(async (post) => {
      const author = await getAuthorData(post.authorId);
      return {
        _id: post._id,
        title: post.title,
        body: post.body,
        createdAt: post.createdAt,
        reactions: post.reactions,
        forumId: {
          name: post.forumId?.name || "Unknown Forum",
          logo: post.forumId?.logo || null,
          slug: post.forumId?.slug || ""
        },
        author
      };
    }));

    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific post
postRouter.get("/post/:postId", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: `Invalid Post ID format: ${postId}` });
    }

    const post = await Post.findById(postId).populate("forumId", "name logo slug description");
    if (!post) return res.status(404).json({ error: "Post not found" });

    const author = await getAuthorData(post.authorId);

    const formattedComments = await Promise.all(post.comments.map(async (comment) => {
      const commentAuthor = await getAuthorData(comment.authorId);
      return {
        _id: comment._id,
        body: comment.body,
        createdAt: comment.createdAt,
        reactions: comment.reactions || { likes: 0, likedUsers: [] },
        author: commentAuthor
      };
    }));

    res.json({
      _id: post._id,
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
      reactions: post.reactions || { likes: 0, comments: 0, shares: 0 },
      forumId: {
        name: post.forumId?.name || "Unknown Forum",
        logo: post.forumId?.logo || null,
        slug: post.forumId?.slug || "",
        description: post.forumId?.description || "No description available"
      },
      author,
      comments: formattedComments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like/unlike a post
postRouter.post("/post/:postId/like", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { action, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID format" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.reactions = post.reactions || { likes: 0, likedUsers: [] };
    if (!Array.isArray(post.reactions.likedUsers)) post.reactions.likedUsers = [];

    const userIndex = post.reactions.likedUsers.indexOf(userId);
    if (action === "like" && userIndex === -1) {
      post.reactions.likes += 1;
      post.reactions.likedUsers.push(userId);
    } else if (action === "unlike" && userIndex !== -1) {
      post.reactions.likes -= 1;
      post.reactions.likedUsers.splice(userIndex, 1);
    }

    await post.save();
    res.json({ success: true, likes: post.reactions.likes, likedUsers: post.reactions.likedUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like/unlike a comment
postRouter.post("/post/:postId/like-comment", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentId, action, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid Post ID or Comment ID format" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.reactions = comment.reactions || { likes: 0, likedUsers: [] };
    if (!Array.isArray(comment.reactions.likedUsers)) comment.reactions.likedUsers = [];

    const userIndex = comment.reactions.likedUsers.indexOf(userId);
    if (action === "like" && userIndex === -1) {
      comment.reactions.likes += 1;
      comment.reactions.likedUsers.push(userId);
    } else if (action === "unlike" && userIndex !== -1) {
      comment.reactions.likes -= 1;
      comment.reactions.likedUsers.splice(userIndex, 1);
    }

    await post.save();
    res.json({ success: true, likes: comment.reactions.likes, likedUsers: comment.reactions.likedUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment
postRouter.post("/post/:postId/add-comment", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { body, userId } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing user ID" });
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ error: `Invalid Post ID format: ${postId}` });
    if (!body.trim()) return res.status(400).json({ error: "Comment cannot be empty" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      authorId: userId,
      body,
      createdAt: new Date(),
      reactions: { likes: 0, likedUsers: [] },
    };

    post.comments.push(newComment);
    post.reactions.comments += 1;
    await post.save();

    const author = await getAuthorData(userId);

    res.json({
      message: "Comment added successfully",
      comment: {
        _id: newComment._id,
        body: newComment.body,
        createdAt: newComment.createdAt,
        likes: newComment.reactions.likes,
        author
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new thread
postRouter.post("/", isAuthenticated, async (req, res) => {
  try {
    const { forumId, title, body, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing user ID" });
    if (!forumId || !title.trim() || !body.trim()) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPost = new Post({
      forumId,
      authorId: userId,
      title,
      body,
      comments: [],
      reactions: { likes: 0, comments: 0, shares: 0 },
    });

    await newPost.save();
    res.json({ message: "Thread created successfully", thread: newPost });
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).json({ error: err.message });
  }
});

export default postRouter;
