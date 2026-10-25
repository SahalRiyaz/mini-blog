import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentSection from '../components/CommentSection.jsx';
import TagBadge from '../components/TagBadge.jsx';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Trash2,
  Shield,
  User,
  AlertCircle,
  Share2,
  Check,
} from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPost(id);
      setPost(res.data.post);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError('Article not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await api.deletePost(id);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.error || 'Failed to delete post.');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="space-y-3 pt-8">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Post Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{error || 'This post does not exist or has been removed.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-brand-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const authorName = post.author?.name || 'Anonymous Author';
  const authorRole = post.author?.role || 'admin';

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all posts</span>
        </Link>

        {/* Action toolbar */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            title="Copy link to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>

          {isAdmin && (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                to={`/admin/edit/${post.id}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-300 dark:border-slate-700"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl transition-colors border border-rose-200 dark:border-rose-900 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center font-bold text-sm text-brand-700 dark:text-brand-300">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">{authorName}</span>
                <span
                  className={`inline-flex items-center space-x-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    authorRole === 'admin'
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {authorRole === 'admin' ? <Shield className="w-2.5 h-2.5 mr-0.5" /> : <User className="w-2.5 h-2.5 mr-0.5" />}
                  {authorRole}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>Published on {formattedDate}</span>
              </div>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Markdown Body */}
      <div className="markdown-body bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Discussion & Comments */}
      <CommentSection postId={post.id} />
    </article>
  );
}
