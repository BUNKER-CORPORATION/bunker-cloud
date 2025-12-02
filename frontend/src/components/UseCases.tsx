import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Cpu, Globe, ShoppingBag, Rocket, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const useCases = [
  {
    id: 'ai',
    category: 'AI INFRASTRUCTURE',
    title: 'Power Your AI Innovation',
    description: 'Deploy AI-powered applications with GPU support and optimized inference infrastructure. Pre-configured environments for PyTorch, TensorFlow, and more.',
    image: '/ai-case-img.webp',
    icon: Cpu,
    features: ['NVIDIA H100 GPUs', 'Pre-built ML Containers', 'Auto-scaling Inference']
  },
  {
    id: 'web',
    category: 'WEB APPLICATIONS',
    title: 'Scale Your Web Presence',
    description: 'Build and deploy modern web apps with lightning-fast global distribution and automatic SSL. Zero-config deployments for Next.js, React, and Node.',
    image: '/web-case-img.webp',
    icon: Globe,
    features: ['Global Edge Network', 'DDoS Protection', 'Instant Rollbacks']
  },
  {
    id: 'ecommerce',
    category: 'E-COMMERCE',
    title: 'Grow Your Online Business',
    description: 'Power your online store with high-performance infrastructure that scales with your business. Handle Black Friday traffic spikes with zero downtime.',
    image: '/e-commerce-img.webp',
    icon: ShoppingBag,
    features: ['99.999% Uptime SLA', 'PCI-DSS Compliance', 'Sub-ms Latency']
  },
  {
    id: 'startups',
    category: 'STARTUPS',
    title: 'Build. Ship. Scale.',
    description: 'Launch faster with production-ready infrastructure that grows from MVP to enterprise scale. Generous credits and support for early-stage companies.',
    image: '/startups-img.webp',
    icon: Rocket,
    features: ['Startup Credits', 'Architecture Reviews', '24/7 Support']
  }
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-rotate tabs with smooth 60fps progress fill
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((current) => (current + 1) % useCases.length);
          return 0;
        }
        return prev + 0.33;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [activeTab]);

  // Handle manual tab selection
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setProgress(0);
  };

  const currentCase = useCases[activeTab];

  return (
    <section id="solutions" className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Tech Grid Background - subtle */}
      <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.05]"
           style={{
             backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
             backgroundSize: '24px 24px'
           }}
      />

      <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2 justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            Built for everything
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Infrastructure that adapts to your workload.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Vertical Tabs */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {useCases.map((item, index) => {
              const isActive = index === activeTab;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(index)}
                  className={`relative text-left p-6 rounded-xl border transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-gray-100 dark:from-gray-800 to-white dark:to-gray-900 border-gray-300 dark:border-gray-700 shadow-md'
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {/* Progress fill effect - low opacity background fill */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gray-900/5 dark:bg-white/5 origin-left"
                      style={{ scaleX: progress / 100 }}
                      transition={{ ease: "linear", duration: 0.1 }}
                    />
                  )}

                  <div className="relative flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg shadow-gray-900/25 dark:shadow-white/10'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm tracking-wide mb-1 transition-colors duration-300 ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }`}>
                        {item.category}
                      </h3>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {item.title}
                      </p>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Content Preview */}
          <div className="lg:col-span-8 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-gray-700 group"
              >
                {/* Background Image */}
                <img
                  src={currentCase.image}
                  alt={currentCase.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay" />

                {/* Tag - Top Left */}
                <div className="absolute top-8 left-8 z-20">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-mono tracking-widest uppercase"
                  >
                    <currentCase.icon className="w-3 h-3" />
                    {currentCase.id}::deployment_ready
                  </motion.div>
                </div>

                {/* Content - Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col justify-end">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-2xl"
                  >
                    {currentCase.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-300 mb-6 leading-relaxed max-w-xl"
                  >
                    {currentCase.description}
                  </motion.p>

                  {/* Feature Tags + Button Row */}
                  <div className="flex items-center justify-between gap-6">
                    {/* Feature Tags */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-4"
                    >
                      {currentCase.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          {feature}
                        </div>
                      ))}
                    </motion.div>

                    {/* Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Start Building
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
