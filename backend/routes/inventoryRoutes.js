/**
 * Defines API routes for final inventory management operations,
 * such as saving the finalized (user-corrected) inventory list.
 */
import express from "express";
import { createInventoryItems } from "../services/inventoryService.js";

const router = express.Router();

/**
 * POST /api/v1/inventory/save
 * Receives the final, user-corrected list of inventory items and persists them to the database.
 * Body should contain:
 * {
 * userId: "user_12345",
 * items: [ { name: "Milk", quantity: 2 }, { name: "Eggs", quantity: 12 } ]
 * }
 */
router.post("/save", async (req, res) => {
  // ***In a real app, userId should come from authentication middleware***
  // not directly from the request body, for security.
  const { userId, items } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required (missing userId)." });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No inventory items provided to save." });
  }

  try {
    const createdItems = await createInventoryItems(userId, items);

    res.status(201).json({
      message: "Inventory items successfully saved.",
      count: createdItems.count,
    });
  } catch (error) {
    console.error("Error saving inventory items:", error.message);
    res.status(500).json({
      error: error.message || "Internal server error while saving inventory.",
    });
  }
});

export default router;