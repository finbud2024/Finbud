import cron from 'node-cron';
import axios from 'axios';
import './cronjobs/newsCronJob.js';
const key = "YOUR KEY";

const scheduleJob = cron.schedule('* * * * *', async () => {
    console.log('Running a job at 00:00 at Asia/Jakarta timezone');
    // Do something
    try {
        const api = `https://api.polygon.io/v1/open-close/AAPL/2024-08-29?adjusted=true&apiKey=${key}`;
        const response = await axios.get(api);
        console.log(response.data)
    }
    catch (error) {
        console.error(error.response.data);
    }
}, {
    scheduled: false,
    timezone: "Asia/Jakarta"
});
scheduleJob.start();

