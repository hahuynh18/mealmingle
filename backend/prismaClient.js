/**
 * Creates and manages a single, global instance of the Prisma Client.
 * ensures that the application maintains one efficient 
 * connection pool to the database, assists with production performance.
 */
import { PrismaClient } from '@prisma/client';
import "dotenv/config"; // Ensure .env variables are loaded for the DATABASE_URL

// Initialize PrismaClient and export it as a named export.
// This is often more reliable than a default export in Node.js.
export const prisma = new PrismaClient({
  // Optional: Add logging to see the SQL queries Prisma executes
  log: ['query', 'info', 'warn', 'error'],
});
