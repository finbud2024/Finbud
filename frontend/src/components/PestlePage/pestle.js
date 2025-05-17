import { GoogleGenAI } from "@google/genai";

// Initialize Google GenAI with the API key
const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// PESTLE categories
const PESTLE_CATEGORIES = ["Political", "Economic", "Social", "Technological", "Legal", "Environmental"];
export function getPESTLECategories() { return PESTLE_CATEGORIES.slice(); }


// Function to process the remaining PESTLE categories (excluding Political)
export async function generateAndProcessRemainingPestleAnalysis(industry) {
    if (!industry) throw new Error("Bạn cần nhập ngành để phân tích.");
    const allCategories = getPESTLECategories();
    const categoriesToFetch = allCategories.filter(cat => cat !== "Political");
    if (categoriesToFetch.length === 0) {
        return {}; // All categories (only Political) already fetched or no other categories
    }

    // Construct a single prompt asking for all categories in JSON format
    const fullPrompt = `Hãy thực hiện phân tích PESTLE toàn diện cho ngành ${industry}.
Trả lời bằng một đối tượng JSON duy nhất. Đối tượng JSON phải có các khóa là "${categoriesToFetch.join('", "')}".
Mỗi khóa phải tương ứng với một đối tượng chứa hai thuộc tính chính:
1.  "summary": (string) Một tóm tắt ngắn gọn về các yếu tố của hạng mục đó.
2.  "sections": (array of objects) Một danh sách các phần chính. Mỗi đối tượng trong mảng "sections" phải có hai thuộc tính:
    a.  "heading": (string) Tiêu đề chính cho phần đó.
    b.  "key_points": (array of objects) Một danh sách các điểm chính thuộc về tiêu đề đó. Mỗi đối tượng "key_point" phải có hai thuộc tính:
        i.  "highlight": (string) Một tiêu đề ngắn hoặc điểm nhấn cho điểm chính đó. Có thể là một chuỗi trống.
        ii. "text": (string) Nội dung chi tiết của điểm chính đó.

Ví dụ cấu trúc cho một hạng mục (ví dụ: "Political"):
{
  "Political": {
    "summary": "Tóm tắt ngắn gọn về các yếu tố chính trị.",
    "sections": [
      {
        "heading": "Xu hướng chính trị chính 1",
        "key_points": [
          { "highlight": "Ổn định chính trị", "text": "Mức độ ổn định chính trị hiện tại và tác động tiềm ẩn." },
          { "highlight": "", "text": "Chính sách thuế sắp tới và ảnh hưởng của chúng đến ngành." }
        ]
      },
      {
        "heading": "Ảnh hưởng của quy định mới",
        "key_points": [
          { "highlight": "Quy định ABC", "text": "Chi tiết về quy định ABC và tác động." }
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
                maxOutputTokens: 2048,
                temperature: 0.3,
            }
        });

        let text = response.text?.trim();
        if (!text) {
            throw new Error(`Không thể tạo phân tích PESTLE cho ngành ${industry}. Phản hồi AI bị trống.`);
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
            console.error("Error parsing PESTLE AI response as JSON:", parseError, "Raw text:", text);
            throw new Error(`Lỗi khi phân tích phản hồi JSON từ AI cho ngành ${industry}. Chi tiết: ${parseError.message}`);
        }
    } catch (error) {
        console.error("Error generating full PESTLE analysis:", error);
        throw new Error(`Lỗi khi tạo phân tích PESTLE cho ngành ${industry}: ${error.message}`);
    }
}

// Function to fetch and process a single PESTLE category
export async function fetchPestleCategoryData(industry, category) {
  try {
    if (!industry || !category) throw new Error("Cần cung cấp ngành và hạng mục.");
    const prompt = `Hãy cung cấp phân tích chi tiết cho hạng mục "${category}" của ngành ${industry}.
Trả lời bằng một đối tượng JSON duy nhất. Đối tượng JSON phải có cấu trúc sau:
{
  "summary": (string) "Một tóm tắt ngắn gọn về các yếu tố của hạng mục này.",
  "sections": [ (array of objects)
    {
      "heading": (string) "Tiêu đề chính cho phần này.",
      "key_points": [ (array of objects)
        {
          "highlight": (string) "Điểm nhấn ngắn (có thể trống).",
          "text": (string) "Nội dung chi tiết của điểm chính."
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
            maxOutputTokens: 128,
            temperature: 0.3,
        }
    });

    let text = response.text?.trim();
    if (!text) {
      throw new Error(`Không thể tạo phân tích cho hạng mục ${category} của ngành ${industry}. Phản hồi AI bị trống.`);
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
            description: jsonData.summary || `Phân tích các yếu tố ${category} trong ngành ${industry}.`,
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
    console.error(`Error regenerating PESTLE category ${category} for ${industry}:`, error);
    throw new Error(`Lỗi khi tạo lại phân tích cho hạng mục ${category}: ${error.message}`);
  }
}