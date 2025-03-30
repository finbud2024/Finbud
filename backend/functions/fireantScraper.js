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

  console.log('🌐 Opening FireAnt with session cookies...');
  await page.goto(FIREANT_URL, { waitUntil: 'networkidle2' });

  // Wait for post content to appear
  await page.waitForSelector('div.leading-7', { timeout: 10000 });

  // Scroll to load more posts
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Expand "...Thêm" buttons to show full post body
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.innerText.includes('Thêm')) btn.click();
    });
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Extract post info
  const posts = await page.evaluate(() => {
    const postElements = Array.from(document.querySelectorAll('div.leading-7'));
    return postElements.map(post => {
      const wrapper = post.closest('article') || post.closest('[data-author]') || post.parentElement;

      const author = wrapper?.querySelector('a[href*="/thanh-vien/"]')?.innerText?.trim() || 'Unknown';
      const avatar = wrapper?.querySelector('img')?.src || '';
      const time = wrapper?.querySelector('time')?.getAttribute('datetime') || '';
      const body = post?.innerText?.trim() || '';

      const commentEls = wrapper?.querySelectorAll('div.leading-8') || [];
      const comments = Array.from(commentEls).map(c => c.innerText.trim()).filter(Boolean);

      return { author, avatar, body, time, comments };
    });
  });

  // Save to file
  const filename = 'fireant-posts.json';
  await fs.writeFile(filename, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`Scraped ${posts.length} posts. Saved to ${filename}`);

  await browser.close();
}

scrapeFireAnt().catch(console.error);
