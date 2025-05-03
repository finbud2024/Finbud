import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import mongoose from 'mongoose';
import Course from '../Database Schema/Course.js';
import dotenv from 'dotenv';

puppeteer.use(StealthPlugin());
dotenv.config();

const SECTION_URLS = {
  'cho-nguoi-moi-bat-dau': 'https://www.dsc.com.vn/kien-thuc/cho-nguoi-moi-bat-dau',
  'dau-tu-hieu-qua': 'https://www.dsc.com.vn/kien-thuc/dau-tu-hieu-qua',
  'phan-tich-co-ban': 'https://www.dsc.com.vn/kien-thuc/phan-tich-co-ban',
  'phan-tich-ky-thuat': 'https://www.dsc.com.vn/kien-thuc/phan-tich-ky-thuat'
};

const mongoURI = 'mongodb+srv://finbud123:finbud123@cluster0.8mbj0ln.mongodb.net/development?retryWrites=true&w=majority';

const connectToMongoDB = async () => {
  return mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
  }).then(() => console.log("✅ MongoDB connected"))
    .catch(err => {
      console.error("❌ Error connecting to MongoDB:", err.message);
      throw err;
    });
};

async function disconnectFromMongoDB() {
  try {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ MongoDB disconnection error:', err);
  }
}

async function randomDelay(min = 2000, max = 5000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`⏳ Waiting ${delay / 1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function checkForAntiBot(page) {
  try {
    return await page.evaluate(() =>
      document.body.innerText.includes('Access Denied') ||
      document.body.innerText.includes('Bot detected')
    );
  } catch {
    return false;
  }
}

async function scrapeArticles() {
  let browser;
  try {
    console.log('🚀 Starting section-based course scraper...');
    await connectToMongoDB();

    // Delete all existing courses
    await Course.deleteMany({});
    console.log('🧹 Cleared all existing Course entries');

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36'
    );

    for (const [label, sectionUrl] of Object.entries(SECTION_URLS)) {
      console.log(`\n📚 Scraping section: ${label}`);
      await randomDelay();
      await page.goto(sectionUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      const isBlocked = await checkForAntiBot(page);
      if (isBlocked) {
        console.log('⚠️ Blocked by anti-bot on section page.');
        continue;
      }

      const articleCards = await page.evaluate((label) => {
        const cards = Array.from(document.querySelectorAll('.UIFQIDBMHE'));
        return cards.map(card => {
          const anchor = card.querySelector('a');
          const img = card.querySelector('img');
          const descEl = card.querySelector('.FCQNZMBSBW');
          const description = descEl ? descEl.innerText.trim() : '';
          const viewEl = card.querySelector('.ASNPXFEMPX')
          const view = viewEl ? viewEl.innerText.trim() : null;

          return {
            title: anchor?.innerText.trim() || '',
            url: anchor?.href || '',
            img: img?.src || '',
            description,
            category: label,
            view
          };
        }).filter(a => a.url); // Remove cards with missing URLs
      }, label);  // Pass the current section label

      console.log(`🔗 Found ${articleCards.length} articles in "${label}"`);

      for (const article of articleCards) {
        try {
          const exists = await Course.findOne({ url: article.url });
          if (exists) {
            console.log('⏩ Already exists, skipping:', article.url);
            continue;
          }

          const course = new Course({
            ...article,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          await course.save();
          console.log(`✅ Saved course: ${article.title}`);

        } catch (err) {
          console.error(`❌ Error saving article ${article.url}:`, err.message);
        }
      }
    }

  } catch (err) {
    console.error('❌ Scraper failed:', err);
  } finally {
    if (browser) await browser.close();
    await disconnectFromMongoDB();
    console.log('\n🎉 Scraping complete!');
  }
}

scrapeArticles().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
