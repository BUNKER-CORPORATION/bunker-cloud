import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Activity, Shield, Zap, Database, Box, BarChart3, HardDrive, Network, Terminal } from 'lucide-react';
import { useState, MouseEvent } from 'react';

// Enhanced features list with icons
const features = [
  {
    image: '/solutions-image-1.webp',
    tag: 'INFRASTRUCTURE',
    icon: Activity,
    title: 'Deploy with Bunker Enterprise',
    description: 'Experience enterprise-grade infrastructure with guaranteed 99.999% uptime SLA. Deploy on cutting-edge hardware across 35 global data centers.',
    link: '#',
    linkText: 'Get started'
  },
  {
    image: '/solutions-image-2.webp',
    tag: 'SECURITY',
    icon: Shield,
    title: 'Advanced Security & Compliance',
    description: 'Protect your applications with military-grade encryption, DDoS protection, and automated backups. Built-in SOC 2 Type II compliance.',
    link: '#',
    linkText: 'Learn more'
  },
  {
    image: '/solutions-image-3.webp',
    tag: 'PERFORMANCE',
    icon: Zap,
    title: 'Lightning-Fast Global Network',
    description: 'Deliver blazing-fast experiences to users worldwide with our edge network and CDN integration. Optimized routing ensures minimal latency.',
    link: '#',
    linkText: 'Explore features'
  },
  {
    image: '/solutions-image-1.webp',
    tag: 'DATABASES',
    icon: Database,
    title: 'Managed Database Solutions',
    description: 'Deploy and scale PostgreSQL, MySQL, MongoDB, and Redis databases with automated backups, monitoring, and high availability built-in.',
    link: '#',
    linkText: 'Explore databases'
  },
  {
    image: '/solutions-image-2.webp',
    tag: 'KUBERNETES',
    icon: Box,
    title: 'Managed Kubernetes Service',
    description: 'Run containerized applications at scale with our fully managed Kubernetes platform. Auto-scaling and seamless CI/CD integration included.',
    link: '#',
    linkText: 'Learn about K8s'
  },
  {
    image: '/solutions-image-3.webp',
    tag: 'MONITORING',
    icon: BarChart3,
    title: 'Real-Time Monitoring & Analytics',
    description: 'Gain complete visibility into your infrastructure with advanced metrics, logging, and alerting. Custom dashboards and AI-powered insights.',
    link: '#',
    linkText: 'View monitoring'
  },
  {
    image: '/solutions-image-1.webp',
    tag: 'STORAGE',
    icon: HardDrive,
    title: 'Scalable Object Storage',
    description: 'Store and serve unlimited data with S3-compatible object storage. Built-in CDN integration and lifecycle management.',
    link: '#',
    linkText: 'Explore storage'
  },
  {
    image: '/solutions-image-2.webp',
    tag: 'NETWORKING',
    icon: Network,
    title: 'Advanced Network Infrastructure',
    description: 'Build secure, high-performance networks with VPC, private networking, load balancers, and DDoS protection.',
    link: '#',
    linkText: 'View networking'
  },
  {
    image: '/solutions-image-3.webp',
    tag: 'DEVOPS',
    icon: Terminal,
    title: 'DevOps & CI/CD Platform',
    description: 'Streamline your development workflow with integrated CI/CD pipelines, automated testing, and seamless deployment to production.',
    link: '#',
    linkText: 'Get started'
  }
];

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 120, 120, 0.03),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 120, 120, 0.02),
              transparent 80%
            )
          `,
          zIndex: 10,
          border: '1px solid rgba(120, 120, 120, 0.08)'
        }}
      />

      {/* Image Section - Darkened like Hero Overlay */}
      <div className="relative h-64 overflow-hidden bg-gray-900">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        
        {/* Hero-style Tag */}
        <div className="absolute top-6 left-6 z-20">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded text-[10px] font-bold tracking-widest text-white uppercase shadow-sm">
            {feature.tag}
          </span>
        </div>

        {/* Icon floating like a satellite */}
        <div className="absolute bottom-4 right-4 z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white group-hover:bg-white group-hover:text-blue-600 transition-all duration-300 shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow relative z-20">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-500 text-base leading-relaxed mb-8 flex-grow border-l-2 border-gray-100 pl-4">
          {feature.description}
        </p>

        {/* Hero-inspired Button */}
        <div className="pt-2 mt-auto">
          <a 
            href={feature.link}
            className="inline-flex items-center justify-between w-full px-6 py-4 bg-gray-50 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 group/btn shadow-sm"
          >
            <span>{feature.linkText}</span>
            <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsPerPage = 3;
  const totalPages = Math.ceil(features.length / cardsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentFeatures = features.slice(
    currentIndex * cardsPerPage,
    (currentIndex + 1) * cardsPerPage
  );

  return (
    <section id="features" className="py-24 md:py-32 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      {/* Tech Grid Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, 
             backgroundSize: '24px 24px' 
           }} 
      />
      
      <div className="w-full mx-auto px-16 sm:px-24 md:px-32 lg:px-48 xl:px-64 2xl:px-80 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-sm font-mono font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              System Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Mission-Critical Infrastructure
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="p-4 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-4 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentFeatures.map((feature, index) => (
             <FeatureCard key={`${currentIndex}-${index}`} feature={feature} index={index} />
          ))}
        </div>
        
        {/* Pagination Dots - Tech Style */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}