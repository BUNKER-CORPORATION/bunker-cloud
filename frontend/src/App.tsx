import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import Support from './pages/Support';
import Resources from './pages/Resources';
import ContactSales from './pages/ContactSales';
import Documentation from './pages/Documentation';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/support" element={<Support />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact-sales" element={<ContactSales />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #111827)',
              border: '1px solid var(--toast-border, #E5E7EB)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
