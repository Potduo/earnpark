import React, { useState, useEffect } from 'react';
import { Circle as HelpCircle, MessageCircle, Mail, Phone, Clock, User, Headphones } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ChatMessage } from '../../types';
import { getChatMessages } from '../../lib/supabaseData';

const Support: React.FC = () => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      if (user) {
        const messages = await getChatMessages(user.id);
        setChatHistory(messages);
      }
    };
    loadMessages();
  }, [user]);

  const faqs = [
    {
      question: "How do AI trading bots work?",
      answer: "Our AI trading bots use advanced machine learning algorithms to analyze market patterns, execute trades 24/7, and optimize your portfolio for maximum returns while managing risk."
    },
    {
      question: "What are the withdrawal limits?",
      answer: "Withdrawal limits are progressive: 10% (0-3 months), 20% (3-6 months), 35% (6-9 months), 50% (9-12 months), and 100% (12+ months). This ensures optimal AI performance."
    },
    {
      question: "How secure are my funds?",
      answer: "We use bank-grade security with military-grade encryption, cold storage for 95% of funds, and multi-layer protection protocols to keep your investments safe."
    },
    {
      question: "What cryptocurrencies do you support?",
      answer: "We support major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDT, and Solana (SOL) for both deposits and withdrawals."
    },
    {
      question: "How often are profits generated?",
      answer: "Our AI bots trade continuously, generating profits daily. You can track real-time performance in your dashboard with detailed analytics and trade history."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
        <p className="text-gray-400">Get help and view your support history</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Live Chat</h3>
          <p className="text-gray-400 text-sm mb-4">Get instant help from our support team</p>
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Available 24/7</span>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Email Support</h3>
          <p className="text-gray-400 text-sm mb-4">Send us detailed questions</p>
          <p className="text-blue-400 text-sm">support@earnparkpro.com</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Phone Support</h3>
          <p className="text-gray-400 text-sm mb-4">Speak with our experts</p>
          <p className="text-purple-400 text-sm">+1 (555) 123-4567</p>
        </div>
      </div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Chat History</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {chatHistory.slice(-10).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    {message.isUser ? (
                      <User className="w-4 h-4 text-green-400" />
                    ) : (
                      <Headphones className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.isUser 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-white font-medium">{faq.question}</span>
                <HelpCircle className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-2 p-4 bg-gray-700/20 rounded-lg">
                <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Response Time Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Clock className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h4 className="text-blue-400 font-semibold mb-2">Response Times</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Live Chat: Instant to 2 minutes</li>
              <li>• Email Support: Within 4 hours</li>
              <li>• Phone Support: Available 9 AM - 6 PM EST</li>
              <li>• Emergency Issues: Within 30 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;