import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import mongoose from "mongoose";
import Compare from "../../Database_Schema/finance/FCompare.js";
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';


dotenv.config();
chromium.use(stealth());

const connectToMongoDB = async () => {
    try {
        console.log("🔍 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("✅ Connected to MongoDB!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

async function saveToDatabase(events) {
    if (!events || events.length === 0) {
        console.log("⚠️ No events to save.");
        return;
    }

    console.log(`💾 Attempting to save ${events.length} events to MongoDB...`);

    for (let event of events) {
        try {
            // const existingEvent = await Compare.findOne({ bank: event.bank });
            // if (existingEvent) {
            //     console.log(`🔄 Skipping duplicate: ${event.bank}`);
            //     continue;
            // }

            // const newEvent = new Compare(event);
            // await newEvent.save();
            await Compare.findOneAndUpdate(
                { bank: event.bank },   // Match by bank
                { $set: event },        // Replace with latest event info
                { upsert: true, new: true }
            );
            console.log(`✅ Inserted: ${event.bank}`);
        } catch (error) {
            console.error("❌ Error saving event:", error);
        }
    }
}

async function scrapeVietcombank() {
    console.log("🔄 Starting to scrape Vietcombank interest rate and issuance fee...");

    const interestRateUrl = 'https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/KHCN---Lai-suat';
    const issuanceFeeUrl = 'https://www.vietcombank.com.vn/vi-VN/KHCN/SPDV/The/Debit_VCB-Connect24#dataIndex=3';
    const loanTermUrl = 'https://www.vietcombank.com.vn/vi-VN/KHCN/SPDV/Vay/Vay-tin-chap-doi-voi-nguoi-lao-dong#dataIndex=0';

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--disable-http2',
            '--disable-web-security',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1920x1080',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        // Scrape interest rate
        console.log("📊 Scraping interest rate...");
        await page.goto(interestRateUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const rate = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tbody tr');
            for (let row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2 && cells[0].innerText.trim() === '12 tháng') {
                    return cells[1].innerText.trim();
                }
            }
            return null;
        });

        // Scrape issuance fee
        console.log("💳 Scraping issuance fee...");
        await page.goto(issuanceFeeUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const issuanceFee = await page.evaluate(() => {
            const listItems = Array.from(document.querySelectorAll('li'));
            for (let item of listItems) {
                const text = item.innerText.trim();
                if (text.includes('Thẻ hình thức vật lý')) {
                    const match = text.match(/([\d.,]+)\s*VND/);
                    return match ? match[1] + ' VND' : null;
                }
            }
            return null;
        });


        // Scrape max loan term 
        console.log("📄 Scraping max loan term and loan amount limit...");
        await page.goto(loanTermUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const maxLoanTerm = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.content-item'));
            for (let item of items) {
                const label = item.querySelector('p.name')?.innerText.trim();
                const value = item.querySelector('.document')?.innerText.trim();
                if (label === 'Thời gian vay tối đa') {
                    return value;
                }
            }
            return null;
        });

        if (rate || issuanceFee) {
            const rateEvent = {
                bank: "Vietcombank",
                rate: rate,
                issuanceFee: issuanceFee,
                maxLoanTerm: maxLoanTerm,
                createdAt: new Date()
            };

            console.log("✅ Scraped data:", rateEvent);
            return rateEvent;
        } else {
            console.log("❌ No data found");
            return null;
        }
    } catch (error) {
        console.error("❌ Error during scraping:", error);
        return null;
    } finally {
        await browser.close();
    }
}

async function scrapeVietinbank() {
    console.log("🔄 Starting to scrape VietinBank interest rate and issuance fee...");

    const interestRateUrl = 'https://www.vietinbank.vn/ca-nhan/cong-cu-tien-ich/lai-suat-khcn';
    const issuanceFeeUrl = 'https://www.vietinbank.vn/ca-nhan/cong-cu-tien-ich/bieu-phi-va-bieu-mau/bieu-phi-dich-vu-ap-dung-cho-san-pham-the-tin-dung-quoc-te-40-html';

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--disable-http2',
            '--disable-web-security',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1920x1080',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        // Scrape interest rate
        console.log("📊 Scraping interest rate...");
        await page.goto(interestRateUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const rate = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tbody tr');
            for (let row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2 && cells[0].innerText.trim() === '12 tháng') {
                    return cells[1].innerText.trim();
                }
            }
            return null;
        });

        // Scrape issuance fee
        console.log("💳 Scraping issuance fee...");
        await page.goto(issuanceFeeUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const issuanceFee = await page.evaluate(() => {
            const spans = document.querySelectorAll('td span');
            for (let span of spans) {
                const text = span.innerText.trim();
                if (/^\d{1,3}(\.\d{3})*\s*VND$/.test(text)) {
                    return text;
                }
            }
            return null;
        });

        const maxLoanTerm = "60 tháng"; // Placeholder until a reliable source is added

        if (rate || issuanceFee) {
            const rateEvent = {
                bank: "VietinBank",
                rate: rate,
                issuanceFee: issuanceFee,
                maxLoanTerm: maxLoanTerm,
                createdAt: new Date()
            };

            console.log("✅ Scraped data:", rateEvent);
            return rateEvent;
        } else {
            console.log("❌ No data found");
            return null;
        }
    } catch (error) {
        console.error("❌ Error during scraping VietinBank:", error);
        return null;
    } finally {
        await browser.close();
    }
}


