
import express from "express";
import FXRate from "../Database Schema/FXRate.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const all = await FXRate.find().lean();
  res.json(all);
});

export default router;
