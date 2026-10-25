import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentSection from '../components/CommentSection.jsx';
import TagBadge from '../components/TagBadge.jsx';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Check,
  BookOpen,
  AlertCircle,
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

  // Engagement
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPost(id);
      const fetched = res.data.post;
      setPost(fetched);
      setLikeCount(fetched.likes || 0);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError('The requested essay could not be found in the journal archives.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to retract and delete this essay? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await api.deletePost(id);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.error || 'Failed to remove essay.');
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

  const handleLike = () => {
    if (liked) {
      setLikeCount((c) => Math.max(0, c - 1));
      setLiked(false);
    } else {
      setLikeCount((c) => c + 1);
      setLiked(true);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubEmail('');
      setSubscribed(false);
    }, 4000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-4 bg-gray-800 rounded w-28"></div>
        <div className="h-10 bg-gray-800 rounded w-3/4"></div>
        <div className="h-6 bg-gray-850 rounded w-1/2"></div>
        <div className="space-y-4 pt-8">
          <div className="h-4 bg-gray-800 rounded"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          <div className="h-4 bg-gray-800 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-serif font-bold text-white mb-2">Essay Not Found</h2>
        <p className="text-sm text-gray-400 mb-6">{error || 'This article does not exist or has been archived.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal</span>
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const wordCount = post.content ? post.content.split(/\s+/).length : 200;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));
  const authorName = post.author?.name || 'Author';

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Header / Back */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800 text-xs">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-gray-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Canvas & Prose</span>
        </Link>

        {/* Curator Actions */}
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/admin/edit/${post.id}`}
              className="px-2.5 py-1 rounded text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-2.5 py-1 rounded text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              {deleting ? 'Retracting...' : 'Retract'}
            </button>
          </div>
        )}
      </div>

      {/* Main Title */}
      <header className="mb-6">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[2.75rem] text-[#F3F3F3] leading-[1.18] tracking-tight mb-4">
          {post.title}
        </h1>

        {/* Byline Row */}
        <div className="flex items-center justify-between py-4 border-y border-gray-800 my-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/80 flex items-center justify-center font-bold text-sm">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-white">{authorName}</span>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider px-1.5 py-0.2 rounded bg-blue-950/80 border border-blue-900/60">
                  {post.author?.role === 'admin' ? 'Curator' : 'Author'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {formattedDate} • {readTime} min read
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {post.tags && post.tags.slice(0, 2).map((t) => <TagBadge key={t} tag={t} />)}
          </div>
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-800 text-xs text-gray-400 mb-8">
          <div className="flex items-center space-x-6">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center space-x-1.5 transition-colors ${
                liked ? 'text-rose-500' : 'hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="font-semibold">{likeCount}</span>
            </button>

            <a
              href="#comments"
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold">Discussion</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleShare}
              className="hover:text-white flex items-center space-x-1 transition-colors"
              title="Share essay"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className={`hover:text-white transition-colors ${
                bookmarked ? 'text-blue-400' : ''
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Markdown Essay Body */}
      <div className="markdown-body">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Subscribe Box */}
      <div className="my-12 p-8 rounded-2xl bg-[#0D0E15] border border-gray-800 text-center shadow-lg shadow-black/40">
        <div className="w-10 h-10 rounded-full bg-blue-950/60 text-blue-400 border border-blue-900/60 flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-5 h-5" />
        </div>
        <h3 className="font-serif font-bold text-2xl text-white mb-2">
          Subscribe to Canvas & Prose
        </h3>
        <p className="font-sans text-sm text-gray-400 max-w-md mx-auto mb-6">
          Original reflections and critical articles delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex items-center gap-2">
          <input
            type="email"
            value={subEmail}
            onChange={(e) => setSubEmail(e.target.value)}
            placeholder="Type your email..."
            required
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-800 bg-[#12141D] text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-tight shadow-md transition-all"
          >
            {subscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>

      {/* Comments & Discussion */}
      <CommentSection postId={post.id} />
    </article>
  );
}
