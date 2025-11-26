import { motion } from 'framer-motion';
import { Send, Info, Paperclip } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useGeminiChat } from '../hooks/useGeminiChat';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isUser: boolean;
}

interface RelatedResource {
  title: string;
  url: string;
  description: string;
}

interface MessageResources {
  [messageIndex: number]: RelatedResource[];
}

interface MessageQuestions {
  [messageIndex: number]: string[];
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessages?: Message[];
}

export default function ChatInterface({ isOpen, onClose, initialMessages = [] }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading, setMessages } = useGeminiChat(initialMessages);
  const [messageResources, setMessageResources] = useState<MessageResources>({});
  const [messageQuestions, setMessageQuestions] = useState<MessageQuestions>({});
  const [visibleMessageIndex, setVisibleMessageIndex] = useState<number | null>(null);
  const [showAllResources, setShowAllResources] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messageHeights, setMessageHeights] = useState<{ [key: number]: number }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Parse related resources and suggested questions from all AI messages
  useEffect(() => {
    const resourcesMap: MessageResources = {};
    const questionsMap: MessageQuestions = {};

    messages.forEach((msg, idx) => {
      if (!msg.isUser) {
        // Remove the RELATED_RESOURCES section from the text
        const cleanText = msg.text.replace(/---RELATED_RESOURCES---[\s\S]*?---END_RESOURCES---/, '');

        // Find all inline markdown links with parenthetical references
        const resources: RelatedResource[] = [];
        const linkPattern = /\(([^)]+)\)[^[]*?\[\]\((https?:\/\/[^)]+)\)/g;
        let match;

        while ((match = linkPattern.exec(cleanText)) !== null) {
          const title = match[1];
          const url = match[2];

          if (!resources.some(r => r.url === url)) {
            resources.push({
              title: title,
              url: url,
              description: title
            });
          }
        }

        if (resources.length > 0) {
          resourcesMap[idx] = resources;
        }

        // Parse suggested questions
        const questionsMatch = msg.text.match(/---SUGGESTED_QUESTIONS---\n([\s\S]*?)\n---END_QUESTIONS---/);
        if (questionsMatch) {
          const questionsText = questionsMatch[1];
          const questions = questionsText
            .split('\n')
            .map(q => q.trim())
            .filter(q => q.length > 0);

          if (questions.length > 0) {
            questionsMap[idx] = questions;
          }
        }
      }
    });

    setMessageResources(resourcesMap);
    setMessageQuestions(questionsMap);
    console.log('Parsed resources:', resourcesMap);
    console.log('Parsed questions:', questionsMap);
    console.log('Visible message index:', visibleMessageIndex);

    // Set the latest AI message as visible by default
    const latestAiIndex = messages.map((m, i) => ({ m, i })).filter(({ m }) => !m.isUser).pop()?.i;
    if (latestAiIndex !== undefined && !visibleMessageIndex) {
      setVisibleMessageIndex(latestAiIndex);
    }
  }, [messages]);

  // Measure AI message heights for sidebar positioning
  useEffect(() => {
    // Use timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const heights: { [key: number]: number } = {};

      messages.forEach((msg, idx) => {
        if (!msg.isUser) {
          const element = document.getElementById(`ai-message-${idx}`);
          if (element) {
            const height = element.offsetHeight;
            heights[idx] = height;
            console.log(`Message ${idx} height:`, height, element);
          } else {
            console.log(`Element ai-message-${idx} not found`);
          }
        }
      });

      setMessageHeights(heights);
      console.log('All message heights:', heights);
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  // Sync sidebar scroll with messages scroll
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    const sidebar = sidebarRef.current;

    if (!messagesContainer || !sidebar) return;

    const handleScroll = () => {
      sidebar.scrollTop = messagesContainer.scrollTop;
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    return () => messagesContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Update messages when initialMessages prop changes and send to API
  useEffect(() => {
    if (initialMessages.length > 0 && initialMessages[0]?.isUser) {
      // Set initial messages first
      setMessages(initialMessages);
      // Send to API but skip adding user message again (it's already in initialMessages)
      sendMessage(initialMessages[0].text, true);
    }
  }, [initialMessages]);

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = message;
      setMessage('');
      await sendMessage(userMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 overflow-hidden px-0 w-screen"
    >
      <div className="h-full w-full relative overflow-x-hidden overflow-y-hidden">
        <div className="flex h-full w-full overflow-x-hidden overflow-y-hidden">
          {/* Left Panel: Chat */}
          <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-hidden relative w-full max-w-full">
          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-8 md:px-16 lg:px-64 xl:px-96 2xl:px-[512px] py-8 relative scrollbar-hide w-full max-w-full">

            <div className="w-full max-w-full mx-auto space-y-6 p-4 relative overflow-x-hidden min-w-0">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  id={`message-${idx}`}
                  data-message-index={idx}
                  className="relative w-full max-w-full overflow-hidden"
                >
                  {msg.isUser ? (
                    <div className="flex gap-6 w-full max-w-full overflow-hidden">
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-base text-gray-900">{msg.text}</p>
                        </div>
                      </div>
                      <div className="hidden lg:block lg:w-80 xl:w-96 lg:flex-shrink-0"></div>
                    </div>
                  ) : (
                    <div className="relative p-4 rounded-lg overflow-hidden min-w-0 max-w-full" id={`ai-message-${idx}`}>
                      <div className="flex flex-col xl:flex-row gap-6">
                      {/* AI message content */}
                      <div className="flex-1 min-w-0 overflow-hidden xl:overflow-visible">
                        {/* Show info icon only on first AI message */}
                        {idx === 1 && (
                          <div className="group inline-block absolute -left-8 top-1">
                            <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
                            <div className="invisible group-hover:visible absolute left-0 top-6 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                              <p className="leading-relaxed">
                                Please Note: Bunker AI is currently powered by the latest foundational models developed by Google. We leverage this industry-leading technology for the best possible initial performance and accuracy. This transparency remains in place until such time as we have fully trained and validated our proprietary, specialized models for Bunker Cloud services.
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-900 prose-strong:font-bold prose-strong:text-gray-900">
                          <ReactMarkdown
                            components={{
                              p: ({children}) => <p className="mb-4 leading-relaxed text-gray-900">{children}</p>,
                              h1: ({children}) => <h1 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h1>,
                              h2: ({children}) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900">{children}</h2>,
                              h3: ({children}) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">{children}</h3>,
                              strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                              ul: ({children}) => <ul className="list-disc ml-6 my-4 space-y-2">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal ml-6 my-4 space-y-2">{children}</ol>,
                              li: ({children}) => <li className="text-gray-900 leading-relaxed">{children}</li>,
                              code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
                              a: ({href}) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-700 inline-flex items-center ml-1"
                                  title={href}
                                >
                                  <Paperclip className="w-3.5 h-3.5" />
                                </a>
                              ),
                            }}
                          >
                            {msg.text
                              .replace(/---RELATED_RESOURCES---[\s\S]*?---END_RESOURCES---/, '')
                              .replace(/---SUGGESTED_QUESTIONS---[\s\S]*?---END_QUESTIONS---/, '')}
                          </ReactMarkdown>
                        </div>

                        {/* Suggested follow-up questions */}
                        {!isLoading && idx === messages.length - 1 && messageQuestions[idx] && messageQuestions[idx].length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-3">
                            {messageQuestions[idx].map((question, qIdx) => (
                              <button
                                key={qIdx}
                                onClick={() => {
                                  setMessage(question);
                                }}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                              >
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                <span>{question}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Related Resources and Products */}
                      <div className="w-full xl:w-80 2xl:w-96 xl:flex-shrink-0 overflow-hidden">
                        <div className="xl:sticky xl:top-6 space-y-4 md:space-y-0 md:space-x-4 md:flex md:flex-row xl:flex-col xl:space-x-0 xl:space-y-4 overflow-hidden">
                        {/* Related Resources */}
                        {messageResources[idx] && messageResources[idx].length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:flex-1">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Related resources</h3>
                            <div className="space-y-1">
                              {messageResources[idx].slice(0, 3).map((resource, ridx) => {
                                const resourceType = resource.url.includes('/docs/') ? 'Documentation'
                                  : resource.url.includes('/guides/') ? 'Guide'
                                  : resource.url.includes('/blog/') ? 'Blog'
                                  : 'Resource';

                                return (
                                  <a key={ridx} href={resource.url} target="_blank" rel="noopener noreferrer" className="block group py-2">
                                    <h4 className="text-sm font-normal text-gray-900 mb-1 group-hover:underline">
                                      {resource.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                      {resource.description}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <span className="text-xs text-gray-500">{resourceType}</span>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Related Products */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:flex-1">
                          <h3 className="text-sm font-medium text-gray-700 mb-4">Related products</h3>
                          <div className="space-y-3">
                            <a href="https://bunkercloud.com/products/vault-compute" target="_blank" rel="noopener noreferrer" className="block group">
                              <h4 className="text-sm font-normal text-gray-900 mb-1 group-hover:underline">
                                The Vault Compute Service
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                Secure, scalable compute infrastructure
                              </p>
                            </a>
                            <a href="https://bunkercloud.com/products/fortress-storage" target="_blank" rel="noopener noreferrer" className="block group">
                              <h4 className="text-sm font-normal text-gray-900 mb-1 group-hover:underline">
                                Fortress Storage Units
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                High-performance object storage
                              </p>
                            </a>
                            <a href="https://bunkercloud.com/products/shield-network" target="_blank" rel="noopener noreferrer" className="block group">
                              <h4 className="text-sm font-normal text-gray-900 mb-1 group-hover:underline">
                                Shield Network Security
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                Advanced network protection
                              </p>
                            </a>
                          </div>
                        </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input Area at bottom */}
          <div className="px-4 sm:px-8 md:px-16 lg:px-64 xl:px-96 2xl:px-[512px] py-3 bg-white relative z-20">
            {/* Gradient overlay for shadow effect */}
            <div className="absolute -top-12 left-0 right-0 h-12 pointer-events-none" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 90%, rgba(255,255,255,1) 100%)'}}></div>
            <div className="w-full mx-auto">
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="bg-white rounded-2xl border border-gray-200 pb-3 pt-2 pl-2 pr-2 relative min-h-[120px]">
                    {/* Input field */}
                    <div className="mb-3">
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
                        rows={2}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none text-sm overflow-hidden disabled:opacity-50"
                      />
                    </div>

                    {/* Disclaimer - bottom left */}
                    <p className="absolute bottom-3 left-3 text-xs text-gray-500">
                      Built with Bunker Enterprise
                    </p>

                    {/* Send button - bottom right */}
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !message.trim()}
                      className="absolute bottom-3 right-3 p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="animate-spin h-[18px] w-[18px] border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block lg:w-80 xl:w-96 lg:flex-shrink-0"></div>
              </div>
            </div>
          </div>
          </div>
          {/* Close button - moved to top right */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
