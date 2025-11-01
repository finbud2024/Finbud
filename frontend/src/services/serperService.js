// Mock serperService.js - không cần API keys
import axios from 'axios';

const DEPLOY_URL = process.env.VUE_APP_DEPLOY_URL;

export async function getSources(message) {
  try {
    // Mock search results
    const mockResults = [
      {
        title: "Financial Planning Guide",
        link: "https://example.com/financial-planning",
        snippet: "Learn about financial planning and investment strategies",
        favicon: "https://example.com/favicon.ico",
        host: "Financial News"
      },
      {
        title: "Stock Market Analysis",
        link: "https://example.com/stock-analysis", 
        snippet: "Current stock market trends and analysis",
        favicon: "https://example.com/favicon.ico",
        host: "Market Watch"
      }
    ];
    
    console.log('Mock search results for:', message);
    return mockResults;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

export async function get10BlueLinksContents(sources) {
  // Mock content processing
  return sources.map(source => ({
    ...source,
    html: `Mock content for ${source.title}. This is sample financial content that would normally be scraped from the web.`
  }));
}

export async function processAndVectorizeContent(contents, query) {
  // Mock vectorization - return first 2 contents as "relevant"
  return contents.slice(0, 2).map(content => ({
    pageContent: content.html,
    metadata: { title: content.title, link: content.link }
  }));
}

export async function getVideos(message, count = 1) {
  // Mock video results
  const mockVideos = [
    {
      title: "Financial Education Video",
      imageUrl: "https://via.placeholder.com/300x200?text=Financial+Video",
      link: "https://example.com/financial-video"
    }
  ];
  
  console.log('Mock video results for:', message);
  return mockVideos.slice(0, count);
}

export async function getRelevantQuestions(sources, lan) {
  // Mock follow-up questions
  const mockQuestions = [
    "What are the best investment strategies for beginners?",
    "How can I start building an emergency fund?",
    "What should I know about retirement planning?"
  ];
  
  console.log('Mock follow-up questions generated');
  return mockQuestions;
}
