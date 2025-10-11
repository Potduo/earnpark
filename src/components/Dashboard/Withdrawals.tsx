import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, RefreshCw, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { WithdrawalRequest, UserDashboardData } from '../../types';
import { getDashboardData, getWithdrawals } from '../../lib/supabaseData';
import WithdrawalFlow from './WithdrawalFlow';

const Withdrawals: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

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

      const userWithdrawals = await getWithdrawals(user.id);
      setWithdrawals(userWithdrawals);

      setLoading(false);
    } catch (error) {
      console.error('Error loading withdrawals data:', error);
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

  const totalWithdrawals = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Withdrawals</h1>
          <p className="text-gray-400">Manage your withdrawal requests</p>
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
            onClick={() => setShowWithdrawalModal(true)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowDownLeft className="w-5 h-5" />
            <span>Request Withdrawal</span>
          </button>
        </div>
      </div>

      {/* Withdrawal Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-400" />
            </div>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-400 text-sm">Total Withdrawals</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {completedWithdrawals}
          </div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {pendingWithdrawals}
          </div>
          <div className="text-gray-400 text-sm">Pending</div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Withdrawal History</h3>
        
        {withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3">Amount</th>
                  <th className="text-left text-gray-400 font-medium py-3">Currency</th>
                  <th className="text-left text-gray-400 font-medium py-3">Wallet Address</th>
                  <th className="text-left text-gray-400 font-medium py-3">Network</th>
                  <th className="text-left text-gray-400 font-medium py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-700/50">
                    <td className="py-4 text-white font-semibold">
                      ${withdrawal.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {withdrawal.currency.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-300">{withdrawal.currency.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300 font-mono text-sm">
                      {withdrawal.walletAddress.slice(0, 8)}...{withdrawal.walletAddress.slice(-8)}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {withdrawal.network}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        withdrawal.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">
                      {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowDownLeft className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">No withdrawals yet</h4>
            <p className="text-gray-400 mb-4">Request your first withdrawal when ready</p>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Request Withdrawal
            </button>
          </div>
        )}
      </div>

      {/* Withdrawal Flow Modal */}
      <WithdrawalFlow 
        isOpen={showWithdrawalModal} 
        onClose={() => setShowWithdrawalModal(false)} 
      />
    </div>
  );
};

export default Withdrawals;