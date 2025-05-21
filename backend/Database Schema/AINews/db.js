import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

// ✅ Check if article already exists
export async function articleExists(fireantUrl) {
  const res = await pool.query(
    'SELECT 1 FROM articles WHERE fireant_url = $1 LIMIT 1',
    [fireantUrl]
  );
  return res.rowCount > 0;
}

// ✅ Insert a new article
export async function insertArticle(article) {
  const {
    title,
    content,
    imageUrls,
    imageUrl,
    fireantUrl,
    originalUrl,
    author,
    source,
    publishedAt
  } = article;

  const result = await pool.query(
    `INSERT INTO articles (
      title, content, image_urls, image_url,
      fireant_url, original_url, author,
      source, published_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id`,
    [
      title,
      content,
      imageUrls,
      imageUrl,
      fireantUrl,
      originalUrl,
      author,
      source,
      publishedAt
    ]
  );

  return result.rows[0].id;
}

// ❌ Delete an article by ID (including all dependent bullets/tags via ON DELETE CASCADE)
export async function deleteArticleById(id) {
  try {
    await pool.query("DELETE FROM articles WHERE id = $1", [id]);
    console.log(`🗑️ Deleted article ID ${id} from database.`);
  } catch (err) {
    console.error(`❌ Failed to delete article ID ${id}:`, err);
    throw err;
  }
}