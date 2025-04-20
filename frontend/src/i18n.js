import { monthsToYears } from "date-fns";
import { createI18n } from "vue-i18n";

const messages = {
  en: {
    //Nav Bar
    overview: "Overview",
    about: "About",
    technology: "Technology",
    finManage: "Fin Manage",
    goal: "Goal",
    riskAnalysis: "Risk Analysis",
    investmentCalculator: "Investment Calculator",
    mortgageCalculator: "Mortgage Calculator",
    superInvestors: "Super Investors",
    finInvest: "Fin Invest",
    simulator: "Simulator",
    quant: "Quant",
    quantSimulator: "Quant Simulator",
    finEdu: "Fin Edu",
    quiz: "Quiz",
    event: "Event",
    forum: "Forum",
    finAgent: "Fin Agent",
    agent: "Agent",
    login: "Log In",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    logout: "Log Out",
    chat: "Chat",

    //Old  
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

    // QuizRewards component
    rewardTitle: "Reward Earned!",
    closeReward: "Close",

    // Search and Roadmap
    searchPlaceholder: "What do you want to learn today...",
    goalTitle: "What's your goal?",
    proficiencyLabel: "Proficiency level",
    proficiencyPlaceholder: "---",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    learningLabel: "You will learn",
    hoursPlaceholder: "Hours per day",
    daysPlaceholder: "Days per week",
    periodLabel: "In period",
    durationPlaceholder: "Duration",
    periodPlaceholder: "Select period",
    days: "Days",
    weeks: "Weeks",
    months: "Months",
    generateButton: "Create my roadmap",
    generatingButton: "Personalizing your roadmap...",

    // Quiz Section
    quizTitle: "Keyword-Based Quiz",
    keywordPlaceholder: "Enter a finance-related keyword",
    generateQuizButton: "Generate Quiz",
    relatedKeywordsLabel: "Related keyword",
    currentKeywordLabel: "Current Keyword:",
    pointsLabel: "Points:",
    timeLeftLabel: "Time Left:",
    questionPlaceholder: "Question will appear here",
    answerPlaceholder: "Answer {letter}",
    explanationTitle: "Explanation:",
    nextQuestionButton: "Next Question",
    quizResultTitle: "Quiz Result",
    sameKeywordButton: "New Game With Same Keyword",
    differentKeywordButton: "New Game With Different Keyword",
    endQuizButton: "End",

    // Course Categories
    categoriesLabel: "COURSE CATEGORIES",
    popularTopicsTitle: "Popular Topics To Learn",
    coursesLabel: "Courses",

    // Popular Courses
    popularCoursesSubtitle: "POPULAR COURSES",
    popularCoursesTitle: "Our Popular Courses",
    lessonsLabel: "Lessons",
    reviewsLabel: "Reviews",
    freeLabel: "Free",
    studentsLabel: "Students",

    //Goal Section

    // Bot Section
    botAltText: "Chatbot",
    profilePicAlt: "Profile picture",
    
    // Greetings
    morningGreeting: "Good Morning",
    afternoonGreeting: "Good Afternoon",
    eveningGreeting: "Good Evening",
    dashboardSlogan: "Manage your wallet wisely to reach your goals with ease",
    
    // Buttons
    connectBankButton: "Connect Your Bank Account",
    addButton: "Add",
    resetButton: "Reset",
    cancelButton: "Cancel",
    yesButton: "Yes",
    noButton: "No",
    editButton: "Edit",
    removeButton: "Remove",
    addGoalButton: "Add Goal",
    addTransactionButton: "Add Transaction",
    
    // Financial Summary
    totalRevenueLabel: "Total Revenue",
    totalExpenseLabel: "Total Expense",
    accountBalanceLabel: "Account Balance",
    
    // Transactions
    dailyTransactionsTitle: "Daily Transactions",
    addTransactionTitle: "Add Transaction",
    transactionTypePlaceholder: "Transaction Type",
    creditedOption: "Credited",
    debitedOption: "Debited",
    descriptionPlaceholder: "Description",
    amountPlaceholder: "Amount",
    datePlaceholder: "Date",
    
    // Table Headers
    descriptionHeader: "Description",
    dateHeader: "Date",
    amountHeader: "Amount",
    statusHeader: "Status",
    transactionHeader: "Transaction",
    creditedStatus: "Credited",
    debitedStatus: "Debited",
    
    // Goals Section
    goalsSectionTitle: "Goals",
    searchGoalsPlaceholder: "Search goals...",
    goalImageAlt: "Goal image",
    categoryLabel: "Category",
    totalLabel: "Total",
    savedLabel: "Saved",
    
    // Add Goal Modal
    addNewGoalTitle: "Add New Goal",
    goalTitleLabel: "Goal Title",
    goalTitlePlaceholder: "Enter your goal title",
    descriptionLabel: "Description",
    optionalLabel: "optional",
    descriptionPlaceholder: "Describe your goal (max 500 words)",
    charactersLabel: "characters",
    totalMoneyNeededLabel: "Total Money Needed",
    totalMoneyNeededPlaceholder: "Total money needed",
    moneyHaveLabel: "Money Already Have",
    moneyHavePlaceholder: "Money already have",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    addNewCategoryOption: "Add New Category",
    newCategoryLabel: "New Category",
    newCategoryPlaceholder: "Enter new category",
    
    // Reset Account Modal
    resetAccountTitle: "Reset Account Balance",
    resetAccountMessage: "Are you sure you want to reset your account balance? This action will delete all your transactions.",

    // About Us Section
    aboutUsTitle: "About us",
    aboutUsDescription: "We are a Vietnam-based tech team working on AI integrations. FinBud is our first project with an aim to aid people with their financial decisions, from investing, accruing savings, to smart expenditures. Our team consists of experienced professionals with diverse backgrounds in technology, finance, and business. We are passionate about leveraging technology to make financial management accessible and straightforward for everyone.",
    meetOurTeamTitle: "Meet Our Team",
    
    // Testimonials Section
    testimonialsTitle: "What our users say about FinBud",
    
    // Contact Section
    contactHeader: "We'd love to talk about how we can work together.",
    contactSubheader: "Let us know how we can help (or if we can't, tell us)!",
    
    // Contact Form
    fullNameLabel: "Full name",
    fullNamePlaceholder: "Frank Castle",
    emailLabel: "Your email",
    emailPlaceholder: "franklyfrank@example.com",
    companyNameLabel: "Company name",
    companyNamePlaceholder: "The P-Corp.",
    mobileNumberLabel: "Mobile number",
    mobileNumberPlaceholder: "+1 012 345 6789",
    messageLabel: "Your message",
    messagePlaceholder: "How can we help you?",
    sendMessageButton: "Send message",
    
    // Contact Info
    messageUsLabel: "Message us",
    callUsLabel: "Call us",

    //Member Intro
    // Team member roles
    roles: {
      ceo: "Founder & CEO",
      pm: "Project Manager",
      cto: "Chief Technology Officer (CTO)",
      dataLead: "Data Division Lead",
      fullstack: "Fullstack Engineer",
      frontend: "Front-end Engineer",
      backend: "Back-end Lead",
      aiEngineer: "Artificial Intelligence (AI) Engineer",
      dataScientist: "Data Analytics/Data Scientist"
    },
    
    // Team member introductions
    team: {
      intros: {
        tri: "Bachelor of Quantitative Economics and Computer Science from Macalester College with passion creating a startup that merges Finance, Technology, and Business to benefit Vietnam community",
        dung: "Full Stack Software Developer with 2 years of experience at F5 Networks and SVB, holding a Bachelor of Science degree in Computer Science from Washington State University",
        minh: "Master Degree in Computer Science and Economics from University of Iowa with an addition of Bachelor of Science in Statistics at Grinnell College. Passionate about AI/ML, software engineering, and the intersection of technology and economics.",
        phu: "Honours Bachelor of Business & Marketing from IBD@NEU, focused on applying advanced analysis techniques and strategies in FinTech.",
        huy: "Computer Scientist and Mathematics from DePauw University. Dedicated full stack developer passionate about new technologies and solving complex problems, driven to innovate and create impactful solutions.",
        linh: "Computer Science student from University of South Florida, specializing in full-stack software development with a focus on scalability. Deeply passionate about software engineering and exploring its potential applications in AI.",
        dungpham: "Computer Science student at University of South Florida, skilled in fullstack web development and wanting to dive into the fields of AI/ML, Fintech and Cloud Computing",
        khoi: "Pursuing a Bachelor of Computer Science at the New Jersey Institute of Technology. Enthusiastic about applying my skills to innovative projects and exploring new opportunities in the tech industry",
        binh: "Bachelor of Computer Science from VinUniversity with passion to leverage mathematics and technology such AI and Machine Learning, to augment medical treatment and mental health therapy",
        quang: "Business Management at Foreign Trade University and participated in an Exchange Program in Statistics and Econometrics at Uppsala University",
        khoa: "Applied LLM Developer with a Bachelor's degree in Data Science from the University of Rochester. Passionate about information retrieval and recommendation systems",
        tuan: "Pursuing a major in Computer Science at the University of Science, actively developing features for Finbud, a financial management project. Passionate about AI/ML and software engineering.",
        krystal: "Bachelor of Data Science student at Deakin University, dedicated to transforming data into impactful solutions. Passionate about addressing real-world challenges through data-driven approaches, always striving to make a meaningful difference.",
        bach: "Pursuing Computer Science Degree at VinUniversity"
      }
    },
    
    // Testimonials
    testimonials: {
      john: "FinBud has completely transformed my financial management. The AI chatbot provides spot-on advice and helps me stay on top of my investments and expenses.",
      jane: "I love using FinBud! It's like having a personal financial advisor available 24/7. The insights and tips are incredibly useful and easy to understand.",
      michael: "The best financial tool I have ever used. FinBud's AI is amazing at predicting market trends and giving personalized advice.",
      emily: "FinBud has helped me save so much money. The budgeting tools and financial insights are top-notch."
    },
    //Stock Simulator
    //Nav Bar
    appTitle: "Stock Simulator",
    navigation: {
      investment: "Investment",
      portfolio: "Your Portfolio",
      transactionHistory: "Transaction History",
      filters: "Filters",
      quiz: "Quiz",
      predictiveCalc: "Predictive Calculator"
    },
    investment: {
      keyStatistics: "Key Statistics",
      stats: {
        open: "Open",
        prevClose: "Prev Close",
        week52High: "52 Week High",
        week52Low: "52 Week Low",
        marketCap: "Market Cap",
        volume: "Volume"
      },
      actions: "Actions",
      actionForm: {
        placeholder: "Enter stock symbol",
        quantity: "Quantity",
        buy: "Buy",
        sell: "Sell",
        clear: "CLEAR",
        preview: "Preview Order"
      },
      accountPerformance: {
        accountBalance: "ACCOUNT BALANCE",
        cashBalance: "CASH BALANCE",
        stockValue: "STOCK VALUE",
        todaysChange: "TODAY'S CHANGE",
        annualReturn: "ANNUAL RETURN"
      }
    },
    portfolio: {
      title: "Your Investment Portfolio",
      overview: {
        totalValue: "Total Portfolio Value",
        stocks: "Stocks",
        cash: "Cash"
      },
      holdings: {
        title: "Your Holdings",
        tableHeaders: {
          ticker: "Stock Ticker",
          quantity: "Share Quantity",
          currentPrice: "Current Price Per Share",
          purchasedValue: "Total Purchased Value",
          marketValue: "Current Market Value",
          gainLoss: "Gain/Loss",
          percentChange: "% Change"
        }
      }
    },
    currencySymbol: "$",
    shares: "shares",
    chatComponent: {
      rename: "Rename",
      delete: "Delete",
      deleteConfirm:"Delete Chat ?",
      deleteConfirmMessage: "This will delete",
      cancel: "Cancel",
      guildence: "Guidence",
      sendButton: "Send",
      responsePlaceholder: "Phản hồi từ FinBud sẽ xuất hiện ở đây"
    },

    //Chat
    message:"Type your message here... "
  },
  vi: {

    //Nav Bar
    overview: "Tổng quan",
    about: "Giới thiệu",
    technology: "Công nghệ",
    finManage: "Fin Quản lý",
    goal: "Chi tiêu",
    riskAnalysis: "Dữ liệu thị trường",
    investmentCalculator: "Tính toán Đầu tư",
    mortgageCalculator: "Tính toán Thế chấp",
    superInvestors: "Đầu tư tài chính",
    finInvest: "Fin Đầu tư",
    simulator: "Mô phỏng",
    quant: "Định lượng",
    quantSimulator: "Mô phỏng Định lượng",
    finEdu: "Fin Giáo dục",
    quiz: "Quiz",
    event: "Sự kiện",
    forum: "Forum",
    finAgent: "Fin Tài chính",
    agent: "Agent",
    login: "Đăng nhập",
    darkMode: "Chế độ tối",
    lightMode: "Chế độ sáng",
    logout: "Đăng xuất",
    chat: "Chat",
    //Old
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

    // QuizRewards component
    rewardTitle: "Phần thưởng!",
    closeReward: "Đóng",

    // Search and Roadmap
    searchPlaceholder: "Bạn muốn học gì hôm nay...",
    goalTitle: "Mục tiêu của bạn là gì?",
    proficiencyLabel: "Trình độ",
    proficiencyPlaceholder: "---",
    beginner: "Mới bắt đầu",
    intermediate: "Trung cấp",
    advanced: "Nâng cao",
    learningLabel: "Bạn sẽ học",
    hoursPlaceholder: "Giờ mỗi ngày",
    daysPlaceholder: "Ngày mỗi tuần",
    periodLabel: "Trong khoảng thời gian",
    durationPlaceholder: "Thời lượng",
    periodPlaceholder: "Chọn khoảng thời gian",
    days: "Ngày",
    weeks: "Tuần",
    months: "Tháng",
    generateButton: "Tạo lộ trình của tôi",
    generatingButton: "Đang tạo lộ trình cá nhân hóa...",

    // Quiz Section
    quizTitle: "Câu đố theo từ khóa",
    keywordPlaceholder: "Nhập từ khóa liên quan đến tài chính",
    generateQuizButton: "Tạo Câu đố",
    relatedKeywordsLabel: "Từ khóa liên quan",
    currentKeywordLabel: "Từ khóa hiện tại:",
    pointsLabel: "Điểm:",
    timeLeftLabel: "Thời gian còn lại:",
    questionPlaceholder: "Câu hỏi sẽ hiển thị ở đây",
    answerPlaceholder: "Câu trả lời {letter}",
    explanationTitle: "Giải thích:",
    nextQuestionButton: "Câu hỏi tiếp theo",
    quizResultTitle: "Kết quả Câu đố",
    sameKeywordButton: "Chơi lại với cùng từ khóa",
    differentKeywordButton: "Chơi với từ khóa khác",
    endQuizButton: "Kết thúc",

    // Course Categories
    categoriesLabel: "DANH MỤC KHÓA HỌC",
    popularTopicsTitle: "Chủ đề phổ biến để học",
    coursesLabel: "Khóa học",

    // Popular Courses
    popularCoursesSubtitle: "KHÓA HỌC PHỔ BIẾN",
    popularCoursesTitle: "Các khóa học phổ biến của chúng tôi",
    lessonsLabel: "Bài học",
    reviewsLabel: "Đánh giá",
    freeLabel: "Miễn phí",
    studentsLabel: "Học viên",

    //Goal Section
    // Bot Section
    botAltText: "Chatbot trợ giúp",
    profilePicAlt: "Ảnh đại diện",
    
    // Greetings
    morningGreeting: "Chào buổi sáng",
    afternoonGreeting: "Chào buổi chiều",
    eveningGreeting: "Chào buổi tối",
    dashboardSlogan: "Quản lý ví thông minh để đạt mục tiêu dễ dàng",
    
    // Buttons
    connectBankButton: "Kết nối tài khoản ngân hàng",
    addButton: "Thêm",
    resetButton: "Đặt lại",
    cancelButton: "Hủy",
    yesButton: "Có",
    noButton: "Không",
    editButton: "Sửa",
    removeButton: "Xóa",
    addGoalButton: "Thêm mục tiêu",
    addTransactionButton: "Thêm giao dịch",
    
    // Financial Summary
    totalRevenueLabel: "Tổng thu nhập",
    totalExpenseLabel: "Tổng chi tiêu",
    accountBalanceLabel: "Số dư tài khoản",
    
    // Transactions
    dailyTransactionsTitle: "Giao dịch hàng ngày",
    addTransactionTitle: "Thêm giao dịch",
    transactionTypePlaceholder: "Loại giao dịch",
    creditedOption: "Ghi có",
    debitedOption: "Ghi nợ",
    descriptionPlaceholder: "Mô tả",
    amountPlaceholder: "Số tiền",
    datePlaceholder: "Ngày",
    
    // Table Headers
    descriptionHeader: "Mô tả",
    dateHeader: "Ngày",
    amountHeader: "Số tiền",
    statusHeader: "Trạng thái",
    transactionHeader: "Giao dịch",
    creditedStatus: "Ghi có",
    debitedStatus: "Ghi nợ",
    
    // Goals Section
    goalsSectionTitle: "Mục tiêu",
    searchGoalsPlaceholder: "Tìm kiếm mục tiêu...",
    goalImageAlt: "Hình ảnh mục tiêu",
    categoryLabel: "Danh mục",
    totalLabel: "Tổng",
    savedLabel: "Đã tiết kiệm",
    
    // Add Goal Modal
    addNewGoalTitle: "Thêm mục tiêu mới",
    goalTitleLabel: "Tiêu đề mục tiêu",
    goalTitlePlaceholder: "Nhập tiêu đề mục tiêu",
    descriptionLabel: "Mô tả",
    optionalLabel: "không bắt buộc",
    descriptionPlaceholder: "Mô tả mục tiêu (tối đa 500 chữ)",
    charactersLabel: "ký tự",
    totalMoneyNeededLabel: "Tổng tiền cần",
    totalMoneyNeededPlaceholder: "Tổng tiền cần thiết",
    moneyHaveLabel: "Tiền đã có",
    moneyHavePlaceholder: "Số tiền hiện có",
    startDateLabel: "Ngày bắt đầu",
    endDateLabel: "Ngày kết thúc",
    addNewCategoryOption: "Thêm danh mục mới",
    newCategoryLabel: "Danh mục mới",
    newCategoryPlaceholder: "Nhập danh mục mới",
    
    // Reset Account Modal
    resetAccountTitle: "Đặt lại số dư tài khoản",
    resetAccountMessage: "Bạn có chắc muốn đặt lại số dư tài khoản? Hành động này sẽ xóa tất cả giao dịch của bạn.",

    // About Us Section
    aboutUsTitle: "Về chúng tôi",
    aboutUsDescription: "Chúng tôi là một đội ngũ công nghệ tại Việt Nam chuyên về tích hợp AI. FinBud là dự án đầu tiên của chúng tôi với mục tiêu hỗ trợ mọi người trong các quyết định tài chính, từ đầu tư, tiết kiệm đến chi tiêu thông minh. Đội ngũ của chúng tôi bao gồm các chuyên gia giàu kinh nghiệm với nền tảng đa dạng về công nghệ, tài chính và kinh doanh. Chúng tôi đam mê ứng dụng công nghệ để làm cho việc quản lý tài chính trở nên dễ dàng và dễ tiếp cận với tất cả mọi người.",
    meetOurTeamTitle: "Đội Ngũ",
    
    // Testimonials Section
    testimonialsTitle: "Feedback",
    
    // Contact Section
    contactHeader: "Liên hệ ngay",
    contactSubheader: "Hãy cho chúng tôi biết cách chúng tôi có thể hỗ trợ bạn!",
    
    // Contact Form
    fullNameLabel: "Họ và tên",
    fullNamePlaceholder: "Nguyễn Văn A",
    emailLabel: "Email của bạn",
    emailPlaceholder: "vidu@example.com",
    companyNameLabel: "Tên công ty",
    companyNamePlaceholder: "Công ty ABC",
    mobileNumberLabel: "Số điện thoại",
    mobileNumberPlaceholder: "+84 123 456 789",
    messageLabel: "Lời nhắn của bạn",
    messagePlaceholder: "Chúng tôi có thể giúp gì cho bạn?",
    sendMessageButton: "Gửi tin nhắn",
    
    // Contact Info
    messageUsLabel: "Gửi tin nhắn",
    callUsLabel: "Gọi điện thoại",

    //Member Intro
    // Team member roles
    roles: {
      ceo: "Người sáng lập & Giám đốc điều hành",
      pm: "Quản lý dự án",
      cto: "Giám đốc công nghệ",
      dataLead: "Trưởng nhóm Dữ liệu",
      fullstack: "Kỹ sư Fullstack",
      frontend: "Kỹ sư Front-end",
      backend: "Trưởng nhóm Back-end",
      aiEngineer: "Kỹ sư Trí tuệ nhân tạo (AI)",
      dataScientist: "Phân tích/Khoa học dữ liệu"
    },
    
    // Team member introductions
    team: {
      intros: {
        tri: "Cử nhân Kinh tế Định lượng và Khoa học Máy tính từ Đại học Macalester với niềm đam mê khởi nghiệp kết hợp Tài chính, Công nghệ và Kinh doanh để mang lại lợi ích cho cộng đồng Việt Nam",
        dung: "Lập trình viên Full Stack với 2 năm kinh nghiệm tại F5 Networks và SVB, tốt nghiệp Cử nhân Khoa học Máy tính từ Đại học Washington State",
        minh: "Thạc sĩ Khoa học Máy tính và Kinh tế từ Đại học Iowa cùng với Cử nhân Khoa học Thống kê tại Đại học Grinnell. Đam mê AI/ML, kỹ thuật phần mềm và giao thoa giữa công nghệ và kinh tế.",
        phu: "Cử nhân Danh dự Kinh doanh & Marketing từ IBD@NEU, tập trung vào ứng dụng kỹ thuật và chiến lược phân tích nâng cao trong FinTech.",
        huy: "Nhà khoa học máy tính và toán học từ Đại học DePauw. Lập trình viên full stack tận tâm với công nghệ mới và giải quyết vấn đề phức tạp, luôn đổi mới và tạo ra các giải pháp có tác động.",
        linh: "Sinh viên Khoa học Máy tính tại Đại học South Florida, chuyên về phát triển phần mềm full-stack với trọng tâm là khả năng mở rộng. Đam mê kỹ thuật phần mềm và khám phá ứng dụng tiềm năng trong AI.",
        dungpham: "Sinh viên Khoa học Máy tính tại Đại học South Florida, có kỹ năng phát triển web fullstack và muốn đi sâu vào các lĩnh vực AI/ML, Fintech và Điện toán đám mây",
        khoi: "Theo học Cử nhân Khoa học Máy tính tại Viện Công nghệ New Jersey. Hăng hái ứng dụng kỹ năng vào các dự án đổi mới và khám phá cơ hội mới trong ngành công nghệ",
        binh: "Cử nhân Khoa học Máy tính từ Đại học VinUni với đam mê tận dụng toán học và công nghệ như AI và Học máy để nâng cao điều trị y tế và trị liệu sức khỏe tâm thần",
        quang: "Quản trị Kinh doanh tại Đại học Ngoại thương và tham gia Chương trình Trao đổi về Thống kê và Kinh tế lượng tại Đại học Uppsala",
        khoa: "Nhà phát triển LLM ứng dụng với bằng Cử nhân Khoa học Dữ liệu từ Đại học Rochester. Đam mê về truy xuất thông tin và hệ thống đề xuất",
        tuan: "Theo học chuyên ngành Khoa học Máy tính tại Đại học Khoa học, đang tích cực phát triển tính năng cho Finbud, một dự án quản lý tài chính. Đam mê AI/ML và kỹ thuật phần mềm.",
        krystal: "Sinh viên Cử nhân Khoa học Dữ liệu tại Đại học Deakin, cam kết biến đổi dữ liệu thành các giải pháp có tác động. Đam mê giải quyết các thách thức thực tế thông qua cách tiếp cận dựa trên dữ liệu, luôn nỗ lực tạo ra sự khác biệt có ý nghĩa.",
        bach: "Theo học bằng Cử nhân Khoa học Máy tính tại Đại học VinUni"
      }
    },
    
    // Testimonials
    testimonials: {
      john: "FinBud đã hoàn toàn thay đổi cách tôi quản lý tài chính. Chatbot AI đưa ra lời khuyên chính xác và giúp tôi kiểm soát đầu tư và chi tiêu.",
      jane: "Tôi rất thích sử dụng FinBud! Như có một cố vấn tài chính cá nhân 24/7. Các thông tin chi tiết và mẹo vô cùng hữu ích và dễ hiểu.",
      michael: "Công cụ tài chính tốt nhất tôi từng sử dụng. AI của FinBud rất tuyệt vời trong việc dự đoán xu hướng thị trường và đưa ra lời khuyên cá nhân hóa.",
      emily: "FinBud đã giúp tôi tiết kiệm rất nhiều tiền. Các công cụ lập ngân sách và thông tin tài chính đều hàng đầu."
    },
    //Stock Simulator
    //Nav Bar
    appTitle: "Mô Phỏng Chứng Khoán",
    navigation: {
      investment: "Đầu tư",
      portfolio: "Danh mục đầu tư",
      transactionHistory: "Lịch sử giao dịch",
      filters: "Bộ lọc",
      quiz: "Câu đố",
      predictiveCalc: "Máy tính dự đoán"
    },
    investment: {
      keyStatistics: "Thống kê chính",
      stats: {
        open: "Giá mở cửa",
        prevClose: "Giá đóng cửa trước",
        week52High: "52 tuần cao nhất",
        week52Low: "52 tuần thấp nhất",
        marketCap: "Vốn hóa thị trường",
        volume: "Khối lượng"
      },
      actions: "Hành động",
      actionForm: {
        placeholder: "Nhập mã cổ phiếu",
        quantity: "Số lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "XÓA",
        preview: "Xem trước lệnh"
      },
      accountPerformance: {
        accountBalance: "SỐ DƯ TÀI KHOẢN",
        cashBalance: "SỐ DƯ TIỀN MẶT",
        stockValue: "GIÁ TRỊ CỔ PHIẾU",
        todaysChange: "THAY ĐỔI HÔM NAY",
        annualReturn: "LỢI NHUẬN HÀNG NĂM"
      }
    },
    portfolio: {
      title: "Danh mục đầu tư của bạn",
      overview: {
        totalValue: "Tổng giá trị danh mục",
        stocks: "Cổ phiếu",
        cash: "Tiền mặt"
      },
      holdings: {
        title: "Danh mục nắm giữ",
        tableHeaders: {
          ticker: "Mã cổ phiếu",
          quantity: "Số lượng cổ phần",
          currentPrice: "Giá hiện tại mỗi cổ phiếu",
          purchasedValue: "Tổng giá trị đã mua",
          marketValue: "Giá trị thị trường hiện tại",
          gainLoss: "Lãi/Lỗ",
          percentChange: "% Thay đổi"
        }
      }
    },
    currencySymbol: "₫",
    shares: "cổ phiếu",
    chatComponent: {
      rename: "Đổi tên",
      delete: "Xoá",
      deleteConfirm:"Xóa cuộc trò chuyện?",
      deleteConfirmMessage: "Điều này sẽ xóa",
      cancel: "Hủy",
      guildence: "Hướng dẫn",
      sendButton: "Gửi",
      responsePlaceholder: "Phản hồi từ FinBud sẽ xuất hiện ở đây"
    }
  },
  //Chat
  message:"Nhập tin nhắn của bạn ở đây... "
};

const i18n = createI18n({
  locale: "vi",
  fallbackLocale: "vi",
  messages,
});

export default i18n;
