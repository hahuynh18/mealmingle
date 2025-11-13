import express from "express";
import bodyParser from "body-parser";
import visionRouter from "./routes/vision.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "10mb" }));
app.use("/api/vision", visionRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
