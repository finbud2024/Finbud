import mongoose from "mongoose";

const exportedReportSchema = new mongoose.Schema({
  filename: String,
  timestamp: String,
  url: String
});

const ExportedReport = mongoose.model("ExportedReport", exportedReportSchema);
export default ExportedReport;
