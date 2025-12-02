// Documentation Types for Bunker Cloud

import { LucideIcon } from 'lucide-react';

// A single documentation page
export interface DocPage {
  id: string;
  title: string;
  description: string;
  content: string;
  codeExamples?: CodeExample[];
  relatedDocs?: string[]; // Array of doc IDs
  lastUpdated?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  timeToRead?: string;
}

// Code example with language and optional title
export interface CodeExample {
  language: string;
  title?: string;
  code: string;
}

// A section containing multiple doc pages
export interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: DocItem[];
}

// An item in a section (can be a page or a subsection)
export interface DocItem {
  id: string;
  title: string;
  description?: string;
  items?: DocItem[]; // Nested items for subsections
}

// The complete documentation structure
export interface DocsStructure {
  sections: DocSection[];
  pages: Record<string, DocPage>;
}

// Navigation breadcrumb
export interface DocBreadcrumb {
  label: string;
  path?: string;
}

// Search result
export interface DocSearchResult {
  id: string;
  title: string;
  section: string;
  description: string;
  matchedContent?: string;
}