async function scrapeAgribank() {
    console.log("🔄 Starting to scrape Agribank interest rate...");

    const interestRateUrl = 'https://www.agribank.com.vn/vn/lai-suat';

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--disable-http2',
            '--disable-web-security',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1920x1080',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        // Scrape interest rate
        console.log("📊 Scraping interest rate from Agribank...");
        await page.goto(interestRateUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));


        const rate = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tbody tr');
            for (let row of rows) {
                const cells = row.querySelectorAll('td');
                // if (cells.length >= 2 && cells[0].innerText.trim() === '12 tháng') {
                if (cells.length >= 2 && cells[0].innerText.trim().toLowerCase().includes('12 tháng')){

                    return cells[1].innerText.trim();
                }
            }
            return null;
        });

        const issuanceFee = null; // Not listed on the provided page
        const maxLoanTerm = null; // Not listed either

        if (rate) {
            const rateEvent = {
                bank: "Agribank",
                rate: rate,
                issuanceFee: issuanceFee,
                maxLoanTerm: maxLoanTerm,
                createdAt: new Date()
            };

            console.log("✅ Scraped data:", rateEvent);
            return rateEvent;
        } else {
            console.log("❌ No interest rate data found for Agribank");
            return null;
        }
    } catch (error) {
        console.error("❌ Error during scraping Agribank:", error);
        return null;
    } finally {
        await browser.close();
    }


}



export async function scrapeBIDV() {
    const interestRateUrl = 'https://techcombank.com/thong-tin/blog/lai-suat-tiet-kiem';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(interestRateUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const rate = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tbody tr');
            for (let row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5 && cells[0].innerText.includes('BIDV')) {
                    return cells[4].innerText.trim(); // Assuming the 5th column is for 12 months
                }
            }
            return null;
        });


        if (!rate) {
            console.error("BIDV rate not found.");
            return null;
        }
        const issuanceFee = null; // Not listed on the provided page
        const maxLoanTerm = null; // Not listed either

        const result = {
            bank: "BIDV",
            rate: rate,
            issuanceFee: issuanceFee,
            maxLoanTerm: maxLoanTerm,
            createdAt: new Date()
        };

        console.log("Scraped BIDV data:", result);
        return result;
    } catch (error) {
        console.error("Error BIDV Techcombank:", error);
        return null;
    } finally {
        await browser.close();
    }
}




 async function scrapeMB() {
    const interestRateUrl = 'https://techcombank.com/thong-tin/blog/lai-suat-tiet-kiem';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(interestRateUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const rate = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tbody tr');
            for (let row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5 && cells[0].innerText.includes('MBBank')) {
                    return cells[4].innerText.trim(); // Assuming the 5th column is for 12 months
                }
            }
            return null;
        });


        if (!rate) {
            console.error("MB rate not found.");
            return null;
        }
        const issuanceFee = null; // Not listed on the provided page
        const maxLoanTerm = null; // Not listed either

        const result = {
            bank: "MBBank",
            rate: rate,
            issuanceFee: issuanceFee,
            maxLoanTerm: maxLoanTerm,
            createdAt: new Date()
        };

        console.log("Scraped MBBank data:", result);
        return result;
    } catch (error) {
        console.error("Error MBBank Techcombank:", error);
        return null;
    } finally {
        await browser.close();
    }
 }




 async function scrapeTechcom() {
    const interestRateUrl = 'https://techcombank.com/thong-tin/blog/lai-suat-tiet-kiem';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(interestRateUrl, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const rate = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tbody tr');
            for (let row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5 && cells[0].innerText.includes('Techcombank')) {
                    return cells[4].innerText.trim(); // Assuming the 5th column is for 12 months
                }
            }
            return null;
        });


        if (!rate) {
            console.error("Techcombank rate not found.");
            return null;
        }
        const issuanceFee = null; // Not listed on the provided page
        const maxLoanTerm = null; // Not listed either

        const result = {
            bank: "Techcombank",
            rate: rate,
            issuanceFee: issuanceFee,
            maxLoanTerm: maxLoanTerm,
            createdAt: new Date()
        };

        console.log("Scraped Techcombank data:", result);
        return result;
    } catch (error) {
        console.error("Error scraping Techcombank:", error);
        return null;
    } finally {
        await browser.close();
    }
}



// 🔁 Still keeping the runScrapers function:
async function runScrapers() {
    console.log("🚀 Starting Interest Rate Scraper...");

    await connectToMongoDB();

    const vietcombankEvent = await scrapeVietcombank();
    const vietinbankEvent = await scrapeVietinbank();
    const agribankEvent = await scrapeAgribank();
    const BIDVEvent = await scrapeBIDV();
    const MBEvent = await scrapeMB();
    const TechEvent = await scrapeTechcom();

    const eventsToSave = [];

    if (vietcombankEvent) {
        eventsToSave.push(vietcombankEvent);
    } else {
        console.log("⚠️ No data to save for Vietcombank.");
    }

    if (vietinbankEvent) {
        eventsToSave.push(vietinbankEvent);
    } else {
        console.log("⚠️ No data to save for Vietinbank.");
    }

    if (agribankEvent) {
        eventsToSave.push(agribankEvent);
    } else {
        console.log("⚠️ No data to save for Agribank.");
    }

    if (BIDVEvent) {
        eventsToSave.push(BIDVEvent);
    } else {
        console.log("⚠️ No data to save for BIDV.");
    }

    if (MBEvent) {
        eventsToSave.push(MBEvent);
    } else {
        console.log("⚠️ No data to save for MB.");
    }

    if (TechEvent) {
        eventsToSave.push(TechEvent);
    } else {
        console.log("⚠️ No data to save for Techcombank.");
    }

    if (eventsToSave.length > 0) {
        await saveToDatabase(eventsToSave);
    } else {
        console.log("❌ No interest rate data to save.");
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
}


runScrapers().catch(console.error);

export { runScrapers };