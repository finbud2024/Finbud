import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import vietStockOverview from '../Database Schema/vietStockOverview.js';
import { fileURLToPath } from 'url';
import {
    getRandomUserAgent
} from '../utils/scraperUtils.js';

chromium.use(stealth());

// Get the directory path of the current module - with fallback
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  // Fallback for environments where import.meta is not available
  __dirname = path.resolve();
}
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

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
        await page.goto("https://finance.vietstock.vn/du-lieu-vi-mo", { 
            timeout: 60000 
        });

        console.log("Waiting for investor cards to load...");
        console.log("Waiting for investor cards to load...");
        await page.waitForSelector('div.table-responsive.pos-relative', { timeout: 60000 });

        const data = await page.evaluate(() => {
            const results = [];
        
            // Select all tables that match the given class
            const tables = document.querySelectorAll('table.table.table-striped.table-hover.table-bordered.responsive');
        
            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr'); // only data rows
        
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const rowData = Array.from(cells).map(cell => cell.innerText.trim());
                    results.push(
                        {
                            'ordinalNumber': rowData[0],
                            'indicator': rowData[1],  
                            'unit': rowData[2],
                            'latestData': {
                                'chart': rowData[3],
                                'value': parseFloat(rowData[4].replace(/,/g, '')) // Convert to number
                            },
                            'chartUrl': rowData[5] // Assuming this is the URL for the chart
                        }
                    );
                });
            });
        
            return results;
        });

        return data;

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
        const result = await scrapeTopInvestors();

        await vietStockOverview.deleteMany({}); // Clear existing data before inserting new data

        await vietStockOverview.insertMany(result);

        console.log('Data: ', result);
    } catch (error) {
        console.error("Error in top investors scraper:", error);
    } finally {
        await disconnectFromMongoDB();
    }
}

export const handler = async (event, context) => {
    try {
        await runScrapers();
        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Scrapping completed successfully'})
        }
    }
    catch (error) {
        console.log('Scraper failed: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Scraper failed', error: err.message }),
        }
    }
};

console.log('Starting scraper...');
runScrapers().catch(err => {
  console.error('Scraper failed:', err);
  process.exit(1);
});