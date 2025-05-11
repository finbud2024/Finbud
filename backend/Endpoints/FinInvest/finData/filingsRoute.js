import express from 'express';
import axios from 'axios';
import Company from '../../../Database Schema/finData/CompanySchema.js';
import { fetchFilingsDocument } from '../../../functions/filingsDocuments.js';
import Filings from '../../../Database Schema/finData/FilingsSchema.js';
import csvtojson from "convert-csv-to-json"
import { getRecentQuarter } from '../../../utils/getRecentQuarter.js';
import EarningCalendar from '../../../Database Schema/finData/EarningCalendar.js';

const filingsRoute = express.Router();

const SEC_HEADERS = {
    "User-Agent": "Anh Tran anhtrannd2004@gmail.com"
}
const ALPHAVANTAGE_API_KEY = process.env.VUE_APP_ALPHA_VANTAGE_API_KEY


// Load all companies json data into MongoDB
export const loadCompanies = async () => {
    const cntCompanies = await Company.countDocuments()
    if (cntCompanies > 0){
        return
    }
    try {
        const {data} = await axios.get("https://www.sec.gov/files/company_tickers.json", {
            headers: SEC_HEADERS
        })
        const allCompanies = Object.values(data).map((company) => ({
        cik: String(company.cik_str).padStart(10, "0"),
        ticker: company.ticker,
        name: company.title
    }))
    await Company.insertMany(allCompanies)
} catch (error) {
    console.log("Error loading all companies", error)
}
}

// Get all companies in the database 
filingsRoute.get("/all-companies", async (req, res) => {
    try {
        const companies = await Company.find({})
        return res.status(200).json(companies)
    } catch (e){
        console.log("Error in getting companies from database", e)
        return res.status(500).json({error: "Error in getting companies from DB"})
    }
})

// Search company by name
filingsRoute.get("/search", async (req, res) => {
    const {query} = req.query
    if (!query){
        return res.status(400).json({error: "Company name is required"})
    }
    try {
        const results = await Company.find({
            $or: [
                {name:{$regex: query, $options: 'i'} },
                {ticker: {$regex: query, $options: 'i'}}
            ]
        })
        return res.status(200).json(results)
    } catch (error) {
        console.log("Error in searching companies", error)
        return res.status(500).json(error)
    }
})

// Get CIK of 1 company 
const getCIKForCompany = async (ticker) => {
    console.log("curr ticker", ticker.toUpperCase())
    const companyName = await Company.findOne({ticker: ticker.toUpperCase()})
    if (!companyName) {
        throw new Error ("Company not found in DB")
    }
    return companyName;
}
// Get filings from 1 company 
filingsRoute.get("/company/:ticker", async (req, res) => {
    try {
        const {ticker} = req.params;
        const companyName = await getCIKForCompany(ticker)
        const cik = companyName.cik
        res.status(202).json({ message: `Started fetching filings for ${ticker}` })
        setTimeout(() => fetchFilingsDocument(cik), 0)
    } catch (error) {
        console.log("error fetching filings", error)
        res.status(500).json({message: "Error fetching filings"})
    }
})

// Get filings from DB
filingsRoute.get("/filings/:ticker", async (req, res) => {
    try {
        const {ticker} = req.params;
        const companyName = await getCIKForCompany(ticker)
        if (!companyName){
            return res.status(404).json({message: "Company not found"})
        }
        const filings = await Filings.find({ cik: companyName.cik})
        return res.status(200).json(filings)
    } catch (err) {
        console.log("error getting filings from DB", err)
        return res.status(500).json({message: "Error getting filings from DB"})
    }
})


// get earning calendar
filingsRoute.get("/earnings-calendar/:ticker", async (req, res) => {
    try {
        const {ticker} = req.params
        // const existingCalendar = await EarningCalendar.find({ticker: ticker.toUpperCase()})
        
        const csvResponse = await axios.get(`https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=${ticker}&horizon=12month&apikey=${ALPHAVANTAGE_API_KEY}`,
            { responseType: 'text' }
        )
        console.log("csv response", csvResponse.data)
        const jsonResponse = csvtojson.fieldDelimiter(",").csvStringToJson(csvResponse.data)
        console.log("jsonResponse", jsonResponse)
        return res.status(200).json(jsonResponse)
    } catch (err){
        console.log("fail to get calendar BE", err)
        return res.status(500).json({message: "Error in get calendar"})
    }
})
export default filingsRoute