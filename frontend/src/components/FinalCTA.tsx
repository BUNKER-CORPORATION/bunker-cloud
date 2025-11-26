import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-gray-50">
      <div className="w-full mx-auto px-12 lg:px-24 xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-soft-lg"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/ready-to-get-started.webp"
              alt="Global Network"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/80 to-gray-800/85" />
          </div>

          {/* Decorative overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Deploy your first application in minutes. No credit card required.
              Get $200 in free credits to explore all features.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white text-gray-900 px-8 py-4 rounded-lg text-base font-semibold hover:bg-gray-50 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  Start Free Trial
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <a href="#pricing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-700 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  View Pricing
                </motion.button>
              </a>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              Join 10,000+ developers already building on Bunker Cloud
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
