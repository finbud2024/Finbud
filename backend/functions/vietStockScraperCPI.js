import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import vietStockCPI from '../Database Schema/vietStockCPI.js';
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
        await page.goto("https://finance.vietstock.vn/du-lieu-vi-mo/52/cpi", { 
            timeout: 60000 
        });

        console.log("Waiting for investor cards to load...");
        
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

        // Xem theo: Thángháng

        await page.waitForSelector('select[name="type"]');
        await page.waitForSelector('select[name="from"]');
        await page.waitForSelector('select[name="fromYear"]');
        await page.waitForSelector('select[name="to"]');
        await page.waitForSelector('select[name="toYear"]');

        await page.selectOption('select[name="type"]', {value: filters[0][0]});
        await page.selectOption('select[name="from"]', {value: filters[1][0]});
        await page.selectOption('select[name="fromYear"]', {value: filters[2][filters[2].length - 1]});
        await page.selectOption('select[name="to"]', {value: filters[3][5]});
        await page.selectOption('select[name="toYear"]', {value: filters[4][0]});
        
        await page.click('button.btn.bg.m-l');

        await page.waitForSelector('div.table-responsive.pos-relative', { timeout: 120000 });
          
        const data_month = await page.evaluate(() => {
            const results = [];
            let headers = [];
        
            // Select all tables that match the given class
            const tables = document.querySelectorAll('table.table.table-hover.table-bordered.responsive.sticky2f.table-striped');
        
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

        processData('tháng', data_month);

        // Xem theo: Nămăm

        await page.waitForSelector('select[name="type"]');
        await page.waitForSelector('select[name="from"]');
        await page.waitForSelector('select[name="fromYear"]');
        await page.waitForSelector('select[name="to"]');
        await page.waitForSelector('select[name="toYear"]');

        await page.selectOption('select[name="type"]', {value: filters[0][1]});
        await page.selectOption('select[name="fromYear"]', {value: filters[2][filters[2].length - 1]});
        await page.selectOption('select[name="toYear"]', {value: filters[4][0]});
        
        await page.click('button.btn.bg.m-l');

        await page.waitForSelector('div.table-responsive.pos-relative', { timeout: 120000 });
        
        const data_year = await page.evaluate(() => {
            const results = [];
            let headers = [];
        
            // Select all tables that match the given class
            const tables = document.querySelectorAll('table.table.table-hover.table-bordered.responsive.sticky2f.table-striped');
        
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

        processData('năm', data_year);


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

let cpiData = []

function processData(type, data) {
    const headers = data[0];
    const result = data[1];
    for (let i = 0; i < headers.length; i++) {
        let month = null;
        let year = null;
        if (type == "tháng") {
            [month, year] = headers[i].split("/");
        }
        else { year = headers[i]; }

        let value = [];

        for (let index = 0; index < result.length; index += 1) {
            value.push({
                chi_tieu: result[index][0],
                don_vi: result[index][1],
                gia_tri: result[index][i + 2]
            })
        }

        if (type == 'tháng') {
            value.push({chi_tieu: result[14][0], don_vi: result[14][1], gia_tri: result[14][i + 2]});
        }

        const temp = {            
            xem_theo: type,
            month,
            year,
            value
        }

        cpiData.push(temp);
    }
}

async function runScrapers() {
    console.log("🚀 Starting Top Investors Scraper...");

    try {

        await connectToMongoDB();

        await scrapeTopInvestors();

        //console.log(cpiData);

        await vietStockCPI.deleteMany({});

        await vietStockCPI.insertMany(cpiData);
        

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