import express from "express";
import { analyzeImage } from "../services/visionService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { base64 } = req.body;

  if (!base64) return res.status(400).json({ error: "No base64 provided" });

  try {
    const result = await analyzeImage(base64);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Vision API error" });
  }
});

export default router;
