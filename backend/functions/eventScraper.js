<<<<<<< Updated upstream:backend/functions/eventScraper.js
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import mongoose from "mongoose";
import Event from "../Database Schema/Event.js"; 

chromium.use(stealth());

let allEvents = [];

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

async function saveToDatabase(events) {
    if (!events || events.length === 0) {
        console.log("⚠️ No events to save.");
        return;
    }

    console.log(`💾 Attempting to save ${events.length} events to MongoDB...`);

    for (let event of events) {
        try {
            const existingEvent = await Event.findOne({ url: event.url });
            if (existingEvent) {
                console.log(`🔄 Skipping duplicate: ${event.name}`);
                continue;
            }

            const newEvent = new Event(event);
            await newEvent.save();
            console.log(`✅ Inserted: ${event.name}`);
        } catch (error) {
            console.error("❌ Error saving event:", error);
        }
    }
}

async function scrapeBloomberg() {
    const URL = "https://www.bloomberglive.com/calendar/";
    console.log(`🔄 Fetching events from: ${URL}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 60000 });
    await page.waitForSelector("article");

    const today = new Date();

    let events = await page.evaluate((todayStr) => {
        return [...document.querySelectorAll("article")].map(event => {
            const name = event.querySelector("h2")?.innerText.trim() || "Unnamed Event";
            const dateStr = event.querySelector("a")?.getAttribute("data-eventdate") || null;
            const location = event.querySelector("a")?.getAttribute("data-eventlocation") || "Unknown Location";
            const url = event.querySelector("a")?.href || null;

            let image = null;
            const styleTag = event.querySelector("style");
            if (styleTag) {
                const match = styleTag.innerHTML.match(/background-image:url\("(.*?)"\)/);
                image = match ? match[1] : null;
            }

            const eventDate = dateStr ? new Date(dateStr) : null;
            if (eventDate && eventDate < new Date(todayStr)) return null;

            return {
                name,
                date: eventDate,
                host: "Bloomberg Live",
                location,
                price: "Free",
                image,
                url,
                lat: null, 
                lng: null,
                createdAt: new Date(),
            };
        }).filter(event => event !== null);
    }, today.toISOString());

    console.log(`✅ Found ${events.length} Bloomberg events!`);
    await browser.close();
    return events;
}

async function scrape10Times() {
    const CATEGORY = "finance";
    const BASE_URL = "https://10times.com/";
    const url = `${BASE_URL}${CATEGORY}`;

    console.log(`🔄 Fetching event listings from: ${url}`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let events = [];

    try {
        await page.goto(url, { timeout: 60000 });
        await page.waitForTimeout(5000);

        let jsonLD;
        for (let i = 0; i < 5; i++) {
            jsonLD = await page.evaluate(() => {
                const scriptTag = document.querySelector('script[type="application/ld+json"]');
                return scriptTag ? JSON.parse(scriptTag.innerText) : null;
            });

            if (jsonLD) break;
            await page.waitForTimeout(2000);
        }

        if (jsonLD && Array.isArray(jsonLD.itemListElement)) {
            events = jsonLD.itemListElement.map(item => ({
                name: item.item.name || "Unnamed Event",
                date: item.item.startDate ? new Date(item.item.startDate) : null,
                host: "Unknown Host", 
                location: item.item.location?.[1]?.address?.addressLocality || "Unknown Location",
                price: "Free", 
                url: item.item.url || "No URL",
                lat: null, 
                lng: null,
                image: null,
                createdAt: new Date(),
            }));
        } else {
            console.warn(`⚠️ No JSON-LD found on: ${url}, using fallback...`);

            await page.waitForSelector('.listing-item, .event-card', { timeout: 20000 });

            events = await page.evaluate(() => {
                return [...document.querySelectorAll('.listing-item, .event-card')]
                    .map(event => ({
                        name: event.querySelector('h2, .event-title')?.innerText.trim() || "Unnamed Event",
                        date: event.querySelector('.date, .event-date')?.innerText.trim() || null,
                        host: "Unknown Host",
                        location: event.querySelector('.location, .event-location')?.innerText.trim() || "Unknown Location",
                        price: "Free",
                        url: event.querySelector('a')?.href || "No URL",
                        lat: null,
                        lng: null,
                        image: null,
                        createdAt: new Date(),
                    }))
                    .filter(e => e.name !== "Unnamed Event");
            });

            if (events.length === 0) {
                console.error(`❌ Still no events found on: ${url}.`);
            }
        }

        console.log(`✅ Extracted ${events.length} events from ${url}`);

        for (let event of events) {
            if (!event.url) continue;

            console.log(`🔍 Visiting ${event.url} for additional details...`);
            const eventPage = await browser.newPage();
            try {
                await eventPage.goto(event.url, { timeout: 60000 });

                const jsonData = await eventPage.evaluate(() => {
                    const scriptTag = document.querySelector('script[type="application/ld+json"]');
                    if (!scriptTag) return null;

                    try {
                        return JSON.parse(scriptTag.innerText.trim());
                    } catch (error) {
                        console.error("❌ Error parsing JSON-LD:", error.message);
                        return null;
                    }
                });

                if (jsonData) {
                    event.host = jsonData.organizer?.name || "Unknown Host"; 
                    event.lat = jsonData.location?.geo?.latitude ? parseFloat(jsonData.location.geo.latitude) : null;
                    event.lng = jsonData.location?.geo?.longitude ? parseFloat(jsonData.location.geo.longitude) : null;
                    event.image = Array.isArray(jsonData.image) && jsonData.image.length > 0 ? jsonData.image[0] : null;
                }
            } catch (error) {
                console.error(`❌ Error fetching details for ${event.url}:`, error.message);
            } finally {
                await eventPage.close();
            }
        }

    } catch (error) {
        console.error(`❌ Error fetching ${url}:`, error.message);
    }

    await browser.close();
    return events;
}

async function runScrapers() {
    console.log("🚀 Starting Combined Event Scraper...");

    await connectToMongoDB();

    const bloombergEvents = await scrapeBloomberg();
    const timesEvents = await scrape10Times();

    allEvents = [...bloombergEvents, ...timesEvents];

    await saveToDatabase(allEvents);
    mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
}

runScrapers().catch(console.error);
=======
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import mongoose from "mongoose";
import Event from "../database-schema/Event.js"; 

chromium.use(stealth());

let allEvents = [];

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

async function saveToDatabase(events) {
    if (!events || events.length === 0) {
        console.log("⚠️ No events to save.");
        return;
    }

    console.log(`💾 Attempting to save ${events.length} events to MongoDB...`);

    for (let event of events) {
        try {
            const existingEvent = await Event.findOne({ url: event.url });
            if (existingEvent) {
                console.log(`🔄 Skipping duplicate: ${event.name}`);
                continue;
            }

            const newEvent = new Event(event);
            await newEvent.save();
            console.log(`✅ Inserted: ${event.name}`);
        } catch (error) {
            console.error("❌ Error saving event:", error);
        }
    }
}

async function scrapeBloomberg() {
    const URL = "https://www.bloomberglive.com/calendar/";
    console.log(`🔄 Fetching events from: ${URL}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URL, { timeout: 60000 });
    await page.waitForSelector("article");

    const today = new Date();

    let events = await page.evaluate((todayStr) => {
        return [...document.querySelectorAll("article")].map(event => {
            const name = event.querySelector("h2")?.innerText.trim() || "Unnamed Event";
            const dateStr = event.querySelector("a")?.getAttribute("data-eventdate") || null;
            const location = event.querySelector("a")?.getAttribute("data-eventlocation") || "Unknown Location";
            const url = event.querySelector("a")?.href || null;

            let image = null;
            const styleTag = event.querySelector("style");
            if (styleTag) {
                const match = styleTag.innerHTML.match(/background-image:url\("(.*?)"\)/);
                image = match ? match[1] : null;
            }

            const eventDate = dateStr ? new Date(dateStr) : null;
            if (eventDate && eventDate < new Date(todayStr)) return null;

            return {
                name,
                date: eventDate,
                host: "Bloomberg Live",
                location,
                price: "Free",
                image,
                url,
                lat: null, 
                lng: null,
                createdAt: new Date(),
            };
        }).filter(event => event !== null);
    }, today.toISOString());

    console.log(`✅ Found ${events.length} Bloomberg events!`);
    await browser.close();
    return events;
}

