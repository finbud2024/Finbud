import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import vietStockFDI from '../Database Schema/vietStockFDI.js';
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

async function scrapeVietStock() {
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
        console.log("Navigating to Viet Stock page...");
        await page.goto("https://finance.vietstock.vn/du-lieu-vi-mo/50/fdi", { 
            timeout: 60000 
        });

        console.log("Waiting for Viet Stock to load...");
        
        const activeFilters = await page.evaluate(() => {

            const filters = [];
            const dropdowns = document.querySelectorAll('div.form-group.fg-2');
            dropdowns.forEach(dropdown => {
                const select = dropdown.querySelector('select.form-control');
                if (!select) return [];
                const optionElements = select.querySelectorAll('option');
                const optionTexts = Array.from(optionElements).map(option => option.value);
                filters.push(optionTexts);
            });

            return filters;
        });

        const filters = activeFilters;

        console.log(filters);

    
        for (let ffrom = 0; ffrom < filters[1].length; ffrom++) {
            for (let ffromYear = 0; ffromYear < filters[2].length - 19; ffromYear++) {
                for (let ftoYear = 0; ftoYear <= ffromYear; ftoYear++) {
                    for (let fto = 0; fto < filters[3].length; fto++) {

                        if (ffromYear === ftoYear) {
                            if (ffrom > fto) {
                                break;
                            }
                        }

                        await page.waitForSelector('select[name="type"]');
                        await page.waitForSelector('select[name="from"]');
                        await page.waitForSelector('select[name="fromYear"]');
                        await page.waitForSelector('select[name="to"]');
                        await page.waitForSelector('select[name="toYear"]');
                        
                        await page.selectOption('select[name="type"]', {value: filters[0][0]});
                        await page.selectOption('select[name="from"]', {value: filters[1][ffrom]});
                        await page.selectOption('select[name="fromYear"]', {value: filters[2][ffromYear]});
                        await page.selectOption('select[name="to"]', {value: filters[3][fto]});
                        await page.selectOption('select[name="toYear"]', {value: filters[4][ftoYear]});

                        console.log('***From Month: ', filters[1][ffrom]);
                        console.log('From Year: ', filters[2][ffromYear]);
                        console.log('To Month: ', filters[3][fto]);
                        console.log('To Year: ', filters[4][ftoYear]);

                        await page.click('button.btn.bg.m-l');
        
                        await page.waitForSelector('div.table-responsive.pos-relative', { timeout: 120000 });
                    
                        const data = await page.evaluate(() => {
                            const results = [];
                            let headers = [];

                            // Select all tables that match the given class
                            const tables = document.querySelectorAll('table.table.table-hover.table-bordered.responsive.sticky2f');
                        
                            tables.forEach(table => {
                                const rows = table.querySelectorAll('tbody tr'); // only data rows
                        
                                rows.forEach(row => {
                                    const cells = row.querySelectorAll('td');
                                    const rowData = Array.from(cells).map(cell => cell.innerText.trim());
                                    results.push(
                                        rowData
                                    );
                                });
                
                                const heads = table.querySelectorAll('thead tr');
                                heads.forEach(head => {
                                    const cells = head.querySelectorAll('th.text-right');
                                    const headData = Array.from(cells).map(cell => cell.innerText.trim());
                                    headers = headData;
                                });
                            });
                
                            return [headers, results];
                        });

                        processData('tháng', data, filters[1][ffrom], filters[2][ffromYear], filters[3][fto], filters[4][ftoYear]);
                    }
                }
            }
        }


        for (let fYear = 0; fYear < filters[2].length; fYear++) {
            for (let toYear = 0; toYear <= fYear; toYear++) {

                await page.waitForSelector('select[name="type"]');
                await page.waitForSelector('select[name="fromYear"]');
                await page.waitForSelector('select[name="toYear"]');

                await page.selectOption('select[name="type"]', {value: filters[0][1]});
                await page.selectOption('select[name="fromYear"]', {value: filters[2][fYear]});
                await page.selectOption('select[name="toYear"]', {value: filters[4][toYear]});

                console.log('***From Year: ', filters[2][fYear]);
                console.log('To Year: ', filters[4][toYear]);

                await page.click('button.btn.bg.m-l');

                await page.waitForSelector('div.table-responsive.pos-relative', { timeout: 120000 });
            
                const data = await page.evaluate(() => {
                    const results = [];
                    let headers = [];

                    // Select all tables that match the given class
                    const tables = document.querySelectorAll('table.table.table-hover.table-bordered.responsive.sticky2f');
                
                    tables.forEach(table => {
                        const rows = table.querySelectorAll('tbody tr'); // only data rows
                
                        rows.forEach(row => {
                            const cells = row.querySelectorAll('td');
                            const rowData = Array.from(cells).map(cell => cell.innerText.trim());
                            results.push(
                                rowData
                            );
                        });
        
                        const heads = table.querySelectorAll('thead tr');
                        heads.forEach(head => {
                            const cells = head.querySelectorAll('th.text-right');
                            const headData = Array.from(cells).map(cell => cell.innerText.trim());
                            headers = headData;
                        });
                    });
        
                    return [headers, results];
                });

                processData('năm', data, null, filters[2][fYear], null, filters[4][toYear]);

            }
        }

    } catch (error) {
        console.error('Error scraping Viet Stock:', error);
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

function processData(type, data, fromMonth, fromYear, toMonth, toYear) {
    const headers = data[0];
    const result = data[1];

    console.log('Result: ', result);

    if (type === 'năm') {
        vietStockFDI.insertOne({
            xem_theo: type,
            fromYear,
            toYear,
            headers,
            data: result
        });
        return;
    }

    vietStockFDI.insertOne({
        xem_theo: type,
        fromMonth,
        fromYear,
        toMonth,
        toYear,
        headers,
        data: result
    });
}

async function runScrapers() {
    console.log("🚀 Starting Viet Stock Scraper...");

    try {

        await connectToMongoDB();

        await vietStockFDI.deleteMany({});

        await scrapeVietStock();

        //console.log(fdiData);
        

    } catch (error) {
        console.error("Error in Viet Stock scraper:", error);
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