
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { StorageService } from '../services/storageService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const session = StorageService.getCurrentSession();

  const handleLogout = () => {
    StorageService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-heading font-bold tracking-tight text-white">DJ<span className="text-indigo-500">PRESS</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 ml-10">
            <Link to="/" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">Explore</Link>
            {session?.isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 text-sm font-bold transition-colors">
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-bold transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
