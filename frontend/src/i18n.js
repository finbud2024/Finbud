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
    course: "Course",
    event: "Event",
    forum: "Forum",
    finAgent: "Fin Agent",
    finData: "Fin Data",
    agent: "Agent",
    pestle: "PESTLE",
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
      daniel: "FinBud helped me understand where my money goes each month. Simple insights, big impact.",
      rachel: "I’ve tried several money apps before, but none felt as intuitive as FinBud. It helped me figure out where my paycheck was going. The AI guidance makes a big difference—it feels personal. Now I’ve started building savings and even planning for retirement. I finally feel like I’m making smart choices with my money.",
      jane: "I love using FinBud! It's like having a personal financial advisor available 24/7. The insights and tips are incredibly useful and easy to understand.",
      julian: "I was always intimidated by financial planning. Spreadsheets overwhelmed me, and I never knew where to start.FinBud took that stress away with its clean interface and smart AI support. It categorized my spending automatically and gave me goals I could actually reach. After six months of using it, I’ve paid off two credit cards and started building an emergency fund. I finally feel like I’m in control of my finances instead of the other way around. It’s more than an app—it’s like having a coach that keeps me accountable. Highly recommend it to anyone feeling stuck or lost with money.",
      amelia: "FinBud’s personalized advice was the game-changer I didn’t know I needed. It adapts to my financial habits and pushes me gently in the right direction. From budgeting to investing, every feature feels thoughtful and well-designed. What really surprised me was how much I’ve learned just by using the app. The daily insights taught me more than any finance blog or YouTube video ever has. My relationship with money has completely shifted—from stress to confidence. FinBud truly empowers users to take charge.",
      marcus: "I used to bounce between multiple finance apps—one for spending, one for saving, another for investments. FinBud brought everything together in one sleek platform. It tracks my goals, shows me real-time progress, and gives advice that actually works. I’ve reduced unnecessary subscriptions, started a travel fund, and even put money into a Roth IRA. I don’t need to be a finance expert anymore. FinBud makes complex decisions feel manageable. This app respects your time and rewards consistency. It’s been a game-changer for how I handle money.",
      tyler: "The budgeting tool alone is worth it, but the real-time alerts are what keep me on track. It’s like having a financial assistant watching out for me. I never miss a due date anymore.",
      ten: "FinBud doesn’t just show you numbers—it explains them. I get clear, actionable tips that help me adjust my habits without guilt. It feels like I’m getting smarter about money every day. Even my partner started using it after seeing my progress. It’s been a financial glow-up for both of us.",
      claire: "Tracking expenses used to stress me out, but FinBud simplified it all. The daily summaries help me stay accountable without being overwhelmed. I love how it celebrates milestones—it’s motivating. It’s the only finance app I’ve actually stuck with. Definitely recommend for anyone trying to build better habits.",
      sophie: "FinBud gives me confidence in every financial decision I make. It’s easy to use and always spot-on with its advice. I’ve already saved more in 3 months than I did all last year.",
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
      deleteConfirm: "Delete Chat ?",
      deleteConfirmMessage: "This will delete",
      cancel: "Cancel",
      guildence: "Guidence",
      sendButton: "Send",
      responsePlaceholder: "Phản hồi từ FinBud sẽ xuất hiện ở đây"
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
    },

    //Chat
    message: "Type your message here... ",

    // Main Page Content
    empoweringTitle: "Empowering smarter finance decisions",
    anytimeAnswers: "Anytime answers for finance questions with FinBud",
    partneringTitle: "Partnering to Achieve Financial Goals",

    // Financial Awareness Section
    enhanceFinancialTitle: "Enhance Your Financial Awareness",
    enhanceFinancialDesc: "Finbud's advanced AI chatbot will help you review, explore financial topics, and answer all your questions.",

    // Financial Planning Section
    optimizeFinancialTitle: "Optimize Your Financial Planning",
    optimizeFinancialDesc: "Finbud helps you track and manage expenses, record income and spending, and tailor financial management to your specific goals.",

    // Investment Section
    maximizeInvestmentTitle: "Maximize Your Investment Efficiency",
    maximizeInvestmentDesc: "Finbud provides a comprehensive overview of the financial market, guiding you to optimize your capital confidently.",

    // Impact Section
    impactTitle: "Easily notice the impact",
    savingsIncrease: "Savings Increase",
    savingsDesc: "average per user",
    financialAwareness: "Financial Awareness",
    awarenessDesc: "increase",
    debtReduction: "Debt Reduction",
    debtDesc: "after 1 year",
    creditScore: "Improved Credit Score",
    creditDesc: "months within",

    // Features Section
    chatbotFeatureTitle: "Solve Financial Worries with",
    chatbotFeatureName: "AI Chatbot,",
    chatbotDesc: "With just simple commands and access to a vast source of accurate and reliable information, all your financial queries can be answered instantly.",
    chatNow: "Chat now",

    simulatorFeatureTitle: "Master Your Investments with",
    simulatorFeatureName: "FinBud Simulator,",
    simulatorDesc: "Track how your investments are performing in real-time, provide actionable insights from your investment and the market to make better investment decisions.",
    simulatorNow: "Simulator now",

    goalFeatureTitle: "Predict Your Costs with",
    goalFeatureName: "FinBud Goal,",
    goalDesc: "Our AI predicts upcoming expenses to help you plan ahead, understand your spending patterns and receive tips for better budget management.",
    goalNow: "Set Goal now",

    quizFeatureTitle: "Boost Your Finance Skills with",
    quizFeatureName: "FinBud Quiz,",
    quizDesc: "Financial Quiz with different topics related to various keywords helps you practice and learn financial knowledge in a smart and interactive way.",
    quizNow: "Try Quiz now",

    // FAQ Section
    faqTitle: "Frequently Asked Questions",
    faqs: {
      pricing: {
        question: "Is FinBud free to use, or are there any subscription plans?",
        answer: "FinBud offers both a free package with basic features and a subscription plan for some advanced features. Let's register to try all the free financial tools of FinBud before looking for more advanced options from us."
      },
      chatbot: {
        question: "What kind of questions can the FinBud chatbot solve?",
        answer: "The FinBud chatbot is designed to assist with a wide range of inquiries, covering both financial and non-financial topics. Additionally, the chatbot allows you to directly execute various commands within FinBud's financial management, investment, and educational features. For example, you can buy or sell stocks, manage your budget, or look up financial terms. Simply click on the chat icon and follow the guidance to explore the full capabilities of the FinBud chatbot."
      },
      investment: {
        question: "Does FinBud support investment tracking and management?",
        answer: "Yes, our Quant and Simulator pages provide an immersive experience for those exploring advanced finance. You can manage your investment portfolio, access in-depth stock analysis, and even practice real stock trading through our Simulator - perfect for beginners looking to gain hands-on investment experience."
      },
      goals: {
        question: "Can I set financial goals with FinBud and track my progress?",
        answer: "Absolutely! With FinBud, you can set specific financial goals by defining details such as the category, target date, required amount, and current savings. On the Goal page, we help you stay on track by monitoring your daily transactions and providing detailed charts, ensuring you can reach each goal more effectively."
      },
      mobile: {
        question: "Is FinBud available on mobile devices, and does it sync across platforms?",
        answer: "Yes, FinBud is available on both mobile devices and laptops. Simply log in to your account, and your data will automatically sync across all platforms for seamless access."
      }
    },
    // Chart Labels
    initialInvestmentLabel: "Initial Investment",
    additionalContributionLabel: "Additional Contribution",
    profitEarnedLabel: "Profit Earned",
    zillowNote: "Interest rate provided via Zillow.",
    yearNumber: "Year {number}",
    // FundLetterPage Component
    fundLetters: "Fund Letters",
    fundLettersArchive: "Fund Letters Archive",
    curatedListSubtitle: "Curated List of Quarterly Hedge Fund Letters",
    searchPlaceholder: "Search by name of fund",
    allYears: "All Years",
    allQuarters: "All Quarters",
    fundName: "Fund Name",
    date: "Date",
    noResults: "No letters found for selected filters.",
    resetFilters: "Reset Filters",
    greatestInvestors: "Greatest Investor Compilations",
    learnFromMasters: "Learn from the masters of value investing",

    // Investment Calculator Bot Messages
    investmentAnalysis: "Investment Analysis:",
    initialAmount: "Initial:",
    rateAmount: "Rate:",
    finalAmountBot: "Final:",

    // Technology Page
    technologyPage: {
      title: "Analytics that drive your business.",
      description: "Review your performance and drive change with our actionable insights provided via our intuitive web app.",
      features: {
        title: {
          plan: "Financial Planning",
          manage: "Debt and Investment Management",
          edu: "Financial Education",
          analyze: "Predictive Financial Analytics",
        },
        description: {
          plan: "I help you create and maintain a perfect personal financial plan.",
          manage: "Manage your debts and invest wisely with targeted advice tailored to your goals.",
          edu: "Providing knowledge on basic and advanced financial concepts to empower your decisions.",
          analyze: "Utilize AI to analyze and predict financial trends to make smart decisions.",
        },
      },
      financialConsulting: {
        title: "Financial Consulting",
        note: "Personalized plans to secure your financial future.",
        highlightsLeft: [
          "Debt Management",
          "Savings Strategies",
          "Investment Advice"
        ],
        highlightsRight: [
          "Custom Financial Planning",
          "Goal-Oriented Guidance",
          "Personal Wealth Management"
        ],
        button: "Start your 30-day free trial"
      },
      financialEducation: {
        title: "Financial Education",
        note: "Empower yourself with knowledge to make better financial decisions.",
        highlights: [
          "Basic to Advanced Financial Concepts",
          "Interactive Lessons and Quizzes",
          "Real-time Financial Trend Analysis",
          "AI-Driven Insights"
        ],
        button: "Start your 30-day free trial"
      },
      insights: {
        title: "ARTIFICIAL INTELLIGENCE",
        subtitle: "Get real-time insights on your performance.",
        description: "Empower your financial decisions with our cutting-edge AI technology.",
        points: [
          "Personalized Financial Analysis: Gain comprehensive insights with auto-generated reports tailored to your financial behavior, helping you optimize your budget and savings.",
          "Trend Prediction: Our AI-driven tools analyze past spending and earning trends to forecast your financial future, enabling proactive financial planning."
        ],
        button: "Learn more"
      },
      computerVision: {
        title: "ADVANCED AI CHATBOT",
        subtitle: "Smart Financial Assistance at Your Fingertips.",
        featuresTitle: {
          analyze: "Instant Financial Insights",
          plan: "Interactive Financial Planning",
          secure: "Secure and Confidential"
        },
        featuresDescription: {
          analyze: "Ask any question, from budgeting tips to investment advice, and get immediate, data-driven answers.",
          plan: "Ask any question, from budgeting tips to investment advice, and get immediate, data-driven answers.",
          secure: "Our proprietary system utilizes neural networks to identify the information that matters most. Think of it like the way your brain works, only it never gets tired (or needs 3 cups of coffee to get through the day)."
        }
      },
      // partners: {
      //   description: " <a href='mailto:contact@yourdomain.com'></a>",
      //   left: "<a href='#'></a>",
      //   right: " <a href='#'>Learn more</a>"
      // }
      partners: {
        title: "Integrate with the best tools in the market",
        descriptionParts: [
          "Check out our connected partners. Don’t see your software on the list of partners?",
          { type: "link", text: " Drop us a note", href: "mailto:contact@yourdomain.com" },
          " and we’ll get them added."
        ],
        left: {
          text: "Shop-Ware enables users to take advantage of their lightning-fast workflows to repair more cars every month.",
          linkText: "Learn more",
          linkHref: "#"
        },
        right: {
          text: "Tekmetric lets you unleash your shop’s potential with their streamlined workflow settings.",
          linkText: "Learn more",
          linkHref: "#"
        }
      }
    }

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
    course: "Khoá học",
    event: "Sự kiện",
    forum: "Forum",
    finAgent: "Fin Tài chính",
    agent: "Agent",
    pestle: "PESTLE",
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
      daniel: "FinBud giúp tôi hiểu rõ tiền của mình đi đâu mỗi tháng. Những phân tích đơn giản nhưng tạo ra khác biệt lớn.",
      rachel: "Tôi đã thử nhiều ứng dụng tài chính, nhưng không cái nào trực quan như FinBud. Nó giúp tôi biết tiền lương của mình đã được chi vào đâu. Hướng dẫn AI tạo nên khác biệt lớn — cảm giác rất cá nhân. Giờ tôi đã bắt đầu tiết kiệm và lên kế hoạch nghỉ hưu. Cuối cùng tôi cũng cảm thấy mình đang đưa ra những quyết định thông minh với tiền bạc.",
      jane: "Tôi yêu FinBud! Giống như có một cố vấn tài chính cá nhân 24/7 vậy. Những phân tích và mẹo đều cực kỳ hữu ích và dễ hiểu.",
      julian: "Tôi từng rất sợ lập kế hoạch tài chính. Bảng tính làm tôi choáng ngợp và tôi không biết bắt đầu từ đâu. FinBud giúp tôi thoát khỏi căng thẳng đó nhờ giao diện đơn giản và hỗ trợ AI thông minh. Nó tự động phân loại chi tiêu và đặt ra các mục tiêu khả thi. Sau 6 tháng sử dụng, tôi đã trả hết 2 thẻ tín dụng và bắt đầu xây dựng quỹ khẩn cấp. Cuối cùng tôi cũng cảm thấy kiểm soát được tài chính thay vì bị nó chi phối. Không chỉ là một ứng dụng — nó giống như một huấn luyện viên giúp tôi có trách nhiệm hơn. Rất đáng dùng cho ai cảm thấy bế tắc về tiền bạc.",
      amelia: "Lời khuyên cá nhân hóa từ FinBud chính là điều tôi không ngờ mình cần. Nó điều chỉnh theo thói quen tài chính của tôi và nhẹ nhàng định hướng đúng đắn. Từ ngân sách đến đầu tư, mọi tính năng đều được thiết kế tỉ mỉ. Điều bất ngờ nhất là lượng kiến thức tôi học được chỉ từ việc dùng app. Những phân tích hàng ngày dạy tôi nhiều hơn cả blog hay video tài chính. Mối quan hệ của tôi với tiền bạc đã thay đổi hoàn toàn — từ căng thẳng sang tự tin. FinBud thực sự trao quyền cho người dùng.",
      marcus: "Tôi từng dùng nhiều app tài chính cùng lúc — một để theo dõi chi tiêu, một để tiết kiệm, một khác để đầu tư. FinBud kết hợp tất cả trong một nền tảng mượt mà. Nó theo dõi mục tiêu, hiển thị tiến độ thời gian thực và đưa ra lời khuyên hiệu quả. Tôi đã cắt giảm các gói đăng ký không cần thiết, bắt đầu quỹ du lịch và cả đầu tư vào Roth IRA. Giờ tôi không cần phải là chuyên gia tài chính nữa. FinBud biến những quyết định phức tạp thành đơn giản. Ứng dụng này tôn trọng thời gian của bạn và khuyến khích sự kiên trì. Nó thay đổi hoàn toàn cách tôi quản lý tiền.",
      tyler: "Chỉ riêng công cụ lập ngân sách đã đáng giá, nhưng cảnh báo thời gian thực mới là thứ giữ tôi đi đúng hướng. Giống như có một trợ lý tài chính luôn theo sát vậy. Tôi không bao giờ quên hạn thanh toán nữa.",
      ben: "FinBud không chỉ hiển thị con số — nó còn giải thích chúng. Tôi nhận được mẹo hành động rõ ràng để điều chỉnh thói quen mà không cảm thấy tội lỗi. Cảm giác như mỗi ngày tôi đều hiểu hơn về tiền bạc. Ngay cả bạn đời của tôi cũng bắt đầu dùng sau khi thấy sự tiến bộ của tôi. Đó là một bước ngoặt tài chính cho cả hai chúng tôi.",
      claire: "Theo dõi chi tiêu từng khiến tôi căng thẳng, nhưng FinBud đã đơn giản hóa mọi thứ. Bản tóm tắt hàng ngày giúp tôi có trách nhiệm mà không bị quá tải. Tôi thích cách nó ăn mừng các cột mốc — rất có động lực. Đây là ứng dụng tài chính duy nhất tôi kiên trì dùng. Rất đáng để thử nếu bạn muốn xây dựng thói quen tốt hơn.",
      sophie: "FinBud cho tôi tự tin vào mọi quyết định tài chính. Dễ sử dụng và luôn đưa ra lời khuyên chính xác. Chỉ sau 3 tháng, tôi đã tiết kiệm được nhiều hơn cả năm ngoái.",
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
      deleteConfirm: "Xóa cuộc trò chuyện?",
      deleteConfirmMessage: "Điều này sẽ xóa",
      cancel: "Hủy",
      guildence: "Hướng dẫn",
      sendButton: "Gửi",
      responsePlaceholder: "Phản hồi từ FinBud sẽ xuất hiện ở đây"
    },
    //Event Hub
    eventHub: {
      searchPlaceholder: "Tìm kiếm sự kiện...",
      exploreNearby: "Khám phá gần bạn",
      saved: "Đã lưu",
      allEvents: "Tất cả sự kiện",
      eventCategories: "Danh mục sự kiện bạn có thể thích",
      trending: "Xu hướng",
      readMore: "Xem thêm",
      dontMiss: "Đừng bỏ lỡ!",
      finDiscover: "Khám phá các sự kiện tài chính nổi bật gần bạn",
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
    },

    //Chat
    message: "Nhập tin nhắn của bạn ở đây... ",

    // Main Page Content
    empoweringTitle: "Tự tin với mỗi quyết định tài chính",
    anytimeAnswers: "FinBud – trợ lý tài chính của bạn, sẵn sàng giải đáp mọi thắc mắc 24/7",
    partneringTitle: "Hợp tác để đạt được mục tiêu tài chính",

    // Financial Awareness Section
    enhanceFinancialTitle: "Nâng cao nhận thức tài chính của bạn",
    enhanceFinancialDesc: "Chatbot AI tiên tiến của Finbud sẽ giúp bạn xem xét, khám phá các chủ đề tài chính và trả lời mọi câu hỏi của bạn.",

    // Financial Planning Section
    optimizeFinancialTitle: "Tối ưu hóa kế hoạch tài chính của bạn",
    optimizeFinancialDesc: "Finbud giúp bạn theo dõi và quản lý chi phí, ghi lại thu nhập và chi tiêu, và điều chỉnh quản lý tài chính theo mục tiêu cụ thể của bạn.",

    // Investment Section
    maximizeInvestmentTitle: "Tối đa hóa hiệu quả đầu tư của bạn",
    maximizeInvestmentDesc: "Finbud cung cấp tổng quan toàn diện về thị trường tài chính, hướng dẫn bạn tối ưu hóa vốn một cách tự tin.",

    // Impact Section
    impactTitle: "Dễ dàng nhận thấy tác động",
    savingsIncrease: "Tăng tiết kiệm",
    savingsDesc: "trung bình mỗi người dùng",
    financialAwareness: "Nhận thức tài chính",
    awarenessDesc: "tăng",
    debtReduction: "Giảm nợ",
    debtDesc: "sau 1 năm",
    creditScore: "Cải thiện điểm tín dụng",
    creditDesc: "tháng",

    // Features Section
    chatbotFeatureTitle: "Giải quyết lo lắng tài chính với",
    chatbotFeatureName: "Chatbot AI,",
    chatbotDesc: "Với các lệnh đơn giản và truy cập vào nguồn thông tin chính xác và đáng tin cậy, mọi thắc mắc tài chính của bạn đều có thể được trả lời ngay lập tức.",
    chatNow: "Chat ngay",

    simulatorFeatureTitle: "Làm chủ đầu tư của bạn với",
    simulatorFeatureName: "FinBud Simulator,",
    simulatorDesc: "Theo dõi hiệu suất đầu tư của bạn theo thời gian thực, cung cấp thông tin chi tiết từ đầu tư của bạn và thị trường để đưa ra quyết định đầu tư tốt hơn.",
    simulatorNow: "Mô phỏng ngay",

    goalFeatureTitle: "Dự đoán chi phí của bạn với",
    goalFeatureName: "FinBud Goal,",
    goalDesc: "AI của chúng tôi dự đoán chi phí sắp tới để giúp bạn lên kế hoạch trước, hiểu mô hình chi tiêu của bạn và nhận các mẹo quản lý ngân sách tốt hơn.",
    goalNow: "Đặt mục tiêu ngay",

    quizFeatureTitle: "Nâng cao kỹ năng tài chính của bạn với",
    quizFeatureName: "FinBud Quiz,",
    quizDesc: "Bài kiểm tra tài chính với các chủ đề khác nhau liên quan đến các từ khóa khác nhau giúp bạn thực hành và học kiến thức tài chính một cách thông minh và tương tác.",
    quizNow: "Thử Quiz ngay",

    // FAQ Section
    faqTitle: "Câu hỏi thường gặp",
    faqs: {
      pricing: {
        question: "FinBud có miễn phí để sử dụng không, hay có các gói đăng ký?",
        answer: "FinBud cung cấp cả gói miễn phí với các tính năng cơ bản và gói đăng ký cho một số tính năng nâng cao. Hãy đăng ký để thử tất cả các công cụ tài chính miễn phí của FinBud trước khi tìm hiểu thêm các tùy chọn nâng cao từ chúng tôi."
      },
      chatbot: {
        question: "Chatbot FinBud có thể giải quyết những câu hỏi nào?",
        answer: "Chatbot FinBud được thiết kế để hỗ trợ nhiều loại câu hỏi, bao gồm cả chủ đề tài chính và phi tài chính. Ngoài ra, chatbot cho phép bạn trực tiếp thực hiện các lệnh khác nhau trong các tính năng quản lý tài chính, đầu tư và giáo dục của FinBud. Ví dụ, bạn có thể mua hoặc bán cổ phiếu, quản lý ngân sách hoặc tra cứu các thuật ngữ tài chính. Chỉ cần nhấp vào biểu tượng chat và làm theo hướng dẫn để khám phá đầy đủ khả năng của chatbot FinBud."
      },
      investment: {
        question: "FinBud có hỗ trợ theo dõi và quản lý đầu tư không?",
        answer: "Có, các trang Quant và Simulator của chúng tôi cung cấp trải nghiệm chuyên sâu cho những người khám phá tài chính nâng cao. Bạn có thể quản lý danh mục đầu tư, truy cập phân tích cổ phiếu chuyên sâu và thậm chí thực hành giao dịch cổ phiếu thực thông qua Simulator - hoàn hảo cho người mới bắt đầu muốn có kinh nghiệm đầu tư thực tế."
      },
      goals: {
        question: "Tôi có thể đặt mục tiêu tài chính với FinBud và theo dõi tiến trình của mình không?",
        answer: "Hoàn toàn có thể! Với FinBud, bạn có thể đặt các mục tiêu tài chính cụ thể bằng cách xác định chi tiết như danh mục, ngày mục tiêu, số tiền cần thiết và tiết kiệm hiện tại. Trên trang Goal, chúng tôi giúp bạn theo dõi bằng cách giám sát các giao dịch hàng ngày và cung cấp biểu đồ chi tiết, đảm bảo bạn có thể đạt được từng mục tiêu hiệu quả hơn."
      },
      mobile: {
        question: "FinBud có khả dụng trên thiết bị di động và có đồng bộ hóa trên các nền tảng không?",
        answer: "Có, FinBud có sẵn trên cả thiết bị di động và laptop. Chỉ cần đăng nhập vào tài khoản của bạn, và dữ liệu của bạn sẽ tự động đồng bộ hóa trên tất cả các nền tảng để truy cập liền mạch."
      }
    },

    // Investment Calculator Chart Labels
    initialInvestmentLabel: "Số vốn ban đầu",
    additionalContributionLabel: "Đóng góp bổ sung",
    profitEarnedLabel: "Lợi nhuận thu được",
    zillowNote: "Lãi suất được cung cấp bởi Zillow.",
    yearNumber: "Năm {number}",
    // Fund Letter
    fundLetters: "Thư Quỹ",
    fundLettersArchive: "Lưu Trữ Thư Quỹ",
    curatedListSubtitle: "Danh sách các thư quỹ hàng quý được chọn lọc",
    searchPlaceholder: "Tìm kiếm theo tên quỹ",
    allYears: "Tất cả các năm",
    allQuarters: "Tất cả các quý",
    fundName: "Tên Quỹ",
    date: "Ngày",
    noResults: "Không tìm thấy thư nào với bộ lọc đã chọn.",
    resetFilters: "Đặt lại bộ lọc",
    greatestInvestors: "Tuyển Tập Nhà Đầu Tư Vĩ Đại",

    // Technology Page
    technologyPage: {
      title: "Phân tích giúp phát triển doanh nghiệp của bạn.",
      description: "Theo dõi hiệu quả hoạt động và thúc đẩy thay đổi tích cực với những phân tích thực tiễn bằng công nghệ của chúng tôi.",
      features: {
        title: {
          plan: "Lập kế hoạch tài chính",
          manage: "Quản lý nợ và đầu tư",
          edu: "Giáo dục tài chính",
          analyze: "Dự đoán và phân tích tài chính",
        },
        description: {
          plan: "Đồng hành cùng bạn trong việc xây dựng và duy trì một kế hoạch tài chính cá nhân vững chắc.",
          manage: "Giúp bạn kiểm soát nợ và đầu tư hiệu quả với những lời khuyên phù hợp với mục tiêu cá nhân.",
          edu: "Trang bị cho bạn những kiến thức nền tảng và nâng cao về tài chính để tự tin ra quyết định.",
          analyze: "Ứng dụng AI để phân tích và dự đoán xu hướng tài chính, hỗ trợ bạn đưa ra những quyết định thông minh và chính xác.",
        },
      },
      financialConsulting: {
        title: "Tư vấn tài chính",
        note: "Kế hoạch cá nhân hóa để bảo vệ tương lai tài chính của bạn.",
        highlightsLeft: [
          "Quản lý nợ",
          "Chiến lược tiết kiệm",
          "Tư vấn đầu tư"
        ],
        highlightsRight: [
          "Lập kế hoạch tài chính cá nhân",
          "Định hướng theo mục tiêu",
          "Quản lý tài sản cá nhân"
        ],
        button: "Bắt đầu dùng thử 30 ngày miễn phí"
      },
      financialEducation: {
        title: "Giáo dục tài chính",
        note: "Trang bị kiến thức để đưa ra những quyết định tài chính sáng suốt.",
        highlights: [
          "Kiến thức tài chính từ cơ bản đến nâng cao",
          "Bài học và câu đố sinh động",
          "Phân tích xu hướng tài chính theo thời gian thực",
          "Thông tin chuyên sâu được hỗ trợ bởi AI"
        ],
        button: "Bắt đầu dùng thử 30 ngày miễn phí"
      },
      insights: {
        title: "TRÍ TUỆ NHÂN TẠO",
        subtitle: "Nhận phân tích tức thời về hiệu suất của bạn.",
        description: "Nâng cấp quyết định tài chính với công nghệ AI tiên tiến của chúng tôi.",
        points: [
          "Cá nhân hoá phân tích tài chính: Báo cáo tự động theo dõi thói quen chi tiêu của bạn, giúp bạn tối ưu ngân sách và gia tăng tiết kiệm.",
          "Dự đoán xu hướng: Công cụ AI phân tích dòng tiền quá khứ để dự báo tương lai tài chính, giúp bạn chủ động lên kế hoạch từ sớm."
        ],
        button: "Xem thêm"
      },
      computerVision: {
        title: "CHATBOT AI TIÊN TIẾN",
        subtitle: "Trợ lý tài chính thông minh chỉ với một chạm.",
        featuresTitle: {
          analyze: "Phân tích tài chính tức thì",
          plan: "Lập kế hoạch tài chính linh hoạt",
          secure: "An toàn và bảo mật tuyệt đối"
        },
        featuresDescription: {
          analyze: "Bạn cần mẹo tiết kiệm hay tư vấn đầu tư? Hỏi ngay và nhận câu trả lời chính xác, dựa trên dữ liệu thực tế – nhanh chóng và dễ hiểu.",
          plan: "Tương tác trực tiếp để thiết kế kế hoạch tài chính riêng cho bạn – đơn giản, nhanh gọn và cực kỳ hiệu quả.",
          secure: "Hệ thống độc quyền của chúng tôi vận hành như một \"bộ não AI\" thông minh, tự động nhận diện những thông tin quan trọng nhất cho bạn. Hãy tưởng tượng nó giống như bộ não của bạn vậy — chỉ khác là nó không bao giờ mệt mỏi hay cần 3 ly cà phê để hoạt động mỗi ngày!."
        }
      },
      partners: {
        title: "Tích hợp với những công cụ tốt nhất trên thị trường",
        descriptionParts: [
          "Khám phá các đối tác liên kết với chúng tôi. Không thấy phần mềm bạn đang dùng?",
          { type: "link", text: " Liên hệ với chúng tôi", href: "mailto:contact@yourdomain.com" },
          " và chúng tôi sẽ hỗ trợ tích hợp ngay."
        ],
        left: {
          text: "Shop-Ware giúp bạn tận dụng quy trình siêu tốc để sửa chữa được nhiều xe hơn mỗi tháng.",
          linkText: "Tìm hiểu thêm",
          linkHref: "#"
        },
        right: {
          text: "Tekmetric giúp bạn khai phá tối đa tiềm năng xưởng sửa chữa với quy trình vận hành tinh gọn.",
          linkText: "Tìm hiểu thêm",
          linkHref: "#"
        }
      }
    }
  },
};

const i18n = createI18n({
  legacy: false,
  locale: "vi",
  fallbackLocale: "en",
  messages,
  globalInjection: true,
});

export default i18n;
