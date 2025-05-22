import express from "express";
import { pool } from "../Database Schema/aiNews/db.js";

const aiNewsRoute = express.Router();

// GET 7 latest articles in simplified structure
aiNewsRoute.get("/", async (req, res) => {
    try {
      // Get 7 latest articles
      const articlesRes = await pool.query(
        `SELECT id, title, original_url, content, source, image_url, image_urls, author, published_at
         FROM articles
         ORDER BY published_at DESC
         LIMIT 7`
      );
  
      const articleIds = articlesRes.rows.map(a => a.id);
  
      // Get bullets with tags
      const bulletsRes = await pool.query(
        `SELECT sb.id, sb.article_id, sb.text, sb.sentiment, array_agg(t.name) AS tags
         FROM summary_bullets sb
         LEFT JOIN bullet_tags bt ON bt.bullet_id = sb.id
         LEFT JOIN tags t ON t.id = bt.tag_id
         WHERE sb.article_id = ANY($1::int[])
         GROUP BY sb.id`,
        [articleIds]
      );
  
      // Get tags per article
      const tagsRes = await pool.query(
        `SELECT at.article_id, array_agg(t.name) AS tags
         FROM article_tags at
         JOIN tags t ON t.id = at.tag_id
         WHERE at.article_id = ANY($1::int[])
         GROUP BY at.article_id`,
        [articleIds]
      );
  
      // Map bullets and tags by article
      const bulletsByArticle = {};
      bulletsRes.rows.forEach(b => {
        if (!bulletsByArticle[b.article_id]) bulletsByArticle[b.article_id] = [];
        bulletsByArticle[b.article_id].push({
          text: b.text,
          sentiment: b.sentiment,
          tags: b.tags.filter(tag => tag !== null)
        });
      });
  
      const tagsByArticle = {};
      tagsRes.rows.forEach(t => {
        tagsByArticle[t.article_id] = t.tags.filter(tag => tag !== null);
      });
  
      // Construct response
      const response = articlesRes.rows.map(a => ({
        id: a.id,
        title: a.title,
        original_url: a.original_url,
        content: a.content,
        source: a.source,
        image_url: a.image_url,
        image_urls: a.image_urls,
        author: a.author,
        published_at: a.published_at,
        bullets: bulletsByArticle[a.id] || [],
        tags: tagsByArticle[a.id] || []
      }));
  
      res.status(200).json(response);
    } catch (err) {
      console.error("❌ Error fetching simplified article list:", err);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });
  

// GET article by ID
aiNewsRoute.get("/:id", async (req, res) => {
    const { id } = req.params;
  
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "Invalid article ID" });
    }
  
    try {
      // 1. Fetch article
      const articleRes = await pool.query(
        `SELECT id, title, original_url, content, source, image_url, image_urls, author, published_at
         FROM articles
         WHERE id = $1`,
        [id]
      );
  
      if (articleRes.rows.length === 0) {
        return res.status(404).json({ error: "Article not found" });
      }
  
      // 2. Fetch bullets + tags
      const bulletsRes = await pool.query(
        `SELECT sb.id, sb.text, sb.sentiment, array_agg(t.name) AS tags
         FROM summary_bullets sb
         LEFT JOIN bullet_tags bt ON bt.bullet_id = sb.id
         LEFT JOIN tags t ON t.id = bt.tag_id
         WHERE sb.article_id = $1
         GROUP BY sb.id`,
        [id]
      );
  
      // 3. Fetch article-level tags
      const tagsRes = await pool.query(
        `SELECT array_agg(t.name) AS tags
         FROM article_tags at
         JOIN tags t ON t.id = at.tag_id
         WHERE at.article_id = $1`,
        [id]
      );
  
      const article = articleRes.rows[0];
      const bullets = bulletsRes.rows.map(b => ({
        text: b.text,
        sentiment: b.sentiment,
        tags: b.tags.filter(tag => tag !== null)
      }));
      const tags = tagsRes.rows[0]?.tags?.filter(tag => tag !== null) || [];
  
      res.status(200).json({
        ...article,
        bullets,
        tags
      });
    } catch (err) {
      console.error("❌ Error fetching article:", err);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });  

export default aiNewsRoute;