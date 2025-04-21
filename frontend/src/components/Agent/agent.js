import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;
const DEEPSEEK_API_KEY = process.env.VUE_APP_DEEPSEEK_KEY;
const NEWS_API_KEY = process.env.VUE_APP_AGENT_API_KEY;

function getLLM(modelName = 'chatgpt') {
  if (modelName === 'deepseek') {
    return new ChatOpenAI({
      model: "deepseek-chat",
      apiKey: DEEPSEEK_API_KEY,
      temperature: 0.3
    });
  }
  return new ChatOpenAI({
    model: "gpt-4o",
    apiKey: OPENAI_API_KEY,
    temperature: 0.3
  });
}

export async function* processFinancialNews(ticker, category, modelName = 'chatgpt') {
  console.log("Using model:", modelName);
  try {
    yield { step: 'loading', status: 'started' };
    const newsData = await fetchFinancialNews(ticker, category);
    yield { step: 'loading', status: 'completed' };

    yield { step: 'splitting', status: 'started' };
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });
    const documents = newsData.map(article => ({
      pageContent: `Title: ${article.title}\nDate: ${article.date || article.datetime ? new Date(article.datetime * 1000).toISOString() : 'Unknown'}\nSource: ${article.source || article.site || 'Unknown'}\nContent: ${article.description || article.summary || article.content || ''}`,
      metadata: {
        source: article.url || article.link || '',
        title: article.title,
        date: article.date || (article.datetime ? new Date(article.datetime * 1000).toISOString() : 'Unknown')
      }
    }));
    const splits = await textSplitter.splitDocuments(documents);
    yield { step: 'splitting', status: 'completed' };

    yield { step: 'extracting', status: 'started' };
    const data = await extractInsights(splits, modelName);
    yield { step: 'extracting', status: 'completed' };

    yield { step: 'summarizing', status: 'started' };
    const newsSummary = await generateSummary(data, modelName);
    const formattedSummary = formatSummary(newsSummary);
    yield { step: 'summarizing', status: 'completed', result: formattedSummary };

    yield { step: 'executiveSummary', status: 'started' };
    const executiveSummary = await generateReportSummary(newsSummary, data, modelName);
    const formattedExecutiveSummary = formatSummary(executiveSummary);
    yield { step: 'executiveSummary', status: 'completed', result: formattedExecutiveSummary };

    yield { step: 'recommending', status: 'started' };
    const relatedContent = await findSimilarContent(newsSummary, splits, modelName);
    const formattedRecommendations = formatRecommendations(relatedContent);
    yield { step: 'recommending', status: 'completed', result: formattedRecommendations };

    yield {
      step: 'done',
      status: 'completed',
      result: {
        summary: formattedSummary,
        rawSummary: newsSummary,
        extractedData: data,
        recommendations: formattedRecommendations,
        rawRecommendations: relatedContent,
        executiveSummary: formattedExecutiveSummary,
        rawExecutiveSummary: executiveSummary
      }
    };
  } catch (error) {
    console.error("Error in news processing:", error);
    yield {
      step: 'error',
      status: 'failed',
      message: error.message
    };
  }
}

export async function fetchFinancialNews(ticker, category) {
  if (!NEWS_API_KEY) {
    throw new Error("No API key provided for financial news service");
  }
  
  try {
    let apiUrl;
    if (ticker) {
      apiUrl = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${getDateString(30)}&to=${getDateString(0)}&token=${NEWS_API_KEY}`;
    } else {
      apiUrl = `https://finnhub.io/api/v1/news?category=${category}&token=${NEWS_API_KEY}`;
    }

    const response = await fetch(apiUrl);
    
    const data = await response.json();
    
    const articles = data.articles || data || data.news || data.data || [];
    
    if (articles.length === 0) {
      throw new Error("No news articles found for the specified criteria");
    }
    
    return articles.slice(0, 15);
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error; 
  }
}

