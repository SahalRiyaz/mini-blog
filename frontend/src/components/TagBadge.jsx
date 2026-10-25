import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function TagBadge({ tag, active = false, onClick }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(tag);
    } else {
      const currentTag = searchParams.get('tag');
      if (currentTag === tag) {
        navigate('/');
      } else {
        navigate(`/?tag=${encodeURIComponent(tag)}`);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-[#FF6719] text-white shadow-sm'
          : 'bg-[#F2F1ED] dark:bg-[#1F1F23] text-neutral-600 dark:text-neutral-300 hover:bg-[#E5E3DC] dark:hover:bg-[#2A2A2E]'
      }`}
    >
      #{tag}
    </button>
  );
}
