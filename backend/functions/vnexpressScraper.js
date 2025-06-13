// vnexpress-scraper.js
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Use stealth plugin
chromium.use(stealth());

// Directory setup
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  __dirname = path.resolve();
}
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const CONFIG = {
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  ],
  categories: [
    { url: 'https://vnexpress.net/thoi-su', name: 'Thời sự' },
    { url: 'https://vnexpress.net/the-gioi', name: 'Thế giới' },
    { url: 'https://vnexpress.net/kinh-doanh/doanh-nghiep', name: 'Doanh Nghiep' },
    { url: 'https://vnexpress.net/giai-tri', name: 'Giải trí' }
  ],
  source: {
    name: 'VnExpress',
    url: 'https://vnexpress.net',
    id: '67d28bab5a9c17e61ac5555d'
  },
  maxArticlesPerCategory: 10,
  timeout: 120000
};

// MongoDB connection
const MONGO_URI = 'mongodb+srv://finbud123:finbud123@cluster0.8mbj0ln.mongodb.net/production?retryWrites=true&w=majority&appName=Cluster0';

// Define MongoDB schemas
const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  author: String,
  sourceId: String,
  url: { type: String, unique: true },
  category: String,
  featuredImage: String,
  publishDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const sourceSchema = new mongoose.Schema({
  _id: String,
  name: String,
  url: String,
  lastScraped: Date
});

const userSchema = new mongoose.Schema({
  username: String,
  source: String,
  lastScraped: Date
});

const Article = mongoose.model('Article', articleSchema);
const Source = mongoose.model('Source', sourceSchema);
const ScrapedUser = mongoose.model('ScrapedUser', userSchema);

// Helper functions
function getRandomUserAgent() {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

async function randomDelay(min = 2000, max = 5000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Waiting ${delay/1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function takeScreenshot(page, name = 'error') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotPath = `screenshots/${name}-${timestamp}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved as ${screenshotPath}`);
  return screenshotPath;
}

async function checkForAntiBot(page) {
  try {
    const isBlocked = await page.evaluate(() => {
      return document.body.innerText.includes('captcha') || 
             document.body.innerText.includes('Access Denied') ||
             document.querySelector('#captcha-form');
    });
    
    if (isBlocked) {
      console.log('⚠️ Anti-bot detection triggered!');
      await takeScreenshot(page, 'antibot-detected');
      await randomDelay(15000, 30000);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking for anti-bot:', error);
    return false;
  }
}

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function disconnectFromMongoDB() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
}

async function scrapeArticle(page, articleUrl, categoryName) {
  try {
    console.log(`Navigating to article: ${articleUrl}`);
    await page.goto(articleUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout 
    });

    // Check for anti-bot
    if (await checkForAntiBot(page)) {
      console.log('Retrying after anti-bot detection...');
      return await scrapeArticle(page, articleUrl, categoryName);
    }

    // Wait for article content
    await page.waitForSelector('article', { timeout: CONFIG.timeout });

    const articleData = await page.evaluate(() => {
      const getText = (selector) => 
        document.querySelector(selector)?.innerText.trim() || '';
      
      const title = getText('h1.title-detail') || getText('h1.title-news');
      const description = getText('.description') || getText('.lead_detail');
      
      const author = getText('.author_mail strong') || 
                     getText('.author_mail') || 
                     getText('.author-info') ||
                     'VnExpress';
      
      // Extract publish date
      let publishDateStr = getText('.date') || getText('.header-time');
      let publishDate = new Date();
      if (publishDateStr) {
        try {
          publishDateStr = publishDateStr.replace(/\s+/g, ' ').trim();
          publishDate = new Date(publishDateStr);
        } catch (e) {
          console.error('Date parsing error:', e);
        }
      }
      
      // Extract article content
      const contentNodes = document.querySelectorAll('.fck_detail p.Normal, .fck_detail p, article p.Normal');
      let content = '';
      contentNodes.forEach(node => {
        if (node.innerText.trim() && !node.querySelector('strong')) {
          content += node.innerText.trim() + '\n\n';
        }
      });
      
      // Get featured image
      const featuredImage = document.querySelector('.fig-picture img, .tplCaption img')?.src || '';
      
      return {
        title,
        description,
        author,
        publishDate: publishDate.toISOString(),
        content: content.trim(),
        featuredImage,
        url: window.location.href
      };
    });

    // Add category if not found in article
    if (!articleData.category) {
      articleData.category = categoryName;
    }

    return articleData;
  } catch (error) {
    console.error(`Error scraping article ${articleUrl}:`, error);
    await takeScreenshot(page, 'article-error');
    throw error;
  }
}

