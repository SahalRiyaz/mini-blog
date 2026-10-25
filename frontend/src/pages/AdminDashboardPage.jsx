import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Compass,
  PenTool,
  BookOpen,
  Edit3,
  Trash2,
  ExternalLink,
  Tag,
  AlertCircle,
  Search,
  Crown,
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
      setError('Could not retrieve curated articles. Please verify network access.');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full w-fit mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Curatorial Studio & Editorial Desk</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">Curator's Studio</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curated by <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span> ({user?.email})
          </p>
        </div>

        <Link
          to="/admin/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all font-sans"
        >
          <PenTool className="w-4 h-4" />
          <span>Compose New Essay</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Curated Essays</p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{posts.length}</h3>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Artistic Themes</p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{totalTags}</h3>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Standing</p>
            <h3 className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400 text-sm mt-1">
              Curator & Editor
            </h3>
          </div>
        </div>
      </div>

      {/* Catalogue Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-100/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Published Articles & Exhibits</h2>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or theme..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Loading catalogue...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No essays match your inquiry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-amber-50/40 dark:bg-slate-800/60 border-b border-amber-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-4">Artistic Themes</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50/60 dark:divide-slate-800">
                {filteredPosts.map((post) => {
                  const dateStr = post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '';

                  return (
                    <tr key={post.id} className="hover:bg-amber-50/30 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-serif font-bold text-slate-900 dark:text-slate-100 max-w-xs">
                        <Link
                          to={`/posts/${post.id}`}
                          className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {post.tags && post.tags.length > 0 ? (
                            post.tags.slice(0, 3).map((t) => <TagBadge key={t} tag={t} />)
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500 italic">No themes</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {post.author?.name || 'Curator'}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">{dateStr}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/posts/${post.id}`}
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Read Public Essay"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/edit/${post.id}`}
                            className="p-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                            title="Edit Essay"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deletingId === post.id}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors disabled:opacity-50"
                            title="Retract Essay"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
