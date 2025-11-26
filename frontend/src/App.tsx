import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#111827',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
