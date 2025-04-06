import axios from 'axios';
import { load } from "cheerio";
import { OpenAIEmbeddings } from '@langchain/openai';
import { VectorStore } from '@langchain/core/vectorstores';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import OpenAI from 'openai';

const SERPER_API_KEY = process.env.VUE_APP_SERPER_API_KEY;
const BRAVE_SEARCH_API_KEY = process.env.VUE_APP_BRAVE_SEARCH_API_KEY;
const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;
const DEPLOY_URL = process.env.VUE_APP_DEPLOY_URL;

// Set up OpenAI configuration
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getSources(message) {
  try {
    const encodedMessage = encodeURIComponent(message);
    const response = await axios.post(`${DEPLOY_URL}/proxy`, {
      url: `https://api.search.brave.com/res/v1/web/search?q=${encodedMessage}&count=10`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_SEARCH_API_KEY,
      }
    });
    const results = response.data.web.results.map(result => ({
      title: result.title,
      link: result.url,
      snippet: result.description,
      favicon: result.profile.img,
      host: result.profile.name
    }));
    return results;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
}

export async function get10BlueLinksContents(sources) {
  async function fetchWithTimeout(url, options = {}, timeout = 800) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  }

  function extractMainContent(html) {
    const $ = cheerio.load(html);
    $("script, style, head, nav, footer, iframe, img").remove();
    return $("body").text().replace(/\s+/g, " ").trim();
  }

  const promises = sources.map(async source => {
    try {
      const response = await fetchWithTimeout(source.link);
      const html = await response.text();
      const mainContent = extractMainContent(html);
      return { ...source, html: mainContent };
    } catch (error) {
      console.error(`Error processing ${source.link}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(source => source !== null);
}

export async function processAndVectorizeContent(contents, query) {
  const embeddings = new OpenAIEmbeddings();
  const allVectors = [];
  for (const content of contents) {
    if (content.html.length > 0) {
      try {
        const splitText = await new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 400 }).splitText(content.html);
        const vectorStore = await VectorStore.fromTexts(splitText, { title: content.title, link: content.link }, embeddings);
        const vectors = await vectorStore.similaritySearch(query, 4);
        allVectors.push(...vectors);
      } catch (error) {
        console.error(`Error processing content for ${content.link}:`, error);
      }
    }
  }
  return allVectors;
}

export async function getVideos(message) {
  const data = JSON.stringify({ q: message });
  try {
    // axios post request to the proxy endpoint
    const response = await axios.post(`${DEPLOY_URL}/proxy`, {
      method: 'POST',
      url: 'https://google.serper.dev/videos',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      data: data,
    });
    if (response.status === 403) {
      console.error("Forbidden: Check your API key and permissions.");
      return [];
    }
    const responseData = response.data;
    // Filter out videos without images
    const validLinks = await Promise.all(responseData.videos.map(async video => {
      const imageUrl = video.imageUrl;
      if(!imageUrl) return null;
      // Check if the image URL is valid
      const imageResponse = await axios.post(`${DEPLOY_URL}/proxy`, {
        method: 'HEAD',
        url: imageUrl,
      });
      if (imageResponse.status === 200) {
        return { title: video.title, imageUrl, link: video.link };
      }
      return null;
    }));
    console.log('validLinks:', validLinks);
    return validLinks.filter(link => link !== null).slice(0, 4);
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export async function getRelevantQuestions(sources, lan) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are a Question generator who generates in JSON an array of 3 follow-up questions in this language: ${lan}.
            The JSON schema should include {
              "followUp": [
                "Question 1",
                "Question 2", 
                "Question 3"
              ]
            }
          `
        },
        {
          role: "user",
          content: `Here are the top results from a similarity search: ${JSON.stringify(sources)}.`
        },
      ]
    });

    // Assuming the content is correctly formatted as JSON within the response text
    const messageContent = response.choices[0].message.content.trim();
    const jsonStart = messageContent.indexOf('{');
    const jsonEnd = messageContent.lastIndexOf('}') + 1;
    const jsonString = messageContent.substring(jsonStart, jsonEnd);
    const parsedResponse = JSON.parse(jsonString);

    return parsedResponse.followUp;
  } catch (error) {
    console.error('Error generating relevant questions:', error);
    throw error;
  }
}