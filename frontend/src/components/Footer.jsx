import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 mt-24 py-12 text-xs text-gray-400 bg-[#090A0F] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#3B82F6]">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
            <span className="font-serif font-bold text-gray-200">
              Canvas & Prose
            </span>
            <span>•</span>
            <span>Art & Aesthetics</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Archive
            </Link>
            <Link to="/?tag=painting" className="text-gray-400 hover:text-white transition-colors">
              Paintings
            </Link>
            <Link to="/?tag=sculpture" className="text-gray-400 hover:text-white transition-colors">
              Sculptural Form
            </Link>
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
