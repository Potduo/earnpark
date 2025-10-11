import React from 'react';
import { motion } from 'framer-motion';
import { Bot, TrendingUp, Shield, Globe, Zap, BarChart3, Lock, Users, Clock, Award, Smartphone, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Trading Bots',
    description: 'Advanced machine learning algorithms that analyze market patterns and execute trades 24/7 with precision.',
    benefits: ['99.7% uptime', 'Millisecond execution', 'Risk management'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: TrendingUp,
    title: 'Smart Portfolio Management',
    description: 'Diversified investment strategies across multiple cryptocurrencies and traditional indices.',
    benefits: ['Auto-rebalancing', 'Risk optimization', 'Performance tracking'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Military-grade encryption, cold storage, and multi-layer security protocols protect your assets.',
    benefits: ['256-bit encryption', 'Cold storage', 'Insurance coverage'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Globe,
    title: 'Global Market Access',
    description: 'Trade across international markets with support for 50+ cryptocurrencies and major indices.',
    benefits: ['24/7 trading', '50+ currencies', 'Global markets'],
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time performance tracking, detailed reports, and predictive market analysis.',
    benefits: ['Real-time data', 'Custom reports', 'Market insights'],
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile Trading',
    description: 'Full-featured mobile app for iOS and Android with all desktop functionality.',
    benefits: ['Native apps', 'Push notifications', 'Offline access'],
    color: 'from-teal-500 to-green-500'
  }
];

const additionalFeatures = [
  { icon: Lock, title: 'Two-Factor Authentication', description: 'Enhanced account security' },
  { icon: Users, title: 'Social Trading', description: 'Copy successful traders' },
  { icon: Clock, title: 'Instant Deposits', description: 'Quick fund transfers' },
  { icon: Award, title: 'VIP Support', description: '24/7 priority assistance' },
  { icon: Zap, title: 'Lightning Fast', description: 'Sub-second execution' },
  { icon: HeadphonesIcon, title: 'Expert Support', description: 'Dedicated account managers' }
];

const Features: React.FC = () => {
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
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Features</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the advanced tools and technologies that make EarnParkPro the world's leading crypto investment platform.
            </p>
          </motion.div>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              And Much <span className="text-green-400">More</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors"
                >
                  <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience These Features?</h3>
              <p className="text-gray-300 mb-6">
                Join over 180,000 investors who are already using EarnParkPro's advanced features to grow their wealth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  Start Free Trial
                </button>
                <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  Schedule Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features;