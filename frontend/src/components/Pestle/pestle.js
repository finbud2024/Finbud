import { GoogleGenAI } from "@google/genai";

// Initialize Google GenAI with the API key
const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// PESTLE categories
const PESTLE_CATEGORIES = ["Political", "Economic", "Social", "Technological", "Legal", "Environmental"];
export function getPESTLECategories() { return PESTLE_CATEGORIES.slice(); }

// Define the prompts for each PESTLE category
const getCategoryPrompt = (industry, category) => {
  const prompt = `Hãy thực hiện phân tích PESTLE toàn diện cho ngành ${industry}, chỉ tập trung vào hạng mục ${category}.\n\nĐối với hạng mục: ${category}\n\nHãy tạo ra nội dung theo định dạng chính xác sau:\n## Phân tích ${category}\nTóm tắt: [Tóm tắt ngắn]\nCác tiêu đề (nếu có)\n- Điểm nổi bật: Nội dung chi tiết\n- Điểm nổi bật: Nội dung chi tiết\nCác điểm chính:\n- nội dung\n- nội dung\n\nHãy đảm bảo phân tích bắt đầu bằng '## Phân tích ${category}'.`;
  return prompt;
};



// Parser: converts raw analysis text for a SINGLE category to {description, headings, items}
function parseAnalysis(text, category, industry) {
    // Split lines and clean blanks
    let lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let description = "";
    let headings = [];
    let items = [];
    let currentSection = 'description';

    // 1. Extract Summary/Description
    const summaryIndex = lines.findIndex(line => /^summary:/i.test(line));
    if (summaryIndex !== -1) {
        description = lines[summaryIndex].replace(/^summary:/i, '').trim();
        // Remove the summary line and any blank lines immediately following it
        lines.splice(summaryIndex, 1);
        while (lines.length > summaryIndex && lines[summaryIndex].trim() === '') {
            lines.splice(summaryIndex, 1);
        }
    } else if (lines.length > 0 && !isHeadingOrBullet(lines[0])) {
        // If no explicit summary, take the first line if it doesn't look like a heading/bullet
        description = lines[0];
        lines.shift(); // Remove the line used as description
    }

    // 2. Process remaining lines for Headings and Items
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for explicit section markers like 'Headings:' or 'Key points:'
        if (/^headings:?/i.test(line)) {
            currentSection = 'headings';
            continue;
        }
        if (/^(key points|points):?/i.test(line)) {
            currentSection = 'items';
            continue;
        }

        // Attempt to parse as a bullet point first
        const bulletMatch = line.match(/^[-*•] ?(.+?):\s*(.+)$/i); // Bullet with highlight
        const bulletSimple = line.match(/^[-*•] ?(.+)$/); // Simple bullet

        if (bulletMatch) {
            items.push({ highlight: bulletMatch[1].trim(), text: bulletMatch[2].trim() });
            currentSection = 'items'; // Assume we are in items section now
            continue;
        } else if (bulletSimple) {
            items.push({ highlight: "", text: bulletSimple[1].trim() });
            currentSection = 'items'; // Assume we are in items section now
            continue;
        }

        // If not a bullet, check if it's a heading
        // A heading is typically Title Case or ALL CAPS, possibly ending with a colon, and not too long.
        if (headingLike(line)) {
            // Avoid adding the category title itself as a heading within the section
            if (!line.toLowerCase().includes(category.toLowerCase() + " analysis")) {
                 headings.push(line.replace(/:$/, '').trim());
                 currentSection = 'headings'; // Assume we are in headings section
            }
            continue;
        }

        // If it's none of the above, and we are in the 'items' section (e.g., after 'Key points:'),
        // treat it as a simple text item if it's not empty.
        if (currentSection === 'items' && line.length > 0) {
             // Heuristic: If the line starts with a lowercase letter or number, likely part of previous point or just text
             // Let's treat it as a simple item for now, might need refinement
             items.push({ highlight: "", text: line });
        }
        // Otherwise, ignore the line (could be whitespace or unparseable)
    }

    // If description is still empty, try to find a paragraph before the first heading/bullet
    if (!description && lines.length > 0) {
        let firstContentIndex = lines.findIndex(isHeadingOrBullet);
        if (firstContentIndex > 0) {
            description = lines.slice(0, firstContentIndex).join(' ').trim();
        } else if (firstContentIndex === -1 && items.length === 0 && headings.length === 0) {
            // If no headings/bullets found at all, assume the whole text is description
            description = lines.join(' ').trim();
        }
    }

    // Basic fallback if parsing yielded nothing useful but text exists
    if (!description && items.length === 0 && headings.length === 0 && text.length > 0) {
        description = text.split(/\r?\n/)[0]; // Take first line as description
    }

    return {
        description: description || `Phân tích các yếu tố ${category} trong ngành ${industry}.`, // Ensure description is never empty
        headings,
        items,
    };
}

