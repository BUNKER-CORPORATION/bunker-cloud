import { motion } from 'framer-motion';
import { Shield, Award, Lock, FileCheck, CheckCircle, ArrowRight } from 'lucide-react';

const stats = [
  {
    value: '10,000+',
    label: 'Active Developers'
  },
  {
    value: '35+',
    label: 'Global Regions'
  },
  {
    value: '99.99%',
    label: 'Uptime SLA'
  },
  {
    value: 'SOC 2',
    label: 'Type II Certified'
  }
];

const customerStories = [
  {
    tag: 'E-COMMERCE',
    title: 'Global retailer scales to millions',
    description: 'Leading e-commerce platform handles Black Friday traffic spikes seamlessly with Bunker Cloud auto-scaling.',
    image: '/e-commerce-platform-img.webp',
    link: '#'
  },
  {
    tag: 'FINTECH',
    title: 'Financial services meets compliance',
    description: 'Banking application achieves SOC 2 and GDPR compliance while reducing infrastructure costs by 40%.',
    image: '/fintech-platform-img.webp',
    link: '#'
  },
  {
    tag: 'HEALTHCARE',
    title: 'Accelerating medical breakthroughs',
    description: 'Health tech startup processes patient data securely with HIPAA-ready infrastructure and 99.99% uptime.',
    image: '/health-care-img.webp',
    link: '#'
  },
  {
    tag: 'SAAS',
    title: 'SaaS platform achieves global reach',
    description: 'Modern SaaS company deploys to 35+ regions worldwide, serving customers with sub-100ms latency.',
    image: '/saas-platform-img.webp',
    link: '#'
  }
];

const securityFeatures = [
  {
    icon: Shield,
    name: 'Advanced Encryption',
    description: 'Military-grade encryption for data at rest and in transit'
  },
  {
    icon: Lock,
    name: 'DDoS Protection',
    description: 'Built-in protection against distributed attacks'
  },
  {
    icon: FileCheck,
    name: 'Automated Backups',
    description: 'Daily snapshots with point-in-time recovery'
  },
  {
    icon: CheckCircle,
    name: 'Access Control',
    description: 'Role-based permissions and multi-factor authentication'
  }
];

export default function TrustSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="w-full mx-auto px-16 sm:px-24 md:px-32 lg:px-48 xl:px-64 2xl:px-80">
        {/* Customer Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
            CUSTOMER STORIES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Trusted by teams worldwide
          </h2>
        </motion.div>

        {/* Customer Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
          {customerStories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-md">
                        {story.tag}
                      </span>
                    </div>
                    {/* Arrow icon - top right on image - appears on hover */}
                    <a
                      href={story.link}
                      className="absolute top-4 right-4 inline-flex items-center text-white hover:text-gray-200 font-medium transition-all duration-300 ease-in opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-grow bg-gray-50">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Security Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
            SECURITY FEATURES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Built with security in mind
          </h2>
        </motion.div>

        {/* Bento Grid - Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Advanced Encryption - Large Featured Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 md:row-span-2 relative group"
          >
            <div className="h-full rounded-3xl overflow-hidden relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="/security-img3.webp"
                  alt="Advanced Encryption"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70 group-hover:from-gray-900/85 transition-colors duration-500" />
              </div>

              <div className="relative z-10 h-full flex flex-col p-8 md:p-10">
                <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <Shield size={32} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {securityFeatures[0].name}
                </h3>
                <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-6">
                  {securityFeatures[0].description}
                </p>
                <div className="mt-auto pt-6 border-t border-white/20">
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>AES-256 Encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* DDoS Protection - Medium Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1 group"
          >
            <div className="h-full rounded-3xl overflow-hidden relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="/securit-img1.webp"
                  alt="DDoS Protection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/85 to-gray-900/80 group-hover:from-gray-900/85 transition-colors duration-500" />
              </div>

              <div className="relative z-10 p-6 md:p-8">
                <div className="bg-white/10 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <Lock size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {securityFeatures[1].name}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {securityFeatures[1].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Automated Backups - Medium Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 group"
          >
            <div className="h-full rounded-3xl overflow-hidden relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="/security-img2.webp"
                  alt="Automated Backups"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-900/80 group-hover:from-gray-900/85 transition-colors duration-500" />
              </div>

              <div className="relative z-10 p-6 md:p-8">
                <div className="bg-white/10 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <FileCheck size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {securityFeatures[2].name}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {securityFeatures[2].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Access Control - Wide Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-2 group"
          >
            <div className="h-full rounded-3xl overflow-hidden relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="/security-img4.webp"
                  alt="Access Control"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/85 group-hover:from-gray-900/90 group-hover:via-gray-900/85 transition-colors duration-500" />
              </div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }} />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8">
                <div className="bg-white/10 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {securityFeatures[3].name}
                  </h3>
                  <p className="text-gray-200 text-sm md:text-base">
                    {securityFeatures[3].description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:flex-shrink-0">
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                    RBAC
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                    2FA/MFA
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
