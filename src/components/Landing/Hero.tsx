import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Shield, Globe, ArrowRight, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  useEffect(() => {
    // Submit homepage visit form when component mounts
    const submitVisitForm = async () => {
      try {
        // Get user's IP and location
        const ipResponse = await fetch('https://ipapi.co/json/').catch(() => null);
        const locationData = ipResponse ? await ipResponse.json() : {};
        
        const formData = new FormData();
        formData.append('form-name', 'homepage-visit');
        formData.append('ip_address', locationData.ip || 'Unknown');
        formData.append('location', `${locationData.city || 'Unknown'}, ${locationData.region || 'Unknown'}, ${locationData.country_name || 'Unknown'}`);
        formData.append('timestamp', new Date().toISOString());
        formData.append('user_agent', navigator.userAgent);

        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData as any).toString()
        }).catch(() => {
          console.log('Homepage visit form submission attempted');
        });
      } catch (error) {
        console.log('Error submitting homepage visit form:', error);
      }
    };

    submitVisitForm();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-full border border-green-500/30 mb-6">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Trading Bots</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Unlock Global
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Financial Freedom
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
              Join millions worldwide who trust our advanced AI trading bots to
              <span className="text-green-400 font-semibold"> automatically trade crypto and indices</span>,
              generating consistent returns while you sleep.
            </p>

            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Professional-grade algorithms. Institutional security. Retail accessibility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Earning Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/features"
              className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-800/50"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI Trading Bots</h3>
              <p className="text-gray-400 text-sm">Advanced algorithms trade 24/7 across global markets</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Smart Indices</h3>
              <p className="text-gray-400 text-sm">Diversified portfolio management with optimal risk-reward</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-gray-400 text-sm">Military-grade encryption and multi-layer protection</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="bg-yellow-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Global Access</h3>
              <p className="text-gray-400 text-sm">Available worldwide with local currency support</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">$2.8B+</div>
              <div className="text-gray-400">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">180K+</div>
              <div className="text-gray-400">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">24.7%</div>
              <div className="text-gray-400">Average Annual Return</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
