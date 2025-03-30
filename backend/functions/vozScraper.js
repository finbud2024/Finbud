import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ScrapedUser from '../Database Schema/ScrapedUser.js';
import forOwn from 'for-own';
import cloneDeep from 'clone-deep';
import Post from '../Database Schema/Post.js';

dotenv.config();
puppeteer.use(StealthPlugin());

const MONGO_URI = process.env.MONGO_URI;
const FORUM_ID = '67d28bab5a9c17e61ac5423e'; 

async function connectToMongoDB() {
  if (!MONGO_URI) throw new Error('MONGO_URI not set');
  await mongoose.connect(MONGO_URI);
  console.log('Mongo connected');
}

function getRandomUserAgent() {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
    'Mozilla/5.0 (X11; Linux x86_64)...',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3)...',
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

export async function scrapeVoz() {
  await connectToMongoDB();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent());
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
      forumId: FORUM_ID,
      authorId: authorDoc._id,
      title: thread.title,
      body: postData.body,
      createdAt: postData.time,
      updatedAt: new Date(),
      comments: processedComments,
    });

    await post.save();
    console.log(`Saved: ${thread.title}`);
    await threadPage.close();
  }

  await browser.close();
  await mongoose.disconnect();
  console.log('Scraper done and MongoDB disconnected');
}

// Lambda wrapper
export const handler = async () => {
  try {
    await scrapeVoz();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scraping completed successfully' }),
    };
  } catch (err) {
    console.error('Lambda scraper error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Scraper failed', error: err.message }),
    };
  }
};
