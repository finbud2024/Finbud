import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ScrapedUser from '../Database Schema/ScrapedUser.js';
import Article from '../Database Schema/Article.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Source from "../Database Schema/Source.js";

puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

// Custom browser configuration with stealth options
const browserConfig = {
  headless: false, 
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process'
  ]
};

// Custom user agents rotation
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
];

// Helper functions
function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
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

// Helper function to add random delay between actions
async function randomDelay(min = 5000, max = 10000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Waiting ${delay/1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Helper function to check for anti-bot detection
async function checkForAntiBot(page) {
  try {
    const antiBotElements = await page.$$eval('*', elements => {
      return elements.some(el => {
        const text = el.textContent.toLowerCase();
        return text.includes('captcha') || 
               text.includes('verify') || 
               text.includes('robot') || 
               text.includes('bot detection');
      });
    });

    if (antiBotElements) {
      console.log('⚠️ Anti-bot detection found! Waiting longer...');
      await randomDelay(15000, 30000); 
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking for anti-bot:', error);
    return false;
  }
}

// Define the source to scrape
const SOURCE_ID = '67d28bab5a9c17e61ac5555d'; // Replace with your actual source ID
const VNEXPRESS_URL = 'https://vnexpress.net/kinh-doanh';

// List of categories to scrape
const categories = [
  { url: 'https://vnexpress.net/thoi-su', name: 'Thời sự' },
  { url: 'https://vnexpress.net/the-gioi', name: 'Thế giới' },
  { url: 'https://vnexpress.net/kinh-doanh/doanh-nghiep', name: 'Doanh Nghiep' },
  { url: 'https://vnexpress.net/giai-tri', name: 'Giải trí' }
];

async function scrapeVnExpress() {
  let browser = null;
  try {
    console.log("Starting VnExpress scraper...");
    await connectToMongoDB();
    console.log("Connected to MongoDB");

    // Create or update the source in database
    await Source.findOneAndUpdate(
      { _id: SOURCE_ID },
      {
        name: 'VnExpress',
        url: VNEXPRESS_URL,
        lastScraped: new Date()
      },
      { upsert: true, new: true }
    );

    browser = await puppeteer.launch(browserConfig);
    
    // Process each category
    for (const category of categories) {
      console.log(`\n--- Scraping category: ${category.name} (${category.url}) ---`);
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent(getRandomUserAgent());
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      });

      await page.goto(category.url, { 
        waitUntil: "networkidle0",
        timeout: 60000 
      });

      await checkForAntiBot(page);
      
      console.log('Category page loaded, finding articles...');
      
      // Extract article links from the category page
      const articles = await page.$$eval('.title-news > h3 > a, .title-news a', links =>
        links.slice(0, 10).map(link => ({
          url: link.href,
          title: link.innerText.trim(),
        }))
      );
      
      console.log(`Found ${articles.length} articles to scrape in category ${category.name}`);

      // Process each article
      for (const article of articles) {
        try {
          console.log(`\n=== Processing article ${articles.indexOf(article) + 1} of ${articles.length} ===`);
          console.log(`URL: ${article.url}`);
          console.log(`Title: ${article.title}`);
          
          // Check if article already exists in database
          const existingArticle = await Article.findOne({
            sourceId: SOURCE_ID,
            title: article.title
          });

          if (existingArticle) {
            console.log(`Article already exists: ${article.title}`);
            continue; 
          }
          
          await randomDelay();

          const articlePage = await browser.newPage();
          await articlePage.setUserAgent(getRandomUserAgent());
          await articlePage.setViewport({ width: 1920, height: 1080 });

          console.log('Navigating to article page...');
          await articlePage.goto(article.url, { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
          });
          
          // Wait for article content to load
          await articlePage.waitForSelector('.sidebar-1');
          console.log('Article page loaded');

          // Extract article details
          const articleData = await articlePage.evaluate(() => {
            const title = document.querySelector('h1.title-detail')?.innerText.trim() || '';
            const description = document.querySelector('.description')?.innerText.trim() || '';
            const author = document.querySelector('.author_mail strong')?.innerText.trim() || 
                           document.querySelector('.author_mail')?.innerText.trim() || 'VnExpress';
            
            // Extract publish date
            let publishDateStr = document.querySelector('.date')?.innerText.trim() || '';
            let publishDate = new Date();
            if (publishDateStr) {
              try {
                // Convert Vietnamese date format to Date object
                publishDateStr = publishDateStr.replace(/\s+/g, ' ').trim();
                publishDate = new Date(publishDateStr);
              } catch (e) {
                console.error('Date parsing error:', e);
              }
            }
            
            // Extract article content
            const contentNodes = document.querySelectorAll('.fck_detail p.Normal');
            let content = '';
            contentNodes.forEach(node => {
              content += node.innerText.trim() + '\n\n';
            });
            
            // Get featured image
            const featuredImage = document.querySelector('.fig-picture img')?.src || '';
            
            // Get category
            const category = document.querySelector('.breadcrumb li:nth-child(2) a')?.innerText.trim() || '';
            
            return {
              title,
              description,
              author,
              publishDate: publishDate.toISOString(),
              content: content.trim(),
              featuredImage,
              category
            };
          });

          console.log(`Extracted article: "${articleData.title}"`);
          console.log(`Author: ${articleData.author}`);
          console.log(`Category: ${articleData.category}`);
          console.log(`Content length: ${articleData.content.length} characters`);

          // Create or update author in database
          const scrapedUser = await ScrapedUser.findOneAndUpdate(
            { username: articleData.author },
            {
              username: articleData.author,
              source: "vnexpress",
              lastScraped: new Date()
            },
            { upsert: true, new: true }
          );

          // Create new article
          const newArticle = new Article({
            title: articleData.title,
            description: articleData.description,
            content: articleData.content,
            authorId: scrapedUser._id,
            sourceId: SOURCE_ID,
            url: article.url,
            category: articleData.category || category.name,
            featuredImage: articleData.featuredImage,
            createdAt: new Date(articleData.publishDate),
            updatedAt: new Date()
          });

          await newArticle.save();
          console.log(`✅ Saved new article: ${articleData.title}`);
          
          // Close article page
          await articlePage.close();
          
        } catch (error) {
          console.error(`Error processing article ${article.title}:`, error);
          try {
            await articlePage.close();
          } catch (e) {
            // Ignore errors when trying to close already closed pages
          }
        }
      }
      
      await page.close();
    }

    await disconnectFromMongoDB();
    return { success: true, message: `Scraped articles from VnExpress` };
  } catch (error) {
    console.error("Scraper failed:", error);
    return { success: false, error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export const handler = async (event, context) => {
  try {
    const result = await scrapeVnExpress();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scraping completed successfully', result }),
    };
  } catch (err) {
    console.error('Scraper failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Scraper failed', error: err.message }),
    };
  }
};

console.log('Starting VnExpress scraper...');
scrapeVnExpress().catch(err => {
  console.error('Scraper failed:', err);
  process.exit(1);
});