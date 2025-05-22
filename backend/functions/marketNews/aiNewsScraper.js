import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {
  pool,
  articleExists,
  insertArticle,
} from "../../Database Schema/aiNews/db.js";
import dotenv from "dotenv";
import { URL } from "url";

puppeteer.use(StealthPlugin());
dotenv.config();

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
];

async function randomDelay(min = 3000, max = 6000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`⏳ Waiting ${delay / 1000} seconds...`);
  await new Promise((res) => setTimeout(res, delay));
}

async function checkForAntiBot(page) {
  return await page.evaluate(() => {
    const text = document.body.innerText.toLowerCase();
    return (
      text.includes("captcha") ||
      text.includes("robot") ||
      text.includes("access denied")
    );
  });
}

export async function crawlFireAnt() {
  let browser = null;
  const insertedArticles = [];
  try {
    console.log("🚀 Launching browser...");
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      userAgents[Math.floor(Math.random() * userAgents.length)]
    );
    await page.goto("https://fireant.vn/bai-viet", {
      waitUntil: "networkidle2",
    });

    const collectedLinks = new Set();
    let stop = false;

    while (!stop) {
      const links = await page.evaluate(() => {
        const anchors = Array.from(
          document.querySelectorAll('a[href^="/bai-viet/"]')
        );
        return anchors.map(
          (a) => `https://fireant.vn${a.getAttribute("href")}`
        );
      });

      for (const link of links) {
        if (collectedLinks.has(link)) continue;
        collectedLinks.add(link);
        console.log(link);
        if (collectedLinks.size >= 7) {
          stop = true;
          break;
        }

        const exists = await articleExists(link);
        if (exists) {
          console.log(`🛑 Already exists. Stopping at ${link}`);
          stop = true;
          break;
        }
      }

      const prevHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((r) => setTimeout(r, 1500));
      const newHeight = await page.evaluate(() => document.body.scrollHeight);
      if (newHeight === prevHeight) break;
    }

    const linksToCrawl = Array.from(collectedLinks);
    console.log(`🔗 Found ${linksToCrawl.length} new article links.`);

    for (const url of linksToCrawl) {
      const articlePage = await browser.newPage();
      await articlePage.setUserAgent(
        userAgents[Math.floor(Math.random() * userAgents.length)]
      );

      try {
        await articlePage.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
      } catch (err) {
        console.log(`⚠️ Timeout loading ${url}, skipping...`);
        await articlePage.close();
        continue;
      }

      if (await checkForAntiBot(articlePage)) {
        console.log("⚠️ Bot detected. Skipping...");
        await articlePage.close();
        continue;
      }

      const data = await articlePage.evaluate(() => {
        const getText = (sel) =>
          document.querySelector(sel)?.textContent?.trim() || null;
        const getAttr = (sel, attr) =>
          document.querySelector(sel)?.getAttribute(attr) || null;

        const title = getText("div.text-3xl.font-semibold");
        const contentEl = document.querySelector("#post_content");

        let content = "";
        const imageUrls = [];
        let author = null;
        let originalUrl = null;

        if (contentEl) {
          const blocks = Array.from(contentEl.children);
          const lastBlock = blocks[blocks.length - 1];
          const lastLink = lastBlock?.querySelector('a[target="_blank"]');
          const isAuthorBlock =
            lastLink && lastLink.innerText?.trim().endsWith("Link gốc");

          if (isAuthorBlock) {
            author = lastLink.innerText.trim();
            originalUrl = lastLink.getAttribute("href");
            blocks.pop();
          }

          blocks.forEach((block) => {
            const walker = document.createTreeWalker(
              block,
              NodeFilter.SHOW_ALL,
              null,
              false
            );
            let blockText = "";
            while (walker.nextNode()) {
              const node = walker.currentNode;
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.tagName === "IMG"
              ) {
                const src =
                  node.getAttribute("src") || node.getAttribute("data-src");
                if (src) {
                  imageUrls.push(src);
                  blockText += "[[IMAGE]] ";
                }
              } else if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                if (text) blockText += text + " ";
              }
            }
            if (blockText.trim()) content += blockText.trim() + "\n\n";
          });
        }

        const publishedAt =
          getAttr("time", "datetime") || new Date().toISOString();

        return {
          title,
          content: content.trim() || null,
          imageUrls,
          imageUrl: imageUrls[0] || null,
          originalUrl,
          fireantUrl: window.location.href,
          author,
          publishedAt,
        };
      });

      // Fix: Add source extraction from originalUrl here in Node.js scope
      data.source = data.originalUrl
        ? new URL(data.originalUrl).hostname.replace(/^www\./, "")
        : "fireant.vn";

      if (
        !data.title ||
        !data.content ||
        data.content === "[[IMAGE]]" ||
        !data.originalUrl
      ) {
        console.log(
          `❌ Invalid content or missing original_url. Skipping ${url}`
        );
        await articlePage.close();
        continue;
      }

      try {
        const articleId = await insertArticle(data);
        console.log(`✅ Saved: ${data.title}`);
        insertedArticles.push({
          id: articleId,
          title: data.title,
          content: data.content,
        });
      } catch (err) {
        if (err.code === "23505") {
          console.log(`⚠️ Skipped duplicate during insert: ${data.fireantUrl}`);
        } else {
          console.error(`❌ Failed to insert: ${data.title}`, err);
        }
      }

      await articlePage.close();
      await randomDelay();
    }

    console.log("🎉 Done crawling FireAnt!");
    return insertedArticles;
  } catch (err) {
    console.error("❌ Error during crawling:", err);
    return insertedArticles;
  } finally {
    if (browser) await browser.close();
  }
}
