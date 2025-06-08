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
    quant: "Quant",
    quantSimulator: "Quant Simulator",
    macroEconomic: "Macro Economic Data",
    marketAnalysis: "Market Analysis",
    finEdu: "Fin Edu",
    quiz: "Quiz",
    course: "Course",
    event: "Event",
    forum: "Forum",
    finAgent: "Fin Agent",
    finData: "Fin Data",
    agent: "Agent",
    pestle: "PESTLE",
    finXpert: "FinXpert",
    accountant: "AI Accountant",
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
      rachel: "I've tried several money apps before, but none felt as intuitive as FinBud. It helped me figure out where my paycheck was going. The AI guidance makes a big difference—it feels personal. Now I've started building savings and even planning for retirement. I finally feel like I'm making smart choices with my money.",
      jane: "I love using FinBud! It's like having a personal financial advisor available 24/7. The insights and tips are incredibly useful and easy to understand.",
      julian: "I was always intimidated by financial planning. Spreadsheets overwhelmed me, and I never knew where to start.FinBud took that stress away with its clean interface and smart AI support. It categorized my spending automatically and gave me goals I could actually reach. After six months of using it, I've paid off two credit cards and started building an emergency fund. I finally feel like I'm in control of my finances instead of the other way around. It's more than an app—it's like having a coach that keeps me accountable. Highly recommend it to anyone feeling stuck or lost with money.",
      amelia: "FinBud's personalized advice was the game-changer I didn't know I needed. It adapts to my financial habits and pushes me gently in the right direction. From budgeting to investing, every feature feels thoughtful and well-designed. What really surprised me was how much I've learned just by using the app. The daily insights taught me more than any finance blog or YouTube video ever has. My relationship with money has completely shifted—from stress to confidence. FinBud truly empowers users to take charge.",
      marcus: "I used to bounce between multiple finance apps—one for spending, one for saving, another for investments. FinBud brought everything together in one sleek platform. It tracks my goals, shows me real-time progress, and gives advice that actually works. I've reduced unnecessary subscriptions, started a travel fund, and even put money into a Roth IRA. I don't need to be a finance expert anymore. FinBud makes complex decisions feel manageable. This app respects your time and rewards consistency. It's been a game-changer for how I handle money.",
      tyler: "The budgeting tool alone is worth it, but the real-time alerts are what keep me on track. It's like having a financial assistant watching out for me. I never miss a due date anymore.",
      ten: "FinBud doesn't just show you numbers—it explains them. I get clear, actionable tips that help me adjust my habits without guilt. It feels like I'm getting smarter about money every day. Even my partner started using it after seeing my progress. It's been a financial glow-up for both of us.",
      claire: "Tracking expenses used to stress me out, but FinBud simplified it all. The daily summaries help me stay accountable without being overwhelmed. I love how it celebrates milestones—it's motivating. It's the only finance app I've actually stuck with. Definitely recommend for anyone trying to build better habits.",
      sophie: "FinBud gives me confidence in every financial decision I make. It's easy to use and always spot-on with its advice. I've already saved more in 3 months than I did all last year.",
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

    // Goal Page
    connect: 'Connect Your Bank Account',
    totalTransactions: 'Total Transactions',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    accountBalance: 'Account Balance',
    showForecast: 'Show Forecast',
    dailyTransactions: 'Daily Transactions',
    add: 'Add',
    reset: 'Reset',
    noData: 'No transaction data available to display.',
    transactionChart: 'Transaction Chart',
    goals: 'Goals',
    addGoal: 'Add Goal',
    searchGoals: 'Search goals...',
    addNewGoal: 'Add New Goal',
    goalTitle: 'Goal Title',
    description: 'Description (optional)',
    totalNeeded: 'Total Money Needed',
    alreadyHave: 'Money Already Have',
    startDate: 'Start Date',
    endDate: 'End Date',
    category: 'Category',
    newCategory: 'New Category',
    confirmReset: 'Are you sure you want to reset your account balance? This action will delete all your transactions.',
    cancel: 'No',
    confirm: 'Yes',
    addTransaction: 'Add Transaction',
    transactionType: 'Transaction Type',
    transactionDescription: 'Transaction description',
    amount: 'Amount & Currency',
    dateTime: 'Date',
    income: 'Income',
    expense: 'Expense',
    selectType: 'Select type',
    selectCategory: 'Select category',
    action: 'Action',
    edit: 'Edit',
    remove: 'Remove',

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
          "Check out our connected partners. Don't see your software on the list of partners?",
          { type: "link", text: " Drop us a note", href: "mailto:contact@yourdomain.com" },
          " and we'll get them added."
        ],
        left: {
          text: "Shop-Ware enables users to take advantage of their lightning-fast workflows to repair more cars every month.",
          linkText: "Learn more",
          linkHref: "#"
        },
        right: {
          text: "Tekmetric lets you unleash your shop's potential with their streamlined workflow settings.",
          linkText: "Learn more",
          linkHref: "#"
        }
      }
    },

    coursePage: {
      loadingText: "Loading data...",
      errorMessage: "Error loading data: }",
      retryButton: "Try Again",
      categories: {
        beginners: "FOR BEGINNERS",
        investments: "EFFECTIVE INVESTMENTS", 
        fundamental: "FUNDAMENTAL ANALYSIS",
        technical: "TECHNICAL ANALYSIS"
      },
      viewMore: "View More",
      views: "views",
      emptyState: "No articles available in this category.",
      botMessage: "Hello there! 👋<br><br>This is FinBud financial learning hub. Here you can:<br><br>📚 Learn investment knowledge from basic to advanced<br>💡 Discover effective investment strategies<br>📊 Dive deep into fundamental and technical analysis<br><br>Explore articles by topic or search for content you are interested in!"
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
        4: "Q4"
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
        12: "December"
      },
      header: {
        "Chỉ tiêu": "Indicator",
        "Đơn vị tính": "Unit",
        "Số liệu mới nhất": "Latest Data",
        "Giá trị": "Value",
        "Đồ thị": "Chart",
        "STT": "No."
      },
      unit: {
        "%": "%",
        "Tỷ VNĐ": "Billion VND",
        "Tỷ USD": "Billion USD",
        "Triệu USD": "Million USD",
        "VNĐ/USD": "VND/USD",
        "Triệu người": "Million People",
        "Nghìn đồng": "Thousand Dong",
        "USD": "USD"
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
        "Tỷ lệ thất nghiệp thành thị": "Urban Unemployment Rate"
      },
      "GDP": {
        "Quý": {
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
        "Năm": {
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
          "GDP theo giá hiện hành (ước tính)": "GDP at Current Prices (Estimated)",
          "GDP theo giá cố định (2010)": "GDP at Constant Prices (2010)",
          "GDP theo giá cố định (2010) (ước tính)": "GDP at Constant Prices (2010) (Estimated)",
          "GNI theo giá hiện tại": "GNI at Current Prices"
        }        
      },
      "CPI": {
        "Tháng": {
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
          "Đồ dùng và dịch vụ khác": "Other Goods and Services"
        },
        "Năm": {
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
          "Tháng 12 năm báo cáo so với tháng 12 năm trước": "December of the Reporting Year Compared to December of the Previous Year"
        }        
      },
      "Xuất-Nhập khẩu": {
        "Tháng": {
          "Xuất khẩu": "Exports",
          "Tổng trị giá Xuất khẩu": "Total Export Value (Million USD)",
          "Giày da": "Footwear (Leather)",
          "Dệt may": "Textiles",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Thủy sản": "Seafood",
          "Dầu thô": "Crude Oil",
          "Gạo": "Rice",
          "Café": "Coffee",
          "Điện tử máy tính": "Electronics and Computers",
          "Máy móc thiết bị": "Machinery and Equipment",
          "Nhập khẩu": "Imports",
          "Tổng trị giá Nhập khẩu": "Total Import Value (Million USD)",
          "Điện tử, máy tính và linh kiện": "Electronics, Computers, and Components",
          "Máy móc thiết bị, phụ tùng": "Machinery and Equipment, Parts",
          "Xăng dầu": "Petroleum Products",
          "Hóa chất": "Chemicals",
          "Sản phẩm hóa chất": "Chemical Products",
          "Sắt thép": "Iron and Steel",
          "Vải": "Fabric",
          "Ô tô": "Automobiles",
          "Thức ăn gia súc": "Animal Feed"
        },
        "Năm": {
          "Xuất khẩu": "Exports",
          "Hoa Kỳ": "United States",
          "Nhật Bản": "Japan",
          "Australia": "Australia",
          "Trung Quốc": "China",
          "Singapore": "Singapore",
          "Đức": "Germany",
          "Anh": "United Kingdom",
          "Malaysia": "Malaysia",
          "Thái Lan": "Thailand",
          "Pháp": "France",
          "Sản phẩm dệt may": "Textile Products",
          "Thủy sản": "Seafood",
          "Gạo": "Rice (Thousand Tons)",
          "Café": "Coffee (Thousand Tons)",
          "Cao su": "Rubber (Thousand Tons)",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Than đá": "Coal",
          "Tôm đông lạnh": "Frozen Shrimp",
          "Lương thực, Thực phẩm và động vật sống": "Grains, Food and Live Animals",
          "Đồ uống và thuốc lá": "Beverages and Tobacco",
          "NVL thô, không dùng để ăn, trừ nhiên liệu": "Raw Materials (Non-food, Excluding Fuel)",
          "Nhiêu liệu, dầu mỡ nhờn và vật liệu liên quan": "Lubricants, Oils, and Related Materials",
          "Dầu, mỡ, chất béo, sáp động, thực vật": "Oils, Fats, Waxes (Animal, Vegetable)",
          "Hoá chất và sản phẩm liên quan": "Chemicals and Related Products",
          "Hàng chế biến phân loại theo nguyên liệu": "Processed Goods Classified by Raw Materials",
          "Máy móc, phương tiện vận tải và phụ tùng": "Machinery, Transport Equipment and Parts",
          "Hàng chế biến khác": "Other Processed Goods",
          "Háng hóa không thuộc các nhóm trên": "Goods Not Classified in Above Groups",
          "Giá trị xuất khẩu (USD giá hiện hành)": "Export Value (USD at Current Prices)",
          "Nhập khẩu": "Imports",
          "Hàn Quốc": "South Korea",
          "Hồng Kông": "Hong Kong",
          "Indonesia": "Indonesia",
          "Nguyên liệu thô, không dùng để ăn, trừ nhiên liệu": "Raw Materials (Non-food, Excluding Fuel)",
          "Máy móc, phương tiện vận tải": "Machinery, Transport Equipment",
          "Giá trị nhập khẩu (USD giá hiện hành)": "Import Value (USD at Current Prices)"
        }        
      },
      "FDI": {
        "Tháng": {
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Billion USD)",
          "Giải ngân": "Disbursed FDI"
        },
        "Năm": {
          "Quốc gia": "Country",
          "Tính lũy kế đến thời điểm hiện tại": "Cumulative to Date (Billion USD)",
          "Theo vùng lãnh thổ": "By Territory (Billion USD)",
          "Lĩnh vực": "Sector",
          "Sản xuất": "Manufacturing (Billion USD)",
          "Bất động sản": "Real Estate (Billion USD)",
          "Nông nghiệp": "Agriculture (Billion USD)",
          "Dịch vụ": "Services (Billion USD)",
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Million USD)",
          "Giải ngân": "Disbursed FDI"
        }        
      }
    },
    marketAnalysisPage: {
      "marketAnalysisTitle": "Market Analysis",
      "All": "All",
      "Positive": "Positive",
      "Negative": "Negative",
      "Neutral": "Neutral",
      "LastUpdated": "Last Updated",
      "Insight": "Insight",
      "Today": "Today",
      "This Week": "This Week",
      "This Month": "This Month",
      "mentions": "Mentions",
      "marketAnalysis": {
        "Securities Company": "Securities Company",
        "Press": "Press",
        "Expert Community": "Expert Community"
      },
      "trend": {
        "title": "Trend",
        "topic": "Topic",
        "categories": {
          "All": "All",
          "Securities": "Securities",
          "Economy": "Economy",
          "Industry": "Industry",
          "Other": "Other"
        },
      },
      "AINews": "AI News",
      "insight": {
        "Market Analysis": "Market Analysis",
        "Assessment": "Assessment",
        "Details": "Details",
        "Source": "Source",
        "Analysis": "Analysis",
        "Reference": "Reference",
        "Market Sentiment Over Time": "Market Sentiment Over Time",
      }
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
      Indicator:"Indicator",
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
      GraphPrice:"Price ($)",
      TimeStep: "Time Step",
      Date: "Date",
      Value: "Value",
      MonteCarloSimulation: " Monte Carlo Simulation",
      simulationChatBot:`
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
    FundLetter:"Fund Letter",
    FinData: "Fin Data",
    ProductComparison: "Product Comparison",

    // Financial Dashboard translations
    financialDashboard: 'Financial Dashboard',
    trackTransactionsGoals: 'Track Transactions and Goals',
    currentBalance: 'Current Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpense: 'Monthly Expense',
    goalsAchieved: 'Goals Achieved',
    thisMonth: 'This Month',
    transactions: 'Transactions',
    completion: 'Completion',
    smartInsights: 'Smart Insights',
    aiPoweredAnalysis: 'AI-Powered Analysis',
    allCategories: 'All Categories',
    allStatus: 'All Status',
    active: 'Active',
    completed: 'Completed',
    overdue: 'Overdue',
    sortByProgress: 'Sort by Progress',
    sortByEndDate: 'Sort by End Date',
    sortByAmount: 'Sort by Amount',
    sortByCreated: 'Sort by Created',
    searchGoalsPlaceholder: 'Search Goals...',
    noGoalsFound: 'No goals found',
    createYourFirstGoal: 'Create your first goal to start tracking your financial progress.',

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

    // Course Page
    coursePage: {
      title: "Financial Courses",
      subtitle: "Learn and improve financial knowledge",
      categories: {
        beginners: "For Beginners",
        investments: "Effective Investments", 
        fundamental: "Fundamental Analysis",
        technical: "Technical Analysis"
      },
      views: "views",
      viewMore: "View More",
      loading: "Loading courses...",
      noData: "No courses available",
      readTime: "min read"
    },

    // Market Analysis Page
    marketAnalysisPage: {
      marketAnalysisTitle: "Market Analysis",
      marketAnalysisDescription: "Comprehensive market data and analysis for informed investment decisions",
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
        TechCommunity: "Tech Community"
      },
      insight: {
        Assessment: "Assessment",
        Details: "Details",
        Source: "Source",
        Analysis: "Analysis",
        Reference: "Reference"
      },
      trend: {
        title: "Market Trends",
        topic: "Topic",
        categories: {
          All: "All",
          Securities: "Securities",
          Economy: "Economy", 
          Industry: "Industry",
          Other: "Other"
        }
      }
    },

    stockSimulator: {
      pageTitle: "Mô Phỏng Chứng Khoán",
      tabs: {
        investment: "Đầu Tư",
        portfolio: "Danh Mục",
        filters: "Lọc Cổ Phiếu",
        quiz: "Câu Hỏi",
        predictiveCalc: "Tính Toán Dự Đoán"
      },
      trading: {
        quickTrade: "Giao Dịch Nhanh",
        stockSymbol: "Mã Cổ Phiếu",
        stockSymbolPlaceholder: "Nhập mã cổ phiếu (ví dụ: AAPL)",
        quantity: "Số Lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "Xóa"
      },
      account: {
        summary: "Tóm Tắt Tài Khoản",
        balance: "Tổng Số Dư",
        cash: "Tiền Mặt Khả Dụng",
        stocks: "Giá Trị Cổ Phiếu",
        todayChange: "Thay Đổi Hôm Nay"
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
        noHoldings: "Chưa có cổ phiếu nào trong danh mục"
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
        presetSavedMessage: "Bộ lọc \"{name}\" đã được lưu thành công",
        presets: {
          growthStocks: "Cổ Phiếu Tăng Trưởng",
          valueStocks: "Cổ Phiếu Giá Trị",
          dividendStocks: "Cổ Phiếu Cổ Tức",
          largeCap: "Vốn Hóa Lớn",
          smallCap: "Vốn Hóa Nhỏ"
        },
        marketCapOptions: {
          mega: "Siêu Lớn (>$200B)",
          large: "Lớn ($10B-$200B)",
          mid: "Trung Bình ($2B-$10B)",
          small: "Nhỏ ($300M-$2B)",
          micro: "Rất Nhỏ (<$300M)"
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
          telecommunications: "Viễn Thông"
        }
      },
      notifications: {
        orderSuccess: "Lệnh Thành Công",
        buySuccess: "Đã mua thành công {quantity} cổ phiếu {symbol}",
        sellSuccess: "Đã bán thành công {quantity} cổ phiếu {symbol}",
        orderError: "Lệnh Thất Bại",
        networkError: "Lỗi kết nối mạng"
      }
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
        education: "Giáo dục Tài chính"
      },
      thread: {
        replies: "phản hồi",
      views: "lượt xem",
        lastReply: "Phản hồi cuối",
        by: "bởi",
        startThread: "Bắt đầu Chủ đề Mới",
        reply: "Trả lời",
        edit: "Chỉnh sửa",
        delete: "Xóa"
      }
    },

    // Market Data Center
    marketDataCenter: {
      title: "Trung tâm Dữ liệu Thị trường",
      sections: {
        cryptocurrency: "TIỀN ĐIỆN TỬ",
        stock: "CỔ PHIẾU",
        realEstate: "BẤT ĐỘNG SẢN"
      },
      loading: "Đang tải dữ liệu thị trường...",
      error: "Không thể tải dữ liệu thị trường",
      refresh: "Làm mới Dữ liệu",
      lastUpdated: "Cập nhật lần cuối",
      change24h: "Thay đổi 24h",
      marketCap: "Vốn hóa Thị trường",
      volume: "Khối lượng",
      price: "Giá"
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
        flexibleConditions: "Điều kiện linh hoạt"
      },
      table: {
        bank: "Ngân hàng",
        interestRate: "Lãi suất",
        issuanceFee: "Phí phát hành",
        maxLoanTerm: "Thời hạn vay tối đa"
      },
      priorityTexts: {
        highestRate: "lãi suất cao nhất",
        lowestFees: "phí thấp nhất",
        flexibleTerms: "điều kiện linh hoạt nhất"
      }
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
        step4: "Xem xét Cuối cùng"
      }
    },

    // PESTLE Page
    pestlePage: {
      title: "Phân tích PESTLE",
      subtitle: "Phân tích Chính trị, Kinh tế, Xã hội, Công nghệ, Pháp lý, Môi trường",
      categories: {
        political: "Chính trị",
        economic: "Kinh tế",
        social: "Xã hội", 
        technological: "Công nghệ",
        legal: "Pháp lý",
        environmental: "Môi trường"
      },
      analysis: "Phân tích",
      impact: "Tác động",
      risk: "Mức độ Rủi ro",
      opportunity: "Cơ hội",
      loading: "Đang tải phân tích PESTLE...",
      noData: "Không có dữ liệu phân tích"
    },

    // Quant Analysis Page
    quantAnalysisPage: {
      title: "Phân tích định lượng",
      subtitle: "Công cụ phân tích và trực quan hóa thị trường nâng cao",
      sections: {
        marketAnalysis: "Phân tích thị trường",
        dashboard: "Bảng điều khiển thị trường",
        heatmap: "Bản đồ nhiệt thị trường", 
        monteCarlo: "Mô phỏng Monte Carlo"
      },
      interpretation: "Giải thích phân tích thị trường",
      loading: "Đang tải dữ liệu thị trường...",
      loadingHeatmap: "Đang tải dữ liệu bản đồ nhiệt...",
      loadingMonteCarlo: "Đang tải mô phỏng Monte Carlo...",
      controls: {
        indicator: "Chỉ báo",
        period: "Khoảng thời gian",
        returnType: "Loại lợi nhuận",
        dataSource: "Nguồn dữ liệu"
      }
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
      indicatorAndReturnChatBot: "Indicator and return from chatbot"
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
      topInvestorsIntro: "Đây là một số nhà đầu tư hàng đầu mà bạn có thể quan tâm:",
      from: "từ",
      portfolioValue: "Giá trị Danh mục",
      avgHoldingPeriod: "Thời gian Nắm giữ Trung bình",
      learnMorePrompt: "Bạn có muốn tìm hiểu thêm về chiến lược đầu tư của họ không?"
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
      marketHoursPrompt: "Thị trường đang mở! Bạn có muốn xem phân tích mới nhất?",
      portfolioCheckPrompt: "Đã lâu rồi bạn chưa kiểm tra danh mục đầu tư. Cần hỗ trợ gì không?",
      budgetReminderPrompt: "Cuối tháng rồi! Bạn có muốn xem lại ngân sách và chi tiêu không?",
      suggestions: {
        title: "Gợi ý Nhanh",
        investment: "Lời khuyên đầu tư",
        portfolio: "Phân tích danh mục",
        market: "Thông tin thị trường",
        budgeting: "Mẹo lập ngân sách",
        risk: "Quản lý rủi ro",
        trading: "Chiến lược giao dịch"
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
      poweredBy: "Được hỗ trợ bởi FinBud AI"
    },

    // Course Page
    coursePage: {
      title: "Khóa học Tài chính",
      subtitle: "Học hỏi và nâng cao kiến thức tài chính",
      categories: {
        beginners: "Dành cho người mới bắt đầu",
        investments: "Đầu tư hiệu quả",
        fundamental: "Phân tích cơ bản", 
        technical: "Phân tích kỹ thuật"
      },
      views: "lượt xem",
      viewMore: "Xem thêm",
      loading: "Đang tải khóa học...",
      noData: "Không có khóa học nào",
      readTime: "phút đọc"
    },

    // Market Analysis Page
    marketAnalysisPage: {
      marketAnalysisTitle: "Phân tích Thị trường",
      marketAnalysisDescription: "Dữ liệu và phân tích thị trường toàn diện cho quyết định đầu tư sáng suốt",
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
        TechCommunity: "Cộng đồng Công nghệ"
      },
      insight: {
        Assessment: "Đánh giá",
        Details: "Chi tiết",
        Source: "Nguồn",
        Analysis: "Phân tích", 
        Reference: "Tham khảo"
      },
      trend: {
        title: "Xu hướng Thị trường",
        topic: "Chủ đề",
        categories: {
          All: "Tất cả",
          Securities: "Chứng khoán",
          Economy: "Kinh tế",
          Industry: "Ngành nghề",
          Other: "Khác"
        }
      }
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
      indicatorAndReturnChatBot: "Phân tích chỉ báo và lợi nhuận có sẵn"
    },

    // Stock Simulator
    stockSimulator: {
      pageTitle: "Mô Phỏng Chứng Khoán",
      tabs: {
        investment: "Đầu Tư",
        portfolio: "Danh Mục",
        filters: "Bộ Lọc Cổ Phiếu", 
        quiz: "Câu Hỏi",
        predictiveCalc: "Máy Tính Dự Đoán"
      },
      trading: {
        quickTrade: "Giao Dịch Nhanh",
        stockSymbol: "Mã Cổ Phiếu",
        stockSymbolPlaceholder: "Nhập mã cổ phiếu (ví dụ: AAPL)",
        quantity: "Số Lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "Xóa"
      },
      account: {
        summary: "Tóm Tắt Tài Khoản",
        balance: "Tổng Số Dư",
        cash: "Tiền Mặt Khả Dụng",
        stocks: "Giá Trị Cổ Phiếu",
        todayChange: "Thay Đổi Hôm Nay"
      },
      portfolio: {
        totalPortfolio: "Tổng Giá Trị Danh Mục",
        holdings: "Cổ Phiếu Sở Hữu",
        loading: "Đang tải danh mục...",
        noHoldings: "Không có cổ phiếu nào",
        table: {
          symbol: "Mã",
          shares: "Shares",
          currentPrice: "Current Price",
          marketValue: "Market Value",
          gainLoss: "Gain/Loss",
          change: "Change %"
        }
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
        presetSavedMessage: "Preset \"{name}\" saved successfully",
        presets: {
          growthStocks: "Growth Stocks",
          valueStocks: "Value Stocks", 
          dividendStocks: "Dividend Stocks",
          largeCap: "Large Cap",
          smallCap: "Small Cap"
        },
        marketCapOptions: {
          mega: "Mega Cap (>$200B)",
          large: "Large Cap ($10B-$200B)",
          mid: "Mid Cap ($2B-$10B)",
          small: "Small Cap ($300M-$2B)",
          micro: "Micro Cap (<$300M)"
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
          telecommunications: "Telecommunications"
        }
      },
      quiz: {
        title: "Stock Market Quiz",
        loading: "Loading quiz..."
      },
      notifications: {
        orderSuccess: "Order Successful",
        buySuccess: "Successfully bought {quantity} shares of {symbol}",
        sellSuccess: "Successfully sold {quantity} shares of {symbol}",
        orderError: "Order Failed",
        networkError: "Network error occurred"
      }
    },

    // Accountant Page
    accountantPage: {
      title: "AI Financial Intelligence",
      subtitle: "Smart financial document analysis with advanced AI technology. Optimize taxes, ensure compliance, and accurate financial forecasting.",
      hero: {
        title: "AI Financial Intelligence",
        subtitle: "Smart financial document analysis with advanced AI technology. Optimize taxes, ensure compliance, and accurate financial forecasting.",
        stats: {
          analyzed: "Documents Analyzed",
          savings: "Tax Savings",
          compliance: "Compliance Rate"
        }
      },

      // Upload Section
      upload: {
        title: "Document Analysis Center",
        subtitle: "Upload financial documents to receive instant AI insights",
        dragDrop: "Drag & Drop Documents",
        formats: "Supports PDF, Excel (.xlsx, .xls), CSV",
        chooseFiles: "Choose Files",
        quickStart: "Quick Templates"
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
        taxDesc: "Tax Planning & Compliance"
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
          year: "This Year"
        },
        forecastPeriods: {
          next_month: "Next Month",
          next_quarter: "Next Quarter", 
          next_year: "Next Year"
        },
        metrics: {
          revenue: "Revenue",
          profit: "Profit",
          strong_growth: "Strong Growth",
          sustained_growth: "Sustained Growth",
          exponential_growth: "Exponential Growth"
        }
      },

      // Financial Metrics
      metrics: {
        revenue: "Total Revenue",
        expenses: "Total Expenses", 
        profit: "Net Profit",
        margin: "Profit Margin"
      },

      // AI Insights
      insights: {
        viewDetails: "View Details",
        revenue_growth: "Revenue Growth Opportunity",
        revenue_growthDesc: "Q4 revenue trends show 23% growth potential in tech services segment",
        cost_optimization: "Cost Optimization Alert",
        cost_optimizationDesc: "Office expenses up 18% this quarter. Consider renegotiating vendor contracts",
        cashflow_prediction: "Cash Flow Prediction", 
        cashflow_predictionDesc: "Based on current trends, expect positive cash flow improvement next quarter",
        impact: {
          high: "High Impact",
          medium: "Medium Impact",
          low: "Low Impact"
        }
      },

      // Expenses
      expenses: {
        operations: "Operations",
        marketing: "Marketing",
        technology: "Technology", 
        personnel: "Personnel"
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
          "review required": "Review Required"
        }
      },

      // Tax Optimization
      tax: {
        savings: "Potential Savings",
        depreciation: "Depreciation Optimization", 
        depreciationDesc: "Accelerate equipment depreciation to reduce current year tax liability",
        expenses: "Maximize Business Expenses",
        expensesDesc: "Identify missed deductible expenses from travel and entertainment",
        rd_credit: "R&D Tax Credit",
        rd_creditDesc: "Qualify for research and development tax incentives",
        actions: {
          implement: "Implement Now",
          review: "Review & Apply",
          consult: "Consult Expert"
        }
      },

      // Chatbot
      chatbot: {
        title: "FinXpert Assistant",
        placeholder: "Ask me anything about financial analysis...",
        greeting: "Hello! I'm your AI Financial Assistant. How can I help you today?",
        options: {
          upload: "Upload Documents",
          insights: "Explain Insights", 
          tax: "Tax Optimization",
          compliance: "Check Compliance"
        },
        responses: {
          upload: "I can help you analyze various financial documents like income statements, balance sheets, cash flow reports, and tax documents. Just drag and drop your files to the upload area!",
          insights: "I provide AI-powered insights on financial performance, growth opportunities, cost optimization, and forecasting. What specific area would you like me to explain?",
          tax: "I can help identify tax optimization strategies, available tax credits, depreciation maximization, and tax reduction opportunities. What type of optimization interests you?", 
          compliance: "I perform comprehensive compliance checks for financial reporting standards, tax requirements, and industry regulations. What type of compliance do you need to verify?"
        }
      },

      // Help & Processing
      help: {
        tooltip: "Need help? Ask our AI assistant!",
        processing: "Processing Financial Data"
      },

      // Notifications  
      notifications: {
        title: "Financial Notifications",
        taxDeadline: "Tax deadline in {days} days",
        complianceAlert: "Compliance alert: Audit trail needs review",
        insightUpdate: "New insight: 23% growth opportunity detected",
        reportReady: "Analysis report completed",
        markAllRead: "Mark All as Read",
        viewAll: "View All"
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
        smartAlerts: "Smart Alerts"
      },

      // Export Options
      export: {
        title: "Export Report",
        pdf: "Export PDF",
        excel: "Export Excel",
        powerpoint: "Export PowerPoint", 
        email: "Send via Email",
        share: "Share Link",
        schedule: "Schedule Report"
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
        critical: "Critical"
      },

      // Performance Metrics
      performance: {
        roi: "Return on Investment",
        growth: "Growth Rate",
        efficiency: "Efficiency Score",
        profitability: "Profitability"
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
    riskAnalysis: "Trung tâm dữ liệu thị trường",
    investmentCalculator: "Tính toán Đầu tư",
    mortgageCalculator: "Tính toán Thế chấp",
    superInvestors: "Đầu tư tài chính",
    finInvest: "Fin Đầu tư",
    simulator: "Đầu Tư Mô Phỏng",
    quant: "Định lượng",
    quantSimulator: "Mô phỏng Định lượng",
    macroEconomic: "Kinh Tế Vĩ Mô",
    marketAnalysis: "Phân tích Thị trường",
    finEdu: "Fin Giáo dục",
    quiz: "Quiz",
    course: "Khoá học",
    event: "Sự kiện",
    forum: "Forum",
    finAgent: "Fin Tài chính",
    agent: "Agent",
    pestle: "PESTLE",
    finXpert: "FinXpert",
    accountant: "Kế toán AI",
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
        subtitle: "Phân tích tài liệu tài chính thông minh với công nghệ AI tiên tiến. Tối ưu hóa thuế, tuân thủ pháp luật và dự báo tài chính chính xác.",
        stats: {
          analyzed: "Tài liệu đã phân tích",
          savings: "Tiết kiệm thuế", 
          compliance: "Tuân thủ"
        }
      },

      // Upload Section
      upload: {
        title: "Trung Tâm Phân Tích Tài Liệu",
        subtitle: "Tải lên tài liệu tài chính để nhận insights AI ngay lập tức",
        dragDrop: "Kéo & Thả Tài Liệu",
        formats: "Hỗ trợ PDF, Excel (.xlsx, .xls), CSV",
        chooseFiles: "Chọn File",
        quickStart: "Mẫu Nhanh"
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
        taxDesc: "Lập kế hoạch & tuân thủ thuế"
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
          year: "Năm Này"
        },
        forecastPeriods: {
          next_month: "Tháng Tới",
          next_quarter: "Quý Tới",
          next_year: "Năm Tới"
        },
        metrics: {
          revenue: "Doanh Thu",
          profit: "Lợi Nhuận",
          strong_growth: "Tăng Trưởng Mạnh",
          sustained_growth: "Tăng Trưởng Bền Vững",
          exponential_growth: "Tăng Trưởng Vượt Trội"
        }
      },

      // Financial Metrics
      metrics: {
        revenue: "Tổng Doanh Thu",
        expenses: "Tổng Chi Phí",
        profit: "Lợi Nhuận Ròng",
        margin: "Tỷ Lệ Lợi Nhuận"
      },

      // AI Insights
      insights: {
        viewDetails: "Xem Chi Tiết",
        revenue_growth: "Cơ Hội Tăng Trưởng Doanh Thu",
        revenue_growthDesc: "Xu hướng doanh thu Q4 cho thấy tiềm năng tăng trưởng 23% ở mảng dịch vụ công nghệ",
        cost_optimization: "Cảnh Báo Tối Ưu Chi Phí",
        cost_optimizationDesc: "Chi phí văn phòng tăng 18% quý này. Nên cân nhắc đàm phán lại hợp đồng nhà cung cấp",
        cashflow_prediction: "Dự Báo Dòng Tiền",
        cashflow_predictionDesc: "Dựa trên xu hướng hiện tại, dự kiến cải thiện dòng tiền tích cực quý tới",
        impact: {
          high: "Tác Động Cao",
          medium: "Tác Động Trung Bình", 
          low: "Tác Động Thấp"
        }
      },

      // Expenses
      expenses: {
        operations: "Vận Hành",
        marketing: "Marketing",
        technology: "Công Nghệ",
        personnel: "Nhân Sự"
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
          "review required": "Cần Xem Xét"
        }
      },

      // Tax Optimization
      tax: {
        savings: "Tiết Kiệm Tiềm Năng",
        depreciation: "Tối Ưu Khấu Hao",
        depreciationDesc: "Tăng tốc khấu hao thiết bị để giảm nghĩa vụ thuế năm hiện tại",
        expenses: "Tối Đa Hóa Chi Phí Kinh Doanh",
        expensesDesc: "Xác định chi phí khấu trừ bị bỏ lỡ từ đi lại và giải trí",
        rd_credit: "Tín Dụng Thuế R&D",
        rd_creditDesc: "Đủ điều kiện nhận ưu đãi thuế nghiên cứu và phát triển",
        actions: {
          implement: "Thực Hiện Ngay",
          review: "Xem Xét & Áp Dụng",
          consult: "Tham Vấn Chuyên Gia"
        }
      },

      // Chatbot
      chatbot: {
        title: "Trợ Lý FinXpert",
        placeholder: "Hỏi tôi bất cứ điều gì về phân tích tài chính..."
      },

      // Help & Processing
      help: {
        tooltip: "Cần trợ giúp? Hỏi trợ lý AI của chúng tôi!",
        processing: "Đang Phân Tích Dữ Liệu Tài Chính"
      },

      // Notifications
      notifications: {
        title: "Thông Báo Tài Chính",
        taxDeadline: "Hạn nộp thuế còn {days} ngày",
        complianceAlert: "Cảnh báo tuân thủ: Cần xem xét audit trail",
        insightUpdate: "Insight mới: Cơ hội tăng trưởng 23% được phát hiện",
        reportReady: "Báo cáo phân tích hoàn tất",
        markAllRead: "Đánh dấu tất cả đã đọc",
        viewAll: "Xem tất cả"
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
        smartAlerts: "Cảnh Báo Thông Minh"
      },

      // Export Options
      export: {
        title: "Xuất Báo Cáo",
        pdf: "Xuất PDF",
        excel: "Xuất Excel", 
        powerpoint: "Xuất PowerPoint",
        email: "Gửi qua Email",
        share: "Chia Sẻ Link",
        schedule: "Lên Lịch Báo Cáo"
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
        critical: "Nghiêm Trọng"
      },

      // Performance Metrics
      performance: {
        roi: "Tỷ Suất Hoàn Vốn",
        growth: "Tăng Trưởng",
        efficiency: "Hiệu Quả",
        profitability: "Khả Năng Sinh Lời",
        liquidity: "Thanh Khoản",
        leverage: "Đòn Bẩy"
      }
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
      rachel: "I've tried several money apps before, but none felt as intuitive as FinBud. It helped me figure out where my paycheck was going. The AI guidance makes a big difference—it feels personal. Now I've started building savings and even planning for retirement. I finally feel like I'm making smart choices with my money.",
      jane: "I love using FinBud! It's like having a personal financial advisor available 24/7. The insights and tips are incredibly useful and easy to understand.",
      julian: "I was always intimidated by financial planning. Spreadsheets overwhelmed me, and I never knew where to start.FinBud took that stress away with its clean interface and smart AI support. It categorized my spending automatically and gave me goals I could actually reach. After six months of using it, I've paid off two credit cards and started building an emergency fund. I finally feel like I'm in control of my finances instead of the other way around. It's more than an app—it's like having a coach that keeps me accountable. Highly recommend it to anyone feeling stuck or lost with money.",
      amelia: "FinBud's personalized advice was the game-changer I didn't know I needed. It adapts to my financial habits and pushes me gently in the right direction. From budgeting to investing, every feature feels thoughtful and well-designed. What really surprised me was how much I've learned just by using the app. The daily insights taught me more than any finance blog or YouTube video ever has. My relationship with money has completely shifted—from stress to confidence. FinBud truly empowers users to take charge.",
      marcus: "I used to bounce between multiple finance apps—one for spending, one for saving, another for investments. FinBud brought everything together in one sleek platform. It tracks my goals, shows me real-time progress, and gives advice that actually works. I've reduced unnecessary subscriptions, started a travel fund, and even put money into a Roth IRA. I don't need to be a finance expert anymore. FinBud makes complex decisions feel manageable. This app respects your time and rewards consistency. It's been a game-changer for how I handle money.",
      tyler: "The budgeting tool alone is worth it, but the real-time alerts are what keep me on track. It's like having a financial assistant watching out for me. I never miss a due date anymore.",
      ten: "FinBud doesn't just show you numbers—it explains them. I get clear, actionable tips that help me adjust my habits without guilt. It feels like I'm getting smarter about money every day. Even my partner started using it after seeing my progress. It's been a financial glow-up for both of us.",
      claire: "Tracking expenses used to stress me out, but FinBud simplified it all. The daily summaries help me stay accountable without being overwhelmed. I love how it celebrates milestones—it's motivating. It's the only finance app I've actually stuck with. Definitely recommend for anyone trying to build better habits.",
      sophie: "FinBud gives me confidence in every financial decision I make. It's easy to use and always spot-on with its advice. I've already saved more in 3 months than I did all last year.",
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

    // Goal Page
    connect: 'Connect Your Bank Account',
    totalTransactions: 'Total Transactions',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    accountBalance: 'Account Balance',
    showForecast: 'Show Forecast',
    dailyTransactions: 'Daily Transactions',
    add: 'Add',
    reset: 'Reset',
    noData: 'No transaction data available to display.',
    transactionChart: 'Transaction Chart',
    goals: 'Goals',
    addGoal: 'Add Goal',
    searchGoals: 'Search goals...',
    addNewGoal: 'Add New Goal',
    goalTitle: 'Goal Title',
    description: 'Description (optional)',
    totalNeeded: 'Total Money Needed',
    alreadyHave: 'Money Already Have',
    startDate: 'Start Date',
    endDate: 'End Date',
    category: 'Category',
    newCategory: 'New Category',
    confirmReset: 'Are you sure you want to reset your account balance? This action will delete all your transactions.',
    cancel: 'No',
    confirm: 'Yes',
    addTransaction: 'Add Transaction',
    transactionType: 'Transaction Type',
    transactionDescription: 'Transaction description',
    amount: 'Amount & Currency',
    dateTime: 'Date',
    income: 'Income',
    expense: 'Expense',
    selectType: 'Select type',
    selectCategory: 'Select category',
    action: 'Action',
    edit: 'Edit',
    remove: 'Remove',

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
          "Check out our connected partners. Don't see your software on the list of partners?",
          { type: "link", text: " Drop us a note", href: "mailto:contact@yourdomain.com" },
          " and we'll get them added."
        ],
        left: {
          text: "Shop-Ware enables users to take advantage of their lightning-fast workflows to repair more cars every month.",
          linkText: "Learn more",
          linkHref: "#"
        },
        right: {
          text: "Tekmetric lets you unleash your shop's potential with their streamlined workflow settings.",
          linkText: "Learn more",
          linkHref: "#"
        }
      }
    },

    coursePage: {
      loadingText: "Loading data...",
      errorMessage: "Error loading data: }",
      retryButton: "Try Again",
      categories: {
        beginners: "FOR BEGINNERS",
        investments: "EFFECTIVE INVESTMENTS", 
        fundamental: "FUNDAMENTAL ANALYSIS",
        technical: "TECHNICAL ANALYSIS"
      },
      viewMore: "View More",
      views: "views",
      emptyState: "No articles available in this category.",
      botMessage: "Hello there! 👋<br><br>This is FinBud financial learning hub. Here you can:<br><br>📚 Learn investment knowledge from basic to advanced<br>💡 Discover effective investment strategies<br>📊 Dive deep into fundamental and technical analysis<br><br>Explore articles by topic or search for content you are interested in!"
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
        4: "Q4"
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
        12: "December"
      },
      header: {
        "Chỉ tiêu": "Indicator",
        "Đơn vị tính": "Unit",
        "Số liệu mới nhất": "Latest Data",
        "Giá trị": "Value",
        "Đồ thị": "Chart",
        "STT": "No."
      },
      unit: {
        "%": "%",
        "Tỷ VNĐ": "Billion VND",
        "Tỷ USD": "Billion USD",
        "Triệu USD": "Million USD",
        "VNĐ/USD": "VND/USD",
        "Triệu người": "Million People",
        "Nghìn đồng": "Thousand Dong",
        "USD": "USD"
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
        "Tỷ lệ thất nghiệp thành thị": "Urban Unemployment Rate"
      },
      "GDP": {
        "Quý": {
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
        "Năm": {
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
          "GDP theo giá hiện hành (ước tính)": "GDP at Current Prices (Estimated)",
          "GDP theo giá cố định (2010)": "GDP at Constant Prices (2010)",
          "GDP theo giá cố định (2010) (ước tính)": "GDP at Constant Prices (2010) (Estimated)",
          "GNI theo giá hiện tại": "GNI at Current Prices"
        }        
      },
      "CPI": {
        "Tháng": {
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
          "Đồ dùng và dịch vụ khác": "Other Goods and Services"
        },
        "Năm": {
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
          "Tháng 12 năm báo cáo so với tháng 12 năm trước": "December of the Reporting Year Compared to December of the Previous Year"
        }        
      },
      "Xuất-Nhập khẩu": {
        "Tháng": {
          "Xuất khẩu": "Exports",
          "Tổng trị giá Xuất khẩu": "Total Export Value (Million USD)",
          "Giày da": "Footwear (Leather)",
          "Dệt may": "Textiles",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Thủy sản": "Seafood",
          "Dầu thô": "Crude Oil",
          "Gạo": "Rice",
          "Café": "Coffee",
          "Điện tử máy tính": "Electronics and Computers",
          "Máy móc thiết bị": "Machinery and Equipment",
          "Nhập khẩu": "Imports",
          "Tổng trị giá Nhập khẩu": "Total Import Value (Million USD)",
          "Điện tử, máy tính và linh kiện": "Electronics, Computers, and Components",
          "Máy móc thiết bị, phụ tùng": "Machinery and Equipment, Parts",
          "Xăng dầu": "Petroleum Products",
          "Hóa chất": "Chemicals",
          "Sản phẩm hóa chất": "Chemical Products",
          "Sắt thép": "Iron and Steel",
          "Vải": "Fabric",
          "Ô tô": "Automobiles",
          "Thức ăn gia súc": "Animal Feed"
        },
        "Năm": {
          "Xuất khẩu": "Exports",
          "Hoa Kỳ": "United States",
          "Nhật Bản": "Japan",
          "Australia": "Australia",
          "Trung Quốc": "China",
          "Singapore": "Singapore",
          "Đức": "Germany",
          "Anh": "United Kingdom",
          "Malaysia": "Malaysia",
          "Thái Lan": "Thailand",
          "Pháp": "France",
          "Sản phẩm dệt may": "Textile Products",
          "Thủy sản": "Seafood",
          "Gạo": "Rice (Thousand Tons)",
          "Café": "Coffee (Thousand Tons)",
          "Cao su": "Rubber (Thousand Tons)",
          "Gỗ và sản phẩm gỗ": "Wood and Wood Products",
          "Than đá": "Coal",
          "Tôm đông lạnh": "Frozen Shrimp",
          "Lương thực, Thực phẩm và động vật sống": "Grains, Food and Live Animals",
          "Đồ uống và thuốc lá": "Beverages and Tobacco",
          "NVL thô, không dùng để ăn, trừ nhiên liệu": "Raw Materials (Non-food, Excluding Fuel)",
          "Nhiêu liệu, dầu mỡ nhờn và vật liệu liên quan": "Lubricants, Oils, and Related Materials",
          "Dầu, mỡ, chất béo, sáp động, thực vật": "Oils, Fats, Waxes (Animal, Vegetable)",
          "Hoá chất và sản phẩm liên quan": "Chemicals and Related Products",
          "Hàng chế biến phân loại theo nguyên liệu": "Processed Goods Classified by Raw Materials",
          "Máy móc, phương tiện vận tải và phụ tùng": "Machinery, Transport Equipment and Parts",
          "Hàng chế biến khác": "Other Processed Goods",
          "Háng hóa không thuộc các nhóm trên": "Goods Not Classified in Above Groups",
          "Giá trị xuất khẩu (USD giá hiện hành)": "Export Value (USD at Current Prices)",
          "Nhập khẩu": "Imports",
          "Hàn Quốc": "South Korea",
          "Hồng Kông": "Hong Kong",
          "Indonesia": "Indonesia",
          "Nguyên liệu thô, không dùng để ăn, trừ nhiên liệu": "Raw Materials (Non-food, Excluding Fuel)",
          "Máy móc, phương tiện vận tải": "Machinery, Transport Equipment",
          "Giá trị nhập khẩu (USD giá hiện hành)": "Import Value (USD at Current Prices)"
        }        
      },
      "FDI": {
        "Tháng": {
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Billion USD)",
          "Giải ngân": "Disbursed FDI"
        },
        "Năm": {
          "Quốc gia": "Country",
          "Tính lũy kế đến thời điểm hiện tại": "Cumulative to Date (Billion USD)",
          "Theo vùng lãnh thổ": "By Territory (Billion USD)",
          "Lĩnh vực": "Sector",
          "Sản xuất": "Manufacturing (Billion USD)",
          "Bất động sản": "Real Estate (Billion USD)",
          "Nông nghiệp": "Agriculture (Billion USD)",
          "Dịch vụ": "Services (Billion USD)",
          "Tổng FDI": "Total FDI",
          "Đăng ký": "Registered FDI (Million USD)",
          "Giải ngân": "Disbursed FDI"
        }        
      }
    },
    marketAnalysisPage: {
      "marketAnalysisTitle": "Market Analysis",
      "All": "All",
      "Positive": "Positive",
      "Negative": "Negative",
      "Neutral": "Neutral",
      "LastUpdated": "Last Updated",
      "Insight": "Insight",
      "Today": "Today",
      "This Week": "This Week",
      "This Month": "This Month",
      "mentions": "Mentions",
      "marketAnalysis": {
        "Securities Company": "Securities Company",
        "Press": "Press",
        "Expert Community": "Expert Community"
      },
      "trend": {
        "title": "Trend",
        "topic": "Topic",
        "categories": {
          "All": "All",
          "Securities": "Securities",
          "Economy": "Economy",
          "Industry": "Industry",
          "Other": "Other"
        },
      },
      "AINews": "AI News",
      "insight": {
        "Market Analysis": "Market Analysis",
        "Assessment": "Assessment",
        "Details": "Details",
        "Source": "Source",
        "Analysis": "Analysis",
        "Reference": "Reference",
        "Market Sentiment Over Time": "Market Sentiment Over Time",
      }
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
      Indicator:"Indicator",
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
      GraphPrice:"Price ($)",
      TimeStep: "Time Step",
      Date: "Date",
      Value: "Value",
      MonteCarloSimulation: " Monte Carlo Simulation",
      simulationChatBot:`
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
    FundLetter:"Fund Letter",
    FinData: "Fin Data",
    ProductComparison: "Product Comparison",

    // Financial Dashboard translations
    financialDashboard: 'Financial Dashboard',
    trackTransactionsGoals: 'Track Transactions and Goals',
    currentBalance: 'Current Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpense: 'Monthly Expense',
    goalsAchieved: 'Goals Achieved',
    thisMonth: 'This Month',
    transactions: 'Transactions',
    completion: 'Completion',
    smartInsights: 'Smart Insights',
    aiPoweredAnalysis: 'AI-Powered Analysis',
    allCategories: 'All Categories',
    allStatus: 'All Status',
    active: 'Active',
    completed: 'Completed',
    overdue: 'Overdue',
    sortByProgress: 'Sort by Progress',
    sortByEndDate: 'Sort by End Date',
    sortByAmount: 'Sort by Amount',
    sortByCreated: 'Sort by Created',
    searchGoalsPlaceholder: 'Search Goals...',
    noGoalsFound: 'No goals found',
    createYourFirstGoal: 'Create your first goal to start tracking your financial progress.',

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

    // Course Page
    coursePage: {
      title: "Financial Courses",
      subtitle: "Learn and improve financial knowledge",
      categories: {
        beginners: "For Beginners",
        investments: "Effective Investments", 
        fundamental: "Fundamental Analysis",
        technical: "Technical Analysis"
      },
      views: "views",
      viewMore: "View More",
      loading: "Loading courses...",
      noData: "No courses available",
      readTime: "min read"
    },

    // Market Analysis Page
    marketAnalysisPage: {
      marketAnalysisTitle: "Market Analysis",
      marketAnalysisDescription: "Comprehensive market data and analysis for informed investment decisions",
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
        TechCommunity: "Tech Community"
      },
      insight: {
        Assessment: "Assessment",
        Details: "Details",
        Source: "Source",
        Analysis: "Analysis",
        Reference: "Reference"
      },
      trend: {
        title: "Market Trends",
        topic: "Topic",
        categories: {
          All: "All",
          Securities: "Securities",
          Economy: "Economy", 
          Industry: "Industry",
          Other: "Other"
        }
      }
    },

    stockSimulator: {
      pageTitle: "Mô Phỏng Chứng Khoán",
      tabs: {
        investment: "Đầu Tư",
        portfolio: "Danh Mục",
        filters: "Lọc Cổ Phiếu",
        quiz: "Câu Hỏi",
        predictiveCalc: "Tính Toán Dự Đoán"
      },
      trading: {
        quickTrade: "Giao Dịch Nhanh",
        stockSymbol: "Mã Cổ Phiếu",
        stockSymbolPlaceholder: "Nhập mã cổ phiếu (ví dụ: AAPL)",
        quantity: "Số Lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "Xóa"
      },
      account: {
        summary: "Tóm Tắt Tài Khoản",
        balance: "Tổng Số Dư",
        cash: "Tiền Mặt Khả Dụng",
        stocks: "Giá Trị Cổ Phiếu",
        todayChange: "Thay Đổi Hôm Nay"
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
        noHoldings: "Chưa có cổ phiếu nào trong danh mục"
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
        presetSavedMessage: "Bộ lọc \"{name}\" đã được lưu thành công",
        presets: {
          growthStocks: "Cổ Phiếu Tăng Trưởng",
          valueStocks: "Cổ Phiếu Giá Trị",
          dividendStocks: "Cổ Phiếu Cổ Tức",
          largeCap: "Vốn Hóa Lớn",
          smallCap: "Vốn Hóa Nhỏ"
        },
        marketCapOptions: {
          mega: "Siêu Lớn (>$200B)",
          large: "Lớn ($10B-$200B)",
          mid: "Trung Bình ($2B-$10B)",
          small: "Nhỏ ($300M-$2B)",
          micro: "Rất Nhỏ (<$300M)"
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
          telecommunications: "Viễn Thông"
        }
      },
      notifications: {
        orderSuccess: "Lệnh Thành Công",
        buySuccess: "Đã mua thành công {quantity} cổ phiếu {symbol}",
        sellSuccess: "Đã bán thành công {quantity} cổ phiếu {symbol}",
        orderError: "Lệnh Thất Bại",
        networkError: "Lỗi kết nối mạng"
      }
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
        education: "Giáo dục Tài chính"
      },
      thread: {
        replies: "phản hồi",
      views: "lượt xem",
        lastReply: "Phản hồi cuối",
        by: "bởi",
        startThread: "Bắt đầu Chủ đề Mới",
        reply: "Trả lời",
        edit: "Chỉnh sửa",
        delete: "Xóa"
      }
    },

    // Market Data Center
    marketDataCenter: {
      title: "Trung tâm Dữ liệu Thị trường",
      sections: {
        cryptocurrency: "TIỀN ĐIỆN TỬ",
        stock: "CỔ PHIẾU",
        realEstate: "BẤT ĐỘNG SẢN"
      },
      loading: "Đang tải dữ liệu thị trường...",
      error: "Không thể tải dữ liệu thị trường",
      refresh: "Làm mới Dữ liệu",
      lastUpdated: "Cập nhật lần cuối",
      change24h: "Thay đổi 24h",
      marketCap: "Vốn hóa Thị trường",
      volume: "Khối lượng",
      price: "Giá"
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
        flexibleConditions: "Điều kiện linh hoạt"
      },
      table: {
        bank: "Ngân hàng",
        interestRate: "Lãi suất",
        issuanceFee: "Phí phát hành",
        maxLoanTerm: "Thời hạn vay tối đa"
      },
      priorityTexts: {
        highestRate: "lãi suất cao nhất",
        lowestFees: "phí thấp nhất",
        flexibleTerms: "điều kiện linh hoạt nhất"
      }
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
        step4: "Xem xét Cuối cùng"
      }
    },

    // PESTLE Page
    pestlePage: {
      title: "Phân tích PESTLE",
      subtitle: "Phân tích Chính trị, Kinh tế, Xã hội, Công nghệ, Pháp lý, Môi trường",
      categories: {
        political: "Chính trị",
        economic: "Kinh tế",
        social: "Xã hội", 
        technological: "Công nghệ",
        legal: "Pháp lý",
        environmental: "Môi trường"
      },
      analysis: "Phân tích",
      impact: "Tác động",
      risk: "Mức độ Rủi ro",
      opportunity: "Cơ hội",
      loading: "Đang tải phân tích PESTLE...",
      noData: "Không có dữ liệu phân tích"
    },

    // Quant Analysis Page
    quantAnalysisPage: {
      title: "Phân tích định lượng",
      subtitle: "Công cụ phân tích và trực quan hóa thị trường nâng cao",
      sections: {
        marketAnalysis: "Phân tích thị trường",
        dashboard: "Bảng điều khiển thị trường",
        heatmap: "Bản đồ nhiệt thị trường", 
        monteCarlo: "Mô phỏng Monte Carlo"
      },
      interpretation: "Giải thích phân tích thị trường",
      loading: "Đang tải dữ liệu thị trường...",
      loadingHeatmap: "Đang tải dữ liệu bản đồ nhiệt...",
      loadingMonteCarlo: "Đang tải mô phỏng Monte Carlo...",
      controls: {
        indicator: "Chỉ báo",
        period: "Khoảng thời gian",
        returnType: "Loại lợi nhuận",
        dataSource: "Nguồn dữ liệu"
      }
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
      indicatorAndReturnChatBot: "Indicator and return from chatbot"
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
      topInvestorsIntro: "Đây là một số nhà đầu tư hàng đầu mà bạn có thể quan tâm:",
      from: "từ",
      portfolioValue: "Giá trị Danh mục",
      avgHoldingPeriod: "Thời gian Nắm giữ Trung bình",
      learnMorePrompt: "Bạn có muốn tìm hiểu thêm về chiến lược đầu tư của họ không?"
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
      marketHoursPrompt: "Thị trường đang mở! Bạn có muốn xem phân tích mới nhất?",
      portfolioCheckPrompt: "Đã lâu rồi bạn chưa kiểm tra danh mục đầu tư. Cần hỗ trợ gì không?",
      budgetReminderPrompt: "Cuối tháng rồi! Bạn có muốn xem lại ngân sách và chi tiêu không?",
      suggestions: {
        title: "Gợi ý Nhanh",
        investment: "Lời khuyên đầu tư",
        portfolio: "Phân tích danh mục",
        market: "Thông tin thị trường",
        budgeting: "Mẹo lập ngân sách",
        risk: "Quản lý rủi ro",
        trading: "Chiến lược giao dịch"
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
      poweredBy: "Được hỗ trợ bởi FinBud AI"
    },

    // Course Page
    coursePage: {
      title: "Khóa học Tài chính",
      subtitle: "Học hỏi và nâng cao kiến thức tài chính",
      categories: {
        beginners: "Dành cho người mới bắt đầu",
        investments: "Đầu tư hiệu quả",
        fundamental: "Phân tích cơ bản", 
        technical: "Phân tích kỹ thuật"
      },
      views: "lượt xem",
      viewMore: "Xem thêm",
      loading: "Đang tải khóa học...",
      noData: "Không có khóa học nào",
      readTime: "phút đọc"
    },

    // Market Analysis Page
    marketAnalysisPage: {
      marketAnalysisTitle: "Phân tích Thị trường",
      marketAnalysisDescription: "Dữ liệu và phân tích thị trường toàn diện cho quyết định đầu tư sáng suốt",
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
        TechCommunity: "Cộng đồng Công nghệ"
      },
      insight: {
        Assessment: "Đánh giá",
        Details: "Chi tiết",
        Source: "Nguồn",
        Analysis: "Phân tích", 
        Reference: "Tham khảo"
      },
      trend: {
        title: "Xu hướng Thị trường",
        topic: "Chủ đề",
        categories: {
          All: "Tất cả",
          Securities: "Chứng khoán",
          Economy: "Kinh tế",
          Industry: "Ngành nghề",
          Other: "Khác"
        }
      }
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
      indicatorAndReturnChatBot: "Phân tích chỉ báo và lợi nhuận có sẵn"
    },

    // Stock Simulator
    stockSimulator: {
      pageTitle: "Mô Phỏng Chứng Khoán",
      tabs: {
        investment: "Đầu Tư",
        portfolio: "Danh Mục",
        filters: "Bộ Lọc Cổ Phiếu", 
        quiz: "Câu Hỏi",
        predictiveCalc: "Máy Tính Dự Đoán"
      },
      trading: {
        quickTrade: "Giao Dịch Nhanh",
        stockSymbol: "Mã Cổ Phiếu",
        stockSymbolPlaceholder: "Nhập mã cổ phiếu (ví dụ: AAPL)",
        quantity: "Số Lượng",
        buy: "Mua",
        sell: "Bán",
        clear: "Xóa"
      },
      account: {
        summary: "Tóm Tắt Tài Khoản",
        balance: "Tổng Số Dư",
        cash: "Tiền Mặt Khả Dụng",
        stocks: "Giá Trị Cổ Phiếu",
        todayChange: "Thay Đổi Hôm Nay"
      },
      portfolio: {
        totalPortfolio: "Tổng Giá Trị Danh Mục",
        holdings: "Cổ Phiếu Sở Hữu",
        loading: "Đang tải danh mục...",
        noHoldings: "Không có cổ phiếu nào",
        table: {
          symbol: "Mã",
          shares: "Shares",
          currentPrice: "Current Price",
          marketValue: "Market Value",
          gainLoss: "Gain/Loss",
          change: "Change %"
        }
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
        presetSavedMessage: "Preset \"{name}\" saved successfully",
        presets: {
          growthStocks: "Growth Stocks",
          valueStocks: "Value Stocks", 
          dividendStocks: "Dividend Stocks",
          largeCap: "Large Cap",
          smallCap: "Small Cap"
        },
        marketCapOptions: {
          mega: "Mega Cap (>$200B)",
          large: "Large Cap ($10B-$200B)",
          mid: "Mid Cap ($2B-$10B)",
          small: "Small Cap ($300M-$2B)",
          micro: "Micro Cap (<$300M)"
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
          telecommunications: "Telecommunications"
        }
      },
      quiz: {
        title: "Stock Market Quiz",
        loading: "Loading quiz..."
      },
      notifications: {
        orderSuccess: "Order Successful",
        buySuccess: "Successfully bought {quantity} shares of {symbol}",
        sellSuccess: "Successfully sold {quantity} shares of {symbol}",
        orderError: "Order Failed",
        networkError: "Network error occurred"
      }
    },

    // Accountant Page
    accountantPage: {
      title: "AI Kế Toán Thông Minh",
      subtitle: "Phân tích tài chính tự động với AI tiên tiến",
      hero: {
        documentsProcessed: "Tài liệu đã xử lý",
        accuracyRate: "Độ chính xác",
        timeSaved: "Thời gian tiết kiệm"
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
          taxDesc: "Lập kế hoạch & tuân thủ thuế"
        }
      },
      chatbot: {
        title: "Trợ lý AI Tài chính",
        greeting: "Xin chào! Tôi là Trợ lý AI Tài chính của bạn. Hôm nay tôi có thể giúp gì cho bạn?",
        placeholder: "Nhập tin nhắn của bạn...",
        options: {
          upload: "Tải lên tài liệu",
          insights: "Giải thích thông tin chi tiết",
          tax: "Tối ưu hóa thuế",
          compliance: "Kiểm tra tuân thủ"
        },
        responses: {
          upload: "Tôi có thể giúp bạn phân tích các loại tài liệu tài chính như báo cáo thu nhập, bảng cân đối kế toán, báo cáo lưu chuyển tiền tệ và tài liệu thuế. Chỉ cần kéo thả file của bạn vào khu vực tải lên!",
          insights: "Tôi cung cấp thông tin chi tiết AI về hiệu suất tài chính, cơ hội tăng trưởng, tối ưu hóa chi phí và dự báo. Bạn muốn tôi giải thích điều gì cụ thể?",
          tax: "Tôi có thể giúp xác định các chiến lược tối ưu hóa thuế, tín dụng thuế có sẵn, khấu hao tối đa và cơ hội giảm thuế. Loại tối ưu hóa nào bạn quan tâm?",
          compliance: "Tôi thực hiện kiểm tra tuân thủ toàn diện cho các tiêu chuẩn báo cáo tài chính, yêu cầu thuế và quy định ngành. Bạn cần kiểm tra loại tuân thủ nào?"
        }
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
          personnel: "Nhân sự"
        },
        compliance: "Giám sát Tuân thủ",
        complianceScore: "Điểm tuân thủ",
        taxOptimization: "Tối ưu hóa Thuế",
        forecasting: "Dự báo Tài chính",
        forecasting92: "Độ tin cậy 92%",
        forecastPeriods: {
          nextMonth: "Tháng tới",
          nextQuarter: "Quý tới"
        },
        metrics: {
          revenue: "Doanh thu",
          profit: "Lãi",
          strongGrowth: "Tăng trưởng mạnh",
          sustainedGrowth: "Tăng trưởng bền vững"
        }
      },
      actions: {
        title: "Hành động Đề xuất",
        priorities: {
          all: "Tất cả",
          high: "Cao", 
          medium: "Trung bình",
          low: "Thấp"
        },
        execute: "Thực hiện",
        items: {
          revenueOpportunity: "Cơ hội Tăng Doanh thu",
          revenueDesc: "Xu hướng Q4 cho thấy tiềm năng tăng trưởng 23% trong phân khúc dịch vụ công nghệ",
          costOptimization: "Cảnh báo Tối ưu Chi phí",
          costDesc: "Chi phí văn phòng tăng 18% quý này. Xem xét đàm phán lại hợp đồng nhà cung cấp",
          cashFlowPrediction: "Dự báo Dòng tiền",
          cashFlowDesc: "Dựa trên xu hướng hiện tại, dự kiến cải thiện dòng tiền tích cực quý tới"
        }
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
          warning: "Cảnh báo"
        }
      },
      tax: {
        depreciation: "Tối ưu hóa Khấu hao",
        depreciationDesc: "Tăng tốc khấu hao thiết bị để giảm thuế năm hiện tại",
        expenseMax: "Tối đa hóa Chi phí Kinh doanh", 
        expenseDesc: "Xác định chi phí khấu trừ bị bỏ sót từ du lịch và giải trí",
        rdCredit: "Tín dụng Thuế R&D",
        rdDesc: "Đủ điều kiện cho ưu đãi thuế nghiên cứu và phát triển",
        savings: "Tiết kiệm",
        complexity: {
          low: "Thấp",
          medium: "Trung bình", 
          high: "Cao"
        },
        actions: {
          implementNow: "Thực hiện ngay",
          reviewApply: "Xem xét & Áp dụng",
          consultExpert: "Tư vấn Chuyên gia"
        }
      },
      help: {
        tooltip: "Cần trợ giúp? Hỏi Trợ lý AI",
        processing: "Đang xử lý AI",
        progressSteps: {
          extracting: "Trích xuất dữ liệu từ tài liệu...",
          analyzing: "Phân tích các số liệu tài chính...",
          generating: "Tạo thông tin chi tiết...",
          finalizing: "Hoàn thiện báo cáo..."
        }
      }
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: "vi",
  fallbackLocale: "en",
  messages,
  globalInjection: true,
});

export default i18n;
