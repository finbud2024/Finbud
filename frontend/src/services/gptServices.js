import axios from "axios";

const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;

export async function gptServices(payload) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: payload,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0]?.message?.content || "";
    return answer;
  } catch (err) {
    console.error("Error in fetching or generating response:", err);
  }
}
