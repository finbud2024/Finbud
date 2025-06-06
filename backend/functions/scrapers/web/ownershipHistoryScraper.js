import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Investor from '../database-schema/TopInvestors.js';
import CompanyPortfolio from '../database-schema/CompanyPortfolio.js';
import { 
    getRandomUserAgent,
    connectToMongoDB,
    disconnectFromMongoDB
} from '../utils/scraperUtils.js';

import { fileURLToPath } from 'url';

puppeteer.use(StealthPlugin());

async function extractQuarterPortfolioData(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(getRandomUserAgent());

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Rest of the existing extraction logic
    await page.waitForSelector("g.highcharts-axis-labels.highcharts-xaxis-labels");

    const quarters = await page.$$eval(
        "g.highcharts-axis-labels.highcharts-xaxis-labels text",
        elements => elements.map(el => el.textContent.trim())
    );

    await page.waitForSelector("g.highcharts-data-labels.highcharts-series-0.highcharts-line-series");

    const percentages = await page.$$eval(
        "g.highcharts-data-labels.highcharts-series-0.highcharts-line-series text",
        elements => elements.map(el => el.textContent.trim())
    );

    await browser.close();

    const quarterPortfolioData = {};
    for (let i = 0; i < quarters.length; i++) {
        quarterPortfolioData[quarters[i]] = percentages[i] || "N/A";
    }

    return quarterPortfolioData;
}

async function extractCompanyValues(url) { 
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for the input field to appear
    await page.waitForSelector("input.m_8fb7ebe7.mantine-Input-input.mantine-Select-input");

    // Open dropdown by clicking the input box
    await page.click("input.m_8fb7ebe7.mantine-Input-input.mantine-Select-input");

    // Wait for the dropdown to appear
    await page.waitForSelector("div.m_92253aa5.mantine-Select-option");

    // Extract key-value pairs (Company Name -> Value)
    const companyData = await page.$$eval(
        "div.m_92253aa5.mantine-Select-option",
        options => {
            const data = {};
            options.forEach(option => {
                const key = option.textContent.trim();
                const value = option.getAttribute("value");
                if (key && value) {
                    data[key] = value.split("-")[0];
                }
            });
            return data;
        }
    );

    await browser.close();

    return companyData;
}

async function runScrapers() {
    console.log("🚀 Starting Portfolio History Scraper...");

    try {
        await connectToMongoDB();

        // Get all investors from the database
        const investors = await Investor.find({});
        console.log(`Found ${investors.length} investors to process`);

        // Process each investor
        for (const investor of investors) {
            try {
                const slug = investor.company
                .toLowerCase()
                .replace(/[^a-z0-9.()]+/g, '-') // Allow letters, numbers, periods, and parentheses; replace others with '-'
                .replace(/^-+/, '')                 // Remove leading hyphens only
                const companiesUrl = `https://finchat.io/investor/${slug}/companies/`;
                console.log(`\nProcessing ${investor.company} (${companiesUrl})`);

                // Get all companies and their CUSIPs
                const companyData = await extractCompanyValues(companiesUrl);
                console.log(`Found ${Object.keys(companyData).length} companies for ${investor.company}`);

                // Process each company
                for (const [companyName, cusip] of Object.entries(companyData)) {
                    try {
                        console.log(`Processing ${companyName} (CUSIP: ${cusip})...`);
                        
                        // Construct URL for portfolio history
                        const portfolioUrl = `https://finchat.io/investor/${slug}/companies/?cusip=${cusip}&type=Share`;
                        
                        // Get quarter portfolio data
                        const quarterPortfolioData = await extractQuarterPortfolioData(portfolioUrl);
                        
                        // Create portfolio document
                        const portfolioData = {
                            investorId: investor._id,
                            companyName: companyName,
                            cusip: cusip,
                            ownershipHistory: quarterPortfolioData
                        };
                        // Update or insert the portfolio data
                        await CompanyPortfolio.findOneAndUpdate(
                            { 
                                investorId: investor._id,
                                companyName: companyName
                            },
                            portfolioData,
                            { upsert: true, new: true }
                        );

                        console.log(`✅ Successfully updated portfolio history for ${companyName}`);
                        
                        // Add delay between requests to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                    } catch (error) {
                        console.error(`Error processing ${companyName}:`, error.message);
                        // Continue with next company even if one fails
                        continue;
                    }
                }
                console.log(`✨ Portfolio history scraping completed for ${investor.company}`);
                // Add a longer delay between investors
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (error) {
                console.error(`Error processing ${investor.company}:`, error);
                // Continue with next investor even if one fails
                continue;
            }
        }

        console.log("✨ Portfolio history scraping completed!");

    } catch (error) {
        console.error("Error in portfolio history scraper:", error);
    } finally {
        await disconnectFromMongoDB();
    }
}

// if (process.argv[1] === fileURLToPath(import.meta.url)) {
//     runScrapers().catch(console.error);
// }

export { extractQuarterPortfolioData, extractCompanyValues, runScrapers };