import express from 'express';
import vietStockOverview from '../Database Schema/vietStockOverview';
import vietStockGDP from '../Database Schema/vietStockGDP';
import vietStockCPI from '../Database Schema/vietStockCPI';
import vietStockImportExport from '../Database Schema/vietStockImportExport';
import vietStockFDI from '../Database Schema/vietStockFDI';
import { fixRequestBody } from 'http-proxy-middleware';

const vietStockRoute = express.Router();

vietStockRoute.get("/Overview", async(req, res) => {
    try {
        const result = await vietStockOverview.find({});
        console.log(result);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.get("/CPI", async(req, res) => {
    try {
        const result = await vietStockCPI.find({});
        console.log(result);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.get("/ImportExport", async(req, res) => {
    try {
        const result = await vietStockImportExport.find({});
        console.log(result);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.get("/FDI", async(req, res) => {
    try {
        const result = await vietStockFDI.find({});
        res.json(result);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.get("/GDP", async(req, res) => {
    try {
        const result = await vietStockGDP.find({});
        console.log(result);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await vietStockOverview.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
});

vietStockRoute.post("/GDP/filter/quarter", async(req, res) => {
    try {
        const {startQuarter, startYear, endQuarter, endYear} = req.body;
        if (!startQuarter || !startYear || !endQuarter || !endYear) {
            return res.status(400).json({ message: "Please provide startQuarter, startYear, endQuarter, and endYear." });
        }

        // Convert quarter and year to numbers for comparison
        const startQuarterNum = parseInt(startQuarter.replace('Quý', '').trim());
        const endQuarterNum = parseInt(endQuarter.replace('Quý', '').trim());

        // Fetch all documents and filter in-memory
        let allData = await vietStockGDP.find({
            xem_theo: 'quý',
            year: { $gte: startYear, $lte: endYear }
        });

        console.log(allData);

        allData.sort((a, b) => {
            if (a.year === b.year) {
                if (a.quarter.includes('Quý') && b.quarter.includes('Quý')) {
                    return parseInt(a.quarter.replace('Quý', '').trim()) - parseInt(b.quarter.replace('Quý', '').trim());
                }
                if (a.quarter.includes('Quý') && !b.quarter.includes('Tháng')) {
                    const aQuarterNum = parseInt(a.quarter.replace('Quý', '').trim());
                    const bQuarterNum = parseInt(b.quarter.replace('Tháng', '').trim());
                    if (aQuarterNum - parseInt(bQuarterNum / 3) == 0) {
                        return -1;
                    }
                    return aQuarterNum - parseInt(bQuarterNum / 3);
                }
                if (a.quarter.includes('Tháng') && b.quarter.includes('Quý')) {
                    const aQuarterNum = parseInt(a.quarter.replace('Tháng', '').trim()) / 3;
                    const bQuarterNum = parseInt(b.quarter.replace('Quý', '').trim());
                    if (parseInt(aQuarterNum / 3) - bQuarterNum == 0) {
                        return 1;
                    }
                    return (aQuarterNum / 3) - bQuarterNum;
                }
                return parseInt(a.quarter.replace('Tháng', '').trim()) - parseInt(b.quarter.replace('Tháng', '').trim());
            }
            return parseInt(a.year) - parseInt(b.year); 
        });

        const eQuarterNum = parseInt(allData[allData.length - 1].quarter.replace('Quý', '').trim());
        const sQuarterNum = parseInt(allData[0].quarter.replace('Quý', '').trim());

        for (let i = sQuarterNum; i < startQuarterNum; i++) {
            allData.shift();
        }

        for (let i = eQuarterNum; i > endQuarterNum; i--) {
            allData.pop();
        }

        res.status(200).json({ data: allData });
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.post("/GDP/filter/year", async(req, res) => {
    try {
        const {startYear, endYear} = req.body;
        if (!startYear || !endYear) {
            return res.status(400).json({ message: "Please provide startQuarter, startYear, endQuarter, and endYear." });
        }

        let allData = await vietStockGDP.find({
            xem_theo: 'năm',
            year: { $gte: startYear, $lte: endYear }
        });

        allData.sort((a, b) => {
            return parseInt(a.year) - parseInt(b.year);
        });

        res.status(200).json({ data: allData });
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.post("/CPI/filter/month", async(req, res) => {
    try {
        const {startMonth, startYear, endMonth, endYear} = req.body;
        if (!startMonth || !startYear || !endMonth || !endYear) {
            return res.status(400).json({message: 'Please provide startMonth, startYear, endMonth, endYear'});
        }
        
        // Convert month and year to numbers for comparison
        const startMonthNum = parseInt(startMonth.replace('Tháng', '').trim());
        const startYearNum = parseInt(startYear);
        const endMonthNum = parseInt(endMonth.replace('Tháng', '').trim());
        const endYearNum = parseInt(endYear);

        let allData = await vietStockCPI.find({
            xem_theo: 'tháng',
            year: { $gte: startYear, $lte: endYear }
        });

        allData.sort((a, b) => {
            if (a.year === b.year) {
                return parseInt(a.month.replace('Tháng', '').trim()) - parseInt(b.month.replace('Tháng', '').trim());
            }
            return parseInt(a.year) - parseInt(b.year);
        });

        const eMonthNum = parseInt(allData[allData.length - 1].month.replace('Tháng', '').trim());
        const sMonthNum = parseInt(allData[0].month.replace('Tháng', '').trim());

        for (let i = sMonthNum; i < startMonthNum; i++) {
            allData.shift();
        }

        for (let i = eMonthNum; i > endMonthNum; i--) {
            allData.pop();
        }

        res.status(200).json({data: allData});          
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
}); 

vietStockRoute.post("/CPI/filter/year", async(req, res) => {
    try {
        const { startYear, endYear } = req.body;
        if (!startYear || !endYear) {
            return res.status(400).json({message: 'Please provide startMonth, startYear, endMonth, endYear'});
        }
        
        const startYearNum = parseInt(startYear);
        const endYearNum = parseInt(endYear);

        let allData = await vietStockCPI.find({
            xem_theo: 'năm',
            year: { $gte: startYear, $lte: endYear }
        });

        allData.sort((a, b) => {
            return parseInt(a.year) - parseInt(b.year);
        });

        res.status(200).json({data: allData});
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
}); 

vietStockRoute.post("/ImportExport/filter/month", async(req, res) => {
    try {
        const {startMonth, startYear, endMonth, endYear} = req.body;
        if (!startMonth || !startYear || !endMonth || !endYear) {
            return res.status(400).json({message: 'Please provide startMonth, startYear, endMonth, endYear'});
        }
        
        // Convert month and year to numbers for comparison
        const startMonthNum = parseInt(startMonth.replace('Tháng', '').trim());
        const startYearNum = parseInt(startYear);
        const endMonthNum = parseInt(endMonth.replace('Tháng', '').trim());
        const endYearNum = parseInt(endYear);

        let allData = await vietStockImportExport.find({
            xem_theo: 'tháng',
            year: { $gte: startYear, $lte: endYear }
        });

        allData.sort((a, b) => {
            if (a.year === b.year) {
                return parseInt(a.month.replace('Tháng', '').trim()) - parseInt(b.month.replace('Tháng', '').trim());
            }
            return parseInt(a.year) - parseInt(b.year);
        });
        
        const eMonthNum = parseInt(allData[allData.length - 1].month.replace('Tháng', '').trim());
        const sMonthNum = parseInt(allData[0].month.replace('Tháng', '').trim());

        for (let i = sMonthNum; i < startMonthNum; i++) {
            allData.shift();
        }

        for (let i = eMonthNum; i > endMonthNum; i--) {
            allData.pop();
        }

        res.status(200).json({data: allData});          
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
}); 

vietStockRoute.post("/ImportExport/filter/year", async(req, res) => {
    try {
        const { startYear, endYear } = req.body;
        if (!startYear || !endYear) {
            return res.status(400).json({message: 'Please provide startMonth, startYear, endMonth, endYear'});
        }
        
        const startYearNum = parseInt(startYear);
        const endYearNum = parseInt(endYear);

        let allData = await vietStockImportExport.find({
            xem_theo: 'năm',
            year: { $gte: startYear, $lte: endYear }
        });

        allData.sort((a, b) => {
            return parseInt(a.year) - parseInt(b.year);
        });

        res.status(200).json({data: allData});
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
}); 

vietStockRoute.post("/FDI/:type", async(req, res) => {
    try {
        const { type } = req.params;
        console.log(type);
        const { fromMonth, fromYear, toMonth, toYear } = req.body;

        const fType = (type === 'month') ? 'tháng' : 'năm';

        let result;

        if (type === 'month') {
            result = await vietStockFDI.find({
                xem_theo: fType,
                $and: [
                  { fromYear: fromYear },
                  { fromMonth: fromMonth.replace('Tháng', '').trim() },
                  { toYear: toYear },
                  { toMonth: toMonth.replace('Tháng', '').trim() }
                ]
              });              
        }
        else {
            result = await vietStockFDI.find({
                xem_theo: fType,
                fromYear: fromYear,
                toYear: toYear
            });
        }

        res.json(result);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
});

vietStockRoute.get("/companies", async (req, res) => {
  try {
    const db = require('mongoose').connection.useDb("vietstock");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const firstLetter = req.query.firstLetter;
    const sortField = req.query.sortField || 'Mã CK';
    const sortOrder = parseInt(req.query.sortOrder) || 1;
    const san = req.query.san;

    let filter = {};
    if (firstLetter && firstLetter !== 'all') {
      filter['Mã CK'] = { $regex: `^${firstLetter}`, $options: 'i' };
    }
    if (san && san !== 'Tất cả' && san !== 'all') {
      filter['Sàn'] = san;
    }

    let companies, total;
    if (sortField === 'Mã CK') {
      // Custom sort: alphabetic first, then numeric
      companies = await db.collection("companies").aggregate([
        { $match: filter },
        { $addFields: {
            isAlpha: { $regexMatch: { input: "$Mã CK", regex: /^[A-Za-z]/ } },
            maCKNumber: {
              $cond: [
                { $regexMatch: { input: "$Mã CK", regex: /^[0-9]+$/ } },
                { $toDouble: "$Mã CK" },
                null
              ]
            }
          }
        },
        { $sort: {
            isAlpha: -sortOrder, // true (alphabet) first for ascending, last for descending
            "Mã CK": sortOrder,
            maCKNumber: sortOrder
          }
        },
        { $skip: skip },
        { $limit: limit }
      ]).toArray();
      total = await db.collection("companies").countDocuments(filter);
    } else if (sortField === 'Khối lượng NY/ĐKGD') {
      const isDescending = sortOrder === -1;
      companies = await db.collection("companies").aggregate([
        { $match: filter },
        { $addFields: { 
            numericVolume: { 
              $cond: [
                { $or: [
                    { $eq: ["$Khối lượng NY/ĐKGD", null] },
                    { $eq: ["$Khối lượng NY/ĐKGD", ""] },
                    { $eq: ["$Khối lượng NY/ĐKGD", "0"] }
                  ] },
                isDescending ? -1 : 0,
                { $convert: { 
                    input: { 
                      $replaceAll: { 
                        input: { $ifNull: ["$Khối lượng NY/ĐKGD", "0"] }, 
                        find: ",", 
                        replacement: "" 
                      } 
                    }, 
                    to: "double", 
                    onError: 0, 
                    onNull: 0 
                  } 
                }
              ]
            }
          } 
        },
        { $sort: { numericVolume: sortOrder } },
        { $skip: skip },
        { $limit: limit }
      ]).toArray();
      total = await db.collection("companies").countDocuments(filter);
    } else {
      // Default string sort
      companies = await db.collection("companies").find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .toArray();
      total = await db.collection("companies").countDocuments(filter);
    }

    res.json({
      companies,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
});

export default vietStockRoute;