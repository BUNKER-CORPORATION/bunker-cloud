import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 9, annual: 7 },
    description: 'Perfect for personal projects and small websites',
    features: [
      '1 Website',
      '10GB SSD Storage',
      '100GB Bandwidth',
      'Free SSL Certificate',
      'Daily Backups',
      'Email Support'
    ]
  },
  {
    name: 'Professional',
    price: { monthly: 29, annual: 24 },
    description: 'Ideal for growing businesses and developers',
    features: [
      'Unlimited Websites',
      '50GB SSD Storage',
      '500GB Bandwidth',
      'Free SSL Certificate',
      'Hourly Backups',
      'Priority Support',
      'Staging Environment',
      'CDN Integration'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: { monthly: 99, annual: 84 },
    description: 'Advanced features for demanding applications',
    features: [
      'Unlimited Everything',
      '200GB SSD Storage',
      'Unlimited Bandwidth',
      'Free SSL Certificate',
      'Real-time Backups',
      '24/7 Phone Support',
      'Multiple Staging Envs',
      'Advanced CDN',
      'Dedicated Resources',
      'Custom Integrations'
    ]
  }
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="w-full mx-auto px-12 lg:px-24 xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your needs. All plans include a 30-day money-back guarantee.
          </p>

          <div className="inline-flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                !annual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                annual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gray-900 text-white border-2 border-gray-900 shadow-soft-lg'
                  : 'bg-white border border-gray-200 shadow-soft'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-700 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>/month</span>
                </div>
                {annual && (
                  <p className={`text-sm mt-1 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    Billed ${plan.price.annual * 12} annually
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-semibold mb-8 transition-colors ${
                  plan.popular
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Start Free Trial
              </motion.button>

              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`rounded-full p-1 mt-0.5 ${plan.popular ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <Check size={12} className={plan.popular ? 'text-white' : 'text-gray-700'} />
                    </div>
                    <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Need custom resources?{' '}
            <a href="#contact" className="text-gray-900 hover:text-gray-700 font-medium underline">
              Contact sales
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
