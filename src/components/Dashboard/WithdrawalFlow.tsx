import React, { useState, useEffect } from 'react';
import { X, Bitcoin, DollarSign, Activity, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, ArrowDownLeft, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardData, addWithdrawal } from '../../lib/supabaseData';

interface WithdrawalFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalFlow: React.FC<WithdrawalFlowProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'email' | 'currency' | 'details' | 'confirmation'>('email');
  const [email, setEmail] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [confirmWalletAddress, setConfirmWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [limits, setLimits] = useState({ canWithdraw: true, maxAmount: 0, withdrawalPercentage: 0, monthsActive: 0, reason: '' });

  const currencies = [
    { 
      id: 'BTC', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: Bitcoin,
      color: 'from-orange-500 to-yellow-500',
      networks: ['Bitcoin Network']
    },
    { 
      id: 'ETH', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: Activity,
      color: 'from-blue-500 to-purple-500',
      networks: ['Ethereum Network (ERC-20)']
    },
    { 
      id: 'USDT', 
      name: 'USDT', 
      symbol: 'USDT', 
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      networks: ['Ethereum Network (ERC-20)', 'Tron Network (TRC-20)', 'BSC Network (BEP-20)']
    },
    { 
      id: 'SOL', 
      name: 'Solana', 
      symbol: 'SOL', 
      icon: Activity,
      color: 'from-purple-500 to-indigo-500',
      networks: ['Solana Network']
    }
  ];

  const getWithdrawalLimits = async () => {
    if (!user) return { canWithdraw: false, maxAmount: 0, reason: '' };

    const userData = await getDashboardData(user.id);
    if (!userData.portfolioActive || !userData.activationDate) {
      return { canWithdraw: false, maxAmount: 0, reason: 'Account not activated' };
    }

    const activationDate = new Date(userData.activationDate);
    const now = new Date();
    const monthsDiff = (now.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    let withdrawalPercentage = 0;
    if (monthsDiff < 3) {
      withdrawalPercentage = 10;
    } else if (monthsDiff < 6) {
      withdrawalPercentage = 20;
    } else if (monthsDiff < 9) {
      withdrawalPercentage = 35;
    } else if (monthsDiff < 12) {
      withdrawalPercentage = 50;
    } else {
      withdrawalPercentage = 100;
    }

    const maxAmount = (userData.totalInvested * withdrawalPercentage) / 100;
    
    return {
      canWithdraw: true,
      maxAmount,
      withdrawalPercentage,
      monthsActive: Math.floor(monthsDiff),
      reason: monthsDiff < 12 ? 'AI trading algorithms require sustained capital allocation for optimal GPU processing and market analysis' : ''
    };
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    setErrors({});
    setStep('currency');
  };

  const handleCurrencySelect = (currencyId: string) => {
    setSelectedCurrency(currencyId);
    const currency = currencies.find(c => c.id === currencyId);
    if (currency && currency.networks.length === 1) {
      setNetwork(currency.networks[0]);
    }
    setStep('details');
  };

  const validateDetails = async () => {
    const newErrors: Record<string, string> = {};

    if (!walletAddress) {
      newErrors.walletAddress = 'Wallet address is required';
    }

    if (!confirmWalletAddress) {
      newErrors.confirmWalletAddress = 'Please confirm your wallet address';
    }

    if (walletAddress && confirmWalletAddress && walletAddress !== confirmWalletAddress) {
      newErrors.confirmWalletAddress = 'Wallet addresses do not match';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    const limits = await getWithdrawalLimits();
    if (parseFloat(amount) > limits.maxAmount) {
      newErrors.amount = `Maximum withdrawal amount is $${limits.maxAmount.toFixed(2)}`;
    }

    if (!network) {
      newErrors.network = 'Please select a network';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!(await validateDetails()) || !user) return;
    
    setLoading(true);
    
    try {
      // Submit to Netlify Forms
      const formData = new FormData();
      formData.append('form-name', 'withdrawal-request');
      formData.append('user_id', user.id);
      formData.append('user_email', user.email);
      formData.append('withdrawal_email', email);
      formData.append('currency', selectedCurrency);
      formData.append('wallet_address', walletAddress);
      formData.append('amount', amount);
      formData.append('network', network);
      formData.append('timestamp', new Date().toISOString());

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      }).catch(() => {
        console.log('Form submission attempted (may not be configured)');
      });

      // Add to local storage
      addWithdrawal({
        userId: user.id,
        email,
        amount: parseFloat(amount),
        currency: selectedCurrency,
        walletAddress,
        network,
        status: 'pending',
        requestDate: new Date().toISOString()
      });

      setStep('confirmation');
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('email');
    setEmail('');
    setSelectedCurrency('');
    setWalletAddress('');
    setConfirmWalletAddress('');
    setAmount('');
    setNetwork('');
    setLoading(false);
    setErrors({});
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  useEffect(() => {
    const fetchLimits = async () => {
      const limitsData = await getWithdrawalLimits();
      setLimits(limitsData);
    };

    if (isOpen && step === 'details') {
      fetchLimits();
    }
  }, [step, isOpen]);

  if (!isOpen) return null;

  const selectedCurrencyData = currencies.find(c => c.id === selectedCurrency);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <ArrowDownLeft className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">
              {step === 'email' && 'Withdrawal Verification'}
              {step === 'currency' && 'Select Currency'}
              {step === 'details' && 'Withdrawal Details'}
              {step === 'confirmation' && 'Withdrawal Submitted'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Withdrawal Rules */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2">Withdrawal Policy</h4>
                <div className="text-yellow-300 text-sm space-y-2">
                  <p>Our AI trading bots operate on high-performance GPU clusters that require sustained capital allocation for optimal market analysis and execution. To maintain system efficiency and ensure consistent returns, we implement progressive withdrawal limits:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>0-3 months:</strong> Up to 10% of invested capital</li>
                    <li><strong>3-6 months:</strong> Up to 20% of invested capital</li>
                    <li><strong>6-9 months:</strong> Up to 35% of invested capital</li>
                    <li><strong>9-12 months:</strong> Up to 50% of invested capital</li>
                    <li><strong>12+ months:</strong> Full withdrawal available</li>
                  </ul>
                  <p className="mt-2">This policy ensures our AI systems maintain the computational resources needed to generate consistent profits for all investors.</p>
                </div>
              </div>
            </div>
          </div>

          {limits.canWithdraw && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <h4 className="text-blue-400 font-semibold mb-2">Your Withdrawal Limits</h4>
              <div className="text-blue-300 text-sm">
                <p>Account active for: <strong>{limits.monthsActive} months</strong></p>
                <p>Current withdrawal limit: <strong>{limits.withdrawalPercentage}%</strong></p>
                <p>Maximum withdrawal amount: <strong>${limits.maxAmount.toFixed(2)}</strong></p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Email Verification */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-gray-400 mb-6">
                    Please enter your email address for withdrawal verification
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleEmailSubmit}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step 2: Currency Selection */}
            {step === 'currency' && (
              <motion.div
                key="currency"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-gray-400 mb-6">
                  Choose your preferred cryptocurrency for withdrawal
                </p>
                
                {currencies.map((currency) => (
                  <button
                    key={currency.id}
                    onClick={() => handleCurrencySelect(currency.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${currency.color} p-0.5`}>
                        <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                          <currency.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">{currency.name}</h3>
                        <p className="text-gray-400 text-sm">{currency.networks.join(', ')}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                  </button>
                ))}

                <button
                  onClick={() => setStep('email')}
                  className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              </motion.div>
            )}

            {/* Step 3: Withdrawal Details */}
            {step === 'details' && selectedCurrencyData && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${selectedCurrencyData.color} p-0.5`}>
                      <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                        <selectedCurrencyData.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Withdraw {selectedCurrency}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="Enter your wallet address"
                    />
                    {errors.walletAddress && (
                      <p className="text-red-400 text-sm mt-1">{errors.walletAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Wallet Address
                    </label>
                    <input
                      type="text"
                      value={confirmWalletAddress}
                      onChange={(e) => setConfirmWalletAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="Confirm your wallet address"
                    />
                    {errors.confirmWalletAddress && (
                      <p className="text-red-400 text-sm mt-1">{errors.confirmWalletAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={limits.maxAmount}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="Enter withdrawal amount"
                    />
                    {errors.amount && (
                      <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
                    )}
                    <p className="text-gray-400 text-sm mt-1">
                      Maximum: ${limits.maxAmount.toFixed(2)}
                    </p>
                  </div>

                  {selectedCurrencyData.networks.length > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Network
                      </label>
                      <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="">Select Network</option>
                        {selectedCurrencyData.networks.map((net) => (
                          <option key={net} value={net}>{net}</option>
                        ))}
                      </select>
                      {errors.network && (
                        <p className="text-red-400 text-sm mt-1">{errors.network}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('currency')}
                    className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Submit Withdrawal</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>

                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Withdrawal Request Submitted!</h3>
                  <p className="text-gray-400">
                    Your withdrawal request has been submitted successfully.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h4 className="text-blue-400 font-semibold mb-3">What happens next?</h4>
                  <ul className="text-gray-300 text-sm space-y-2 text-left">
                    <li>• Your request is being processed by our team</li>
                    <li>• Processing usually takes less than 24 hours</li>
                    <li>• You will receive an email confirmation when complete</li>
                    <li>• Funds will be sent to your specified wallet address</li>
                    <li>• You can track the status in your transactions history</li>
                  </ul>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default WithdrawalFlow;