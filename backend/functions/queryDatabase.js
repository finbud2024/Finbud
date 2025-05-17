import mongoose from "mongoose";
import Event from "../Database Schema/Event.js";
import dotenv from 'dotenv';

dotenv.config();

const connectToMongoDB = async () => {
    try {
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

async function queryDatabase() {
    await connectToMongoDB();

    try {
        // Get all events from the database
        const events = await Event.find({});

        if (events.length === 0) {
            console.log("📭 Database is empty - no events found");
        } else {
            console.log(`📊 Found ${events.length} events in the database:`);
            events.forEach((event, index) => {
                console.log(`\nEvent #${index + 1}:`);
                console.log(`Name: ${event.name}`);
                console.log(`Date: ${event.date}`);
                console.log(`Location: ${event.location}`);
                console.log(`URL: ${event.url}`);
                console.log('-------------------');
            });
        }
    } catch (error) {
        console.error("❌ Error querying database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
    }
}

// Run the query
queryDatabase().catch(console.error); 