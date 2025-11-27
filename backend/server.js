/**
 * Main entry point.
 * Initializes Express server, sets up body-parser
 * registers all routes (image upload/scan API)
 */
import express from "express";
import bodyParser from "body-parser";
import { prisma } from "./prismaClient.js";
import imageUploadRoute from "./routes/imageUploadRoute.js"; // import the new upload route

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//register image Upload/Scan route
//prefixing with /api/v1/inventory, but the router handles the /scan part
app.use("/api/v1/inventory", imageUploadRoute);

app.get("/", (req, res) => {
  res.send("MealMingle Backend Service Running.");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // Attempt to perform a simple read operation on the InventoryItem model.
    // This is a minimal operation to confirm the connection is active and
    // the schema (InventoryItem table) is accessible.
    // Note: This relies on the InventoryItem model existing in your Prisma schema.
    await prisma.inventoryItem.findFirst({
      where: { id: "test-connection-string-id" }, // id is a string literal, not an int
    });
    console.log("Database Connection Verified! Prisma is ready to use.");
  } catch (error) {
    console.error("Database Connection Test FAILED!");

    const message =
      error.message
        .split("\n")
        .find((line) => line.includes("Authentication failed")) ||
      error.message;

    console.error("Error Details:", message);

    // Suggest specific troubleshooting steps
    if (message.includes("Authentication failed")) {
      console.log(
        "HINT: Check your DATABASE_URL username and password in the .env file."
      );
    } else if (message.includes("Could not resolve host")) {
      console.log(
        "HINT: Check the database hostname/proxy and port in the .env file."
      );
    }
  }
});
