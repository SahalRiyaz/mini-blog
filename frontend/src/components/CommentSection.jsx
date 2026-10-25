import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { MessageSquare, Heart, Send, AlertCircle, Crown, LogIn } from 'lucide-react';

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
      setError(err.response?.data?.error || 'Failed to submit reflection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="comments" className="mt-12 pt-8 border-t border-[#EDEDEA] dark:border-[#27272A]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white flex items-center space-x-2">
          <span>Discussion ({comments.length})</span>
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Substack Comment Form or Guest Box */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-10 bg-white dark:bg-[#18181A] p-4 rounded-xl border border-[#EDEDEA] dark:border-[#27272A] shadow-sm">
          <div className="flex items-center space-x-2 mb-2.5">
            <div className="w-6 h-6 rounded-full bg-[#FF6719]/10 text-[#FF6719] flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{user?.name}</span>
            <span className="text-[10px] uppercase font-bold text-[#FF6719] px-1.5 py-0.2 rounded bg-[#FF6719]/10">
              {user?.role === 'admin' ? 'Curator' : 'Subscriber'}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-[#FCFBF9] dark:bg-[#121214] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF6719] resize-y transition-all"
            required
          />

          <div className="flex items-center justify-between mt-2.5 pt-1">
            <span className="text-[11px] text-neutral-400">
              {1000 - text.length} characters remaining
            </span>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="px-5 py-1.5 bg-[#FF6719] hover:bg-[#E5530B] disabled:opacity-50 text-white font-bold text-xs rounded-full shadow-sm transition-all"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-5 bg-white dark:bg-[#18181A] border border-[#EDEDEA] dark:border-[#27272A] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">Join the discussion</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Sign in to leave a reflection on this essay.</p>
          </div>
          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-[#FF6719] hover:bg-[#E5530B] text-white text-xs font-bold tracking-tight shadow-sm transition-all"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl"></div>
          <div className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 text-xs italic font-serif">
          No comments yet. Start the conversation!
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
                })
              : '';

            return (
              <div
                key={comment.id}
                className="p-4 bg-white dark:bg-[#18181A] rounded-xl border border-[#EDEDEA] dark:border-[#27272A] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#FF6719]/10 text-[#FF6719] flex items-center justify-center font-bold text-xs">
                      {commentAuthor.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{commentAuthor}</span>
                    {commentRole === 'admin' && (
                      <span className="text-[10px] font-bold text-[#FF6719] px-1.5 py-0.2 rounded bg-[#FF6719]/10">
                        Curator
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400">{commentDate}</span>
                </div>

                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed pl-8">
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
