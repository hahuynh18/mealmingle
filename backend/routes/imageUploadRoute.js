/**
 * Defines the Express router for handling image uploads.
 * uses Multer for file processing and orchestrates the workflow:
 * file upload -> conversion -> call to visionService -> response, ensuring
 * temp file is deleted when complete.
 */

import express from "express";
import multer from "multer";

import { fileToBuffer } from "../utilities/utilities.js";
import { promises as fs } from "fs";
import { analyzeImage } from "../services/visionService.js";
import { mapVisionResultToInventoryItem } from "../services/mapper.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Multer saves files to a temp 'uploads' directory

// Cleans up the temp file after processing, regardless of outcome (success/failure)
const cleanupFile = async (filePath) => {
  if (filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`Cleaned up temp file: ${filePath}`);
    } catch (err) {
      // It's okay if cleanup fails, but logs the error.
      console.error(`Error cleaning up file ${filePath}:`, err);
    }
  }
};

/**
 * POST /api/v1/inventory/scan
 * Handles the image file upload, converts it to Base64, and triggers the AI analysis.
 */
router.post("/scan", upload.single("inventoryImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error:
        'No image file uploaded. Please include a field named "inventoryImage".',
    });
  }
  const filePath = req.file.path;

  try {
    // 1. Convert the uploaded file (stored temporarily by multer) into a Buffer
    const imageBuffer = await fileToBuffer(filePath);

    // 2. Convert the Buffer to a Base64 string (required by Google Vision API)
    const base64Image = imageBuffer.toString("base64");

    // 3. Call Vision API service with the Base64 image data
    const visionResult = await analyzeImage(base64Image);

    // Map Vision API result -> inventory items
    const inventoryItems = mapVisionResultToInventoryItem(visionResult);

    // 4. Send the raw results back to the client
    res.status(200).json({
      message:
        "Image successfully analyzed by AI. Mapped inventory items below:",
      inventoryItems,
    });
  } catch (error) {
    // Log the error internally and return a generic 500
    console.error("API Error during image processing:", error);

    // Provide a clearer error message if the API key/creds were the issue
    const errorMessage = error.message.includes("Vision API failed")
      ? "Failed to connect to or process data with the Vision API. Check credentials and API key/auth."
      : "Failed to process image. Internal server error.";

    res.status(500).json({ error: errorMessage });
  } finally {
    // Ensure cleanup runs whether the process succeeded or failed
    await cleanupFile(filePath);
  }
});

export default router;
