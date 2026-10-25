import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all requested fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const newUser = await register(name, email, password, role);
      if (newUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Account could not be created.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white dark:bg-[#18181A] rounded-2xl border border-[#EDEDEA] dark:border-[#27272A] shadow-sm p-8 transition-colors">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#FF6719]">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">Join the Publication</h1>
          <p className="text-xs text-neutral-500 mt-1">Free subscription to Canvas & Prose</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5 font-sans">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Julian Vance"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#121214] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF6719] focus:border-[#FF6719] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5 font-sans">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="julian@canvasandprose.com"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#121214] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF6719] focus:border-[#FF6719] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5 font-sans">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#121214] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF6719] focus:border-[#FF6719] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2 font-sans">
              Membership Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                  role === 'reader'
                    ? 'border-[#FF6719] bg-[#FF6719]/5'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#18181A]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="reader"
                  checked={role === 'reader'}
                  onChange={() => setRole('reader')}
                  className="sr-only"
                />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">Subscriber</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">Read & reflect</span>
              </label>

              <label
                className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                  role === 'admin'
                    ? 'border-[#FF6719] bg-[#FF6719]/5'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#18181A]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="sr-only"
                />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">Curator</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">Publish essays</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#FF6719] hover:bg-[#E5530B] disabled:opacity-50 text-white font-bold text-sm rounded-full shadow-sm transition-all"
          >
            {loading ? 'Creating Account...' : 'Subscribe & Join'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#FF6719] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
