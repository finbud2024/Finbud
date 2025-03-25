import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import Investor from "../Database Schema/TopInvestors.js";
import { 
    getRandomUserAgent,
    connectToMongoDB,
    disconnectFromMongoDB,
    saveToDatabase 
} from '../utils/scraperUtils.js';
import { fileURLToPath } from 'url';

chromium.use(stealth());

let allInvestors = [];

async function scrapeTopInvestors() {
    const browser = await chromium.launch({ 
        headless: true,
        args: [
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080',
        ]
    });
    const context = await browser.newContext({
        userAgent: getRandomUserAgent(),
        viewport: { width: 1920, height: 1080 },
        timeout: 60000
    });
    const page = await context.newPage();

    try {
        console.log("Navigating to super-investors page...");
        await page.goto("https://finchat.io/super-investors/", { 
            timeout: 60000 
        });

        console.log("Waiting for investor cards to load...");
        await page.waitForSelector('li.relative.inline-flex', { timeout: 60000 });

        const investors = await page.evaluate(() => {
            const results = [];
            const cards = document.querySelectorAll('li.relative.inline-flex.w-full.max-w-\\[270px\\].flex-col.items-center.justify-start.self-stretch.rounded-xl.text-center.sm\\:w-\\[270px\\].sm\\:min-w-\\[270px\\]');

            cards.forEach(card => {
                try {
                    const name = card.querySelector('h4.mantine-Title-root')?.textContent.trim();
                    const company = card.querySelector('p.mantine-Text-root[data-size="sm"]')?.textContent.trim();
                    const profileImage = card.querySelector('img')?.src;

                    const metrics = {};
                    card.querySelectorAll('li.mantine-List-item').forEach(metric => {
                        const label = metric.querySelector('p[style*="font-weight:600"]')?.textContent.trim().replace(':', '');
                        const value = metric.querySelectorAll('p')[1]?.textContent.trim();
                        if (label) metrics[label] = value;
                    });

                    const stockPositions = Array.from(card.querySelectorAll('a.mantine-Button-root'))
                        .map(button => button.querySelector('.mantine-Button-label')?.textContent.trim())
                        .filter(Boolean);

                    results.push({
                        name,
                        company,
                        profileURL: profileImage,
                        marketValue: metrics['Market Value'],
                        holdingPeriod: metrics['Holding Period'],
                        positions: metrics['Nr. of positions'],
                        turnover: metrics['Turnover'],
                        stocks: stockPositions
                    });
                } catch (error) {
                    console.error('Error processing investor card:', error);
                }
            });

            return results;
        });

        console.log(`Found ${investors.length} investors`);
        return investors;

    } catch (error) {
        console.error('Error scraping top investors:', error);
        try {
            await page.screenshot({ path: 'error-screenshot.png' });
            console.log('Error screenshot saved as error-screenshot.png');
        } catch (screenshotError) {
            console.error('Failed to take error screenshot:', screenshotError);
        }
        return [];
    } finally {
        await browser.close();
    }
}

async function runScrapers() {
    console.log("🚀 Starting Top Investors Scraper...");

    try {
        await connectToMongoDB();
        const investors = await scrapeTopInvestors();
        
        if (investors && investors.length > 0) {
            await saveToDatabase(Investor, investors);
        }
    } catch (error) {
        console.error("Error in top investors scraper:", error);
    } finally {
        await disconnectFromMongoDB();
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runScrapers().catch(console.error);
}

export { scrapeTopInvestors, runScrapers };
