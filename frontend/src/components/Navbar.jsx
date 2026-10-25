import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Palette,
  PenTool,
  Compass,
  LogOut,
  LogIn,
  UserPlus,
  Crown,
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 font-serif text-slate-900 dark:text-white group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Canvas <span className="text-amber-600 dark:text-amber-500 font-serif italic">&</span> Prose
              </span>
              <span className="text-[10px] uppercase font-sans tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
                An Art & Aesthetic Journal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-50/60 dark:hover:bg-slate-800 transition-colors"
            >
              Explore Essays
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-1.5 text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Curator Studio</span>
                </Link>
                <Link
                  to="/admin/new"
                  className="flex items-center space-x-1.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 px-3.5 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Compose Essay</span>
                </Link>
              </>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={isDark ? 'Switch to Warm Paper' : 'Switch to Gallery Night'}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center pl-2 border-l border-slate-200 dark:border-slate-800 space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {user?.name}
                    </span>
                    <span
                      className={`inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider ${
                        isAdmin ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isAdmin ? <Crown className="w-2.5 h-2.5 mr-0.5" /> : <BookOpen className="w-2.5 h-2.5 mr-0.5" />}
                      <span>{isAdmin ? 'Curator' : 'Reader'}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center pl-2 border-l border-slate-200 dark:border-slate-800 space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-400 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join Journal</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center space-x-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 py-1.5"
          >
            Explore Essays
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm font-medium text-amber-700 dark:text-amber-400 py-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Curator Studio</span>
              </Link>
              <Link
                to="/admin/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm font-medium text-amber-600 dark:text-amber-500 py-1.5"
              >
                <PenTool className="w-4 h-4" />
                <span>Compose Essay</span>
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">
                      {isAdmin ? 'Curator' : 'Reader'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 py-1.5 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg"
                >
                  Join Journal
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
