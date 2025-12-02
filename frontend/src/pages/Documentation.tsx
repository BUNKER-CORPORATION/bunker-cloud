import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Copy,
  Check,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  ArrowLeft,
  MessageCircle,
  Cloud,
  Clock,
  Calendar,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import SupportChatWidget from '../components/SupportChatWidget';
import { docsSections, getSectionForDoc } from '../data/docs/structure';
import { allDocs, getDocById } from '../data/docs/content';
import { DocPage, CodeExample } from '../data/docs/types';

// Simple markdown to HTML converter
function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Escape HTML first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (must be done before inline code)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || 'plaintext';
    return `<pre class="code-block" data-language="${language}"><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>');

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').filter(cell => cell.trim());
    const isHeader = match.includes('---');
    if (isHeader) return '';
    const cellType = 'td';
    const cellsHtml = cells.map(cell => `<${cellType}>${cell.trim()}</${cellType}>`).join('');
    return `<tr>${cellsHtml}</tr>`;
  });

  // Wrap consecutive table rows
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) => {
    const rows = match.trim().split('\n').filter(r => r.trim());
    if (rows.length > 0) {
      // First row is header
      const headerRow = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      const bodyRows = rows.slice(1).join('\n');
      return `<table class="doc-table"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
    }
    return match;
  });

  // Lists - unordered
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => {
    if (!match.includes('<ol>')) {
      return `<ul>${match}</ul>`;
    }
    return match;
  });

  // Lists - ordered
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ordered">$1</li>');
  html = html.replace(/(<li class="ordered">[\s\S]*?<\/li>\n?)+/g, (match) => {
    return `<ol>${match.replace(/ class="ordered"/g, '')}</ol>`;
  });

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Paragraphs (wrap remaining text)
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  // Fix nested tags in paragraphs
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ol>)/g, '$1');
  html = html.replace(/(<\/ol>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

  return html;
}

// Default content for pages without specific content
const defaultContent = (title: string): DocPage => ({
  id: 'default',
  title,
  description: `Learn about ${title} in Bunker Cloud.`,
  content: `
## ${title}

This documentation page is currently being developed. Check back soon for comprehensive guides and examples.

In the meantime, you can:
- [Contact our support team](/support) for immediate assistance
- [Browse our API reference](/docs?section=api-reference&doc=api-overview)
- Join our community Discord for help from other developers
  `,
  relatedDocs: ['introduction', 'quickstart']
});

// Code block component with copy functionality
function CodeBlock({ code, language, title }: { code: string; language: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copied to clipboard');
    } catch {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="code-example-block">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
          {title && <span className="text-sm text-gray-300">- {title}</span>}
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm rounded-b-lg">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Documentation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportChatOpen, setSupportChatOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Get current doc from URL params
  const currentSection = searchParams.get('section') || 'getting-started';
  const currentDoc = searchParams.get('doc') || 'introduction';

  // Get content for current doc
  const content: DocPage = useMemo(() => {
    const doc = getDocById(currentDoc);
    if (doc) return doc;

    // Fallback: try to find the title from the structure
    const section = docsSections.find(s => s.id === currentSection);
    const item = section?.items.find(i => i.id === currentDoc);
    return defaultContent(item?.title || 'Documentation');
  }, [currentDoc, currentSection]);

  // Find current section and item for breadcrumbs
  const activeSection = docsSections.find(s => s.id === currentSection);
  const activeItem = activeSection?.items.find(i => i.id === currentDoc);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Navigate to doc
  const navigateToDoc = (sectionId: string, docId: string) => {
    setSearchParams({ section: sectionId, doc: docId });
    setSidebarOpen(false);
    if (!expandedSections.includes(sectionId)) {
      setExpandedSections(prev => [...prev, sectionId]);
    }
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Filter docs based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery) return docsSections;

    const query = searchQuery.toLowerCase();
    return docsSections.map(section => ({
      ...section,
      items: section.items.filter(item => {
        const doc = allDocs[item.id];
        return (
          item.title.toLowerCase().includes(query) ||
          (doc && doc.description.toLowerCase().includes(query)) ||
          (doc && doc.content.toLowerCase().includes(query))
        );
      })
    })).filter(section => section.items.length > 0);
  }, [searchQuery]);

  // Search results for dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{ id: string; title: string; section: string; sectionId: string; description: string }> = [];

    docsSections.forEach(section => {
      section.items.forEach(item => {
        const doc = allDocs[item.id];
        if (
          item.title.toLowerCase().includes(query) ||
          (doc && doc.description.toLowerCase().includes(query))
        ) {
          results.push({
            id: item.id,
            title: item.title,
            section: section.title,
            sectionId: section.id,
            description: doc?.description || ''
          });
        }
      });
    });

    return results.slice(0, 8);
  }, [searchQuery]);

  // Expand section when navigating
  useEffect(() => {
    if (!expandedSections.includes(currentSection)) {
      setExpandedSections(prev => [...prev, currentSection]);
    }
  }, [currentSection]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('doc-search');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get related docs content
  const relatedDocsContent = useMemo(() => {
    if (!content.relatedDocs) return [];
    return content.relatedDocs
      .map(docId => {
        const doc = allDocs[docId];
        const section = getSectionForDoc(docId);
        if (!doc || !section) return null;
        return { doc, section };
      })
      .filter(Boolean) as Array<{ doc: DocPage; section: { id: string; title: string } }>;
  }, [content.relatedDocs]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white hidden sm:block">Bunker Cloud</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:block">|</span>
            <span className="text-gray-600 dark:text-gray-400 font-medium hidden sm:block">Documentation</span>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="doc-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded">
                {"\u2318"}K
              </kbd>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      navigateToDoc(result.sectionId, result.id);
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{result.section}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{result.title}</span>
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{result.description}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/support"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MessageCircle size={16} />
              Support
            </Link>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Home size={16} />
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Mobile Search */}
        <div className="p-4 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.includes(section.id);
            const isActiveSection = currentSection === section.id;

            return (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActiveSection
                      ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {section.title}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="mt-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigateToDoc(section.id, item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          currentDoc === item.id
                            ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link to="/docs" className="hover:text-gray-900 dark:hover:text-white">
              Docs
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span
              className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
              onClick={() => navigateToDoc(currentSection, activeSection?.items[0]?.id || '')}
            >
              {activeSection?.title}
            </span>
            {activeItem && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 dark:text-white">{activeItem.title}</span>
              </>
            )}
          </nav>

          {/* Page Header */}
          <motion.div
            key={currentDoc}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {content.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {content.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
              {content.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  content.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : content.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {content.difficulty}
                </span>
              )}
              {content.timeToRead && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {content.timeToRead}
                </span>
              )}
              {content.lastUpdated && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Updated {content.lastUpdated}
                </span>
              )}
            </div>

            {/* Content */}
            <div
              className="doc-content prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content.content) }}
            />

            {/* Code Examples */}
            {content.codeExamples && content.codeExamples.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Code Examples</h2>
                <div className="space-y-6">
                  {content.codeExamples.map((example, index) => (
                    <CodeBlock
                      key={index}
                      code={example.code}
                      language={example.language}
                      title={example.title}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Related Docs */}
            {relatedDocsContent.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Documentation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedDocsContent.map(({ doc, section }) => (
                    <button
                      key={doc.id}
                      onClick={() => navigateToDoc(section.id, doc.id)}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-gray-300">
                          {doc.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {section.title}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Was this page helpful?</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Let us know how we can improve</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toast.success('Thanks for your feedback!')}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setSupportChatOpen(true)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    No, I need help
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                {/* Previous Page */}
                {activeSection && activeSection.items.findIndex(i => i.id === currentDoc) > 0 && (
                  <button
                    onClick={() => {
                      const currentIndex = activeSection.items.findIndex(i => i.id === currentDoc);
                      navigateToDoc(currentSection, activeSection.items[currentIndex - 1].id);
                    }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Previous</span>
                  </button>
                )}
              </div>
              <div>
                {/* Next Page */}
                {activeSection && activeSection.items.findIndex(i => i.id === currentDoc) < activeSection.items.length - 1 && (
                  <button
                    onClick={() => {
                      const currentIndex = activeSection.items.findIndex(i => i.id === currentDoc);
                      navigateToDoc(currentSection, activeSection.items[currentIndex + 1].id);
                    }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span className="text-sm">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {"\u00A9"} {new Date().getFullYear()} Bunker Cloud. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/bunkercloud" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  GitHub
                </a>
                <a href="https://twitter.com/bunkercloud" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Twitter
                </a>
                <Link to="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Support Chat Widget */}
      <SupportChatWidget
        isOpen={supportChatOpen}
        onClose={() => setSupportChatOpen(false)}
      />

      {/* Floating Support Button */}
      {!supportChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSupportChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
      )}

      {/* Custom styles for doc content */}
      <style>{`
        .doc-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: inherit;
        }
        .doc-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: inherit;
        }
        .doc-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        .doc-content h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        .doc-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: rgb(107 114 128);
        }
        .dark .doc-content p {
          color: rgb(156 163 175);
        }
        .doc-content ul, .doc-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .doc-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: rgb(107 114 128);
        }
        .dark .doc-content li {
          color: rgb(156 163 175);
        }
        .doc-content ul {
          list-style-type: disc;
        }
        .doc-content ol {
          list-style-type: decimal;
        }
        .doc-content .inline-code {
          background-color: rgb(243 244 246);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          color: rgb(31 41 55);
        }
        .dark .doc-content .inline-code {
          background-color: rgb(31 41 55);
          color: rgb(229 231 235);
        }
        .doc-content .code-block {
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .doc-content .code-block code {
          display: block;
          padding: 1rem;
          background-color: rgb(17 24 39);
          color: rgb(229 231 235);
          font-size: 0.875rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          overflow-x: auto;
        }
        .doc-content .doc-table {
          width: 100%;
          margin: 1rem 0;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .doc-content .doc-table th,
        .doc-content .doc-table td {
          padding: 0.75rem;
          text-align: left;
          border: 1px solid rgb(229 231 235);
        }
        .dark .doc-content .doc-table th,
        .dark .doc-content .doc-table td {
          border-color: rgb(55 65 81);
        }
        .doc-content .doc-table th {
          background-color: rgb(249 250 251);
          font-weight: 600;
          color: rgb(17 24 39);
        }
        .dark .doc-content .doc-table th {
          background-color: rgb(31 41 55);
          color: rgb(243 244 246);
        }
        .doc-content .doc-table td {
          color: rgb(75 85 99);
        }
        .dark .doc-content .doc-table td {
          color: rgb(156 163 175);
        }
        .doc-content blockquote {
          margin: 1rem 0;
          padding: 0.5rem 1rem;
          border-left: 4px solid rgb(229 231 235);
          background-color: rgb(249 250 251);
          color: rgb(75 85 99);
        }
        .dark .doc-content blockquote {
          border-left-color: rgb(55 65 81);
          background-color: rgb(31 41 55);
          color: rgb(156 163 175);
        }
        .doc-content hr {
          margin: 2rem 0;
          border: none;
          border-top: 1px solid rgb(229 231 235);
        }
        .dark .doc-content hr {
          border-top-color: rgb(55 65 81);
        }
        .doc-content a.doc-link {
          color: rgb(17 24 39);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .dark .doc-content a.doc-link {
          color: rgb(243 244 246);
        }
        .doc-content a.doc-link:hover {
          color: rgb(75 85 99);
        }
        .dark .doc-content a.doc-link:hover {
          color: rgb(156 163 175);
        }
        .doc-content strong {
          font-weight: 600;
          color: rgb(17 24 39);
        }
        .dark .doc-content strong {
          color: rgb(243 244 246);
        }
      `}</style>
    </div>
  );
}
