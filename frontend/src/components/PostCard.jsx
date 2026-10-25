import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, ArrowRight, Shield } from 'lucide-react';
import TagBadge from './TagBadge.jsx';

export default function PostCard({ post }) {
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const excerpt = post.content
    ? post.content
        .replace(/[#*`_~>[\]()-]/g, '')
        .trim()
        .slice(0, 160) + (post.content.length > 160 ? '...' : '')
    : '';

  const authorName = post.author?.name || 'Anonymous Author';
  const authorRole = post.author?.role || 'admin';

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-brand-700/60 transition-all flex flex-col justify-between">
      <div>
        {/* Author & Date metadata */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[10px]">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{authorName}</span>
            {authorRole === 'admin' && (
              <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-200 dark:border-purple-800">
                <Shield className="w-2.5 h-2.5 mr-0.5" />
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/posts/${post.id}`}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
      </div>

      <div>
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Card Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            to={`/posts/${post.id}`}
            className="inline-flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors space-x-1"
          >
            <span>Read full story</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to={`/posts/${post.id}#comments`}
            className="inline-flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
