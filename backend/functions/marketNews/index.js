// functions/marketNews/index.js
import { crawlFireAnt } from "./aiNewsScraper.js";
import { analyzeArticle } from "./aiNewsAnalyzer.js";
import { pool, deleteArticleById } from "../../Database Schema/aiNews/db.js";

export async function handler(event, context) {
  try {
    console.log("🌐 [CRON] Starting end-to-end article pipeline...");

    // Step 1: Crawl and save new articles
    const newArticles = await crawlFireAnt(); // Expect it to return inserted articles

    // Step 2: Analyze each new article
    for (const article of newArticles) {
      try {
        await analyzeArticle({
          id: article.id,
          title: article.title,
          content: article.content,
        });
      } catch (err) {
        console.error(`❌ Failed to analyze article ${article.id}:`, err);
        await deleteArticleById(article.id);
        continue; // Continue with next article even if one fails
      }
    }

    console.log(
      `✅ [CRON] Successfully processed ${newArticles.length} articles.`
    );
  } catch (error) {
    console.error("❌ [CRON] Handler pipeline error:", error);
  } finally {
    // End the pool only after all operations are complete
    await pool.end();
  }
}
