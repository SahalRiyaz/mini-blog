import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { MessageSquare, Send, LogIn, AlertCircle, Crown, BookOpen } from 'lucide-react';

export default function CommentSection({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getComments(postId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Failed to load reflections:', err);
      setError('Could not load reader reflections. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.addComment(postId, { text: text.trim() });
      const newComment = res.data.comment;
      setComments((prev) => [newComment, ...prev]);
      setText('');
    } catch (err) {
      console.error('Failed to post reflection:', err);
      setError(err.response?.data?.error || 'Failed to submit reflection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="comments" className="mt-12 pt-10 border-t border-amber-150 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>Reader Reflections & Dialogue ({comments.length})</span>
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comment Form (Logged in) or CTA (Guest) */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-10 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Writing as {user?.name}</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-slate-800 text-amber-800 dark:text-amber-400">
              {user?.role === 'admin' ? 'Curator' : 'Reader'}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your perspective on this work, its aesthetic nuance, or historical context..."
            rows={3}
            maxLength={1000}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-y transition-all"
            required
          />

          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {1000 - text.length} characters remaining
            </span>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-sm hover:shadow transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Post Reflection'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-gradient-to-r from-amber-50/70 to-orange-50/70 dark:from-slate-900 dark:to-slate-850 border border-amber-100 dark:border-slate-800 rounded-2xl text-center transition-colors">
          <h4 className="font-serif font-bold text-slate-800 dark:text-slate-100 mb-1 text-base">Enter the artistic dialogue</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
            Join our circle of art enthusiasts, critics, and scholars. Sign in with your account to contribute reflections.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in to reflect</span>
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
            >
              Join the Journal
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-amber-200 dark:border-slate-800">
          <MessageSquare className="w-8 h-8 text-amber-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No reflections recorded yet.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Be the first to share your interpretation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const commentAuthor = comment.user?.name || 'Reader';
            const commentRole = comment.user?.role || 'reader';
            const commentDate = comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={comment.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100/90 dark:border-slate-800 shadow-sm transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-amber-800 dark:text-amber-400">
                      {commentAuthor.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{commentAuthor}</span>
                    <span
                      className={`inline-flex items-center space-x-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        commentRole === 'admin'
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {commentRole === 'admin' ? (
                        <Crown className="w-2.5 h-2.5 mr-0.5 text-amber-600" />
                      ) : (
                        <BookOpen className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      <span>{commentRole === 'admin' ? 'Curator' : 'Reader'}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{commentDate}</span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                  {comment.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
