import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Share2, Bookmark, Check } from 'lucide-react';
import TagBadge from './TagBadge.jsx';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '';

  // Approximate reading time (180 words per minute)
  const wordCount = post.content ? post.content.split(/\s+/).length : 100;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  // Extract clean excerpt without markdown symbols
  const excerpt = post.content
    ? post.content
        .replace(/[#*`_~>[\]()-]/g, '')
        .trim()
        .slice(0, 180) + (post.content.length > 180 ? '...' : '')
    : '';

  const authorName = post.author?.name || 'Author';

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      setLikeCount((c) => Math.max(0, c - 1));
      setLiked(false);
    } else {
      setLikeCount((c) => c + 1);
      setLiked(true);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="border-b border-[#EDEDEA] dark:border-[#27272A] pb-8 mb-8 last:border-b-0 transition-colors group">
      {/* Top Byline Row */}
      <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2.5">
        <div className="w-5 h-5 rounded-full bg-[#FF6719]/10 text-[#FF6719] flex items-center justify-center font-bold text-[10px]">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{authorName}</span>
        <span>•</span>
        <span>{formattedDate}</span>
        <span>•</span>
        <span>{readTime} min read</span>
      </div>

      {/* Main Headline */}
      <Link to={`/posts/${post.id}`} className="block">
        <h2 className="font-serif font-bold text-2xl sm:text-[1.7rem] text-[#1C1C1C] dark:text-[#F3F3F3] leading-snug tracking-tight group-hover:text-[#FF6719] dark:group-hover:text-[#FF7D3B] transition-colors mb-2">
          {post.title}
        </h2>
        {/* Subtitle / Excerpt */}
        <p className="font-sans text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed line-clamp-2 mb-3.5">
          {excerpt}
        </p>
      </Link>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Substack Bottom Engagement Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-1">
        <div className="flex items-center space-x-4">
          {/* Like Heart */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center space-x-1.5 transition-colors ${
              liked ? 'text-rose-600' : 'hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span className="font-medium">{likeCount}</span>
          </button>

          {/* Comments link */}
          <Link
            to={`/posts/${post.id}#comments`}
            className="flex items-center space-x-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Reflect</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`p-1 transition-colors ${
              bookmarked ? 'text-[#FF6719]' : 'hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Save essay"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#FF6719]' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
