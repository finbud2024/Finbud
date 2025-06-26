import VectorRetriever from "./rag/retriever.js";
import { gptServices } from "./gptServices.js";

export class ragService {
  constructor(query) {
    this.query = query;
    this.pipelineCompleted = false;
  }

  async processMessage(message, conversationHistory = []) {
    try {
      console.log("🔍 Starting RAG process for message:", message);

      const retriever = new VectorRetriever(message);
      console.log("✅ Retriever initialized");

      // Retrieve top K documents (now returns full hit objects with metadata)
      console.log("🔍 Retrieving documents...");
      const hits = await retriever.retrieveTopK();
      console.log(`✅ Retrieved ${hits.length} hits with metadata`);

      if (!hits || hits.length === 0) {
        console.warn("⚠️ No context after reranking");
        return {
          status: "error",
          message:
            "Không tìm thấy thông tin liên quan. Vui lòng thử lại với từ khóa khác.",
        };
      }

      // Extract passages and metadata from hits
      const passages = hits.map(
        (hit) => `${hit.payload.content}\n\nSource: ${hit.payload.url}`
      );

      const gptResponse = await gptServices([
        {
          role: "system",
          content: `You are FinBud, a financial assistant. Use the following context to provide a detailed answer to the user's question.

RELEVANT CONTEXT:
${passages.join("\n\n")}

Please provide a comprehensive answer that:
1. Uses the context above to inform your response
2. Maintains a friendly and professional tone
3. Focuses on financial accuracy and clarity
4. Includes specific details from the context when relevant
- Answer the user's question using Markdown format.
- After each sentence or claim that uses information from the context, include a citation like this: [^1], [^2], [^3]
- Do not fabricate sources.
- Use [^x] only for sentences that are clearly backed by the context.
5. **Formats the answer in Markdown**, using:
- Headings
- Bullet points
- Tables (if data comparison is needed)
- Inline code for formulas or calculations
- Bold or italic text for emphasis
Then at the bottom, include:

[^1]: url of source 1
[^2]: url of source 2
for example:
[^1]: https://www.google.com
...`,
        },
        {
          role: "user",
          content: message, // Use original query
        },
      ]);

      this.pipelineCompleted = true;

      return {
        text: gptResponse, // Return markdown directly
        status: "success",
      };
    } catch (error) {
      console.error("❌ Error in RAG process:", {
        error: error.message,
        stack: error.stack,
        query: message,
      });
      return {
        status: "error",
        message: `Có lỗi xảy ra trong quá trình xử lý: ${error.message}`,
      };
    }
  }
}
