import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { MessageSquare, AlertCircle } from 'lucide-react';

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
    <div id="comments" className="mt-12 pt-8 border-t border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif font-bold text-2xl text-white flex items-center space-x-2">
          <span>Discussion ({comments.length})</span>
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comment Form or Guest Box */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-10 bg-[#0D0E15] p-4 rounded-xl border border-gray-800 shadow-md">
          <div className="flex items-center space-x-2 mb-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/80 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-gray-200">{user?.name}</span>
            <span className="text-[10px] uppercase font-bold text-blue-400 px-1.5 py-0.2 rounded bg-blue-950/80 border border-blue-900/60">
              {user?.role === 'admin' ? 'Curator' : 'Subscriber'}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-800 bg-[#12141D] text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y transition-all"
            required
          />

          <div className="flex items-center justify-between mt-2.5 pt-1">
            <span className="text-[11px] text-gray-500">
              {1000 - text.length} characters remaining
            </span>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-full shadow-sm transition-all"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-5 bg-[#0D0E15] border border-gray-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif font-bold text-sm text-white">Join the discussion</h4>
            <p className="text-xs text-gray-400 mt-0.5">Sign in to leave a reflection on this essay.</p>
          </div>
          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-tight shadow-md transition-all"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-gray-800/60 rounded-xl"></div>
          <div className="h-16 bg-gray-800/60 rounded-xl"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-xs italic font-serif">
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
                className="p-4 bg-[#0D0E15] rounded-xl border border-gray-800/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-950/60 text-blue-400 border border-blue-900/60 flex items-center justify-center font-bold text-xs">
                      {commentAuthor.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-200">{commentAuthor}</span>
                    {commentRole === 'admin' && (
                      <span className="text-[10px] font-bold text-blue-400 px-1.5 py-0.2 rounded bg-blue-950/80 border border-blue-900/60">
                        Curator
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500">{commentDate}</span>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed pl-8">
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
