/**
 * Contains reusable helper functions for the backend.
 * Currently provides a utility to safely convert a temp file path (Multer)
 * into a Node.js buffer for processing.
 */
import { promises as fs } from 'fs';

/**
 * Converts a file path into a node.js Buffer.
 * This is used to read the temp file created by Multer before passing its
 * binary data to the Google Vision API.
 *
 * @param {string} filePath - The temp path where Multer saved the file.
 * @returns {Promise<Buffer>} The buffer containing the file's binary data.
 */

export async function fileToBuffer(filePath){
    
    // Using 'fs' (the promises alias) to read the file asynchronously
    try{
        const buffer = await fs.readFile(filePath);
        return buffer;
    } catch (error){
        console.error(`Error reading file at ${filePath}:`, error);
        throw new Error('Could not process the uploaded file.');
    }
}