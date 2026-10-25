import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import PostCard from '../components/PostCard.jsx';
import TagBadge from '../components/TagBadge.jsx';
import { Search, Sparkles, X, PlusCircle, BookOpen, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get('tag') || '';
  const initialSearch = searchParams.get('search') || '';

  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [currentTag, searchParams.get('search')]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (currentTag) params.tag = currentTag;
      const search = searchParams.get('search');
      if (search) params.search = search;

      const res = await api.getPosts(params);
      const fetchedPosts = res.data.posts || [];
      setPosts(fetchedPosts);

      if (!currentTag && !search) {
        const tagsSet = new Set();
        fetchedPosts.forEach((p) => {
          if (p.tags && Array.isArray(p.tags)) {
            p.tags.forEach((t) => tagsSet.add(t));
          }
        });
        setAllTags(Array.from(tagsSet));
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Unable to load blog posts. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const isFiltering = Boolean(currentTag || searchParams.get('search'));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 bg-gradient-to-b from-brand-50/60 via-white to-transparent dark:from-slate-900/80 dark:via-slate-900/40 dark:to-transparent rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 md:p-12 mb-12 shadow-sm relative overflow-hidden transition-colors">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 text-xs font-semibold mb-4 border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Stack Mini Blog Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Thoughts, ideas, and architecture in <span className="bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">modern code</span>.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Built with React, Express, and JWT Authentication. Explore articles, filter by tag, and join discussions.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-xl mx-auto relative flex items-center"
        >
          <div className="absolute left-4 text-slate-400 dark:text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Search
          </button>
        </form>

        {/* Tags bar */}
        {allTags.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              Popular Tags:
            </span>
            {allTags.map((tag) => (
              <TagBadge key={tag} tag={tag} active={currentTag === tag} />
            ))}
          </div>
        )}
      </section>

      {/* Filter notification and Admin Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {isFiltering ? 'Search Results' : 'Latest Stories'}
          </h2>
          {isFiltering && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Filtered by {currentTag && `tag: #${currentTag}`} {searchParams.get('search') && `keyword: "${searchParams.get('search')}"`}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900"
              >
                <X className="w-3 h-3" />
                <span>Clear filters</span>
              </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <Link
            to="/admin/new"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Post</span>
          </Link>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center space-x-3 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No posts found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            {isFiltering
              ? 'Try modifying your search keywords or removing selected tag filters.'
              : 'There are no published articles yet. Admins can create the first post!'}
          </p>
          {isFiltering ? (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          ) : isAdmin ? (
            <Link
              to="/admin/new"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl"
            >
              Create Post Now
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
