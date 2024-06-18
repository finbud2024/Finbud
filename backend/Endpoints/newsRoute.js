import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();
const newsRoute = express.Router();


newsRoute.post('/check-urls', async (req, res) => {
  const { articles } = req.body;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'CORS preflight request success' });
  }

  try {
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

    return res.status(200).json({ articles: validArticles });
  } catch (error) {
    console.error('Error processing URLs:', error.message);
    return res.status(500).json({ error: 'Failed to process URLs', details: error.message });
  }
});

export default newsRoute;
