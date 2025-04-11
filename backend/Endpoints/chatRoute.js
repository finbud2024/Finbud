import express from "express";
import Chat from "../Database Schema/Chat.js";
import validateRequest from "../utils/validateRequest.js";
import axios from "axios";
import dotenv from "dotenv";
import { BraveSearch } from "@langchain/community/tools/brave_search";
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import Transaction from "../Database Schema/Transaction.js";
import UserHolding from "../Database Schema/UserHolding.js";
import Portfolio from "../Database Schema/Portfolio.js";
import OpenAI from 'openai';
// import { YoutubeTranscript } from 'youtube-transcript';
// import { getVideoId } from '../utils/getVideoId.js';

dotenv.config();

const chatRoute = express.Router();

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

// POST: Analyze User Portfolio
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

EMPHASIZE: VERY DETAILED ANALYSIS in form of a paragaph, providing useful insights and suggestions. Makesure that people without finance background can understand your analysis. 

PART 1: INVESTMENT ANALYSIS
Analyze the following stock holdings and portfolio performance data:

USER PORTFOLIO SUMMARY:
- Portfolio: ${portfolioData}. NOTE, the most recent 365 days of data is provided. Last element is the most recent day.
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

IMPORTANT: Ensure your response is properly formatted as valid JSON with escaped quotes in string values. Use proper HTML formatting tags instead of markdown.
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

export default chatRoute;
