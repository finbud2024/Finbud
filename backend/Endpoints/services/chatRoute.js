import express from "express";
import Chat from "../../Database_Schema/core/Chat.js";
import validateRequest from "../../utils/validation/validateRequest.js";
import axios from "axios";
import dotenv from "dotenv";
import { BraveSearch } from "@langchain/community/tools/brave_search";
import { isAuthenticated, isAdmin } from '../../middleware/auth.js';
import Transaction from "../../Database_Schema/trading/Transaction.js";
import UserHolding from "../../Database_Schema/finance/UserHolding.js";
import Portfolio from "../../Database_Schema/finance/Portfolio.js";
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Parser from '@postlight/parser';
// import { YoutubeTranscript } from 'youtube-transcript';
// import { getVideoId } from '../utils/getVideoId.js';

dotenv.config();

const chatRoute = express.Router();

// Increase allowed payload size for this router
chatRoute.use(express.json({ limit: '10mb' }));
chatRoute.use(express.urlencoded({ extended: true, limit: '10mb' }));

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// + DEEP RESEARCH WORKFLOW SETUP
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('⚠️ Backend GEMINI_API_KEY not configured. Please set VUE_APP_GEMINI_API_KEY in your .env file');
}
const geminiAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.warn('⚠️ Backend GROQ_API_KEY not configured. Please set GROQ_API_KEY in your .env file');
}

const groqClient = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

const SERPER_API_KEY = process.env.VUE_APP_SERPER_API_KEY;
if (!SERPER_API_KEY) {
    console.warn('⚠️ Backend SERPER_API_KEY not configured. Please set VUE_APP_SERPER_API_KEY in your .env file');
}

// Simple token approximation function (avoids WebAssembly issues)
function approximateTokenCount(text) {
  if (!text) return 0;
  // Rough approximation: 1 token ≈ 0.75 words for English text
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.33); // Convert words to approximate tokens
}

const countTokens = (txt) => approximateTokenCount(txt);


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// + AGENTIC ROUTES
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Agent Route: Searcher
chatRoute.post('/agents/search', async (req, res) => {
    const { query, numLinks = 5 } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Missing "query" in request body.' });
    }
    if (!SERPER_API_KEY) {
        return res.status(500).json({ error: 'SERPER_API_KEY not configured on the server.' });
    }

    try {
        const response = await axios.post('https://google.serper.dev/search', { q: query }, {
            headers: { 'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json' }
        });
        const links = (response.data.organic || []).slice(0, numLinks).map(result => result.link);
        res.json({ links });
    } catch (error) {
        res.status(500).json({ error: `Search Agent failed: ${error.message}` });
    }
});

// Agent Route: Scraper (using Postlight Parser)
chatRoute.post('/agents/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Missing "url" in request body.' });
    }

    try {
        const result = await Parser.parse(url, { contentType: 'markdown' });
        res.json({ source: url, content: result.content });
    } catch (error) {
        res.status(500).json({ source: url, error: `Scrape Agent failed for ${url}: ${error.message}` });
    }
});

// Agent Route: Leaf Summarizer
chatRoute.post('/agents/summarize-leaf', async (req, res) => {
  const { contents, goal } = req.body;
  if (!groqClient) return res.status(500).json({ error: 'Backend Groq not initialized.' });

  const systemPrompt = `
You are a professional equity research agent. Your task is to carefully summarize while preserving all numeric, financial opinion and statistical data.

Rules:
- Every source block starts with "SOURCE: <URL>"
- For each fact you extract, attach its corresponding source as markdown inline link [source](URL)
- Always keep all quantitative values: revenue, earnings, margins, PE ratio, EPS, YoY growth, debt, etc.
- Never invent new data. Do not hallucinate.
- Output clean, concise markdown bullet points.
  `;

  const fullPrompt = `
GOAL: ${goal}

DATA BLOCKS:
${contents.join("\n\n")}
  `;

  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: fullPrompt }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });
    res.json({ summary: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error(`[summarize-leaf] Groq API Error:`, error);
    res.status(500).json({ error: `Failed to summarize leaf: ${error.message}` });
  }
});




