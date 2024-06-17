const axios = require('axios');
require('dotenv').config(); // Ensure environment variables are loaded

exports.handler = async (event, context) => {
    console.log("Fetching and checking news URLs");
    const { category, country } = JSON.parse(event.body);
    const apiKey = process.env.NEWS_API_KEY;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight request success' })
        };
    }

    try {
        // Fetch news from NewsAPI
        const newsResponse = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                apiKey,
                category,
                country,
            },
        });

        const articles = newsResponse.data.articles.filter(article => article.title && article.urlToImage);
        const validArticles = [];

        for (const article of articles) {
            try {
                const response = await axios.get(article.url);
                const xFrameOptions = response.headers['x-frame-options'];
                const contentSecurityPolicy = response.headers['content-security-policy'];

                console.log(`Headers for ${article.url}:`, {
                    xFrameOptions,
                    contentSecurityPolicy,
                });

                let canDisplay = true;

                // Check for X-Frame-Options header
                if (xFrameOptions) {
                    canDisplay = false;
                } else if (contentSecurityPolicy) {
                    // Split the CSP by both colon and semicolon
                    const cspDirectives = contentSecurityPolicy.split(/[:;]/).map(d => d.trim());
                    const frameAncestorsDirective = cspDirectives.find(d => d.startsWith('frame-ancestors'));

                    if (frameAncestorsDirective) {
                        // Extract the frame-ancestors values
                        const frameAncestorsValues = frameAncestorsDirective.split(' ').slice(1);
                        if (frameAncestorsValues.includes("'self'") || frameAncestorsValues.some(value => value !== "'none'")) {
                            canDisplay = false;
                        }
                    }
                }

                if (canDisplay) {
                    validArticles.push(article);
                }
            } catch (error) {
                console.error('Error checking article URL:', article.url, error.message);
            }
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ articles: validArticles })
        };
    } catch (error) {
        console.error('Error fetching or processing news:', error.message);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to fetch or process news', details: error.message })
        };
    }
};
