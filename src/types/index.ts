export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface UserDashboardData {
  userId: string;
  totalInvested: number;
  currentPortfolioValue: number;
  dailyProfitPercentage: number;
  portfolioActive: boolean;
  isAdmin: boolean;
  lastUpdate: string;
  activationDate?: string;
}

export interface Investment {
  id: string;
  userId: string;
  currency: string;
  amount: number;
  profit: number;
  status: 'active' | 'pending' | 'completed';
  date: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'profit';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
  walletAddress?: string;
  network?: string;
}

export interface AIBotTrade {
  id: string;
  userId: string;
  cryptoPair: string;
  entryPrice: number;
  exitPrice: number;
  profitPercentage: number;
  tradeDate: string;
  isProfit: boolean;
}

export interface PerformanceData {
  date: string;
  profit: number;
  portfolioValue: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  email: string;
  amount: number;
  currency: string;
  walletAddress: string;
  network: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: string;
}