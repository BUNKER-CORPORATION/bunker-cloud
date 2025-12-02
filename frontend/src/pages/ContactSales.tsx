import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  Headphones,
  Zap,
  Server,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const industries = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'E-commerce',
  'Media & Entertainment',
  'Education',
  'Government',
  'Manufacturing',
  'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

const interests = [
  'Cloud Infrastructure',
  'Managed Databases',
  'Kubernetes',
  'AI/ML Workloads',
  'Security & Compliance',
  'Migration Services',
  'Enterprise Support',
  'Custom Solutions'
];

const benefits = [
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: '24/7 access to our enterprise support team with guaranteed response times'
  },
  {
    icon: Shield,
    title: 'Enhanced Security',
    description: 'Advanced security features, compliance certifications, and custom policies'
  },
  {
    icon: Zap,
    title: 'Priority Access',
    description: 'Early access to new features, beta programs, and exclusive capabilities'
  },
  {
    icon: BarChart3,
    title: 'Custom Pricing',
    description: 'Volume discounts, committed use contracts, and flexible billing options'
  }
];

const testimonials = [
  {
    quote: "Bunker Cloud's enterprise team helped us migrate our entire infrastructure in just 3 weeks. The support has been exceptional.",
    author: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Inc.',
    image: '/solutions-image-1.webp'
  },
  {
    quote: "The dedicated account manager and 24/7 support have been game-changers for our operations. We couldn't be happier.",
    author: 'Michael Torres',
    role: 'VP of Engineering',
    company: 'DataSync',
    image: '/solutions-image-2.webp'
  }
];

const trustedBy = [
  'Fortune 500 Companies',
  'Leading Startups',
  'Government Agencies',
  'Healthcare Organizations',
  'Financial Institutions'
];

export default function ContactSales() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    interests: [] as string[],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert('Thank you! Our sales team will contact you shortly.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-mono font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
                Enterprise Sales
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Let's build something great together
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Talk to our sales team about enterprise solutions, custom pricing, and how Bunker Cloud can power your business.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">99.99%</div>
                  <div className="text-sm text-gray-500">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">35+</div>
                  <div className="text-sm text-gray-500">Global Regions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-gray-500">Enterprise Support</div>
                </div>
              </div>
            </motion.div>

            {/* Contact Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Get in touch</h3>
                <div className="space-y-4">
                  <a href="tel:+1-800-BUNKER" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Call Sales</div>
                      <div className="text-gray-400 text-sm">1-800-BUNKER</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-white transition-colors" />
                  </a>
                  <a href="mailto:sales@bunkercloud.com" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Email Sales</div>
                      <div className="text-gray-400 text-sm">sales@bunkercloud.com</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-white transition-colors" />
                  </a>
                  <a href="#chat" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Live Chat</div>
                      <div className="text-gray-400 text-sm">Talk to us now</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Request a consultation
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      />
                    </div>
                  </div>

                  {/* Company & Job Title Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      />
                    </div>
                  </div>

                  {/* Industry & Company Size Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industry *
                      </label>
                      <select
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      >
                        <option value="">Select industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Size *
                      </label>
                      <select
                        required
                        value={formData.companySize}
                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      >
                        <option value="">Select size</option>
                        {companySizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      What are you interested in?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tell us about your project
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your requirements, timeline, and any questions you have..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Request
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enterprise Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Enterprise Benefits
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Trusted By */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Trusted By
                </h3>
                <div className="space-y-3">
                  {trustedBy.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Response Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Quick Response</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Within 24 hours</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our sales team typically responds within a few hours during business days.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-mono font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 justify-center">
              <span className="w-2 h-2 rounded-full bg-gray-600 dark:bg-gray-400 animate-pulse"></span>
              Testimonials
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trusted by industry leaders
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Global Presence, Local Support
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                With data centers in 35+ regions and sales teams across the globe, we're here to support your business wherever you operate.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">35+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Regions</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sales Offices</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Enterprise Clients</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Server className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">99.99%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src="/ready-to-get-started.webp"
                  alt="Global Network"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
