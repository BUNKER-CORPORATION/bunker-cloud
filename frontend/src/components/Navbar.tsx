import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigation } from '../hooks/useNavigation';
import { useTheme } from '../contexts/ThemeContext';
import {
  getAvailableServices,
  getCurrentService,
  MAIN_NAV_LINKS,
  SECONDARY_NAV_LINKS,
} from '../config/navigation';

/**
 * Production-ready Navbar Component
 * - Responsive design
 * - Accessibility compliant (WCAG 2.1)
 * - Performance optimized
 * - Scalable architecture
 */
const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const {
    mobileMenuOpen,
    servicesDropdownOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openServicesDropdown,
    closeServicesDropdown,
    toggleServicesDropdown,
    closeAllMenus,
  } = useNavigation();

  // Determine current service (default to 'cloud')
  const currentServiceId = 'cloud';
  const currentService = getCurrentService(currentServiceId);
  const availableServices = getAvailableServices(currentServiceId);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo and Main Navigation */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white" aria-label="Bunker Cloud Home">
                  {/* BUNKER - appears first */}
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0 }}
                    className="text-base font-bold tracking-tight"
                  >
                    BUNKER
                  </motion.span>

                  {/* Vertical line - appears second */}
                  <motion.span
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="text-gray-400 dark:text-gray-600"
                    aria-hidden="true"
                  >
                    |
                  </motion.span>
                </Link>

                {/* Services Dropdown Trigger - CLOUD appears third */}
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  onClick={toggleServicesDropdown}
                  onMouseEnter={openServicesDropdown}
                  onMouseLeave={closeServicesDropdown}
                  className="flex items-center gap-1 text-base font-normal text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-expanded={servicesDropdownOpen}
                  aria-haspopup="true"
                  aria-label={`Switch from ${currentService?.name} to other Bunker services`}
                >
                  {currentService?.name || 'Cloud'}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </motion.button>
              </div>

              {/* Desktop Main Navigation */}
              <div className="hidden xl:flex items-center gap-6" role="menubar">
                {MAIN_NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    role="menuitem"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right: Search, Actions and CTA */}
            <div className="hidden xl:flex items-center gap-4">
              <button
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={18} aria-hidden="true" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon size={18} aria-hidden="true" />
                ) : (
                  <Sun size={18} aria-hidden="true" />
                )}
              </button>

              {SECONDARY_NAV_LINKS.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.id}
                    to={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.id}
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}

              <a href="#pricing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  aria-label="Sign up for Bunker Cloud"
                >
                  Get started with Bunker
                </motion.button>
              </a>

              <a
                href="#pricing"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign in
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon size={20} aria-hidden="true" />
                ) : (
                  <Sun size={20} aria-hidden="true" />
                )}
              </button>

              <button
                onClick={toggleMobileMenu}
                className="text-gray-900 dark:text-white p-2"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} aria-hidden="true" />
                ) : (
                  <Menu size={24} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
              role="menu"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Services Menu */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Bunker Services
                  </div>
                  {availableServices.map((service) => (
                    <a
                      key={service.id}
                      href={service.href}
                      className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      onClick={closeMobileMenu}
                      role="menuitem"
                    >
                      {service.name}
                    </a>
                  ))}
                </div>

                {MAIN_NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={closeMobileMenu}
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-4">
                  {SECONDARY_NAV_LINKS.map((link) => (
                    link.href.startsWith('/') ? (
                      <Link
                        key={link.id}
                        to={link.href}
                        className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        onClick={closeMobileMenu}
                        role="menuitem"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.id}
                        href={link.href}
                        className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        onClick={closeMobileMenu}
                        role="menuitem"
                      >
                        {link.label}
                      </a>
                    )
                  ))}

                  <a href="#pricing" onClick={closeMobileMenu}>
                    <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                      Get started with Bunker
                    </button>
                  </a>

                  <a
                    href="#pricing"
                    onClick={closeMobileMenu}
                    className="block text-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Services Dropdown - Full Width Below Header */}
      <AnimatePresence>
        {servicesDropdownOpen && (
          <>
            {/* Invisible overlay to close dropdown */}
            <div
              className="fixed inset-0 z-40"
              onClick={closeAllMenus}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={openServicesDropdown}
              onMouseLeave={closeServicesDropdown}
              className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden"
              role="menu"
              aria-label="Bunker services"
            >
              <div className="w-full px-4 lg:px-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {availableServices.map((service) => (
                    <a
                      key={service.id}
                      href={service.href}
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      onClick={closeAllMenus}
                      role="menuitem"
                      aria-label={`Switch to ${service.name}: ${service.description}`}
                    >
                      <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 mb-1 relative inline-block">
                        {service.name}
                        <span
                          className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white group-hover:w-full transition-all duration-300 origin-left"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{service.description}</div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Memoize component for performance
export default memo(Navbar);
