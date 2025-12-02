import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Send,
  ChevronRight,
  ChevronDown,
  Code,
  Server,
  Shield,
  Zap,
  ArrowUpRight,
  Headphones,
  BookOpen,
  Play,
  Users,
  ExternalLink,
  Newspaper,
  CreditCard,
  Globe,
  Database,
  Key,
  GitBranch,
  Copy,
  Check,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatInterface from '../components/ChatInterface';
import SupportChatWidget from '../components/SupportChatWidget';

const faqs = [
  {
    question: 'How do I get started with Bunker Cloud?',
    answer: 'Sign up for a free account, then follow our quickstart guide to deploy your first application in under 5 minutes. Our platform supports Docker containers, static sites, and full-stack applications.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for enterprise customers. All payments are processed securely through Stripe.'
  },
  {
    question: 'Can I migrate my existing infrastructure?',
    answer: 'Yes! We offer free migration assistance for all paid plans. Our team will help you move your applications, databases, and configurations with zero downtime.'
  },
  {
    question: 'What is your uptime guarantee?',
    answer: 'We guarantee 99.99% uptime for all production workloads. This is backed by our SLA, which provides service credits if we fall short of this commitment.'
  },
  {
    question: 'How does billing work?',
    answer: 'We offer flexible billing options including monthly and annual plans. You only pay for the resources you use, with no hidden fees. Enterprise customers can request custom billing arrangements.'
  }
];

const popularArticles = [
  {
    id: 'getting-started',
    title: 'Getting Started with Bunker Cloud',
    description: 'Learn the basics of deploying your first application',
    category: 'Quickstart',
    readTime: '5 min read',
    icon: Zap,
    href: '/docs?section=getting-started&doc=quickstart'
  },
  {
    id: 'billing',
    title: 'Understanding Pricing and Billing',
    description: 'How our usage-based pricing works and how to manage costs',
    category: 'Billing',
    readTime: '3 min read',
    icon: CreditCard,
    href: '/docs?section=billing&doc=pricing-overview'
  },
  {
    id: 'domains',
    title: 'Configuring Custom Domains',
    description: 'Set up your own domain with SSL certificates',
    category: 'Networking',
    readTime: '4 min read',
    icon: Globe,
    href: '/docs?section=networking&doc=custom-domains'
  },
  {
    id: 'database',
    title: 'Database Connection Pooling',
    description: 'Optimize your database connections for better performance',
    category: 'Database',
    readTime: '6 min read',
    icon: Database,
    href: '/docs?section=databases&doc=connection-pooling'
  },
  {
    id: 'secrets',
    title: 'Environment Variables & Secrets',
    description: 'Securely manage configuration across environments',
    category: 'Security',
    readTime: '4 min read',
    icon: Key,
    href: '/docs?section=security&doc=secrets-management'
  },
  {
    id: 'cicd',
    title: 'CI/CD Pipeline Integration',
    description: 'Automate deployments with GitHub Actions and GitLab CI',
    category: 'DevOps',
    readTime: '7 min read',
    icon: GitBranch,
    href: '/docs?section=devops&doc=github-integration'
  }
];

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'New to Bunker Cloud? Start here.',
    icon: Zap,
    articles: 7,
    href: '/docs?section=getting-started&doc=introduction'
  },
  {
    id: 'billing',
    title: 'Account & Billing',
    description: 'Manage your account and payments',
    icon: CreditCard,
    articles: 8,
    href: '/docs?section=billing&doc=pricing-overview'
  },
  {
    id: 'compute',
    title: 'Compute',
    description: 'Deploy and manage applications',
    icon: Server,
    articles: 9,
    href: '/docs?section=compute&doc=compute-overview'
  },
  {
    id: 'databases',
    title: 'Databases',
    description: 'Database setup and optimization',
    icon: Database,
    articles: 9,
    href: '/docs?section=databases&doc=databases-overview'
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Best practices and compliance',
    icon: Shield,
    articles: 10,
    href: '/docs?section=security&doc=security-overview'
  },
  {
    id: 'api',
    title: 'API Reference',
    description: 'Complete API documentation',
    icon: Code,
    articles: 11,
    href: '/docs?section=api-reference&doc=api-overview'
  }
];

const communityResources = [
  {
    id: 'discord',
    title: 'Discord',
    description: 'Join 5,000+ developers discussing Bunker Cloud',
    members: '5,234',
    href: 'https://discord.gg/bunkercloud',
    isExternal: true
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'Feature requests and technical discussions',
    members: '2,891',
    href: 'https://github.com/bunkercloud/discussions',
    isExternal: true
  },
  {
    id: 'stackoverflow',
    title: 'Stack Overflow',
    description: 'Questions tagged with bunker-cloud',
    members: '1,456',
    href: 'https://stackoverflow.com/questions/tagged/bunker-cloud',
    isExternal: true
  }
];

