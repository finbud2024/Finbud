import express from "express";
import ExportedReport from "../Database Schema/ExportedReport.js";
import fs from "fs";
import path from "path";
import html2pdf from "html-pdf";

const router = express.Router();

// Ensure directory exists
const pdfDir = path.join(process.cwd(), "public/pdfs");
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

// POST /api/save-report
router.post("/api/save-report", async (req, res) => {
  const { filename, html, timestamp } = req.body;
  if (!filename || !html || !timestamp) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const filePath = path.join(pdfDir, filename);

  html2pdf.create(html).toFile(filePath, async (err, result) => {
    if (err) {
      console.error("PDF generation error:", err);
      return res.status(500).json({ error: "PDF generation failed" });
    }

    // Only save to DB after PDF is successfully created
    const url = `/pdfs/${filename}`;
    const report = new ExportedReport({ filename, timestamp, url });
    await report.save();

    res.json({ message: "Report saved", url });
  });
});

// GET /api/reports
router.get("/api/reports", async (req, res) => {
  const reports = await ExportedReport.find().sort({ timestamp: -1 });
  res.json(reports);
});

export default router;
