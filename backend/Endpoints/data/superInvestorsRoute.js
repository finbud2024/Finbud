import express from 'express';
import TopInvestors from "../../database-schema/market-data/TopInvestors.js";
import CompanyPortfolio from "../../database-schema/market-data/CompanyPortfolio.js";
import InvestorData from "../../database-schema/market-data/MarketValue.js";
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
 * @route GET /api/investors/data/:investorId/:quarter
 * @desc Get combined investor data (holdings, market values) for a specific quarter
 * @access Public
 */
superInvestorsRoute.get('/data/:investorId/:quarter', async (req, res) => {
    try {
        const { investorId, quarter } = req.params;
        const investorData = await InvestorData.findOne({ investorId, quarter });

        if (!investorData) {
            return res.status(404).json({ message: "No data found for this investor and quarter." });
        }

        res.status(200).json(investorData);
    } catch (error) {
        console.error("Error fetching investor data:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

/**
 * @route GET /api/investors/data/:investorId
 * @desc Get available quarters for an investor
 * @access Public
 */
superInvestorsRoute.get('/data/:investorId', async (req, res) => {
    try {
        const { investorId } = req.params;

        if (!mongoose.isValidObjectId(investorId)) {
            return res.status(400).json({ message: "Invalid investorId format" });
        }

        const objectIdInvestorId = new mongoose.Types.ObjectId(investorId);
        const data = await InvestorData.find({ investorId: objectIdInvestorId }, 'quarter')
            .sort({ quarter: -1 });

        if (!data.length) {
            return res.status(404).json({ message: "No data found for this investor." });
        }

        // Extract and sort quarters
        const quarters = data.map(d => d.quarter)
            .sort((a, b) => {
                const [yearA, quarterA] = a.split('-Q').map(Number);
                const [yearB, quarterB] = b.split('-Q').map(Number);
                return yearB - yearA || quarterB - quarterA;
            });

        res.status(200).json({ quarters });
    } catch (error) {
        console.error("Error fetching quarters:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

superInvestorsRoute.get('/portfolio/:investorId/:cusip', async (req, res) => {
    try {
        const { investorId, cusip } = req.params;
        const portfolio = await CompanyPortfolio.findOne({ investorId, cusip });

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
        const portfolios = await CompanyPortfolio.find({ investorId }, 'companyName cusip');

        if (!portfolios.length) {
            return res.status(404).json({ message: 'No portfolios found for this investor.' });
        }

        res.status(200).json(portfolios);
    } catch (error) {
        console.error("Error fetching portfolios:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get most recent scrape document based on updatedAt
superInvestorsRoute.get("/recent-document", async (req, res) => {
    try {
        const recentDocument = await InvestorData.findOne()
            .sort({ updatedAt: -1 })
            .exec();
        
        if (!recentDocument) {
            return res.status(404).json({ message: "No documents found" });
        }
        
        return res.status(200).json(recentDocument);
    } catch (error) {
        console.error("Error fetching recent document:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get count of distinct investors from InvestorData collection
superInvestorsRoute.get("/investor-data-count", async (req, res) => {
    try {
        const distinctCount = await InvestorData.distinct('investorId').exec();
        
        return res.status(200).json({
            count: distinctCount.length
        });
    } catch (error) {
        console.error("Error counting distinct investors:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get count of distinct investors from CompanyPortfolio collection
superInvestorsRoute.get("/portfolio-investor-count", async (req, res) => {
    try {
        const distinctCount = await CompanyPortfolio.distinct('investorId').exec();
        
        return res.status(200).json({
            count: distinctCount.length
        });
    } catch (error) {
        console.error("Error counting distinct portfolio investors:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
export default superInvestorsRoute;
