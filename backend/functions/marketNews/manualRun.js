import { crawlFireAnt } from "./aiNewsScraper.js";
import { analyzeArticle } from "./aiNewsAnalyzer.js";
import { pool, deleteArticleById } from "../../Database Schema/aiNews/db.js";

// function to test the pipeline manually
async function runPipeline() {
    try {
      console.log("🌐 Starting end-to-end article pipeline...");
  
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
  
      console.log(`✅ Successfully processed ${newArticles.length} articles.`);
    } catch (error) {
      console.error("❌ Handler pipeline error:", error);
    } finally {
      // End the pool only after all operations are complete
      await pool.end();
    }
  }
  
  runPipeline();  