import React, { useState, useEffect } from 'react';
import { Wallet, Plus, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Transaction, UserDashboardData } from '../../types';
import { getDashboardData, getTransactions } from '../../lib/supabaseData';
import DepositFlow from './DepositFlow';

const Deposits: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
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

      const userTransactions = await getTransactions(user.id);
      const userDeposits = userTransactions.filter(tx => tx.type === 'deposit');
      setDeposits(userDeposits);

      setLoading(false);
    } catch (error) {
      console.error('Error loading deposits data:', error);
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

  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const completedDeposits = deposits.filter(d => d.status === 'completed').length;
  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Deposits</h1>
          <p className="text-gray-400">Manage your account deposits</p>
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
            <span>New Deposit</span>
          </button>
        </div>
      </div>

      {/* Deposit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total Deposits</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {completedDeposits}
          </div>
          <div className="text-gray-400 text-sm">Completed Deposits</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {pendingDeposits}
          </div>
          <div className="text-gray-400 text-sm">Pending Deposits</div>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Deposit History</h3>
        
        {deposits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Amount</th>
                  <th className="text-left text-gray-400 font-medium py-3">Currency</th>
                  <th className="text-left text-gray-400 font-medium py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium py-3">Description</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-gray-700/50">
                    <td className="py-4 text-white font-semibold">
                      ${deposit.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {deposit.currency.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-300">{deposit.currency.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        deposit.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        deposit.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300">
                      {deposit.description}
                    </td>
                    <td className="py-4 text-gray-400">
                      {new Date(deposit.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">No deposits yet</h4>
            <p className="text-gray-400 mb-4">Make your first deposit to start investing</p>
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Make Your First Deposit
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

export default Deposits;