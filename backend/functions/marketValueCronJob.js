import cron from 'node-cron';
import { runBatchedScraping } from './marketValueScraper.js';

// Schedule the job to run at 01:00 AM CST on the 1st of every month
const scheduleJob = cron.schedule('0 1 1 * *', async () => {
    console.log('Starting scheduled market value scraping job');
    try {
        await runBatchedScraping();
        console.log('Scheduled scraping completed successfully');
    } catch (error) {
        console.error('Scheduled scraping failed:', error);
    }
}, {
    scheduled: true,
    timezone: "America/Chicago" // CST timezone
});

// Start the scheduled job
scheduleJob.start();

// Export for AWS Lambda use
export const handler = async (event) => {
    console.log('Lambda function invoked');
    try {
        await runBatchedScraping();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Scraping completed successfully' })
        };
    } catch (error) {
        console.error('Lambda execution failed:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Scraping failed',
                error: error.message 
            })
        };
    }
};
