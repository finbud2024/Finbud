import express from "express";
import Event from "../../Database_Schema/social/Event.js";

const eventRoute = express.Router();

eventRoute.get("/", async (req, res) => {
    try {
        const events = await Event.find({});
        
        // If no events in database, return sample data for demonstration
        if (events.length === 0) {
            console.warn("⚠️ No events in database, returning sample data");
            const sampleEvents = [
                {
                    _id: "sample1",
                    name: "FinTech Innovation Summit 2025",
                    date: new Date("2025-03-15"),
                    host: "Singapore FinTech Association",
                    location: "Marina Bay Sands, Singapore",
                    lat: 1.2834,
                    lng: 103.8607,
                    url: "https://www.fintechsingapore.org",
                    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                    price: "$299"
                },
                {
                    _id: "sample2",
                    name: "AI in Finance Conference",
                    date: new Date("2025-04-20"),
                    host: "Tech Innovation Hub",
                    location: "London, United Kingdom",
                    lat: 51.5074,
                    lng: -0.1278,
                    url: "https://www.aifinance.com",
                    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800",
                    price: "Free"
                },
                {
                    _id: "sample3",
                    name: "Blockchain & Cryptocurrency Expo",
                    date: new Date("2025-05-10"),
                    host: "Crypto Valley Association",
                    location: "New York, USA",
                    lat: 40.7128,
                    lng: -74.0060,
                    url: "https://www.blockchainexpo.com",
                    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
                    price: "$450"
                }
            ];
            return res.json(sampleEvents);
        }
        
        res.json(events);
    } catch (err) {
        console.error("❌ Error in /events endpoint:", err);
        res.status(500).json({ message: "Error fetching events", error: err.message });
    }
});

eventRoute.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: `Error fetching event with ID ${id}`, error: err });
    }
});

eventRoute.get("/map", async (req, res) => {
    try {
        const events = await Event.find(
            { lat: { $ne: null }, lng: { $ne: null } }
        ).lean();

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found with valid location data." });
        }

        res.status(200).json(events);
    } catch (err) {
        console.error("❌ Error fetching map events:", err);
        res.status(500).json({ message: "Error fetching map events", error: err.message });
    }
});

export default eventRoute;

