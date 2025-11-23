/**
 * Contains the core logic for persisting inventory data to the database
 * using the Prisma client.
 */
import { prisma } from "../prismaClient.js";

/**
 * Ensures a user exists (creates them if they don't) and saves the list
 * of scanned inventory items associated with that user.
 *
 * NOTE: The User model is designed to use 'cuid()' for IDs, which is why
 * the upsert logic is structured to check by a known ID.
 *
 * @param {string} userId - The ID of the user to associate the items with.
 * @param {Array<object>} items - Array of inventory item objects from the AI mapper.
 * @returns {Promise<Array<object>>} The created InventoryItem records.
 */

export async function saveScannedItems(userId, items) {
  try {
    // 1. Ensure the user exists (Upsert pattern: find or create)
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {}, // No updates needed if user already exists
      create: {
        id: userId,
        // Other default user fields can be added here if needed
      },
    });

    // 2. Prepare data for bulk creation
    const inventoryData = items.map((item) => ({
      userId: user.id,
      name: item.name,
      // Default unit is set in the schema, but can be overridden here if mapped
      // For now, we only use name, quantity, and sourceAIText (via JSON stringify)
      quantity: item.quantity,
      // Store the full mapped data as a JSON string for debugging/auditing
      sourceAIText: JSON.stringify(item),
    }));

    // 3. Insert all new items in a single batch operation
    const newItems = await prisma.inventoryItem.createMany({
      data: inventoryData,
      skipDuplicates: true, // Safety check, though IDs should be unique
    });

    console.log(`Successfully created ${newItems.count} new inventory items for user ${userId}.`);
    
    // We can't return the full created objects using createMany, 
    // but we can return the input data for immediate client use.
    return inventoryData; 
    
  } catch (error) {
    console.error("Error saving inventory items to database:", error);
    throw new Error("Failed to save inventory items due to a database error.");
  }
}