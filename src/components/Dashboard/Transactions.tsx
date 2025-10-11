import React, { useState, useEffect } from 'react';
import { History, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Transaction, UserDashboardData } from '../../types';
import { getDashboardData, getTransactions } from '../../lib/supabaseData';

const Transactions: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'profit'>('all');

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

      const userTransactions = await getTransactions(user.id);
      setTransactions(userTransactions);

      setLoading(false);
    } catch (error) {
      console.error('Error loading transactions data:', error);
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

  const filteredTransactions = filter === 'all' ? transactions : transactions.filter(tx => tx.type === filter);
  
  const totalDeposits = transactions.filter(tx => tx.type === 'deposit').reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawals = transactions.filter(tx => tx.type === 'withdrawal').reduce((sum, tx) => sum + tx.amount, 0);
  const totalProfits = transactions.filter(tx => tx.type === 'profit').reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-gray-400">View all your transaction history</p>
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

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total Deposits</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <DollarSign className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total Withdrawals</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${totalProfits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total Profits</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'all', label: 'All Transactions' },
            { key: 'deposit', label: 'Deposits' },
            { key: 'withdrawal', label: 'Withdrawals' },
            { key: 'profit', label: 'Profits' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Type</th>
                  <th className="text-left text-gray-400 font-medium py-3">Amount</th>
                  <th className="text-left text-gray-400 font-medium py-3">Currency</th>
                  <th className="text-left text-gray-400 font-medium py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium py-3">Description</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-700/50">
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-500/20' :
                          transaction.type === 'withdrawal' ? 'bg-red-500/20' :
                          'bg-purple-500/20'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : transaction.type === 'withdrawal' ? (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          ) : (
                            <DollarSign className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <span className="text-white font-medium capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 font-semibold ${
                      transaction.type === 'deposit' || transaction.type === 'profit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'profit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {transaction.currency.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-300">{transaction.currency.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300">
                      {transaction.description}
                    </td>
                    <td className="py-4 text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">
              No {filter === 'all' ? '' : filter} transactions yet
            </h4>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'Your transaction history will appear here'
                : `Your ${filter} transactions will appear here`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;