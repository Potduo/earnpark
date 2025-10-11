import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ChartPie as PieChart, Activity, Plus, Wallet, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { Investment, AIBotTrade, UserDashboardData } from '../../types';
import {
  getDashboardData,
  getInvestments,
  getBotTrades,
  getPerformanceData
} from '../../lib/supabaseData';
import DepositFlow from './DepositFlow';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [botTrades, setBotTrades] = useState<AIBotTrade[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      console.log('📊 Loading dashboard data for user:', user.id);
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const userData = await getDashboardData(user.id);
      setDashboardData(userData);
      console.log('💰 Dashboard data loaded:', userData);

      const userInvestments = await getInvestments(user.id);
      setInvestments(userInvestments);
      console.log('📈 Investments loaded:', userInvestments.length);

      const userBotTrades = await getBotTrades(user.id);
      setBotTrades(userBotTrades);
      console.log('🤖 Bot trades loaded:', userBotTrades.length);

      const userPerformanceData = await getPerformanceData(user.id);
      setPerformanceData(userPerformanceData);
      console.log('📊 Performance data loaded:', userPerformanceData.length);

      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    loadDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  const totalProfit = dashboardData.currentPortfolioValue - dashboardData.totalInvested;
  const profitPercentage = dashboardData.totalInvested > 0 ? 
    ((totalProfit / dashboardData.totalInvested) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h1>
          <p className="text-gray-400">Track your investments and earnings</p>
          {dashboardData.isAdmin && (
            <div className="mt-2">
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                Admin Account
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{dashboardData.portfolioActive ? 'Make Deposit' : 'Activate Account'}</span>
          </button>
        </div>
      </div>

      {dashboardData.isAdmin && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-400 font-semibold mb-3">Admin Account</h3>
          <p className="text-gray-300 text-sm">
            You have admin privileges. Use the Supabase dashboard to manage user data directly in the database.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              dashboardData.portfolioActive ? 'bg-green-500/20' : 'bg-gray-500/20'
            }`}>
              <DollarSign className={`w-6 h-6 ${dashboardData.portfolioActive ? 'text-green-400' : 'text-gray-400'}`} />
            </div>
            <TrendingUp className={`w-5 h-5 ${dashboardData.portfolioActive ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${dashboardData.currentPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">
            Total Portfolio Value
            {dashboardData.portfolioActive && (
              <span className="ml-2 text-xs text-green-400">(Active)</span>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              dashboardData.portfolioActive ? 'bg-blue-500/20' : 'bg-gray-500/20'
            }`}>
              <Wallet className={`w-6 h-6 ${dashboardData.portfolioActive ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
            <Activity className={`w-5 h-5 ${dashboardData.portfolioActive ? 'text-blue-400' : 'text-gray-400'}`} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${dashboardData.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total Invested</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              totalProfit >= 0 ? 'bg-purple-500/20' : 'bg-red-500/20'
            }`}>
              <TrendingUp className={`w-6 h-6 ${totalProfit >= 0 ? 'text-purple-400' : 'text-red-400'}`} />
            </div>
            <div className={`text-sm px-2 py-1 rounded ${
              dashboardData.portfolioActive && totalProfit >= 0 ? 'bg-green-500/20 text-green-400' : 
              dashboardData.portfolioActive && totalProfit < 0 ? 'bg-red-500/20 text-red-400' : 
              'bg-gray-500/20 text-gray-400'
            }`}>
              {dashboardData.portfolioActive ? `${totalProfit >= 0 ? '+' : ''}${profitPercentage.toFixed(1)}%` : '0%'}
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            dashboardData.portfolioActive && totalProfit >= 0 ? 'text-green-400' : 
            dashboardData.portfolioActive && totalProfit < 0 ? 'text-red-400' : 
            'text-white'
          }`}>
            ${Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total {totalProfit >= 0 ? 'Profit' : 'Loss'}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              dashboardData.portfolioActive ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <Activity className={`w-6 h-6 ${dashboardData.portfolioActive ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${dashboardData.portfolioActive ? 'text-green-400' : 'text-red-400'}`}>
            {dashboardData.portfolioActive ? 'ACTIVE' : 'INACTIVE'}
          </div>
          <div className="text-gray-400 text-sm mb-2">Account Status</div>
          {!dashboardData.portfolioActive && (
            <div className="text-orange-400 text-xs">Make a deposit to activate your account</div>
          )}
        </div>
      </div>

      {/* AI Bot Trades */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">AI Bot Trades</h3>
          {dashboardData.portfolioActive && dashboardData.dailyProfitPercentage > 0 && (
            <div className="bg-green-500/20 px-3 py-1 rounded-lg">
              <span className="text-green-400 font-semibold">
                Daily Profit: +{dashboardData.dailyProfitPercentage.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        
        {dashboardData.portfolioActive && botTrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Crypto Pair</th>
                  <th className="text-left text-gray-400 font-medium py-3">Entry Price</th>
                  <th className="text-left text-gray-400 font-medium py-3">Exit Price</th>
                  <th className="text-left text-gray-400 font-medium py-3">Profit %</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {botTrades.slice(0, 8).map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-700/50">
                    <td className="py-4">
                      <span className="text-white font-medium">{trade.cryptoPair}</span>
                    </td>
                    <td className="py-4 text-gray-300">
                      ${trade.entryPrice.toFixed(4)}
                    </td>
                    <td className="py-4 text-gray-300">
                      ${trade.exitPrice.toFixed(4)}
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${trade.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.profitPercentage >= 0 ? '+' : ''}{trade.profitPercentage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-sm">
                      {new Date(trade.tradeDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">No trades yet</h4>
            <p className="text-gray-400 mb-4">AI bots will start trading once your account is activated</p>
            {!dashboardData.portfolioActive && (
              <button
                onClick={() => setShowDepositModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Activate Account
              </button>
            )}
          </div>
        )}
      </div>

      {/* Portfolio Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Portfolio Performance</h3>
        
        {dashboardData.portfolioActive && performanceData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any) => [`${value}%`, 'Daily Profit']}
                />
                <Bar 
                  dataKey="profit" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">No performance data</h4>
            <p className="text-orange-400 text-sm">Activate your account to start tracking performance</p>
          </div>
        )}
      </div>

      {/* Recent Investments */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Investments</h3>
        {investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Currency</th>
                  <th className="text-left text-gray-400 font-medium py-3">Amount</th>
                  <th className="text-left text-gray-400 font-medium py-3">Profit</th>
                  <th className="text-left text-gray-400 font-medium py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.slice(0, 5).map((investment) => (
                  <tr key={investment.id} className="border-b border-gray-700/50">
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {investment.currency.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">{investment.currency.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-4 text-white">
                      ${investment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-4 ${investment.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {investment.profit >= 0 ? '+' : ''}${investment.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        investment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        investment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">
                      {new Date(investment.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">No investments yet</h4>
            <p className="text-gray-400 mb-4">Start investing to see your portfolio grow</p>
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {dashboardData.portfolioActive ? 'Make Your First Investment' : 'Activate Your Account'}
            </button>
          </div>
        )}
      </div>

      {/* Deposit Flow Modal */}
      <DepositFlow 
        isOpen={showDepositModal} 
        onClose={() => setShowDepositModal(false)} 
      />
    </div>
  );
};

export default Overview;