// Utility: Check if a line looks like a heading
function headingLike(text) {
    const trimmed = text.trim();
    // Ends with colon, starts with uppercase, not too long
    if (trimmed.endsWith(':') && /^[A-Z]/.test(trimmed) && trimmed.length < 60) return true;
    // All caps or Title Case, not too long, doesn't start with bullet
    if (/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z\s]+)$/.test(trimmed) && trimmed.length < 60 && !/^[*-•]/.test(trimmed)) return true;
    return false;
}

// Utility: Check if a line looks like a heading or a bullet point
function isHeadingOrBullet(line) {
    const trimmed = line.trim();
    return headingLike(trimmed) || /^[*-•]/.test(trimmed);
}


async function generateFullPestleAnalysis(industry) {
    if (!industry) throw new Error("Bạn cần nhập ngành để phân tích.");
    const categories = getPESTLECategories();

    // Construct a single prompt asking for all categories
    const fullPrompt = `Hãy thực hiện phân tích PESTLE toàn diện cho ngành ${industry}.\n\nĐối với MỖI hạng mục sau: ${categories.join(', ')}\n\nHãy tạo ra nội dung theo định dạng chính xác sau:\n## Phân tích [Tên hạng mục]\nTóm tắt: [Tóm tắt ngắn]\nCác tiêu đề (nếu có)\n- Điểm nổi bật: Nội dung chi tiết\n- Điểm nổi bật: Nội dung chi tiết\nCác điểm chính:\n- nội dung\n- nội dung\n\nĐảm bảo mỗi hạng mục phân tích bắt đầu bằng '## Phân tích [Tên hạng mục]'.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: fullPrompt,
            generationConfig: {
                maxOutputTokens: 2048,
                tempreture: 0.3,
            }
        });

        const text = response.text?.trim();
        if (!text) {
            throw new Error(`Không thể tạo phân tích PESTLE cho ngành ${industry}. Phản hồi AI bị trống.`);
        }
        return text;
    } catch (error) {
        console.error("Error generating full PESTLE analysis:", error);
        throw new Error(`Lỗi khi tạo phân tích PESTLE cho ngành ${industry}: ${error.message}`);
    }
}

export async function processPestleAnalysis(industry) {
    const fullAnalysisText = await generateFullPestleAnalysis(industry);
    const results = {};
    const categories = getPESTLECategories();

    // Split the full text into sections based on '## Category Analysis'
    const normalizedText = fullAnalysisText.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();
    const categorySections = normalizedText.split(/^##\s+Phân tích\s+(.+)$/gmi);


    for (let i = 1; i < categorySections.length; i += 2) {
        const categoryName = categorySections[i].trim();
        const categoryText = categorySections[i + 1] ? categorySections[i + 1].trim() : '';

        // Find the matching category (case-insensitive)
        const matchedCategory = categories.find(cat => cat.toLowerCase() === categoryName.toLowerCase());

        if (matchedCategory) {
            results[matchedCategory] = parseAnalysis(categoryText, matchedCategory, industry);
        } else {
            console.warn(`Parsed category "${categoryName}" not found in expected categories.`);
        }
    }

    // Ensure all categories were found and parsed
    categories.forEach(category => {
        if (!results[category]) {
            // Throw an error if a category section is missing or couldn't be parsed
            throw new Error(`Thiếu phân tích cho hạng mục ${category} hoặc không thể phân tích từ phản hồi AI.`);
        }
    });

    return results;
}


// For regenerating a single category: returns a parsed object {description, headings, items}
export async function regenerateCategory(industry, category) {
  try {
    if (!industry || !category) throw new Error("Cần cung cấp ngành và hạng mục.");
    const prompt = getCategoryPrompt(industry, category);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      generationConfig: {
        maxOutputTokens: 2048,
        tempreture: 0.3,
      },
    });

    const text = response.text?.trim();
    if (!text) {
        throw new Error(`Không thể tạo lại phân tích ${category} cho ngành ${industry}. Phản hồi AI bị trống.`);
    }
    return parseAnalysis(text, category, industry);
  } catch (error) {
    console.error(`Error regenerating ${category} analysis:`, error);
    throw new Error(`Lỗi khi tạo lại phân tích ${category} cho ngành ${industry}: ${error.message}`);
  }
}