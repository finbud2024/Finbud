// import express from "express";
// import Post from "../Database Schema/Post.js"; 

// const router = express.Router();

// router.get("/posts", async (req, res) => {
//     try {
//         const { forum } = req.query;
//         if (!forum) {
//             return res.status(400).json({ error: "Forum ID is required" });
//         }

//         const posts = await Post.find({ forumId: forum }).populate("authorId", "username profilePicture");
//         res.json(posts);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// export default router;
