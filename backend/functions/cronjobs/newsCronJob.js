import cron from 'node-cron';
import { scrapeVnEconomy } from '../scrapers/web/newScraper.js';

// Schedule the job to run every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily news scraper at 8:00 AM');
  try {
    await scrapeVnEconomy();
    console.log('News scraping completed successfully.');
  } catch (error) {
    console.error('Error running news scraper:', error);
  }
}); 