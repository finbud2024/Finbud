import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ScrapedUser from '../Database Schema/ScrapedUser.js';
import Post from '../Database Schema/Post.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Initialize stealth plugin
puppeteer.use(StealthPlugin());

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Load environment variables directly
const MONGO_URI = process.env.MONGO_URI;

// User agent list
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
];

// Utility functions
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

const FORUM_ID = '67d28bab5a9c17e61ac5423e';

async function scrapeVoz() {
  console.log('Starting VOZ scraper...');
  await connectToMongoDB();

  const browser = await puppeteer.launch({
    headless: false, // Changed to false to see what's happening
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });
  console.log('Browser launched');

  const page = await browser.newPage();
  
  // Set a more realistic viewport
  await page.setViewport({
    width: 1920,
    height: 1080
  });

  // Set a more realistic user agent
  const userAgent = getRandomUserAgent();
  await page.setUserAgent(userAgent);

  console.log('Navigating to VOZ forum...');
  await page.goto('https://voz.vn/f/tien-%C4%91ien-tu.94/', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  await page.waitForSelector('.structItem-title');
  console.log('Forum page loaded');

  const threads = await page.$$eval('.structItem-title a[data-preview-url]', links =>
    links.slice(0, 5).map(link => ({
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
      
      // Add delay between requests (5-10 seconds)
      if (threads.indexOf(thread) > 0) {
        const delay = Math.floor(Math.random() * 5000) + 5000;
        console.log(`Waiting ${delay/1000} seconds before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const threadPage = await browser.newPage();
      await threadPage.setUserAgent(userAgent);
      await threadPage.setViewport({ width: 1920, height: 1080 });

      console.log('Navigating to thread page...');
      await threadPage.goto(thread.url, { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
      
      await threadPage.waitForSelector('.message');
      console.log('Thread page loaded');

      // Get all messages on the page
      const messages = await threadPage.$$('.message');
      console.log(`Found ${messages.length} total messages on page`);
      
      if (messages.length === 0) {
        console.log('No messages found on page');
        await threadPage.close();
        continue;
      }

      // Get the main post (first message)
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

      let authorDoc = await ScrapedUser.findOne({ username: mainPost.author });
      if (!authorDoc) {
        authorDoc = await ScrapedUser.create({ username: mainPost.author, avatar: mainPost.avatar });
        console.log(`Created new user: ${mainPost.author}`);
      }

      // Get comments (all messages after the first one)
      console.log('Extracting comments...');
      const comments = await Promise.all(
        messages.slice(1, 6).map(async (message, index) => {
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
        // Skip comments with empty bodies
        if (!comment.body.trim()) {
          console.log('Skipping empty comment');
          continue;
        }

        let commentUser = await ScrapedUser.findOne({ username: comment.author });
        if (!commentUser) {
          commentUser = await ScrapedUser.create({
            username: comment.author,
            avatar: comment.avatar,
          });
          console.log(`Created new user for comment: ${comment.author}`);
        }
        processedComments.push({
          body: comment.body.trim(),
          authorId: commentUser._id,
          createdAt: comment.time,
        });
      }

      console.log(`Processing ${processedComments.length} valid comments`);

      // Check if post already exists
      const existingPost = await Post.findOne({
        forumId: FORUM_ID,
        title: thread.title,
        'authorId': authorDoc._id
      });

      if (existingPost) {
        console.log(`Post already exists: ${thread.title}`);
        
        // Update existing post
        existingPost.body = mainPost.body.trim();
        existingPost.updatedAt = new Date();
        
        // Update comments
        existingPost.comments = processedComments;
        
        await existingPost.save();
        console.log(`✅ Updated existing post: ${thread.title}`);
      } else {
        // Create new post
        const post = new Post({
          forumId: FORUM_ID,
          authorId: authorDoc._id,
          title: thread.title,
          body: mainPost.body.trim(),
          createdAt: mainPost.time,
          updatedAt: new Date(),
          comments: processedComments,
        });

        await post.save();
        console.log(`✅ Saved new post: ${thread.title}`);
      }

      await threadPage.close();
    } catch (error) {
      console.error(`Error processing thread ${thread.title}:`, error.message);
      try {
        await threadPage.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }

  await browser.close();
  await disconnectFromMongoDB();
  console.log('\n🎉 Scraper completed successfully!');
}

// Lambda wrapper
export const handler = async (event, context) => {
  try {
    await scrapeVoz();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scraping completed successfully' }),
    };
  } catch (err) {
    console.error('❌ Scraper failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Scraper failed', error: err.message }),
    };
  }
};

// Run scraper if file is executed directly
console.log('Starting VOZ scraper...');
scrapeVoz().catch(err => {
  console.error('❌ Scraper failed:', err);
  process.exit(1);
});

