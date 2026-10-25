import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { MessageSquare, Send, LogIn, AlertCircle, Shield, User } from 'lucide-react';

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
      console.error('Failed to load comments:', err);
      setError('Could not load comments. Please refresh.');
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
      console.error('Failed to post comment:', err);
      setError(err.response?.data?.error || 'Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="comments" className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <span>Discussion ({comments.length})</span>
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
        <form onSubmit={handleAddComment} className="mb-10 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Commenting as {user?.name}</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {user?.role}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your perspective or ask a question..."
            rows={3}
            maxLength={1000}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y transition-all"
            required
          />

          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {1000 - text.length} characters left
            </span>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-sm hover:shadow transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-slate-900 dark:to-slate-850 border border-brand-100 dark:border-slate-800 rounded-2xl text-center transition-colors">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 text-sm">Join the conversation</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
            Readers and admins can participate in discussions. Sign in with your account to leave a comment.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in to comment</span>
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-200 bg-white dark:bg-slate-800 border border-brand-200 dark:border-slate-700 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
            >
              Create free account
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
        <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No comments yet.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Be the first to share your thoughts!</p>
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
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                      {commentAuthor.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{commentAuthor}</span>
                    <span
                      className={`inline-flex items-center space-x-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        commentRole === 'admin'
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {commentRole === 'admin' ? (
                        <Shield className="w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <User className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      <span>{commentRole}</span>
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
