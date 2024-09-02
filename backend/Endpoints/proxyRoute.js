import express from 'express';
import axios from 'axios';
import { timeout } from 'd3';

const proxyRoute = express.Router();

proxyRoute.all('/proxy', async (req, res) => {
    console.log('in proxy route');
    try {
        const targetUrl = req.body.url;
        if(!targetUrl){
            return res.status(400).send('No target URL provided');
        }
        const method = req.body.method.toLowerCase();
        // Set up the configuration for the axios request
        let config = {
            method: method,
            url: targetUrl,
            headers: {
                ...req.body.headers,
                host: new URL(targetUrl).host,
            },
            params: req.body.params,  // Ensure params are passed correctly
            timeout: 5000,
        }
        // Only include the data property for POST, PUT, and PATCH requests
        if(method === 'post' || method === 'put' || method === 'patch'){
            config['data'] = req.body.data;
        }
        const response = await axios(config);
        // Set the CORS headers in returning response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        if (error.response) {
            // Forward the status code and error message from the target server
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            res.status(504).send('Gateway Timeout');
        } else {
            // Something happened in setting up the request
            res.status(500).send('Error setting up the request');
        }
    }
});

export default proxyRoute;