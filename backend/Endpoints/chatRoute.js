import express from "express";
import Chat from "../Database Schema/Chat.js";
import validateRequest from "../utils/validateRequest.js";
import axios from "axios";
import dotenv from "dotenv";
import { BraveSearch } from "@langchain/community/tools/brave_search";

dotenv.config();

const chatRoute = express.Router();

// GET: Retrieve all chats
chatRoute.get("/chats", async (req, res) => {
  console.log("in /chats Route (GET) all chats");
  try {
    const chats = await Chat.find();
    return res.status(200).send(chats);
  } catch (err) {
    return res.status(501).send("Internal error: " + err);
  }
});

// DELETE: delete all chats
chatRoute.delete("/chats", async (req, res) => {
  console.log("in /chats Route (DELETE) all chats");
  try {
    await Chat.deleteMany();
    return res.status(200).send("All chats deleted successfully");
  } catch (err) {
    return res.status(501).send("Internal error: " + err);
  }
});

// POST: create a new chat
chatRoute.post("/chats", validateRequest(Chat.schema), async (req, res) => {
  console.log(req.body);
  if (!req.body.prompt || !req.body.response || !req.body.threadId) {
    return res.status(400).send("Prompt, response and threadId are required");
  }
  console.log("in /chats Route (POST) new chat to database");
  try {
    const chat = {};
    if (req.body) {
      for (const key in req.body) {
        chat[key] = req.body[key];
      }
    }
    const newChat = new Chat({
      prompt: chat.prompt,
      response: chat.response,
      threadId: chat.threadId,
    });
    console.log(newChat);
    await newChat.save();
    return res.status(200).send(newChat);
  } catch (err) {
    return res.status(502).send("Internal error e" + err);
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
chatRoute.post("/query", async (req, res) => {
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
chatRoute.put(
  "/chats/:chatId",
  validateRequest(Chat.schema),
  async (req, res) => {
    const chatId = req.params.chatId;
    console.log("in /chats/:chatId Route (PUT) chat with ID:" + chatId);
    try {
      const filter = { _id: chatId };
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
  }
);

// DELETE: delete a chat with given chat id
chatRoute.delete("/chats/:chatId", async (req, res) => {
  const chatId = req.params.chatId;
  console.log("In /chats/:chatId Route (DELETE) for chat with ID: " + chatId);
  try {
    const chat = await Chat.findOneAndDelete({ _id: chatId });
    if (!chat) {
      return res
        .status(404)
        .send(`Cannot find chat in db with chat ID is: ${chatId}`);
    }
    return res.status(200).send("Chat deleted successfully");
  } catch (err) {
    return res.status(500).send("Internal sever error" + err);
  }
});

// GET: retrieve chats with given thread id
chatRoute.get("/chats/t/:threadId", async (req, res) => {
  const threadId = req.params.threadId;
  console.log(
    "in /chats/:threadId Route (GET) chat with thread ID:" +
      JSON.stringify(threadId)
  );
  try {
    const chats = await Chat.find({ threadId: threadId });
    if (!chats) {
      return res
        .status(404)
        .send(`Cannot find chat in db with thread ID is: ${threadId}`);
    }
    return res.status(200).send(chats);
  } catch (err) {
    return res.status(501).send("Internal error e" + err);
  }
});

// DELETE: delete all chats with given thread id
chatRoute.delete("/chats/t/:threadId", async (req, res) => {
  const threadId = req.params.threadId;
  console.log(
    "In /chats/t/:threadId Route (DELETE) for chat with thread ID: " + threadId
  );
  try {
    await Chat.deleteMany({ threadId: threadId });
    return res
      .status(200)
      .send("All chats with thread ID: " + threadId + " deleted successfully");
  } catch (err) {
    return res.status(501).send("Internal error: " + err);
  }
});

export default chatRoute;