export function getDateString(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export async function extractInsights(chunks, modelName) {
  const model = getLLM(modelName);
  const dataExtractionPrompt = ChatPromptTemplate.fromTemplate(`
    You are a senior financial analyst specializing in macroeconomic trends, equity markets, and sector-specific developments.
    You aim to help to help the Chief Investment Officer and the investment team to make informed decisions based on financial news.
    Your task is to help the user to quickly analyze and extract key information from financial news articles.
    You will classify the news, analyze sentiment, identify key entities, summarize the content, and assess potential market impact.
    
    # TASK
    Analyze and extract key information from the following financial news article:
    
    {text}
    
    # OUTPUT REQUIREMENTS
    Provide a structured analysis with the following components:
    
    ## CLASSIFICATION
    - PRIMARY CATEGORY: [Macro Economy | Company-Specific | Sector/Industry | Regulatory | Market Sentiment]
    - SECONDARY CATEGORY: [Earnings | M&A | Leadership | Policy | Innovation | Crisis | Other]
    
    ## SENTIMENT ANALYSIS
    - SENTIMENT: [Strongly Negative (-2) | Negative (-1) | Neutral (0) | Positive (+1) | Strongly Positive (+2)]
    - CONFIDENCE: [Low | Medium | High]
    
    ## KEY ENTITIES
    - COMPANIES: List all mentioned companies with ticker symbols if available
    - SECTORS: List any industries/sectors this impacts
    - PEOPLE: List key individuals mentioned and their roles
    
    ## SUMMARY
    Provide a 2-3 sentence professional summary of the most important information
    
    ## POTENTIAL MARKET IMPACT
    Briefly assess potential market implications (1-2 sentences)
  `);
  
  const extractionChain = dataExtractionPrompt.pipe(model);
  
  const extractedData = [];
  const batchSize = 3; 
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const batchPromises = batch.map(async (chunk, batchIndex) => {
      try {
        const index = i + batchIndex;
        if (!chunk.pageContent || chunk.pageContent.trim() === '') {
          console.log(`Skipping empty chunk ${index+1}`);
          return null;
        }
        
        const result = await extractionChain.invoke({ text: chunk.pageContent });
        return result.content;
      } catch (error) {
        console.error(`Error processing chunk ${i+batchIndex+1}:`, error);
        return `[Error extracting data from news chunk ${i+batchIndex+1}]`;
      }
    });
    
    // Add delay between batches to avoid rate limits
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const batchResults = await Promise.all(batchPromises);
    extractedData.push(...batchResults.filter(result => result !== null));
  }
  
  if (extractedData.length === 0) {
    throw new Error("No insights could be extracted from any news chunks");
  }
  
  return extractedData;
}

export async function generateSummary(extractedData, modelName) {
  if (!extractedData || extractedData.length === 0) {
    throw new Error("No data available for summary generation");
  }
  
  try {
    const model = getLLM(modelName)
    
    const summaryPrompt = ChatPromptTemplate.fromTemplate(`
      You are the Chief Investment Strategist at a prestigious asset management firm tasked with synthesizing financial intelligence into actionable insights for clients.
      
      # ANALYTICAL FRAMEWORK
      You will analyze multiple news items that have been classified and summarized by our research team.
      
      # INPUT DATA
      {extracted_data}
      
      # REPORT STRUCTURE
      Create a comprehensive financial intelligence report with the following sections:
      
      ## 1. MARKET OVERVIEW
      - Synthesize the macro trends across all news items
      - Identify any conflicting signals and explain their significance
      - Provide an overall market direction assessment
      
      ## 2. SECTOR ANALYSIS
      - Identify sectors receiving most attention (positive and negative)
      - Compare relative sentiment across sectors
      - Highlight any sector rotation signals
      
      ## 3. CORPORATE DEVELOPMENTS
      - Summarize significant company-specific news
      - Group by theme (earnings, leadership, strategy, etc.)
      - Identify potential M&A or restructuring patterns
      
      ## 4. REGULATORY LANDSCAPE
      - Analyze regulatory developments and policy changes
      - Assess potential impact on markets and specific sectors
      - Identify regulatory risks and opportunities
      
      ## 5. RISK ASSESSMENT
      - Outline key risks identified across all news items
      - Rate risks by probability and potential impact
      - Highlight any systemic risks that could affect multiple sectors
      
      ## 6. INVESTMENT IMPLICATIONS
      - Translate news patterns into actionable investment theses
      - Identify potential outperformers and underperformers
      - Suggest asset allocation adjustments based on the news landscape
      
      # FORMATTING REQUIREMENTS
      - Write in a professional, analytical tone appropriate for institutional investors
      - Support assertions with specific references to news items
      - Use precise financial terminology
      - Format with clear headings and strategic use of bullet points
      - Maintain objectivity while providing clear actionable insights
    `);
    
    const summaryChain = summaryPrompt.pipe(model);
    const combinedData = extractedData.join("\n\n");
    
    const summary = await summaryChain.invoke({ extracted_data: combinedData });
    
    return summary.content;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate financial report");
  }
}

