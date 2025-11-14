/**
 * Main entry point.
 * Initializes Express server, sets up body-parser
 * registers all routes (image upload/scan API)
 */
import express from "express";
import bodyParser from "body-parser";
import prisma from "./prismaClient.js";
import imageUploadRoute from "./routes/imageUploadRoute.js"; // import the new upload route

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//if we're hosting on Railway, might need CORS headers here

//register image Upload/Scan route
//prefixing with /api/v1/inventory, but the router handles the /scan part
app.use("/api/v1/inventory", imageUploadRoute);

app.get("/", (req, res) => {
  res.send("MealMingle Backend Service Running.");
});

// NOTE: We made this function 'async' to allow us to await the DB check
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // --- DATABASE CONNECTION TEST (Task 1.1 Verification) ---
  try {
    // Attempt to perform a simple read operation on the InventoryItem model.
    // This is a minimal operation to confirm the connection is active and
    // the schema (InventoryItem table) is accessible.
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

    console.error("Error Details:", message.substring(0, 150) + "...");
    console.error(
      "Please check your DATABASE_URL in the .env file and ensure the database container is running."
    );
  }
});
