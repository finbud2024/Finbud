import { pool } from "../../Database Schema/aiNews/db.js";
import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct";
const API_KEY = process.env.OPENROUTER_API_KEY;

export async function analyzeArticle({ id, title, content }) {
  // First check if article exists
  const client = await pool.connect();
  try {
    const articleCheck = await client.query(
      "SELECT id FROM articles WHERE id = $1",
      [id]
    );
    if (articleCheck.rowCount === 0) {
      console.error(`❌ Article with ID ${id} not found in database`);
      return;
    }

    const prompt = `Bạn là một trợ lý tài chính. Hãy đọc bài báo dưới đây và thực hiện 3 nhiệm vụ:

    1. Tóm tắt bài báo thành các gạch đầu dòng ngắn gọn, rõ ràng bằng tiếng Việt. Mỗi gạch đầu dòng nên thể hiện một ý chính. Nếu bài dài, hãy sử dụng nhiều gạch đầu dòng hơn.
    2. Với mỗi gạch đầu dòng, hãy phân loại cảm xúc dưới dạng: Positive, Neutral, hoặc Negative.
    3. Với mỗi gạch đầu dòng, hãy tạo 2–4 thẻ (tag) liên quan đến tài chính như tên công ty, ngành nghề, hoặc khái niệm chính — bằng tiếng Việt.
    
    Trả lời theo định dạng JSON như sau:
    {
      "bullets": [
        {
          "text": "Điểm tóm tắt đầu tiên.",
          "sentiment": "Positive",
          "tags": ["Công ty A", "Kết quả kinh doanh"]
        }
      ]
    }
    
    Tiêu đề bài báo: ${title}
    
    Nội dung bài báo:
    ${content}`;

    const res = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful financial analyst assistant.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!res.data || !res.data.choices?.[0]?.message?.content) {
      console.error("❌ No valid response from OpenRouter:", res.data);
      return;
    }

    const rawText = res.data.choices?.[0]?.message?.content;

    let structured;
    try {
      structured = JSON.parse(rawText);
      console.log(structured);
    } catch (err) {
      console.error("❌ Failed to parse response JSON:", rawText);
      return;
    }

    const articleTagIds = new Set();

    for (const bullet of structured.bullets) {
      const bulletResult = await client.query(
        "INSERT INTO summary_bullets (article_id, text, sentiment) VALUES ($1, $2, $3) RETURNING id",
        [id, bullet.text, bullet.sentiment]
      );
      const bulletId = bulletResult.rows[0].id;

      for (const tag of bullet.tags) {
        const tagResult = await client.query(
          "INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
          [tag]
        );
        const tagId = tagResult.rows[0].id;

        await client.query(
          "INSERT INTO bullet_tags (bullet_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [bulletId, tagId]
        );

        articleTagIds.add(tagId);
      }
    }

    for (const tagId of articleTagIds) {
      await client.query(
        "INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [id, tagId]
      );
    }
    console.log(`✅ Saved analysis for article ID ${id}`);
  } catch (err) {
    console.error("❌ Failed to save to database:", err);
    throw err; // Re-throw to be handled by caller
  } finally {
    client.release();
  }
}

// analyzeArticle({
//   id: 2,
//   title: `Thị trường chứng khoán "chững lại" trong phiên sáng 21/5`,
//   content: `Thị trường chứng khoán diễn biến rất tích cực khi vừa mở cửa phiên sáng, tuy nhiên đà tăng đã bị thu hẹp vào cuối phiên, VN-Index chỉ còn tăng chưa tới 1 điểm.

// Cuối phiên sáng 21/5, VN-Index  tăng 0,98 điểm lên 1.316,13 điểm. Khối lượng giao dịch đạt hơn 550,6 triệu cổ phiếu, tương ứng hơn 13.552,7 tỷ đồng. Toàn sàn có 95 mã tăng giá, 211 mã giảm giá và 42 mã đứng.

// [[IMAGE]] Nhà đầu tư theo dõi diễn biến thị trường chứng khoán tại Công ty cổ phần Chứng khoán MB (MBS). Ảnh: Bnews/vnanet.vn

// HNX-Index giảm 1,28 điểm xuống 216,42 điểm. Khối lượng giao dịch đạt hơn 42,1 triệu cổ phiếu, tương ứng hơn 593,5 tỷ đồng. Toàn sàn có 39 mã tăng giá, 99 mã đứng giá và 55 mã giảm giá.