export async function findSimilarContent(summary, docSplits, modelName) {
  if (!summary || summary.trim() === '') {
    throw new Error("No valid summary available for finding similar content");
  }
  
  try {
    const model = getLLM(modelName);
    
    let similarContentSummary = "";
    
    try {
      const embeddings = new OpenAIEmbeddings({
        apiKey: OPENAI_API_KEY
      });
      const vectorStore = await MemoryVectorStore.fromDocuments(docSplits, embeddings);
      
      const searchQuery = summary.substring(0, 500);
      const similarDocs = await vectorStore.similaritySearch(searchQuery, 5);

      if (similarDocs && similarDocs.length > 0) {
        similarContentSummary = "Based on similarity analysis, these news items are most relevant:\n";
        similarDocs.forEach((doc, index) => {
          similarContentSummary += `\n${index + 1}. ${doc.metadata.title || 'Untitled'} (${doc.metadata.date || 'Unknown date'})\n`;
          similarContentSummary += `   ${doc.pageContent.substring(0, 150)}...\n`;
        });
      }
    } catch (embeddingError) {
      console.error("Error in embeddings or similarity search:", embeddingError);
      similarContentSummary = "Unable to perform similarity analysis due to technical limitations.";
    }
    
    const recommendationPrompt = ChatPromptTemplate.fromTemplate(`
      You are the Director of Research at a global financial institution with extensive knowledge of financial data sources, publications, and expert networks.
      
      # TASK
      Based on this financial intelligence report:
      {summary}
      
      ${similarContentSummary ? `\nAnd these similar news items identified by our system:\n${similarContentSummary}\n` : ''}
      
      Create a comprehensive "SUPPLEMENTARY RESOURCES" section that would provide significant additional value to professional investors.
      
      # OUTPUT STRUCTURE
      
      ## SUPPLEMENTARY RESOURCES
      
      ### 1. DATA SOURCES & ANALYTICS
      - Identify 2 specific financial data platforms that would provide crucial metrics for monitoring the situations described in the report
      - For each platform:
        * Name the specific datasets/tools most relevant
        * Explain which metrics should be tracked and why
        * Describe the unique advantage of this particular data source
      
      ### 2. RESEARCH PUBLICATIONS
      - Recommend 2 specific research papers/publications that would provide deeper context or analysis
      - For each publication:
        * Cite the title, author/organization, and recency
        * Explain the unique methodology or perspective it offers
        * Describe how it complements or challenges the insights in our report
      
      ### 3. EXPERT PERSPECTIVES
      - Identify 2 specific financial experts whose commentary would be particularly valuable
      - For each expert:
        * Provide their name, current role, and relevant background
        * Explain their specific area of expertise relevant to current conditions
        * Note where investors can access their latest commentary (specific programs, publications, etc.)
      
      # FORMATTING REQUIREMENTS
      - Write in a tone appropriate for institutional investors
      - Be specific rather than generic in recommendations
      - Ensure all recommendations directly relate to the most significant insights in the report
      - Format as the final section of a professional financial report
    `);
    
    const recommendationChain = recommendationPrompt.pipe(model);
    const recommendations = await recommendationChain.invoke({ summary });
    
    return recommendations.content;
  } catch (error) {
    console.error("Error finding similar content:", error);
    throw new Error("Failed to generate supplementary resources");
  }
}

export async function generateReportSummary(summary, extractedData, modelName) {
  try {
    const model = getLLM(modelName)
    
    const reportSummaryPrompt = ChatPromptTemplate.fromTemplate(`
      You are the Chief Investment Officer at a major asset management firm responsible for translating complex financial analyses into clear executive guidance.
      
      # TASK
      Create a concise, high-impact executive summary for this comprehensive financial intelligence report:
      
      {summary}
      
      # OUTPUT STRUCTURE
      
      ## EXECUTIVE SUMMARY
      
      ### MARKET INTELLIGENCE BRIEF
      Provide 3-4 sentences that capture the most critical market dynamics and their implications
      
      ### KEY METRICS
      - MARKET SENTIMENT: Score the overall market sentiment on a scale of 1-10 (1=extremely bearish, 10=extremely bullish) with brief justification
      - TOP ENTITIES: List the 3 most frequently mentioned companies/assets with brief context for each
      - SECTOR HEAT MAP: Identify 2-3 sectors with strongest positive and negative signals
      - RISK ASSESSMENT: Provide an overall risk level (Low, Moderate, High, Extreme) with primary risk factors
      
      ### STRATEGIC POSITIONING
      - INVESTMENT STANCE: Recommended investor action (Defensive, Neutral, Opportunistic, Aggressive)
      - TACTICAL RECOMMENDATIONS: 2-3 specific tactical moves justified by the intelligence
      - TIME HORIZON: Specify if these are short-term (0-3 months), medium-term (3-12 months) or long-term (12+ months) recommendations
      
      # FORMATTING REQUIREMENTS
      - Write in an authoritative, decisive executive tone
      - Focus on actionable insights rather than descriptive analysis
      - Use precise, impactful language appropriate for C-suite executives
      - Format this as the opening section of a professional financial report
      - Total length should not exceed one page equivalent (approximately 300-400 words)
    `);
    
    const reportChain = reportSummaryPrompt.pipe(model);
    const execSummary = await reportChain.invoke({ summary });
    
    return execSummary.content;
  } catch (error) {
    console.error("Error generating report summary:", error);
    throw new Error("Failed to generate executive summary");
  }
}

