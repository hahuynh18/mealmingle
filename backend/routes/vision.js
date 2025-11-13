import express from "express";
import multer from "multer";
import fs from "fs";
import { analyzeImage } from "../services/visionService.js";
import { mapVisionResultToInventoryItem } from "../services/mapper.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const base64 = req.file.buffer.toString("base64");

  try {
    const result = await analyzeImage(base64);
    const inventoryItems = mapVisionResultToInventoryItem(result);
    res.json(inventoryItems);
  } catch (err) {
    res.status(500).json({ error: "Vision API error" });
  }
});

export default router;
