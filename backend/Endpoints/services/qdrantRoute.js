import express from 'express';
const { QdrantClient } = require('@qdrant/js-client-rest');

const qdrantRoute = express.Router();

qdrantRoute.post("/search/:collection", async (req, res) => {
    if (!process.env.QDRANT_CLOUD_URL || !process.env.QDRANT_APIKEY) {
        return res.status(500).json({ error: 'Qdrant configuration missing' });
    }

    const client = new QdrantClient({
        url: process.env.QDRANT_CLOUD_URL,
        apiKey: process.env.QDRANT_APIKEY,
    });

    const collectionName = req.params.collection;
    const { query_vector, limit, filter } = req.body;
    
    // Validate request parameters
    if (!Array.isArray(query_vector)) {
        return res.status(400).json({ error: 'query_vector must be an array' });
    }
    if (typeof limit !== 'number' || limit < 1) {
        return res.status(400).json({ error: 'limit must be a positive number' });
    }
    if (query_vector.length === 0) {
        return res.status(400).json({ error: 'query_vector cannot be empty' });
    }

    try {
        const searchParams = {
            vector: query_vector,
            limit: limit,
            with_payload: true,
            with_vectors: false
        };

        if (filter) {
            searchParams.filter = filter;
        }

        console.log('Searching with params:', {
            collection: collectionName,
            vectorLength: query_vector.length,
            limit,
            hasFilter: !!filter,
            vectorSample: query_vector.slice(0, 3) // Log first 3 values for debugging
        });

        const result = await client.search(collectionName, searchParams);
        console.log('Search result:', result);
        res.json(result);
    } catch (error) {
        console.error('Qdrant search error:', {
            message: error.message,
            collection: collectionName,
            status: error.response?.status,
            data: error.response?.data,
            stack: error.stack
        });

        if (error.response?.status === 403) {
            return res.status(403).json({ error: 'Authentication failed' });
        }
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        res.status(500).json({ 
            error: 'Search failed',
            details: error.message
        });
    }
});

export default qdrantRoute;