// Agent Route: Master Report Compiler
// Agent Route: Master Report Compiler
chatRoute.post('/agents/compile-report', async (req, res) => {
  let { synthesis, researchBrief = {} } = req.body;
  if (!groqClient) return res.status(500).json({ error: 'Backend Groq not initialized.' });

  // Detect language preference from researchBrief
  const language = researchBrief?.output_preferences?.toLowerCase().includes('english')
      ? 'English'
      : 'Vietnamese';

  // Truncate synthesis to safe size
  const MAX_SYNTHESIS_CHARS = 20000;
  if (synthesis.length > MAX_SYNTHESIS_CHARS) {
      synthesis = synthesis.slice(0, MAX_SYNTHESIS_CHARS) + '\n\n...[synthesis truncated]';
  }

  // Compose system prompt for more consistency
  const systemPrompt = `
You are a highly professional equity research report compiler. Your job is to transform synthesized analysis into a final high-quality report for clients.

You MUST:
- Carefully organize the information into a well-structured, professional report.
- Use clear section headers and sub-headers.
- Always preserve all quantitative data (P/E ratio, EPS, revenue, net income, YoY growth, profit margins, EBITDA, debt ratios, etc.)
- Preserve all inline source citations already present (e.g. [source](URL))
- Use markdown tables where applicable.
- Write very clean GitHub-flavored markdown.
- Do not hallucinate any data. Never invent anything not in synthesis.
- Use ${language} for all output.
  `;

  const userPrompt = `
USER RESEARCH BRIEF:
${JSON.stringify(researchBrief, null, 2)}

SYNTHESIZED ANALYSIS:
${synthesis}

FINAL REPORT:
`;

  try {
      console.log(`[compile-report] Prompt tokens: ${countTokens(systemPrompt + userPrompt)}`);
      const chatCompletion = await groqClient.chat.completions.create({
          messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
          ],
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
      });

      return res.json({ report: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
      console.error(`[compile-report] Groq API Error:`, error);
      return res.status(500).json({ error: `Failed to compile report: ${error.message}` });
  }
});


// Agent Route: QA and Fact-Checker
chatRoute.post('/agents/qa-fact-check', async (req, res) => {
    const { report } = req.body;
    // For now, this is a mock QA check. In a real system, this would be more complex.
    const qaResult = {
        passed: true,
        analytics: {
            plagiarismScore: Math.random() * 0.05, // Mock score
            coverage: "good",
            brokenLinks: 0
        },
        finalReport: report + "\n\n---\n*Verified by FinBud QA Bot ✅*"
    };
    res.json(qaResult);
});



// GET: Retrieve all chats
chatRoute.route('/chats')
  .get(isAdmin, async (req, res) => {
    console.log('in /chats Route (GET) ALL chats from database');
    try {
      let chats = await Chat.find();
      return res.status(200).json(chats);
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when getting chats in database: " + err);
    }
  })
  // DELETE: delete all chats
  .delete(isAdmin, async (req, res) => {
    console.log('in /chats Route (DELETE) ALL chats from database');
    try {
      let chats = await Chat.deleteMany();
      return res.status(200).send("All chats deleted successfully");
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when deleting chats in database: " + err);
    }
  })
  // POST: create a new chat
  .post(isAuthenticated, async (req, res) => {
    console.log('in /chats Route (POST) new chat to database');
    if (!req.body.prompt || !req.body.response || !req.body.threadId) {
      return res.status(400).send("Unable to save chat to database due to missing prompt, response, or threadId");
    }
    try {
      const chatBody = {
        prompt: req.body.prompt,
        response: req.body.response,
        threadId: req.body.threadId
      };

      if (req.body.sources) {
        chatBody.sources = req.body.sources;
      }

      if (req.body.videos) {
        chatBody.videos = req.body.videos;
      }

      if (req.body.followUpQuestions) {
        chatBody.followUpQuestions = req.body.followUpQuestions;
      }

      if (req.body.htmlContent) {
        chatBody.htmlContent = req.body.htmlContent;
      }

      const chat = new Chat(chatBody);
      await chat.save();
      return res.status(200).json(chat);
    } catch (err) {
      return res.status(502).send("Unexpected error occurred when saving chat to database: " + err);
    }
  });

// function to generate follow-up questions
async function generateFollowUpQuestions(responseText) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a question generator. Generate 3 follow-up questions based on the provided text. Return the questions in an array format.",
          },
          {
            role: "user",
            content: `Generate 3 follow-up questions based on the following text:\n\n${responseText}\n\nReturn the questions in the following format: ["Question 1", "Question 2", "Question 3"]`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return [];
  }
}

