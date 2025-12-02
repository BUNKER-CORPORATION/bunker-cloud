// Navigation configuration for Bunker Cloud platform
// Centralized configuration for easy maintenance and scalability

export interface BunkerService {
  id: string;
  name: string;
  href: string;
  description: string;
  isExternal?: boolean;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

// Bunker Services - dynamically filtered based on current service
export const BUNKER_SERVICES: BunkerService[] = [
  {
    id: 'cloud',
    name: 'CLOUD',
    href: '/',
    description: 'Cloud infrastructure and hosting',
  },
  {
    id: 'mail',
    name: 'MAIL',
    href: '/mail',
    description: 'Secure email services',
  },
  {
    id: 'tunnel',
    name: 'TUNNEL',
    href: '/tunnel',
    description: 'VPN and secure networking',
  },
  {
    id: 'database',
    name: 'DATABASE',
    href: '/database',
    description: 'Managed database services',
  },
  {
    id: 'verse',
    name: 'VERSE',
    href: '/verse',
    description: 'Collaboration platform',
  },
  {
    id: 'meet',
    name: 'MEET',
    href: '/meet',
    description: 'Video conferencing',
  },
  {
    id: 'tools',
    name: 'TOOLS',
    href: '/tools',
    description: 'Developer tools and utilities',
  },
];

// Main navigation links
export const MAIN_NAV_LINKS: NavLink[] = [
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'solutions', label: 'Solutions', href: '#solutions' },
  { id: 'security', label: 'Security', href: '#security' },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
];

// Secondary navigation links
export const SECONDARY_NAV_LINKS: NavLink[] = [
  { id: 'docs', label: 'Docs', href: '/docs' },
  { id: 'resources', label: 'Resources', href: '/resources' },
  { id: 'support', label: 'Support', href: '/support' },
  { id: 'sales', label: 'Contact Sales', href: '/contact-sales' },
];

// Get services excluding the current one
export const getAvailableServices = (currentServiceId: string): BunkerService[] => {
  return BUNKER_SERVICES.filter((service) => service.id !== currentServiceId);
};

// Get current service info
export const getCurrentService = (serviceId: string): BunkerService | undefined => {
  return BUNKER_SERVICES.find((service) => service.id === serviceId);
};
