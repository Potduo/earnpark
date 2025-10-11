import React, { useState } from 'react';
import { X, Bitcoin, DollarSign, Activity, CheckCircle, Copy, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import QRCode from 'qrcode';

interface DepositFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositFlow: React.FC<DepositFlowProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'currency' | 'terms' | 'payment' | 'confirmation'>('currency');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currencies = [
    { 
      id: 'BTC', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: Bitcoin,
      color: 'from-orange-500 to-yellow-500',
      network: 'Bitcoin Network',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    { 
      id: 'ETH', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: Activity,
      color: 'from-blue-500 to-purple-500',
      network: 'Ethereum Network (ERC-20)',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e'
    },
    { 
      id: 'USDT', 
      name: 'USDT', 
      symbol: 'USDT', 
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      network: 'Tron Network (TRC-20)',
      address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5ANLG7Q'
    },
    { 
      id: 'SOL', 
      name: 'Solana', 
      symbol: 'SOL', 
      icon: Activity,
      color: 'from-purple-500 to-indigo-500',
      network: 'Solana Network',
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
    }
  ];

  const handleCurrencySelect = (currencyId: string) => {
    setSelectedCurrency(currencyId);
    setStep('terms');
  };

  const handleTermsAccept = async () => {
    if (!termsAccepted) return;
    
    setLoading(true);
    
    try {
      const selectedCurrencyData = currencies.find(c => c.id === selectedCurrency);
      if (selectedCurrencyData) {
        // Generate QR code
        const qrUrl = await QRCode.toDataURL(selectedCurrencyData.address, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrUrl);
      }

      setStep('payment');
    } catch (err) {
      console.error('Error in terms accept:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmitted = async () => {
    setLoading(true);
    
    try {
      // Submit form to Netlify (if configured)
      const formData = new FormData();
      formData.append('form-name', 'deposit-notification');
      formData.append('currency', selectedCurrency);
      formData.append('wallet_address', currencies.find(c => c.id === selectedCurrency)?.address || '');
      formData.append('timestamp', new Date().toISOString());
      formData.append('user_email', user?.email || '');
      formData.append('user_id', user?.id || '');

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      }).catch(() => {
        // Ignore form submission errors for now
        console.log('Form submission attempted (may not be configured)');
      });

      console.log('Deposit notification submitted successfully');
    } catch (error) {
      console.error('Error submitting deposit notification:', error);
    }

    setLoading(false);
    setStep('confirmation');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetFlow = () => {
    setStep('currency');
    setSelectedCurrency('');
    setQrCodeUrl('');
    setTermsAccepted(false);
    setLoading(false);
    setCopied(false);
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

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
          <h2 className="text-xl font-semibold text-white">
            {step === 'currency' && 'Select Currency'}
            {step === 'terms' && 'Terms & Conditions'}
            {step === 'payment' && `Send ${selectedCurrency}`}
            {step === 'confirmation' && 'Payment Submitted'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Currency Selection */}
            {step === 'currency' && (
              <motion.div
                key="currency"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-gray-400 mb-6">
                  Choose your preferred cryptocurrency for deposit
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
                        <p className="text-gray-400 text-sm">{currency.network}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 2: Terms & Conditions */}
            {step === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gray-700/30 rounded-lg p-6 max-h-64 overflow-y-auto">
                  <h3 className="text-white font-semibold mb-4">Deposit Terms & Conditions</h3>
                  <div className="text-gray-300 text-sm space-y-3">
                    <p>
                      By proceeding with this deposit, you acknowledge and agree to the following terms:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-400">
                      <li>All cryptocurrency transactions are irreversible</li>
                      <li>You are responsible for sending funds to the correct wallet address and network</li>
                      <li>Minimum deposit amount is $100 USD equivalent</li>
                      <li>Deposits may take 1-6 network confirmations to process</li>
                      <li>EarnParkPro is not responsible for funds sent to incorrect addresses or wrong networks</li>
                      <li>All investments carry risk and past performance does not guarantee future results</li>
                      <li>You confirm that you are legally allowed to invest in your jurisdiction</li>
                      <li>Deposit processing may take 10-30 minutes to reflect in your dashboard after blockchain confirmation</li>
                      <li>AI trading bots will begin operating once your deposit is confirmed</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="terms" className="text-gray-300 text-sm">
                    I have read and agree to the deposit terms and conditions above
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('currency')}
                    className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleTermsAccept}
                    disabled={!termsAccepted || loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && selectedCurrencyData && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${selectedCurrencyData.color} p-0.5`}>
                      <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                        <selectedCurrencyData.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Fund Your Wallet with {selectedCurrency}
                      </h3>
                      <p className="text-gray-400 text-sm">Deposit to your personal wallet</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="Wallet QR Code" className="w-48 h-48" />
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Network Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-blue-400 font-semibold">Network Type</h4>
                  </div>
                  <p className="text-blue-300 text-lg font-semibold">{selectedCurrencyData.network}</p>
                  <p className="text-blue-200 text-sm mt-1">Ensure you're sending from the correct network</p>
                </div>

                {/* Wallet Address */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Your Wallet Address</span>
                    <button
                      onClick={() => copyToClipboard(selectedCurrencyData.address)}
                      className="flex items-center space-x-1 text-green-400 hover:text-green-300 text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm text-white break-all">
                    {selectedCurrencyData.address}
                  </div>
                </div>

                {/* Security Guidelines */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-2">Security Guidelines</h4>
                      <ul className="text-yellow-300 text-sm space-y-1">
                        <li>• Double-check the wallet address before sending</li>
                        <li>• Only send {selectedCurrency} to this address</li>
                        <li>• Network: {selectedCurrencyData.network}</li>
                        <li>• Minimum deposit: $100 USD equivalent</li>
                        <li>• Allow 1-6 network confirmations for processing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Deposit Instructions</h4>
                  <ol className="text-blue-300 text-sm space-y-1">
                    <li>1. Copy your wallet address above or scan the QR code</li>
                    <li>2. Open your {selectedCurrency} wallet or exchange</li>
                    <li>3. Send your desired amount to your wallet address</li>
                    <li>4. Ensure you select the {selectedCurrencyData.network}</li>
                    <li>5. Wait for blockchain confirmation (typically 1-6 confirmations)</li>
                    <li>6. Click "I Have Made Payment" below once transaction is sent</li>
                  </ol>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('terms')}
                    className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePaymentSubmitted}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>I Have Made Payment</span>
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
                  <h3 className="text-white font-semibold text-lg mb-2">Deposit Notification Sent!</h3>
                  <p className="text-gray-400">
                    Thank you for notifying us of your deposit. Your funds will be reflected in your dashboard once the transaction is confirmed on the blockchain.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h4 className="text-blue-400 font-semibold mb-3">What's Next?</h4>
                  <ul className="text-gray-300 text-sm space-y-3 text-left">
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 mt-1 font-bold">1.</span>
                      <span>Your transaction is being processed on the blockchain</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 mt-1 font-bold">2.</span>
                      <span>Funds typically reflect within 10-30 minutes after blockchain confirmation</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 mt-1 font-bold">3.</span>
                      <span>AI trading bots will begin operating once your deposit is confirmed</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 mt-1 font-bold">4.</span>
                      <span>You can check your transaction status in the Transactions tab</span>
                    </li>
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

export default DepositFlow;