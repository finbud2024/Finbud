import cron from 'node-cron';
import { scrapeVoz } from './vozScraper.js';

// Schedule to run every 2 days at 3:00 AM CST
const scheduleJob = cron.schedule('0 3 */2 * *', async () => {
  console.log('Starting scheduled VOZ scraping job');
  try {
    await scrapeVoz({ maxPosts: 20, maxComments: 20 });
    console.log('VOZ scraping completed successfully');
  } catch (error) {
    console.error('VOZ scheduled scraping failed:', error);
  }
}, {
  scheduled: true,
  timezone: "America/Chicago"
});

scheduleJob.start();

// Export for Lambda (Netlify)
export const handler = async (event) => {
  console.log('Lambda function invoked for VOZ scraping');
  try {
    await scrapeVoz({ maxPosts: 20, maxComments: 20 });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'VOZ scraping completed successfully' })
    };
  } catch (error) {
    console.error('Lambda execution failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Scraping failed', error: error.message })
    };
  }
};
