/**
 * API Service Layer
 * ------------------
 * Centralized functions for handling all HTTP requests to the backend.
 * This file keeps all API-related logic in one place so the rest of the app
 * only needs to import and call these helper functions.
 *
 * Examples included in this file:
 *   - scanInventoryImage(file)
 *   - fetchItems()
 *   - updateInventory(id, data)
 */

export const scanInventoryImage = async (file) => {
  const formData = new FormData();
  formData.append("inventoryImage", file);

  const res = await fetch("/api/v1/inventory/scan", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Scan failed");

  return res.json();
};
