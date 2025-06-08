import express from 'express';

import Company from '../../../Database_Schema/market-data/finData/CompanySchema.js';
import Filings from '../../../Database_Schema/market-data/finData/FilingsSchema.js';
import parseXMLFile from '../../../utils/xml-parsing/parsingXML.js';
import { processForm4 } from '../../../utils/xml-parsing/processForm4.js';
import InsiderTransaction from '../../../Database_Schema/market-data/finData/TransactionSchema.js';

const insiderTransactionRoute = express.Router();

insiderTransactionRoute.get("/insider-transactions/:ticker", async (req, res) => {
    try {
      const { ticker } = req.params;
      const companyName = await Company.findOne({ ticker: ticker.toUpperCase() });
      const filingDoc = await Filings.find({ 
        cik: companyName.cik, reportType: "4",
        filingDate: { $gte: '2024-01-01'}
     });
  
      res.status(202).json({ message: "Started processing Form 4 filings..." });
  
      processForm4sForCompany(companyName, filingDoc);
  
    } catch (err) {
      console.error("Error starting insider transaction processing", err);
      return res.status(500).json({ message: "Error starting insider transaction processing" });
    }
  });
  
  async function processForm4sForCompany(company, filingDoc) {
    try {
      for (const doc of filingDoc) {
        const accessionNumber = doc.accessionNumber;
  

        if (doc.isProcessed){
            continue
        }
        const textURL = `https://www.sec.gov/Archives/edgar/data/${parseInt(company.cik)}/${accessionNumber.replace(/-/g, "")}/${accessionNumber}.txt`;
        const parsedXML = await parseXMLFile(textURL);
        const processedForm4 = await processForm4(parsedXML);
        const allTransactions = processedForm4.transactionsInfo || [];
  
        if (allTransactions.length > 0) {
          const groupedByDate = {};
  
          for (const t of allTransactions) {
            const date = t.filingDate;
            if (!date) continue;
            if (!groupedByDate[date]) groupedByDate[date] = [];
            groupedByDate[date].push(t);
          }
  
          for (const date in groupedByDate) {
            const group = groupedByDate[date];
            const validPriceTran = group.find(tran => tran.price !== undefined);
          const validPrice = validPriceTran ? validPriceTran.price : undefined;

          for (const tran of group) {
            if (tran.price === undefined && validPrice !== undefined) {
              tran.price = validPrice; 
            }

            const codes = group.map(t => t.code);
            const sharesArr = group.map(t => parseFloat(t.shares || 0));
            const valuesArr = group.map(t => {
              const s = parseFloat(t.shares || 0);
              const p = parseFloat(t.price || 0);
              return isNaN(s * p) ? 0 : s * p;
            });
  
            await InsiderTransaction.updateOne(
                {
                  cik: company.cik,
                  name: processedForm4.owner.name,
                  filingDate: new Date(date)
                }, 
                {
                  $set: {
                    transactionType: codes,
                    numberShares: sharesArr,
                    values: valuesArr,
                    isProcessed: true,
                    form4: doc.documentUrl,
                    filingDate: new Date(date)
                  }
                },
                { upsert: true } 
              );
          }
        }
      }
    }
      console.log(`Finished processing insider transactions for ${company.name}`);
    } catch (error) {
      console.error(`Error processing insider transactions for ${company.name}`, error);
    }
  }

// Get insider transaction from DB 
insiderTransactionRoute.get("/transactions-db/:ticker", async (req, res) => {
    try {
        const { ticker } = req.params;
        const company = await Company.findOne({ ticker: ticker.toUpperCase() });
        if (!company) return res.status(404).json({ message: "Company not found" });
    
        const transactions = await InsiderTransaction.find({ cik: company.cik }) 
          .sort({ filingDate: -1 });
        return res.json({ transactions });
      } catch (err) {
        console.error("Error fetching insider transactions", err);
        return res.status(500).json({ message: "Error fetching insider transactions" });
      }
})
export default insiderTransactionRoute;