async function scrapeCategory(page, category) {
  try {
    console.log(`Navigating to category: ${category.url}`);
    await page.goto(category.url, { 
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout 
    });
    
    // Check for anti-bot
    if (await checkForAntiBot(page)) {
      console.log('Retrying after anti-bot detection...');
      return await scrapeCategory(page, category);
    }

    // Wait for articles to load
    await page.waitForSelector('.title-news a, .article-title a', { timeout: CONFIG.timeout });

    // Extract article links
    const articles = await page.$$eval(
      '.title-news > h3 > a, .title-news a, .article-title a', 
      (links, max) => links.slice(0, max).map(link => ({
        url: link.href,
        title: link.innerText.trim(),
      })),
      CONFIG.maxArticlesPerCategory
    );

    console.log(`Found ${articles.length} articles in ${category.name}`);
    return articles;
  } catch (error) {
    console.error(`Error scraping category ${category.name}:`, error);
    await takeScreenshot(page, 'category-error');
    throw error;
  }
}

async function processArticles(browser, articles, categoryName) {
  const results = [];
  
  for (const article of articles) {
    const articlePage = await browser.newPage();
    try {
      // Check if article already exists
      const existingArticle = await Article.findOne({ url: article.url });
      if (existingArticle) {
        console.log(`Article already exists: ${article.title}`);
        continue;
      }

      await randomDelay();
      
      // Set random user agent
      await articlePage.setExtraHTTPHeaders({
        'User-Agent': getRandomUserAgent()
      });
      
      // Scrape article
      const articleData = await scrapeArticle(articlePage, article.url, categoryName);
      
      // Save to database
      const newArticle = new Article({
        ...articleData,
        sourceId: CONFIG.source.id,
        category: categoryName,
        publishDate: new Date(articleData.publishDate)
      });

      await newArticle.save();
      
      // Track author
      await ScrapedUser.findOneAndUpdate(
        { username: articleData.author },
        {
          username: articleData.author,
          source: "vnexpress",
          lastScraped: new Date()
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Saved article: ${articleData.title}`);
      results.push(articleData);
    } catch (error) {
      console.error(`Failed to process article ${article.title}:`, error);
    } finally {
      await articlePage.close();
    }
  }
  
  return results;
}

async function scrapeVnExpress() {
  let browser = null;
  
  try {
    console.log("🚀 Starting VnExpress Scraper...");
    await connectToMongoDB();

    // Update source info
    await Source.findOneAndUpdate(
      { _id: CONFIG.source.id },
      {
        name: CONFIG.source.name,
        url: CONFIG.source.url,
        lastScraped: new Date()
      },
      { upsert: true, new: true }
    );

    // Launch browser with stealth
    browser = await chromium.launch({ 
      headless: true,
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ]
    });

    const context = await browser.newContext({
      userAgent: getRandomUserAgent(),
      viewport: { width: 1920, height: 1080 },
      timeout: CONFIG.timeout
    });

    const page = await context.newPage();

    // Process each category
    for (const category of CONFIG.categories) {
      try {
        console.log(`\n=== Processing category: ${category.name} ===`);
        
        // Get articles from category page
        const articles = await scrapeCategory(page, category);
        
        // Process articles
        await processArticles(browser, articles, category.name);
        
        console.log(`✅ Completed category: ${category.name}`);
      } catch (error) {
        console.error(`❌ Failed category ${category.name}:`, error);
      }
    }

    console.log('🎉 Scraping completed successfully!');
  } catch (error) {
    console.error("Scraper failed:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
    await disconnectFromMongoDB();
  }
}

// Run the scraper
scrapeVnExpress().catch(err => {
  console.error('Scraper failed:', err);
  process.exit(1);
});