import { monthsToYears } from "date-fns";
import { createI18n } from "vue-i18n";
import StockComparision from "./components/FinInvest/QuantPage/StockComparision.vue";

const messages = {
  en: {
    //Nav Bar

    overview: "Overview",
    about: "About",
    technology: "Technology",
    finManage: "Fin Manage",
    goal: "Goal",
    riskAnalysis: "Market Data Center",
    investmentCalculator: "Investment Calculator",
    mortgageCalculator: "Mortgage Calculator",
    superInvestors: "Super Investors",
    finInvest: "Fin Invest",
    simulator: "Simulator",
    predictiveCalculator: "Predictive Calculator",
    autoTradeAI: "AutoTrade AI",
    quant: "Quant",
    quantSimulator: "Quant Simulator",
    macroEconomic: "Macro Economic Data",
    marketAnalysis: "Market Analysis",
    finEdu: "Fin Edu",
    quiz: "Quiz",
    learningRoadmap: "Learning Roadmap Creator",
    course: "Course",
    event: "Event",
    forum: "Forum",
    finAgent: "Fin Agent",
    finData: "Fin Data",
    agent: "Agent",
    news: "News",
    pestle: "PESTLE",
    finXpert: "FinXpert",
    realEstateAnalyst: "Real Estate Analyst",
    equityResearcher: "Equity Researcher",
    aiFinanceWorkflows: "AI Finance Workflows",
    privateEquityDealScout: "Private Equity Deal Scout",
    accountant: "AI Accountant",
    finVerse: "FinVerse",
    subscribeFinPlus: "Subscribe to FinPlus",
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
    profitEarned: "Profit Earned",

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
    sourceHeader: "Source",
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
    resetAccountMessage:
      "Are you sure you want to reset your account balance? This action will delete all your transactions.",

    // About Us Section
    aboutUsTitle: "About us",
    aboutUsDescription:
      "We are a Vietnam-based tech team working on AI integrations. FinBud is our first project with an aim to aid people with their financial decisions, from investing, accruing savings, to smart expenditures. Our team consists of experienced professionals with diverse backgrounds in technology, finance, and business. We are passionate about leveraging technology to make financial management accessible and straightforward for everyone.",
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
      dataScientist: "Data Analytics/Data Scientist",
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
        dungpham:
          "Computer Science student at University of South Florida, skilled in fullstack web development and wanting to dive into the fields of AI/ML, Fintech and Cloud Computing",
        khoi: "Pursuing a Bachelor of Computer Science at the New Jersey Institute of Technology. Enthusiastic about applying my skills to innovative projects and exploring new opportunities in the tech industry",
        binh: "Bachelor of Computer Science from VinUniversity with passion to leverage mathematics and technology such AI and Machine Learning, to augment medical treatment and mental health therapy",
        quang:
          "Business Management at Foreign Trade University and participated in an Exchange Program in Statistics and Econometrics at Uppsala University",
        khoa: "Applied LLM Developer with a Bachelor's degree in Data Science from the University of Rochester. Passionate about information retrieval and recommendation systems",
        tuan: "Pursuing a major in Computer Science at the University of Science, actively developing features for Finbud, a financial management project. Passionate about AI/ML and software engineering.",
        krystal:
          "Bachelor of Data Science student at Deakin University, dedicated to transforming data into impactful solutions. Passionate about addressing real-world challenges through data-driven approaches, always striving to make a meaningful difference.",
        bach: "Pursuing Computer Science Degree at VinUniversity",
      },
    },

    // Testimonials
    testimonials: {
      daniel:
        "FinBud helped me understand where my money goes each month. Simple insights, big impact.",
      rachel:
        "I've tried several money apps before, but none felt as intuitive as FinBud. It helped me figure out where my paycheck was going. The AI guidance makes a big difference—it feels personal. Now I've started building savings and even planning for retirement. I finally feel like I'm making smart choices with my money.",
      jane: "I love using FinBud! It's like having a personal financial advisor available 24/7. The insights and tips are incredibly useful and easy to understand.",
      julian:
        "I was always intimidated by financial planning. Spreadsheets overwhelmed me, and I never knew where to start.FinBud took that stress away with its clean interface and smart AI support. It categorized my spending automatically and gave me goals I could actually reach. After six months of using it, I've paid off two credit cards and started building an emergency fund. I finally feel like I'm in control of my finances instead of the other way around. It's more than an app—it's like having a coach that keeps me accountable. Highly recommend it to anyone feeling stuck or lost with money.",
      amelia:
        "FinBud's personalized advice was the game-changer I didn't know I needed. It adapts to my financial habits and pushes me gently in the right direction. From budgeting to investing, every feature feels thoughtful and well-designed. What really surprised me was how much I've learned just by using the app. The daily insights taught me more than any finance blog or YouTube video ever has. My relationship with money has completely shifted—from stress to confidence. FinBud truly empowers users to take charge.",
      marcus:
        "I used to bounce between multiple finance apps—one for spending, one for saving, another for investments. FinBud brought everything together in one sleek platform. It tracks my goals, shows me real-time progress, and gives advice that actually works. I've reduced unnecessary subscriptions, started a travel fund, and even put money into a Roth IRA. I don't need to be a finance expert anymore. FinBud makes complex decisions feel manageable. This app respects your time and rewards consistency. It's been a game-changer for how I handle money.",
      tyler:
        "The budgeting tool alone is worth it, but the real-time alerts are what keep me on track. It's like having a financial assistant watching out for me. I never miss a due date anymore.",
      ten: "FinBud doesn't just show you numbers—it explains them. I get clear, actionable tips that help me adjust my habits without guilt. It feels like I'm getting smarter about money every day. Even my partner started using it after seeing my progress. It's been a financial glow-up for both of us.",
      claire:
        "Tracking expenses used to stress me out, but FinBud simplified it all. The daily summaries help me stay accountable without being overwhelmed. I love how it celebrates milestones—it's motivating. It's the only finance app I've actually stuck with. Definitely recommend for anyone trying to build better habits.",
      sophie:
        "FinBud gives me confidence in every financial decision I make. It's easy to use and always spot-on with its advice. I've already saved more in 3 months than I did all last year.",
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
      predictiveCalc: "Predictive Calculator",
    },
    investment: {
      keyStatistics: "Key Statistics",
      stats: {
        open: "Open",
        prevClose: "Prev Close",
        week52High: "52 Week High",
        week52Low: "52 Week Low",
        marketCap: "Market Cap",
        volume: "Volume",
        eps: "EPS",
        pe: "PE",
        pb: "PB",
        low: "Low",
        high: "High",
      },
      actions: "Actions",
      actionForm: {
        placeholder: "Enter stock symbol",
        quantity: "Quantity",
        buy: "Buy",
        sell: "Sell",
        clear: "CLEAR",
        preview: "Preview Order",
      },
      accountPerformance: {
        accountBalance: "ACCOUNT BALANCE",
        cashBalance: "CASH BALANCE",
        stockValue: "STOCK VALUE",
        todaysChange: "TODAY'S CHANGE",
        annualReturn: "ANNUAL RETURN",
      },
      transactionHistory: "Transaction History",
      viewAllTransactions: "View All Transactions",
      table: {
        stockName: "Stock Name",
        quantity: "Quantity",
        action: "Action",
        amount: "Amount",
        date: "Date",
      },
    },
    portfolio: {
      title: "Your Investment Portfolio",
      overview: {
        totalValue: "Total Portfolio Value",
        stocks: "Stocks",
        cash: "Cash",
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
          percentChange: "% Change",
        },
      },
    },
    currencySymbol: "$",
    shares: "shares",
    chatComponent: {
      rename: "Rename",
      delete: "Delete",
      deleteConfirm: "Delete Chat ?",
      deleteConfirmMessage: "This will delete",
      cancel: "Cancel",
      guildence: "Guidence",
      sendButton: "Send",
      responsePlaceholder: "Phản hồi từ FinBud sẽ xuất hiện ở đây",
    },

    //Envent Hub
    eventHub: {
      searchPlaceholder: "Search events...",
      exploreNearby: "Explore Near You",
      saved: "Saved",
      allEvents: "All Events",
      eventCategories: "Event Categories You May Like",
      trending: "Trending",
      readMore: "Read more",
      dontMiss: "DON'T MISS OUT!",
      finDiscover: "Discover Top Financial Events Near You",
      categories: {
        conference: "Conference & Summit",
        workshop: "Workshop & Training",
        webinars: "Webinars",
        networking: "Networking",
        careerFairs: "Career Fairs",
      },
      eventMap: {
        upcomingEvents: "Upcoming Events",
        eventImage: "Event Image",
        date: "Date",
        host: "Host",
        location: "Location",
        tba: "TBA",
      },
    },

    //Chat
    message: "Type your message here... ",

    // Main Page Content
    empoweringTitle: "Empowering smarter finance decisions",
    anytimeAnswers: "Anytime answers for finance questions with FinBud",
    partneringTitle: "Partnering to Achieve Financial Goals",

    // Financial Awareness Section
    enhanceFinancialTitle: "Enhance Your Financial Awareness",
    enhanceFinancialDesc:
      "Finbud's advanced AI chatbot will help you review, explore financial topics, and answer all your questions.",

    // Financial Planning Section
    optimizeFinancialTitle: "Optimize Your Financial Planning",
    optimizeFinancialDesc:
      "Finbud helps you track and manage expenses, record income and spending, and tailor financial management to your specific goals.",

    // Investment Section
    maximizeInvestmentTitle: "Maximize Your Investment Efficiency",
    maximizeInvestmentDesc:
      "Finbud provides a comprehensive overview of the financial market, guiding you to optimize your capital confidently.",

    // Impact Section
    impactTitle: "Easily notice the impact",
    savingsIncrease: "Savings Increase",
    savingsDesc: "average per user",
    financialAwareness: "Financial Awareness",
    awarenessDesc: "increase",
    debtReduction: "Debt Reduction",
    debtDesc: "after 1 year",
    creditScore: "Improved Credit Score",
    creditDesc: "tháng trong vòng",

    // Features Section
    chatbotFeatureTitle: "Giải quyết lo lắng tài chính với",
    chatbotFeatureName: "AI Chatbot,",
    chatbotDesc:
      "Chỉ với những lệnh đơn giản và truy cập vào nguồn thông tin chính xác, đáng tin cậy, tất cả các câu hỏi tài chính của bạn có thể được trả lời ngay lập tức.",
    chatNow: "Trò chuyện ngay",

    simulatorFeatureTitle: "Làm chủ đầu tư của bạn với",
    simulatorFeatureName: "FinBud Simulator,",
    simulatorDesc:
      "Theo dõi hiệu suất đầu tư của bạn theo thời gian thực, cung cấp thông tin hữu ích từ đầu tư và thị trường để đưa ra quyết định đầu tư tốt hơn.",
    simulatorNow: "Mô phỏng ngay",

    goalFeatureTitle: "Dự đoán chi phí của bạn với",
    goalFeatureName: "FinBud Goal,",
    goalDesc:
      "AI của chúng tôi dự đoán các chi phí sắp tới để giúp bạn lập kế hoạch trước, hiểu mô hình chi tiêu và nhận lời khuyên để quản lý ngân sách tốt hơn.",
    goalNow: "Đặt mục tiêu ngay",

    quizFeatureTitle: "Nâng cao kỹ năng tài chính với",
    quizFeatureName: "FinBud Quiz,",
    quizDesc:
      "Câu đố tài chính với các chủ đề khác nhau liên quan đến nhiều từ khóa giúp bạn thực hành và học kiến thức tài chính một cách thông minh và tương tác.",
    quizNow: "Thử câu đố ngay",

    // Goal Page
    connect: "Connect Your Bank Account",
    totalTransactions: "Total Transactions",
    totalIncome: "Total Income",
    totalExpense: "Total Expense",
    accountBalance: "Account Balance",
    showForecast: "Show Forecast",
    dailyTransactions: "Daily Transactions",
    add: "Add",
    reset: "Reset",
    noData: "No transaction data available to display.",
    transactionChart: "Transaction Chart",
    goals: "Goals",
    addGoal: "Add Goal",
    searchGoals: "Search goals...",
    addNewGoal: "Add New Goal",
    goalTitle: "Goal Title",
    description: "Description (optional)",
    totalNeeded: "Total Money Needed",
    alreadyHave: "Money Already Have",
    startDate: "Start Date",
    endDate: "End Date",
    category: "Category",
    newCategory: "New Category",
    confirmReset:
      "Are you sure you want to reset your account balance? This action will delete all your transactions.",
    cancel: "No",
    confirm: "Yes",
    addTransaction: "Add Transaction",
    transactionType: "Transaction Type",
    transactionDescription: "Transaction description",
    amount: "Amount & Currency",
    dateTime: "Date",
    income: "Income",
    expense: "Expense",
    selectType: "Select type",
    selectCategory: "Select category",
    action: "Action",
    edit: "Edit",
    remove: "Remove",

    // FAQ Section
    faqTitle: "Frequently Asked Questions",
    faqs: {
      pricing: {
        question: "Is FinBud free to use, or are there any subscription plans?",
        answer:
          "FinBud offers both a free package with basic features and a subscription plan for some advanced features. Let's register to try all the free financial tools of FinBud before looking for more advanced options from us.",
      },
      chatbot: {
        question: "What kind of questions can the FinBud chatbot solve?",
        answer:
          "The FinBud chatbot is designed to assist with a wide range of inquiries, covering both financial and non-financial topics. Additionally, the chatbot allows you to directly execute various commands within FinBud's financial management, investment, and educational features. For example, you can buy or sell stocks, manage your budget, or look up financial terms. Simply click on the chat icon and follow the guidance to explore the full capabilities of the FinBud chatbot.",
      },
      investment: {
        question: "Does FinBud support investment tracking and management?",
        answer:
          "Yes, our Quant and Simulator pages provide an immersive experience for those exploring advanced finance. You can manage your investment portfolio, access in-depth stock analysis, and even practice real stock trading through our Simulator - perfect for beginners looking to gain hands-on investment experience.",
      },
      goals: {
        question:
          "Can I set financial goals with FinBud and track my progress?",
        answer:
          "Absolutely! With FinBud, you can set specific financial goals by defining details such as the category, target date, required amount, and current savings. On the Goal page, we help you stay on track by monitoring your daily transactions and providing detailed charts, ensuring you can reach each goal more effectively.",
      },
      mobile: {
        question:
          "Is FinBud available on mobile devices, and does it sync across platforms?",
        answer:
          "Có, FinBud có sẵn trên cả thiết bị di động và laptop. Chỉ cần đăng nhập vào tài khoản của bạn, và dữ liệu sẽ tự động đồng bộ trên tất cả các nền tảng để truy cập liền mạch.",
      },
    },
    // Chart Labels
    initialInvestmentLabel: "Đầu tư ban đầu",
    additionalContributionLabel: "Đóng góp bổ sung",
    profitEarnedLabel: "Lợi nhuận kiếm được",
    zillowNote: "Lãi suất được cung cấp qua Zillow.",
    yearNumber: "Năm {number}",
    // FundLetterPage Component
    fundLetters: "Thư quỹ",
    fundLettersArchive: "Kho lưu trữ thư quỹ",
    curatedListSubtitle:
      "Danh sách được tuyển chọn các thư quỹ phòng hộ theo quý",
    searchPlaceholder: "Tìm kiếm theo tên quỹ",
    allYears: "Tất cả các năm",
    allQuarters: "Tất cả các quý",
    fundName: "Tên quỹ",
    date: "Ngày",
    noResults: "Không tìm thấy thư nào cho bộ lọc đã chọn.",
    resetFilters: "Đặt lại bộ lọc",
    greatestInvestors: "Tuyển tập các nhà đầu tư vĩ đại",
    learnFromMasters: "Học từ những bậc thầy của đầu tư giá trị",

    // Investment Calculator Bot Messages
    investmentAnalysis: "Investment Analysis:",
    initialAmount: "Initial:",
    rateAmount: "Rate:",
    finalAmountBot: "Final:",

    // Technology Page
    technologyPage: {
      title: "Analytics that drive your business.",
      description:
        "Review your performance and drive change with our actionable insights provided via our intuitive web app.",
      features: {
        title: {
          plan: "Financial Planning",
          manage: "Debt and Investment Management",
          edu: "Financial Education",
          analyze: "Predictive Financial Analytics",
        },
        description: {
          plan: "Tôi giúp bạn tạo và duy trì kế hoạch tài chính cá nhân hoàn hảo.",
          manage:
            "Quản lý nợ và đầu tư một cách khôn ngoan với lời khuyên có mục tiêu phù hợp với mục tiêu của bạn.",
          edu: "Cung cấp kiến thức về các khái niệm tài chính cơ bản và nâng cao để trao quyền cho quyết định của bạn.",
          analyze:
            "Sử dụng AI để phân tích và dự đoán xu hướng tài chính để đưa ra quyết định thông minh.",
        },
      },
      financialConsulting: {
        title: "Tư vấn tài chính",
        note: "Kế hoạch cá nhân hóa để bảo vệ tương lai tài chính của bạn.",
        highlightsLeft: [
          "Quản lý nợ",
          "Chiến lược tiết kiệm",
          "Lời khuyên đầu tư",
        ],
        highlightsRight: [
          "Lập kế hoạch tài chính tùy chỉnh",
          "Hướng dẫn theo mục tiêu",
          "Quản lý tài sản cá nhân",
        ],
        button: "Bắt đầu dùng thử miễn phí 30 ngày",
      },
      financialEducation: {
        title: "Financial Education",
        note: "Empower yourself with knowledge to make better financial decisions.",
        highlights: [
          "Basic to Advanced Financial Concepts",
          "Interactive Lessons and Quizzes",
          "Real-time Financial Trend Analysis",
          "AI-Driven Insights",
        ],
        button: "Start your 30-day free trial",
      },
      insights: {
        title: "ARTIFICIAL INTELLIGENCE",
        subtitle: "Get real-time insights on your performance.",
        description:
          "Empower your financial decisions with our cutting-edge AI technology.",
        points: [
          "Personalized Financial Analysis: Gain comprehensive insights with auto-generated reports tailored to your financial behavior, helping you optimize your budget and savings.",
          "Trend Prediction: Our AI-driven tools analyze past spending and earning trends to forecast your financial future, enabling proactive financial planning.",
        ],
        button: "Tìm hiểu thêm",
      },
      computerVision: {
        title: "CHATBOT AI TIÊN TIẾN",
        subtitle: "Hỗ trợ tài chính thông minh trong tầm tay.",
        featuresTitle: {
          analyze: "Thông tin tài chính tức thì",
          plan: "Lập kế hoạch tài chính tương tác",
          secure: "Bảo mật và bí mật",
        },
        featuresDescription: {
          analyze:
            "Đặt bất kỳ câu hỏi nào, từ mẹo lập ngân sách đến lời khuyên đầu tư, và nhận được câu trả lời ngay lập tức dựa trên dữ liệu.",
          plan: "Đặt bất kỳ câu hỏi nào, từ mẹo lập ngân sách đến lời khuyên đầu tư, và nhận được câu trả lời ngay lập tức dựa trên dữ liệu.",
          secure:
            "Hệ thống độc quyền của chúng tôi sử dụng mạng neural để xác định thông tin quan trọng nhất. Hãy nghĩ về nó như cách não bộ của bạn hoạt động, chỉ khác là nó không bao giờ mệt mỏi (hoặc cần 3 tách cà phê để qua ngày).",
        },
      },
      // partners: {
      //   description: " <a href='mailto:contact@yourdomain.com'></a>",
      //   left: "<a href='#'></a>",
      //   right: " <a href='#'>Learn more</a>"
      // }
      partners: {
        title: "Integrate with the best tools in the market",
        descriptionParts: [
          "Check out our connected partners. Don't see your software on the list of partners?",
          {
            type: "link",
            text: " Drop us a note",
            href: "mailto:contact@yourdomain.com",
          },
          " and we'll get them added.",
        ],
        left: {
          text: "Shop-Ware enables users to take advantage of their lightning-fast workflows to repair more cars every month.",
          linkText: "Learn more",
          linkHref: "#",
        },
        right: {
          text: "Tekmetric lets you unleash your shop's potential with their streamlined workflow settings.",
          linkText: "Learn more",
          linkHref: "#",
        },
      },
    },

    coursePage: {
      loadingText: "Loading data...",
      errorMessage: "Error loading data: }",
      retryButton: "Try Again",
      categories: {
        beginners: "FOR BEGINNERS",
        investments: "EFFECTIVE INVESTMENTS",
        fundamental: "FUNDAMENTAL ANALYSIS",
        technical: "TECHNICAL ANALYSIS",
      },
      viewMore: "View More",
      views: "views",
      emptyState: "No articles available in this category.",
      botMessage:
        "Hello there! 👋<br><br>This is FinBud financial learning hub. Here you can:<br><br>📚 Learn investment knowledge from basic to advanced<br>💡 Discover effective investment strategies<br>📊 Dive deep into fundamental and technical analysis<br><br>Explore articles by topic or search for content you are interested in!",
    },

    macroEcon: {
      chat: "Hello! I'm here to help you with your questions about macroeconomic data. You can ask me about GDP, FDI, CPI, and Import-Export data.",
      quarter: "Quarter",
      month: "Month",
      year: "Year",
      viewBy: "View by",
      from: "From",
      to: "To",
      see: "Select",
      overview: "Overview",
      gdp: "GDP",
      cpi: "CPI",
      fdi: "FDI",
      importExport: "Import-Export",
      enQuarter: {
        1: "Q1",
        2: "Q2",
        3: "Q3",
        4: "Q4",
      },
      enMonth: {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
      },
      header: {
        "Chỉ tiêu": "Indicator",
        "Đơn vị tính": "Unit",
        "Số liệu mới nhất": "Latest Data",
        "Giá trị": "Value",
        "Đồ thị": "Chart",
        STT: "No.",
      },
      unit: {
        "%": "%",
        "Tỷ VNĐ": "Billion VND",
        "Tỷ USD": "Billion USD",
        "Triệu USD": "Million USD",
        "VNĐ/USD": "VND/USD",
        "Triệu người": "Million People",
        "Nghìn đồng": "Thousand Dong",
        USD: "USD",
      },
      "Tổng quan": {
        "Chỉ số giá tiêu dùng": "Consumer Price Index",
        "Tăng trưởng GDP": "GDP Growth",
        "GDP theo giá hiện hành": "GDP at Current Prices",
        "GDP theo giá cố định (2010)": "GDP at Constant Prices",
        "Tổng trị giá Xuất khẩu": "Total Export Value",
        "Tổng trị giá Nhập khẩu": "Total Import Value",
        "Toàn ngành công nghiệp": "Total Industrial Sector Growth",
        "FDI Giải ngân": "FDI Disbursement",
        "Cung tiền M2": "M2 Money Supply",
        "Tỷ giá trung tâm": "Central Exchange Rate",
        "Tăng trưởng bán lẻ": "Retail Sales Growth",
        "Dân số": "Population",
        "Tỷ lệ thất nghiệp thành thị": "Urban Unemployment Rate",
      },
      GDP: {
        Quý: {
          "Cơ cấu GDP theo giá hiện tại": "GDP Structure at Current Prices",
          "Nông nghiệp": "Agriculture",
          "Công nghiệp": "Industry",
          "Dịch vụ": "Services",
          "Tăng trưởng thực của GDP": "Real GDP Growth",
          "Tổng GDP": "Total GDP",
          "Giá trị GDP (2010)": "GDP Value (2010)",
          "GDP theo giá cố định (2010)": "GDP at Constant Prices (2010)",
          "Giá trị GDP hiện hành": "GDP Value at Current Prices",
          "GDP theo giá hiện hành": "GDP at Current Prices",
        },
        Năm: {
          "Thu nhập bình quân": "Per Capita Income",
          "GDP bình quân": "GDP per Capita (VND)",
          "GNI bình quân": "GNI per Capita (VND)",
          "GDP bình quân (USD)": "GDP per Capita (USD)",
          "Tăng trưởng thực của GDP": "Real GDP Growth",
          "Tổng GDP": "Total GDP",
          "Nông nghiệp": "Agriculture",
          "Công nghiệp": "Industry",
          "Dịch vụ": "Services",
          "Cơ cấu GDP theo giá hiện tại": "GDP Structure at Current Prices",
          "Giá trị GDP": "GDP Value",
          "GDP theo giá hiện hành": "GDP at Current Prices",
          "GDP theo giá hiện hành (ước tính)":
            "GDP at Current Prices (Estimated)",
          "GDP theo giá cố định (2010)": "GDP at Constant Prices (2010)",
          "GDP theo giá cố định (2010) (ước tính)":
            "GDP at Constant Prices (2010) (Estimated)",
          "GNI theo giá hiện tại": "GNI at Current Prices",
        },
      },
      CPI: {
        Tháng: {
          "Chỉ số giá tiêu dùng": "Consumer Price Index",
          "Hàng ăn và dịch vụ ăn uống": "Food and Beverage Services",
          "Lương thực": "Cereals",
          "Thực phẩm": "Food",
          "Ăn uống ngoài gia đình": "Dining Out",
          "Đồ uống và thuốc lá": "Beverages and Tobacco",
          "May mặc, giày dép mũ nón": "Clothing, Footwear, and Hats",
          "Nhà ở và vật liệu xây dựng": "Housing and Building Materials",
          "Thiết bị và đồ dùng gia đình": "Household Equipment and Appliances",
          "Thuốc và dịch vụ y tế": "Medicines and Healthcare Services",
          "Giao thông": "Transport",
          "Bưu chính viễn thông": "Postal and Telecommunications",
          "Giáo dục": "Education",
          "Văn hóa, giải trí và du lịch": "Culture, Recreation, and Tourism",
          "Đồ dùng và dịch vụ khác": "Other Goods and Services",
        },
        Năm: {
          "Tháng 1": "January",
          "Tháng 2": "February",
          "Tháng 3": "March",
          "Tháng 4": "April",
          "Tháng 5": "May",
          "Tháng 6": "June",
          "Tháng 7": "July",
          "Tháng 8": "August",
          "Tháng 9": "September",
          "Tháng 10": "October",
          "Tháng 11": "November",
          "Tháng 12": "December",
          "Bình quân tháng": "Monthly Average",
          "Tháng 12 năm báo cáo so với tháng 12 năm trước":
            "December of the Reporting Year Compared to December of the Previous Year",
        },
      },
      "Xuất-Nhập khẩu": {
        Tháng: {
          "Xuất khẩu": "Exports",
          "Tổng trị giá Xuất khẩu": "Total Export Value (Million USD)",
          "Giày da": "Footwear (Leather)",
          "Dệt may": "Textiles",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Thủy sản": "Seafood",
          "Dầu thô": "Crude Oil",
          Gạo: "Rice",
          Café: "Coffee",
          "Điện tử máy tính": "Electronics and Computers",
          "Máy móc thiết bị": "Machinery and Equipment",
          "Nhập khẩu": "Imports",
          "Tổng trị giá Nhập khẩu": "Total Import Value (Million USD)",
          "Điện tử, máy tính và linh kiện":
            "Electronics, Computers, and Components",
          "Máy móc thiết bị, phụ tùng": "Machinery and Equipment, Parts",
          "Xăng dầu": "Petroleum Products",
          "Hóa chất": "Chemicals",
          "Sản phẩm hóa chất": "Chemical Products",
          "Sắt thép": "Iron and Steel",
          Vải: "Fabric",
          "Ô tô": "Automobiles",
          "Thức ăn gia súc": "Animal Feed",
        },
        Năm: {
          "Xuất khẩu": "Exports",
          "Hoa Kỳ": "United States",
          "Nhật Bản": "Japan",
          Australia: "Australia",
          "Trung Quốc": "China",
          Singapore: "Singapore",
          Đức: "Germany",
          Anh: "United Kingdom",
          Malaysia: "Malaysia",
          "Thái Lan": "Thailand",
          Pháp: "France",
          "Sản phẩm dệt may": "Textile Products",
          "Thủy sản": "Seafood",
          Gạo: "Rice (Thousand Tons)",
          Café: "Coffee (Thousand Tons)",
          "Cao su": "Rubber (Thousand Tons)",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Than đá": "Coal",
          "Tôm đông lạnh": "Frozen Shrimp",
          "Lương thực, Thực phẩm và động vật sống":
            "Grains, Food and Live Animals",
          "Đồ uống và thuốc lá": "Beverages and Tobacco",
          "NVL thô, không dùng để ăn, trừ nhiên liệu":
            "Raw Materials (Non-food, Excluding Fuel)",
          "Nhiêu liệu, dầu mỡ nhờn và vật liệu liên quan":
            "Lubricants, Oils, and Related Materials",
          "Dầu, mỡ, chất béo, sáp động, thực vật":
            "Oils, Fats, Waxes (Animal, Vegetable)",
          "Hoá chất và sản phẩm liên quan": "Chemicals and Related Products",
          "Hàng chế biến phân loại theo nguyên liệu":
            "Processed Goods Classified by Raw Materials",
          "Máy móc, phương tiện vận tải và phụ tùng":
            "Machinery, Transport Equipment and Parts",
          "Hàng chế biến khác": "Other Processed Goods",
          "Háng hóa không thuộc các nhóm trên":
            "Goods Not Classified in Above Groups",
          "Giá trị xuất khẩu (USD giá hiện hành)":
            "Export Value (USD at Current Prices)",
          "Nhập khẩu": "Imports",
          "Hàn Quốc": "South Korea",
          "Hồng Kông": "Hong Kong",
          Indonesia: "Indonesia",
          "Nguyên liệu thô, không dùng để ăn, trừ nhiên liệu":
            "Raw Materials (Non-food, Excluding Fuel)",
          "Máy móc, phương tiện vận tải": "Machinery, Transport Equipment",
          "Giá trị nhập khẩu (USD giá hiện hành)":
            "Import Value (USD at Current Prices)",
        },
      },
      FDI: {
        Tháng: {
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Billion USD)",
          "Giải ngân": "Disbursed FDI",
        },
        Năm: {
          "Quốc gia": "Country",
          "Tính lũy kế đến thời điểm hiện tại":
            "Cumulative to Date (Billion USD)",
          "Theo vùng lãnh thổ": "By Territory (Billion USD)",
          "Lĩnh vực": "Sector",
          "Sản xuất": "Manufacturing (Billion USD)",
          "Bất động sản": "Real Estate (Billion USD)",
          "Nông nghiệp": "Agriculture (Billion USD)",
          "Dịch vụ": "Services (Billion USD)",
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Million USD)",
          "Giải ngân": "Disbursed FDI",
        },
      },
    },
    marketAnalysisPage: {
      marketAnalysisTitle: "Market Analysis",
      All: "All",
      Positive: "Positive",
      Negative: "Negative",
      Neutral: "Neutral",
      LastUpdated: "Last Updated",
      Insight: "Insight",
      Today: "Today",
      "This Week": "This Week",
      "This Month": "This Month",
      mentions: "Mentions",
      marketAnalysis: {
        "Securities Company": "Công ty Chứng khoán",
        Press: "Báo chí",
        "Expert Community": "Cộng đồng Chuyên gia",
      },
      trend: {
        title: "Trend",
        topic: "Topic",
        categories: {
          All: "All",
          Securities: "Securities",
          Economy: "Economy",
          Industry: "Industry",
          Other: "Other",
        },
      },
      AINews: "AI News",
      insight: {
        "Market Analysis": "Market Analysis",
        Assessment: "Assessment",
        Details: "Details",
        Source: "Source",
        Analysis: "Analysis",
        Reference: "Reference",
        "Market Sentiment Over Time": "Market Sentiment Over Time",
      },
    },
    quantPage: {
      Date: "Date",
      StockComparison: "Stock Comparision",
      RiskRatio: "Risk Ratio",
      AlphaNIFTY50: "Alpha (NIFTY 50)",
      BetaNIFTY50: "Beta (NIFTY 50)",
      SharpeRatio: "Sharpe Ratio",
      SortinoRatio: "Sortino Ratio",
      StandardDeviation: "Standard Deviation",
      PastTrendVsFutureProjection: "Past trend & Future Projection",
      Simulation: "Simulation",
      Indicator: "Indicator",
      Period: "Period",
      Returns: "Returns",
      CloseValue: "Close Value",
      IndicatorValue: "Indicator Value",
      GBMSimulation: "GBM Simulation",
      GARCHSimulation: "GARCH Simulation",
      StockPortfolioDashboard: "Stock Portfolio Dashboard",
      StockTicker: "Stock Ticker",
      PriceChange: "Price Change",
      RelativeVolume: "Relative Volume (10d)",
      PERatio: "P/E Ratio",
      EPSDistributed: "EPS Distributed",
      DividendYield: "Dividend Yield",
      IndustrySector: "Industry Sector",
      SelectTicker: "Select Ticker",
      TickerNameSearch: "Search by Ticker Name",
      Cummulative: "Cumulative",
      Daily: "Daily",
      GraphPrice: "Price ($)",
      TimeStep: "Time Step",
      Date: "Date",
      Value: "Value",
      MonteCarloSimulation: " Monte Carlo Simulation",
      simulationChatBot: `
      <div style="text-align: left;">
        <b>GBM vs. GARCH Models</b><br/><br/>
        The chart above compares stock price simulations using two models:<br/><br/>
        <ul>
          <li><b>GBM (Geometric Brownian Motion):</b> Assumes constant volatility and normally distributed returns. Commonly used in financial modeling for its simplicity.</li>
          <li><b>GARCH (Generalized Autoregressive Conditional Heteroskedasticity):</b> Accounts for changing (time-varying) volatility over time, making it more suitable for modeling real-world market behavior and shocks.</li>
        </ul>
        <br/>
        Use this comparison to evaluate how volatility assumptions affect projected price paths over time.
      </div>
    `,

      closeValueChatBot: `
      <div style="text-align: left;">
        <b>Close Price Graph</b><br/><br/>
        This chart displays the historical closing prices of the selected stock:<br/><br/>
        <ul>
          <li><b>Close Price:</b> The final trading price of the stock for each day, reflecting market consensus.</li>
        </ul>
        <br/>
        Use this graph to observe price trends, patterns, and historical performance over time.
      </div>
    `,

      indicatorAndReturnChatBot: `
      <div style="text-align: left;">
        <b>Return & Technical Indicator Graphs</b><br/><br/>
        These charts help analyze stock performance and market behavior:<br/><br/>
        <ul>
          <li><b>Return Graph:</b> Shows <i>daily</i> or <i>cumulative</i> returns over time. Use it to compare stock performance across periods.</li>
          <li><b>Indicator Graph:</b> Plots technical indicators like SMA, EMA, RSI, MACD, or Bollinger Bands to help identify trends and signals.</li>
        </ul>
        <br/>
        Use these tools to assess growth, momentum, and potential entry/exit points.
      </div>
    `,
    },
    FundLetter: "Fund Letter",
    FinData: "Fin Data",
    ProductComparison: "Product Comparison",

    // Financial Dashboard translations
    financialDashboard: "Financial Dashboard",
    trackTransactionsGoals: "Track Transactions and Goals",
    currentBalance: "Current Balance",
    monthlyIncome: "Monthly Income",
    monthlyExpense: "Monthly Expense",
    goalsAchieved: "Goals Achieved",
    thisMonth: "This Month",
    transactions: "Transactions",
    completion: "Completion",
    smartInsights: "Smart Insights",
    aiPoweredAnalysis: "AI-Powered Analysis",
    allCategories: "All Categories",
    allStatus: "All Status",
    active: "Active",
    completed: "Completed",
    overdue: "Overdue",
    sortByProgress: "Sort by Progress",
    sortByEndDate: "Sort by End Date",
    sortByAmount: "Sort by Amount",
    sortByCreated: "Sort by Created",
    searchGoalsPlaceholder: "Search Goals...",
    noGoalsFound: "No goals found",
    createYourFirstGoal:
      "Create your first goal to start tracking your financial progress.",

    // FAQ Section
    faqTitle: "Frequently Asked Questions",
    faqs: {
      pricing: {
        question: "Is FinBud free to use, or are there any subscription plans?",
        answer:
          "FinBud offers both a free package with basic features and a subscription plan for some advanced features. Let's register to try all the free financial tools of FinBud before looking for more advanced options from us.",
      },
      chatbot: {
        question: "What kind of questions can the FinBud chatbot solve?",
        answer:
          "The FinBud chatbot is designed to assist with a wide range of inquiries, covering both financial and non-financial topics. Additionally, the chatbot allows you to directly execute various commands within FinBud's financial management, investment, and educational features. For example, you can buy or sell stocks, manage your budget, or look up financial terms. Simply click on the chat icon and follow the guidance to explore the full capabilities of the FinBud chatbot.",
      },
      investment: {
        question: "Does FinBud support investment tracking and management?",
        answer:
          "Yes, our Quant and Simulator pages provide an immersive experience for those exploring advanced finance. You can manage your investment portfolio, access in-depth stock analysis, and even practice real stock trading through our Simulator - perfect for beginners looking to gain hands-on investment experience.",
      },
      goals: {
        question:
          "Can I set financial goals with FinBud and track my progress?",
        answer:
          "Absolutely! With FinBud, you can set specific financial goals by defining details such as the category, target date, required amount, and current savings. On the Goal page, we help you stay on track by monitoring your daily transactions and providing detailed charts, ensuring you can reach each goal more effectively.",
      },
      mobile: {
        question:
          "Is FinBud available on mobile devices, and does it sync across platforms?",
        answer:
          "Yes, FinBud is available on both mobile devices and laptops. Simply log in to your account, and your data will automatically sync across all platforms for seamless access.",
      },
    },

    // Course Page
    coursePage: {
      title: "Financial Courses",
      subtitle: "Learn and improve financial knowledge",
      categories: {
        beginners: "For Beginners",
        investments: "Effective Investments",
        fundamental: "Fundamental Analysis",
        technical: "Technical Analysis",
      },
      views: "views",
      viewMore: "View More",
      loading: "Loading courses...",
      noData: "No courses available",
      readTime: "min read",
    },

    // Market Analysis Page
    marketAnalysisPage: {
      marketAnalysisTitle: "Market Analysis",
      marketAnalysisDescription:
        "Comprehensive market data and analysis for informed investment decisions",
      Positive: "Positive",
      Neutral: "Neutral",
      Negative: "Negative",
      LastUpdated: "Last Updated",
      Insight: "Insight",
      mentions: "Mentions",
      AINews: "AI News",
      marketAnalysis: {
        StockCompany: "Stock Company",
        FinanceStock: "Finance Stock",
        TechCommunity: "Tech Community",
      },
      insight: {
        Assessment: "Assessment",
        Details: "Details",
        Source: "Source",
        Analysis: "Analysis",
        Reference: "Reference",
      },
      trend: {
        title: "Market Trends",
        topic: "Topic",
        categories: {
          All: "All",
          Securities: "Securities",
          Economy: "Economy",
          Industry: "Industry",
          Other: "Other",
        },
      },
    },

    stockSimulator: {
      pageTitle: "Stock Simulator",
      tabs: {
        investment: "Investment",
        portfolio: "Portfolio",
        filters: "Stock Screener",
        quiz: "Quiz",
        predictiveCalc: "Predictive Calculator",
      },
      trading: {
        quickTrade: "Quick Trade",
        stockSymbol: "Stock Symbol",
        stockSymbolPlaceholder: "Enter stock symbol (e.g., AAPL)",
        quantity: "Quantity",
        buy: "Buy",
        sell: "Sell",
        clear: "Clear",
      },
      account: {
        summary: "Account Summary",
        balance: "Total Balance",
        cash: "Available Cash",
        stocks: "Stock Value",
        todayChange: "Today's Change",
      },
      portfolio: {
        totalPortfolio: "Total Portfolio Value",
        holdings: "Holdings",
        symbol: "Symbol",
        shares: "Shares",
        avgPrice: "Avg Price",
        currentPrice: "Current Price",
        totalValue: "Total Value",
        gainLoss: "Gain/Loss",
        noHoldings: "No holdings in portfolio",
      },
      screener: {
        title: "Stock Screener",
        subtitle: "Find stocks that match your investment criteria",
        quickPresets: "Quick Filters",
        marketCap: "Market Cap",
        sector: "Sector",
        priceRange: "Price Range",
        peRatio: "P/E Ratio",
        dividendYield: "Dividend Yield",
        volume: "Volume",
        beta: "Beta",
        resetFilters: "Reset Filters",
        savePreset: "Save Filter",
        stocksFound: "stocks found",
        loading: "Loading...",
        loadingStocks: "Loading stock data...",
        enterPresetName: "Enter filter name:",
        presetSaved: "Filter Saved",
        presetSavedMessage: 'Filter "{name}" was saved successfully',
        presets: {
          growthStocks: "Growth Stocks",
          valueStocks: "Value Stocks",
          dividendStocks: "Dividend Stocks",
          largeCap: "Large Cap",
          smallCap: "Small Cap",
        },
        marketCapOptions: {
          mega: "Mega Cap (>$200B)",
          large: "Large Cap ($10B–$200B)",
          mid: "Mid Cap ($2B–$10B)",
          small: "Small Cap ($300M–$2B)",
          micro: "Micro Cap (<$300M)",
        },
        sectors: {
          technology: "Technology",
          healthcare: "Healthcare",
          financials: "Financials",
          energy: "Energy",
          industrials: "Industrials",
          materials: "Materials",
          utilities: "Utilities",
          realestate: "Real Estate",
          consumer_discretionary: "Consumer Discretionary",
          consumer_staples: "Consumer Staples",
          telecommunications: "Telecommunications",
        },
      },
      notifications: {
        orderSuccess: "Order Successful",
        buySuccess: "Successfully bought {quantity} shares of {symbol}",
        sellSuccess: "Successfully sold {quantity} shares of {symbol}",
        orderError: "Order Failed",
        networkError: "Network Error",
      },
    },

    // Forum Page
    forumPage: {
      title: "Community Forum",
      loadMore: "Load More",
      loading: "Loading...",
      noThreads: "No threads available",
      createThread: "Create New Thread",
      search: "Search threads...",
      categories: {
        general: "General Discussion",
        investing: "Investment Strategies",
        news: "Market News",
        analysis: "Technical Analysis",
        education: "Financial Education",
      },
      thread: {
        replies: "replies",
        views: "views",
        lastReply: "Last reply",
        by: "by",
        startThread: "Start New Thread",
        reply: "Reply",
        edit: "Edit",
        delete: "Delete",
      },
    },
    // Market Data Center
    marketDataCenter: {
      title: "Market Data Center",
      sections: {
        cryptocurrency: "CRYPTOCURRENCY",
        stock: "STOCKS",
        realEstate: "REAL ESTATE",
      },
      loading: "Loading market data...",
      error: "Unable to load market data",
      refresh: "Refresh Data",
      lastUpdated: "Last Updated",
      change24h: "24h Change",
      marketCap: "Market Capitalization",
      volume: "Volume",
      price: "Price",
    },
    // Fin Compare (Product Comparison)
    finCompare: {
      title: "Smart Financial Product Comparison",
      compare: "Compare Financial Products",
      addProduct: "Add Product",
      removeProduct: "Remove Product",
      noProducts: "No products to compare",
      selectProducts: "Select products to compare",
      features: "Features",
      pricing: "Pricing",
      ratings: "Ratings",
      pros: "Pros",
      cons: "Cons",
      recommendation: "Our Recommendation",
      filterByPriority: "Filter by Priority",
      loading: "Loading...",
      error: "Unable to load bank data. Please try again later.",
      bestChoice: "Best Choice",
      suggested: "Suggested",
      for: "for",
      priorities: {
        maxSavings: "Maximum Savings",
        lowestFees: "Lowest Fees",
        flexibleConditions: "Flexible Conditions",
      },
      table: {
        bank: "Bank",
        interestRate: "Interest Rate",
        issuanceFee: "Issuance Fee",
        maxLoanTerm: "Max Loan Term",
      },
      priorityTexts: {
        highestRate: "highest interest rate",
        lowestFees: "lowest fees",
        flexibleTerms: "most flexible terms",
      },
    },
    // Agent Page
    agentPage: {
      title: "AI Daily Financial Report Generator",
      subtitle: "AI-powered financial analysis and reporting",
      startWorkflow: "Start Analysis",
      processing: "Processing...",
      generateReport: "Generate Report",
      downloadReport: "Download Report",
      selectTicker: "Select Stock Ticker",
      analysisComplete: "Analysis Complete",
      reportReady: "Your report is ready",
      workflow: {
        step1: "Collect Data",
        step2: "Analyze Market",
        step3: "Generate Report",
        step4: "Final Review",
      },
    },
    // PESTLE Page
    pestlePage: {
      title: "PESTLE Analysis",
      subtitle:
        "Political, Economic, Social, Technological, Legal, Environmental Analysis",
      categories: {
        political: "Political",
        economic: "Economic",
        social: "Social",
        technological: "Technological",
        legal: "Legal",
        environmental: "Environmental",
      },
      analysis: "Analysis",
      impact: "Impact",
      risk: "Risk Level",
      opportunity: "Opportunity",
      loading: "Loading PESTLE analysis...",
      noData: "No analysis data available",
    },
    // Quant Analysis Page
    quantAnalysisPage: {
      title: "Quantitative Analysis",
      subtitle: "Advanced market analysis and visualization tools",
      sections: {
        marketAnalysis: "Market Analysis",
        dashboard: "Market Dashboard",
        heatmap: "Market Heatmap",
        monteCarlo: "Monte Carlo Simulation",
      },
      interpretation: "Market Analysis Interpretation",
      loading: "Loading market data...",
      loadingHeatmap: "Loading heatmap data...",
      loadingMonteCarlo: "Loading Monte Carlo simulation...",
      controls: {
        indicator: "Indicator",
        period: "Time Period",
        returnType: "Return Type",
        dataSource: "Data Source",
      },
    },
    // Quant Page detailed translations
    quantPage: {
      StockComparison: "Stock Comparison",
      StockPortfolioDashboard: "Stock Portfolio Dashboard",
      Indicator: "Indicator",
      Period: "Period",
      Returns: "Returns",
      Cummulative: "Cumulative",
      Daily: "Daily",
      RiskRatio: "Risk Ratio",
      SharpeRatio: "Sharpe Ratio",
      SortinoRatio: "Sortino Ratio",
      StandardDeviation: "Standard Deviation",
      PastTrendVsFutureProjection: "Past Trend vs Future Projection",
      Simulation: "Simulation",
      CloseValue: "Close Value",
      IndicatorValue: "Indicator Value",
      GBMSimulation: "GBM Simulation",
      GARCHSimulation: "GARCH Simulation",
      GraphPrice: "Graph Price",
      TimeStep: "Time Step",
      Date: "Date",
      Value: "Value",
      MonteCarloSimulation: "Monte Carlo Simulation",
      SelectTicker: "Select Ticker",
      TickerNameSearch: "Search ticker name...",
      StockTicker: "Stock Ticker",
      PriceChange: "Price Change",
      RelativeVolume: "Relative Volume",
      PERatio: "P/E Ratio",
      EPSDistributed: "EPS Distributed",
      DividendYield: "Dividend Yield",
      IndustrySector: "Industry/Sector",
      simulationChatBot: "Simulation from chatbot",
      closeValueChatBot: "Close value from chatbot",
      indicatorAndReturnChatBot: "Indicator and return from chatbot",
    },

    // Super Investor Page
    superInvestorPage: {
      title: "Great Investors",
      subtitle: "Learn from the greatest investors in the world",
      investors: "Investors",
      portfolio: "Portfolio",
      strategy: "Investment Strategy",
      performance: "Performance",
      biography: "Biography",
      quotes: "Famous Quotes",
      holdings: "Holdings",
      returns: "Annual Returns",
      viewProfile: "View Profile",
      followStrategy: "Follow Strategy",
      loading: "Loading investor data...",
      noInvestors: "No investors found",
      searchInvestors: "Search for investors...",
      greeting: "Hello! Looking for investment insights?",
      topInvestorsIntro:
        "Here are some top investors you might be interested in:",
      from: "from",
      portfolioValue: "Portfolio Value",
      avgHoldingPeriod: "Average Holding Period",
      learnMorePrompt:
        "Would you like to learn more about their investment strategy?",
    },

    // Chatbot Bubble
    chatbotBubble: {
      minimize: "Minimize",
      maximize: "Maximize",
      close: "Close",
      dragToMove: "Drag to move",
      chatWithFinBud: "Chat with FinBud",
      startConversation: "Start a conversation",
      needHelp: "Need financial help?",
      inactivityPrompt: "Need any help with finances?",
      marketHoursPrompt: "Markets are open! Want the latest analysis?",
      portfolioCheckPrompt:
        "It's been a while since you checked your portfolio. Need assistance?",
      budgetReminderPrompt:
        "End of the month! Want to review your budget and spending?",
      suggestions: {
        title: "Quick Suggestions",
        investment: "Investment Tips",
        portfolio: "Portfolio Analysis",
        market: "Market Info",
        budgeting: "Budgeting Tips",
        risk: "Risk Management",
        trading: "Trading Strategies",
      },
      typing: "FinBud is typing...",
      placeholder: "Type your financial question...",
      send: "Send",
      quickSuggestions: "Quick Suggestions",
      messageHistory: "Message History",
      clearHistory: "Clear History",
      error: "Sorry, something went wrong. Please try again.",
      reconnecting: "Reconnecting...",
      offline: "You are offline",
      poweredBy: "Powered by FinBud AI",
    },
    // Course Page
    coursePage: {
      title: "Finance Courses",
      subtitle: "Learn and enhance your financial knowledge",
      categories: {
        beginners: "For Beginners",
        investments: "Effective Investing",
        fundamental: "Fundamental Analysis",
        technical: "Technical Analysis",
      },
      views: "views",
      viewMore: "View More",
      loading: "Loading courses...",
      noData: "No courses available",
      readTime: "min read",
    },
    // Market Analysis Page
    marketAnalysisPage: {
      marketAnalysisTitle: "Market Analysis",
      marketAnalysisDescription:
        "Comprehensive market data and analysis for informed investment decisions",
      Positive: "Positive",
      Neutral: "Neutral",
      Negative: "Negative",
      LastUpdated: "Last Updated",
      Insight: "Insight",
      mentions: "Mentions",
      AINews: "AI News",
      marketAnalysis: {
        StockCompany: "Stock Company",
        FinanceStock: "Finance Stocks",
        TechCommunity: "Tech Community",
      },
      insight: {
        Assessment: "Assessment",
        Details: "Details",
        Source: "Source",
        Analysis: "Analysis",
        Reference: "Reference",
      },
      trend: {
        title: "Market Trends",
        topic: "Topic",
        categories: {
          All: "All",
          Securities: "Securities",
          Economy: "Economy",
          Industry: "Industry",
          Other: "Other",
        },
      },
    },
    // Quant Page
    quantPage: {
      StockComparison: "Stock Comparison",
      Indicator: "Indicator",
      Period: "Period",
      Returns: "Returns",
      Cummulative: "Cumulative",
      Daily: "Daily",
      RiskRatio: "Risk Ratio",
      SharpeRatio: "Sharpe Ratio",
      SortinoRatio: "Sortino Ratio",
      StandardDeviation: "Standard Deviation",
      PastTrendVsFutureProjection: "Past Trend vs Future Projection",
      Simulation: "Simulation",
      CloseValue: "Close Price",
      IndicatorValue: "Indicator Value",
      Date: "Date",
      Value: "Value",
      GraphPrice: "Price Chart",
      TimeStep: "Time Step",
      GBMSimulation: "GBM Simulation",
      GARCHSimulation: "GARCH Simulation",
      MonteCarloSimulation: "Monte Carlo Simulation",
      StockPortfolioDashboard: "Stock Portfolio Dashboard",
      TickerNameSearch: "Search stock ticker...",
      StockTicker: "Stock Ticker",
      PriceChange: "Price Change",
      RelativeVolume: "Relative Volume",
      PERatio: "P/E Ratio",
      EPSDistributed: "Distributed EPS",
      DividendYield: "Dividend Yield",
      IndustrySector: "Industry Sector",
      SelectTicker: "Select Stock Ticker",
      simulationChatBot: "Simulation analysis complete",
      closeValueChatBot: "Close price analysis ready",
      indicatorAndReturnChatBot: "Indicator and return analysis available",
    },

    stockSimulator: {
      pageTitle: "Stock Simulator",
      tabs: {
        investment: "Investment",
        portfolio: "Portfolio",
        filters: "Stock Filters",
        quiz: "Quiz",
        predictiveCalc: "Predictive Calculator",
      },
      trading: {
        quickTrade: "Quick Trade",
        stockSymbol: "Stock Symbol",
        stockSymbolPlaceholder: "Enter stock symbol (e.g., AAPL)",
        quantity: "Quantity",
        buy: "Buy",
        sell: "Sell",
        clear: "Clear",
      },
      account: {
        summary: "Account Summary",
        balance: "Total Balance",
        cash: "Available Cash",
        stocks: "Stock Value",
        todayChange: "Today's Change",
      },
      portfolio: {
        totalPortfolio: "Total Portfolio Value",
        holdings: "Holdings",
        loading: "Loading portfolio...",
        noHoldings: "No holdings",
        table: {
          symbol: "Symbol",
          shares: "Shares",
          currentPrice: "Current Price",
          marketValue: "Market Value",
          gainLoss: "Gain/Loss",
          change: "Change %",
        },
      },
      screener: {
        title: "Stock Screener",
        subtitle: "Find stocks that match your investment criteria",
        quickPresets: "Quick Presets",
        marketCap: "Market Cap",
        sector: "Sector",
        priceRange: "Price Range",
        peRatio: "P/E Ratio",
        dividendYield: "Dividend Yield",
        volume: "Volume",
        beta: "Beta",
        resetFilters: "Reset Filters",
        savePreset: "Save Preset",
        stocksFound: "stocks found",
        loading: "Loading...",
        loadingStocks: "Loading stocks data...",
        enterPresetName: "Enter preset name:",
        presetSaved: "Preset Saved",
        presetSavedMessage: 'Preset "{name}" saved successfully',
        presets: {
          growthStocks: "Growth Stocks",
          valueStocks: "Value Stocks",
          dividendStocks: "Dividend Stocks",
          largeCap: "Large Cap",
          smallCap: "Small Cap",
        },
        marketCapOptions: {
          mega: "Mega Cap (>$200B)",
          large: "Large Cap ($10B-$200B)",
          mid: "Mid Cap ($2B-$10B)",
          small: "Small Cap ($300M-$2B)",
          micro: "Micro Cap (<$300M)",
        },
        sectors: {
          technology: "Technology",
          healthcare: "Healthcare",
          financials: "Financials",
          energy: "Energy",
          industrials: "Industrials",
          materials: "Materials",
          utilities: "Utilities",
          realestate: "Real Estate",
          consumer_discretionary: "Consumer Discretionary",
          consumer_staples: "Consumer Staples",
          telecommunications: "Telecommunications",
        },
      },
      quiz: {
        title: "Stock Market Quiz",
        loading: "Loading quiz...",
      },
      notifications: {
        orderSuccess: "Order Successful",
        buySuccess: "Successfully bought {quantity} shares of {symbol}",
        sellSuccess: "Successfully sold {quantity} shares of {symbol}",
        orderError: "Order Failed",
        networkError: "Network error occurred",
      },
    },

    // Accountant Page
    accountantPage: {
      title: "AI Financial Intelligence",
      subtitle:
        "Smart financial document analysis with advanced AI technology. Optimize taxes, ensure compliance, and accurate financial forecasting.",
      hero: {
        title: "AI Financial Intelligence",
        subtitle:
          "Smart financial document analysis with advanced AI technology. Optimize taxes, ensure compliance, and accurate financial forecasting.",
        stats: {
          analyzed: "Documents Analyzed",
          savings: "Tax Savings",
          compliance: "Compliance Rate",
        },
      },

      // Upload Section
      upload: {
        title: "Document Analysis Center",
        subtitle: "Upload financial documents to receive instant AI insights",
        dragDrop: "Drag & Drop Documents",
        formats: "Supports PDF, Excel (.xlsx, .xls), CSV",
        chooseFiles: "Choose Files",
        quickStart: "Quick Templates",
      },

      // Templates
      templates: {
        income: "Income Statement",
        incomeDesc: "P&L Analysis",
        balance: "Balance Sheet",
        balanceDesc: "Financial Position Review",
        cashflow: "Cash Flow",
        cashflowDesc: "Track Money Flow",
        tax: "Tax Documents",
        taxDesc: "Tax Planning & Compliance",
      },

      // Dashboard
      dashboard: {
        title: "Smart Financial Dashboard",
        refresh: "Refresh",
        export: "Export Report",
        assistant: "AI Assistant",
        liveData: "Live Data",
        overview: "Financial Overview",
        aiInsights: "AI Insights",
        realtime: "Real-time",
        expenseAnalysis: "Expense Analysis",
        compliance: "Compliance Monitoring",
        complianceScore: "Compliance Score",
        taxOptimization: "Tax Optimization",
        forecasting: "Financial Forecasting",
        forecasting92: "92% Confidence",
        total: "Total",
        periods: {
          month: "This Month",
          quarter: "This Quarter",
          year: "This Year",
        },
        forecastPeriods: {
          next_month: "Next Month",
          next_quarter: "Next Quarter",
          next_year: "Next Year",
        },
        metrics: {
          revenue: "Revenue",
          profit: "Profit",
          strong_growth: "Strong Growth",
          sustained_growth: "Sustained Growth",
          exponential_growth: "Exponential Growth",
        },
      },

      // Financial Metrics
      metrics: {
        revenue: "Total Revenue",
        expenses: "Total Expenses",
        profit: "Net Profit",
        margin: "Profit Margin",
      },

      // AI Insights
      insights: {
        viewDetails: "View Details",
        revenue_growth: "Revenue Growth Opportunity",
        revenue_growthDesc:
          "Q4 revenue trends show 23% growth potential in tech services segment",
        cost_optimization: "Cost Optimization Alert",
        cost_optimizationDesc:
          "Office expenses up 18% this quarter. Consider renegotiating vendor contracts",
        cashflow_prediction: "Cash Flow Prediction",
        cashflow_predictionDesc:
          "Based on current trends, expect positive cash flow improvement next quarter",
        impact: {
          high: "High Impact",
          medium: "Medium Impact",
          low: "Low Impact",
        },
      },

      // Expenses
      expenses: {
        operations: "Operations",
        marketing: "Marketing",
        technology: "Technology",
        personnel: "Personnel",
      },

      // Compliance
      compliance: {
        tax_filing: "Tax Filing Compliance",
        tax_filingDesc: "All quarterly tax reports are up to date",
        reporting_standards: "Financial Reporting Standards",
        reporting_standardsDesc: "GAAP compliance verification complete",
        audit_trail: "Audit Trail Verification",
        audit_trailDesc: "Minor discrepancy detected in expense categorization",
        statuses: {
          compliant: "Compliant",
          "review required": "Review Required",
        },
      },

      // Tax Optimization
      tax: {
        savings: "Potential Savings",
        depreciation: "Depreciation Optimization",
        depreciationDesc:
          "Accelerate equipment depreciation to reduce current year tax liability",
        expenses: "Maximize Business Expenses",
        expensesDesc:
          "Identify missed deductible expenses from travel and entertainment",
        rd_credit: "R&D Tax Credit",
        rd_creditDesc: "Qualify for research and development tax incentives",
        actions: {
          implement: "Implement Now",
          review: "Review & Apply",
          consult: "Consult Expert",
        },
      },

      // Chatbot
      chatbot: {
        title: "FinXpert Assistant",
        placeholder: "Ask me anything about financial analysis...",
        greeting:
          "Hello! I'm your AI Financial Assistant. How can I help you today?",
        options: {
          upload: "Upload Documents",
          insights: "Explain Insights",
          tax: "Tax Optimization",
          compliance: "Check Compliance",
        },
        responses: {
          upload:
            "I can help you analyze various financial documents like income statements, balance sheets, cash flow reports, and tax documents. Just drag and drop your files to the upload area!",
          insights:
            "I provide AI-powered insights on financial performance, growth opportunities, cost optimization, and forecasting. What specific area would you like me to explain?",
          tax: "I can help identify tax optimization strategies, available tax credits, depreciation maximization, and tax reduction opportunities. What type of optimization interests you?",
          compliance:
            "I perform comprehensive compliance checks for financial reporting standards, tax requirements, and industry regulations. What type of compliance do you need to verify?",
        },
      },

      // Help & Processing
      help: {
        tooltip: "Need help? Ask our AI assistant!",
        processing: "Processing Financial Data",
      },

      // Notifications
      notifications: {
        title: "Financial Notifications",
        taxDeadline: "Tax deadline in {days} days",
        complianceAlert: "Compliance alert: Audit trail needs review",
        insightUpdate: "New insight: 23% growth opportunity detected",
        reportReady: "Analysis report completed",
        markAllRead: "Mark All as Read",
        viewAll: "View All",
      },

      // Advanced Features
      advanced: {
        realTimeMonitoring: "Real-Time Monitoring",
        predictiveAnalytics: "Predictive Analytics",
        riskAssessment: "Risk Assessment",
        benchmarking: "Benchmarking",
        customReports: "Custom Reports",
        dataVisualization: "Data Visualization",
        automatedInsights: "Automated Insights",
        smartAlerts: "Smart Alerts",
      },

      // Export Options
      export: {
        title: "Export Report",
        pdf: "Export PDF",
        excel: "Export Excel",
        powerpoint: "Export PowerPoint",
        email: "Send via Email",
        share: "Share Link",
        schedule: "Schedule Report",
      },

      // Risk Analysis
      risk: {
        title: "Risk Analysis",
        financial: "Financial Risk",
        operational: "Operational Risk",
        market: "Market Risk",
        regulatory: "Regulatory Risk",
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical",
      },

      // Performance Metrics
      performance: {
        roi: "Return on Investment",
        growth: "Growth Rate",
        efficiency: "Efficiency Score",
        profitability: "Profitability",
      },
    },
    newFeatures: {
      title: "New Features",
      subtitle: "Explore Our Latest Tools",
      aiCalculator: {
        title: "AI Predictive Calculator",
        description:
          "Advanced AI-powered investment predictions and portfolio optimization",
        tags: {
          aiModels: "AI Models",
          realTimeData: "Real-Time Data",
          charts: "Charts",
        },
        button: "Try AI Calculator",
      },
      roadmapCreator: {
        title: "Learning Roadmap Creator",
        description:
          "Personalized financial education paths tailored to your goals",
        tags: {
          personalized: "Personalized",
          stepByStep: "Step-by-Step",
          aiPowered: "AI-Powered",
        },
        button: "Create Roadmap",
      },
      enhancedQuiz: {
        title: "Enhanced Financial Quiz",
        description:
          "Interactive assessments with real-time feedback and scoring",
      },
      tags: {
        interactive: "Interactive",
        aiFeedback: "AI Feedback",
        progressTracking: "Progress Tracking",
      },
      button: "Take Quiz",
    },
  },
  vi: {
    //Nav Bar
    overview: "Tổng quan",
    about: "Giới thiệu",
    technology: "Công nghệ",
    finManage: "Fin Quản lý",
    goal: "Chi tiêu",
    riskAnalysis: "Trung tâm dữ liệu thị trường",
    investmentCalculator: "Tính toán Đầu tư",
    mortgageCalculator: "Tính toán Thế chấp",
    superInvestors: "Đầu tư tài chính",
    finInvest: "Fin Đầu tư",
    simulator: "Đầu Tư Mô Phỏng",
    predictiveCalculator: "Máy Tính Dự Đoán",
    autoTradeAI: "AI Giao Dịch Tự Động",
    quant: "Định lượng",
    quantSimulator: "Mô phỏng Định lượng",
    macroEconomic: "Kinh Tế Vĩ Mô",
    marketAnalysis: "Phân tích Thị trường",
    finEdu: "Fin Giáo dục",
    quiz: "Câu Đố",
    learningRoadmap: "Lộ Trình Học Tập",
    course: "Khoá học",
    event: "Sự kiện",
    forum: "Diễn Đàn",
    finAgent: "Fin Tài chính",
    agent: "Đại Lý",
    news: "Tin Tức",
    pestle: "Phân Tích PESTLE",
    finXpert: "FinXpert",
    realEstateAnalyst: "Chuyên Gia Bất Động Sản",
    equityResearcher: "Nhà Nghiên Cứu Cổ Phiếu",
    aiFinanceWorkflows: "Quy Trình Tài Chính AI",
    privateEquityDealScout: "Khảo Sát Giao Dịch Cổ Phần Tư Nhân",
    accountant: "Kế toán AI",
    finVerse: "FinVerse",
    subscribeFinPlus: "Đăng Ký FinPlus",
    login: "Đăng nhập",
    darkMode: "Chế độ tối",
    lightMode: "Chế độ sáng",
    logout: "Đăng xuất",
    chat: "Chat",

    // AccountantPage - Comprehensive Vietnamese translations
    accountantPage: {
      // Hero Section
      hero: {
        title: "Trí Tuệ Tài Chính AI",
        subtitle:
          "Phân tích tài liệu tài chính thông minh với công nghệ AI tiên tiến. Tối ưu hóa thuế, tuân thủ pháp luật và dự báo tài chính chính xác.",
        stats: {
          analyzed: "Tài liệu đã phân tích",
          savings: "Tiết kiệm thuế",
          compliance: "Tuân thủ",
        },
      },

      // Upload Section
      upload: {
        title: "Trung Tâm Phân Tích Tài Liệu",
        subtitle: "Tải lên tài liệu tài chính để nhận insights AI ngay lập tức",
        dragDrop: "Kéo & Thả Tài Liệu",
        formats: "Hỗ trợ PDF, Excel (.xlsx, .xls), CSV",
        chooseFiles: "Chọn File",
        quickStart: "Mẫu Nhanh",
      },

      // Templates
      templates: {
        income: "Báo Cáo Thu Nhập",
        incomeDesc: "Phân tích báo cáo P&L",
        balance: "Bảng Cân Đối",
        balanceDesc: "Xem xét tình hình tài chính",
        cashflow: "Dòng Tiền",
        cashflowDesc: "Theo dõi luồng tiền",
        tax: "Tài Liệu Thuế",
        taxDesc: "Lập kế hoạch & tuân thủ thuế",
      },

      // Dashboard
      dashboard: {
        title: "Bảng Điều Khiển Thông Minh Tài Chính",
        refresh: "Làm Mới",
        export: "Xuất Báo Cáo",
        assistant: "Trợ Lý AI",
        liveData: "Dữ Liệu Trực Tiếp",
        overview: "Tổng Quan Tài Chính",
        aiInsights: "Phân Tích AI",
        realtime: "Thời gian thực",
        expenseAnalysis: "Phân Tích Chi Phí",
        compliance: "Giám Sát Tuân Thủ",
        complianceScore: "Điểm Tuân Thủ",
        taxOptimization: "Tối Ưu Thuế",
        forecasting: "Dự Báo Tài Chính",
        forecasting92: "92% Độ Tin Cậy",
        total: "Tổng Cộng",
        periods: {
          month: "Tháng Này",
          quarter: "Quý Này",
          year: "Năm Này",
        },
        forecastPeriods: {
          next_month: "Tháng Tới",
          next_quarter: "Quý Tới",
          next_year: "Năm Tới",
        },
        metrics: {
          revenue: "Doanh Thu",
          profit: "Lợi Nhuận",
          strong_growth: "Tăng Trưởng Mạnh",
          sustained_growth: "Tăng Trưởng Bền Vững",
          exponential_growth: "Tăng Trưởng Vượt Trội",
        },
      },

      // Financial Metrics
      metrics: {
        revenue: "Tổng Doanh Thu",
        expenses: "Tổng Chi Phí",
        profit: "Lợi Nhuận Ròng",
        margin: "Tỷ Lệ Lợi Nhuận",
      },

      // AI Insights
      insights: {
        viewDetails: "Xem Chi Tiết",
        revenue_growth: "Cơ Hội Tăng Trưởng Doanh Thu",
        revenue_growthDesc:
          "Xu hướng doanh thu Q4 cho thấy tiềm năng tăng trưởng 23% ở mảng dịch vụ công nghệ",
        cost_optimization: "Cảnh Báo Tối Ưu Chi Phí",
        cost_optimizationDesc:
          "Chi phí văn phòng tăng 18% quý này. Nên cân nhắc đàm phán lại hợp đồng nhà cung cấp",
        cashflow_prediction: "Dự Báo Dòng Tiền",
        cashflow_predictionDesc:
          "Dựa trên xu hướng hiện tại, dự kiến cải thiện dòng tiền tích cực quý tới",
        impact: {
          high: "Tác Động Cao",
          medium: "Tác Động Trung Bình",
          low: "Tác Động Thấp",
        },
      },

      // Expenses
      expenses: {
        operations: "Vận Hành",
        marketing: "Marketing",
        technology: "Công Nghệ",
        personnel: "Nhân Sự",
      },

      // Compliance
      compliance: {
        tax_filing: "Tuân Thủ Nộp Thuế",
        tax_filingDesc: "Tất cả báo cáo thuế quý đã được cập nhật",
        reporting_standards: "Tiêu Chuẩn Báo Cáo Tài Chính",
        reporting_standardsDesc: "Xác minh tuân thủ GAAP hoàn tất",
        audit_trail: "Xác Minh Kiểm Toán",
        audit_trailDesc: "Phát hiện sai lệch nhỏ trong phân loại chi phí",
        statuses: {
          compliant: "Tuân Thủ",
          "review required": "Cần Xem Xét",
        },
      },

      // Tax Optimization
      tax: {
        savings: "Tiết Kiệm Tiềm Năng",
        depreciation: "Tối Ưu Khấu Hao",
        depreciationDesc:
          "Tăng tốc khấu hao thiết bị để giảm nghĩa vụ thuế năm hiện tại",
        expenses: "Tối Đa Hóa Chi Phí Kinh Doanh",
        expensesDesc:
          "Xác định chi phí khấu trừ bị bỏ lỡ từ đi lại và giải trí",
        rd_credit: "Tín Dụng Thuế R&D",
        rd_creditDesc: "Đủ điều kiện nhận ưu đãi thuế nghiên cứu và phát triển",
        actions: {
          implement: "Thực Hiện Ngay",
          review: "Xem Xét & Áp Dụng",
          consult: "Tham Vấn Chuyên Gia",
        },
      },

      // Chatbot
      chatbot: {
        title: "Trợ Lý FinXpert",
        placeholder: "Hỏi tôi bất cứ điều gì về phân tích tài chính...",
      },

      // Help & Processing
      help: {
        tooltip: "Cần trợ giúp? Hỏi trợ lý AI của chúng tôi!",
        processing: "Đang Phân Tích Dữ Liệu Tài Chính",
      },

      // Notifications
      notifications: {
        title: "Thông Báo Tài Chính",
        taxDeadline: "Hạn nộp thuế còn {days} ngày",
        complianceAlert: "Cảnh báo tuân thủ: Cần xem xét audit trail",
        insightUpdate: "Insight mới: Cơ hội tăng trưởng 23% được phát hiện",
        reportReady: "Báo cáo phân tích hoàn tất",
        markAllRead: "Đánh dấu tất cả đã đọc",
        viewAll: "Xem tất cả",
      },

      // Advanced Features
      advanced: {
        realTimeMonitoring: "Giám Sát Thời Gian Thực",
        predictiveAnalytics: "Phân Tích Dự Báo",
        riskAssessment: "Đánh Giá Rủi Ro",
        benchmarking: "So Sánh Chuẩn",
        customReports: "Báo Cáo Tùy Chỉnh",
        dataVisualization: "Trực Quan Hóa Dữ Liệu",
        automatedInsights: "Insights Tự Động",
        smartAlerts: "Cảnh Báo Thông Minh",
      },

      // Export Options
      export: {
        title: "Xuất Báo Cáo",
        pdf: "Xuất PDF",
        excel: "Xuất Excel",
        powerpoint: "Xuất PowerPoint",
        email: "Gửi qua Email",
        share: "Chia Sẻ Link",
        schedule: "Lên Lịch Báo Cáo",
      },

      // Risk Analysis
      risk: {
        title: "Phân Tích Rủi Ro",
        financial: "Rủi Ro Tài Chính",
        operational: "Rủi Ro Vận Hành",
        market: "Rủi Ro Thị Trường",
        regulatory: "Rủi Ro Pháp Lý",
        low: "Thấp",
        medium: "Trung Bình",
        high: "Cao",
        critical: "Nghiêm Trọng",
      },

      // Performance Metrics
      performance: {
        roi: "Tỷ Suất Hoàn Vốn",
        growth: "Tăng Trưởng",
        efficiency: "Hiệu Quả",
        profitability: "Khả Năng Sinh Lời",
        liquidity: "Thanh Khoản",
        leverage: "Đòn Bẩy",
      },
    },
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
    initialInvestment: "Khoản Đầu Tư Ban Đầu ($)",
    annualInterestRate: "Lãi Suất Hàng Năm (%)",
    years: "Năm",
    compoundingFrequency: "Tần Suất Ghép Lãi",
    contributionAmount: "Khoản Đóng Góp Thêm",
    profitEarned: "Lợi Nhuận Thu Được",
    contributionPeriod: "Chu Kỳ Đóng Góp",
    contributionTiming: "Thời Điểm Đóng Góp",
    calculate: "Tính",
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
    botAltText: "Trợ lý ảo",
    profilePicAlt: "Ảnh hồ sơ",

    // Greetings
    morningGreeting: "Chào buổi sáng",
    afternoonGreeting: "Chào buổi chiều",
    eveningGreeting: "Chào buổi tối",
    dashboardSlogan:
      "Quản lý ví tiền thông minh để đạt được mục tiêu dễ dàng hơn",

    // Buttons
    connectBankButton: "Kết nối tài khoản ngân hàng",
    addButton: "Thêm",
    resetButton: "Đặt lại",
    cancelButton: "Hủy",
    yesButton: "Có",
    noButton: "Không",
    editButton: "Chỉnh sửa",
    removeButton: "Xóa",
    addGoalButton: "Thêm mục tiêu",
    addTransactionButton: "Thêm giao dịch",

    // Financial Summary
    totalRevenueLabel: "Tổng thu nhập",
    totalExpenseLabel: "Tổng chi tiêu",
    accountBalanceLabel: "Số dư tài khoản",

    // Transactions
    dailyTransactionsTitle: "Giao dịch hằng ngày",
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
    sourceHeader: "Nguồn",
    statusHeader: "Trạng thái",
    transactionHeader: "Giao dịch",
    creditedStatus: "Ghi có",
    debitedStatus: "Ghi nợ",

    // Goals Section
    goalsSectionTitle: "Mục tiêu",
    searchGoalsPlaceholder: "Tìm kiếm mục tiêu...",
    goalImageAlt: "Hình ảnh mục tiêu",
    categoryLabel: "Danh mục",
    totalLabel: "Tổng cộng",
    savedLabel: "Đã tiết kiệm",

    // Add Goal Modal
    addNewGoalTitle: "Thêm mục tiêu mới",
    goalTitleLabel: "Tiêu đề mục tiêu",
    goalTitlePlaceholder: "Nhập tiêu đề mục tiêu của bạn",
    descriptionLabel: "Mô tả",
    optionalLabel: "tùy chọn",
    descriptionPlaceholder: "Mô tả mục tiêu của bạn (tối đa 500 từ)",
    charactersLabel: "ký tự",
    totalMoneyNeededLabel: "Tổng số tiền cần thiết",
    totalMoneyNeededPlaceholder: "Tổng số tiền cần có",
    moneyHaveLabel: "Số tiền hiện có",
    moneyHavePlaceholder: "Số tiền hiện có",
    startDateLabel: "Ngày bắt đầu",
    endDateLabel: "Ngày kết thúc",
    addNewCategoryOption: "Thêm danh mục mới",
    newCategoryLabel: "Danh mục mới",
    newCategoryPlaceholder: "Nhập danh mục mới",

    // Reset Account Modal
    resetAccountTitle: "Đặt lại số dư tài khoản",
    resetAccountMessage:
      "Bạn có chắc chắn muốn đặt lại số dư tài khoản không? Hành động này sẽ xóa tất cả giao dịch của bạn.",

    // About Us Section
    aboutUsTitle: "Về chúng tôi",
    aboutUsDescription:
      "Chúng tôi là một đội ngũ công nghệ tại Việt Nam, chuyên phát triển các giải pháp tích hợp AI. FinBud là dự án đầu tiên của chúng tôi với mục tiêu giúp mọi người đưa ra quyết định tài chính thông minh hơn — từ đầu tư, tiết kiệm đến chi tiêu hợp lý. Đội ngũ FinBud gồm những chuyên gia dày dạn kinh nghiệm trong các lĩnh vực công nghệ, tài chính và kinh doanh. Chúng tôi đam mê việc ứng dụng công nghệ để giúp quản lý tài chính trở nên dễ dàng và hiệu quả hơn cho tất cả mọi người.",
    meetOurTeamTitle: "Gặp gỡ đội ngũ của chúng tôi",

    // Testimonials Section
    testimonialsTitle: "Người dùng nói gì về FinBud",

    // Contact Section
    contactHeader: "Chúng tôi rất mong được hợp tác cùng bạn.",
    contactSubheader:
      "Hãy cho chúng tôi biết bạn cần gì (hoặc nếu không, cứ nói để chúng tôi biết!)",

    // Contact Form
    fullNameLabel: "Họ và tên",
    fullNamePlaceholder: "Frank Castle",
    emailLabel: "Email của bạn",
    emailPlaceholder: "franklyfrank@example.com",
    companyNameLabel: "Tên công ty",
    companyNamePlaceholder: "The P-Corp.",
    mobileNumberLabel: "Số điện thoại",
    mobileNumberPlaceholder: "+1 012 345 6789",
    messageLabel: "Tin nhắn của bạn",
    messagePlaceholder: "Chúng tôi có thể giúp gì cho bạn?",
    sendMessageButton: "Gửi tin nhắn",

    // Contact Info
    messageUsLabel: "Nhắn tin cho chúng tôi",
    callUsLabel: "Gọi cho chúng tôi",

    // Member Intro
    roles: {
      ceo: "Nhà sáng lập & Giám đốc điều hành (CEO)",
      pm: "Quản lý dự án",
      cto: "Giám đốc công nghệ (CTO)",
      dataLead: "Trưởng bộ phận dữ liệu",
      fullstack: "Kỹ sư Fullstack",
      frontend: "Kỹ sư Front-end",
      backend: "Trưởng nhóm Back-end",
      aiEngineer: "Kỹ sư Trí tuệ nhân tạo (AI)",
      dataScientist: "Chuyên viên Phân tích & Khoa học dữ liệu",
    },

    team: {
      intros: {
        tri: "Cử nhân Kinh tế định lượng và Khoa học máy tính tại Macalester College, với niềm đam mê xây dựng startup kết hợp giữa Tài chính, Công nghệ và Kinh doanh để mang lại lợi ích cho cộng đồng Việt Nam.",
        dung: "Lập trình viên Full Stack với 2 năm kinh nghiệm tại F5 Networks và SVB, tốt nghiệp Cử nhân Khoa học Máy tính tại Washington State University.",
        minh: "Thạc sĩ Khoa học Máy tính và Kinh tế tại University of Iowa, đồng thời có bằng Cử nhân Thống kê tại Grinnell College. Đam mê AI/ML, kỹ nghệ phần mềm và sự giao thoa giữa công nghệ và kinh tế.",
        phu: "Cử nhân Kinh doanh & Marketing (chương trình IBD@NEU), tập trung vào phân tích và chiến lược nâng cao trong lĩnh vực FinTech.",
        huy: "Tốt nghiệp Khoa học Máy tính và Toán học tại DePauw University. Nhà phát triển full stack tận tâm, yêu thích công nghệ mới và giải quyết vấn đề phức tạp để tạo ra các giải pháp có tác động thực tế.",
        linh: "Sinh viên Khoa học Máy tính tại University of South Florida, chuyên về phát triển phần mềm full-stack với trọng tâm là khả năng mở rộng. Đam mê kỹ nghệ phần mềm và khám phá các ứng dụng tiềm năng trong lĩnh vực AI.",
        dungpham:
          "Sinh viên Khoa học Máy tính tại University of South Florida, có kỹ năng phát triển web fullstack và mong muốn học hỏi sâu hơn về AI/ML, Fintech và Điện toán đám mây.",
        khoi: "Sinh viên Khoa học Máy tính tại New Jersey Institute of Technology. Nhiệt huyết áp dụng kỹ năng của mình vào các dự án sáng tạo và khám phá cơ hội mới trong ngành công nghệ.",
        binh: "Cử nhân Khoa học Máy tính tại VinUniversity, đam mê ứng dụng Toán học và Công nghệ — đặc biệt là AI và Học máy — để hỗ trợ điều trị y khoa và sức khỏe tinh thần.",
        quang:
          "Sinh viên Quản trị Kinh doanh tại Đại học Ngoại thương, từng tham gia chương trình trao đổi về Thống kê và Kinh tế lượng tại Uppsala University.",
        khoa: "Nhà phát triển Ứng dụng LLM, tốt nghiệp Cử nhân Khoa học Dữ liệu tại University of Rochester. Đam mê các hệ thống truy xuất thông tin và gợi ý thông minh.",
        tuan: "Sinh viên Khoa học Máy tính tại Đại học Khoa học Tự nhiên, đang phát triển tính năng cho FinBud — một dự án quản lý tài chính. Quan tâm đặc biệt đến AI/ML và kỹ nghệ phần mềm.",
        krystal:
          "Sinh viên Cử nhân Khoa học Dữ liệu tại Deakin University, mong muốn chuyển đổi dữ liệu thành giải pháp có tác động thực tế. Đam mê áp dụng dữ liệu để giải quyết các thách thức đời sống và tạo ra thay đổi tích cực.",
        bach: "Sinh viên Khoa học Máy tính tại VinUniversity.",
      },
    },

    // Testimonials
    testimonials: {
      daniel:
        "FinBud giúp tôi hiểu rõ tiền của mình đi đâu mỗi tháng. Những thông tin đơn giản nhưng mang lại tác động lớn.",
      rachel:
        "Tôi đã thử nhiều ứng dụng tài chính trước đây, nhưng không cái nào trực quan như FinBud. Nó giúp tôi biết tiền lương của mình đi đâu và AI thực sự tạo khác biệt – cảm giác như có người cố vấn cá nhân. Giờ tôi đã bắt đầu tiết kiệm và lên kế hoạch hưu trí. Cuối cùng, tôi thấy mình đang làm chủ tiền bạc thay vì bị nó điều khiển.",
      jane: "Tôi rất thích FinBud! Giống như có một cố vấn tài chính riêng 24/7. Những mẹo và phân tích rất hữu ích và dễ hiểu.",
      julian:
        "Tôi từng rất sợ việc lập kế hoạch tài chính. Bảng tính khiến tôi choáng ngợp, và tôi chẳng biết bắt đầu từ đâu. FinBud đã giúp tôi thoát khỏi áp lực đó với giao diện gọn gàng và AI thông minh. Nó tự động phân loại chi tiêu và đặt ra các mục tiêu thực tế. Sau 6 tháng, tôi đã trả xong hai thẻ tín dụng và bắt đầu quỹ khẩn cấp. Tôi cảm thấy mình thực sự kiểm soát được tài chính thay vì bị cuốn theo. Đây không chỉ là một ứng dụng — nó là người huấn luyện tài chính của tôi. Rất khuyến khích cho ai cảm thấy lạc hướng với tiền bạc.",
      amelia:
        "Lời khuyên cá nhân hóa của FinBud là điều thay đổi cuộc chơi mà tôi không ngờ tới. Ứng dụng thích nghi với thói quen tài chính của tôi và hướng dẫn nhẹ nhàng nhưng hiệu quả. Từ ngân sách đến đầu tư, mọi tính năng đều được thiết kế tinh tế. Tôi học được rất nhiều điều chỉ nhờ sử dụng ứng dụng này — nhiều hơn cả đọc blog tài chính hay xem YouTube. Mối quan hệ của tôi với tiền đã thay đổi hoàn toàn — từ căng thẳng thành tự tin. FinBud thực sự trao quyền cho người dùng quản lý tài chính của mình.",
      marcus:
        "Trước đây tôi phải dùng nhiều ứng dụng tài chính: một cho chi tiêu, một cho tiết kiệm, một cho đầu tư. FinBud đã gộp tất cả vào một nền tảng tinh gọn. Nó theo dõi mục tiêu, hiển thị tiến độ theo thời gian thực và đưa ra lời khuyên hiệu quả. Tôi đã cắt giảm các đăng ký không cần thiết, lập quỹ du lịch và bắt đầu đầu tư vào quỹ hưu trí. Tôi không cần là chuyên gia tài chính nữa. FinBud khiến mọi quyết định phức tạp trở nên dễ hiểu và hiệu quả. Đây là ứng dụng thay đổi cách tôi quản lý tiền bạc.",
      tyler:
        "Chỉ riêng công cụ lập ngân sách đã đáng giá rồi, nhưng tính năng cảnh báo thời gian thực mới là thứ giữ tôi đúng hướng. Giống như có một trợ lý tài chính luôn theo dõi tôi — tôi không còn bỏ lỡ hạn thanh toán nào nữa.",
      ten: "FinBud không chỉ hiển thị con số — nó giải thích chúng. Tôi nhận được lời khuyên cụ thể, dễ áp dụng mà không thấy áp lực. Tôi cảm giác mình thông minh hơn về tài chính mỗi ngày. Cả bạn đời tôi cũng bắt đầu dùng ứng dụng sau khi thấy tiến bộ của tôi. Đây thực sự là 'lột xác tài chính' cho cả hai chúng tôi.",
      claire:
        "Trước đây, việc theo dõi chi tiêu khiến tôi mệt mỏi, nhưng FinBud đã đơn giản hóa tất cả. Báo cáo hằng ngày giúp tôi duy trì kỷ luật mà không bị choáng. Tôi thích cách ứng dụng ăn mừng cột mốc — rất có động lực! Đây là ứng dụng tài chính duy nhất mà tôi gắn bó lâu dài. Rất khuyến khích cho ai đang muốn hình thành thói quen chi tiêu tốt hơn.",
      sophie:
        "FinBud mang lại cho tôi sự tự tin trong mọi quyết định tài chính. Dễ dùng, thông minh và chính xác. Tôi đã tiết kiệm được nhiều hơn trong 3 tháng qua so với cả năm trước.",
    },

    //Stock Simulator
    //Nav Bar
    appTitle: "Mô Phỏng Cổ Phiếu",
    navigation: {
      investment: "Đầu tư",
      portfolio: "Danh mục của bạn",
      transactionHistory: "Lịch sử giao dịch",
      filters: "Bộ lọc",
      quiz: "Quiz",
      predictiveCalc: "Máy tính dự đoán",
    },
    investment: {
      keyStatistics: "Thống kê chính",
      stats: {
        open: "Giá Mở Cửa",
        prevClose: "Giá Đóng Cửa",
        week52High: "Cao nhất 52 tuần",
        week52Low: "Thấp nhất 52 tuần",
        marketCap: "Vốn hóa thị trường",
        volume: "Khối lượng",
        eps: "EPS",
        pe: "PE",
        pb: "PB",
        low: "Thấp",
        high: "Cao",
      },
      actions: "Hành động",
      actionForm: {
        placeholder: "Nhập mã cổ phiếu",
        quantity: "Số lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "XÓA",
        preview: "Xem trước lệnh",
      },
      accountPerformance: {
        accountBalance: "SỐ DƯ TÀI KHOẢN",
        cashBalance: "SỐ DƯ TIỀN MẶT",
        stockValue: "GIÁ TRỊ CỔ PHIẾU",
        todaysChange: "THAY ĐỔI HÔM NAY",
        annualReturn: "LỢI NHUẬN HÀNG NĂM",
      },
      transactionHistory: "Lịch sử giao dịch",
      viewAllTransactions: "Xem tất cả giao dịch",
      table: {
        stockName: "Tên cổ phiếu",
        quantity: "Số lượng",
        action: "Hành động",
        amount: "Tổng tiền",
        date: "Ngày",
      },
    },
    portfolio: {
      title: "Danh mục đầu tư của bạn",
      overview: {
        totalValue: "Tổng giá trị danh mục",
        stocks: "Cổ phiếu",
        cash: "Tiền mặt",
      },
      holdings: {
        title: "Tài sản nắm giữ",
        tableHeaders: {
          ticker: "Mã cổ phiếu",
          quantity: "Số lượng cổ phiếu",
          currentPrice: "Giá hiện tại mỗi cổ phiếu",
          purchasedValue: "Tổng giá trị mua vào",
          marketValue: "Giá trị thị trường hiện tại",
          gainLoss: "Lãi/Lỗ",
          percentChange: "% Thay đổi",
        },
      },
    },
    currencySymbol: "$",
    shares: "cổ phiếu",
    chatComponent: {
      rename: "Đổi tên",
      delete: "Xóa",
      deleteConfirm: "Xóa cuộc trò chuyện?",
      deleteConfirmMessage: "Cuộc trò chuyện này sẽ bị xóa",
      cancel: "Hủy",
      guildence: "Hướng dẫn",
      sendButton: "Gửi",
      responsePlaceholder: "Phản hồi từ FinBud sẽ xuất hiện ở đây",
    },

    //Envent Hub
    eventHub: {
      searchPlaceholder: "Tìm kiếm sự kiện...",
      exploreNearby: "Khám phá gần bạn",
      saved: "Đã lưu",
      allEvents: "Tất cả sự kiện",
      eventCategories: "Danh mục sự kiện bạn có thể thích",
      trending: "Xu hướng",
      readMore: "Đọc thêm",
      dontMiss: "ĐỪNG BỎ LỠ!",
      finDiscover: "Khám phá các sự kiện tài chính hàng đầu gần bạn",
      categories: {
        conference: "Hội nghị & Hội thảo",
        workshop: "Workshop & Đào tạo",
        webinars: "Hội thảo trực tuyến",
        networking: "Kết nối mạng lưới",
        careerFairs: "Hội chợ việc làm",
      },
      eventMap: {
        upcomingEvents: "Sự kiện sắp tới",
        eventImage: "Hình ảnh sự kiện",
        date: "Ngày",
        host: "Chủ tổ chức",
        location: "Địa điểm",
        tba: "Sẽ được thông báo",
      },
    },

    //Chat
    message: "Nhập tin nhắn của bạn tại đây... ",

    // Main Page Content
    empoweringTitle: "Trao quyền cho những quyết định tài chính thông minh hơn",
    anytimeAnswers:
      "Câu trả lời bất cứ lúc nào cho các câu hỏi tài chính với FinBud",
    partneringTitle: "Hợp tác để đạt được các mục tiêu tài chính",

    // Financial Awareness Section
    enhanceFinancialTitle: "Nâng cao nhận thức tài chính của bạn",
    enhanceFinancialDesc:
      "Chatbot AI tiên tiến của Finbud sẽ giúp bạn xem xét, khám phá các chủ đề tài chính và trả lời tất cả câu hỏi của bạn.",

    // Financial Planning Section
    optimizeFinancialTitle: "Tối ưu hóa kế hoạch tài chính của bạn",
    optimizeFinancialDesc:
      "Finbud giúp bạn theo dõi và quản lý chi phí, ghi lại thu nhập và chi tiêu, và điều chỉnh quản lý tài chính theo mục tiêu cụ thể của bạn.",

    // Investment Section
    maximizeInvestmentTitle: "Tối đa hóa hiệu quả đầu tư của bạn",
    maximizeInvestmentDesc:
      "Finbud cung cấp cái nhìn tổng quan toàn diện về thị trường tài chính, hướng dẫn bạn tối ưu hóa vốn một cách tự tin.",

    // Impact Section
    impactTitle: "Dễ dàng nhận thấy tác động",
    savingsIncrease: "Tiết kiệm tăng lên",
    savingsDesc: "trung bình mỗi người dùng",
    financialAwareness: "Nhận thức tài chính",
    awarenessDesc: "tăng lên",
    debtReduction: "Giảm nợ",
    debtDesc: "sau 1 năm",
    creditScore: "Cải thiện điểm tín dụng",
    creditDesc: "tháng trong vòng",

    // Features Section
    chatbotFeatureTitle: "Giải quyết nỗi lo tài chính cùng",
    chatbotFeatureName: "Trợ lý AI,",
    chatbotDesc:
      "Chỉ với vài thao tác đơn giản và nguồn thông tin chính xác, đáng tin cậy, mọi thắc mắc tài chính của bạn sẽ được giải đáp ngay lập tức.",
    chatNow: "Trò chuyện ngay",

    simulatorFeatureTitle: "Làm chủ khoản đầu tư của bạn với",
    simulatorFeatureName: "Trình mô phỏng FinBud,",
    simulatorDesc:
      "Theo dõi hiệu suất đầu tư theo thời gian thực, nhận phân tích chi tiết từ thị trường và danh mục của bạn để đưa ra quyết định đầu tư thông minh hơn.",
    simulatorNow: "Dùng trình mô phỏng ngay",

    goalFeatureTitle: "Dự đoán chi phí của bạn với",
    goalFeatureName: "FinBud Goal,",
    goalDesc:
      "AI của chúng tôi dự đoán các khoản chi sắp tới, giúp bạn lập kế hoạch trước, hiểu rõ thói quen chi tiêu và nhận lời khuyên để quản lý ngân sách hiệu quả hơn.",
    goalNow: "Đặt mục tiêu ngay",

    quizFeatureTitle: "Nâng cao kỹ năng tài chính với",
    quizFeatureName: "FinBud Quiz,",
    quizDesc:
      "Bộ câu đố tài chính với nhiều chủ đề và từ khóa đa dạng giúp bạn luyện tập và học hỏi kiến thức tài chính một cách thông minh, tương tác và thú vị.",
    quizNow: "Làm bài quiz ngay",

    // Goal Page
    connect: "Kết nối tài khoản ngân hàng của bạn",
    totalTransactions: "Tổng giao dịch",
    totalIncome: "Tổng thu nhập",
    totalExpense: "Tổng chi phí",
    accountBalance: "Số dư tài khoản",
    showForecast: "Hiển thị dự báo",
    dailyTransactions: "Giao dịch hàng ngày",
    add: "Thêm",
    reset: "Đặt lại",
    noData: "Không có dữ liệu giao dịch để hiển thị.",
    transactionChart: "Biểu đồ giao dịch",
    goals: "Mục tiêu",
    addGoal: "Thêm mục tiêu",
    searchGoals: "Tìm kiếm mục tiêu...",
    addNewGoal: "Thêm mục tiêu mới",
    goalTitle: "Tiêu đề mục tiêu",
    description: "Mô tả (tùy chọn)",
    totalNeeded: "Tổng số tiền cần thiết",
    alreadyHave: "Số tiền đã có",
    startDate: "Ngày bắt đầu",
    endDate: "Ngày kết thúc",
    category: "Danh mục",
    newCategory: "Danh mục mới",
    confirmReset:
      "Bạn có chắc chắn muốn đặt lại số dư tài khoản? Hành động này sẽ xóa tất cả giao dịch của bạn.",
    cancel: "Không",
    confirm: "Có",
    addTransaction: "Thêm giao dịch",
    transactionType: "Loại giao dịch",
    transactionDescription: "Mô tả giao dịch",
    amount: "Số tiền & Tiền tệ",
    dateTime: "Ngày",
    income: "Thu nhập",
    expense: "Chi phí",
    selectType: "Chọn loại",
    selectCategory: "Chọn danh mục",
    action: "Hành động",
    edit: "Chỉnh sửa",
    remove: "Xóa",

    // FAQ Section
    faqTitle: "Câu hỏi thường gặp",
    faqs: {
      pricing: {
        question: "FinBud có miễn phí sử dụng không, hay có các gói đăng ký?",
        answer:
          "FinBud cung cấp cả gói miễn phí với các tính năng cơ bản và gói đăng ký cho một số tính năng nâng cao. Hãy đăng ký để thử tất cả các công cụ tài chính miễn phí của FinBud trước khi tìm hiểu các tùy chọn nâng cao hơn từ chúng tôi.",
      },
      chatbot: {
        question: "Chatbot FinBud có thể giải quyết những loại câu hỏi nào?",
        answer:
          "Chatbot FinBud được thiết kế để hỗ trợ nhiều loại câu hỏi, bao gồm cả chủ đề tài chính và phi tài chính. Ngoài ra, chatbot cho phép bạn thực hiện trực tiếp các lệnh khác nhau trong quản lý tài chính, đầu tư và tính năng giáo dục của FinBud. Ví dụ, bạn có thể mua hoặc bán cổ phiếu, quản lý ngân sách, hoặc tra cứu thuật ngữ tài chính. Chỉ cần nhấp vào biểu tượng chat và làm theo hướng dẫn để khám phá đầy đủ khả năng của chatbot FinBud.",
      },
      investment: {
        question: "FinBud có hỗ trợ theo dõi và quản lý đầu tư không?",
        answer:
          "Có, các trang Quant và Simulator của chúng tôi cung cấp trải nghiệm nhập vai cho những người khám phá tài chính nâng cao. Bạn có thể quản lý danh mục đầu tư, truy cập phân tích cổ phiếu chuyên sâu, và thậm chí thực hành giao dịch cổ phiếu thực thông qua Simulator - hoàn hảo cho người mới bắt đầu muốn có kinh nghiệm đầu tư thực tế.",
      },
      goals: {
        question:
          "Tôi có thể đặt mục tiêu tài chính với FinBud và theo dõi tiến độ không?",
        answer:
          "Hoàn toàn có thể! Với FinBud, bạn có thể đặt các mục tiêu tài chính cụ thể bằng cách xác định chi tiết như danh mục, ngày mục tiêu, số tiền cần thiết và tiết kiệm hiện tại. Trên trang Goal, chúng tôi giúp bạn theo dõi bằng cách giám sát giao dịch hàng ngày và cung cấp biểu đồ chi tiết, đảm bảo bạn có thể đạt được từng mục tiêu hiệu quả hơn.",
      },
      mobile: {
        question:
          "FinBud có sẵn trên thiết bị di động không, và có đồng bộ trên các nền tảng không?",
        answer:
          "Có, FinBud có sẵn trên cả thiết bị di động và laptop. Chỉ cần đăng nhập vào tài khoản của bạn, và dữ liệu sẽ tự động đồng bộ trên tất cả các nền tảng để truy cập liền mạch.",
      },
    },
    // Chart Labels
    initialInvestmentLabel: "Khoản đầu tư ban đầu",
    additionalContributionLabel: "Khoản đóng góp thêm",
    profitEarnedLabel: "Lợi nhuận thu được",
    zillowNote: "Lãi suất được cung cấp bởi Zillow.",
    yearNumber: "Năm {number}",

    // FundLetterPage Component
    fundLetters: "Thư quỹ đầu tư",
    fundLettersArchive: "Kho lưu trữ thư quỹ",
    curatedListSubtitle: "Danh sách tổng hợp thư quỹ đầu tư hàng quý",
    searchPlaceholder: "Tìm kiếm theo tên quỹ",
    allYears: "Tất cả các năm",
    allQuarters: "Tất cả các quý",
    fundName: "Tên quỹ",
    date: "Ngày",
    noResults: "Không tìm thấy thư nào với bộ lọc đã chọn.",
    resetFilters: "Đặt lại bộ lọc",
    greatestInvestors: "Tuyển tập các nhà đầu tư vĩ đại nhất",
    learnFromMasters: "Học từ những bậc thầy của đầu tư giá trị",

    // Investment Calculator Bot Messages
    investmentAnalysis: "Phân tích đầu tư:",
    initialAmount: "Ban đầu:",
    rateAmount: "Tỷ lệ:",
    finalAmountBot: "Cuối cùng:",

    // Technology Page
    technologyPage: {
      title: "Phân tích thúc đẩy doanh nghiệp của bạn.",
      description:
        "Xem xét hiệu suất của bạn và thúc đẩy thay đổi với những thông tin hữu ích mà chúng tôi cung cấp qua ứng dụng web trực quan.",
      features: {
        title: {
          plan: "Lập kế hoạch tài chính",
          manage: "Quản lý nợ và đầu tư",
          edu: "Giáo dục tài chính",
          analyze: "Phân tích tài chính dự báo",
        },
        description: {
          plan: "Tôi giúp bạn tạo và duy trì kế hoạch tài chính cá nhân hoàn hảo.",
          manage:
            "Manage your debts and invest wisely with targeted advice tailored to your goals.",
          edu: "Providing knowledge on basic and advanced financial concepts to empower your decisions.",
          analyze:
            "Utilize AI to analyze and predict financial trends to make smart decisions.",
        },
      },
      financialConsulting: {
        title: "Tư vấn tài chính",
        note: "Kế hoạch cá nhân hóa để đảm bảo tương lai tài chính của bạn.",
        highlightsLeft: ["Quản lý nợ", "Chiến lược tiết kiệm", "Tư vấn đầu tư"],
        highlightsRight: [
          "Lập kế hoạch tài chính tùy chỉnh",
          "Định hướng theo mục tiêu",
          "Quản lý tài sản cá nhân",
        ],

        button: "Bắt đầu dùng thử miễn phí 30 ngày",
      },
      financialEducation: {
        title: "Giáo dục tài chính",
        note: "Trao quyền cho bản thân bằng kiến thức để đưa ra quyết định tài chính tốt hơn.",
        highlights: [
          "Các khái niệm tài chính từ cơ bản đến nâng cao",
          "Bài học và câu đố tương tác",
          "Phân tích xu hướng tài chính thời gian thực",
          "Thông tin chi tiết được điều khiển bởi AI",
        ],
        button: "Tìm hiểu thêm",
      },
      insights: {
        title: "TRÍ TUỆ NHÂN TẠO",
        subtitle:
          "Nhận thông tin chi tiết thời gian thực về hiệu suất của bạn.",
        description:
          "Trao quyền cho các quyết định tài chính của bạn với công nghệ AI tiên tiến của chúng tôi.",
        points: [
          "Phân tích tài chính cá nhân hóa: Đạt được thông tin chi tiết toàn diện với các báo cáo được tạo tự động phù hợp với hành vi tài chính của bạn, giúp bạn tối ưu hóa ngân sách và tiết kiệm.",
          "Dự đoán xu hướng: Các công cụ được điều khiển bởi AI của chúng tôi phân tích xu hướng chi tiêu và thu nhập trong quá khứ để dự báo tương lai tài chính của bạn, cho phép lập kế hoạch tài chính chủ động.",
        ],
        button: "Tìm hiểu thêm",
      },
      computerVision: {
        title: "TRỢ LÝ AI TIÊN TIẾN",
        subtitle: "Hỗ trợ tài chính thông minh ngay trong tầm tay bạn.",
        featuresTitle: {
          analyze: "Phân tích tài chính tức thì",
          plan: "Lập kế hoạch tài chính tương tác",
          secure: "Bảo mật và riêng tư tuyệt đối",
        },
        featuresDescription: {
          analyze:
            "Đặt bất kỳ câu hỏi nào — từ mẹo quản lý ngân sách đến tư vấn đầu tư — và nhận câu trả lời tức thì dựa trên dữ liệu thực tế.",
          plan: "Tương tác trực tiếp với AI để xây dựng kế hoạch tài chính cá nhân, theo dõi tiến độ và điều chỉnh mục tiêu phù hợp với bạn.",
          secure:
            "Hệ thống độc quyền của chúng tôi sử dụng mạng neural để xác định thông tin quan trọng nhất. Hãy nghĩ về nó như bộ não của bạn — chỉ khác là nó không bao giờ mệt mỏi (và cũng chẳng cần ba tách cà phê để tỉnh táo).",
        },
      },

      // partners: {
      //   description: " <a href='mailto:contact@yourdomain.com'></a>",
      //   left: "<a href='#'></a>",
      //   right: " <a href='#'>Learn more</a>"
      // }
      partners: {
        title: "Tích hợp với các công cụ tốt nhất trên thị trường",
        descriptionParts: [
          "Kiểm tra các đối tác kết nối của chúng tôi. Không thấy phần mềm của bạn trong danh sách đối tác?",
          {
            type: "link",
            text: " Gửi tin nhắn cho chúng tôi",
            href: "mailto:contact@yourdomain.com",
          },
          " và chúng tôi sẽ thêm họ vào.",
        ],
        left: {
          text: "Shop-Ware cho phép người dùng tận dụng quy trình làm việc nhanh như chớp để sửa chữa nhiều xe hơn mỗi tháng.",
          linkText: "Tìm hiểu thêm",
          linkHref: "#",
        },
        right: {
          text: "Tekmetric cho phép bạn phát huy tiềm năng của cửa hàng với cài đặt quy trình làm việc được sắp xếp hợp lý.",
          linkText: "Tìm hiểu thêm",
          linkHref: "#",
        },
      },
    },

    coursePage: {
      loadingText: "Đang tải dữ liệu...",
      errorMessage: "Lỗi khi tải dữ liệu: }",
      retryButton: "Thử lại",
      categories: {
        beginners: "CHO NGƯỜI MỚI BẮT ĐẦU",
        investments: "ĐẦU TƯ HIỆU QUẢ",
        fundamental: "PHÂN TÍCH CƠ BẢN",
        technical: "PHÂN TÍCH KỸ THUẬT",
      },
      viewMore: "Xem thêm",
      views: "lượt xem",
      emptyState: "Không có bài viết nào trong danh mục này.",
      botMessage:
        "Xin chào! 👋<br><br>Đây là trung tâm học tài chính FinBud. Tại đây bạn có thể:<br><br>📚 Học kiến thức đầu tư từ cơ bản đến nâng cao<br>💡 Khám phá chiến lược đầu tư hiệu quả<br>📊 Tìm hiểu sâu về phân tích cơ bản và kỹ thuật<br><br>Khám phá bài viết theo chủ đề hoặc tìm kiếm nội dung bạn quan tâm!",
    },

    macroEcon: {
      chat: "Xin chào! Tôi ở đây để giúp bạn với các câu hỏi về dữ liệu kinh tế vĩ mô. Bạn có thể hỏi tôi về dữ liệu GDP, FDI, CPI và Xuất-Nhập khẩu.",
      quarter: "Quý",
      month: "Tháng",
      year: "Năm",
      viewBy: "Xem theo",
      from: "Từ",
      to: "Đến",
      see: "Chọn",
      overview: "Tổng quan",
      gdp: "GDP",
      cpi: "CPI",
      fdi: "FDI",
      importExport: "Xuất-Nhập khẩu",
      enQuarter: {
        1: "Q1",
        2: "Q2",
        3: "Q3",
        4: "Q4",
      },
      enMonth: {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
      },
      header: {
        "Chỉ tiêu": "Chỉ tiêu",
        "Đơn vị tính": "Đơn vị tính",
        "Số liệu mới nhất": "Số liệu mới nhất",
        "Giá trị": "Giá trị",
        "Đồ thị": "Đồ thị",
        STT: "STT",
      },
      unit: {
        "%": "%",
        "Tỷ VNĐ": "Billion VND",
        "Tỷ USD": "Billion USD",
        "Triệu USD": "Million USD",
        "VNĐ/USD": "VND/USD",
        "Triệu người": "Million People",
        "Nghìn đồng": "Thousand Dong",
        USD: "USD",
      },
      "Tổng quan": {
        "Chỉ số giá tiêu dùng": "Consumer Price Index",
        "Tăng trưởng GDP": "GDP Growth",
        "GDP theo giá hiện hành": "GDP at Current Prices",
        "GDP theo giá cố định (2010)": "GDP at Constant Prices",
        "Tổng trị giá Xuất khẩu": "Total Export Value",
        "Tổng trị giá Nhập khẩu": "Total Import Value",
        "Toàn ngành công nghiệp": "Total Industrial Sector Growth",
        "FDI Giải ngân": "FDI Disbursement",
        "Cung tiền M2": "M2 Money Supply",
        "Tỷ giá trung tâm": "Central Exchange Rate",
        "Tăng trưởng bán lẻ": "Retail Sales Growth",
        "Dân số": "Population",
        "Tỷ lệ thất nghiệp thành thị": "Urban Unemployment Rate",
      },
      GDP: {
        Quý: {
          "Cơ cấu GDP theo giá hiện tại": "GDP Structure at Current Prices",
          "Nông nghiệp": "Agriculture",
          "Công nghiệp": "Industry",
          "Dịch vụ": "Services",
          "Tăng trưởng thực của GDP": "Real GDP Growth",
          "Tổng GDP": "Total GDP",
          "Giá trị GDP (2010)": "GDP Value (2010)",
          "GDP theo giá cố định (2010)": "GDP at Constant Prices (2010)",
          "Giá trị GDP hiện hành": "GDP Value at Current Prices",
          "GDP theo giá hiện hành": "GDP at Current Prices",
        },
        Năm: {
          "Thu nhập bình quân": "Per Capita Income",
          "GDP bình quân": "GDP per Capita (VND)",
          "GNI bình quân": "GNI per Capita (VND)",
          "GDP bình quân (USD)": "GDP per Capita (USD)",
          "Tăng trưởng thực của GDP": "Real GDP Growth",
          "Tổng GDP": "Total GDP",
          "Nông nghiệp": "Agriculture",
          "Công nghiệp": "Industry",
          "Dịch vụ": "Services",
          "Cơ cấu GDP theo giá hiện tại": "GDP Structure at Current Prices",
          "Giá trị GDP": "GDP Value",
          "GDP theo giá hiện hành": "GDP at Current Prices",
          "GDP theo giá hiện hành (ước tính)":
            "GDP at Current Prices (Estimated)",
          "GDP theo giá cố định (2010)": "GDP at Constant Prices (2010)",
          "GDP theo giá cố định (2010) (ước tính)":
            "GDP at Constant Prices (2010) (Estimated)",
          "GNI theo giá hiện tại": "GNI at Current Prices",
        },
      },
      CPI: {
        Tháng: {
          "Chỉ số giá tiêu dùng": "Consumer Price Index",
          "Hàng ăn và dịch vụ ăn uống": "Food and Beverage Services",
          "Lương thực": "Cereals",
          "Thực phẩm": "Food",
          "Ăn uống ngoài gia đình": "Dining Out",
          "Đồ uống và thuốc lá": "Beverages and Tobacco",
          "May mặc, giày dép mũ nón": "Clothing, Footwear, and Hats",
          "Nhà ở và vật liệu xây dựng": "Housing and Building Materials",
          "Thiết bị và đồ dùng gia đình": "Household Equipment and Appliances",
          "Thuốc và dịch vụ y tế": "Medicines and Healthcare Services",
          "Giao thông": "Transport",
          "Bưu chính viễn thông": "Postal and Telecommunications",
          "Giáo dục": "Education",
          "Văn hóa, giải trí và du lịch": "Culture, Recreation, and Tourism",
          "Đồ dùng và dịch vụ khác": "Other Goods and Services",
        },
        Năm: {
          "Tháng 1": "January",
          "Tháng 2": "February",
          "Tháng 3": "March",
          "Tháng 4": "April",
          "Tháng 5": "May",
          "Tháng 6": "June",
          "Tháng 7": "July",
          "Tháng 8": "August",
          "Tháng 9": "September",
          "Tháng 10": "October",
          "Tháng 11": "November",
          "Tháng 12": "December",
          "Bình quân tháng": "Monthly Average",
          "Tháng 12 năm báo cáo so với tháng 12 năm trước":
            "December of the Reporting Year Compared to December of the Previous Year",
        },
      },
      "Xuất-Nhập khẩu": {
        Tháng: {
          "Xuất khẩu": "Exports",
          "Tổng trị giá Xuất khẩu": "Total Export Value (Million USD)",
          "Giày da": "Footwear (Leather)",
          "Dệt may": "Textiles",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Thủy sản": "Seafood",
          "Dầu thô": "Crude Oil",
          Gạo: "Rice",
          Café: "Coffee",
          "Điện tử máy tính": "Electronics and Computers",
          "Máy móc thiết bị": "Machinery and Equipment",
          "Nhập khẩu": "Imports",
          "Tổng trị giá Nhập khẩu": "Total Import Value (Million USD)",
          "Điện tử, máy tính và linh kiện":
            "Electronics, Computers, and Components",
          "Máy móc thiết bị, phụ tùng": "Machinery and Equipment, Parts",
          "Xăng dầu": "Petroleum Products",
          "Hóa chất": "Chemicals",
          "Sản phẩm hóa chất": "Chemical Products",
          "Sắt thép": "Iron and Steel",
          Vải: "Fabric",
          "Ô tô": "Automobiles",
          "Thức ăn gia súc": "Animal Feed",
        },
        Năm: {
          "Xuất khẩu": "Exports",
          "Hoa Kỳ": "United States",
          "Nhật Bản": "Japan",
          Australia: "Australia",
          "Trung Quốc": "China",
          Singapore: "Singapore",
          Đức: "Germany",
          Anh: "United Kingdom",
          Malaysia: "Malaysia",
          "Thái Lan": "Thailand",
          Pháp: "France",
          "Sản phẩm dệt may": "Textile Products",
          "Thủy sản": "Seafood",
          Gạo: "Rice (Thousand Tons)",
          Café: "Coffee (Thousand Tons)",
          "Cao su": "Rubber (Thousand Tons)",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Than đá": "Coal",
          "Tôm đông lạnh": "Frozen Shrimp",
          "Lương thực, Thực phẩm và động vật sống":
            "Grains, Food and Live Animals",
          "Đồ uống và thuốc lá": "Beverages and Tobacco",
          "NVL thô, không dùng để ăn, trừ nhiên liệu":
            "Raw Materials (Non-food, Excluding Fuel)",
          "Nhiêu liệu, dầu mỡ nhờn và vật liệu liên quan":
            "Lubricants, Oils, and Related Materials",
          "Dầu, mỡ, chất béo, sáp động, thực vật":
            "Oils, Fats, Waxes (Animal, Vegetable)",
          "Hoá chất và sản phẩm liên quan": "Chemicals and Related Products",
          "Hàng chế biến phân loại theo nguyên liệu":
            "Processed Goods Classified by Raw Materials",
          "Máy móc, phương tiện vận tải và phụ tùng":
            "Machinery, Transport Equipment and Parts",
          "Hàng chế biến khác": "Other Processed Goods",
          "Háng hóa không thuộc các nhóm trên":
            "Goods Not Classified in Above Groups",
          "Giá trị xuất khẩu (USD giá hiện hành)":
            "Export Value (USD at Current Prices)",
          "Nhập khẩu": "Imports",
          "Hàn Quốc": "South Korea",
          "Hồng Kông": "Hong Kong",
          Indonesia: "Indonesia",
          "Nguyên liệu thô, không dùng để ăn, trừ nhiên liệu":
            "Raw Materials (Non-food, Excluding Fuel)",
          "Máy móc, phương tiện vận tải": "Machinery, Transport Equipment",
          "Giá trị nhập khẩu (USD giá hiện hành)":
            "Import Value (USD at Current Prices)",
        },
      },
      FDI: {
        Tháng: {
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Billion USD)",
          "Giải ngân": "Disbursed FDI",
        },
        Năm: {
          "Quốc gia": "Country",
          "Tính lũy kế đến thời điểm hiện tại":
            "Cumulative to Date (Billion USD)",
          "Theo vùng lãnh thổ": "By Territory (Billion USD)",
          "Lĩnh vực": "Sector",
          "Sản xuất": "Manufacturing (Billion USD)",
          "Bất động sản": "Real Estate (Billion USD)",
          "Nông nghiệp": "Agriculture (Billion USD)",
          "Dịch vụ": "Services (Billion USD)",
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Million USD)",
          "Giải ngân": "Disbursed FDI",
        },
      },
    },
    marketAnalysisPage: {
      marketAnalysisTitle: "Phân tích thị trường",
      All: "Tất cả",
      Positive: "Tích cực",
      Negative: "Tiêu cực",
      Neutral: "Trung lập",
      LastUpdated: "Cập nhật lần cuối",
      Insight: "Nhận định",
      Today: "Hôm nay",
      "This Week": "Tuần này",
      "This Month": "Tháng này",
      mentions: "Lượt nhắc đến",
      marketAnalysis: {
        "Securities Company": "Công ty chứng khoán",
        Press: "Báo chí",
        "Expert Community": "Cộng đồng chuyên gia",
      },
      trend: {
        title: "Xu hướng",
        topic: "Chủ đề",
        categories: {
          All: "Tất cả",
          Securities: "Chứng khoán",
          Economy: "Kinh tế",
          Industry: "Ngành nghề",
          Other: "Khác",
        },
      },
      AINews: "Tin tức AI",
      insight: {
        "Market Analysis": "Phân tích thị trường",
        Assessment: "Đánh giá",
        Details: "Chi tiết",
        Source: "Nguồn",
        Analysis: "Phân tích",
        Reference: "Tham khảo",
        "Market Sentiment Over Time": "Tâm lý thị trường theo thời gian",
      },
    },

    quantPage: {
      Date: "Ngày",
      StockComparison: "So sánh cổ phiếu",
      RiskRatio: "Tỷ lệ rủi ro",
      AlphaNIFTY50: "Alpha (NIFTY 50)",
      BetaNIFTY50: "Beta (NIFTY 50)",
      SharpeRatio: "Tỷ suất Sharpe",
      SortinoRatio: "Tỷ suất Sortino",
      StandardDeviation: "Độ lệch chuẩn",
      PastTrendVsFutureProjection: "Xu hướng quá khứ & Dự đoán tương lai",
      Simulation: "Mô phỏng",
      Indicator: "Chỉ báo",
      Period: "Khoảng thời gian",
      Returns: "Lợi nhuận",
      CloseValue: "Giá đóng cửa",
      IndicatorValue: "Giá trị chỉ báo",
      GBMSimulation: "Mô phỏng GBM",
      GARCHSimulation: "Mô phỏng GARCH",
      StockPortfolioDashboard: "Bảng điều khiển danh mục cổ phiếu",
      StockTicker: "Mã cổ phiếu",
      PriceChange: "Biến động giá",
      RelativeVolume: "Khối lượng tương đối (10 ngày)",
      PERatio: "Hệ số P/E",
      EPSDistributed: "EPS đã phân bổ",
      DividendYield: "Tỷ suất cổ tức",
      IndustrySector: "Ngành công nghiệp",
      SelectTicker: "Chọn mã cổ phiếu",
      TickerNameSearch: "Tìm kiếm theo mã cổ phiếu",
      Cummulative: "Tích lũy",
      Daily: "Hàng ngày",
      GraphPrice: "Giá ($)",
      TimeStep: "Bước thời gian",
      Date: "Ngày",
      Value: "Giá trị",
      MonteCarloSimulation: "Mô phỏng Monte Carlo",

      simulationChatBot: `
  <div style="text-align: left;">
    <b>Mô hình GBM và GARCH</b><br/><br/>
    Biểu đồ trên so sánh kết quả mô phỏng giá cổ phiếu bằng hai mô hình:<br/><br/>
    <ul>
      <li><b>GBM (Geometric Brownian Motion):</b> Giả định độ biến động không đổi và lợi nhuận phân phối chuẩn. Thường được dùng trong mô hình tài chính vì tính đơn giản.</li>
      <li><b>GARCH (Generalized Autoregressive Conditional Heteroskedasticity):</b> Tính đến sự thay đổi độ biến động theo thời gian, giúp mô phỏng chính xác hơn hành vi thị trường thực tế và các cú sốc.</li>
    </ul>
    <br/>
    Hãy dùng so sánh này để đánh giá cách các giả định về biến động ảnh hưởng đến đường giá dự đoán theo thời gian.
  </div>
  `,

      closeValueChatBot: `
  <div style="text-align: left;">
    <b>Biểu đồ giá đóng cửa</b><br/><br/>
    Biểu đồ này hiển thị giá đóng cửa lịch sử của cổ phiếu được chọn:<br/><br/>
    <ul>
      <li><b>Giá đóng cửa:</b> Mức giá giao dịch cuối cùng trong ngày, phản ánh sự đồng thuận của thị trường.</li>
    </ul>
    <br/>
    Hãy dùng biểu đồ này để quan sát xu hướng giá, mô hình và hiệu suất lịch sử.
  </div>
  `,

      indicatorAndReturnChatBot: `
  <div style="text-align: left;">
    <b>Biểu đồ Lợi nhuận & Chỉ báo kỹ thuật</b><br/><br/>
    Những biểu đồ này giúp phân tích hiệu suất cổ phiếu và hành vi thị trường:<br/><br/>
    <ul>
      <li><b>Biểu đồ Lợi nhuận:</b> Hiển thị lợi nhuận <i>hàng ngày</i> hoặc <i>tích lũy</i> theo thời gian, dùng để so sánh hiệu suất giữa các giai đoạn.</li>
      <li><b>Biểu đồ Chỉ báo:</b> Vẽ các chỉ báo kỹ thuật như SMA, EMA, RSI, MACD hoặc Bollinger Bands để xác định xu hướng và tín hiệu giao dịch.</li>
    </ul>
    <br/>
    Hãy sử dụng các công cụ này để đánh giá tăng trưởng, động lượng và điểm vào/ra tiềm năng.
  </div>
  `,
    },

    FundLetter: "Thư quỹ đầu tư",
    FinData: "Dữ liệu tài chính",
    ProductComparison: "So sánh sản phẩm",

    // Financial Dashboard translations
    financialDashboard: "Bảng điều khiển tài chính",
    trackTransactionsGoals: "Theo dõi giao dịch và mục tiêu",
    currentBalance: "Số dư hiện tại",
    monthlyIncome: "Thu nhập hàng tháng",
    monthlyExpense: "Chi tiêu hàng tháng",
    goalsAchieved: "Mục tiêu đã đạt được",
    thisMonth: "Tháng này",
    transactions: "Giao dịch",
    completion: "Hoàn thành",
    smartInsights: "Phân tích thông minh",
    aiPoweredAnalysis: "Phân tích được hỗ trợ bởi AI",
    allCategories: "Tất cả danh mục",
    allStatus: "Tất cả trạng thái",
    active: "Đang hoạt động",
    completed: "Đã hoàn thành",
    overdue: "Quá hạn",
    sortByProgress: "Sắp xếp theo tiến độ",
    sortByEndDate: "Sắp xếp theo ngày kết thúc",
    sortByAmount: "Sắp xếp theo số tiền",
    sortByCreated: "Sắp xếp theo ngày tạo",
    searchGoalsPlaceholder: "Tìm kiếm mục tiêu...",
    noGoalsFound: "Không tìm thấy mục tiêu nào",
    createYourFirstGoal:
      "Tạo mục tiêu đầu tiên để bắt đầu theo dõi tiến trình tài chính của bạn.",

    // FAQ Section
    faqTitle: "Câu hỏi thường gặp",
    faqs: {
      pricing: {
        question: "FinBud có miễn phí không, hay có gói đăng ký nào không?",
        answer:
          "FinBud cung cấp cả gói miễn phí với các tính năng cơ bản và gói đăng ký cho các tính năng nâng cao. Hãy đăng ký để trải nghiệm toàn bộ công cụ tài chính miễn phí của FinBud trước khi xem xét các gói chuyên sâu hơn của chúng tôi.",
      },
      chatbot: {
        question: "Trợ lý ảo FinBud có thể giúp gì cho tôi?",
        answer:
          "Trợ lý ảo FinBud được thiết kế để hỗ trợ nhiều loại câu hỏi khác nhau, cả trong và ngoài lĩnh vực tài chính. Bạn có thể thực hiện trực tiếp các lệnh như mua/bán cổ phiếu, quản lý ngân sách hoặc tra cứu thuật ngữ tài chính. Chỉ cần nhấp vào biểu tượng chat và làm theo hướng dẫn để khám phá toàn bộ khả năng của FinBud.",
      },
      investment: {
        question: "FinBud có hỗ trợ theo dõi và quản lý đầu tư không?",
        answer:
          "Có, các trang Quant và Simulator mang lại trải nghiệm đầu tư thực tế cho người dùng. Bạn có thể quản lý danh mục đầu tư, xem phân tích cổ phiếu chuyên sâu và thực hành giao dịch mô phỏng – rất phù hợp cho người mới bắt đầu muốn tích lũy kinh nghiệm thực tế.",
      },
      goals: {
        question:
          "Tôi có thể đặt mục tiêu tài chính và theo dõi tiến độ trong FinBud không?",
        answer:
          "Chắc chắn rồi! Với FinBud, bạn có thể đặt mục tiêu cụ thể bằng cách xác định danh mục, ngày hoàn thành, số tiền cần đạt và số tiền hiện có. Trang Mục tiêu sẽ giúp bạn theo dõi giao dịch hàng ngày và cung cấp biểu đồ chi tiết để đạt được mục tiêu hiệu quả hơn.",
      },
      mobile: {
        question:
          "FinBud có trên thiết bị di động không và có đồng bộ đa nền tảng không?",
        answer:
          "Có, FinBud có sẵn trên cả thiết bị di động và máy tính. Chỉ cần đăng nhập tài khoản của bạn, dữ liệu sẽ tự động đồng bộ trên mọi nền tảng để đảm bảo truy cập liền mạch.",
      },
    },

    // Course Page
    coursePage: {
      title: "Khóa học tài chính",
      subtitle: "Học và nâng cao kiến thức tài chính",
      categories: {
        beginners: "Dành cho người mới bắt đầu",
        investments: "Đầu tư hiệu quả",
        fundamental: "Phân tích cơ bản",
        technical: "Phân tích kỹ thuật",
      },
      views: "lượt xem",
      viewMore: "Xem thêm",
      loading: "Đang tải khóa học...",
      noData: "Không có khóa học nào",
      readTime: "phút đọc",
    },

    // Market Analysis Page (second instance)
    marketAnalysisPage: {
      marketAnalysisTitle: "Phân tích thị trường",
      marketAnalysisDescription:
        "Dữ liệu và phân tích thị trường toàn diện để đưa ra quyết định đầu tư thông minh",
      Positive: "Tích cực",
      Neutral: "Trung lập",
      Negative: "Tiêu cực",
      LastUpdated: "Cập nhật lần cuối",
      Insight: "Nhận định",
      mentions: "Lượt nhắc đến",
      AINews: "Tin tức AI",
      marketAnalysis: {
        StockCompany: "Công ty cổ phiếu",
        FinanceStock: "Cổ phiếu tài chính",
        TechCommunity: "Cộng đồng công nghệ",
      },
      insight: {
        Assessment: "Đánh giá",
        Details: "Chi tiết",
        Source: "Nguồn",
        Analysis: "Phân tích",
        Reference: "Tham khảo",
      },
      trend: {
        title: "Xu hướng thị trường",
        topic: "Chủ đề",
        categories: {
          All: "Tất cả",
          Securities: "Chứng khoán",
          Economy: "Kinh tế",
          Industry: "Ngành nghề",
          Other: "Khác",
        },
      },
    },

    stockSimulator: {
      pageTitle: "Mô Phỏng Chứng Khoán",
      tabs: {
        investment: "Đầu Tư",
        portfolio: "Danh Mục",
        filters: "Lọc Cổ Phiếu",
        quiz: "Câu Hỏi",
        predictiveCalc: "Tính Toán Dự Đoán",
      },
      trading: {
        quickTrade: "Giao Dịch Nhanh",
        stockSymbol: "Mã Cổ Phiếu",
        stockSymbolPlaceholder: "Nhập mã cổ phiếu (ví dụ: AAPL)",
        quantity: "Số Lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "Xóa",
      },
      account: {
        summary: "Tóm Tắt Tài Khoản",
        balance: "Tổng Số Dư",
        cash: "Tiền Mặt Khả Dụng",
        stocks: "Giá Trị Cổ Phiếu",
        todayChange: "Thay Đổi Hôm Nay",
      },
      portfolio: {
        totalPortfolio: "Tổng Giá Trị Danh Mục",
        holdings: "Cổ Phiếu Sở Hữu",
        symbol: "Mã",
        shares: "Cổ Phần",
        avgPrice: "Giá TB",
        currentPrice: "Giá Hiện Tại",
        totalValue: "Tổng Giá Trị",
        gainLoss: "Lãi/Lỗ",
        noHoldings: "Chưa có cổ phiếu nào trong danh mục",
      },
      screener: {
        title: "Lọc Cổ Phiếu",
        subtitle: "Tìm cổ phiếu phù hợp với tiêu chí đầu tư của bạn",
        quickPresets: "Bộ Lọc Nhanh",
        marketCap: "Vốn Hóa Thị Trường",
        sector: "Ngành",
        priceRange: "Khoảng Giá",
        peRatio: "Tỷ Lệ P/E",
        dividendYield: "Tỷ Suất Cổ Tức",
        volume: "Khối Lượng",
        beta: "Beta",
        resetFilters: "Đặt Lại Bộ Lọc",
        savePreset: "Lưu Bộ Lọc",
        stocksFound: "cổ phiếu được tìm thấy",
        loading: "Đang tải...",
        loadingStocks: "Đang tải dữ liệu cổ phiếu...",
        enterPresetName: "Nhập tên bộ lọc:",
        presetSaved: "Đã Lưu Bộ Lọc",
        presetSavedMessage: 'Bộ lọc "{name}" đã được lưu thành công',
        presets: {
          growthStocks: "Cổ Phiếu Tăng Trưởng",
          valueStocks: "Cổ Phiếu Giá Trị",
          dividendStocks: "Cổ Phiếu Cổ Tức",
          largeCap: "Vốn Hóa Lớn",
          smallCap: "Vốn Hóa Nhỏ",
        },
        marketCapOptions: {
          mega: "Siêu Lớn (>$200B)",
          large: "Lớn ($10B-$200B)",
          mid: "Trung Bình ($2B-$10B)",
          small: "Nhỏ ($300M-$2B)",
          micro: "Rất Nhỏ (<$300M)",
        },
        sectors: {
          technology: "Công Nghệ",
          healthcare: "Y Tế",
          financials: "Tài Chính",
          energy: "Năng Lượng",
          industrials: "Công Nghiệp",
          materials: "Vật Liệu",
          utilities: "Tiện Ích",
          realestate: "Bất Động Sản",
          consumer_discretionary: "Hàng Tiêu Dùng Tùy Chọn",
          consumer_staples: "Hàng Tiêu Dùng Thiết Yếu",
          telecommunications: "Viễn Thông",
        },
      },
      notifications: {
        orderSuccess: "Lệnh Thành Công",
        buySuccess: "Đã mua thành công {quantity} cổ phiếu {symbol}",
        sellSuccess: "Đã bán thành công {quantity} cổ phiếu {symbol}",
        orderError: "Lệnh Thất Bại",
        networkError: "Lỗi kết nối mạng",
      },
    },

    // Forum Page
    forumPage: {
      title: "Diễn đàn Cộng đồng",
      loadMore: "Tải thêm",
      loading: "Đang tải...",
      noThreads: "Không có chủ đề nào",
      createThread: "Tạo chủ đề mới",
      search: "Tìm kiếm chủ đề...",
      categories: {
        general: "Thảo luận chung",
        investing: "Chiến lược Đầu tư",
        news: "Tin tức Thị trường",
        analysis: "Phân tích Kỹ thuật",
        education: "Giáo dục Tài chính",
      },
      thread: {
        replies: "phản hồi",
        views: "lượt xem",
        lastReply: "Phản hồi cuối",
        by: "bởi",
        startThread: "Bắt đầu Chủ đề Mới",
        reply: "Trả lời",
        edit: "Chỉnh sửa",
        delete: "Xóa",
      },
    },

    // Market Data Center
    marketDataCenter: {
      title: "Trung tâm Dữ liệu Thị trường",
      sections: {
        cryptocurrency: "TIỀN ĐIỆN TỬ",
        stock: "CỔ PHIẾU",
        realEstate: "BẤT ĐỘNG SẢN",
      },
      loading: "Đang tải dữ liệu thị trường...",
      error: "Không thể tải dữ liệu thị trường",
      refresh: "Làm mới Dữ liệu",
      lastUpdated: "Cập nhật lần cuối",
      change24h: "Thay đổi 24h",
      marketCap: "Vốn hóa Thị trường",
      volume: "Khối lượng",
      price: "Giá",
    },

    // Fin Compare (Product Comparison)
    finCompare: {
      title: "So sánh Sản phẩm Tài chính Thông minh",
      compare: "So sánh Sản phẩm Tài chính",
      addProduct: "Thêm Sản phẩm",
      removeProduct: "Xóa Sản phẩm",
      noProducts: "Không có sản phẩm để so sánh",
      selectProducts: "Chọn sản phẩm để so sánh",
      features: "Tính năng",
      pricing: "Giá cả",
      ratings: "Đánh giá",
      pros: "Ưu điểm",
      cons: "Nhược điểm",
      recommendation: "Đề xuất của chúng tôi",
      filterByPriority: "Lọc theo ưu tiên",
      loading: "Đang tải...",
      error: "Không thể tải dữ liệu ngân hàng. Vui lòng thử lại sau.",
      bestChoice: "Lựa chọn tốt nhất",
      suggested: "Được đề xuất",
      for: "cho",
      priorities: {
        maxSavings: "Tiết kiệm tối đa",
        lowestFees: "Phí thấp nhất",
        flexibleConditions: "Điều kiện linh hoạt",
      },
      table: {
        bank: "Ngân hàng",
        interestRate: "Lãi suất",
        issuanceFee: "Phí phát hành",
        maxLoanTerm: "Thời hạn vay tối đa",
      },
      priorityTexts: {
        highestRate: "lãi suất cao nhất",
        lowestFees: "phí thấp nhất",
        flexibleTerms: "điều kiện linh hoạt nhất",
      },
    },

    // Agent Page
    agentPage: {
      title: "Trình tạo Báo cáo Tài chính AI Hàng ngày",
      subtitle: "Phân tích và báo cáo tài chính được hỗ trợ bởi AI",
      startWorkflow: "Bắt đầu Phân tích",
      processing: "Đang xử lý...",
      generateReport: "Tạo Báo cáo",
      downloadReport: "Tải xuống Báo cáo",
      selectTicker: "Chọn Mã Cổ phiếu",
      analysisComplete: "Hoàn thành Phân tích",
      reportReady: "Báo cáo của bạn đã sẵn sàng",
      workflow: {
        step1: "Thu thập Dữ liệu",
        step2: "Phân tích Thị trường",
        step3: "Tạo Báo cáo",
        step4: "Xem xét Cuối cùng",
      },
    },

    // PESTLE Page
    pestlePage: {
      title: "Phân tích PESTLE",
      subtitle:
        "Phân tích Chính trị, Kinh tế, Xã hội, Công nghệ, Pháp lý, Môi trường",
      categories: {
        political: "Chính trị",
        economic: "Kinh tế",
        social: "Xã hội",
        technological: "Công nghệ",
        legal: "Pháp lý",
        environmental: "Môi trường",
      },
      analysis: "Phân tích",
      impact: "Tác động",
      risk: "Mức độ Rủi ro",
      opportunity: "Cơ hội",
      loading: "Đang tải phân tích PESTLE...",
      noData: "Không có dữ liệu phân tích",
    },

    // Quant Analysis Page
    quantAnalysisPage: {
      title: "Phân tích định lượng",
      subtitle: "Công cụ phân tích và trực quan hóa thị trường nâng cao",
      sections: {
        marketAnalysis: "Phân tích thị trường",
        dashboard: "Bảng điều khiển thị trường",
        heatmap: "Bản đồ nhiệt thị trường",
        monteCarlo: "Mô phỏng Monte Carlo",
      },
      interpretation: "Giải thích phân tích thị trường",
      loading: "Đang tải dữ liệu thị trường...",
      loadingHeatmap: "Đang tải dữ liệu bản đồ nhiệt...",
      loadingMonteCarlo: "Đang tải mô phỏng Monte Carlo...",
      controls: {
        indicator: "Chỉ báo",
        period: "Khoảng thời gian",
        returnType: "Loại lợi nhuận",
        dataSource: "Nguồn dữ liệu",
      },
    },

    // Quant Page detailed translations
    quantPage: {
      StockComparison: "So sánh cổ phiếu",
      StockPortfolioDashboard: "Bảng điều khiển danh mục cổ phiếu",
      Indicator: "Chỉ báo",
      Period: "Khoảng thời gian",
      Returns: "Lợi nhuận",
      Cummulative: "Tích lũy",
      Daily: "Hàng ngày",
      RiskRatio: "Tỷ lệ rủi ro",
      SharpeRatio: "Tỷ suất Sharpe",
      SortinoRatio: "Tỷ suất Sortino",
      StandardDeviation: "Độ lệch chuẩn",
      PastTrendVsFutureProjection: "Xu hướng quá khứ & Dự đoán tương lai",
      Simulation: "Mô phỏng",
      CloseValue: "Giá đóng cửa",
      IndicatorValue: "Giá trị chỉ báo",
      GBMSimulation: "Mô phỏng GBM",
      GARCHSimulation: "Mô phỏng GARCH",
      GraphPrice: "Biểu đồ giá",
      TimeStep: "Bước thời gian",
      Date: "Ngày",
      Value: "Giá trị",
      MonteCarloSimulation: "Mô phỏng Monte Carlo",
      SelectTicker: "Chọn mã cổ phiếu",
      TickerNameSearch: "Tìm kiếm mã cổ phiếu...",
      StockTicker: "Mã cổ phiếu",
      PriceChange: "Biến động giá",
      RelativeVolume: "Khối lượng tương đối",
      PERatio: "Hệ số P/E",
      EPSDistributed: "EPS đã phân bổ",
      DividendYield: "Tỷ suất cổ tức",
      IndustrySector: "Ngành/ Lĩnh vực",
      simulationChatBot: "Mô phỏng từ trợ lý ảo",
      closeValueChatBot: "Giá đóng cửa từ trợ lý ảo",
      indicatorAndReturnChatBot: "Chỉ báo và lợi nhuận từ trợ lý ảo",
    },

    // Super Investor Page
    superInvestorPage: {
      title: "Nhà Đầu tư Vĩ đại",
      subtitle: "Học hỏi từ những nhà đầu tư vĩ đại nhất thế giới",
      investors: "Nhà đầu tư",
      portfolio: "Danh mục",
      strategy: "Chiến lược Đầu tư",
      performance: "Hiệu suất",
      biography: "Tiểu sử",
      quotes: "Câu nói Nổi tiếng",
      holdings: "Cổ phiếu Nắm giữ",
      returns: "Lợi nhuận Hàng năm",
      viewProfile: "Xem Hồ sơ",
      followStrategy: "Theo dõi Chiến lược",
      loading: "Đang tải dữ liệu nhà đầu tư...",
      noInvestors: "Không tìm thấy nhà đầu tư",
      searchInvestors: "Tìm kiếm nhà đầu tư...",
      greeting: "Xin chào! Bạn đang tìm kiếm những hiểu biết về đầu tư?",
      topInvestorsIntro:
        "Đây là một số nhà đầu tư hàng đầu mà bạn có thể quan tâm:",
      from: "từ",
      portfolioValue: "Giá trị Danh mục",
      avgHoldingPeriod: "Thời gian Nắm giữ Trung bình",
      learnMorePrompt:
        "Bạn có muốn tìm hiểu thêm về chiến lược đầu tư của họ không?",
    },

    // Chatbot Bubble
    chatbotBubble: {
      minimize: "Thu nhỏ",
      maximize: "Phóng to",
      close: "Đóng",
      dragToMove: "Kéo để di chuyển",
      chatWithFinBud: "Chat với FinBud",
      startConversation: "Bắt đầu cuộc trò chuyện",
      needHelp: "Cần hỗ trợ tài chính?",
      inactivityPrompt: "Bạn có cần hỗ trợ gì về tài chính không?",
      marketHoursPrompt:
        "Thị trường đang mở! Bạn có muốn xem phân tích mới nhất?",
      portfolioCheckPrompt:
        "Đã lâu rồi bạn chưa kiểm tra danh mục đầu tư. Cần hỗ trợ gì không?",
      budgetReminderPrompt:
        "Cuối tháng rồi! Bạn có muốn xem lại ngân sách và chi tiêu không?",
      suggestions: {
        title: "Gợi ý Nhanh",
        investment: "Lời khuyên đầu tư",
        portfolio: "Phân tích danh mục",
        market: "Thông tin thị trường",
        budgeting: "Mẹo lập ngân sách",
        risk: "Quản lý rủi ro",
        trading: "Chiến lược giao dịch",
      },
      typing: "FinBud đang gõ...",
      placeholder: "Nhập câu hỏi tài chính của bạn...",
      send: "Gửi",
      quickSuggestions: "Gợi ý Nhanh",
      messageHistory: "Lịch sử Tin nhắn",
      clearHistory: "Xóa Lịch sử",
      error: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.",
      reconnecting: "Đang kết nối lại...",
      offline: "Bạn đang ngoại tuyến",
      poweredBy: "Được hỗ trợ bởi FinBud AI",
    },

    // Course Page
    coursePage: {
      title: "Khóa học Tài chính",
      subtitle: "Học hỏi và nâng cao kiến thức tài chính",
      categories: {
        beginners: "Dành cho người mới bắt đầu",
        investments: "Đầu tư hiệu quả",
        fundamental: "Phân tích cơ bản",
        technical: "Phân tích kỹ thuật",
      },
      views: "lượt xem",
      viewMore: "Xem thêm",
      loading: "Đang tải khóa học...",
      noData: "Không có khóa học nào",
      readTime: "phút đọc",
    },

    // Market Analysis Page
    marketAnalysisPage: {
      marketAnalysisTitle: "Phân tích Thị trường",
      marketAnalysisDescription:
        "Dữ liệu và phân tích thị trường toàn diện cho quyết định đầu tư sáng suốt",
      Positive: "Tích cực",
      Neutral: "Trung tính",
      Negative: "Tiêu cực",
      LastUpdated: "Cập nhật cuối",
      Insight: "Thông tin chi tiết",
      mentions: "Đề cập",
      AINews: "Tin tức AI",
      marketAnalysis: {
        StockCompany: "Công ty Cổ phiếu",
        FinanceStock: "Cổ phiếu Tài chính",
        TechCommunity: "Cộng đồng Công nghệ",
      },
      insight: {
        Assessment: "Đánh giá",
        Details: "Chi tiết",
        Source: "Nguồn",
        Analysis: "Phân tích",
        Reference: "Tham khảo",
      },
      trend: {
        title: "Xu hướng Thị trường",
        topic: "Chủ đề",
        categories: {
          All: "Tất cả",
          Securities: "Chứng khoán",
          Economy: "Kinh tế",
          Industry: "Ngành nghề",
          Other: "Khác",
        },
      },
    },

    // Quant Page
    quantPage: {
      StockComparison: "So sánh Cổ phiếu",
      Indicator: "Chỉ báo",
      Period: "Thời kỳ",
      Returns: "Lợi nhuận",
      Cummulative: "Tích lũy",
      Daily: "Hàng ngày",
      RiskRatio: "Tỷ lệ Rủi ro",
      SharpeRatio: "Tỷ lệ Sharpe",
      SortinoRatio: "Tỷ lệ Sortino",
      StandardDeviation: "Độ lệch Chuẩn",
      PastTrendVsFutureProjection: "Xu hướng Quá khứ vs Dự báo Tương lai",
      Simulation: "Mô phỏng",
      CloseValue: "Giá Đóng cửa",
      IndicatorValue: "Giá trị Chỉ báo",
      Date: "Ngày",
      Value: "Giá trị",
      GraphPrice: "Biểu đồ Giá",
      TimeStep: "Bước Thời gian",
      GBMSimulation: "Mô phỏng GBM",
      GARCHSimulation: "Mô phỏng GARCH",
      MonteCarloSimulation: "Mô phỏng Monte Carlo",
      StockPortfolioDashboard: "Bảng điều khiển Danh mục Cổ phiếu",
      TickerNameSearch: "Tìm kiếm mã cổ phiếu...",
      StockTicker: "Mã Cổ phiếu",
      PriceChange: "Thay đổi Giá",
      RelativeVolume: "Khối lượng Tương đối",
      PERatio: "Tỷ lệ P/E",
      EPSDistributed: "EPS Phân phối",
      DividendYield: "Lợi suất Cổ tức",
      IndustrySector: "Ngành Công nghiệp",
      SelectTicker: "Chọn Mã cổ phiếu",
      simulationChatBot: "Phân tích mô phỏng hoàn thành",
      closeValueChatBot: "Phân tích giá đóng cửa sẵn sàng",
      indicatorAndReturnChatBot: "Phân tích chỉ báo và lợi nhuận có sẵn",
    },

    // Stock Simulator
    stockSimulator: {
      pageTitle: "Mô Phỏng Chứng Khoán",
      tabs: {
        investment: "Đầu Tư",
        portfolio: "Danh Mục",
        filters: "Bộ Lọc Cổ Phiếu",
        quiz: "Câu Hỏi",
        predictiveCalc: "Máy Tính Dự Đoán",
      },
      trading: {
        quickTrade: "Giao Dịch Nhanh",
        stockSymbol: "Mã Cổ Phiếu",
        stockSymbolPlaceholder: "Nhập mã cổ phiếu (ví dụ: AAPL)",
        quantity: "Số Lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "Xóa",
      },
      account: {
        summary: "Tóm Tắt Tài Khoản",
        balance: "Tổng Số Dư",
        cash: "Tiền Mặt Khả Dụng",
        stocks: "Giá Trị Cổ Phiếu",
        todayChange: "Thay Đổi Hôm Nay",
      },
      portfolio: {
        totalPortfolio: "Tổng Giá Trị Danh Mục",
        holdings: "Cổ Phiếu Sở Hữu",
        loading: "Đang tải danh mục...",
        noHoldings: "Không có cổ phiếu nào",
        table: {
          symbol: "Mã",
          shares: "Số cổ phiếu",
          currentPrice: "Giá hiện tại",
          marketValue: "Giá trị thị trường",
          gainLoss: "Lãi/Lỗ",
          change: "Thay đổi %",
        },
      },
      screener: {
        title: "Công cụ sàng lọc cổ phiếu",
        subtitle: "Tìm cổ phiếu phù hợp với tiêu chí đầu tư của bạn",
        quickPresets: "Cài đặt sẵn nhanh",
        marketCap: "Vốn hóa thị trường",
        sector: "Ngành",
        priceRange: "Khoảng giá",
        peRatio: "Tỷ lệ P/E",
        dividendYield: "Lợi suất cổ tức",
        volume: "Khối lượng",
        beta: "Beta",
        resetFilters: "Đặt lại bộ lọc",
        savePreset: "Lưu cài đặt sẵn",
        stocksFound: "cổ phiếu tìm thấy",
        loading: "Đang tải...",
        loadingStocks: "Đang tải dữ liệu cổ phiếu...",
        enterPresetName: "Nhập tên cài đặt sẵn:",
        presetSaved: "Đã lưu cài đặt sẵn",
        presetSavedMessage: 'Cài đặt sẵn "{name}" đã lưu thành công',
        presets: {
          growthStocks: "Cổ phiếu tăng trưởng",
          valueStocks: "Cổ phiếu giá trị",
          dividendStocks: "Cổ phiếu cổ tức",
          largeCap: "Vốn hóa lớn",
          smallCap: "Vốn hóa nhỏ",
        },
        marketCapOptions: {
          mega: "Vốn hóa siêu lớn (>$200B)",
          large: "Vốn hóa lớn ($10B-$200B)",
          mid: "Vốn hóa trung bình ($2B-$10B)",
          small: "Vốn hóa nhỏ ($300M-$2B)",
          micro: "Vốn hóa vi mô (<$300M)",
        },
        sectors: {
          technology: "Công nghệ",
          healthcare: "Chăm sóc sức khỏe",
          financials: "Tài chính",
          energy: "Năng lượng",
          industrials: "Công nghiệp",
          materials: "Nguyên vật liệu",
          utilities: "Tiện ích",
          realestate: "Bất động sản",
          consumer_discretionary: "Hàng tiêu dùng tùy chọn",
          consumer_staples: "Hàng tiêu dùng thiết yếu",
          telecommunications: "Viễn thông",
        },
      },
      quiz: {
        title: "Quiz thị trường chứng khoán",
        loading: "Đang tải quiz...",
      },
      notifications: {
        orderSuccess: "Đặt lệnh thành công",
        buySuccess: "Mua thành công {quantity} cổ phiếu của {symbol}",
        sellSuccess: "Bán thành công {quantity} cổ phiếu của {symbol}",
        orderError: "Đặt lệnh thất bại",
        networkError: "Đã xảy ra lỗi mạng",
      },
    },

    // Accountant Page
    accountantPage: {
      title: "AI Kế Toán Thông Minh",
      subtitle: "Phân tích tài chính tự động với AI tiên tiến",
      hero: {
        documentsProcessed: "Tài liệu đã xử lý",
        accuracyRate: "Độ chính xác",
        timeSaved: "Thời gian tiết kiệm",
      },
      upload: {
        title: "Tải lên & Phân tích",
        dragText: "Kéo thả file PDF, Excel hoặc CSV vào đây",
        supportedFormats: "Hỗ trợ: PDF, XLSX, XLS, CSV (tối đa 10MB)",
        browseFiles: "Duyệt file",
        analyzing: "Đang phân tích...",
        quickTemplates: "Mẫu nhanh",
        templates: {
          incomeStatement: "Báo cáo thu nhập",
          incomeDesc: "Phân tích P&L",
          balanceSheet: "Bảng cân đối kế toán",
          balanceDesc: "Xem xét tình hình tài chính",
          cashFlow: "Báo cáo lưu chuyển tiền tệ",
          cashDesc: "Theo dõi luồng tiền",
          taxDocuments: "Tài liệu thuế",
          taxDesc: "Lập kế hoạch & tuân thủ thuế",
        },
      },
      chatbot: {
        title: "Trợ lý AI Tài chính",
        greeting:
          "Xin chào! Tôi là Trợ lý AI Tài chính của bạn. Hôm nay tôi có thể giúp gì cho bạn?",
        placeholder: "Nhập tin nhắn của bạn...",
        options: {
          upload: "Tải lên tài liệu",
          insights: "Giải thích thông tin chi tiết",
          tax: "Tối ưu hóa thuế",
          compliance: "Kiểm tra tuân thủ",
        },
        responses: {
          upload:
            "Tôi có thể giúp bạn phân tích các loại tài liệu tài chính như báo cáo thu nhập, bảng cân đối kế toán, báo cáo lưu chuyển tiền tệ và tài liệu thuế. Chỉ cần kéo thả file của bạn vào khu vực tải lên!",
          insights:
            "Tôi cung cấp thông tin chi tiết AI về hiệu suất tài chính, cơ hội tăng trưởng, tối ưu hóa chi phí và dự báo. Bạn muốn tôi giải thích điều gì cụ thể?",
          tax: "Tôi có thể giúp xác định các chiến lược tối ưu hóa thuế, tín dụng thuế có sẵn, khấu hao tối đa và cơ hội giảm thuế. Loại tối ưu hóa nào bạn quan tâm?",
          compliance:
            "Tôi thực hiện kiểm tra tuân thủ toàn diện cho các tiêu chuẩn báo cáo tài chính, yêu cầu thuế và quy định ngành. Bạn cần kiểm tra loại tuân thủ nào?",
        },
      },
      dashboard: {
        title: "Dashboard Thông minh",
        financialOverview: "Tổng quan Tài chính",
        totalRevenue: "Tổng doanh thu",
        netProfit: "Lãi ròng",
        operatingMargin: "Biên lợi nhuận hoạt động",
        cashFlow: "Dòng tiền",
        insights: "Thông tin Chi tiết AI",
        expenseAnalysis: "Phân tích Chi phí",
        categories: {
          operations: "Hoạt động",
          marketing: "Marketing",
          technology: "Công nghệ",
          personnel: "Nhân sự",
        },
        compliance: "Giám sát Tuân thủ",
        complianceScore: "Điểm tuân thủ",
        taxOptimization: "Tối ưu hóa Thuế",
        forecasting: "Dự báo Tài chính",
        forecasting92: "Độ tin cậy 92%",
        forecastPeriods: {
          nextMonth: "Tháng tới",
          nextQuarter: "Quý tới",
        },
        metrics: {
          revenue: "Doanh thu",
          profit: "Lãi",
          strongGrowth: "Tăng trưởng mạnh",
          sustainedGrowth: "Tăng trưởng bền vững",
        },
      },
      actions: {
        title: "Hành động Đề xuất",
        priorities: {
          all: "Tất cả",
          high: "Cao",
          medium: "Trung bình",
          low: "Thấp",
        },
        execute: "Thực hiện",
        items: {
          revenueOpportunity: "Cơ hội Tăng Doanh thu",
          revenueDesc:
            "Xu hướng Q4 cho thấy tiềm năng tăng trưởng 23% trong phân khúc dịch vụ công nghệ",
          costOptimization: "Cảnh báo Tối ưu Chi phí",
          costDesc:
            "Chi phí văn phòng tăng 18% quý này. Xem xét đàm phán lại hợp đồng nhà cung cấp",
          cashFlowPrediction: "Dự báo Dòng tiền",
          cashFlowDesc:
            "Dựa trên xu hướng hiện tại, dự kiến cải thiện dòng tiền tích cực quý tới",
        },
      },
      compliance: {
        taxFiling: "Tuân thủ Khai thuế",
        taxDesc: "Tất cả hồ sơ khai thuế hàng quý đều cập nhật",
        reporting: "Tiêu chuẩn Báo cáo Tài chính",
        reportingDesc: "Xác minh tuân thủ GAAP hoàn tất",
        auditTrail: "Xác minh Dấu vết Kiểm toán",
        auditDesc: "Phát hiện sai lệch nhỏ trong danh mục chi phí",
        statuses: {
          compliant: "Tuân thủ",
          reviewRequired: "Cần xem xét",
          passed: "Đạt",
          warning: "Cảnh báo",
        },
      },
      tax: {
        depreciation: "Tối ưu hóa Khấu hao",
        depreciationDesc:
          "Tăng tốc khấu hao thiết bị để giảm thuế năm hiện tại",
        expenseMax: "Tối đa hóa Chi phí Kinh doanh",
        expenseDesc:
          "Xác định chi phí khấu trừ bị bỏ sót từ du lịch và giải trí",
        rdCredit: "Tín dụng Thuế R&D",
        rdDesc: "Đủ điều kiện cho ưu đãi thuế nghiên cứu và phát triển",
        savings: "Tiết kiệm",
        complexity: {
          low: "Thấp",
          medium: "Trung bình",
          high: "Cao",
        },
        actions: {
          implementNow: "Thực hiện ngay",
          reviewApply: "Xem xét & Áp dụng",
          consultExpert: "Tư vấn Chuyên gia",
        },
      },
      help: {
        tooltip: "Cần trợ giúp? Hỏi Trợ lý AI",
        processing: "Đang xử lý AI",
        progressSteps: {
          extracting: "Trích xuất dữ liệu từ tài liệu...",
          analyzing: "Phân tích các số liệu tài chính...",
          generating: "Tạo thông tin chi tiết...",
          finalizing: "Hoàn thiện báo cáo...",
        },
      },
    },
    newFeatures: {
      title: "Tính năng mới",
      subtitle: "Khám phá các công cụ mới nhất của chúng tôi",
      aiCalculator: {
        title: "Máy tính dự đoán bằng AI",
        description:
          "Dự đoán đầu tư và tối ưu hóa danh mục thông minh với công nghệ AI tiên tiến",
        tags: {
          aiModels: "Mô hình AI",
          realTimeData: "Dữ liệu thời gian thực",
          charts: "Biểu đồ",
        },
        button: "Dùng thử AI Calculator",
      },
      roadmapCreator: {
        title: "Trình tạo lộ trình học tập",
        description:
          "Lộ trình giáo dục tài chính được cá nhân hóa theo mục tiêu của bạn",
        tags: {
          personalized: "Cá nhân hóa",
          stepByStep: "Từng bước một",
          aiPowered: "Hỗ trợ bởi AI",
        },
        button: "Tạo lộ trình",
      },
      enhancedQuiz: {
        title: "Câu đố tài chính nâng cao",
        description:
          "Bài kiểm tra tương tác với phản hồi và chấm điểm theo thời gian thực",
        tags: {
          interactive: "Tương tác",
          aiFeedback: "Phản hồi AI",
          progressTracking: "Theo dõi tiến độ",
        },
        button: "Làm bài Quiz",
      },
    },
  },
};

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
  globalInjection: true,
});

export default i18n;
