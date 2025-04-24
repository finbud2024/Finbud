import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ScrapedUser from '../Database Schema/ScrapedUser.js';
import Post from '../Database Schema/Post.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Forum from "../Database Schema/Forum.js";

puppeteer.use(StealthPlugin());

// Get the directory path of the current module - with fallback
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  // Fallback for environments where import.meta is not available
  __dirname = path.resolve();
}
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

// Custom browser configuration with more stealth options
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

// Custom user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
];

// Custom functions
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

// Helper function to add random delay
async function randomDelay(min = 5000, max = 10000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Waiting ${delay/1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Helper function to check for anti-bot detection
async function checkForAntiBot(page) {
  try {
    // Check for common anti-bot elements
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

// Define the specific forum to scrape
const FORUM_ID = '67d28bab5a9c17e61ac5423c';
const FORUM_URL = 'https://voz.vn/f/kinh-te-luat.92/ ';

async function scrapeVoz() {
  let browser = null;
  try {
    console.log("Starting VOZ scraper...");
    await connectToMongoDB();
    console.log("Connected to MongoDB");

    browser = await puppeteer.launch(browserConfig);
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.setUserAgent(getRandomUserAgent());

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    });

    console.log(`--- Scraping forum: ${FORUM_URL} ---`);
    await page.goto(FORUM_URL, { 
      waitUntil: "networkidle0",
      timeout: 60000 
    });

    await checkForAntiBot(page);

    await page.waitForSelector(".structItem-title");
    console.log('Forum page loaded');

    const threads = await page.$$eval('.structItem-title a[data-preview-url]', links =>
      links.slice(0, 10).map(link => ({
        url: link.href,
        title: link.innerText.trim(),
      }))
    );
    console.log(`Found ${threads.length} threads to scrape`);

    for (const thread of threads) {
      try {
        console.log(`\n=== Processing thread ${threads.indexOf(thread) + 1} of ${threads.length} ===`);
        console.log(`URL: ${thread.url}`);
        console.log(`Title: ${thread.title}`);
        
        const existingPost = await Post.findOne({
          forumId: FORUM_ID,
          title: thread.title
        });

        if (existingPost) {
          console.log(`Post already exists: ${thread.title}`);
          continue; 
        }
        
        await randomDelay();

        const threadPage = await browser.newPage();
        await threadPage.setUserAgent(getRandomUserAgent());
        await threadPage.setViewport({ width: 1920, height: 1080 });

        console.log('Navigating to thread page...');
        await threadPage.goto(thread.url, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000 
        });
        
        await threadPage.waitForSelector('.message');
        console.log('Thread page loaded');

        const messages = await threadPage.$$('.message');
        console.log(`Found ${messages.length} total messages on page`);
        
        if (messages.length === 0) {
          console.log('No messages found on page');
          await threadPage.close();
          continue;
        }

        console.log('Extracting main post...');
        const mainPost = await messages[0].evaluate(node => {
          const body = node.querySelector('.bbWrapper')?.innerText || '';
          const author = node.querySelector('h4 a.username')?.innerText || 'Unknown';
          const avatar = node.querySelector('.avatar img')?.src || '';
          const time = node.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();

          return { author, avatar, body, time };
        });

        if (!mainPost || !mainPost.body.trim()) {
          console.log('No valid post data found in first message');
          await threadPage.close();
          continue;
        }

        console.log(`Found post by: ${mainPost.author}`);
        console.log(`Post body length: ${mainPost.body.length} characters`);

        // Create or update scraped user
        const scrapedUser = await ScrapedUser.findOneAndUpdate(
          { username: mainPost.author },
          {
            username: mainPost.author,
            source: "voz",
            lastScraped: new Date(),
            avatar: mainPost.avatar
          },
          { upsert: true, new: true }
        );

        // Get comments (all messages after the first one)
        console.log('Extracting comments...');
        const comments = await Promise.all(
          messages.slice(1, 11).map(async (message, index) => {
            console.log(`Processing comment ${index + 1}...`);
            return message.evaluate(node => {
              const body = node.querySelector('.bbWrapper')?.innerText || '';
              const author = node.querySelector('h4 a.username')?.innerText || 'Unknown';
              const time = node.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
              const avatar = node.querySelector('.avatar img')?.src || '';
              return { author, body, time, avatar };
            });
          })
        );

        console.log(`Found ${comments.length} potential comments`);
        comments.forEach((comment, index) => {
          console.log(`Comment ${index + 1}: ${comment.author} - ${comment.body.length} characters`);
        });

        const processedComments = [];
        for (const comment of comments) {

          if (!comment.body.trim()) {
            console.log('Skipping empty comment');
            continue;
          }

          const commentUser = await ScrapedUser.findOneAndUpdate(
            { username: comment.author },
            {
              username: comment.author,
              source: "voz",
              lastScraped: new Date(),
              avatar: comment.avatar
            },
            { upsert: true, new: true }
          );

          processedComments.push({
            body: comment.body.trim(),
            authorId: commentUser._id,
            createdAt: comment.time,
          });
        }

        console.log(`Processing ${processedComments.length} valid comments`);

        // Create new post
        const post = new Post({
          title: thread.title,
          body: mainPost.body.trim(),
          authorId: scrapedUser._id,
          forumId: FORUM_ID,
          createdAt: new Date(mainPost.time),
          updatedAt: new Date(),
          comments: processedComments,
          reactions: {
            views: 0, 
            comments: processedComments.length 
          }
        });

        await post.save();
        console.log(`✅ Saved new post: ${thread.title} with ${processedComments.length} comments`);
        await threadPage.close();
      } catch (error) {
        console.error(`Error processing thread ${thread.title}:`, error);
        try {
          await threadPage.close();
        } catch (e) {
        }
      }
    }

    await disconnectFromMongoDB();
    return { success: true, message: `Scraped ${threads.length} threads` };
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
    await scrapeVoz();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scraping completed successfully' }),
    };
  } catch (err) {
    console.error('Scraper failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Scraper failed', error: err.message }),
    };
  }
};

console.log('Starting VOZ scraper...');
scrapeVoz().catch(err => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
