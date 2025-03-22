import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { fileURLToPath } from 'url';
import Investor from '../Database Schema/TopInvestors.js';
import MarketValue from '../Database Schema/MarketValue.js';
import { 
    getRandomUserAgent,
    connectToMongoDB,
    disconnectFromMongoDB,
    saveToDatabase 
} from '../utils/scraperUtils.js';

puppeteer.use(StealthPlugin());

function convertDateToQuarter(dateStr) {
    if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return null;
    
    const [year, month] = dateStr.split('-');
    const quarter = Math.ceil(parseInt(month) / 3);
    return `${year}-Q${quarter}`;
}

async function scrapeTopInvestorsMarketValue(baseUrl, dateQuarter = '') {
    const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(getRandomUserAgent());
    
    const url = dateQuarter ? `${baseUrl}/${dateQuarter}` : baseUrl;
    console.log(`Scraping URL: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const marketValues = [];
    let currentPage = 1;
    let hasNextPage = true;

    // Wait for the table container to appear
    await page.waitForSelector("div.mrt-table-container");

    while (hasNextPage) {
        try {
            // Extract data from the current page
            const pageData = await page.evaluate(() => {
                const extractedData = [];
                const targetDiv = document.querySelector("div.mrt-table-container");
                if (!targetDiv) return extractedData;

                const tableRows = targetDiv.querySelectorAll("tr");

                tableRows.forEach(row => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length >= 9) {
                        extractedData.push({
                            "Ticker": cells[0].innerText.trim(),
                            "Company Name": cells[1].innerText.trim(),
                            "Market Value": cells[2].innerText.trim(),
                            "Weight": cells[3].innerText.trim(),
                            "Shares": cells[4].innerText.trim(),
                            "Change": cells[5].innerText.trim(),
                            "Change in Shares": cells[6].innerText.trim(),
                            "Quarter End Price": cells[7].innerText.trim(),
                            "Percentage Owned": cells[8].innerText.trim()
                        });
                    }
                });

                return extractedData;
            });

            marketValues.push(...pageData);
            console.log(`Scraped ${pageData.length} rows from page ${currentPage}`);

            // Check for next page
            const hasNext = await page.evaluate(() => {
                const paginationContainer = document.querySelector("div.m_4addd315.mantine-Pagination-root");
                if (!paginationContainer) return false;

                const currentButton = paginationContainer.querySelector("button[aria-current='page']");
                const currentPage = currentButton ? parseInt(currentButton.innerText.trim()) : 1;
                
                const buttons = Array.from(paginationContainer.querySelectorAll("button.mantine-Pagination-control"));
                const pageNumbers = buttons
                    .map(btn => parseInt(btn.innerText.trim()))
                    .filter(num => !isNaN(num));
                
                const maxPage = Math.max(...pageNumbers);
                return currentPage < maxPage;
            });

            if (!hasNext) {
                console.log(`Reached last page (${currentPage})`);
                hasNextPage = false;
                break;
            }

            // Click next page
            await page.evaluate(() => {
                const paginationContainer = document.querySelector("div.m_4addd315.mantine-Pagination-root");
                const currentButton = paginationContainer.querySelector("button[aria-current='page']");
                const currentPage = parseInt(currentButton.innerText.trim());
                
                const buttons = Array.from(paginationContainer.querySelectorAll("button.mantine-Pagination-control"));
                const nextButton = buttons.find(btn => {
                    const pageNum = parseInt(btn.innerText.trim());
                    return !isNaN(pageNum) && pageNum === currentPage + 1;
                });
                
                if (nextButton) nextButton.click();
            });

            // Wait for table to update
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            currentPage++;

        } catch (error) {
            console.log(`Error navigating pagination: ${error}`);
            hasNextPage = false;
            break;
        }
    }

    await browser.close();
    return marketValues;
}

export async function extractDateValues() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto("https://finchat.io/investor/berkshire-hathaway-inc/", { waitUntil: 'domcontentloaded' });

    // Wait for the input field to appear
    await page.waitForSelector("input.m_8fb7ebe7.mantine-Input-input.mantine-Select-input");

    // Open dropdown by clicking the input box
    await page.click("input.m_8fb7ebe7.mantine-Input-input.mantine-Select-input");

    // Wait for the dropdown to appear
    await page.waitForSelector("div.m_92253aa5.mantine-Select-option");

    // Extract all available date options
    const availableDates = await page.$$eval(
        "div.m_92253aa5.mantine-Select-option",
        options => options.map(option => option.textContent.trim())
    );

    await browser.close();

    // Filter out non-date values and convert valid dates to quarters
    const validDates = availableDates
        .filter(date => date.match(/^\d{4}-\d{2}-\d{2}$/))
        .map(date => ({
            date,
            quarter: convertDateToQuarter(date)
        }));

    return validDates;
}

async function runScrapers() {
    console.log("🚀 Starting Market Values Scraper...");

    try {
        await connectToMongoDB();

        // Get all investors from the database
        const investors = await Investor.find({});
        console.log(`Found ${investors.length} investors to process`);

        // Process each investor
        for (const investor of investors) {
            try {
                const slug = investor.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const baseUrl = `https://finchat.io/investor/${slug}`;
                console.log(`Processing ${investor.company} (${baseUrl})`);

                // Get available dates for this investor
                const validDates = await extractDateValues();
                console.log(`Found ${validDates.length} quarters to process for ${investor.company}`);

                // Process each quarter for this investor
                for (const { date, quarter } of validDates) {
                    try {
                        console.log(`Processing ${quarter} for ${investor.company}`);
                        const marketValues = await scrapeTopInvestorsMarketValue(baseUrl, quarter);

                        if (marketValues.length > 0) {
                            // Add metadata to each entry
                            const marketValuesWithMetadata = marketValues.map(value => ({
                                ...value,
                                investorId: investor._id,
                                date,
                                quarter,
                                updatedAt: new Date().toISOString()
                            }));

                            // Bulk upsert the market values
                            for (const marketValue of marketValuesWithMetadata) {
                                await MarketValue.findOneAndUpdate(
                                    {
                                        investorId: investor._id,
                                        Ticker: marketValue.Ticker,
                                        quarter: quarter,
                                    },
                                    marketValue,
                                    { upsert: true, new: true }
                                );
                            }

                            console.log(`✅ Saved ${marketValuesWithMetadata.length} entries for ${investor.company} - ${quarter}`);
                        } else {
                            console.log(`⚠️ No market values found for ${investor.company} - ${quarter}`);
                        }

                        // Add a small delay between quarters
                        await new Promise(resolve => setTimeout(resolve, 2000));

                    } catch (error) {
                        console.error(`Error processing quarter ${quarter} for ${investor.company}:`, error);
                        continue; // Continue with next quarter even if one fails
                    }
                }

                // Add a longer delay between investors
                await new Promise(resolve => setTimeout(resolve, 5000));
                
            } catch (error) {
                console.error(`Error processing investor ${investor.company}:`, error);
                continue; // Continue with next investor even if one fails
            }
        }

        console.log("✨ Market values scraping completed!");

    } catch (error) {
        console.error("Error in market values scraper:", error);
    } finally {
        await disconnectFromMongoDB();
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runScrapers().catch(console.error);
}

export { scrapeTopInvestorsMarketValue, runScrapers };
