import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  PenSquare,
  LayoutDashboard,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Check,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubscribeClick = () => {
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D0E15]/95 backdrop-blur-md border-b border-gray-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Electric Blue Ribbon & Publication Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              {/* Sapphire Blue Ribbon Emblem */}
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#3B82F6] group-hover:scale-105 transition-transform">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-white">
                Canvas & Prose
              </span>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center pl-6 space-x-1 text-sm font-medium">
              <Link
                to="/"
                className={`px-3 py-1 rounded-md transition-colors ${
                  location.pathname === '/'
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/?tag=painting"
                className="px-3 py-1 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                Paintings
              </Link>
              <Link
                to="/?tag=sculpture"
                className="px-3 py-1 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                Sculpture
              </Link>
              <Link
                to="/?tag=renaissance"
                className="px-3 py-1 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                Renaissance
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Curator Tools */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/new"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-200 hover:bg-[#181B26] hover:text-white transition-colors border border-gray-700/80"
                >
                  <PenSquare className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Write</span>
                </Link>
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-blue-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sapphire Blue Subscribe Pill */}
            <button
              type="button"
              onClick={handleSubscribeClick}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold tracking-tight shadow-sm hover:shadow transition-all"
            >
              {subscribed ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center pl-1 space-x-2">
                <div
                  className="w-7 h-7 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/80 flex items-center justify-center font-bold text-xs"
                  title={`${user?.name} (${user?.role})`}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1 text-gray-400 hover:text-rose-400 rounded transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex text-xs font-medium text-gray-300 hover:text-white px-2 py-1"
              >
                Sign in
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-300 rounded hover:bg-gray-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0D0E15] px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-white"
          >
            Home
          </Link>
          <Link
            to="/?tag=painting"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-400"
          >
            Paintings
          </Link>
          <Link
            to="/?tag=sculpture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-400"
          >
            Sculptural Form
          </Link>
          <Link
            to="/?tag=renaissance"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-400"
          >
            Renaissance
          </Link>

          {isAdmin && (
            <div className="pt-2 border-t border-gray-800 space-y-2">
              <Link
                to="/admin/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm font-semibold text-blue-400"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write New Essay</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-gray-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-rose-400 font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-xs font-semibold text-white py-2 border border-gray-700 rounded-full"
              >
                Sign in to Canvas & Prose
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
