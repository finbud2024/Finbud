import mongoose from "mongoose";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load .env file from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

export const browserConfig = {
    headless: true,
    args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
    ]
};

export const contextConfig = {
    viewport: { width: 1920, height: 1080 },
    timeout: 60000
};

export function getRandomUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

export const connectToMongoDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        console.log("🔍 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("✅ Connected to MongoDB!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

export const disconnectFromMongoDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Disconnection Error:", err.message);
    }
};

export async function saveToDatabase(Model, documents, identifyingField = 'name') {
    if (!documents || (Array.isArray(documents) && documents.length === 0)) {
        console.log("⚠️ No documents to save.");
        return;
    }

    const items = Array.isArray(documents) ? documents : [documents];
    console.log(`💾 Attempting to save ${items.length} documents to MongoDB...`);

    for (let item of items) {
        try {
            const query = {};
            query[identifyingField] = item[identifyingField];

            const existing = await Model.findOne(query);
            if (existing) {
                console.log(`🔄 Updating existing document: ${item[identifyingField]}`);
                await Model.findOneAndUpdate(query, item);
                continue;
            }

            const newDoc = new Model(item);
            await newDoc.save();
            console.log(`✅ Inserted: ${item[identifyingField]}`);
        } catch (error) {
            console.error("❌ Error saving document:", error);
        }
    }
} 