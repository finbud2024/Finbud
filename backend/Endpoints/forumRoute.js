import express from "express";
import Forum from "../Database Schema/Forum.js";

const forumRouter = express.Router();

forumRouter.get("/", async (req, res) => {
  try {
    const forums = await Forum.find();
    res.json(forums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

forumRouter.post("/init", async (req, res) => {
  const forumsData = [
    { name: "General", slug: "p/general", description: "General financial discussions", logo: "Home" },
    { name: "Investing", slug: "p/investing", description: "Stock market and investment strategies", logo: "TrendingUp" },
    { name: "Crypto", slug: "p/crypto", description: "Cryptocurrency and blockchain", logo: "Coins" },
    { name: "Economy", slug: "p/economy", description: "Macroeconomics and financial news", logo: "BarChart" },
    { name: "Personal Finance", slug: "p/personal-finance", description: "Budgeting and saving tips", logo: "Wallet" },
    { name: "Real Estate", slug: "p/real-estate", description: "Housing and mortgage discussions", logo: "Building" },
    { name: "Fintech", slug: "p/fintech", description: "Financial technology innovations", logo: "Cpu" },
    { name: "AMA", slug: "p/ama", description: "Ask Me Anything with experts", logo: "Mic" },
    { name: "Self Promotions", slug: "p/self-promotions", description: "Share your projects and blogs", logo: "Megaphone" },
    { name: "Memes", slug: "p/memes", description: "Finance-related humor", logo: "Smile" },
    { name: "Education", slug: "p/education", description: "Learning resources and literacy", logo: "BookOpen" }
  ];

  try {
    const existingForums = await Forum.find();
    if (existingForums.length > 0) {
      return res.json({ message: "Forums already initialized" });
    }

    await Forum.insertMany(forumsData);
    res.json({ message: "Forums initialized successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default forumRouter;
