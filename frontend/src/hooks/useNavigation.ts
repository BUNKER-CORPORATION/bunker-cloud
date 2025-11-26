import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing navigation state
 * Handles dropdown, mobile menu, and accessibility
 */
export const useNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Close dropdowns when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
    if (servicesDropdownOpen) {
      setServicesDropdownOpen(false);
    }
  }, [servicesDropdownOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const openServicesDropdown = useCallback(() => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setServicesDropdownOpen(true);
  }, []);

  const closeServicesDropdown = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 150);
  }, []);

  const toggleServicesDropdown = useCallback(() => {
    setServicesDropdownOpen((prev) => !prev);
  }, []);

  const closeAllMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, []);

  return {
    mobileMenuOpen,
    servicesDropdownOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openServicesDropdown,
    closeServicesDropdown,
    toggleServicesDropdown,
    closeAllMenus,
  };
};
