import React, { useState, useEffect } from 'react';
import { ChartPie as PieChart, TrendingUp, DollarSign, Activity, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Investment, UserDashboardData } from '../../types';
import { getDashboardData, getInvestments } from '../../lib/supabaseData';
import DepositFlow from './DepositFlow';

const Investments: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

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

      const userInvestments = await getInvestments(user.id);
      setInvestments(userInvestments);

      setLoading(false);
    } catch (error) {
      console.error('Error loading investments data:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investments</h1>
          <p className="text-gray-400">Manage your investment portfolio</p>
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
            <span>New Investment</span>
          </button>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${dashboardData.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total Invested</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`text-sm px-2 py-1 rounded ${
              totalProfit >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {totalProfit >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${dashboardData.currentPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Current Value</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              totalProfit >= 0 ? 'bg-purple-500/20' : 'bg-red-500/20'
            }`}>
              <TrendingUp className={`w-6 h-6 ${totalProfit >= 0 ? 'text-purple-400' : 'text-red-400'}`} />
            </div>
            <div className={`text-sm px-2 py-1 rounded ${
              dashboardData.dailyProfitPercentage >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {dashboardData.dailyProfitPercentage >= 0 ? '+' : ''}{dashboardData.dailyProfitPercentage.toFixed(2)}%
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total {totalProfit >= 0 ? 'Profit' : 'Loss'}</div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Investment Portfolio</h3>
        
        {investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Currency</th>
                  <th className="text-left text-gray-400 font-medium py-3">Amount Invested</th>
                  <th className="text-left text-gray-400 font-medium py-3">Current Value</th>
                  <th className="text-left text-gray-400 font-medium py-3">Profit/Loss</th>
                  <th className="text-left text-gray-400 font-medium py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
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
                    <td className="py-4 text-white">
                      ${(investment.amount + investment.profit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-4 ${investment.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {investment.profit >= 0 ? '+' : ''}${investment.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      <span className="text-sm ml-2">
                        ({investment.profit >= 0 ? '+' : ''}{((investment.profit / investment.amount) * 100).toFixed(2)}%)
                      </span>
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
            <p className="text-gray-400 mb-4">Start investing to build your portfolio</p>
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Make Your First Investment
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

export default Investments;