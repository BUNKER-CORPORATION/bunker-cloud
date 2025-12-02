import { motion } from 'framer-motion';
import { ChevronRight, Send } from 'lucide-react';
import { useState } from 'react';
import ChatInterface from './ChatInterface';

export default function Hero() {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [initialMessages, setInitialMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setInitialMessages([{ text: message, isUser: true }]);
      setMessage('');
      setChatOpen(true);
    }
  };

  return (
    <section className="relative pt-16 overflow-hidden min-h-[600px] bg-gray-900">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-image-3.webp"
          alt="Bunker Cloud Background"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
      </div>

      <div className="relative z-10 w-full px-12 lg:px-24 xl:px-32 py-28 md:py-36 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Left: Content */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="text-xs font-semibold text-white uppercase tracking-wide">
                BUNKER CLOUD. SECURE INFRASTRUCTURE.
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-white"
            >
              Deploy with confidence.
              <br />
              Scale without limits.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-xl text-gray-200 mb-8 max-w-3xl"
            >
              Enterprise-grade cloud infrastructure built for modern applications. Deploy in seconds, scale automatically, and sleep soundly with military-grade security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="#pricing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-gray-900 px-8 py-4 rounded text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Start Free Trial
                </motion.button>
              </a>
              <a href="#pricing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent text-white px-8 py-4 rounded text-sm font-semibold hover:bg-white/10 transition-colors border-2 border-white"
                >
                  View Pricing
                </motion.button>
              </a>
            </motion.div>
          </div>

          {/* Right: Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:block space-y-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl pb-4 pt-2 pl-2 w-full relative min-h-[180px]">
              {/* Input field */}
              <div className="mb-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything about Bunker Cloud"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white bg-transparent placeholder-gray-400 dark:placeholder-gray-500 resize-none text-base overflow-hidden"
                />
              </div>

              {/* Disclaimer - bottom left */}
              <p className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
                Built with Bunker Enterprise, you must be 18+ to use.
              </p>

              {/* Send button - bottom right */}
              <button
                onClick={handleSendMessage}
                className="absolute bottom-4 right-4 p-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>

            {/* Suggested prompts - outside chat box */}
            {!chatOpen && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMessage('How to build and use AI agents?')}
                  className="text-left text-sm text-white hover:text-gray-200 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
                >
                  How to build and use AI agents?
                </button>
                <button
                  onClick={() => setMessage('Find a product for my use case')}
                  className="text-left text-sm text-white hover:text-gray-200 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
                >
                  Find a product for my use case
                </button>
                <button
                  onClick={() => setMessage('Discover solutions for my industry')}
                  className="text-left text-sm text-white hover:text-gray-200 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
                >
                  Discover solutions for my industry
                </button>
                <button
                  onClick={() => setMessage("Summarize what's new with Bunker Cloud")}
                  className="text-left text-sm text-white hover:text-gray-200 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
                >
                  Summarize what's new with Bunker Cloud
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chat Interface Component */}
      <ChatInterface
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMessages={initialMessages}
      />
    </section>
  );
}
