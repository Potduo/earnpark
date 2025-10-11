import { UserDashboardData, Investment, Transaction, AIBotTrade, PerformanceData, ChatMessage, WithdrawalRequest } from '../types';

// Local data storage - In production, this would be replaced with your preferred backend
const LOCAL_STORAGE_KEYS = {
  DASHBOARD_DATA: 'earnparkpro_dashboard_data',
  INVESTMENTS: 'earnparkpro_investments',
  TRANSACTIONS: 'earnparkpro_transactions',
  BOT_TRADES: 'earnparkpro_bot_trades',
  PERFORMANCE: 'earnparkpro_performance',
  CHAT_MESSAGES: 'earnparkpro_chat_messages',
  WITHDRAWALS: 'earnparkpro_withdrawals'
};

// Default data for new users
const createDefaultUserData = (userId: string): UserDashboardData => ({
  userId,
  totalInvested: 0,
  currentPortfolioValue: 0,
  dailyProfitPercentage: 0,
  portfolioActive: false,
  isAdmin: false,
  lastUpdate: new Date().toISOString()
});

// Dashboard Data Management
export const getDashboardData = (userId: string): UserDashboardData => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DASHBOARD_DATA);
  const allData: Record<string, UserDashboardData> = stored ? JSON.parse(stored) : {};
  
  if (!allData[userId]) {
    allData[userId] = createDefaultUserData(userId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(allData));
  }
  
  return allData[userId];
};

export const updateDashboardData = (userId: string, updates: Partial<UserDashboardData>): UserDashboardData => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DASHBOARD_DATA);
  const allData: Record<string, UserDashboardData> = stored ? JSON.parse(stored) : {};
  
  allData[userId] = {
    ...allData[userId],
    ...updates,
    userId,
    lastUpdate: new Date().toISOString()
  };
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(allData));
  return allData[userId];
};

// Get all users (for admin functions)
export const getAllUsers = (): Record<string, UserDashboardData> => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DASHBOARD_DATA);
  return stored ? JSON.parse(stored) : {};
};

// Investments Management
export const getInvestments = (userId: string): Investment[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.INVESTMENTS);
  const allInvestments: Investment[] = stored ? JSON.parse(stored) : [];
  return allInvestments.filter(inv => inv.userId === userId);
};

export const addInvestment = (investment: Omit<Investment, 'id'>): Investment => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.INVESTMENTS);
  const allInvestments: Investment[] = stored ? JSON.parse(stored) : [];
  
  const newInvestment: Investment = {
    ...investment,
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  allInvestments.push(newInvestment);
  localStorage.setItem(LOCAL_STORAGE_KEYS.INVESTMENTS, JSON.stringify(allInvestments));
  return newInvestment;
};

// Transactions Management
export const getTransactions = (userId: string): Transaction[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
  const allTransactions: Transaction[] = stored ? JSON.parse(stored) : [];
  return allTransactions.filter(tx => tx.userId === userId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
  const allTransactions: Transaction[] = stored ? JSON.parse(stored) : [];
  
  const newTransaction: Transaction = {
    ...transaction,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  allTransactions.push(newTransaction);
  localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(allTransactions));
  return newTransaction;
};

// AI Bot Trades Management
export const getBotTrades = (userId: string): AIBotTrade[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.BOT_TRADES);
  const allTrades: AIBotTrade[] = stored ? JSON.parse(stored) : [];
  return allTrades.filter(trade => trade.userId === userId).sort((a, b) => 
    new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime()
  );
};

export const addBotTrade = (trade: Omit<AIBotTrade, 'id'>): AIBotTrade => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.BOT_TRADES);
  const allTrades: AIBotTrade[] = stored ? JSON.parse(stored) : [];
  
  const newTrade: AIBotTrade = {
    ...trade,
    id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  allTrades.push(newTrade);
  localStorage.setItem(LOCAL_STORAGE_KEYS.BOT_TRADES, JSON.stringify(allTrades));
  return newTrade;
};

// Performance Data Management
export const getPerformanceData = (userId: string): PerformanceData[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PERFORMANCE);
  const allPerformance: Record<string, PerformanceData[]> = stored ? JSON.parse(stored) : {};
  return allPerformance[userId] || [];
};

export const updatePerformanceData = (userId: string, data: PerformanceData[]): void => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PERFORMANCE);
  const allPerformance: Record<string, PerformanceData[]> = stored ? JSON.parse(stored) : {};
  
  allPerformance[userId] = data;
  localStorage.setItem(LOCAL_STORAGE_KEYS.PERFORMANCE, JSON.stringify(allPerformance));
};

