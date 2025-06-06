import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const newsRoute = express.Router();

newsRoute.get('/news', async (req, res) => {
  const newsApiKey = process.env.VUE_APP_NEWS_API_KEY;
  const newsApiUrl = `https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${newsApiKey}`;

  try {
    const newsResponse = await axios.get(newsApiUrl);
    const articles = newsResponse.data.articles;

    const checkArticlePromises = articles.map(async (article) => {
      try {
        const response = await axios.get(article.url);
        const xFrameOptions = response.headers['x-frame-options'];
        const contentSecurityPolicy = response.headers['content-security-policy'];

        let canDisplay = true;

        if (xFrameOptions) {
          canDisplay = false;
        } else if (contentSecurityPolicy) {
          const cspDirectives = contentSecurityPolicy.split(/[:;]/).map(d => d.trim());
          const frameAncestorsDirective = cspDirectives.find(d => d.startsWith('frame-ancestors'));

          if (frameAncestorsDirective) {
            const frameAncestorsValues = frameAncestorsDirective.split(' ').slice(1);
            if (frameAncestorsValues.includes("'none'") || frameAncestorsValues.includes("'self'")) {
              canDisplay = false;
            }
          }
        }

        return canDisplay ? article : null;
      } catch (error) {
        console.error('Error checking article URL:', article.url, error.message);
        return null;
      }
    });

    const validArticles = (await Promise.all(checkArticlePromises)).filter(article => article !== null);

    return res.status(200).json({ articles: validArticles });
  } catch (error) {
    console.error('Error processing URLs:', error.message);
    return res.status(500).json({ error: 'Failed to process URLs', details: error.message });
  }
});


newsRoute.post('/news', async (req, res) => {
  const keyword = req.body["keyword"];
  console.log(keyword);
  const newsApiKey = process.env.VUE_APP_NEWS_API_KEY;
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${newsApiKey}`;

  try {
    const newsResponse = await axios.get(newsApiUrl);
    const articles = newsResponse.data.articles;

    const checkArticlePromises = articles.map(async (article) => {
      try {
        const response = await axios.get(article.url);
        const xFrameOptions = response.headers['x-frame-options'];
        const contentSecurityPolicy = response.headers['content-security-policy'];

        let canDisplay = true;

        if (xFrameOptions) {
          canDisplay = false;
        } else if (contentSecurityPolicy) {
          const cspDirectives = contentSecurityPolicy.split(/[:;]/).map(d => d.trim());
          const frameAncestorsDirective = cspDirectives.find(d => d.startsWith('frame-ancestors'));

          if (frameAncestorsDirective) {
            const frameAncestorsValues = frameAncestorsDirective.split(' ').slice(1);
            if (frameAncestorsValues.includes("'none'") || frameAncestorsValues.includes("'self'")) {
              canDisplay = false;
            }
          }
        }

        return canDisplay ? article : null;
      } catch (error) {
        console.error('Error checking article URL:', article.url, error.message);
        return null;
      }
    });

    const validArticles = (await Promise.all(checkArticlePromises)).filter(article => article !== null);

    return res.status(200).json({ articles: validArticles });
  } catch (error) {
    console.error('Error processing URLs:', error.message);
    return res.status(500).json({ error: 'Failed to process URLs', details: error.message });
  }
});


export default newsRoute;