export function formatSummary(summary) {
  if (!summary) return '';

  let html = summary.trim();

  // Handle headers
  html = html.replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');

  // Handle bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Handle numbered lists
  html = html.replace(/(^|\n)(\d+)\. (.*?)(?=\n\d+\. |\n\n|$)/gs, (match, p1, p2, p3) => {
    const lines = match.trim().split(/\n(?=\d+\. )/g);
    const listItems = lines.map(line => {
      const parts = line.match(/^\d+\. (.*)/);
      return parts ? `<li>${parts[1]}</li>` : '';
    });
    return `<ol class="list-decimal pl-6 space-y-2 mt-2 mb-4">${listItems.join('')}</ol>`;
  });

  // Handle inline bullet lists (e.g., multiple `- item` on one line)
  html = html.replace(/- \*\*(.*?)\*\*: (.*?)(?= - \*\*|$)/gs, (_, key, value) => {
    return `<li><strong>${key}</strong>: ${value.trim()}</li>`;
  });

  // Handle standalone bullets
  html = html.replace(/(^|\n)- (.*?)(?=\n- |\n\n|$)/gs, (match, p1, p2) => {
    const lines = match.trim().split(/\n(?=- )/g);
    const listItems = lines.map(line => {
      const parts = line.match(/^- (.*)/);
      return parts ? `<li>${parts[1]}</li>` : '';
    });
    return `<ul class="list-disc pl-6 space-y-2 mt-2 mb-4">${listItems.join('')}</ul>`;
  });

  // Handle paragraphs and spacing
  html = html
    .replace(/\n{2,}/g, '</p><p class="my-3">') // paragraph break
    .replace(/\n/g, ' ')                        // line break to space
    .replace(/^/, '<p class="my-3">')
    .concat('</p>');

  return `<div class="summary-section">${html}</div>`;
}

export function formatRecommendations(recommendations) {
  if (!recommendations) return '';

  let html = recommendations;

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Numbered lists (e.g., "1. Something")
  html = html.replace(/(^|\n)(\d+)\. (.*?)(?=\n\d+\. |\n\n|$)/gs, (match, p1, p2, p3) => {
    const lines = match.trim().split(/\n(?=\d+\. )/g);
    const listItems = lines.map(line => {
      const parts = line.match(/^\d+\. (.*)/);
      return parts ? `<li>${parts[1]}</li>` : '';
    });
    return `<ol class="list-decimal pl-6 space-y-1 mt-2 mb-4">${listItems.join('')}</ol>`;
  });

  // Bullet point lists
  html = html.replace(/(^|\n)- (.*?)(?=\n- |\n\n|$)/gs, (match, p1, p2) => {
    const lines = match.trim().split(/\n(?=- )/g);
    const listItems = lines.map(line => {
      const parts = line.match(/^- (.*)/);
      return parts ? `<li>${parts[1]}</li>` : '';
    });
    return `<ul class="list-disc pl-6 space-y-1 mt-2 mb-4">${listItems.join('')}</ul>`;
  });

  // Paragraphs
  html = html
    .replace(/\n{2,}/g, '</p><p class="my-3">') // double newlines → new paragraph
    .replace(/\n/g, ' ')                         // single newlines → space
    .replace(/^/, '<p class="my-3">')            // wrap first paragraph
    .concat('</p>');

  // Final wrapper
  return `<div class="recommendations-section">${html}</div>`;
}

export function startFinancialAnalysis(ticker = 'AAPL', category = 'finance') {
  return processFinancialNews(ticker, category);
}

export const utils = {
  formatSummary,
  formatRecommendations,
  getDateString
};
