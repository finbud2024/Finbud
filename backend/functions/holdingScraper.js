import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Holding from '../Database Schema/Holding.js';
import Investor from '../Database Schema/TopInvestors.js';
import { 
    getRandomUserAgent,
    connectToMongoDB,
    disconnectFromMongoDB,
    saveToDatabase 
} from '../utils/scraperUtils.js';
import { fileURLToPath } from 'url';
import { extractDateValues } from './marketValueScraper.js';

puppeteer.use(StealthPlugin());

async function scrapeTopInvestorsHolding(url, dateQuarter = '') {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(getRandomUserAgent());

    // Construct URL with date quarter if provided
    const finalUrl = dateQuarter ? `${url}${dateQuarter}/` : url;
    await page.goto(finalUrl, { waitUntil: 'domcontentloaded' });

    const investorData = await page.evaluate(() => {
        const container = document.querySelector("#portal > div > main > div > div.m_e615b15f.mantine-Card-root.m_1b7284a3.mantine-Paper-root > div.my-2.flex.w-full.flex-col.gap-4.\\@md\\:flex-row > div.h-full.rounded-md.\\@md\\:w-full.\\@lg\\:min-h-\\[450px\\].\\@lg\\:max-w-\\[500px\\]");
        if (!container) return {};

        const data = {};

        const sections = container.querySelectorAll("h3");
        sections.forEach(section => {
            const sectionTitle = section.innerText.trim();
            const sectionData = {};
            let sibling = section.nextElementSibling;

            if (sibling) {
                const rows = sibling.querySelectorAll("div.mantine-Flex-root");
                rows.forEach(row => {
                    const texts = row.querySelectorAll("p.mantine-Text-root");
                    if (texts.length === 2) {
                        const key = texts[0].innerText.trim();
                        const value = texts[1].innerText.trim();
                        sectionData[key] = value;
                    }
                });
                
                data[sectionTitle] = sectionData;
            }
        });

        return data;
    });

    await browser.close();
    return { ...investorData, quarter: dateQuarter };
}

async function runScrapers() {
    console.log("🚀 Starting Holdings Scraper...");

    try {
        await connectToMongoDB();

        // Get all investors from the database
        const investors = await Investor.find({});
        console.log(`Found ${investors.length} investors to process`);

        // Process each investor
        for (const investor of investors) {
            try {
                const slug = investor.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const baseUrl = `https://finchat.io/investor/${slug}/`;
                console.log(`Processing ${investor.company} (${baseUrl})`);

                // Get available dates for this investor using the imported function
                const validDates = await extractDateValues();
                console.log(`Found ${validDates.length} quarters for ${investor.company}`);

                // Process each quarter
                for (const { date, quarter } of validDates) {
                    try {
                        console.log(`Processing quarter ${quarter}...`);
                        const holdings = await scrapeTopInvestorsHolding(baseUrl, quarter);
                        
                        if (Object.keys(holdings).length > 0) {
                            // Add investorId, date, and quarter to holdings
                            const holdingData = {
                                ...holdings,
                                investorId: investor._id,
                                date,
                                quarter
                            };
                            // console.log(holdingData);
                            // Update or insert the holding
                            await Holding.findOneAndUpdate(
                                { 
                                    investorId: investor._id,
                                    quarter: quarter
                                },
                                holdingData,
                                { upsert: true, new: true }
                            );
                            console.log(`✅ Successfully updated holdings for ${investor.company} - ${quarter}`);
                        } else {
                            console.log(`⚠️ No holdings data found for ${investor.company} - ${quarter}`);
                        }

                        // Add a small delay between quarters
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } catch (error) {
                        console.error(`Error processing quarter ${quarter}:`, error);
                        continue;
                    }
                }

                // Add a longer delay between investors
                await new Promise(resolve => setTimeout(resolve, 5000));
                break;
            } catch (error) {
                console.error(`Error processing ${investor.company}:`, error);
                continue;
            }
        }

        console.log("✨ Holdings scraping completed!");

    } catch (error) {
        console.error("Error in holdings scraper:", error);
    } finally {
        await disconnectFromMongoDB();
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runScrapers().catch(console.error);
}

export { scrapeTopInvestorsHolding, runScrapers };
