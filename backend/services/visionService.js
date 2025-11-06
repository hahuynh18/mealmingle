import vision from "@google-cloud/vision";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "../mealmingle-ai-vision.json"),
});

export async function analyzeImage(base64Image) {
  try {
    const request = {
      image: { content: base64Image },
      features: [{ type: "LABEL_DETECTION" }, { type: "TEXT_DETECTION" }],
    };

    const [result] = await client.annotateImage(request);

    const labels =
      result.labelAnnotations?.map((label) => label.description) || [];

    const texts = result.textAnnotations?.map((text) => text.description) || [];

    const cleanText = (texts[0] || "").replace(/[\n"]/g, " ").trim();
    return { labels, texts, cleanText };
  } catch (err) {
    console.error("Error calling Vision API:", err);
    throw err;
  }
}
