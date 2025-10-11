import { supabase } from './supabase';
import { UserDashboardData, Investment, Transaction, AIBotTrade, PerformanceData, ChatMessage, WithdrawalRequest } from '../types';

const createDefaultUserData = async (userId: string): Promise<UserDashboardData> => {
  const defaultData: Omit<UserDashboardData, 'userId'> = {
    totalInvested: 0,
    currentPortfolioValue: 0,
    dailyProfitPercentage: 0,
    portfolioActive: false,
    isAdmin: false,
    lastUpdate: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_dashboard_data')
    .insert({
      user_id: userId,
      total_invested: defaultData.totalInvested,
      current_portfolio_value: defaultData.currentPortfolioValue,
      daily_profit_percentage: defaultData.dailyProfitPercentage,
      portfolio_active: defaultData.portfolioActive,
      is_admin: defaultData.isAdmin,
      last_update: defaultData.lastUpdate
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating default user data:', error);
    throw error;
  }

  return {
    userId,
    ...defaultData
  };
};

export const getDashboardData = async (userId: string): Promise<UserDashboardData> => {
  const { data, error } = await supabase
    .from('user_dashboard_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }

  if (!data) {
    return await createDefaultUserData(userId);
  }

  return {
    userId: data.user_id,
    totalInvested: Number(data.total_invested),
    currentPortfolioValue: Number(data.current_portfolio_value),
    dailyProfitPercentage: Number(data.daily_profit_percentage),
    portfolioActive: data.portfolio_active,
    isAdmin: data.is_admin,
    lastUpdate: data.last_update,
    activationDate: data.activation_date
  };
};

export const updateDashboardData = async (userId: string, updates: Partial<UserDashboardData>): Promise<UserDashboardData> => {
  const updatePayload: any = {
    last_update: new Date().toISOString()
  };

  if (updates.totalInvested !== undefined) updatePayload.total_invested = updates.totalInvested;
  if (updates.currentPortfolioValue !== undefined) updatePayload.current_portfolio_value = updates.currentPortfolioValue;
  if (updates.dailyProfitPercentage !== undefined) updatePayload.daily_profit_percentage = updates.dailyProfitPercentage;
  if (updates.portfolioActive !== undefined) updatePayload.portfolio_active = updates.portfolioActive;
  if (updates.isAdmin !== undefined) updatePayload.is_admin = updates.isAdmin;
  if (updates.activationDate !== undefined) updatePayload.activation_date = updates.activationDate;

  const { data, error } = await supabase
    .from('user_dashboard_data')
    .update(updatePayload)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating dashboard data:', error);
    throw error;
  }

  if (!data) {
    await createDefaultUserData(userId);
    return await updateDashboardData(userId, updates);
  }

  return {
    userId: data.user_id,
    totalInvested: Number(data.total_invested),
    currentPortfolioValue: Number(data.current_portfolio_value),
    dailyProfitPercentage: Number(data.daily_profit_percentage),
    portfolioActive: data.portfolio_active,
    isAdmin: data.is_admin,
    lastUpdate: data.last_update,
    activationDate: data.activation_date
  };
};

export const getInvestments = async (userId: string): Promise<Investment[]> => {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching investments:', error);
    throw error;
  }

  return (data || []).map(inv => ({
    id: inv.id,
    userId: inv.user_id,
    currency: inv.currency,
    amount: Number(inv.amount),
    profit: Number(inv.profit),
    status: inv.status as 'active' | 'pending' | 'completed',
    date: inv.date
  }));
};

export const addInvestment = async (investment: Omit<Investment, 'id'>): Promise<Investment> => {
  const { data, error } = await supabase
    .from('investments')
    .insert({
      user_id: investment.userId,
      currency: investment.currency,
      amount: investment.amount,
      profit: investment.profit,
      status: investment.status,
      date: investment.date
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding investment:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    currency: data.currency,
    amount: Number(data.amount),
    profit: Number(data.profit),
    status: data.status,
    date: data.date
  };
};

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return (data || []).map(tx => ({
    id: tx.id,
    userId: tx.user_id,
    type: tx.type as 'deposit' | 'withdrawal' | 'profit',
    amount: Number(tx.amount),
    currency: tx.currency,
    status: tx.status as 'pending' | 'completed' | 'failed',
    date: tx.date,
    description: tx.description,
    walletAddress: tx.wallet_address,
    network: tx.network
  }));
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      date: transaction.date,
      description: transaction.description,
      wallet_address: transaction.walletAddress,
      network: transaction.network
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    amount: Number(data.amount),
    currency: data.currency,
    status: data.status,
    date: data.date,
    description: data.description,
    walletAddress: data.wallet_address,
    network: data.network
  };
};

export const getBotTrades = async (userId: string): Promise<AIBotTrade[]> => {
  const { data, error } = await supabase
    .from('ai_bot_trades')
    .select('*')
    .eq('user_id', userId)
    .order('trade_date', { ascending: false });

  if (error) {
    console.error('Error fetching bot trades:', error);
    throw error;
  }

  return (data || []).map(trade => ({
    id: trade.id,
    userId: trade.user_id,
    cryptoPair: trade.crypto_pair,
    entryPrice: Number(trade.entry_price),
    exitPrice: Number(trade.exit_price),
    profitPercentage: Number(trade.profit_percentage),
    isProfit: trade.is_profit,
    tradeDate: trade.trade_date
  }));
};