// Chat Messages Management
export const getChatMessages = (userId: string): ChatMessage[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES);
  const allMessages: Record<string, ChatMessage[]> = stored ? JSON.parse(stored) : {};
  return allMessages[userId] || [];
};

export const addChatMessage = (userId: string, message: Omit<ChatMessage, 'id'>): ChatMessage => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES);
  const allMessages: Record<string, ChatMessage[]> = stored ? JSON.parse(stored) : {};
  
  if (!allMessages[userId]) {
    allMessages[userId] = [];
  }
  
  const newMessage: ChatMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  allMessages[userId].push(newMessage);
  localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allMessages));
  return newMessage;
};

// Withdrawals Management
export const getWithdrawals = (userId: string): WithdrawalRequest[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.WITHDRAWALS);
  const allWithdrawals: WithdrawalRequest[] = stored ? JSON.parse(stored) : [];
  return allWithdrawals.filter(w => w.userId === userId).sort((a, b) => 
    new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );
};

export const addWithdrawal = (withdrawal: Omit<WithdrawalRequest, 'id'>): WithdrawalRequest => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.WITHDRAWALS);
  const allWithdrawals: WithdrawalRequest[] = stored ? JSON.parse(stored) : [];
  
  const newWithdrawal: WithdrawalRequest = {
    ...withdrawal,
    id: `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  allWithdrawals.push(newWithdrawal);
  localStorage.setItem(LOCAL_STORAGE_KEYS.WITHDRAWALS, JSON.stringify(allWithdrawals));
  return newWithdrawal;
};

// Global Admin functions for easy data manipulation
export const GLOBAL_ADMIN_FUNCTIONS = {
  // List all users
  listAllUsers: () => {
    const allUsers = getAllUsers();
    console.table(Object.values(allUsers).map(user => ({
      userId: user.userId,
      totalInvested: user.totalInvested,
      currentValue: user.currentPortfolioValue,
      dailyProfit: user.dailyProfitPercentage,
      active: user.portfolioActive,
      admin: user.isAdmin
    })));
    return allUsers;
  },

  // Set user as admin
  makeAdmin: (userId: string) => {
    updateDashboardData(userId, { isAdmin: true });
    console.log(`✅ User ${userId} is now an admin`);
  },

  // Remove admin status
  removeAdmin: (userId: string) => {
    updateDashboardData(userId, { isAdmin: false });
    console.log(`❌ User ${userId} is no longer an admin`);
  },
  
  // Activate user portfolio with sample data
  activatePortfolio: (userId: string, initialInvestment: number = 1000) => {
    const activationDate = new Date().toISOString();
    const dashboardData = updateDashboardData(userId, {
      totalInvested: initialInvestment,
      currentPortfolioValue: initialInvestment * 1.15, // 15% profit
      dailyProfitPercentage: 2.5,
      portfolioActive: true,
      activationDate
    });
    
    // Add sample investment
    addInvestment({
      userId,
      currency: 'BTC',
      amount: initialInvestment,
      profit: initialInvestment * 0.15,
      status: 'active',
      date: activationDate
    });
    
    // Add sample transaction
    addTransaction({
      userId,
      type: 'deposit',
      amount: initialInvestment,
      currency: 'USD',
      status: 'completed',
      date: activationDate,
      description: 'Initial deposit'
    });
    
    // Add sample bot trades
    const cryptoPairs = ['BTC/USD', 'ETH/USD', 'ADA/USD', 'DOT/USD', 'SOL/USD'];
    for (let i = 0; i < 8; i++) {
      const isProfit = Math.random() > 0.3; // 70% chance of profit
      const profitPercentage = isProfit ? 
        1 + Math.random() * 4 : // 1-5% profit
        -(Math.random() * 2); // 0-2% loss
      
      addBotTrade({
        userId,
        cryptoPair: cryptoPairs[Math.floor(Math.random() * cryptoPairs.length)],
        entryPrice: 45000 + Math.random() * 5000,
        exitPrice: 46000 + Math.random() * 5000,
        profitPercentage,
        isProfit,
        tradeDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Generate performance data starting from activation date
    const performanceData: PerformanceData[] = [];
    const activationDateObj = new Date(activationDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - activationDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= Math.max(daysDiff, 7); i++) {
      const date = new Date(activationDateObj);
      date.setDate(date.getDate() + i);
      
      const dailyProfit = (Math.random() - 0.3) * 5; // -1.5% to 3.5% daily
      performanceData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        profit: dailyProfit,
        portfolioValue: initialInvestment * (1 + i * 0.005 + Math.random() * 0.01)
      });
    }
    updatePerformanceData(userId, performanceData);
    
    console.log(`✅ Portfolio activated for user ${userId} with $${initialInvestment} initial investment`);
    return dashboardData;
  },
  
  // Update user investment amounts
  updateInvestment: (userId: string, totalInvested: number, currentValue?: number, dailyProfit?: number) => {
    const currentPortfolioValue = currentValue || totalInvested * 1.15;
    const dailyProfitPercentage = dailyProfit !== undefined ? dailyProfit : 
      ((currentPortfolioValue - totalInvested) / totalInvested) * 100 / 30; // Daily average
    
    updateDashboardData(userId, {
      totalInvested,
      currentPortfolioValue,
      dailyProfitPercentage
    });
    console.log(`✅ Updated investment for user ${userId}: $${totalInvested} → $${currentPortfolioValue} (${dailyProfitPercentage.toFixed(2)}% daily)`);
  },

  // Set daily profit percentage (can be negative)
  setDailyProfit: (userId: string, dailyProfitPercentage: number) => {
    const userData = getDashboardData(userId);
    const newPortfolioValue = userData.totalInvested * (1 + dailyProfitPercentage / 100);
    
    updateDashboardData(userId, {
      dailyProfitPercentage,
      currentPortfolioValue: newPortfolioValue
    });
    console.log(`✅ Set daily profit for user ${userId}: ${dailyProfitPercentage.toFixed(2)}%`);
  },
  
  // Clear all data for a user
  clearUserData: (userId: string) => {
    // Clear dashboard data
    const dashboardStored = localStorage.getItem(LOCAL_STORAGE_KEYS.DASHBOARD_DATA);
    if (dashboardStored) {
      const allData = JSON.parse(dashboardStored);
      delete allData[userId];
      localStorage.setItem(LOCAL_STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(allData));
    }
    
    // Clear investments
    const investmentsStored = localStorage.getItem(LOCAL_STORAGE_KEYS.INVESTMENTS);
    if (investmentsStored) {
      const allInvestments = JSON.parse(investmentsStored);
      const filtered = allInvestments.filter((inv: Investment) => inv.userId !== userId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.INVESTMENTS, JSON.stringify(filtered));
    }
    
    // Clear transactions
    const transactionsStored = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
    if (transactionsStored) {
      const allTransactions = JSON.parse(transactionsStored);
      const filtered = allTransactions.filter((tx: Transaction) => tx.userId !== userId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
    }
    
    // Clear bot trades
    const tradesStored = localStorage.getItem(LOCAL_STORAGE_KEYS.BOT_TRADES);
    if (tradesStored) {
      const allTrades = JSON.parse(tradesStored);
      const filtered = allTrades.filter((trade: AIBotTrade) => trade.userId !== userId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOT_TRADES, JSON.stringify(filtered));
    }
    
    // Clear performance data
    const performanceStored = localStorage.getItem(LOCAL_STORAGE_KEYS.PERFORMANCE);
    if (performanceStored) {
      const allPerformance = JSON.parse(performanceStored);
      delete allPerformance[userId];
      localStorage.setItem(LOCAL_STORAGE_KEYS.PERFORMANCE, JSON.stringify(allPerformance));
    }

    // Clear chat messages
    const chatStored = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES);
    if (chatStored) {
      const allMessages = JSON.parse(chatStored);
      delete allMessages[userId];
      localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allMessages));
    }

    // Clear withdrawals
    const withdrawalsStored = localStorage.getItem(LOCAL_STORAGE_KEYS.WITHDRAWALS);
    if (withdrawalsStored) {
      const allWithdrawals = JSON.parse(withdrawalsStored);
      const filtered = allWithdrawals.filter((w: WithdrawalRequest) => w.userId !== userId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.WITHDRAWALS, JSON.stringify(filtered));
    }
    
    console.log(`✅ Cleared all data for user ${userId}`);
  }
};

// Make global admin functions available globally for easy access in console
(window as any).ADMIN = GLOBAL_ADMIN_FUNCTIONS;

console.log('🎯 Global data management initialized');
console.log('💡 Use window.ADMIN in console for global admin functions:');
console.log('   - ADMIN.listAllUsers()');
console.log('   - ADMIN.makeAdmin(userId)');
console.log('   - ADMIN.removeAdmin(userId)');
console.log('   - ADMIN.activatePortfolio(userId, amount)');
console.log('   - ADMIN.updateInvestment(userId, invested, current, dailyProfit)');
console.log('   - ADMIN.setDailyProfit(userId, percentage)');
console.log('   - ADMIN.clearUserData(userId)');