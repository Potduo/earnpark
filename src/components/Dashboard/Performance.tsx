import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, ChartBar as BarChart3, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { PerformanceData, UserDashboardData, AIBotTrade } from '../../types';
import { getDashboardData, getPerformanceData, getBotTrades } from '../../lib/supabaseData';

const Performance: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [botTrades, setBotTrades] = useState<AIBotTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const userData = await getDashboardData(user.id);
      setDashboardData(userData);

      const userPerformanceData = await getPerformanceData(user.id);
      setPerformanceData(userPerformanceData);

      const userBotTrades = await getBotTrades(user.id);
      setBotTrades(userBotTrades);

      setLoading(false);
    } catch (error) {
      console.error('Error loading performance data:', error);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
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

  const profitableTrades = botTrades.filter(trade => trade.isProfit).length;
  const totalTrades = botTrades.length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

  const avgDailyProfit = performanceData.length > 0 ? 
    performanceData.reduce((sum, day) => sum + day.profit, 0) / performanceData.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Performance</h1>
          <p className="text-gray-400">Track your investment performance and AI bot trades</p>
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
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              totalProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <DollarSign className={`w-6 h-6 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <div className={`text-sm px-2 py-1 rounded ${
              totalProfit >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {totalProfit >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total {totalProfit >= 0 ? 'Profit' : 'Loss'}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              dashboardData.dailyProfitPercentage >= 0 ? 'bg-blue-500/20' : 'bg-red-500/20'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                dashboardData.dailyProfitPercentage >= 0 ? 'text-blue-400' : 'text-red-400'
              }`} />
            </div>
            <div className={`text-sm px-2 py-1 rounded ${
              dashboardData.dailyProfitPercentage >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {dashboardData.dailyProfitPercentage >= 0 ? '+' : ''}{dashboardData.dailyProfitPercentage.toFixed(2)}%
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            dashboardData.dailyProfitPercentage >= 0 ? 'text-blue-400' : 'text-red-400'
          }`}>
            {dashboardData.dailyProfitPercentage >= 0 ? '+' : ''}{dashboardData.dailyProfitPercentage.toFixed(2)}%
          </div>
          <div className="text-gray-400 text-sm">Daily Profit Rate</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`text-sm px-2 py-1 rounded ${
              winRate >= 70 ? 'bg-green-500/20 text-green-400' :
              winRate >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {winRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {profitableTrades}/{totalTrades}
          </div>
          <div className="text-gray-400 text-sm">Win Rate</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              avgDailyProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <BarChart3 className={`w-6 h-6 ${avgDailyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            avgDailyProfit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {avgDailyProfit >= 0 ? '+' : ''}{avgDailyProfit.toFixed(2)}%
          </div>
          <div className="text-gray-400 text-sm">Avg Daily Return</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Portfolio Performance</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded text-sm ${
                chartType === 'bar' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded text-sm ${
                chartType === 'line' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Line Chart
            </button>
          </div>
        </div>
        
        {performanceData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
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
              ) : (
                <LineChart data={performanceData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">No performance data</h4>
            <p className="text-gray-400">Performance data will appear once your account is activated</p>
          </div>
        )}
      </div>

      {/* Recent Bot Trades */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent AI Bot Trades</h3>
        
        {botTrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Crypto Pair</th>
                  <th className="text-left text-gray-400 font-medium py-3">Entry Price</th>
                  <th className="text-left text-gray-400 font-medium py-3">Exit Price</th>
                  <th className="text-left text-gray-400 font-medium py-3">Profit/Loss %</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {botTrades.slice(0, 10).map((trade) => (
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
                      <span className={`font-semibold ${
                        trade.isProfit ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.isProfit ? '+' : ''}{trade.profitPercentage.toFixed(2)}%
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
            <p className="text-gray-400">AI bot trades will appear once your account is activated</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;