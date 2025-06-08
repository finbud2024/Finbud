import axios from "axios";
import Filings from "../../../Database_Schema/market-data/finData/FilingsSchema.js";
import { getPeriodDateFilings } from "../../../utils/data-processing/filingsDateUtils.js";

const SEC_HEADERS = {
    "User-Agent": "Anh Tran anhtrannd2004@gmail.com"
}

// Get filings from API and store in DB
export const fetchFilingsDocument = async (cik) => {
    try {
        const response = await axios.get(`https://data.sec.gov/submissions/CIK${cik}.json`, {
        headers: SEC_HEADERS
    });
    const data = response.data
    const needTypes = new Set(["10-K", "10-Q", "8-K", "DEFA14A", "DEF 14A", "4"])
    let cnt10K = 0;
    let cnt8K = 0;
    let cntDef = 0;
    let cntForm4 = 0;
    const filingsToSave = []
    const existingFilings = []
    const existing = await Filings.find({
      accessionNumber: { $in: data.filings.recent.accessionNumber },
    })
    const existingSet = new Set(existing.map(f => f.accessionNumber))
    for (let i = 0; i < data.filings.recent.form.length; i++){
        const currType = data.filings.recent.form[i];
        if (!needTypes.has(currType)) continue
        const currAccessionNumber = data.filings.recent.accessionNumber[i]
        if (existingSet.has(currAccessionNumber)){
            const existingDoc = existing.find(f => f.accessionNumber === currAccessionNumber)
            if (existingDoc) existingFilings.push({
                cik: existingDoc.cik,
                reportType: existingDoc.reportType,
                accessionNumber: existingDoc.accessionNumber,
                filingDate: existingDoc.filingDate,
                periodDate: existingDoc.periodDate
            })
            if (existingDoc.reportType == "10-K" || existingDoc.reportType == "10-Q"){
                cnt10K +=1;
            }
            else if (existingDoc.reportType == '8-K'){
                cnt8K += 1;
            } 
            else if (existingDoc.reportType == 'DEFA14A' || existingDoc.reportType == "DEF 14A"){
                cntDef += 1
            } 
            else if (existingDoc.reportType == '4'){
                cntForm4 += 1;
            }
            continue
        } 
        
        const docUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}/${currAccessionNumber.replace(/-/g, "")}/${data.filings.recent.primaryDocument[i]}`
        
        const currFilingDate = data.filings.recent.filingDate[i]
        filingsToSave.push({
            cik,
            reportType: currType,
            accessionNumber: currAccessionNumber,
            documentUrl: docUrl,
            filingDate: currFilingDate,
            periodDate: getPeriodDateFilings(currFilingDate)
        })
        if (currType == "10-K" || currType == "10-Q"){
            cnt10K +=1;
        }
        else if (currType == '8-K'){
            cnt8K += 1;
        }
        else if (currType == 'DEFA14A' || currType == 'DEF 14A'){
            cntDef += 1;
        }
        else if (currType == '4'){
            cntForm4 += 1;
    }
        if (cnt10K > 45 || cnt8K > 100 || cntDef > 50){
            break
        }
    }
    if (filingsToSave.length > 0){
        await Filings.insertMany(filingsToSave)
    } 
    const allFilings = [...existingFilings, ...filingsToSave]
    return allFilings
} catch (error){
    console.error(`Error fetching filings for CIK ${cik}`, error)
}
} 


