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
          ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300 dark:ring-brand-800'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
      }`}
    >
      #{tag}
    </button>
  );
}
