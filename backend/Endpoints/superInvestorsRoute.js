import express from 'express';
import TopInvestors from "../Database Schema/TopInvestors.js";
import Holding from "../Database Schema/Holding.js";
import MarketValue from "../Database Schema/MarketValue.js";
import CompanyPortfolio from "../Database Schema/CompanyPortfolio.js";
import mongoose from 'mongoose';

const superInvestorsRoute = express.Router();

superInvestorsRoute.get("/", async (req, res) => {
    try {
        const investors = await TopInvestors.find(); 
        return res.status(200).json(investors);
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

/**
 * @route GET /api/holdings/:investorId
 * @desc Get all holdings for a specific investor
 * @access Public
 */
superInvestorsRoute.get('/holding/:investorId', async (req, res) => {
    try {
        const { investorId } = req.params;
        const holdings = await Holding.find({ investorId });

        if (!holdings.length) {
            return res.status(404).json({ message: "No holdings found for this investor." });
        }

        res.status(200).json(holdings);
    } catch (error) {
        console.error("Error fetching holdings:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

/**
 * @route GET /api/holdings/:investorId/:quarter
 * @desc Get holding for a specific investor and quarter
 * @access Public
 */
superInvestorsRoute.get('/holding/:investorId/:quarter', async (req, res) => {
    try {
        const { investorId, quarter } = req.params;
        const holding = await Holding.findOne({ investorId, quarter });

        if (!holding) {
            return res.status(404).json({ message: "No holding found for this investor and quarter." });
        }

        res.status(200).json(holding);
    } catch (error) {
        console.error("Error fetching holding:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


superInvestorsRoute.get('/market-value/:investorId/:quarter', async (req, res) => {
    try {
        const { investorId, quarter } = req.params;

        if (!investorId || !quarter) {
            return res.status(400).json({ message: "Missing investorId or quarter parameter" });
        }

        const marketValues = await MarketValue.find({ investorId, quarter });

        if (!marketValues.length) {
            return res.status(404).json({ message: "No market values found for this investor and quarter." });
        }

        res.status(200).json(marketValues);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Get distinct quarters for a given investorId
superInvestorsRoute.get('/market-value/:investorId', async (req, res) => {
    try {
        const { investorId } = req.params;

        // Validate investorId
        if (!mongoose.isValidObjectId(investorId)) {
            return res.status(400).json({ message: "Invalid investorId format. Expected a valid MongoDB ObjectId." });
        }

        const objectIdInvestorId = new mongoose.Types.ObjectId(investorId);

        // Fetch all market values for the investor
        const marketValues = await MarketValue.find({ investorId: objectIdInvestorId });

        if (!marketValues.length) {
            return res.status(404).json({ message: "No market values found for this investor." });
        }

        // Extract distinct quarters and sort in descending order (latest first)
        const distinctQuarters = [...new Set(marketValues.map(mv => mv.quarter))]
            .sort((a, b) => {
                const [yearA, quarterA] = a.split('-Q').map(Number);
                const [yearB, quarterB] = b.split('-Q').map(Number);
                return yearB - yearA || quarterB - quarterA; // Sort by year DESC, then quarter DESC
            });

        res.status(200).json({ quarters: distinctQuarters });
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

superInvestorsRoute.get('/portfolio/:investorId/:cusip', async (req, res) => {
    try {
        const { investorId, cusip } = req.params;

        // Find the portfolio document that matches both investorId and cusip
        const portfolio = await CompanyPortfolio.findOne({ investorId, cusip });

        // If no portfolio found, return 404
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found for this investor and cusip.' });
        }

        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

superInvestorsRoute.get('/portfolio/:investorId', async (req, res) => {
    try {
        const { investorId } = req.params;

        // Find all portfolios for the given investorId
        const portfolios = await CompanyPortfolio.find({ investorId }, 'companyName cusip');

        // If no portfolios found, return 404
        if (!portfolios.length) {
            return res.status(404).json({ message: 'No portfolios found for this investor.' });
        }

        res.status(200).json(portfolios);
    } catch (error) {
        console.error("Error fetching portfolios:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

export default superInvestorsRoute;
