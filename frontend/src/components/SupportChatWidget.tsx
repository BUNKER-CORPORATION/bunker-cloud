import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minus, User, Bot, Smile } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface SupportChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  initialMessage?: string;
}

// Simulated support responses
const supportResponses: { [key: string]: string } = {
  default: "Thanks for reaching out! I'm here to help. Could you tell me more about what you need assistance with?",
  greeting: "Hello! Welcome to Bunker Cloud Support. How can I assist you today?",
  billing: "I can help you with billing questions. Our billing team is also available at billing@bunkercloud.com for complex inquiries. What specific billing question do you have?",
  technical: "I understand you're experiencing a technical issue. Let me help troubleshoot. Can you describe the problem in more detail, including any error messages you're seeing?",
  account: "I can help with account-related questions. What would you like to know about your account?",
  pricing: "Great question about pricing! Bunker Cloud offers flexible plans starting from our free tier. Would you like me to explain our pricing tiers or help you find the best plan for your needs?",
  human: "I'll connect you with a human support agent. Please hold on while I transfer you. Our average wait time is under 2 minutes.",
};

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return supportResponses.greeting;
  }
  if (lowerMessage.includes('billing') || lowerMessage.includes('invoice') || lowerMessage.includes('payment') || lowerMessage.includes('charge')) {
    return supportResponses.billing;
  }
  if (lowerMessage.includes('error') || lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('not working') || lowerMessage.includes('bug')) {
    return supportResponses.technical;
  }
  if (lowerMessage.includes('account') || lowerMessage.includes('password') || lowerMessage.includes('login') || lowerMessage.includes('sign')) {
    return supportResponses.account;
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
    return supportResponses.pricing;
  }
  if (lowerMessage.includes('human') || lowerMessage.includes('agent') || lowerMessage.includes('person') || lowerMessage.includes('real')) {
    return supportResponses.human;
  }

  return supportResponses.default;
}

export default function SupportChatWidget({ isOpen, onClose, onMinimize, initialMessage }: SupportChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "Hi there! Welcome to Bunker Cloud Support. I'm your AI assistant, and I can help answer questions or connect you with our support team. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  // Handle initial message from props
  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 1) {
      // Send the initial message automatically
      handleSendMessage(initialMessage);
    }
  }, [isOpen, initialMessage, messages.length]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, { ...userMessage, status: 'sent' }]);
    setInputValue('');

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate response delay (1-2 seconds)
    const delay = 1000 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    setIsTyping(false);

    const response = getResponse(messageText);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-gray-900 dark:bg-gray-800 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {agentOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 dark:border-gray-800" />
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Bunker Support</h3>
                <p className="text-gray-400 text-xs">
                  {agentOnline ? 'Online • Usually replies instantly' : 'Away • Will reply soon'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onMinimize && (
                <button
                  onClick={onMinimize}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser
                      ? 'bg-gray-900 dark:bg-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {message.isUser ? (
                      <User className="w-3.5 h-3.5 text-white dark:text-gray-900" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    message.isUser
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${
                      message.isUser
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendMessage("I have a billing question")}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Billing help
                </button>
                <button
                  onClick={() => handleSendMessage("I'm having a technical issue")}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Technical issue
                </button>
                <button
                  onClick={() => handleSendMessage("I'd like to speak with a human")}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Talk to human
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2.5 pr-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
              Powered by Bunker AI • Response time: ~5 min
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
