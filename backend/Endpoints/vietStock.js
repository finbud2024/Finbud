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
        console.log(result);
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
        const startYearNum = parseInt(startYear);
        const endQuarterNum = parseInt(endQuarter.replace('Quý', '').trim());
        const endYearNum = parseInt(endYear);

        // Fetch all documents and filter in-memory
        let allData = await vietStockGDP.find({
            xem_theo: 'quý',
            year: { $gte: startYear, $lte: endYear }
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
        
        const startYearNum = parseInt(startYear);
        const endYearNum = parseInt(endYear);

        let allData = await vietStockGDP.find({
            xem_theo: 'năm',
            year: { $gte: startYear, $lte: endYear }
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

        res.status(200).json({data: allData});
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
}); 

vietStockRoute.post("/FDI/filter/month", async(req, res) => {
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

        let allData = await vietStockFDI.find({
            xem_theo: 'tháng',
            year: { $gte: startYear, $lte: endYear }
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

vietStockRoute.post("/FDI/filter/year", async(req, res) => {
    try {
        const { startYear, endYear } = req.body;
        if (!startYear || !endYear) {
            return res.status(400).json({message: 'Please provide startMonth, startYear, endMonth, endYear'});
        }
        
        const startYearNum = parseInt(startYear);
        const endYearNum = parseInt(endYear);

        let allData = await vietStockFDI.find({
            xem_theo: 'năm',
            year: { $gte: startYear, $lte: endYear }
        });

        res.status(200).json({data: allData});
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching data', error});
    }
}); 

export default vietStockRoute;