export const addBotTrade = async (trade: Omit<AIBotTrade, 'id'>): Promise<AIBotTrade> => {
  const { data, error } = await supabase
    .from('ai_bot_trades')
    .insert({
      user_id: trade.userId,
      crypto_pair: trade.cryptoPair,
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      profit_percentage: trade.profitPercentage,
      is_profit: trade.isProfit,
      trade_date: trade.tradeDate
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding bot trade:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    cryptoPair: data.crypto_pair,
    entryPrice: Number(data.entry_price),
    exitPrice: Number(data.exit_price),
    profitPercentage: Number(data.profit_percentage),
    isProfit: data.is_profit,
    tradeDate: data.trade_date
  };
};

export const getPerformanceData = async (userId: string): Promise<PerformanceData[]> => {
  const { data, error } = await supabase
    .from('performance_data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }

  return (data || []).map(perf => ({
    date: perf.date,
    profit: Number(perf.profit),
    portfolioValue: Number(perf.portfolio_value)
  }));
};

export const updatePerformanceData = async (userId: string, performanceData: PerformanceData[]): Promise<void> => {
  const { error: deleteError } = await supabase
    .from('performance_data')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    console.error('Error deleting old performance data:', deleteError);
    throw deleteError;
  }

  if (performanceData.length === 0) return;

  const { error: insertError } = await supabase
    .from('performance_data')
    .insert(
      performanceData.map(perf => ({
        user_id: userId,
        date: perf.date,
        profit: perf.profit,
        portfolio_value: perf.portfolioValue
      }))
    );

  if (insertError) {
    console.error('Error inserting performance data:', insertError);
    throw insertError;
  }
};

export const getChatMessages = async (userId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }

  return (data || []).map(msg => ({
    id: msg.id,
    userId: msg.user_id,
    message: msg.message,
    isUser: msg.is_user,
    status: msg.status as 'sending' | 'sent' | 'failed' | undefined,
    timestamp: msg.timestamp
  }));
};

export const addChatMessage = async (userId: string, message: Omit<ChatMessage, 'id' | 'userId'>): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      message: message.message,
      is_user: message.isUser,
      status: message.status || 'sent',
      timestamp: message.timestamp
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding chat message:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    message: data.message,
    isUser: data.is_user,
    status: data.status,
    timestamp: data.timestamp
  };
};

export const getWithdrawals = async (userId: string): Promise<WithdrawalRequest[]> => {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('user_id', userId)
    .order('request_date', { ascending: false });

  if (error) {
    console.error('Error fetching withdrawals:', error);
    throw error;
  }

  return (data || []).map(wd => ({
    id: wd.id,
    userId: wd.user_id,
    email: wd.email,
    amount: Number(wd.amount),
    currency: wd.currency,
    walletAddress: wd.wallet_address,
    network: wd.network,
    status: wd.status as 'pending' | 'processing' | 'completed' | 'failed',
    requestDate: wd.request_date
  }));
};

export const addWithdrawal = async (withdrawal: Omit<WithdrawalRequest, 'id'>): Promise<WithdrawalRequest> => {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .insert({
      user_id: withdrawal.userId,
      email: withdrawal.email,
      amount: withdrawal.amount,
      currency: withdrawal.currency,
      wallet_address: withdrawal.walletAddress,
      network: withdrawal.network,
      status: withdrawal.status,
      request_date: withdrawal.requestDate
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding withdrawal:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    email: data.email,
    amount: Number(data.amount),
    currency: data.currency,
    walletAddress: data.wallet_address,
    network: data.network,
    status: data.status,
    requestDate: data.request_date
  };
};

export const activatePortfolio = async (userId: string, initialInvestment: number = 1000): Promise<UserDashboardData> => {
  const activationDate = new Date().toISOString();

  const dashboardData = await updateDashboardData(userId, {
    totalInvested: initialInvestment,
    currentPortfolioValue: initialInvestment * 1.15,
    dailyProfitPercentage: 2.5,
    portfolioActive: true,
    activationDate
  });

  await addInvestment({
    userId,
    currency: 'BTC',
    amount: initialInvestment,
    profit: initialInvestment * 0.15,
    status: 'active',
    date: activationDate
  });

  await addTransaction({
    userId,
    type: 'deposit',
    amount: initialInvestment,
    currency: 'USD',
    status: 'completed',
    date: activationDate,
    description: 'Initial deposit'
  });

  const cryptoPairs = ['BTC/USD', 'ETH/USD', 'ADA/USD', 'DOT/USD', 'SOL/USD'];
  for (let i = 0; i < 8; i++) {
    const isProfit = Math.random() > 0.3;
    const profitPercentage = isProfit ?
      1 + Math.random() * 4 :
      -(Math.random() * 2);

    await addBotTrade({
      userId,
      cryptoPair: cryptoPairs[Math.floor(Math.random() * cryptoPairs.length)],
      entryPrice: 45000 + Math.random() * 5000,
      exitPrice: 46000 + Math.random() * 5000,
      profitPercentage,
      isProfit,
      tradeDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  const performanceData: PerformanceData[] = [];
  const activationDateObj = new Date(activationDate);
  const today = new Date();
  const daysDiff = Math.floor((today.getTime() - activationDateObj.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i <= Math.max(daysDiff, 7); i++) {
    const date = new Date(activationDateObj);
    date.setDate(date.getDate() + i);

    const dailyProfit = (Math.random() - 0.3) * 5;
    performanceData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      profit: dailyProfit,
      portfolioValue: initialInvestment * (1 + i * 0.005 + Math.random() * 0.01)
    });
  }
  await updatePerformanceData(userId, performanceData);

  console.log(`✅ Portfolio activated for user ${userId} with $${initialInvestment} initial investment`);
  return dashboardData;
};
