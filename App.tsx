
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ArtistPage from './pages/ArtistPage';
import Dashboard from './pages/Dashboard';
import MagicSetup from './pages/MagicSetup';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/magic-setup" element={<MagicSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/u/:username" element={<ArtistPage />} />
        
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
            <h1 className="text-4xl font-heading font-black mb-4">404</h1>
            <p className="text-zinc-500 mb-8">Page not found.</p>
            <a href="/" className="px-6 py-2 bg-indigo-600 rounded-full font-bold">Go Home</a>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default App;
