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
  PenSquare,
  BookOpen,
  Mail,
} from 'lucide-react';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get('tag') || '';
  const initialSearch = searchParams.get('search') || '';

  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [allTags, setAllTags] = useState([]);

  // Email subscribe input
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
      {/* Masthead in Black, Blue, and Gray */}
      <section className="text-center py-10 md:py-14 border-b border-gray-800/80 mb-10 transition-colors">
        <div className="w-16 h-16 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/80 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-950/40">
          <Palette className="w-8 h-8" />
        </div>

        <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
          Canvas & Prose
        </h1>

        <p className="mt-3 font-serif text-lg sm:text-xl text-gray-300 max-w-xl mx-auto italic">
          Essays on painting, sculpture, and the timeless contemplation of visual form.
        </p>

        <p className="mt-2 text-xs uppercase font-sans font-semibold tracking-widest text-gray-500">
          A publication of original writings & critiques
        </p>

        {/* Subscribe Box */}
        <form onSubmit={handleSubscribe} className="mt-7 max-w-md mx-auto flex items-center gap-2 px-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Type your email..."
            required
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-800 bg-[#12141D] text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-tight shadow-md shadow-blue-900/30 hover:shadow-lg transition-all flex items-center space-x-1"
          >
            {subscribed ? (
              <>
                <Check className="w-4 h-4 mr-1 text-white" />
                <span>Subscribed!</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </form>
      </section>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Feed Column */}
        <div className="lg:col-span-8">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">
              {isFiltering ? 'Search Results' : 'Articles'}
            </span>

            {isFiltering && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:underline"
              >
                <X className="w-3 h-3" />
                <span>Reset search</span>
              </button>
            )}
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="space-y-8 animate-pulse">
              {[1, 2].map((n) => (
                <div key={n} className="border-b border-gray-800/80 pb-8 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                  <div className="h-7 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-12 bg-gray-850 rounded"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 px-4 border border-dashed border-gray-800 rounded-2xl bg-[#0D0E15]">
              <div className="w-12 h-12 rounded-full bg-blue-950/60 text-blue-400 border border-blue-900/50 flex items-center justify-center mx-auto mb-3">
                <PenSquare className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">
                No articles published yet
              </h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto mt-2 mb-6">
                {isFiltering
                  ? 'No published articles match your current inquiry.'
                  : 'This publication only presents original articles composed by registered authors and curators.'}
              </p>

              {isAdmin ? (
                <Link
                  to="/admin/new"
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-tight shadow-md shadow-blue-900/30 transition-all"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Write the First Article</span>
                </Link>
              ) : isFiltering ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-1.5 text-xs font-semibold text-blue-400 hover:underline"
                >
                  Clear search filters
                </button>
              ) : (
                <div className="text-xs text-gray-500 font-serif italic">
                  Sign in or subscribe above to be notified as soon as new pieces are published.
                </div>
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

        {/* Sidebar Column */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Search Card */}
          <div className="bg-[#0D0E15] p-4 rounded-xl border border-gray-800 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search archive..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-800 bg-[#12141D] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>
          </div>

          {/* About Publication Card */}
          <div className="bg-[#0D0E15] p-6 rounded-2xl border border-gray-800 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-white mb-2">
              About Canvas & Prose
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
              A private digital publication dedicated to genuine critical essays on visual arts, exhibitions, and creative craft written by contributors.
            </p>
            <div className="pt-3 border-t border-gray-800 text-xs text-gray-500 flex items-center justify-between">
              <span>Articles</span>
              <span className="font-semibold text-blue-400">{posts.length} published</span>
            </div>
          </div>

          {/* Active Themes / Tags */}
          {allTags.length > 0 && (
            <div className="bg-[#0D0E15] p-6 rounded-2xl border border-gray-800 shadow-sm">
              <h3 className="font-serif font-bold text-base text-white mb-3">
                Themes & Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <TagBadge key={tag} tag={tag} active={currentTag === tag} />
                ))}
              </div>
            </div>
          )}

          {/* Curator Action or Membership invitation */}
          {isAdmin ? (
            <div className="p-6 rounded-2xl bg-[#0D0E15] border border-blue-900/50 text-center">
              <h4 className="font-serif font-bold text-sm text-white mb-1">
                Curator Publishing
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                You are signed in as a curator. You can compose and publish original articles at any time.
              </p>
              <Link
                to="/admin/new"
                className="inline-block w-full py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-tight shadow-md transition-all"
              >
                Compose New Essay
              </Link>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#0D0E15] border border-gray-800 text-center">
              <Mail className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <h4 className="font-serif font-bold text-sm text-white mb-1">
                Newsletter
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Receive new writings as soon as authors release them.
              </p>
              <Link
                to="/register"
                className="inline-block w-full py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-tight shadow-md transition-all"
              >
                Subscribe Free
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
