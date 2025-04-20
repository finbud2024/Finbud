import express from 'express';
import axios from 'axios';
import Company from '../../Database Schema/finData/CompanySchema';
import { fetchFilingsDocument } from '../../functions/filingsDocuments';
import Filings from '../../Database Schema/finData/FilingsSchema';
import csvtojson from "convert-csv-to-json"
import { getRecentQuarter } from '../../utils/getRecentQuarter.js';

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

// get earning transcripts
filingsRoute.get("/earnings-transcript/:ticker", async(req, res) => {
    try {
        const {ticker} = req.params
        const needQuarters = getRecentQuarter()
        const transcripts = []
        for (let i = 0; i < needQuarters.length; i++){
            const response = await axios.get(`https://www.alphavantage.co/query?function=EARNINGS_CALL_TRANSCRIPT&symbol=${ticker.toUpperCase()}&quarter=2024Q1&apikey=${process.env.VUE_APP_ALPHAVANTAGE2
}`)
console.log("response", response.data)
            if (response.data.transcript){
                transcripts.push({
                    ...needQuarters[i],
                    reportDate: response.data.quarter,
                    transcript: response.data.transcript
                })
            }
        }
        console.log("transcript from be", transcripts)
        return transcripts
    } catch (err) {
        console.log("error in getting earning transcripts")
        return res.status(500).json({message: "Error getting earning transcript"})
    }
})
// get earning calendar
filingsRoute.get("/earnings-calendar", async (req, res) => {
    try {
        const csvResponse = await axios.get(`https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=6month&apikey=${ALPHAVANTAGE_API_KEY}`,
            { responseType: 'text' }
        )
        const jsonResponse = csvtojson.fieldDelimiter(",").csvStringToJson(csvResponse.data)
        return res.status(200).json(jsonResponse)
    } catch (err){
        console.log("fail to get calendar BE", err)
        return res.status(500).json({message: "Error in get calendar"})
    }
})
export default filingsRoute