import express from 'express';
import Compare from '../Database Schema/FCompare.js';

const router = express.Router();

router.get('/banks', async (req, res) => {
    try {
        // Fetch all bank data, sorted by creation date (newest first)
        const banks = await Compare.find()
            .sort({ createdAt: -1 });

        res.json(banks);
    } catch (error) {
        console.error('Error fetching bank data:', error);
        res.status(500).json({ error: 'Failed to fetch bank data' });
    }
});

export default router; 