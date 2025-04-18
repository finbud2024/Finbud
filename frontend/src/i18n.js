import { monthsToYears } from "date-fns";
import { createI18n } from "vue-i18n";

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

    //Investment calculator
    investmentTitle: "Investment Calculator",
    initialInvestment: "Initial Investment ($)",
    annualInterestRate: "Annual Interest Rate (%)",
    years: "Years",
    compoundingFrequency: "Compounding Frequency",
    contributionAmount: "Additional Contribution",
    contributionPeriod: "Contribution Period",
    contributionTiming: "Contribution Timing",
    calculate: "Calculate",
    finalAmount: "Final Amount: ",
    annually: "Annually",
    quarterly: "Quartery",
    monthly: "Monthly",
    weekly: "Weekly",
    daily: "Daily",

    // For contribution options
    contributionAtThe: "Contribution at the",
    ofEach: "of each",
    beginning: "beginning",
    end: "end",
    month: "month",
    year: "year",

    // Results and graphs
    calculate: "Calculate",
    finAmount: "Final Amount: ",
    loan5: "5-year ARM",

    // Add portfolio translations
    investmentPortfolio: "Your Investment Portfolio",
    totalPortfolioValue: "Total Portfolio Value",
    stocks: "Stocks",
    cash: "Cash",
    yourHoldings: "Your Holdings",
    stockTicker: "Stock Ticker",
    shareQuantity: "Share Quantity",
    currentPricePerShare: "Current Price per Share",
    totalPurchasedValue: "Total Purchased Value",
    currentMarketValue: "Current Market Value",
    gainLoss: "Gain/Loss",
    percentChange: "% Change",

    //Stock simulator navbar
    stockSimulator: "Stock Simulator",
    investment: "Investment",
    portfolio: "Your Portfolio",
    transactionHistory: "Transaction History",
    filters: "Filters",
    quiz: "Quiz",
    predictiveCalc: "Predictive Calculator",

    //Envent Hub
    eventHub: {
      searchPlaceholder: "Search events...",
      exploreNearby: "Explore Near You",
      saved: "Saved",
      allEvents: "All Events",
      eventCategories: "Event Categories You May Like",
      trending: "Trending",
      readMore: "Read more",
      categories: {
        conference: "Conference & Summit",
        workshop: "Workshop & Training",
        webinars: "Webinars",
        networking: "Networking",
        careerFairs: "Career Fairs"
      },
      eventMap: {
        upcomingEvents: "Upcoming Events",
        eventImage: "Event Image",
        date: "Date",
        host: "Host",
        location: "Location",
        tba: "TBA"
      }
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

    // Investment calculator
    investmentTitle: "Máy Tính Đầu Tư",
    initialInvestment: "Khoản Đầu Tư Ban Đầu",
    annualInterestRate: "Lãi Suất Hằng Năm (%)",
    years: "Số Năm",
    compoundingFrequency: "Tần Suất Gộp Lãi",
    contributionAmount: "Khoản Đóng Góp",
    contributionPeriod: "Chu Kỳ Đóng Góp",
    contributionTiming: "Thời Điểm Đóng Góp",
    calculate: "Tính Toán",
    finalAmount: "Tổng Giá Trị Cuối",
    annually: "Theo năm",
    quarterly: "Theo quý",
    monthly: "Theo tháng",
    weekly: "Theo tuần",
    daily: "Theo ngày",

    // For contribution options
    contributionAtThe: "Đóng góp vào",
    ofEach: "của mỗi",
    beginning: "đầu kỳ",
    end: "cuối kỳ",
    month: "tháng",
    year: "năm",

    // Results and graphs
    calculate: "Tính",
    finAmount: "Tổng số tiền: ",
    loan5: "Lãi suất điều chỉnh 5 năm",

    // Add portfolio translations
    investmentPortfolio: "Danh Mục Đầu Tư Của Bạn",
    totalPortfolioValue: "Tổng Giá Trị Danh Mục",
    stocks: "Cổ Phiếu",
    cash: "Tiền Mặt",
    yourHoldings: "Cổ Phiếu Sở Hữu",
    stockTicker: "Mã Cổ Phiếu",
    shareQuantity: "Số Lượng",
    currentPricePerShare: "Giá Hiện Tại",
    totalPurchasedValue: "Tổng Giá Trị Mua",
    currentMarketValue: "Giá Trị Thị Trường",
    gainLoss: "Lãi/Lỗ",
    percentChange: "% Thay Đổi",

    //Stock simulator navbar
    stockSimulator: "Mô Phỏng Chứng Khoán",
    investment: "Đầu Tư",
    portfolio: "Danh Mục",
    transactionHistory: "Lịch Sử Giao Dịch",
    filters: "Bộ Lọc",
    quiz: "Câu Hỏi",
    predictiveCalc: "Máy Tính Phỏng Đoán",

    //Event Hub
    eventHub: {
      searchPlaceholder: "Tìm kiếm sự kiện...",
      exploreNearby: "Khám phá gần bạn",
      saved: "Đã lưu",
      allEvents: "Tất cả sự kiện",
      eventCategories: "Danh mục sự kiện bạn có thể thích",
      trending: "Xu hướng",
      readMore: "Xem thêm",
      categories: {
        conference: "Hội nghị & Hội thảo",
        workshop: "Workshop & Đào tạo",
        webinars: "Hội thảo trực tuyến",
        networking: "Kết nối mạng lưới",
        careerFairs: "Ngày hội việc làm"
      },
      eventMap: {
        upcomingEvents: "Sự kiện sắp tới",
        eventImage: "Hình ảnh sự kiện",
        date: "Ngày",
        host: "Người tổ chức",
        location: "Địa điểm",
        tba: "Chưa xác định"
      }
    }
  }
};

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
});

export default i18n;
