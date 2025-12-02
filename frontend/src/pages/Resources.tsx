import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  Video,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Play,
  Newspaper,
  GraduationCap,
  Terminal,
  Blocks,
  Users,
  Calendar,
  Podcast,
  Github
} from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const resourceCategories = [
  { id: 'all', label: 'All Resources' },
  { id: 'docs', label: 'Documentation' },
  { id: 'tutorials', label: 'Tutorials' },
  { id: 'videos', label: 'Videos' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'whitepapers', label: 'Whitepapers' }
];

const featuredResources = [
  {
    type: 'docs',
    icon: BookOpen,
    badge: 'Documentation',
    title: 'Getting Started Guide',
    description: 'Learn the fundamentals of Bunker Cloud. Deploy your first application in under 5 minutes with our comprehensive quickstart guide.',
    href: '/docs?section=getting-started&doc=quickstart',
    image: '/solutions-image-1.webp'
  },
  {
    type: 'tutorials',
    icon: GraduationCap,
    badge: 'Tutorial',
    title: 'Build a Scalable API',
    description: 'Step-by-step tutorial on building and deploying a production-ready REST API with automatic scaling and monitoring.',
    href: '/docs?section=compute&doc=serverless-functions',
    image: '/solutions-image-2.webp'
  },
  {
    type: 'videos',
    icon: Video,
    badge: 'Video Series',
    title: 'Bunker Cloud Masterclass',
    description: 'Complete video course covering everything from basics to advanced infrastructure patterns and best practices.',
    href: '/docs?section=getting-started&doc=core-concepts',
    image: '/solutions-image-3.webp',
    duration: '4h 30m'
  }
];

const documentationSections = [
  {
    icon: Terminal,
    title: 'CLI Reference',
    description: 'Complete command-line interface documentation',
    articles: 6,
    href: '/docs?section=cli&doc=cli-overview'
  },
  {
    icon: Code,
    title: 'API Documentation',
    description: 'REST API endpoints and SDK references',
    articles: 11,
    href: '/docs?section=api-reference&doc=api-overview'
  },
  {
    icon: Blocks,
    title: 'Infrastructure as Code',
    description: 'Terraform and Pulumi provider guides',
    articles: 10,
    href: '/docs?section=devops&doc=infrastructure-as-code'
  },
  {
    icon: BookOpen,
    title: 'Security Best Practices',
    description: 'Security patterns and compliance guides',
    articles: 10,
    href: '/docs?section=security&doc=security-overview'
  }
];

const latestContent = [
  {
    type: 'docs',
    icon: Newspaper,
    title: 'Compute Overview',
    description: 'Learn about Vault Instances, containers, Kubernetes, and serverless functions.',
    date: 'Dec 1, 2025',
    readTime: '8 min read',
    href: '/docs?section=compute&doc=compute-overview'
  },
  {
    type: 'docs',
    icon: FileText,
    title: 'Cost Optimization Guide',
    description: 'Learn how to optimize your cloud spending with reserved capacity and right-sizing.',
    date: 'Dec 1, 2025',
    readTime: '10 min read',
    href: '/docs?section=billing&doc=cost-optimization'
  },
  {
    type: 'docs',
    icon: Download,
    title: 'Security & Compliance',
    description: 'Comprehensive guide to securing your cloud infrastructure and meeting compliance requirements.',
    date: 'Dec 1, 2025',
    readTime: '12 min read',
    href: '/docs?section=security&doc=compliance'
  },
  {
    type: 'docs',
    icon: GraduationCap,
    title: 'Managed Kubernetes',
    description: 'Deploy and manage production Kubernetes clusters with Bunker Cloud.',
    date: 'Dec 1, 2025',
    readTime: '15 min read',
    href: '/docs?section=compute&doc=kubernetes'
  }
];

const videoContent = [
  {
    title: 'Introduction to Bunker Cloud',
    duration: '8:24',
    views: '12.5K',
    thumbnail: '/solutions-image-1.webp',
    href: '/docs?section=getting-started&doc=introduction'
  },
  {
    title: 'Setting Up CI/CD Pipelines',
    duration: '15:30',
    views: '8.2K',
    thumbnail: '/solutions-image-2.webp',
    href: '/docs?section=devops&doc=deployment-pipelines'
  },
  {
    title: 'Database Migration Strategies',
    duration: '22:15',
    views: '6.8K',
    thumbnail: '/solutions-image-3.webp',
    href: '/docs?section=databases&doc=database-migration'
  },
  {
    title: 'Observability',
    duration: '18:45',
    views: '5.4K',
    thumbnail: '/solutions-image-1.webp',
    href: '/docs?section=monitoring&doc=monitoring-overview'
  }
];

const communityResources = [
  {
    icon: Github,
    title: 'GitHub',
    description: 'Open source tools, SDKs, and example projects',
    href: 'https://github.com/bunker-cloud',
    external: true
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Connect with developers and get help from the community',
    href: '#community/forum',
    external: false
  },
  {
    icon: Calendar,
    title: 'Events & Webinars',
    description: 'Live sessions, workshops, and conferences',
    href: '#events',
    external: false
  },
  {
    icon: Podcast,
    title: 'Cloud Talk Podcast',
    description: 'Weekly episodes on cloud trends and best practices',
    href: '#podcast',
    external: false
  }
];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="text-sm font-mono font-semibold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Resources
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Learn, Build, and Scale
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              Explore our comprehensive library of documentation, tutorials, videos, and best practices to master Bunker Cloud.
            </p>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {resourceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-white text-gray-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Hand-picked content to help you get started
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.a
                  key={index}
                  href={resource.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900 dark:text-white">
                        <Icon className="w-3.5 h-3.5" />
                        {resource.badge}
                      </span>
                    </div>
                    {resource.duration && (
                      <div className="absolute bottom-4 right-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/70 rounded text-xs text-white">
                          <Play className="w-3 h-3" />
                          {resource.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {resource.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Documentation */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Documentation
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive guides and API references
                </p>
              </motion.div>

              <div className="space-y-4">
                {documentationSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <motion.a
                      key={index}
                      href={section.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {section.description}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 inline-block">
                          {section.articles} articles
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Right: Latest Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Latest Content
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Fresh articles, tutorials, and updates
                </p>
              </motion.div>

              <div className="space-y-4">
                {latestContent.map((content, index) => {
                  const Icon = content.icon;
                  return (
                    <motion.a
                      key={index}
                      href={content.href}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {content.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <span>{content.date}</span>
                            <span>•</span>
                            <span>{content.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Library */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Video Library
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Learn through step-by-step video tutorials
              </p>
            </div>
            <a href="#videos" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white hover:gap-2 transition-all">
              View all videos <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoContent.map((video, index) => (
              <motion.a
                key={index}
                href={video.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {video.views} views
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Open Source */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2 justify-center">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
              Community
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with developers, contribute to open source, and stay updated with the latest news
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.a
                  key={index}
                  href={resource.href}
                  target={resource.external ? '_blank' : undefined}
                  rel={resource.external ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
                    <Icon className="w-7 h-7 text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-1">
                    {resource.title}
                    {resource.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 dark:bg-white rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white dark:bg-gray-900 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-2">
                  Stay in the loop
                </h2>
                <p className="text-gray-400 dark:text-gray-600">
                  Get the latest tutorials, updates, and best practices delivered to your inbox.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-900/20 text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-gray-900/50 min-w-[280px]"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