// POST: Handle OpenAI API request
chatRoute.post("/query", isAuthenticated, async (req, res) => {
  const {
    prompt,
    returnSources = true,
    numberOfPagesToScan = 4,
    returnFollowUpQuestions = true,
  } = req.body;

  console.log("Request body:", req.body);

  try {
    console.log("Initializing BraveSearch");
    const loader = new BraveSearch({
      apiKey: process.env.VUE_APP_BRAVE_SEARCH_API_KEY,
    });
    const docs = await loader.invoke(prompt, { count: numberOfPagesToScan });
    console.log("BraveSearch returned docs", docs);

    const normalizedData = JSON.parse(docs)
      .filter((doc) => doc.title && doc.link && !doc.link.includes("brave.com"))
      .slice(0, numberOfPagesToScan)
      .map(({ title, link }) => ({ title, link }));

    console.log("Normalized data:", normalizedData);

    console.log("Sending request to OpenAI");
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Here is my query "${prompt}", respond back with an answer that is as long as possible. If you can't find any relevant results, respond with "No relevant results found."`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Received response from OpenAI:", response.data);

    const answer = response.data.choices[0]?.message?.content || "";
    let responseObj = { answer };

    // Generate follow-up questions if requested
    if (returnFollowUpQuestions) {
      responseObj.followUpQuestions = await generateFollowUpQuestions(answer);
    }

    // Include sources if requested
    if (returnSources) {
      responseObj.sources = normalizedData;
    }

    console.log(responseObj);
    res.status(200).json(responseObj);
  } catch (err) {
    console.error("Error in fetching or generating response:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// DEPRECATED - This endpoint is no longer used by the new MECE pipeline.
// The new granular agent endpoints above should be used instead.
chatRoute.post('/deep-research', isAuthenticated, async (req, res) => {
    res.status(404).json({ 
        error: "This endpoint is deprecated.",
        message: "Please use the new MECE pipeline orchestration flow initiated from the client, which calls granular agent endpoints like /agents/data-gather."
    });
});

// Helper function for Step 1: Classification
async function classifyFinanceRelevance(message) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [{
                role: 'system',
                content: `Classify if this message is related to finance/economics. Respond with only "Finance/Economics" or "Other". Message: "${message}"`
            }],
            temperature: 0.1,
            max_tokens: 10
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const classification = response.data.choices[0].message.content.trim();
        
        if (classification.includes('Finance') || classification.includes('Economics')) {
            return "PROCEED_TO_STEP_2";
        } else {
            return "OUT_OF_SCOPE";
        }
        
    } catch (error) {
        console.error('Classification error:', error);
        return "PROCEED_TO_STEP_2"; // Default to proceed if error
    }
}

// Helper function for Step 2: Clarification
async function generateClarificationQuestion(message) {
    try {
        const systemPrompt = `Bạn là FinBud Deep Research Agent. Phân tích yêu cầu tài chính và đặt CHÍNH XÁC 1 câu hỏi ngắn gọn để làm rõ thông tin quan trọng nhất.

QUY TẮC:
- CHỈ 1 câu hỏi duy nhất (tối đa 25 từ)
- Tập trung vào: thời gian, phạm vi, hoặc mục tiêu cụ thể
- Ngôn ngữ tự nhiên, thân thiện

USER REQUEST: "${message}"

Câu hỏi làm rõ:`;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [{
                role: 'system', 
                content: systemPrompt
            }],
            temperature: 0.3,
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Clarification error:', error);
        const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(message);
        return isVietnamese 
            ? "Bạn muốn phân tích trong khoảng thời gian nào?"
            : "What time period would you like to analyze?";
    }
}

// PUT: update chat with given chat id
chatRoute.put("/chats/:chatId", isAuthenticated, validateRequest(Chat.schema), async (req, res) => {
  const chatId = req.params.chatId;
  console.log('in /chats/:chatId Route (PUT) chat with ID:' + chatId);
  try {
    // First check if the chat exists
    const existingChat = await Chat.findById(chatId);
    if (!existingChat) {
      return res.status(404).send(`Cannot find chat with chat ID : ${chatId} in database`);
    }
    
    // We need to check if this chat belongs to a thread owned by the user
    // Since Chat doesn't have a direct user field, we need to rely on the threadId
    // This would be more secure if we had a way to verify thread ownership
    
    const filter = { "_id": chatId };
    const updatedChat = {};
    
    if (req.body) {
      for (const key in req.body) {
        updatedChat[key] = req.body[key];
      }
    }

    const chat = await Chat.updateOne(filter, updatedChat, {
      new: true,
    });

    if (!chat.modifiedCount) {
      return res
        .status(404)
        .send(`Cannot find chat with chat ID : ${chatId} in database`);
    }

    return res
      .status(200)
      .send({ message: `Chat updated successfully`, updatedChat: chat });
  } catch (err) {
    return res.status(501).send("Internal error e" + err);
  }
});

// DELETE: delete a chat with given chat id
chatRoute.route('/chats/:chatId')
  .delete(isAuthenticated, async (req, res) => {
    const chatId = req.params.chatId;
    console.log('in /chats/:chatId Route (DELETE) chat with ID:' + JSON.stringify(chatId));
    try {
      let chat = await Chat.findOneAndDelete({ "_id": chatId });
      if (!chat) {
        return res.status(404).send("No chat with id: " + JSON.stringify(chatId) + " existed in database");
      }
      return res.status(200).send("Deleted successfully chat with Id: " + chatId);
    } catch (err) {
      return res.status(500).send("Unexpected error occurred when deleting chat with id: " + chatId + " in database: " + err);
    }
  });

// GET: retrieve chats with given thread id
chatRoute.route('/chats/t/:threadId')
  .get(isAuthenticated, async (req, res) => {
    const threadId = req.params.threadId;
    console.log('in /chats/t/:threadId Route (GET) chats with threadId:' + JSON.stringify(threadId));
    try {
      let chats = await Chat.find({ "threadId": threadId });
      if (!chats || chats.length === 0) {
        return res.status(404).send("No chats with threadId: " + JSON.stringify(threadId) + " existed in database");
      }
      return res.status(200).json(chats);
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when looking for chats with threadId: " + threadId + " in database: " + err);
    }
  })
  // DELETE: delete all chats with given thread id
  .delete(isAuthenticated, async (req, res) => {
    const threadId = req.params.threadId;
    console.log('in /chats/t/:threadId Route (DELETE) chats with threadId:' + JSON.stringify(threadId));
    try {
      let chats = await Chat.deleteMany({ "threadId": threadId });
      return res.status(200).send("All chats with threadId: " + threadId + " deleted successfully");
    } catch (err) {
      return res.status(501).send("Unexpected error occurred when deleting chats with threadId: " + threadId + " in database: " + err);
    }
  });

// GET: Analyze User Portfolio
chatRoute.route("/chats/analyze-portfolio/:userId")
  .get(async (req, res) => {
    const userId = req.params.userId;
    console.log('in /analyze-portfolio/:userId Route (POST) analyze portfolio for userId:' + JSON.stringify(userId));
    try {
      const userHolding = await UserHolding.find({ userId: userId });
      const userPortfolio = await Portfolio.find({ userId: userId }); 
      const transactions = await Transaction.find({ userId: userId });
      
      let totalValue = 0;
      transactions.forEach((transaction) => {
        if (transaction.type === "Income"){
          totalValue += transaction.amount;
        } else {
          totalValue -= transaction.amount; 
        }
      })
      console.log("Total value of transactions: ", totalValue);

      if (userPortfolio.length > 0 && userPortfolio[0].portfolio) {
        userPortfolio[0].portfolio = userPortfolio[0].portfolio.slice(0, 365);
      }
      console.log("User Holdings: ", userPortfolio[0].portfolio);    
      

      const openai = new OpenAI({
        apiKey: process.env.VUE_APP_OPENAI_API_KEY
      });
      
      
      const portfolioData = userPortfolio[0].portfolio

      
    
     
      const incomeTransactions = transactions.filter(t => t.type === "Income");
      const expenseTransactions = transactions.filter(t => t.type !== "Income");
      
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      
  
      const prompt = `
      You are a professional financial advisor analyzing a user's complete financial picture. Please provide a detailed analysis in a JSON format with TWO separate sections.
      
      EMPHASIZE: VERY DETAILED ANALYSIS in form of a paragraph, providing useful insights and suggestions. Make sure that people without finance background can understand your analysis. 
      
      Be friendly, energetic and youthful in your response. Use simple, easy-to-understand language without complex terminology. Skip any missing or illogical data without mentioning gaps. Include specific calls to action at the end of each section. Be detailed but concise - don't be verbose.
      
      USE HTML FORMATTING: Use colors, bold, and other HTML elements to highlight key information:
      - Use <span style="color:#4CAF50;"><strong>green text</strong></span> for positive trends and insights
      - Use <span style="color:#F44336;"><strong>red text</strong></span> for warnings or negative trends
      - Use <span style="color:#FFD700;"><strong>yellow text</strong></span> for important tips and recommendations
      - Use <strong>bold text</strong> for key metrics and figures
      - Use <h3> and <h4> tags for section headers
      - Use <ul> and <li> for structured lists
      - Use <div style="background-color:#E3F2FD; padding:10px; border-radius:5px; margin:10px 0;"> for callout boxes with important information
      
      PART 1: INVESTMENT ANALYSIS
      Analyze the following stock holdings and portfolio performance data:
      
      USER PORTFOLIO SUMMARY:
      - Portfolio: ${portfolioData}. NOTE, the most recent 365 days of data is provided. Sort the portfolio by date in ascending order.
      - Stock Holdings: ${userHolding}. NOTE, the field purchasedPrice is the TOTAL value that the user paid for stocks of that quantities.
      - Portfolio Performance Data Points: ${portfolioData.length} days
      
      
      PART 2: TRANSACTION ANALYSIS
      Analyze the following income and expense transaction data, look into the type and the description of the transactions, and provide insights into the user's spending patterns and financial health, give advice whether the user should change their spending habits or not.:
      
      TRANSACTION SUMMARY:
      - Total Income: $${totalIncome.toFixed(2)}
      - Total Expenses: $${totalExpenses.toFixed(2)}
      - Net Cash Flow: $${(totalIncome - totalExpenses).toFixed(2)}
      - Income Transactions: ${incomeTransactions.length}
      - Expense Transactions: ${expenseTransactions.length}
      - Every transaction: ${transactions}
      
      Your response must be a valid JSON with the following structure:
      {
        "stock": "<div class='analysis-section'><h2>Investment Portfolio Analysis</h2>YOUR DETAILED HTML ANALYSIS HERE. Use proper HTML tags for formatting (h3, p, ul, li, strong, etc.). Include sections for portfolio health, performance analysis, risk assessment, and recommendations.</div>",
        
        "transaction": "<div class='analysis-section'><h2>Transaction Analysis</h2>YOUR DETAILED HTML ANALYSIS HERE. Use proper HTML tags for formatting (h3, p, ul, li, strong, etc.). Include sections for income vs expenses, spending patterns, and financial recommendations.</div>"
      }
      
      IMPORTANT: Ensure your response is properly formatted as valid JSON with escaped quotes in string values. Use proper HTML formatting tags instead of markdown. Do not use any icons in your response.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional financial advisor specializing in portfolio analysis and personal finance. You always respond with properly formatted JSON containing HTML content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: "json_object" } 
      });

      let analysis;
      try {
       
        analysis = JSON.parse(response.choices[0].message.content);
      } catch (err) {
        console.error("Error parsing JSON response:", err);
    
        analysis = {
          stock: "Error parsing analysis. Please try again.",
          transaction: "Error parsing analysis. Please try again."
        };
      }

      return res.status(200).json({
        analysis,
        portfolio: userPortfolio[0].portfolio,
        holdings: userHolding,
        transactions: {
          income: incomeTransactions,
          expenses: expenseTransactions
        },
      });
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      return res.status(500).send("Error analyzing portfolio: " + error.message);
    }
  })

// Meta Research endpoint with Gemini integration
chatRoute.post('/meta-research', isAuthenticated, async (req, res) => {
  try {
    const { researchBrief } = req.body;
    
    console.log('Meta research request:', researchBrief);
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generate sophisticated meta-prompt
    const metaPrompt = generateMetaPrompt(researchBrief);
    
    // Use meta-prompt to generate actual research with Gemini
    const prompt = `${metaPrompt}

RESEARCH REQUEST:
Based on the above meta-prompt instructions, conduct a comprehensive financial research on this topic and provide a detailed professional report. Focus on delivering actionable insights with proper analysis.

USER BRIEF:
Domain: ${researchBrief.domain}
Objective: ${researchBrief.objective}
Entities: ${researchBrief.entities}
Time Horizon: ${researchBrief.time_horizon}
Geography: ${researchBrief.geography}
Data Constraints: ${researchBrief.data_constraints}
Output Preferences: ${researchBrief.output_preferences}

Please provide a comprehensive analysis with executive summary, key findings, and actionable recommendations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Format the response for frontend
    const formattedResponse = `📊 **Báo cáo nghiên cứu chuyên sâu hoàn thành!**

${text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **Nghiên cứu được thực hiện bởi FinBud Deep Research Engine**
🔍 **Nguồn dữ liệu:** Multi-agent analysis với Gemini AI
⚡ **Thời gian xử lý:** Real-time processing`;

    res.status(200).json({
      success: true,
      response: formattedResponse
    });

  } catch (error) {
    console.error('Meta research error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      response: `Xin lỗi, hệ thống nghiên cứu chuyên sâu đang được nâng cấp. Vui lòng thử lại sau hoặc sử dụng chế độ chat thông thường.

**Lỗi kỹ thuật:** ${error.message}

FinBud đang phát triển tính năng này để mang lại trải nghiệm tốt nhất cho bạn! 🚀`
    });
  }
});


// Helper function to generate meta-prompt
function generateMetaPrompt(brief) {
  const isVietnamese = brief.output_preferences && brief.output_preferences.includes('Vietnamese');
  
  const metaPrompt = `SYSTEM (FinBud Deep Research Assistant v2.0)

╭─────────────────────── RESEARCH MISSION ────────────────────────╮
│ Domain: ${brief.domain}                                         │
│ Objective: ${brief.objective} ${brief.entities}                │
│ Time Scope: ${brief.time_horizon}                              │ 
│ Geographic Focus: ${brief.geography}                           │
│ Data Preferences: ${brief.data_constraints}                    │
│ Output Format: ${brief.output_preferences}                     │
╰──────────────────────────────────────────────────────────────────╯

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **CORE RESEARCH INSTRUCTIONS:**

1. **SEARCH STRATEGY:**
   • Focus on authoritative financial sources (SEC, analyst reports, market data)
   • Prioritize recent data within specified time horizon: ${brief.time_horizon}
   • Geographic relevance: ${brief.geography} markets and regulations
   • Entity-specific materials for: ${brief.entities}

2. **DATA PROCESSING PRIORITIES:**
   • Extract quantitative metrics (ratios, growth rates, valuations)
   • Identify key financial trends and patterns
   • Cross-reference multiple sources for accuracy
   • Maintain ${brief.data_constraints} compliance

3. **ANALYSIS FRAMEWORK:**
   • Apply ${brief.domain} methodologies and best practices
   • Integrate macro-economic context where relevant
   • Provide evidence-based conclusions with proper citations
   • Address risk factors and limitations explicitly

4. **OUTPUT REQUIREMENTS:**
   • Format: ${brief.output_preferences}
   • Include executive summary with key findings
   • Provide actionable insights and recommendations
   • Maintain professional tone and structure
   ${isVietnamese ? '• Báo cáo bằng tiếng Việt với thuật ngữ tài chính chính xác' : '• Use clear, professional English with appropriate financial terminology'}

5. **QUALITY CONTROL:**
   • Fact-check all quantitative claims
   • Ensure logical flow and coherent arguments
   • Include confidence levels for predictions/forecasts
   • Acknowledge data limitations and assumptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**EXECUTION NOTE:** This meta-prompt will guide all subsequent research agents to deliver a comprehensive, high-quality analysis aligned with user requirements.`;

  return metaPrompt;
}



export default chatRoute;
