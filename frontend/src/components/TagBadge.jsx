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
          ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
          : 'bg-[#12141D] text-gray-300 hover:bg-[#181B26] hover:text-white border border-gray-800'
      }`}
    >
      #{tag}
    </button>
  );
}
