<<<<<<< Updated upstream:backend/Endpoints/eventRoute.js
import express from "express";
import Event from "../Database Schema/Event.js";

const eventRoute = express.Router();

eventRoute.get("/", async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Error fetching events", error: err });
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

=======
import express from "express";
import Event from "../../database-schema/social/Event.js";

const eventRoute = express.Router();

eventRoute.get("/", async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Error fetching events", error: err });
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

>>>>>>> Stashed changes:backend/Endpoints/social/eventRoute.js
