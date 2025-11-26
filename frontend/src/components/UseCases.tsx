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
    title: 'Launch Faster, Scale Smarter',
    description: 'Launch faster with production-ready infrastructure that grows from MVP to enterprise scale. Generous credits and support for early-stage companies.',
    image: '/startups-img.webp',
    icon: Rocket,
    features: ['Startup Credits', 'Architecture Reviews', '24/7 Support']
  }
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-rotate tabs
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((current) => (current + 1) % useCases.length);
          return 0;
        }
        return prev + 1; // Speed of progress bar
      });
    }, 50); // Update frequency

    return () => clearInterval(timer);
  }, [activeTab]);

  // Reset progress when manually changing tabs
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setProgress(0);
  };

  const currentCase = useCases[activeTab];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Tech Grid Background - subtle */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" 
           style={{ 
             backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, 
             backgroundSize: '24px 24px' 
           }} 
      />

      <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:text-center max-w-3xl mx-auto"
        >
          <p className="text-sm font-mono font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2 md:justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Built for everything
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Infrastructure that adapts to your workload.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Whether you're training LLMs, scaling a SaaS platform, or handling millions of transactions, Bunker Cloud provides the optimized environment you need.
          </p>
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
                  className={`relative text-left p-6 rounded-xl border transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white border-blue-500 shadow-lg ring-1 ring-blue-100' 
                      : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {/* Progress Bar for Active Tab */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-100 w-full rounded-b-xl overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-600"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-base mb-1 ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.category}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                         {isActive ? item.title : 'Click to explore'}
                      </p>
                    </div>
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
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 group"
              >
                {/* Background Image */}
                <img
                  src={currentCase.image}
                  alt={currentCase.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay" />

                {/* Content Content */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="max-w-2xl">
                    <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.1 }}
                       className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-mono tracking-widest uppercase mb-6"
                    >
                      <currentCase.icon className="w-3 h-3" />
                      {currentCase.id}::deployment_ready
                    </motion.div>

                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                    >
                      {currentCase.title}
                    </motion.h3>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl"
                    >
                      {currentCase.description}
                    </motion.p>

                    {/* Feature Tags */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-4 mb-8"
                    >
                      {currentCase.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          {feature}
                        </div>
                      ))}
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
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
