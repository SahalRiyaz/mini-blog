import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  PenSquare,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Users,
  FileText,
  Heart,
  AlertCircle,
} from 'lucide-react';
import TagBadge from '../components/TagBadge.jsx';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPosts();
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Failed to load essays for curator:', err);
      setError('Could not retrieve curated articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to retract and delete "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Retract failed:', err);
      alert(err.response?.data?.error || 'Failed to remove essay.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Substack Dashboard Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDEDEA] dark:border-[#27272A] mb-8">
        <div>
          <span className="text-xs uppercase font-sans font-bold tracking-widest text-[#FF6719]">
            Publication Dashboard
          </span>
          <h1 className="font-serif font-bold text-3xl text-neutral-900 dark:text-white mt-1">
            Canvas & Prose
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Elena Rostova • 1,420 total subscribers
          </p>
        </div>

        <Link
          to="/admin/new"
          className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#FF6719] hover:bg-[#E5530B] text-white text-xs font-bold tracking-tight shadow-sm transition-all"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Substack Publication Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-white dark:bg-[#18181A] border border-[#EDEDEA] dark:border-[#27272A]">
          <span className="text-xs text-neutral-500 font-medium">Published Essays</span>
          <p className="font-serif font-bold text-3xl text-neutral-900 dark:text-white mt-1">{posts.length}</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#18181A] border border-[#EDEDEA] dark:border-[#27272A]">
          <span className="text-xs text-neutral-500 font-medium">Total Subscribers</span>
          <p className="font-serif font-bold text-3xl text-neutral-900 dark:text-white mt-1">1,420</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#18181A] border border-[#EDEDEA] dark:border-[#27272A]">
          <span className="text-xs text-neutral-500 font-medium">Reader Engagement</span>
          <p className="font-serif font-bold text-3xl text-[#FF6719] mt-1">94.8%</p>
        </div>
      </div>

      {/* Post List Section */}
      <div className="bg-white dark:bg-[#18181A] rounded-xl border border-[#EDEDEA] dark:border-[#27272A] overflow-hidden">
        <div className="p-4 border-b border-[#EDEDEA] dark:border-[#27272A] flex items-center justify-between gap-4">
          <span className="font-serif font-bold text-base text-neutral-900 dark:text-white">Posts</span>
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-[#FCFBF9] dark:bg-[#121214] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF6719]"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-400">Loading publication list...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">No posts match your search.</div>
        ) : (
          <div className="divide-y divide-[#EDEDEA] dark:divide-[#27272A]">
            {filteredPosts.map((post) => {
              const dateStr = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '';

              return (
                <div
                  key={post.id}
                  className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="max-w-md pr-4">
                    <Link
                      to={`/posts/${post.id}`}
                      className="font-serif font-bold text-base text-neutral-900 dark:text-white hover:text-[#FF6719] transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-neutral-400 mt-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] uppercase">
                        Published
                      </span>
                      <span>•</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/posts/${post.id}`}
                      className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-white rounded"
                      title="View post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/edit/${post.id}`}
                      className="p-1.5 text-neutral-400 hover:text-[#FF6719] rounded"
                      title="Edit post"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deletingId === post.id}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded disabled:opacity-50"
                      title="Retract post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
