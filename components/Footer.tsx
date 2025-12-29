
import React from 'react';
import { Music, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Music className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-heading font-bold tracking-tight text-white">DJ<span className="text-indigo-500">PRESS</span></span>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs">
            The professional standard for electronic music press kits. Built by DJs, for DJs.
          </p>
          <div className="flex space-x-4 text-zinc-400">
            <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <Github className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="#" className="hover:text-indigo-400">Features</a></li>
            <li><a href="#" className="hover:text-indigo-400">Showcase</a></li>
            <li><a href="#" className="hover:text-indigo-400">Pricing</a></li>
            <li><a href="#" className="hover:text-indigo-400">API</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="#" className="hover:text-indigo-400">Help Center</a></li>
            <li><a href="#" className="hover:text-indigo-400">Guidelines</a></li>
            <li><a href="#" className="hover:text-indigo-400">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
            <li><a href="#" className="hover:text-indigo-400">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        &copy; {new Date().getFullYear()} DJPress Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
