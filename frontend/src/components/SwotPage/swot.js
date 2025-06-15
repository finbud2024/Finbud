import { GoogleGenAI } from "@google/genai";

// Initialize Google GenAI with the API key
const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// SWOT categories
const SWOT_CATEGORIES = ["Strengths", "Weaknesses", "Opportunities", "Threats"];
export function getSWOTCategories() { return SWOT_CATEGORIES.slice(); }


// Function to process the remaining SWOT categories (excluding Strengths)
export async function generateAndProcessRemainingSwotAnalysis(company) {
    if (!company) throw new Error("Bạn cần nhập tên công ty để phân tích.");
    const allCategories = getSWOTCategories();
    const categoriesToFetch = allCategories.filter(cat => cat !== "Strengths");
    if (categoriesToFetch.length === 0) {
        return {}; // All categories (only Strengths) already fetched or no other categories
    }

    // Construct a single prompt asking for all categories in JSON format
    const fullPrompt = `Hãy thực hiện phân tích SWOT toàn diện cho công ty ${company}.
Trả lời bằng một đối tượng JSON duy nhất. Đối tượng JSON phải có các khóa là "${categoriesToFetch.join('", "')}".
Mỗi khóa phải tương ứng với một đối tượng chứa hai thuộc tính chính:
1.  "summary": (string) Một tóm tắt ngắn gọn về các yếu tố của hạng mục đó.
2.  "sections": (array of objects) Một danh sách gồm 3 đến 4 phần chính. Mỗi đối tượng trong mảng "sections" phải có hai thuộc tính:
    a.  "heading": (string) Tiêu đề chính cho phần đó.
    b.  "key_points": (array of objects) Một danh sách gồm 3 đến 4 điểm chính thuộc về tiêu đề đó. Mỗi đối tượng "key_point" phải có hai thuộc tính:
        i.  "highlight": (string) Một tiêu đề ngắn hoặc điểm nhấn cho điểm chính đó. Có thể là một chuỗi trống.
        ii. "text": (string) Nội dung chi tiết của điểm chính đó. QUAN TRỌNG: Nội dung này PHẢI có độ dài khoảng 2 câu.

Ví dụ cấu trúc cho một hạng mục (ví dụ: "Weaknesses"):
{
  "Weaknesses": {
    "summary": "Tóm tắt ngắn gọn về các điểm yếu của công ty.",
    "sections": [
      {
        "heading": "Điểm yếu về tài chính",
        "key_points": [
          { "highlight": "Dòng tiền hạn chế", "text": "Công ty đang gặp khó khăn về dòng tiền do chi phí vận hành cao. Điều này ảnh hưởng đến khả năng đầu tư và mở rộng." },
          { "highlight": "", "text": "Tỷ lệ nợ trên vốn chủ sở hữu cao hơn mức trung bình ngành." }
        ]
      },
      {
        "heading": "Điểm yếu về nhân sự",
        "key_points": [
          { "highlight": "Thiếu nhân tài", "text": "Công ty khó thu hút và giữ chân nhân tài chất lượng cao." }
        ]
      }
    ]
  }
  // ... các hạng mục khác theo cấu trúc tương tự ...
}

Chỉ trả về đối tượng JSON. Không bao gồm bất kỳ văn bản giải thích nào trước hoặc sau đối tượng JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: fullPrompt,
            generationConfig: {
                maxOutputTokens: 3000,
                temperature: 0.3,
            }
        });

        let text = response.text?.trim();
        if (!text) {
            throw new Error(`Không thể tạo phân tích SWOT cho công ty ${company}. Phản hồi AI bị trống.`);
        }

        // Clean the text if it's wrapped in markdown json block
        if (text.startsWith("```json")) {
            text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith("```")) {
            text = text.substring(3, text.length - 3).trim();
        }

        // Attempt to parse the JSON response
        try {
            const jsonData = JSON.parse(text);
            return jsonData;
        } catch (parseError) {
            console.error("Error parsing SWOT AI response as JSON:", parseError, "Raw text:", text);
            throw new Error(`Lỗi khi phân tích phản hồi JSON từ AI cho công ty ${company}. Chi tiết: ${parseError.message}`);
        }
    } catch (error) {
        console.error("Error generating full SWOT analysis:", error);
        throw new Error(`Lỗi khi tạo phân tích SWOT cho công ty ${company}: ${error.message}`);
    }
}

// Function to fetch and process a single SWOT category
export async function fetchSwotCategoryData(company, category) {
  try {
    if (!company || !category) throw new Error("Cần cung cấp tên công ty và hạng mục.");
    
    const categoryPrompts = {
      Strengths: `Hãy cung cấp phân tích chi tiết về điểm mạnh của công ty ${company}.`,
      Weaknesses: `Hãy cung cấp phân tích chi tiết về điểm yếu của công ty ${company}.`,
      Opportunities: `Hãy cung cấp phân tích chi tiết về cơ hội của công ty ${company}.`,
      Threats: `Hãy cung cấp phân tích chi tiết về thách thức/rủi ro của công ty ${company}.`
    };

    const prompt = `${categoryPrompts[category]}
Trả lời bằng một đối tượng JSON duy nhất. Đối tượng JSON phải có cấu trúc sau:
{
  "summary": (string) "Một tóm tắt ngắn gọn về các yếu tố của hạng mục này.",
  "sections": [ (array of objects) // Cố gắng tạo ra 3 đến 4 đối tượng "section"
    {
      "heading": (string) "Tiêu đề chính cho phần này.",
      "key_points": [ (array of objects) // Cố gắng tạo ra 3 đến 4 đối tượng "key_point" cho mỗi "section"
        {
          "highlight": (string) "Điểm nhấn ngắn (có thể trống).",
          "text": (string) "Nội dung chi tiết của điểm chính. QUAN TRỌNG: Nội dung này PHẢI có độ dài khoảng 2-3 câu với thông tin cụ thể về công ty."
        }
        // ... các key_points khác
      ]
    }
    // ... các sections khác
  ]
}
Chỉ trả về đối tượng JSON. Không bao gồm bất kỳ văn bản giải thích nào trước hoặc sau đối tượng JSON.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.3,
        }
    });

    let text = response.text?.trim();
    if (!text) {
      throw new Error(`Không thể tạo phân tích cho hạng mục ${category} của công ty ${company}. Phản hồi AI bị trống.`);
    }

    // Clean the text if it's wrapped in markdown json block
    if (text.startsWith("```json")) {
        text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith("```")) {
        text = text.substring(3, text.length - 3).trim();
    }

    try {
        const jsonData = JSON.parse(text);
        return {
            description: jsonData.summary || `Phân tích các yếu tố ${category} của công ty ${company}.`,
            sections: (jsonData.sections || []).map(section => ({
                heading: section.heading || "Không có tiêu đề",
                items: (section.key_points || []).map(kp => ({
                    highlight: kp.highlight || "",
                    text: kp.text || "Không có nội dung"
                }))
            }))
        };
    } catch (parseError) {
        console.error(`Error parsing AI response for category ${category} as JSON:`, parseError, "Raw text:", text);
        throw new Error(`Lỗi khi phân tích phản hồi JSON từ AI cho hạng mục ${category}. Chi tiết: ${parseError.message}`);
    }

  } catch (error) {
    console.error(`Error regenerating SWOT category ${category} for ${company}:`, error);
    throw new Error(`Lỗi khi tạo lại phân tích cho hạng mục ${category}: ${error.message}`);
  }
} 