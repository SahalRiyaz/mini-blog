import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AlertCircle } from 'lucide-react';

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
      <div className="w-full max-w-sm bg-[#0D0E15] rounded-2xl border border-gray-800 shadow-xl p-8 transition-colors">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#3B82F6]">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-2xl text-white">Join the Publication</h1>
          <p className="text-xs text-gray-400 mt-1">Free membership to Canvas & Prose</p>
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
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Julian Vance"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-800 bg-[#12141D] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 font-sans">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="julian@canvasandprose.com"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-800 bg-[#12141D] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 font-sans">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-800 bg-[#12141D] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 font-sans">
              Membership Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                  role === 'reader'
                    ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                    : 'border-gray-800 bg-[#12141D] text-gray-400'
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
                <span className="text-xs font-bold text-white">Subscriber</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Read & reflect</span>
              </label>

              <label
                className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                  role === 'admin'
                    ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                    : 'border-gray-800 bg-[#12141D] text-gray-400'
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
                <span className="text-xs font-bold text-white">Curator</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Publish essays</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-full shadow-md transition-all"
          >
            {loading ? 'Creating Account...' : 'Subscribe & Join'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
