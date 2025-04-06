import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('🌐 Navigate to login page...');
  await page.goto('https://fireant.vn/dang-nhap', { waitUntil: 'domcontentloaded' });

  // 🧠 YOU log in manually (within browser)
  console.log('⏳ Please log in manually...');
  await new Promise(resolve => setTimeout(resolve, 1000 * 60)); // wait 60s

  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
  console.log('✅ Session cookies saved to cookies.json');

  await browser.close();
})();
