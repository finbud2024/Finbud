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
    percentChange: "% Change"
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
    percentChange: "% Thay Đổi"
  }
};

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;
