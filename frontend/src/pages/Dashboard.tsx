import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-neutral-800 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">BUNKER CLOUD</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h2>
          <p className="text-neutral-400 mb-8">
            Logged in as: <span className="text-white">{user?.email}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Active Services</h3>
              <p className="text-4xl font-bold">0</p>
              <p className="text-neutral-400 text-sm mt-2">No services yet</p>
            </div>

            <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Storage Used</h3>
              <p className="text-4xl font-bold">0 GB</p>
              <p className="text-neutral-400 text-sm mt-2">0% of quota</p>
            </div>

            <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Monthly Cost</h3>
              <p className="text-4xl font-bold">$0</p>
              <p className="text-neutral-400 text-sm mt-2">Free tier</p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-neutral-400 mb-6">Deploy your first application or register a domain</p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
              >
                Deploy Website
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-neutral-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-700 transition-colors border border-neutral-700"
              >
                Register Domain
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
