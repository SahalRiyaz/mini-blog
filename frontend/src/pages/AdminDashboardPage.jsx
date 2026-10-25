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
  AlertCircle,
} from 'lucide-react';

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

  const totalTags = Array.from(
    new Set(posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags : [])))
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Dashboard Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800 mb-8">
        <div>
          <span className="text-xs uppercase font-sans font-bold tracking-widest text-blue-400">
            Publication Studio
          </span>
          <h1 className="font-serif font-bold text-3xl text-white mt-1">
            Canvas & Prose
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Curated by {user?.name || 'Curator'} ({user?.email})
          </p>
        </div>

        <Link
          to="/admin/new"
          className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-tight shadow-md transition-all"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-[#0D0E15] border border-gray-800">
          <span className="text-xs text-gray-400 font-medium font-sans">Published Articles</span>
          <p className="font-serif font-bold text-3xl text-white mt-1">{posts.length}</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0D0E15] border border-gray-800">
          <span className="text-xs text-gray-400 font-medium font-sans">Active Themes & Tags</span>
          <p className="font-serif font-bold text-3xl text-blue-400 mt-1">{totalTags}</p>
        </div>
      </div>

      {/* Post List Section */}
      <div className="bg-[#0D0E15] rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
          <span className="font-serif font-bold text-base text-white">Articles</span>
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-800 bg-[#12141D] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-base text-gray-200 mb-1">
              No articles published yet
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Write and publish an original article to share with your readers.
            </p>
            <Link
              to="/admin/new"
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
            >
              <PenSquare className="w-3 h-3" />
              <span>Compose First Article</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/80">
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
                  className="p-4 flex items-center justify-between hover:bg-[#12141D]/60 transition-colors"
                >
                  <div className="max-w-md pr-4">
                    <Link
                      to={`/posts/${post.id}`}
                      className="font-serif font-bold text-base text-white hover:text-blue-400 transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      <span className="text-blue-400 font-semibold text-[10px] uppercase">
                        Published
                      </span>
                      <span>•</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/posts/${post.id}`}
                      className="p-1.5 text-gray-400 hover:text-white rounded"
                      title="View post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/edit/${post.id}`}
                      className="p-1.5 text-gray-400 hover:text-blue-400 rounded"
                      title="Edit post"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deletingId === post.id}
                      className="p-1.5 text-gray-400 hover:text-rose-400 rounded disabled:opacity-50"
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
