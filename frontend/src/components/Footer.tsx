import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Security', href: '#security' },
    { name: 'Roadmap', href: '#roadmap' }
  ],
  resources: [
    { name: 'Documentation', href: '#docs' },
    { name: 'API Reference', href: '#api' },
    { name: 'Guides', href: '#guides' },
    { name: 'Support', href: '#support' }
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact', href: '#contact' }
  ],
  legal: [
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
    { name: 'Security', href: '#security' },
    { name: 'Compliance', href: '#compliance' }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="w-full mx-auto px-12 lg:px-24 xl:px-32 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <span className="text-xl font-bold text-gray-900">Bunker Cloud</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Cloud infrastructure built for scale and simplicity.
            </p>
            <div className="flex gap-4">
              <a
                href="#twitter"
                className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              >
                <Twitter size={18} className="text-gray-600" />
              </a>
              <a
                href="#github"
                className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              >
                <Github size={18} className="text-gray-600" />
              </a>
              <a
                href="#linkedin"
                className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              >
                <Linkedin size={18} className="text-gray-600" />
              </a>
              <a
                href="#mail"
                className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              >
                <Mail size={18} className="text-gray-600" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 Bunker Cloud. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#status" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                System Status
              </a>
              <a href="#privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
