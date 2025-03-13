// import express from "express";
// import Forum from "../Database Schema/Forum.js";

// const router = express.Router();

// // ✅ GET: Retrieve all forums from MongoDB
// router.get("/", async (req, res) => {
//     try {
//         const forums = await Forum.find();
//         res.json(forums);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ✅ POST: Initialize forums (Run only once)
// router.post("/init", async (req, res) => {
//     const forumsData = [
//         { name: "General", slug: "p/general", description: "General financial discussions" },
//         { name: "Investing", slug: "p/investing", description: "Stock market and investment strategies" },
//         { name: "Crypto", slug: "p/crypto", description: "Cryptocurrency and blockchain" },
//         { name: "Economy", slug: "p/economy", description: "Macroeconomics and financial news" },
//         { name: "Personal Finance", slug: "p/personal-finance", description: "Personal finance, budgeting, and saving tips" },
//         { name: "Real Estate", slug: "p/real-estate", description: "Discussions about housing, mortgages, and real estate investments" },
//         { name: "Fintech", slug: "p/fintech", description: "Financial technology innovations and startups" },
//         { name: "AMA", slug: "p/ama", description: "Ask Me Anything sessions with experts" },
//         { name: "Self Promotions", slug: "p/self-promotions", description: "Share your projects, blogs, and personal finance content" },
//         { name: "Memes", slug: "p/memes", description: "Finance-related memes and humor" },
//         { name: "Education", slug: "p/education", description: "Learning resources and financial literacy" }
//     ];

//     try {
//         await Forum.insertMany(forumsData);
//         res.json({ message: "Forums initialized successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// export default router;