// UPCOM-Index giảm 0,16 điểm xuống 99,53 điểm. Khối lượng giao dịch đạt hơn 49,4 triệu cổ phiếu, tương ứng hơn 551,3 tỷ đồng. Toàn sàn có 102 mã tăng giá, 114 mã giảm giá và 85 mã đứng giá. Các cổ phiếu vốn hóa lớn thu hẹp đà tăng hoặc quay đầu giảm, VHM và VIC nếu đầu phiên sáng tăng trần thì đến cuối phiên VIC giảm nhẹ 0,22%, VHM tăng 5,25%, VRE giảm 0,97%, VPL giảm 3,52%. Nhóm cổ phiếu chứng khoán, dầu khí, hóa chất, xây dựng và vật liệu chìm trong sắc đỏ. Sắc đỏ cũng tràn ngập tại nhóm cổ phiếu viễn thông và công nghệ thông tin. Sáng nay, nhóm cổ phiếu bảo hiểm diễn biến khá tích cực với sự tăng giá của ABI, BCI, BLI, BVH, MIG. Hầu hết các nhóm cổ phiếu còn lại diễn biến phân hóa với sắc xanh, đỏ đan xen.

// Thị trường chứng khoán Việt Nam sáng nay diễn biến không mấy tích cực trong bối cảnh thị trường chứng khoán thế giới giảm điểm. Trong phiên giao dịch ngày 20/5, chứng khoán Phố Wall đi xuống, khi thị trường theo dõi cuộc tranh luận tại Quốc hội Mỹ về đề xuất cắt giảm thuế của Tổng thống Donald Trump.

// Các nhà giao dịch cho biết cả ba chỉ số chính đều chứng kiến toàn bộ phiên trong sắc đỏ. Đáng chú ý, chỉ số S&P 500 đi xuống sau 6 phiên tăng điểm liên tiếp. Trong khi đó, chỉ số Dow Jones chấm dứt chuỗi ba phiên tăng liên tiếp, còn chỉ số Nasdaq giảm sau hai phiên đi lên trước đó. Chốt phiên này, chỉ số công nghiệp Dow Jones giảm 0,27% xuống 42.677,24 điểm; chỉ số S&P 500 giảm 0,39% xuống 5.940,46 điểm, trong khi chỉ số công nghệ Nasdaq Composite giảm 0,38% xuống 19.142,71 điểm. Quốc hội Mỹ đang xem xét dự luật cắt giảm thuế quy mô lớn do Tổng thống Trump đề xuất trong bối cảnh tổ chức xếp hạng tín nhiệm Moody's quyết định hạ bậc tín nhiệm của Mỹ. Moody's cho biết quyết định hạ bậc tín nhiệm xuất phát từ xu hướng nợ công gia tăng, dự kiến sẽ đạt mức 134% GDP vào năm 2035. Các chuyên gia phân tích độc lập cho rằng dự luật cắt giảm thuế trên có thể làm tăng thêm từ 3.000 tỷ USD đến 5.000 tỷ USD vào gánh nợ quốc gia, hiện đã ở mức 36.200 tỷ USD. Ông Garrett Melson, chiến lược gia tại công ty quản lý đầu tư Natixis Investment Managers có trụ sở tại Boston (Mỹ), cho rằng việc thị trường chứng khoán giảm nhẹ trong phiên 20/5 là điều hợp lý sau đợt tăng điểm liên tiếp vừa qua. Bên cạnh đó, các nhà đầu tư cũng đang hướng sự chú ý vào đà tăng của lợi suất trái phiếu Chính phủ Mỹ. Lợi suất trái phiếu Chính phủ Mỹ kỳ hạn 10 năm đã tăng 0,4 điểm cơ bản lên 4,481%. Ngoài ra, thị trường còn theo dõi bình luận về triển vọng chính sách tiền tệ từ một số quan chức của Cục Dự trữ Liên bang Mỹ (Fed), trong đó có Chủ tịch Fed chi nhánh St. Louis, Alberto Musalem. Theo dữ liệu tổng hợp từ LSEG, các nhà giao dịch hiện dự đoán Fed sẽ cắt giảm lãi suất ít nhất hai lần, mỗi lần 25 điểm cơ bản, vào cuối năm 2025, và lần cắt giảm đầu tiên có thể vào tháng Chín tới.`,
// });
