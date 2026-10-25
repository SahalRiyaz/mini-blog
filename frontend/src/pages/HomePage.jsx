import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import PostCard from '../components/PostCard.jsx';
import TagBadge from '../components/TagBadge.jsx';
import {
  Search,
  Check,
  X,
  Palette,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Crown,
  BookOpen,
} from 'lucide-react';

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

  // Subscribe Box state
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
      setError('Unable to load journal articles. Please refresh shortly.');
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
      setSubscribed(false);
    }, 4000);
  };

  const isFiltering = Boolean(currentTag || searchParams.get('search'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Substack Publication Masthead */}
      <section className="text-center py-10 md:py-14 border-b border-[#EDEDEA] dark:border-[#27272A] mb-10 transition-colors">
        <div className="w-16 h-16 rounded-full bg-[#FF6719]/10 text-[#FF6719] border-2 border-[#FF6719]/30 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Palette className="w-8 h-8" />
        </div>

        <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl text-[#1C1C1C] dark:text-white tracking-tight leading-tight">
          Canvas & Prose
        </h1>

        <p className="mt-3 font-serif text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto italic">
          Essays on painting, sculpture, and the timeless contemplation of visual form.
        </p>

        <p className="mt-2 text-xs uppercase font-sans font-semibold tracking-widest text-neutral-400 dark:text-neutral-500">
          By Elena Rostova • 1,420 readers
        </p>

        {/* Signature Substack Email Subscribe Box */}
        <form onSubmit={handleSubscribe} className="mt-7 max-w-md mx-auto flex items-center gap-2 px-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Type your email..."
            required
            className="flex-1 px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#18181A] text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF6719]/30 focus:border-[#FF6719] transition-all"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#FF6719] hover:bg-[#E5530B] text-white text-sm font-bold tracking-tight shadow-sm hover:shadow transition-all flex items-center space-x-1"
          >
            {subscribed ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                <span>Subscribed!</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </form>
      </section>

      {/* Two-Column Substack Publication Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Feed Column (Articles) */}
        <div className="lg:col-span-8">
          {/* Search / Filter notice bar */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EDEDEA] dark:border-[#27272A]">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-sans">
              {isFiltering ? 'Search Results' : 'Latest Essays'}
            </span>

            {isFiltering && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-[#FF6719] hover:underline"
              >
                <X className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="space-y-8 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border-b border-[#EDEDEA] dark:border-[#27272A] pb-8 space-y-3">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
                  <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
                  <div className="h-12 bg-neutral-100 dark:bg-neutral-850 rounded"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
              <BookOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
              <h3 className="font-serif font-bold text-lg text-neutral-800 dark:text-neutral-200">No essays found</h3>
              <p className="text-sm text-neutral-500 mt-1 mb-4">
                {isFiltering
                  ? 'Try searching with different artistic movements or themes.'
                  : 'The journal archive is currently empty.'}
              </p>
              {isFiltering && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-1.5 text-xs font-semibold text-[#FF6719] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Substack Right Sidebar Column */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Quick Search Widget */}
          <div className="bg-white dark:bg-[#18181A] p-4 rounded-xl border border-[#EDEDEA] dark:border-[#27272A] shadow-sm">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search archive..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-[#FCFBF9] dark:bg-[#121214] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF6719]"
              />
            </form>
          </div>

          {/* About Publication Card */}
          <div className="bg-white dark:bg-[#18181A] p-6 rounded-2xl border border-[#EDEDEA] dark:border-[#27272A] shadow-sm">
            <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white mb-2">
              About Canvas & Prose
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              A private journal dedicated to in-depth reflections on Western and world art history, museum retrospectives, and the emotional resonance of artistic craft.
            </p>
            <div className="pt-3 border-t border-[#EDEDEA] dark:border-[#27272A] text-xs text-neutral-500 flex items-center justify-between">
              <span>Published by Elena Rostova</span>
              <span className="font-semibold text-[#FF6719]">Weekly</span>
            </div>
          </div>

          {/* Curated Themes / Tags */}
          {allTags.length > 0 && (
            <div className="bg-white dark:bg-[#18181A] p-6 rounded-2xl border border-[#EDEDEA] dark:border-[#27272A] shadow-sm">
              <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white mb-3">
                Themes & Periods
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <TagBadge key={tag} tag={tag} active={currentTag === tag} />
                ))}
              </div>
            </div>
          )}

          {/* Substack Community / Patron Card */}
          <div className="p-6 rounded-2xl bg-[#FF6719]/5 dark:bg-[#FF6719]/10 border border-[#FF6719]/20 text-center">
            <Crown className="w-6 h-6 text-[#FF6719] mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white mb-1">
              Join the Art Circle
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Subscribers receive full essays, archive access, and invitation to reader dialogue.
            </p>
            <Link
              to="/register"
              className="inline-block w-full py-2 rounded-full bg-[#FF6719] hover:bg-[#E5530B] text-white text-xs font-bold tracking-tight shadow-sm transition-all"
            >
              Get Free Subscription
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
