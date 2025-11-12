import { PrismaClient } from '@prisma/client';

//Initialize the Prisma Client
const prisma = new PrismaClient({
    //Optional: log database queries for development/debugging
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
    ],
});

//Listener for logging queries (not mandatory, good for debugging)
prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
});

/**
 * Ensures the database connection is established on server startup.
 */

export async function connectDB() {
    try {
        await prisma.$connect();
        console.log("Successfully connected to the PostgreSQL database.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        // Exit process if DB connection is critical and fails
        process.exit(1); 
    }
}

/**
 * Exports Prisma Client for use in services and routes.
 */

export const db = prisma;