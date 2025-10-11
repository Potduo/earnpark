import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Bot, Zap, BarChart3, Activity, DollarSign, Bitcoin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock market data
const cryptoData = [
  { name: 'Bitcoin', symbol: 'BTC', price: 45234.67, change: 2.34, volume: '28.5B', icon: Bitcoin },
  { name: 'Ethereum', symbol: 'ETH', price: 3456.78, change: -1.23, volume: '15.2B', icon: Activity },
  { name: 'USDT', symbol: 'USDT', price: 1.00, change: 0.01, volume: '45.8B', icon: DollarSign },
  { name: 'BNB', symbol: 'BNB', price: 312.45, change: 3.67, volume: '2.1B', icon: TrendingUp },
];

const chartData = [
  { time: '00:00', BTC: 44800, ETH: 3400, volume: 1200 },
  { time: '04:00', BTC: 45100, ETH: 3420, volume: 1350 },
  { time: '08:00', BTC: 44950, ETH: 3380, volume: 1180 },
  { time: '12:00', BTC: 45300, ETH: 3450, volume: 1420 },
  { time: '16:00', BTC: 45150, ETH: 3430, volume: 1380 },
  { time: '20:00', BTC: 45234, ETH: 3456, volume: 1450 },
];

const tradingBots = [
  { id: 1, name: 'Alpha Bot', status: 'active', profit: '+12.4%', trades: 1247, icon: Bot },
  { id: 2, name: 'Beta Trader', status: 'active', profit: '+8.9%', trades: 892, icon: Zap },
  { id: 3, name: 'Gamma AI', status: 'active', profit: '+15.2%', trades: 1456, icon: BarChart3 },
  { id: 4, name: 'Delta Pro', status: 'paused', profit: '+6.7%', trades: 634, icon: Activity },
];

const Markets: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [liveData, setLiveData] = useState(chartData);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prevData => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];
        const newPoint = {
          ...lastPoint,
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          BTC: lastPoint.BTC + (Math.random() - 0.5) * 100,
          ETH: lastPoint.ETH + (Math.random() - 0.5) * 50,
          volume: lastPoint.volume + (Math.random() - 0.5) * 200,
        };
        return [...newData.slice(1), newPoint];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Markets</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time cryptocurrency markets with AI-powered trading bots working around the clock to maximize your profits.
            </p>
          </motion.div>

          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {cryptoData.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer ${
                  selectedCrypto === crypto.symbol ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedCrypto(crypto.symbol)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center">
                      <crypto.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{crypto.symbol}</h3>
                      <p className="text-gray-400 text-sm">{crypto.name}</p>
                    </div>
                  </div>
                  {crypto.change >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Price</span>
                    <span className="text-white font-semibold">${crypto.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">24h Change</span>
                    <span className={`font-semibold ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Volume</span>
                    <span className="text-gray-300 text-sm">${crypto.volume}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Live Trading Chart</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedCrypto === 'BTC' ? 'BTC' : 'ETH'} 
                    stroke="#10B981" 
                    strokeWidth={2}
                    fill="url(#colorGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Trading Bots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">AI Trading Bots in Action</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tradingBots.map((bot, index) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-gray-700/50 border border-gray-600 rounded-xl p-6 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center">
                      <bot.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      bot.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {bot.status}
                    </div>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2">{bot.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Profit</span>
                      <span className="text-green-400 font-semibold">{bot.profit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Trades</span>
                      <span className="text-gray-300">{bot.trades.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {bot.status === 'active' && (
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Trading now</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Market Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Market Performance Today</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">+2.4%</div>
                  <div className="text-gray-400">Portfolio Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">1,247</div>
                  <div className="text-gray-400">Trades Executed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">$45.2M</div>
                  <div className="text-gray-400">Volume Traded</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Markets;