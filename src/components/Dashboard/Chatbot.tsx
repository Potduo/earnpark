import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, User, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getChatMessages, addChatMessage } from '../../lib/supabaseData';
import { ChatMessage } from '../../types';

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (user && isOpen) {
        const userMessages = await getChatMessages(user.id);

        if (userMessages.length === 0) {
          const welcomeMessage: ChatMessage = {
            id: 'welcome',
            userId: user.id,
            message: "Hello! I'm here to help you with any questions about your EarnParkPro account. How can I assist you today?",
            timestamp: new Date().toISOString(),
            isUser: false,
            status: 'sent'
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(userMessages);
        }
      }
    };
    loadMessages();
  }, [user, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isUser: true,
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      // Submit to Netlify Forms (for human agent)
      const formData = new FormData();
      formData.append('form-name', 'chat-message');
      formData.append('user_id', user.id);
      formData.append('user_email', user.email);
      formData.append('user_name', user.full_name);
      formData.append('message', userMessage.message);
      formData.append('timestamp', userMessage.timestamp);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      }).catch(() => {
        console.log('Chat message form submission attempted');
      });

      const savedMessage = await addChatMessage(user.id, {
        message: userMessage.message,
        timestamp: userMessage.timestamp,
        isUser: true,
        status: 'sent'
      });

      // Update message status
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // Simulate agent response (in real implementation, this would come from webhook)
      setTimeout(() => {
        const agentResponse: ChatMessage = {
          id: `agent_${Date.now()}`,
          userId: user.id,
          message: "Thank you for your message! A human agent will review your inquiry and respond shortly. In the meantime, you can check our FAQ section or contact us directly at support@earnparkpro.com for urgent matters.",
          timestamp: new Date().toISOString(),
          isUser: false,
          status: 'sent'
        };

        addChatMessage(user.id, agentResponse);
        setMessages(prev => [...prev, agentResponse]);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'failed' } : msg
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Support Chat</h3>
                  <p className="text-gray-400 text-sm">We're here to help!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
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
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                        {message.isUser && message.status && (
                          <span className={`text-xs ${
                            message.status === 'sent' ? 'text-green-300' :
                            message.status === 'sending' ? 'text-yellow-300' :
                            'text-red-300'
                          }`}>
                            {message.status === 'sent' ? '✓' : 
                             message.status === 'sending' ? '⏳' : '✗'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-500/20 w-8 h-8 rounded-full flex items-center justify-center">
                      <Headphones className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || loading}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;