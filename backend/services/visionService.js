/**
 * Acts as a wrapper for Vision API.
 * Handles client initialization, contains core logic for 
 * calling the API to perform label detection and OCR (text detection) 
 * on an image.
 */
import vision from "@google-cloud/vision";
import path from "path";
import { fileURLToPath } from "url";

// Helper to correctly get __dirname in ES module structure
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client initialization uses a relative path to the key file
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "../mealmingle-ai-vision.json"),
});

/**
 * Calls the Google Vision API to analyze a Base64 encoded image.
 * @param {string} base64Image - The Base64 string of the image content.
 * @returns {Promise<{labels: string[], texts: string[], cleanText: string}>} Analysis results.
 */

export async function analyzeImage(base64Image) {
  try {
    const request = {
      image: { content: base64Image },
      // Requesting both object labels and any potential text (OCR)
      features: [{ type: "LABEL_DETECTION" }, { type: "TEXT_DETECTION" }],
    };

    const [result] = await client.annotateImage(request);

    // Extract labels (descriptions of objects)
    const labels =
      result.labelAnnotations?.map((label) => label.description) || [];

    // Extract raw texts (OCR results)
    const texts = result.textAnnotations?.map((text) => text.description) || [];

    // The first element of textAnnotations is the full text block. Clean it up.
    const cleanText = (texts[0] || "").replace(/[\n"]/g, " ").trim();
    
    // Return all extracted data
    return { labels, texts, cleanText };
  } catch (err) {
    console.error("Error calling Vision API:", err);
    // Wrap the error to provide better debugging context in the route
    throw new Error(`Vision API failed after ${err.code}: ${err.message}`);
  }
}