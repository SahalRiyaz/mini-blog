import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Unrecognized credentials. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-[#0D0E15] rounded-2xl border border-gray-800 shadow-xl p-8 transition-colors">
        {/* Ribbon Icon */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#3B82F6]">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-2xl text-white">Sign In</h1>
          <p className="text-xs text-gray-400 mt-1">To Canvas & Prose</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 font-sans">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@canvasandprose.com"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-800 bg-[#12141D] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 font-sans">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-800 bg-[#12141D] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-full shadow-md transition-all"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        {/* 1-Click Guest Pass */}
        <div className="mt-7 pt-5 border-t border-gray-800">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2.5">
            1-Click Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@miniblog.com', 'admin123')}
              className="py-1.5 px-3 bg-[#12141D] hover:bg-[#181B26] text-gray-300 rounded-lg text-xs font-medium border border-gray-800 transition-colors"
            >
              Curator
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('reader@miniblog.com', 'reader123')}
              className="py-1.5 px-3 bg-[#12141D] hover:bg-[#181B26] text-gray-300 rounded-lg text-xs font-medium border border-gray-800 transition-colors"
            >
              Reader
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          New to Canvas & Prose?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
