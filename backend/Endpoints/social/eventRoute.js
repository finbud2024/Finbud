import express from "express";
import Event from "../../Database_Schema/social/Event.js";

const eventRoute = express.Router();

eventRoute.get("/", async (req, res) => {
    try {
        const events = await Event.find({});
        
        // Add lat/lng to events that are missing coordinates
        const eventsWithCoordinates = events.map(event => {
            // If event already has lat/lng, keep it
            if (event.lat && event.lng) {
                return event;
            }
            
            // Otherwise, assign default coordinates based on location
            const locationDefaults = {
                'Chicago': { lat: 41.8781, lng: -87.6298 },
                'Hong Kong': { lat: 22.3193, lng: 114.1694 },
                'Singapore': { lat: 1.3521, lng: 103.8198 },
                'London': { lat: 51.5074, lng: -0.1278 },
                'New York': { lat: 40.7128, lng: -74.0060 },
                'San Francisco': { lat: 37.7749, lng: -122.4194 }
            };
            
            // Find matching location
            let coords = { lat: 1.3521, lng: 103.8198 }; // Default to Singapore
            for (const [city, cityCoords] of Object.entries(locationDefaults)) {
                if (event.location && event.location.includes(city)) {
                    coords = cityCoords;
                    break;
                }
            }
            
            return {
                ...event.toObject(),
                lat: coords.lat,
                lng: coords.lng
            };
        });
        
        res.json(eventsWithCoordinates);
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

