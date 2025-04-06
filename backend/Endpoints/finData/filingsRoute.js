import express from 'express';
import axios from 'axios';
import Company from '../../Database Schema/finData/CompanySchema';
import Filings from '../../Database Schema/finData/FilingsSchema';

const filingsRoute = express.Router();

const SEC_HEADERS = {
    "User-Agent": "Anh Tran anhtrannd2004@gmail.com"
}

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
        const response = await axios.get(`https://data.sec.gov/submissions/CIK${cik}.json`, {
            headers: SEC_HEADERS
          });
          const data = response.data
        const needTypes = ["10-K", "10-Q", "8-K"]
        for (let i = 0; i < data.filings.recent.accessionNumber.length; i++){
            const currType = data.filings.recent.form[i];
            if (!needTypes.includes(currType)) continue
            const currAccessionNumber = data.filings.recent.accessionNumber[i]
            const isExisted = await Filings.findOne({accessionNumber: currAccessionNumber})
            if (isExisted) continue

            const newFiling = new Filings({
                cik: cik,
                reportType: currType,
                accessionNumber: currAccessionNumber,
                documentUrl: `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${currAccessionNumber.replace(/-/g, "")}/${data.filings.recent.primaryDocument[i]}`
            })
            await newFiling.save()
        }
        return res.status(200).json({message: "Fetch filings successfully"})
    } catch (error) {
        console.log("error fetching filings", error)
        return res.status(500).json({message: "Error fetching filings"})
    }
})
export default filingsRoute