import puppeteer from 'puppeteer'; 
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import puppeteerExtra from 'puppeteer-extra';

puppeteerExtra.use(StealthPlugin());


async function disconnectFromMongoDB() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
}

async function scrapeVoz() {
  const browser = await puppeteerExtra.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(getRandomUserAgent());
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🌐 Opening VOZ...');
  await page.goto('https://voz.vn/f/tien-%C4%91ien-tu.94/', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('.structItem-title');

  const threads = await page.$$eval('.structItem-title a[data-preview-url]', (links) =>
    links.slice(0, 5).map(link => ({
      url: link.href,
      title: link.innerText.trim(),
    }))
  );

  const results = [];

  for (const thread of threads) {
    console.log(`Scraping thread: ${thread.title}`);
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

    const comments = await threadPage.$$eval('.message', nodes =>
      nodes.slice(1, 6).map(node => {
        const body = node.querySelector('.bbWrapper')?.innerText || '';
        const author = node.querySelector('h4 a.username')?.innerText || 'Unknown';
        const time = node.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
        const avatar = node.querySelector('.avatar img')?.src || '';
        return { author, body, time, avatar };
      })
    );

    results.push({
      title: thread.title,
      threadUrl: thread.url,
      author: postData.author,
      avatar: postData.avatar,
      body: postData.body,
      createdAt: postData.time,
      comments,
    });

    await threadPage.close();
  }

  const outputPath = path.join('./', 'vozScrapedData.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Scraped ${results.length} threads. Saved to ${outputPath}`);

  await browser.close();
}

scrapeVoz().catch(console.error);
