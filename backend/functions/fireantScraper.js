import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs/promises';
import path from 'path';

puppeteer.use(StealthPlugin());

const FIREANT_URL = 'https://fireant.vn/cong-dong/moi-nhat';
const COOKIES_PATH = path.resolve('./cookies.json');

async function scrapeFireAnt() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Load session cookies
  const cookies = JSON.parse(await fs.readFile(COOKIES_PATH, 'utf-8'));
  await page.setCookie(...cookies);
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🌐 Opening FireAnt...');
  await page.goto(FIREANT_URL, { waitUntil: 'networkidle2' });

  // Wait for at least one post to show up
  await page.waitForSelector('div[data-index]', { timeout: 10000 });

  // Scroll and fetch until 100+ posts are visible
  let previousCount = 0;
  let tries = 0;
  const maxPosts = 100;

  while (tries < 40) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Expand truncated content
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(btn => {
        if (btn.innerText.includes('Thêm')) btn.click();
      });
    });

    const currentCount = await page.$$eval('div[data-index]', els => els.length);
    if (currentCount > previousCount) {
      previousCount = currentCount;
      tries = 0;
    } else {
      tries++;
    }

    if (currentCount >= maxPosts) break;
  }

  // Extract posts and comments
  const posts = await page.evaluate(() => {
    const postDivs = Array.from(document.querySelectorAll('div[data-index]'));
    return postDivs.map(div => {
      const wrapper = div;

      const author = wrapper.querySelector('a[href*="/thanh-vien/"]')?.innerText.trim() || 'Unknown';
      const avatar = wrapper.querySelector('img')?.src || '';
      const time = wrapper.querySelector('time')?.getAttribute('datetime') || '';
      const body = wrapper.querySelector('div.leading-7')?.innerText.trim() || '';

      const commentEls = wrapper.querySelectorAll('div.leading-8');
      const comments = Array.from(commentEls).map(c => c.innerText.trim()).filter(Boolean);

      return { author, avatar, body, time, comments };
    });
  });

  const filename = 'fireant-posts.json';
  await fs.writeFile(filename, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`Scraped ${posts.length} posts. Saved to ${filename}`);

  await browser.close();
}

scrapeFireAnt().catch(console.error);
