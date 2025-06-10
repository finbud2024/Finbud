import express from "express";
import Article from "../../Database_Schema/social/Article.js";

const articleRoute = express.Router();

// GET /api/articles — Get all articles, newest first
articleRoute.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("authorId", "name") // adjust fields as needed
      .populate("sourceId", "name") // adjust fields as needed
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/blog — Get sample blog articles for blog page
articleRoute.get("/blog", async (req, res) => {
  try {
    // Return sample blog articles with Vietnamese content
    const sampleBlogArticles = [
      {
        _id: '1',
        title: 'Xu Hướng Đầu Tư Cryptocurrency 2024',
        description: 'Phân tích các xu hướng mới nhất trong thị trường tiền điện tử và những cơ hội đầu tư tiềm năng cho năm 2024.',
        content: 'Thị trường cryptocurrency đang trải qua những thay đổi lớn với sự xuất hiện của nhiều công nghệ mới...',
        category: 'Đầu Tư',
        author: 'Nguyễn Văn A',
        featuredImage: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=250&fit=crop',
        createdAt: new Date('2024-01-15'),
        readTime: 5,
        views: 1250,
        tags: ['cryptocurrency', 'đầu tư', 'blockchain']
      },
      {
        _id: '2',
        title: 'Phân Tích Kỹ Thuật: Đọc Biểu Đồ Chứng Khoán',
        description: 'Hướng dẫn chi tiết về cách đọc và phân tích biểu đồ chứng khoán cho người mới bắt đầu đầu tư.',
        content: 'Phân tích kỹ thuật là một trong những công cụ quan trọng nhất trong đầu tư chứng khoán...',
        category: 'Phân Tích',
        author: 'Trần Thị B',
        featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
        createdAt: new Date('2024-01-12'),
        readTime: 8,
        views: 890,
        tags: ['phân tích kỹ thuật', 'chứng khoán', 'biểu đồ']
      },
      {
        _id: '3',
        title: 'Tin Tức Thị Trường: VN-Index Tăng Mạnh',
        description: 'VN-Index đã có phiên tăng mạnh với thanh khoản khủng, tín hiệu tích cực cho thị trường chứng khoán Việt Nam.',
        content: 'Thị trường chứng khoán Việt Nam hôm nay ghi nhận một phiên tăng điểm ấn tượng...',
        category: 'Tin Tức',
        author: 'Lê Văn C',
        featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop',
        createdAt: new Date('2024-01-10'),
        readTime: 3,
        views: 2100,
        tags: ['VN-Index', 'chứng khoán Việt Nam', 'thị trường']
      },
      {
        _id: '4',
        title: 'Hướng Dẫn Mở Tài Khoản Chứng Khoán',
        description: 'Quy trình mở tài khoản chứng khoán từ A đến Z cho người mới bắt đầu đầu tư vào thị trường.',
        content: 'Để bắt đầu đầu tư chứng khoán, bước đầu tiên quan trọng nhất là mở tài khoản...',
        category: 'Hướng Dẫn',
        author: 'Phạm Thị D',
        featuredImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
        createdAt: new Date('2024-01-08'),
        readTime: 6,
        views: 1680,
        tags: ['tài khoản chứng khoán', 'hướng dẫn', 'đầu tư']
      },
      {
        _id: '5',
        title: 'Xu Hướng ESG Trong Đầu Tư Hiện Đại',
        description: 'Tìm hiểu về xu hướng đầu tư bền vững ESG và tác động tích cực đến thị trường tài chính toàn cầu.',
        content: 'ESG (Environmental, Social, Governance) đang trở thành xu hướng đầu tư quan trọng...',
        category: 'Xu Hướng',
        author: 'Hoàng Văn E',
        featuredImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop',
        createdAt: new Date('2024-01-05'),
        readTime: 7,
        views: 945,
        tags: ['ESG', 'đầu tư bền vững', 'trách nhiệm xã hội']
      },
      {
        _id: '6',
        title: 'DCA - Chiến Lược Đầu Tư Định Kỳ',
        description: 'Tại sao Dollar Cost Averaging lại là chiến lược đầu tư an toàn và hiệu quả cho người mới bắt đầu?',
        content: 'Dollar Cost Averaging hay DCA là một trong những chiến lược đầu tư phổ biến nhất...',
        category: 'Đầu Tư',
        author: 'Nguyễn Thị F',
        featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
        createdAt: new Date('2024-01-03'),
        readTime: 4,
        views: 1320,
        tags: ['DCA', 'dollar cost averaging', 'chiến lược đầu tư']
      },
      {
        _id: '7',
        title: 'Đánh Giá Cổ Phiếu Theo Phương Pháp P/E',
        description: 'Học cách sử dụng tỷ số P/E để đánh giá giá trị cổ phiếu và đưa ra quyết định đầu tư thông minh.',
        content: 'Tỷ số P/E (Price-to-Earnings) là một trong những chỉ số quan trọng nhất trong phân tích cổ phiếu...',
        category: 'Phân Tích',
        author: 'Trần Văn G',
        featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
        createdAt: new Date('2024-01-01'),
        readTime: 6,
        views: 780,
        tags: ['P/E ratio', 'định giá cổ phiếu', 'phân tích tài chính']
      },
      {
        _id: '8',
        title: 'Quản Lý Rủi Ro Trong Đầu Tư Cổ Phiếu',
        description: 'Các nguyên tắc và phương pháp quản lý rủi ro hiệu quả để bảo vệ danh mục đầu tư của bạn.',
        content: 'Quản lý rủi ro là yếu tố then chốt quyết định thành công hay thất bại trong đầu tư...',
        category: 'Hướng Dẫn',
        author: 'Lê Thị H',
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
        createdAt: new Date('2023-12-28'),
        readTime: 9,
        views: 1150,
        tags: ['quản lý rủi ro', 'đầu tư cổ phiếu', 'danh mục đầu tư']
      },
      {
        _id: '9',
        title: 'Thị Trường Trái Phiếu Việt Nam 2024',
        description: 'Tổng quan thị trường trái phiếu Việt Nam và những cơ hội đầu tư trong năm 2024.',
        content: 'Thị trường trái phiếu Việt Nam đang có những diễn biến tích cực với nhiều sản phẩm mới...',
        category: 'Tin Tức',
        author: 'Phạm Văn I',
        featuredImage: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=400&h=250&fit=crop',
        createdAt: new Date('2023-12-25'),
        readTime: 5,
        views: 920,
        tags: ['trái phiếu', 'thị trường Việt Nam', 'đầu tư trái phiếu']
      },
      {
        _id: '10',
        title: 'Fintech và Tương Lai Của Ngành Tài Chính',
        description: 'Những xu hướng Fintech mới nhất và tác động của chúng đến ngành tài chính trong tương lai.',
        content: 'Công nghệ Fintech đang thay đổi hoàn toàn cách thức hoạt động của ngành tài chính...',
        category: 'Xu Hướng',
        author: 'Hoàng Thị J',
        featuredImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
        createdAt: new Date('2023-12-22'),
        readTime: 8,
        views: 1580,
        tags: ['fintech', 'công nghệ tài chính', 'tương lai ngân hàng']
      }
    ];

    res.json(sampleBlogArticles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles — Create a new article (for scraper or manual)
articleRoute.post("/", async (req, res) => {
  const {
    title,
    description,
    content,
    authorId,
    sourceId,
    url,
    category,
    featuredImage,
    tags
  } = req.body;

  if (!title || !content || !authorId || !sourceId || !url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newArticle = new Article({
      title,
      description,
      content,
      authorId,
      sourceId,
      url,
      category,
      featuredImage,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    // If duplicate (based on unique index), you'll get a Mongo error code
    if (err.code === 11000) {
      res.status(409).json({ error: "Article already exists" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Optional: GET /api/articles/:id — get single article
articleRoute.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("authorId", "name")
      .populate("sourceId", "name");

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default articleRoute;
