import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ScrapedUser from '../Database Schema/ScrapedUser.js';
import Post from '../Database Schema/Post.js';

// Initialize stealth plugin
puppeteer.use(StealthPlugin());

// Load environment variables
dotenv.config();

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
  await connectToMongoDB();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(getRandomUserAgent());
  
  // Add stealth options
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });

  await page.goto('https://voz.vn/f/tien-%C4%91ien-tu.94/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.structItem-title');

  const threads = await page.$$eval('.structItem-title a[data-preview-url]', links =>
    links.slice(0, 5).map(link => ({
      url: link.href,
      title: link.innerText.trim(),
    }))
  );

  for (const thread of threads) {
    const threadPage = await browser.newPage();
    await threadPage.setUserAgent(getRandomUserAgent());
    await threadPage.goto(thread.url, { waitUntil: 'domcontentloaded' });
    await threadPage.waitForSelector('.message');

    const postData = await threadPage.evaluate(() => {
      const firstPost = document.querySelector('.message');
      const body = firstPost.querySelector('.bbWrapper')?.innerText || '';
      const author = firstPost.querySelector('h4 a.username')?.innerText || 'Unknown';
      const avatar = firstPost.querySelector('.avatar img')?.src || '';
      const time = firstPost.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
      return { author, avatar, body, time };
    });

    let authorDoc = await ScrapedUser.findOne({ username: postData.author });
    if (!authorDoc) {
      authorDoc = await ScrapedUser.create({ username: postData.author, avatar: postData.avatar });
    }

    const comments = await threadPage.$$eval('.message', nodes =>
      nodes.slice(1, 6).map(node => {
        const body = node.querySelector('.bbWrapper')?.innerText || '';
        const author = node.querySelector('h4 a.username')?.innerText || 'Unknown';
        const time = node.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
        const avatar = node.querySelector('.avatar img')?.src || '';
        return { author, body, time, avatar };
      })
    );

    const processedComments = [];
    for (const comment of comments) {
      let commentUser = await ScrapedUser.findOne({ username: comment.author });
      if (!commentUser) {
        commentUser = await ScrapedUser.create({
          username: comment.author,
          avatar: comment.avatar,
        });
      }
      processedComments.push({
        body: comment.body,
        authorId: commentUser._id,
        createdAt: comment.time,
      });
    }

    const post = new Post({
      forumId: "67d28bab5a9c17e61ac5423e",
      authorId: authorDoc._id,
      title: thread.title,
      body: postData.body,
      createdAt: postData.time,
      updatedAt: new Date(),
      comments: processedComments,
    });

    await post.save();
    console.log(`Saved post: ${thread.title}`);
    await threadPage.close();
  }

  await browser.close();
  await disconnectFromMongoDB();
  console.log('Scraper done and MongoDB disconnected');
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
    console.error('Scraper failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Scraper failed', error: err.message }),
    };
  }
};