const quickLinks = [
  { id: 'api', label: 'API Reference', icon: Code, href: '/docs?section=api-reference&doc=api-overview' },
  { id: 'status', label: 'Status Page', icon: Server, href: 'https://status.bunkercloud.com', isExternal: true },
  { id: 'security', label: 'Security', icon: Shield, href: '/docs?section=security&doc=security-overview' },
  { id: 'changelog', label: 'Changelog', icon: Newspaper, href: 'https://bunkercloud.com/changelog', isExternal: true }
];

// Contact info for copy functionality
const contactInfo = {
  email: 'support@bunkercloud.com',
  phone: '1-800-BUNKER'
};

export default function Support() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  // Documentation Chat (full-screen knowledge base)
  const [docsChatOpen, setDocsChatOpen] = useState(false);
  const [docsInitialMessages, setDocsInitialMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  // Support Chat (floating widget for support conversations)
  const [supportChatOpen, setSupportChatOpen] = useState(false);
  const [supportInitialMessage, setSupportInitialMessage] = useState<string | undefined>();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Search/Documentation chat - full screen interface
  const handleSendMessage = () => {
    if (message.trim()) {
      setDocsInitialMessages([{ text: message, isUser: true }]);
      setMessage('');
      setDocsChatOpen(true);
    }
  };

  // Open documentation/knowledge base chat with a prompt
  const openDocsChat = (prompt: string) => {
    setDocsInitialMessages([{ text: prompt, isUser: true }]);
    setDocsChatOpen(true);
    toast.success('Opening knowledge base...');
  };

  // Open support chat widget
  const openSupportChat = (initialMessage?: string) => {
    setSupportInitialMessage(initialMessage);
    setSupportChatOpen(true);
    toast.success('Connecting to support...');
  };

  // Article clicks navigate to docs
  const handleArticleClick = (article: typeof popularArticles[0]) => {
    navigate(article.href);
  };

  // Category clicks navigate to docs
  const handleCategoryClick = (category: typeof categories[0]) => {
    navigate(category.href);
  };

  const handleQuickLinkClick = (link: typeof quickLinks[0]) => {
    if (link.isExternal && link.href) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${link.label}...`);
    } else if (link.href) {
      navigate(link.href);
    }
  };

  const handleCommunityClick = (resource: typeof communityResources[0]) => {
    window.open(resource.href, '_blank', 'noopener,noreferrer');
    toast.success(`Opening ${resource.title}...`);
  };

  const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
      toast.success(`${type === 'email' ? 'Email' : 'Phone number'} copied to clipboard!`);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  // FAQ "Ask more" opens docs chat for documentation questions
  const handleFaqAskMore = (question: string) => {
    openDocsChat(`Tell me more about: ${question}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero - Split Layout */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left - Content */}
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                  How can we
                  <br />
                  help you?
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-md">
                  Search our knowledge base or connect with our team for personalized assistance.
                </p>

                {/* Knowledge Base Search Input */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Search our knowledge base..."
                      className="w-full pl-12 pr-14 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>

                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => setMessage('How do I deploy my first app?')}
                      className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                      Deploy first app
                    </button>
                    <button
                      onClick={() => setMessage('I need help with billing')}
                      className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                      Billing help
                    </button>
                    <button
                      onClick={() => setMessage('Technical issue with my deployment')}
                      className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                      Technical issue
                    </button>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4">Quick links</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <button
                          key={link.id}
                          onClick={() => handleQuickLinkClick(link)}
                          className="group flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                          {link.label}
                          {link.isExternal && <ExternalLink className="w-3 h-3 text-gray-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right - Support Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {/* Live Chat - Primary (Support Chat Widget) */}
              <button
                onClick={() => openSupportChat()}
                className="group w-full text-left p-6 lg:p-7 bg-gray-900 dark:bg-white rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 dark:bg-gray-900/10 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white dark:text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white dark:text-gray-900">Chat with us</h3>
                      <p className="text-sm text-gray-400 dark:text-gray-600 mt-0.5">We typically reply in under 5 minutes</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                </div>
              </button>

              {/* Secondary options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <Link
                  to="/docs"
                  className="group p-5 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all text-left"
                >
                  <div className="w-11 h-11 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <BookOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Documentation</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">Guides and API reference</p>
                  <div className="flex items-center gap-1.5 mt-4 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Browse docs
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>

                <Link
                  to="/resources"
                  className="group p-5 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all text-left"
                >
                  <div className="w-11 h-11 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <Play className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Video tutorials</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">Step-by-step walkthroughs</p>
                  <div className="flex items-center gap-1.5 mt-4 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Watch now
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </div>

              {/* Contact options */}
              <div className="p-5 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4">Other ways to reach us</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between group">
                    <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{contactInfo.email}</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard(contactInfo.email, 'email')}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between group">
                    <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{contactInfo.phone} (Enterprise)</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard(contactInfo.phone, 'phone')}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all"
                      title="Copy phone"
                    >
                      {copiedPhone ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between px-5 lg:px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">All systems operational</span>
                </div>
                <button
                  onClick={() => {
                    window.open('https://status.bunkercloud.com', '_blank', 'noopener,noreferrer');
                    toast.success('Opening Status Page...');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Status page →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Knowledge Base - Bento Grid Layout */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 lg:mb-14"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Explore our knowledge base
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
              Find guides, tutorials, and answers to help you get the most out of Bunker Cloud.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
            {/* Featured Article - Large Card */}
            <motion.button
              onClick={() => navigate('/docs?section=getting-started&doc=quickstart')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-12 lg:col-span-8 group relative bg-gray-900 dark:bg-white rounded-2xl p-7 sm:p-8 lg:p-10 overflow-hidden min-h-[260px] lg:min-h-[300px] flex flex-col justify-end text-left"
            >
              <div className="absolute top-6 left-8 lg:left-10">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Featured Guide</span>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 dark:opacity-5">
                <div className="absolute inset-0 bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
                <BookOpen className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 text-white dark:text-gray-900" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white dark:text-gray-900 mb-3 max-w-lg">
                Getting Started with Bunker Cloud
              </h3>
              <p className="text-gray-400 dark:text-gray-600 max-w-md mb-4">
                Everything you need to deploy your first application. From account setup to production deployment in under 10 minutes.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-white dark:text-gray-900 font-medium group-hover:underline">Start learning</span>
                <ArrowUpRight className="w-4 h-4 text-white dark:text-gray-900 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </motion.button>

            {/* Categories - Stacked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-5">Browse by topic</h3>
              <div className="space-y-1">
                {categories.slice(0, 5).map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className="group w-full flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">{category.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{category.articles}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => navigate('/docs')}
                className="flex items-center gap-1 mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                View all categories
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Popular Articles - 3 column row */}
            {popularArticles.slice(0, 3).map((article, index) => (
              <motion.button
                key={article.id}
                onClick={() => handleArticleClick(article)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="col-span-12 md:col-span-4 group p-5 lg:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-500 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-600">{article.readTime}</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-snug">
                  {article.title}
                </h4>
                <p className="mt-2.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </motion.button>
            ))}

            {/* Community Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="col-span-12 md:col-span-6 lg:col-span-5 bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Join the community</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Connect with 10,000+ developers</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {communityResources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => handleCommunityClick(resource)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {resource.title}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Video Tutorials Card */}
            <motion.button
              onClick={() => navigate('/resources')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="col-span-12 md:col-span-6 lg:col-span-4 group bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all text-left"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
                <Play className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Video tutorials</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                Watch step-by-step guides and learn at your own pace
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Browse videos
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.button>

            {/* Status + Resources - Combined */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="col-span-12 lg:col-span-3 flex flex-col gap-3 lg:gap-4"
            >
              {/* Status */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 lg:p-6 border border-gray-200 dark:border-gray-800 flex-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">All systems operational</span>
                </div>
                <button
                  onClick={() => {
                    window.open('https://status.bunkercloud.com', '_blank', 'noopener,noreferrer');
                    toast.success('Opening Status Page...');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  View status page →
                </button>
              </div>
              {/* Quick Links */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 lg:p-6 border border-gray-200 dark:border-gray-800 flex-1">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-4">Quick links</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.open('https://bunkercloud.com/changelog', '_blank', 'noopener,noreferrer');
                      toast.success('Opening Changelog...');
                    }}
                    className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
                  >
                    Changelog
                  </button>
                  <button
                    onClick={() => navigate('/docs?section=api-reference&doc=api-overview')}
                    className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
                  >
                    API Reference
                  </button>
                  <button
                    onClick={() => {
                      window.open('https://bunkercloud.com/blog', '_blank', 'noopener,noreferrer');
                      toast.success('Opening Blog...');
                    }}
                    className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
                  >
                    Blog
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Clean, minimal */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 lg:mb-14"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Can't find what you're looking for?{' '}
                <button
                  onClick={() => openSupportChat()}
                  className="text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline"
                >
                  Chat with us
                </button>
              </p>
            </motion.div>

            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full py-5 lg:py-6 text-left flex items-start justify-between gap-4 group"
                  >
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-relaxed">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-gray-600 dark:text-gray-400 leading-relaxed pr-8 lg:pr-12">
                          {faq.answer}
                        </p>
                        <button
                          onClick={() => handleFaqAskMore(faq.question)}
                          className="mb-5 lg:mb-6 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Ask AI for more details
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA - Simple */}
      <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl mb-6 shadow-sm">
              <Headphones className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Our team is here to help you with any questions or issues you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => openSupportChat()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Start a conversation
              </button>
              <a
                href="mailto:support@bunkercloud.com"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <Mail className="w-5 h-5" />
                Email us
              </a>
            </div>
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Average response time: under 5 minutes
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Support Chat Button */}
      <AnimatePresence>
        {!supportChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openSupportChat()}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Documentation/Knowledge Base Chat Interface (Full Screen) */}
      <ChatInterface
        isOpen={docsChatOpen}
        onClose={() => setDocsChatOpen(false)}
        initialMessages={docsInitialMessages}
      />

      {/* Support Chat Widget (Floating Panel) */}
      <SupportChatWidget
        isOpen={supportChatOpen}
        onClose={() => setSupportChatOpen(false)}
        initialMessage={supportInitialMessage}
      />
    </div>
  );
}
