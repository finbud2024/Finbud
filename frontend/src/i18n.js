import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    title: "Mortgage Payment Calculator",
    homePrice: "Home price",
    downPayment: "Down payment",
    loanTerm: "Loan term",
    interestRate: "Interest rate",
    taxesFees: "Taxes, Insurance, HOA Fees",
    mortgageBreakdown: "Mortgage Payment Breakdown",
    principalInterest: "Principal & Interest",
    propertyTax: "Property Tax",
    homeownersInsurance: "Homeowners Insurance",
    pmi: "Private Mortgage Insurance",
    hoaFees: "HOA Fees",
    monthlyTotal: "Monthly total",
    errorMinHomePrice: "Minimum of $10,000 required",
    errorInterestRate: "Must be greater than 0",
    loan30: "30-year fixed",
    loan15: "15-year fixed",
    loan5: "5-year ARM",

    // Forum
    forums: {
      General: "General",
      Investing: "Investing",
      Crypto: "Crypto",
      Economy: "Economy",
      "Personal Finance": "Personal Finance",
      "Real Estate": "Real Estate",
      Fintech: "Fintech",
      AMA: "AMA",
      "Self Promotions": "Self Promotions",
      Memes: "Memes",
      Education: "Education",

      desc: {
        General: "General financial discussions",
        Investing: "Stock market and investment strategies",
        Crypto: "Cryptocurrency and blockchain",
        Economy: "Macroeconomics and financial news",
        "Personal Finance": "Budgeting and saving tips",
        "Real Estate": "Housing and mortgage discussions",
        Fintech: "Financial technology innovations",
        AMA: "Ask Me Anything with experts",
        "Self Promotions": "Share your projects and blogs",
        Memes: "Finance-related humor",
        Education: "Learning resources and literacy"
      }
    },
    startThread: "Start new thread",
    share: {
      title: "Share this post",
      section: "Share",
      copy: "Copy Link",
      copied: "Link Copied!"
    }

  },
  vi: {
    title: "Máy Tính Khoản Thanh Toán Thế Chấp",
    homePrice: "Giá nhà",
    downPayment: "Tiền trả trước",
    loanTerm: "Thời hạn vay",
    interestRate: "Lãi suất",
    taxesFees: "Thuế, Bảo hiểm, Phí HOA",
    mortgageBreakdown: "Chi tiết khoản thanh toán thế chấp",
    principalInterest: "Gốc & Lãi",
    propertyTax: "Thuế tài sản",
    homeownersInsurance: "Bảo hiểm nhà",
    pmi: "Bảo hiểm thế chấp tư nhân",
    hoaFees: "Phí HOA",
    monthlyTotal: "Hàng tháng",
    errorMinHomePrice: "Tối thiểu $10,000",
    errorInterestRate: "Phải lớn hơn 0",
    loan30: "Lãi suất cố định 30 năm",
    loan15: "Lãi suất cố định 15 năm ",
    loan5: "Lãi suất điều chỉnh 5 năm",

    //Forum
    forums: {
      General: "Tổng hợp",
      Investing: "Đầu tư",
      Crypto: "Tiền mã hóa",
      Economy: "Kinh tế",
      "Personal Finance": "Tài chính cá nhân",
      "Real Estate": "Bất động sản",
      Fintech: "Công nghệ tài chính",
      AMA: "Hỏi Đáp",
      "Self Promotions": "Quảng cáo",
      Memes: "Giải trí",
      Education: "Giáo dục",

      desc: {
        General: "Thảo luận tài chính chung",
        Investing: "Chiến lược đầu tư và thị trường chứng khoán",
        Crypto: "Tiền mã hóa và blockchain",
        Economy: "Kinh tế vĩ mô và tin tức tài chính",
        "Personal Finance": "Mẹo tiết kiệm và quản lý tài chính cá nhân",
        "Real Estate": "Thảo luận về nhà ở và thế chấp",
        Fintech: "Đổi mới trong công nghệ tài chính",
        AMA: "Hỏi đáp với chuyên gia",
        "Self Promotions": "Chia sẻ dự án và blog của bạn",
        Memes: "Góc giải trí liên quan đến tài chính",
        Education: "Chia sẻ tài liệu học tập về tài chính"
      }
    },
    startThread: "Tạo bài viết mới",
    share: {
      title: "Chia sẻ bài viết",
      section: "Chia sẻ",
      copy: "Sao chép",
      copied: "Đã sao chép liên kết!"
    }
  }
};

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;
