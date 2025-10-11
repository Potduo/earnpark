import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    location: 'Singapore',
    profit: '12,450%',
    amount: '$50,000',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    text: 'EarnParkPro transformed my financial future. Starting with just $500, I\'ve seen incredible returns through their AI trading bots.',
    timeframe: '18 months'
  },
  {
    name: 'Marcus Johnson',
    location: 'New York, USA',
    profit: '8,900%',
    amount: '$125,000',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    text: 'The automated trading system is phenomenal. I sleep peacefully knowing my investments are growing 24/7.',
    timeframe: '14 months'
  },
  {
    name: 'Elena Rodriguez',
    location: 'Madrid, Spain',
    profit: '15,670%',
    amount: '$89,000',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    text: 'From a small investment to financial independence. EarnParkPro\'s AI bots consistently outperform the market.',
    timeframe: '22 months'
  },
  {
    name: 'David Kim',
    location: 'Seoul, South Korea',
    profit: '11,200%',
    amount: '$67,500',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    text: 'Professional-grade trading algorithms accessible to everyone. My portfolio has grown beyond my wildest dreams.',
    timeframe: '16 months'
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real People, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Real Results</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of investors who have achieved extraordinary returns with our AI-powered trading platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500/20 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-bold text-xl">+{testimonial.profit}</span>
                    </div>
                    <p className="text-gray-400 text-sm">in {testimonial.timeframe}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-lg">{testimonial.amount}</p>
                    <p className="text-gray-400 text-sm">Current Value</p>
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-300 italic leading-relaxed">
                "{testimonial.text}"
              </blockquote>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Join the Success Stories</h3>
            <p className="text-gray-400 mb-6">
              Average investor return: <span className="text-green-400 font-semibold">24.7% annually</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">180K+</div>
                <div className="text-gray-400">Active Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">$2.8B+</div>
                <div className="text-gray-400">Assets Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">99.7%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;