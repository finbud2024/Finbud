import express from "express";
import mongoose from "mongoose";
import Post from "../Database Schema/Post.js";
import Forum from "../Database Schema/Forum.js";

const postRouter = express.Router();

postRouter.get("/forum/:forumSlug(*)", async (req, res) => {
  try {
    const forumSlug = decodeURIComponent(req.params.forumSlug);
    console.log(`🔍 Searching forum with slug: ${forumSlug}`);

    const forum = await Forum.findOne({ slug: forumSlug });
    if (!forum) return res.status(404).json({ error: "Forum not found" });

    const posts = await Post.find({ forumId: forum._id })
      .populate({ path: "forumId", select: "name logo slug" })
      .populate({ path: "authorId", select: "identityData.displayName identityData.profilePicture" });

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
      author: {
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

postRouter.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: `Invalid Post ID format: ${postId}` });
    }

    const post = await Post.findById(postId)
      .populate({ path: "forumId", select: "name logo slug" })
      .populate({ path: "authorId", select: "identityData.displayName identityData.profilePicture" })
      .populate({ path: "comments.authorId", select: "identityData.displayName identityData.profilePicture" });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json({
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
      author: {
        displayName: post.authorId.identityData?.displayName || "Anonymous",
        profilePicture: post.authorId.identityData?.profilePicture || "/default-avatar.png"
      },
      comments: post.comments.map(comment => ({
        _id: comment._id,
        body: comment.body,  
        createdAt: comment.createdAt,
        author: {
          displayName: comment.authorId?.identityData?.displayName || "A  nonymous",
          profilePicture: comment.authorId?.identityData?.profilePicture || "/default-avatar.png"
        },
        likes: comment.reactions?.likes || 0
      }))
    });
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: err.message });
  }
});


postRouter.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: `Invalid Post ID format: ${postId}` });
    }

    const post = await Post.findById(postId)
      .populate({ path: "forumId", select: "name logo slug" })
      .populate({ path: "authorId", select: "identityData.displayName identityData.profilePicture" })
      .populate({
        path: "comments.authorId", 
        select: "identityData.displayName identityData.profilePicture",
      });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json({
      _id: post._id,
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
      reactions: post.reactions,
      forumId: {
        name: post.forumId.name || "Unknown Forum",
        logo: post.forumId.logo || null,
        slug: post.forumId.slug || "",
      },
      author: {
        displayName: post.authorId.identityData?.displayName || "Anonymous",
        profilePicture: post.authorId.identityData?.profilePicture || "/default-avatar.png",
      },
      comments: post.comments.map(comment => ({
        _id: comment._id,
        body: comment.body,
        createdAt: comment.createdAt,
        author: {
          displayName: comment.authorId?.identityData?.displayName || "Anonymous",
          profilePicture: comment.authorId?.identityData?.profilePicture || "/default-avatar.png",
        },
        likes: comment.reactions?.likes || 0,
      })),
    });
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: err.message });
  }
});

postRouter.post("/post/:postId/add-comment", async (req, res) => {
  try {
    const { postId } = req.params;
    const { body, authorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: `Invalid Post ID format: ${postId}` });
    }

    if (!body.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Fetch the user details from the database
    const author = await mongoose.model("User").findById(authorId).select("identityData.displayName identityData.profilePicture");

    // Ensure the user exists
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Create new comment
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      authorId: author._id,
      body: body,
      createdAt: new Date(),
      reactions: { likes: 0 }
    };

    post.comments.push(newComment);
    post.reactions.comments += 1;
    await post.save();

    res.json({
      message: "Comment added successfully",
      comment: {
        _id: newComment._id,
        body: newComment.body,
        createdAt: newComment.createdAt,
        likes: newComment.reactions.likes,
        author: {
          displayName: author.identityData.displayName || "Anonymous",
          profilePicture: author.identityData.profilePicture || "/default-avatar.png"
        }
      }
    });

  } catch (err) {
    console.error("❌ Error adding comment:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new thread
postRouter.post("/", async (req, res) => {
  try {
    const { forumId, authorId, title, body } = req.body;

    if (!forumId || !authorId || !title.trim() || !body.trim()) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(forumId) || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Fetch the user details from the database
    const author = await mongoose.model("User").findById(authorId).select("identityData.displayName identityData.profilePicture");

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const newPost = new Post({
      forumId,
      authorId: author._id,
      title,
      body,
      comments: [],
      reactions: { likes: 0, comments: 0, shares: 0 }
    });

    await newPost.save();

    res.json({
      message: "Thread created successfully",
      thread: {
        _id: newPost._id,
        title: newPost.title,
        body: newPost.body,
        createdAt: newPost.createdAt,
        reactions: newPost.reactions,
        forumId: newPost.forumId,
        author: {
          displayName: author.identityData.displayName || "Anonymous",
          profilePicture: author.identityData.profilePicture || "/default-avatar.png"
        }
      }
    });

  } catch (err) {
    console.error("❌ Error creating thread:", err);
    res.status(500).json({ error: err.message });
  }
});

export default postRouter;


