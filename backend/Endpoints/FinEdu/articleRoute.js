import express from "express";
import Article from "../../Database Schema/FinEdu/Article.js";

const articleRoute = express.Router();

// GET /api/articles — Get all articles, newest first
articleRoute.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("authorId", "name") // adjust fields as needed
      .populate("sourceId", "name") // adjust fields as needed
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles — Create a new article (for scraper or manual)
articleRoute.post("/", async (req, res) => {
  const {
    title,
    description,
    content,
    authorId,
    sourceId,
    url,
    category,
    featuredImage,
    tags
  } = req.body;

  if (!title || !content || !authorId || !sourceId || !url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newArticle = new Article({
      title,
      description,
      content,
      authorId,
      sourceId,
      url,
      category,
      featuredImage,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    // If duplicate (based on unique index), you’ll get a Mongo error code
    if (err.code === 11000) {
      res.status(409).json({ error: "Article already exists" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Optional: GET /api/articles/:id — get single article
articleRoute.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("authorId", "name")
      .populate("sourceId", "name");

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default articleRoute;