async function scrape10Times() {
    const CATEGORY = "finance";
    const BASE_URL = "https://10times.com/";
    const url = `${BASE_URL}${CATEGORY}`;

    console.log(`🔄 Fetching event listings from: ${url}`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let events = [];

    try {
        await page.goto(url, { timeout: 60000 });
        await page.waitForTimeout(5000);

        let jsonLD;
        for (let i = 0; i < 5; i++) {
            jsonLD = await page.evaluate(() => {
                const scriptTag = document.querySelector('script[type="application/ld+json"]');
                return scriptTag ? JSON.parse(scriptTag.innerText) : null;
            });

            if (jsonLD) break;
            await page.waitForTimeout(2000);
        }

        if (jsonLD && Array.isArray(jsonLD.itemListElement)) {
            events = jsonLD.itemListElement.map(item => ({
                name: item.item.name || "Unnamed Event",
                date: item.item.startDate ? new Date(item.item.startDate) : null,
                host: "Unknown Host", 
                location: item.item.location?.[1]?.address?.addressLocality || "Unknown Location",
                price: "Free", 
                url: item.item.url || "No URL",
                lat: null, 
                lng: null,
                image: null,
                createdAt: new Date(),
            }));
        } else {
            console.warn(`⚠️ No JSON-LD found on: ${url}, using fallback...`);

            await page.waitForSelector('.listing-item, .event-card', { timeout: 20000 });

            events = await page.evaluate(() => {
                return [...document.querySelectorAll('.listing-item, .event-card')]
                    .map(event => ({
                        name: event.querySelector('h2, .event-title')?.innerText.trim() || "Unnamed Event",
                        date: event.querySelector('.date, .event-date')?.innerText.trim() || null,
                        host: "Unknown Host",
                        location: event.querySelector('.location, .event-location')?.innerText.trim() || "Unknown Location",
                        price: "Free",
                        url: event.querySelector('a')?.href || "No URL",
                        lat: null,
                        lng: null,
                        image: null,
                        createdAt: new Date(),
                    }))
                    .filter(e => e.name !== "Unnamed Event");
            });

            if (events.length === 0) {
                console.error(`❌ Still no events found on: ${url}.`);
            }
        }

        console.log(`✅ Extracted ${events.length} events from ${url}`);

        for (let event of events) {
            if (!event.url) continue;

            console.log(`🔍 Visiting ${event.url} for additional details...`);
            const eventPage = await browser.newPage();
            try {
                await eventPage.goto(event.url, { timeout: 60000 });

                const jsonData = await eventPage.evaluate(() => {
                    const scriptTag = document.querySelector('script[type="application/ld+json"]');
                    if (!scriptTag) return null;

                    try {
                        return JSON.parse(scriptTag.innerText.trim());
                    } catch (error) {
                        console.error("❌ Error parsing JSON-LD:", error.message);
                        return null;
                    }
                });

                if (jsonData) {
                    event.host = jsonData.organizer?.name || "Unknown Host"; 
                    event.lat = jsonData.location?.geo?.latitude ? parseFloat(jsonData.location.geo.latitude) : null;
                    event.lng = jsonData.location?.geo?.longitude ? parseFloat(jsonData.location.geo.longitude) : null;
                    event.image = Array.isArray(jsonData.image) && jsonData.image.length > 0 ? jsonData.image[0] : null;
                }
            } catch (error) {
                console.error(`❌ Error fetching details for ${event.url}:`, error.message);
            } finally {
                await eventPage.close();
            }
        }

    } catch (error) {
        console.error(`❌ Error fetching ${url}:`, error.message);
    }

    await browser.close();
    return events;
}

async function runScrapers() {
    console.log("🚀 Starting Combined Event Scraper...");

    await connectToMongoDB();

    const bloombergEvents = await scrapeBloomberg();
    const timesEvents = await scrape10Times();

    allEvents = [...bloombergEvents, ...timesEvents];

    await saveToDatabase(allEvents);
    mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
}

runScrapers().catch(console.error);
>>>>>>> Stashed changes:backend/functions/scrapers/web/eventScraper.js
