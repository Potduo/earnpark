import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, Users, Globe, Zap, TrendingUp, CheckCircle } from 'lucide-react';

const trustFeatures = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Military-grade encryption and multi-layer security protocols protect your investments 24/7.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Award,
    title: 'Regulated & Licensed',
    description: 'Fully compliant with international financial regulations and licensed in 180+ countries.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Users,
    title: '180K+ Active Users',
    description: 'Join a thriving community of successful investors from around the globe.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: TrendingUp,
    title: 'Proven Track Record',
    description: '5+ years of consistent returns with an average annual profit of 24.7%.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Lock,
    title: 'Cold Storage',
    description: '95% of funds stored in offline cold wallets with institutional-grade custody.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Globe,
    title: 'Global Presence',
    description: 'Operating worldwide with local support teams and regulatory compliance.',
    color: 'from-teal-500 to-green-500'
  },
  {
    icon: Zap,
    title: 'AI-Powered Trading',
    description: 'Advanced machine learning algorithms with 99.7% uptime and lightning-fast execution.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: CheckCircle,
    title: 'Transparent Operations',
    description: 'Real-time portfolio tracking, detailed reports, and complete transparency in all operations.',
    color: 'from-cyan-500 to-blue-500'
  }
];

const TrustSection: React.FC = () => {
  return (
    <div className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Trust</span> EarnParkPro?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built on a foundation of security, transparency, and proven results. Your financial future is our priority.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Your Security is Our Priority</h3>
            <p className="text-gray-300 mb-6">
              We employ the same security standards used by major banks and financial institutions worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">$2.8B+</div>
                <div className="text-gray-400">Secured Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                <div className="text-gray-400">Security Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
                <div className="text-gray-400">Security Breaches</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrustSection;