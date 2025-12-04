/**
 * Defines API routes for final inventory management operations,
 * such as saving the finalized (user-corrected) inventory list.
 */
import express from "express";
import { 
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemById,
  getInventoryItemsByUserId,

} from "../services/inventoryService.js";
import { prisma } from "../prismaClient.js";

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
router.get("/:itemId", async(req, res) => {
  const item = await getInventoryItemById(req.params.itemId);
  res.status(200).json({ item });
});

// get list of items by user id
router.get("/", async(req, res) => {
  //temp hardcoded
  const userId = "test-user-001";

  try{
    const items = await getInventoryItemsByUserId(userId);
    res.status(200).json({ items });

  } catch (error){
    console.error("Error fetching inventory list:", error.message);
    res.status(500).json({ error: "Internal server error while fetching inventory" });
  }
});

// router.post("/save", async (req, res) => {
//   // ***In a real app, userId should come from authentication middleware***
//   // not directly from the request body, for security.
//   const { userId, items } = req.body;

//   if (!userId) {
//     return res.status(401).json({ error: "Authentication required (missing userId)." });
//   }

//   if (!items || !Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({ error: "No inventory items provided to save." });
//   }

//   try {
//     const createdItems = await createInventoryItems(userId, items);

//     res.status(201).json({
//       message: "Inventory items successfully saved.",
//       count: createdItems.count,
//     });
//   } catch (error) {
//     console.error("Error saving inventory items:", error.message);
//     res.status(500).json({
//       error: error.message || "Internal server error while saving inventory.",
//     });
//   }
// });

router.put("/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const updates = req.body;

  // ***In a real app, you MUST verify that the authenticated user owns this itemId***
  // before allowing the update, for security.

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  try {
    const updatedItem = await updateInventoryItem(itemId, updates);

    res.status(200).json({
      message: `Inventory item ${itemId} successfully updated.`,
      item: updatedItem,
    });
  } catch (error) {
    console.error(`Error updating inventory item ${itemId}:`, error.message);
    // Use a 404 if the item wasn't found (Prisma throws an error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Inventory item not found." });
    }
    res.status(500).json({
      error: error.message || "Internal server error while updating inventory.",
    });
  }
});

router.delete("/:itemId", async (req, res) => {
  const { itemId } = req.params;

  // ***In a real app, you MUST verify that the authenticated user owns this itemId***
  // before allowing the deletion, for security.

  try {
    const deletedItem = await deleteInventoryItem(itemId);

    res.status(200).json({
      message: `Inventory item ${itemId} successfully deleted.`,
      deletedId: deletedItem.id,
    });
  } catch (error) {
    console.error(`Error deleting inventory item ${itemId}:`, error.message);
    // Use a 404 if the item wasn't found (Prisma throws an error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Inventory item not found." });
    }
    res.status(500).json({
      error: error.message || "Internal server error while deleting inventory.",
    });
  }
});

router.post('/bulk', async (req, res) => {
    // 1. Get the items array from the request body.
    const items = req.body.items;
    const userId = 'test-user-001'; 

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'No items provided for bulk save.' });
    }

    // 2. Map items to include the required userId for Prisma create.
    const itemsWithUserId = items.map(item => ({
        ...item,
        userId: userId, 
        // Ensure quantity is parsed as a number if it came in as a string
        quantity: parseFloat(item.quantity),
        dateAdded: item.dateAdded ? new Date(item.dateAdded) : new Date(),
        expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
    }));

    try {
        // 3. Create items one by one to get IDs returned.
        const createdItems = [];
        for (const itemData of itemsWithUserId) {
            const newItem = await prisma.inventoryItem.create({
                data: itemData
            });
            createdItems.push(newItem);
        }

        // 🛠️ FIX: Clean the returned items for serialization
        const cleanItems = createdItems.map(item => ({
            ...item,
            // Convert Date objects returned by Prisma to ISO 8601 strings
            dateAdded: item.dateAdded ? item.dateAdded.toISOString() : null,
            // Ensure expirationDate is handled, mapping it from Prisma's output
            expirationDate: item.expirationDate ? item.expirationDate.toISOString() : null,
        }));

        // 4. Send the cleaned array of items (with permanent DB IDs) back to the frontend.
        return res.status(201).json({ items: cleanItems });

    } catch (error) {
        console.error('Prisma bulk creation error:', error);
        return res.status(500).json({ error: 'Database creation failed during bulk save.' });
    }
});

export default router;
