import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Globe, TrendingUp, Shield, Zap, Target, Heart } from 'lucide-react';

const stats = [
  { label: 'Active Users', value: '180K+', icon: Users },
  { label: 'Assets Managed', value: '$2.8B+', icon: TrendingUp },
  { label: 'Countries', value: '180+', icon: Globe },
  { label: 'Years Experience', value: '5+', icon: Award },
];

const team = [
  {
    name: 'Eugene Netso',
    role: 'CEO & Founder',
    image: '/src/assets/eugene-netso.webp',
    bio: 'Former Goldman Sachs VP with 15+ years in quantitative trading and fintech innovation.'
  },
  {
    name: 'Aaron Horwitz',
    role: 'CTO',
    image: '/src/assets/aaron-horwtiz.webp',
    bio: 'Ex-Google AI researcher specializing in machine learning algorithms for financial markets.'
  },
  {
    name: 'Nick Nazmov',
    role: 'Head of Trading',
    image: '/src/assets/nick-nazmov.webp',
    bio: 'Quantitative analyst with a PhD in Financial Mathematics from MIT.'
  }
];

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We prioritize the security of your investments above all else, implementing bank-grade protection.'
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'Constantly pushing the boundaries of AI and machine learning in financial technology.'
  },
  {
    icon: Heart,
    title: 'Customer Success',
    description: 'Your financial success is our success. We\'re committed to helping you achieve your goals.'
  },
  {
    icon: Zap,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from technology to customer service.'
  }
];

const About: React.FC = () => {
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
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">EarnParkPro</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're revolutionizing the way people invest in cryptocurrency through advanced AI technology and institutional-grade security.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 mb-20 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize access to sophisticated investment strategies by leveraging cutting-edge AI technology. 
              We believe everyone deserves the opportunity to build wealth through intelligent, automated trading systems 
              that were once only available to institutional investors.
            </p>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-green-400 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Join Our Journey</h3>
              <p className="text-gray-300 mb-6">
                Be part of the financial revolution. Start your journey to financial freedom with EarnParkPro today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  Get Started
                </button>
                <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;